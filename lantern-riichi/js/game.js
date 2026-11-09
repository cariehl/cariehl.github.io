// The game: one table of four, hand after hand, under four-player ranked rules.
// No DOM here; it runs the same in the browser and under Node.
//
// Seats are 0-3 and never move; the dealer moves round the table. Each seat has an
// agent with two (possibly async) methods:
//   decideTurn(game, seat, opts)               -> { type: 'discard', tile, riichi? } | { type: 'tsumo' }
//                                                 | { type: 'ankan', t } | { type: 'kakan', t } | { type: 'kyuushu' }
//   decideReaction(game, seat, tile, from, opts) -> { type: 'ron' | 'pon' | 'minkan' | 'pass' } | { type: 'chi', combo }
// hooks.event(type, data, game) is awaited after everything that happens, so a UI can animate.

import { typeOf, counts, isYaochu, isWind, isDragon, YAOCHU, WIND_NAMES } from './tiles.js';
import { shanten, waitsOf } from './shanten.js';
import { scoreWin, payment } from './score.js';

export const RULES = {
  startPoints: 25000,
  returnPoints: 30000, // a player must reach this to end the game after the last round
  uma: [15, 5, -5, -15],
  oka: 20, // (30000 - 25000) * 4 / 1000, to first place
};

export function mulberry32(seed) {
  let a = seed >>> 0;
  const f = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  f.state = () => a;
  return f;
}

export function roundName(round) {
  const wind = ['East', 'South', 'West', 'North'][Math.floor(round / 4) % 4];
  return `${wind} ${(round % 4) + 1}`;
}

const meldRecord = (m) => ({ kind: m.kind, tiles: m.tiles.slice(), called: m.called, added: m.added, rel: m.rel });

export class Game {
  constructor({ agents, length = 'south', seed = Date.now(), hooks = {}, resume = null }) {
    this.agents = agents;
    this.hooks = hooks;
    this.length = length;
    this.lastRound = length === 'east' ? 3 : 7;
    if (resume) {
      Object.assign(this, structuredClone(resume));
      this.rng = mulberry32(resume.rngState);
    } else {
      this.rng = mulberry32(seed);
      this.seed = seed;
      this.scores = [RULES.startPoints, RULES.startPoints, RULES.startPoints, RULES.startPoints];
      this.round = 0;
      this.honba = 0;
      this.sticks = 0;
      this.firstDealer = Math.floor(this.rng() * 4);
      this.dealer = this.firstDealer;
      this.log = [];
      this.handNo = 0;
    }
    this.over = false;
    this.h = null;
  }

  // What a save needs to restart the current hand from its beginning.
  snapshot() {
    const { seed, scores, round, honba, sticks, firstDealer, dealer, log, handNo, length } = this;
    return structuredClone({ seed, scores, round, honba, sticks, firstDealer, dealer, log, handNo, length, rngState: this.rng.state() });
  }

  async emit(type, data = {}) {
    if (this.hooks.event) await this.hooks.event(type, data, this);
  }

  seatWind(seat) { return (seat - this.dealer + 4) % 4; }
  get roundWind() { return Math.floor(this.round / 4) % 4; }
  get isAllLast() { return this.round >= this.lastRound; }

  async run() {
    while (!this.over) await this.playHand();
    return this.result;
  }

  // ---------------------------------------------------------------- one hand

  async playHand() {
    this.handStartSnapshot = this.snapshot();
    const tiles = Array.from({ length: 136 }, (_, i) => i);
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(this.rng() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
    const dead = tiles.splice(tiles.length - 14, 14);
    const H = (this.h = {
      wall: tiles,
      doraInd: dead.slice(0, 5),
      uraInd: dead.slice(5, 10),
      rinshan: dead.slice(10, 14),
      doraShown: 1,
      pendingDora: 0,
      kans: 0,
      kanSeats: [],
      uninterrupted: true,
      discardsMade: 0,
      discardLog: [],
      firstWinds: [],
      players: [0, 1, 2, 3].map(() => ({
        hand: [], melds: [], discards: [], riichi: false, doubleRiichi: false, ippatsu: false,
        pendingRiichi: false, furitenTemp: false, furitenRiichi: false, nagashi: true, pao: {}, riichiIndex: -1,
      })),
      lastDraw: null,
    });
    for (let r = 0; r < 13; r++) for (let k = 0; k < 4; k++) H.players[(this.dealer + k) % 4].hand.push(H.wall.shift());
    for (const p of H.players) p.hand.sort((a, b) => a - b);
    await this.emit('handStart', { round: this.round, honba: this.honba, sticks: this.sticks, dealer: this.dealer });

    let seat = this.dealer;
    let mode = 'draw'; // draw | rinshan | call (discard without drawing)
    for (;;) {
      const p = H.players[seat];
      let drawn = null;
      let rinshan = false;
      if (mode === 'draw') {
        if (!H.wall.length) return this.exhaustiveDraw();
        drawn = H.wall.shift();
      } else if (mode === 'rinshan') {
        drawn = H.rinshan.shift();
        H.wall.pop(); // the dead wall stays at 14 tiles
        rinshan = true;
      }
      if (drawn !== null) {
        p.hand.push(drawn);
        H.lastDraw = { seat, tile: drawn, rinshan };
        await this.emit('draw', { seat, tile: drawn, rinshan });
      }

      const opts = this.turnOptions(seat, drawn, rinshan, mode === 'call');
      let act = await this.agents[seat].decideTurn(this, seat, opts);
      act = this.validateTurn(act, opts);

      if (act.type === 'tsumo') {
        return this.settleWins([{ seat, from: null, tile: drawn, result: opts.tsumoResult }]);
      }
      if (act.type === 'kyuushu') return this.abort('Nine different terminals and honors');
      if (act.type === 'ankan' || act.type === 'kakan') {
        const robbed = await this.doKan(seat, act.type, act.t);
        if (robbed) return robbed;
        mode = 'rinshan';
        continue;
      }

      // discard
      const tile = act.tile;
      p.hand.splice(p.hand.indexOf(tile), 1);
      p.hand.sort((a, b) => a - b);
      if (p.riichi) p.ippatsu = false;
      p.furitenTemp = false;
      const declaring = !!act.riichi && opts.riichi.includes(tile);
      const tsumogiri = tile === drawn;
      p.discards.push({ id: tile, tsumogiri, riichi: declaring, called: false });
      if (!isYaochu(typeOf(tile))) p.nagashi = false;
      if (declaring) {
        p.pendingRiichi = true;
        p.doubleRiichi = H.uninterrupted && p.discards.length === 1;
        p.riichiIndex = p.discards.length - 1;
      }
      H.discardsMade++;
      H.discardLog.push(typeOf(tile));
      if (H.discardsMade <= 4) H.firstWinds.push(typeOf(tile));
      await this.emit('discard', { seat, tile, tsumogiri, riichi: declaring });
      if (H.pendingDora) await this.revealDora(H.pendingDora);
      H.pendingDora = 0;

      const res = await this.reactions(seat, tile, {});
      if (res.rons.length) {
        if (res.rons.length === 3) return this.abort('Triple ron');
        return this.settleWins(res.rons);
      }
      if (declaring) {
        p.pendingRiichi = false;
        p.riichi = true;
        p.ippatsu = true;
        p.riichiLogIndex = H.discardLog.length;
        this.scores[seat] -= 1000;
        this.sticks++;
        await this.emit('riichi', { seat });
        if (H.players.every((q) => q.riichi)) return this.abort('Four riichi');
      }
      if (H.uninterrupted && H.discardsMade === 4 && !res.call && H.firstWinds.every((t) => isWind(t) && t === H.firstWinds[0])) {
        return this.abort('Four of the same wind');
      }
      if (H.kans === 4 && new Set(H.kanSeats).size > 1 && !res.call) return this.abort('Four kans');

      if (res.call) {
        seat = res.call.seat;
        await this.doCall(res.call, seat, tile, (res.call.from - seat + 4) % 4);
        mode = res.call.type === 'minkan' ? 'rinshan' : 'call';
        continue;
      }
      if (!H.wall.length) return this.exhaustiveDraw();
      seat = (seat + 1) % 4;
      mode = 'draw';
    }
  }

  // ---------------------------------------------------------------- options

  winFlags(seat, extra) {
    const H = this.h, p = H.players[seat];
    return {
      melds: p.melds.map((m) => ({ kind: m.kind, tiles: m.tiles })),
      seatWind: this.seatWind(seat),
      roundWind: this.roundWind,
      dealer: seat === this.dealer,
      riichi: p.riichi,
      doubleRiichi: p.doubleRiichi,
      ippatsu: p.ippatsu,
      dora: H.doraInd.slice(0, H.doraShown).map(typeOf),
      ura: H.uraInd.slice(0, H.doraShown).map(typeOf),
      ...extra,
    };
  }

  waits(seat) {
    const p = this.h.players[seat];
    return waitsOf(counts(p.hand), p.melds.length);
  }

  isFuriten(seat) {
    const p = this.h.players[seat];
    if (p.furitenTemp || p.furitenRiichi) return true;
    const w = this.waits(seat);
    return p.discards.some((d) => w.includes(typeOf(d.id)));
  }

  turnOptions(seat, drawn, rinshan, afterCall) {
    const H = this.h, p = H.players[seat];
    const c = counts(p.hand);
    const opts = { drawn, rinshan, afterCall, canTsumo: false, ankan: [], kakan: [], riichi: [], kyuushu: false, discards: [] };
    const first = H.uninterrupted && p.discards.length === 0;
    if (drawn !== null && shanten(c, p.melds.length) === -1) {
      const r = scoreWin({
        hand: p.hand, winTile: drawn, tsumo: true,
        ...this.winFlags(seat, {
          haitei: !H.wall.length && !rinshan, rinshan,
          tenhou: first && seat === this.dealer, chiihou: first && seat !== this.dealer,
        }),
      });
      if (r) { opts.canTsumo = true; opts.tsumoResult = r; }
    }
    if (drawn !== null && H.wall.length > 0 && H.kans < 4) {
      if (p.riichi) {
        const t = typeOf(drawn);
        if (c[t] === 4) {
          const before = c.slice(); before[t]--;
          const after = c.slice(); after[t] = 0;
          const w1 = waitsOf(before, p.melds.length), w2 = waitsOf(after, p.melds.length + 1);
          if (w1.length && w1.join() === w2.join()) opts.ankan.push(t);
        }
      } else {
        for (let t = 0; t < 34; t++) if (c[t] === 4) opts.ankan.push(t);
        for (const m of p.melds) if (m.kind === 'pon' && c[typeOf(m.tiles[0])]) opts.kakan.push(typeOf(m.tiles[0]));
      }
    }
    if (first && drawn !== null && YAOCHU.filter((t) => c[t]).length >= 9) opts.kyuushu = true;

    if (p.riichi) opts.discards = [drawn];
    else {
      let forbidden = new Set();
      if (afterCall) forbidden = this.h.kuikae || new Set();
      opts.discards = p.hand.filter((id) => !forbidden.has(typeOf(id)));
      const closed = p.melds.every((m) => m.kind === 'ankan');
      if (closed && drawn !== null && this.scores[seat] >= 1000 && H.wall.length >= 4) {
        const seen = new Set();
        for (const id of p.hand) {
          const t = typeOf(id);
          if (seen.has(t)) { if (opts.riichi.some((x) => typeOf(x) === t)) opts.riichi.push(id); continue; }
          seen.add(t);
          c[t]--;
          if (shanten(c, p.melds.length) === 0 && waitsOf(c, p.melds.length).length) opts.riichi.push(id);
          c[t]++;
        }
      }
    }
    return opts;
  }

  validateTurn(act, opts) {
    const fallback = { type: 'discard', tile: opts.discards.includes(opts.drawn) ? opts.drawn : opts.discards[opts.discards.length - 1] };
    if (!act || typeof act !== 'object') return fallback;
    if (act.type === 'tsumo') return opts.canTsumo ? act : fallback;
    if (act.type === 'kyuushu') return opts.kyuushu ? act : fallback;
    if (act.type === 'ankan') return opts.ankan.includes(act.t) ? act : fallback;
    if (act.type === 'kakan') return opts.kakan.includes(act.t) ? act : fallback;
    if (act.type === 'discard' && opts.discards.includes(act.tile)) {
      if (act.riichi && !opts.riichi.includes(act.tile)) return { type: 'discard', tile: act.tile };
      return act;
    }
    return fallback;
  }

  reactionOptions(o, tile, from, { chankan = false, ankan = false } = {}) {
    const H = this.h, q = H.players[o];
    const t = typeOf(tile);
    const opts = { ron: false, pon: null, minkan: null, chi: [], ronResult: null, completes: false };
    const c = counts(q.hand);
    c[t]++;
    if (shanten(c, q.melds.length) === -1) {
      opts.completes = true;
      if (!this.isFuriten(o)) {
        const r = scoreWin({
          hand: q.hand.concat(tile), winTile: tile, tsumo: false,
          ...this.winFlags(o, { houtei: !H.wall.length && !chankan, chankan }),
        });
        if (r && (!ankan || r.yaku.some((y) => y.name.startsWith('Thirteen Orphans')))) { opts.ron = true; opts.ronResult = r; }
      }
    }
    c[t]--;
    if (chankan || ankan || q.riichi || !H.wall.length) return opts;
    const ids = (type, n) => q.hand.filter((id) => typeOf(id) === type).slice(0, n);
    if (c[t] >= 2) {
      const combo = ids(t, 2);
      if (this.hasLegalDiscard(q.hand, combo, new Set([t]))) opts.pon = combo;
    }
    if (c[t] >= 3 && H.kans < 4) opts.minkan = ids(t, 3);
    if (o === (from + 1) % 4 && t < 27) {
      const n = t % 9;
      const pats = [[-2, -1], [-1, 1], [1, 2]];
      for (const [a, b] of pats) {
        if (n + a < 0 || n + b > 8) continue;
        if (!c[t + a] || !c[t + b]) continue;
        const combo = [ids(t + a, 1)[0], ids(t + b, 1)[0]];
        const forbid = new Set([t]);
        if (a === 1 && n + 3 <= 8) forbid.add(t + 3);
        if (b === -1 && n - 3 >= 0) forbid.add(t - 3);
        if (this.hasLegalDiscard(q.hand, combo, forbid)) opts.chi.push(combo);
      }
    }
    return opts;
  }

  hasLegalDiscard(hand, combo, forbid) {
    const rest = hand.slice();
    for (const id of combo) rest.splice(rest.indexOf(id), 1);
    return rest.some((id) => !forbid.has(typeOf(id)));
  }

  // Ask the other three what they do with a tile. Returns { rons: [...], call }.
  async reactions(from, tile, flags) {
    const H = this.h;
    const asks = [];
    for (let k = 1; k < 4; k++) {
      const o = (from + k) % 4;
      const opts = this.reactionOptions(o, tile, from, flags);
      opts.chankan = !!(flags.chankan || flags.ankan);
      if (opts.ron || opts.pon || opts.minkan || opts.chi.length) asks.push({ seat: o, opts });
      else if (opts.completes) this.missedWin(o);
    }
    if (!asks.length) return { rons: [], call: null };
    const answers = await Promise.all(asks.map(({ seat, opts }) => Promise.resolve(this.agents[seat].decideReaction(this, seat, tile, from, opts))));
    const rons = [];
    let call = null;
    asks.forEach(({ seat, opts }, i) => {
      const a = answers[i] || { type: 'pass' };
      if (a.type === 'ron' && opts.ron) {
        rons.push({ seat, from, tile, result: opts.ronResult, chankan: !!flags.chankan });
        return;
      }
      if (opts.completes) this.missedWin(seat);
      const rank = { minkan: 2, pon: 2, chi: 1 }[a.type] || 0;
      if (!rank) return;
      let c2 = null;
      if (a.type === 'pon' && opts.pon) c2 = { seat, type: 'pon', combo: opts.pon };
      if (a.type === 'minkan' && opts.minkan) c2 = { seat, type: 'minkan', combo: opts.minkan };
      if (a.type === 'chi' && opts.chi.length) {
        const pick = opts.chi.find((cb) => a.combo && cb.map(typeOf).join() === a.combo.map(typeOf).join()) || opts.chi[0];
        c2 = { seat, type: 'chi', combo: pick };
      }
      if (c2 && (!call || rank > ({ minkan: 2, pon: 2, chi: 1 }[call.type]))) call = { ...c2, from };
    });
    if (rons.length) return { rons, call: null };
    return { rons, call };
  }

  missedWin(seat) {
    const p = this.h.players[seat];
    p.furitenTemp = true;
    if (p.riichi) p.furitenRiichi = true;
  }

  async doCall(call, seat, tile, rel) {
    const H = this.h, q = H.players[seat], from = H.players[call.from];
    for (const id of call.combo) q.hand.splice(q.hand.indexOf(id), 1);
    from.discards[from.discards.length - 1].called = true;
    from.nagashi = false;
    const t = typeOf(tile);
    const meld = { kind: call.type, tiles: [...call.combo, tile].sort((a, b) => a - b), called: tile, from: call.from, rel };
    q.melds.push(meld);
    H.uninterrupted = false;
    for (const p of H.players) p.ippatsu = false;
    // kuikae: no swapping the called tile straight back
    const kk = new Set([t]);
    if (call.type === 'chi') {
      const lo = Math.min(...call.combo.map(typeOf));
      const n = t % 9;
      if (lo === t + 1 && n + 3 <= 8) kk.add(t + 3);
      if (lo === t - 2 && n - 3 >= 0) kk.add(t - 3);
    }
    H.kuikae = kk;
    // liability for big three dragons / big four winds
    if (call.type !== 'chi') {
      const trips = q.melds.filter((m) => m.kind !== 'chi').map((m) => typeOf(m.tiles[0]));
      if (isDragon(t) && trips.filter(isDragon).length === 3) q.pao.dragons = call.from;
      if (isWind(t) && trips.filter(isWind).length === 4) q.pao.winds = call.from;
    }
    if (call.type === 'minkan') {
      H.kans++;
      H.kanSeats.push(seat);
      H.pendingDora++;
    }
    await this.emit('call', { seat, type: call.type, meld, from: call.from });
  }

  // Closed kan or added kan. Returns a settled hand if someone robs it.
  async doKan(seat, kind, t) {
    const H = this.h, p = H.players[seat];
    H.uninterrupted = false;
    for (const q of H.players) q.ippatsu = false;
    let meld;
    let robTile = null;
    if (kind === 'ankan') {
      const ids = p.hand.filter((id) => typeOf(id) === t);
      for (const id of ids) p.hand.splice(p.hand.indexOf(id), 1);
      meld = { kind: 'ankan', tiles: ids, from: seat, rel: 0 };
      p.melds.push(meld);
      robTile = ids[0];
    } else {
      const id = p.hand.find((x) => typeOf(x) === t);
      p.hand.splice(p.hand.indexOf(id), 1);
      meld = p.melds.find((m) => m.kind === 'pon' && typeOf(m.tiles[0]) === t);
      meld.kind = 'kakan';
      meld.added = id;
      meld.tiles = meld.tiles.concat(id).sort((a, b) => a - b);
      robTile = id;
    }
    H.kans++;
    H.kanSeats.push(seat);
    await this.emit('kan', { seat, kind, meld });
    const res = await this.reactions(seat, robTile, kind === 'ankan' ? { ankan: true } : { chankan: true });
    if (res.rons.length) {
      if (res.rons.length === 3) return this.abort('Triple ron');
      return this.settleWins(res.rons);
    }
    if (kind === 'ankan') await this.revealDora(1);
    else H.pendingDora++;
    return null;
  }

  async revealDora(n) {
    const H = this.h;
    for (let i = 0; i < n && H.doraShown < 5; i++) {
      H.doraShown++;
      await this.emit('dora', { indicator: H.doraInd[H.doraShown - 1] });
    }
  }

  // ---------------------------------------------------------------- endings

  async settleWins(wins) {
    const H = this.h;
    if (H.pendingDora) { H.doraShown = Math.min(5, H.doraShown + H.pendingDora); H.pendingDora = 0; }
    const deltas = [0, 0, 0, 0];
    const entries = [];
    // ura and new dora may change the score: recompute with the final indicators
    wins.forEach((w, i) => {
      const p = H.players[w.seat];
      const tsumo = w.from === null;
      const hand = tsumo ? p.hand.slice() : p.hand.concat(w.tile);
      const first = H.uninterrupted && p.discards.length === 0;
      const extra = tsumo
        ? { haitei: !H.wall.length && !H.lastDraw.rinshan, rinshan: H.lastDraw.rinshan, tenhou: first && w.seat === this.dealer, chiihou: first && w.seat !== this.dealer }
        : { houtei: !H.wall.length && !w.chankan, chankan: !!w.chankan };
      const r = scoreWin({ hand, winTile: w.tile, tsumo, ...this.winFlags(w.seat, extra) }) || w.result;
      const dealer = w.seat === this.dealer;
      const honba = i === 0 ? this.honba : 0;
      const pao = !r.yakuman ? undefined : r.yaku.some((y) => y.name === 'Big Three Dragons') ? p.pao.dragons : r.yaku.some((y) => y.name === 'Big Four Winds') ? p.pao.winds : undefined;
      let gained = 0;
      if (tsumo) {
        const pay = payment(r.base, dealer, true, honba);
        for (let s = 0; s < 4; s++) {
          if (s === w.seat) continue;
          const amt = dealer || s === this.dealer ? (dealer ? pay.fromOthers : pay.fromDealer) : pay.fromOthers;
          const payer = pao !== undefined ? pao : s;
          deltas[payer] -= amt;
          gained += amt;
        }
      } else {
        const amt = payment(r.base, dealer, false, honba).ron;
        if (pao !== undefined && pao !== w.from) {
          const half = Math.ceil(amt / 2 / 100) * 100;
          deltas[pao] -= half;
          deltas[w.from] -= amt - half;
        } else deltas[w.from] -= amt;
        gained = amt;
      }
      if (i === 0 && this.sticks) { gained += this.sticks * 1000; this.sticks = 0; }
      deltas[w.seat] += gained;
      entries.push({
        seat: w.seat, from: w.from, tile: w.tile, han: r.han, fu: r.fu, yakuman: r.yakuman, limit: r.limit,
        yaku: r.yaku, points: gained, pao: pao !== undefined ? pao : null,
        hand: (tsumo ? hand.filter((id) => id !== w.tile) : p.hand.slice()).sort((a, b) => a - b), melds: p.melds.map(meldRecord),
        riichi: p.riichi, ura: p.riichi ? H.uraInd.slice(0, H.doraShown) : [],
      });
    });
    for (let s = 0; s < 4; s++) this.scores[s] += deltas[s];
    const dealerWon = wins.some((w) => w.seat === this.dealer);
    const record = {
      round: this.round, honba: this.honba, dealer: this.dealer, kind: wins[0].from === null ? 'tsumo' : 'ron',
      wins: entries, deltas, scores: this.scores.slice(), dora: H.doraInd.slice(0, H.doraShown),
    };
    return this.finishHand(record, dealerWon, !dealerWon);
  }

  tenpaiSeats() {
    return [0, 1, 2, 3].filter((s) => {
      const p = this.h.players[s];
      const c = counts(p.hand);
      return shanten(c, p.melds.length) === 0 && waitsOf(c, p.melds.length).length > 0;
    });
  }

  async exhaustiveDraw() {
    const H = this.h;
    const tenpai = this.tenpaiSeats();
    const deltas = [0, 0, 0, 0];
    const nagashi = [0, 1, 2, 3].filter((s) => {
      const p = H.players[s];
      return p.nagashi && p.discards.length && p.discards.every((d) => isYaochu(typeOf(d.id)) && !d.called);
    });
    if (nagashi.length) {
      for (const s of nagashi) {
        const dealer = s === this.dealer;
        const pay = payment(2000, dealer, true, 0);
        for (let o = 0; o < 4; o++) {
          if (o === s) continue;
          const amt = dealer ? pay.fromOthers : o === this.dealer ? pay.fromDealer : pay.fromOthers;
          deltas[o] -= amt;
          deltas[s] += amt;
        }
      }
    } else if (tenpai.length && tenpai.length < 4) {
      const gain = 3000 / tenpai.length, loss = 3000 / (4 - tenpai.length);
      for (let s = 0; s < 4; s++) deltas[s] = tenpai.includes(s) ? gain : -loss;
    }
    for (let s = 0; s < 4; s++) this.scores[s] += deltas[s];
    const record = {
      round: this.round, honba: this.honba, dealer: this.dealer, kind: 'draw', tenpai, nagashi, deltas, scores: this.scores.slice(),
      hands: tenpai.map((s) => ({ seat: s, hand: H.players[s].hand.slice(), melds: H.players[s].melds.map(meldRecord), waits: this.waits(s) })),
    };
    return this.finishHand(record, tenpai.includes(this.dealer), false);
  }

  async abort(reason) {
    const record = { round: this.round, honba: this.honba, dealer: this.dealer, kind: 'abort', reason, deltas: [0, 0, 0, 0], scores: this.scores.slice() };
    return this.finishHand(record, true, false);
  }

  ranking() {
    const order = [0, 1, 2, 3].sort((a, b) => this.scores[b] - this.scores[a] || ((a - this.firstDealer + 4) % 4) - ((b - this.firstDealer + 4) % 4));
    return order;
  }

  async finishHand(record, dealerContinues, nonDealerWon) {
    const P = this.h ? this.h.players : [];
    record.riichi = [0, 1, 2, 3].filter((s) => P[s] && P[s].riichi);
    record.open = [0, 1, 2, 3].filter((s) => P[s] && P[s].melds.some((m) => m.kind !== 'ankan'));
    this.log.push(record);
    this.handNo++;
    const wasDealer = this.dealer;
    const honba = nonDealerWon ? 0 : this.honba + 1;
    const dealer = dealerContinues ? this.dealer : (this.dealer + 1) % 4;
    const round = dealerContinues ? this.round : this.round + 1;

    // does the game end?
    let end = false;
    if (this.scores.some((s) => s < 0)) end = true;
    else if (round > this.lastRound + 4) end = true; // the extra round is over too
    else if (round > this.lastRound) {
      if (Math.max(...this.scores) >= RULES.returnPoints) end = true;
    } else if (round === this.lastRound && dealerContinues && record.kind !== 'abort') {
      // all-last: a dealer who wins or is ready while in first place, on 30000 or more, stops
      const top = this.ranking()[0];
      if (top === wasDealer && this.scores[wasDealer] >= RULES.returnPoints) end = true;
    }
    record.last = end;
    await this.emit('handEnd', record);
    Object.assign(this, { honba, dealer, round });
    if (end) await this.endGame();
  }

  async endGame() {
    const order = this.ranking();
    if (this.sticks) { this.scores[order[0]] += this.sticks * 1000; this.sticks = 0; }
    const final = [0, 1, 2, 3].map((s) => {
      const place = order.indexOf(s);
      const pts = (this.scores[s] - RULES.returnPoints) / 1000 + RULES.uma[place] + (place === 0 ? RULES.oka : 0);
      return { seat: s, score: this.scores[s], place: place + 1, points: Math.round(pts * 10) / 10 };
    });
    this.over = true;
    this.result = { final, order, log: this.log, length: this.length, firstDealer: this.firstDealer };
    await this.emit('gameEnd', this.result);
  }
}

export { WIND_NAMES };
