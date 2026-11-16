// American mahjong: one table of four playing hands against a card. No DOM here.
//
// Seats are 0-3 and never move; the deal (East) passes to the right after every hand.
// Each seat has an agent with these (possibly async) methods:
//   decideCharleston(game, seat, { count, dir, stage })  -> array of `count` tile ids to pass
//   decideVote(game, seat)                                -> true to play the second Charleston
//   decideCourtesy(game, seat)                            -> 0..3 tiles to offer across
//   decideTurn(game, seat, opts)       -> { type: 'discard', tile } | { type: 'mahjong' }
//                                         | { type: 'swap', owner, idx, tile }
//   decideReaction(game, seat, tile, from, opts) -> { type: 'mahjong' } | { type: 'call', n } | { type: 'pass' }
// hooks.event(type, data, game) is awaited after everything that happens.

import { amType, amCounts, isJoker, JOKER, TILE_COUNT } from './tiles.js';
import { compileCard, bestWin, exposuresFit } from './hands.js';
import { cardById } from './card.js';
import { mulberry32 } from '../game.js';

export const AM_RULES = {
  hands: { east: 4, south: 8 }, // short game: everyone deals once; long game: twice
  pointsPer: 5, // final points (for coins and history) = score / pointsPer
};

const DIRS = { 1: 'right', 2: 'across', 3: 'left' };
const exposureRecord = (e) => ({ t: e.t, n: e.n, tiles: e.tiles.slice(), called: e.called, from: e.from });

export class AmericanGame {
  constructor({ agents, length = 'south', seed = Date.now(), hooks = {}, resume = null, cardId }) {
    this.mode = 'american';
    this.agents = agents;
    this.hooks = hooks;
    this.length = length;
    this.totalHands = AM_RULES.hands[length] || 8;
    if (resume) {
      Object.assign(this, structuredClone(resume));
      this.rng = mulberry32(resume.rngState);
    } else {
      this.rng = mulberry32(seed);
      this.seed = seed;
      this.cardId = cardById(cardId).id;
      this.scores = [0, 0, 0, 0];
      this.firstDealer = Math.floor(this.rng() * 4);
      this.handNo = 0;
      this.log = [];
    }
    this.card = cardById(this.cardId);
    this.cc = compileCard(this.card);
    this.over = false;
    this.h = null;
  }

  snapshot() {
    const { seed, cardId, scores, firstDealer, handNo, log, length } = this;
    return structuredClone({ mode: 'american', seed, cardId, scores, firstDealer, handNo, log, length, rngState: this.rng.state() });
  }

  async emit(type, data = {}) {
    if (this.hooks.event) await this.hooks.event(type, data, this);
  }

  get dealer() { return (this.firstDealer + this.handNo) % 4; }
  seatWind(seat) { return (seat - this.dealer + 4) % 4; }
  handName() { return `Hand ${this.handNo + 1} of ${this.totalHands}`; }

  async run() {
    while (!this.over) await this.playHand();
    return this.result;
  }

  // ---------------------------------------------------------------- one hand

  async playHand() {
    this.handStartSnapshot = this.snapshot();
    const tiles = Array.from({ length: TILE_COUNT }, (_, i) => i);
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(this.rng() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
    const H = (this.h = {
      wall: tiles,
      phase: 'charleston',
      players: [0, 1, 2, 3].map(() => ({ hand: [], exposures: [], discards: [] })),
      lastDraw: null,
      charleston: null,
    });
    for (let r = 0; r < 13; r++) for (let k = 0; k < 4; k++) H.players[(this.dealer + k) % 4].hand.push(H.wall.shift());
    H.players[this.dealer].hand.push(H.wall.shift());
    await this.emit('handStart', { handNo: this.handNo, dealer: this.dealer });

    await this.charleston();
    H.phase = 'play';
    await this.emit('playStart', {});

    let seat = this.dealer;
    let mode = 'first'; // first (East's opening discard) | draw | call
    for (;;) {
      const p = H.players[seat];
      let drawn = null;
      if (mode === 'draw') {
        if (!H.wall.length) return this.wallGame();
        drawn = H.wall.shift();
        p.hand.push(drawn);
        H.lastDraw = { seat, tile: drawn };
        await this.emit('draw', { seat, tile: drawn });
      }
      let act;
      for (;;) {
        const opts = this.turnOptions(seat, drawn, mode === 'call');
        act = this.validateTurn(await this.agents[seat].decideTurn(this, seat, opts), opts);
        if (act.type !== 'swap') break;
        await this.doSwap(seat, act);
      }
      if (act.type === 'mahjong') {
        return this.settle({ seat, from: null, tile: drawn, win: this.turnOptions(seat, drawn, false).win });
      }
      const tile = act.tile;
      p.hand.splice(p.hand.indexOf(tile), 1);
      p.discards.push({ id: tile, called: false });
      await this.emit('discard', { seat, tile });

      const res = await this.reactions(seat, tile);
      if (res.mahjong) return this.settle(res.mahjong);
      if (res.call) {
        await this.doCall(res.call, tile);
        seat = res.call.seat;
        mode = 'call';
        continue;
      }
      if (!H.wall.length) return this.wallGame();
      seat = (seat + 1) % 4;
      mode = 'draw';
    }
  }

  // ---------------------------------------------------------------- the Charleston

  async collectPasses(dir, stage, counts) {
    const H = this.h;
    H.charleston = { stage, dir };
    const picks = await Promise.all([0, 1, 2, 3].map((s) => (counts[s]
      ? Promise.resolve(this.agents[s].decideCharleston(this, s, { count: counts[s], dir, stage }))
      : [])));
    const out = picks.map((pick, s) => this.validPass(s, pick, counts[s]));
    for (let s = 0; s < 4; s++) for (const id of out[s]) H.players[s].hand.splice(H.players[s].hand.indexOf(id), 1);
    for (let s = 0; s < 4; s++) H.players[(s + dir) % 4].hand.push(...out[s]);
    await this.emit('charleston', { stage, dir, passed: out, counts });
  }

  // a pass must be `count` different tiles from the hand, none of them jokers
  validPass(seat, pick, count) {
    const hand = this.h.players[seat].hand;
    const ok = Array.isArray(pick) && pick.length === count && new Set(pick).size === count && pick.every((id) => hand.includes(id) && !isJoker(id));
    if (ok) return pick.slice();
    return hand.filter((id) => !isJoker(id)).slice(-count);
  }

  async charleston() {
    const three = [3, 3, 3, 3];
    for (const dir of [1, 2, 3]) await this.collectPasses(dir, 'first', three);
    const votes = await Promise.all([0, 1, 2, 3].map((s) => Promise.resolve(this.agents[s].decideVote(this, s))));
    const second = votes.every(Boolean);
    await this.emit('vote', { votes, second });
    if (second) for (const dir of [3, 2, 1]) await this.collectPasses(dir, 'second', three);
    const offers = await Promise.all([0, 1, 2, 3].map((s) => Promise.resolve(this.agents[s].decideCourtesy(this, s))));
    const n = offers.map((o) => Math.max(0, Math.min(3, o | 0)));
    const counts = [0, 1, 2, 3].map((s) => Math.min(n[s], n[(s + 2) % 4]));
    await this.emit('courtesy', { offers: n, counts });
    if (counts.some(Boolean)) await this.collectPasses(2, 'courtesy', counts);
    this.h.charleston = null;
  }

  // ---------------------------------------------------------------- options

  exposedJokers(seat) {
    return this.h.players[seat].exposures.reduce((s, e) => s + e.tiles.filter(isJoker).length, 0);
  }

  winFor(seat, hand) {
    const p = this.h.players[seat];
    return bestWin(this.cc, amCounts(hand), p.exposures, this.exposedJokers(seat));
  }

  turnOptions(seat, drawn, afterCall) {
    const H = this.h, p = H.players[seat];
    const opts = { drawn, afterCall, canWin: false, win: null, swaps: [], discards: p.hand.slice() };
    if (!afterCall) {
      const w = this.winFor(seat, p.hand);
      if (w) { opts.canWin = true; opts.win = w; }
    }
    // a natural tile from the hand can replace a joker in anyone's exposure
    H.players.forEach((q, owner) => q.exposures.forEach((e, idx) => {
      const joker = e.tiles.find(isJoker);
      const tile = p.hand.find((id) => amType(id) === e.t);
      if (joker !== undefined && tile !== undefined) opts.swaps.push({ owner, idx, tile, joker, t: e.t });
    }));
    return opts;
  }

  validateTurn(act, opts) {
    const fallback = { type: 'discard', tile: opts.drawn !== null && opts.discards.includes(opts.drawn) ? opts.drawn : opts.discards[opts.discards.length - 1] };
    if (!act || typeof act !== 'object') return fallback;
    if (act.type === 'mahjong') return opts.canWin ? act : fallback;
    if (act.type === 'swap') {
      const s = opts.swaps.find((x) => x.owner === act.owner && x.idx === act.idx);
      return s ? { type: 'swap', ...s } : fallback;
    }
    if (act.type === 'discard' && opts.discards.includes(act.tile)) return act;
    return fallback;
  }

  async doSwap(seat, s) {
    const p = this.h.players[seat];
    const e = this.h.players[s.owner].exposures[s.idx];
    e.tiles[e.tiles.indexOf(s.joker)] = s.tile;
    p.hand[p.hand.indexOf(s.tile)] = s.joker;
    await this.emit('swap', { seat, owner: s.owner, idx: s.idx, t: e.t });
  }

  // What seat o may do with a discard: Mahjong, or expose a set of 3-6 (jokers may fill in).
  reactionOptions(o, tile) {
    const H = this.h, q = H.players[o];
    const opts = { mahjong: null, calls: [] };
    if (isJoker(tile)) return opts; // a discarded joker is dead
    opts.mahjong = this.winFor(o, q.hand.concat(tile));
    if (!H.wall.length) return opts; // the last discard can only be taken for Mahjong
    const t = amType(tile);
    const nat = q.hand.filter((id) => amType(id) === t);
    const jok = q.hand.filter(isJoker);
    for (let n = 3; n <= 6; n++) {
      if (nat.length + jok.length < n - 1 || q.hand.length - (n - 1) < 1) break;
      const exps = q.exposures.map((e) => ({ t: e.t, n: e.n })).concat({ t, n });
      if (!this.cc.targets.some((tg) => exposuresFit(tg, exps))) continue;
      const combo = nat.slice(0, n - 1);
      combo.push(...jok.slice(0, n - 1 - combo.length));
      opts.calls.push({ n, combo, naturals: Math.min(nat.length, n - 1) });
    }
    return opts;
  }

  // Ask the other three. Mahjong beats an exposure; ties go to the next player in turn.
  async reactions(from, tile) {
    const asks = [];
    for (let k = 1; k < 4; k++) {
      const o = (from + k) % 4;
      const opts = this.reactionOptions(o, tile);
      if (opts.mahjong || opts.calls.length) asks.push({ seat: o, opts });
    }
    if (!asks.length) return { mahjong: null, call: null };
    const answers = await Promise.all(asks.map(({ seat, opts }) => Promise.resolve(this.agents[seat].decideReaction(this, seat, tile, from, opts))));
    let mahjong = null, call = null;
    asks.forEach(({ seat, opts }, i) => {
      const a = answers[i] || { type: 'pass' };
      if (a.type === 'mahjong' && opts.mahjong && !mahjong) mahjong = { seat, from, tile, win: opts.mahjong };
      if (a.type === 'call' && !call) {
        const c = opts.calls.find((x) => x.n === a.n);
        if (c) call = { seat, from, n: c.n, combo: c.combo };
      }
    });
    return mahjong ? { mahjong, call: null } : { mahjong: null, call };
  }

  async doCall(call, tile) {
    const H = this.h, q = H.players[call.seat];
    for (const id of call.combo) q.hand.splice(q.hand.indexOf(id), 1);
    const from = H.players[call.from];
    from.discards[from.discards.length - 1].called = true;
    const exposure = { t: amType(tile), n: call.n, tiles: [...call.combo, tile], called: tile, from: call.from };
    q.exposures.push(exposure);
    await this.emit('call', { seat: call.seat, from: call.from, exposure });
  }

  // ---------------------------------------------------------------- endings

  async settle({ seat, from, tile, win }) {
    const H = this.h, p = H.players[seat];
    const deltas = [0, 0, 0, 0];
    const v = win.value;
    for (let s = 0; s < 4; s++) {
      if (s === seat) continue;
      const pay = from === null || s === from ? 2 * v : v;
      deltas[s] -= pay;
      deltas[seat] += pay;
    }
    for (let s = 0; s < 4; s++) this.scores[s] += deltas[s];
    const hand = (from === null ? p.hand.filter((id) => id !== tile) : p.hand.slice()).sort((a, b) => amType(a) - amType(b) || a - b);
    const entry = {
      seat, from, tile, value: v, base: win.base, jokerless: win.jokerless,
      handId: win.hand.id, handText: win.hand.text, section: win.hand.section, concealed: !!win.hand.concealed,
      hand, exposures: p.exposures.map(exposureRecord), points: deltas[seat],
      units: win.target.units,
    };
    const record = { handNo: this.handNo, dealer: this.dealer, kind: 'mahjong', wins: [entry], deltas, scores: this.scores.slice() };
    return this.finishHand(record);
  }

  async wallGame() {
    const record = { handNo: this.handNo, dealer: this.dealer, kind: 'wall', wins: [], deltas: [0, 0, 0, 0], scores: this.scores.slice() };
    return this.finishHand(record);
  }

  ranking() {
    return [0, 1, 2, 3].sort((a, b) => this.scores[b] - this.scores[a] || ((a - this.firstDealer + 4) % 4) - ((b - this.firstDealer + 4) % 4));
  }

  async finishHand(record) {
    const P = this.h.players;
    record.open = [0, 1, 2, 3].filter((s) => P[s].exposures.length);
    this.log.push(record);
    this.handNo++;
    record.last = this.handNo >= this.totalHands;
    await this.emit('handEnd', record);
    if (record.last) await this.endGame();
  }

  async endGame() {
    const order = this.ranking();
    const final = [0, 1, 2, 3].map((s) => ({ seat: s, score: this.scores[s], place: order.indexOf(s) + 1, points: Math.round((this.scores[s] / AM_RULES.pointsPer) * 10) / 10 }));
    this.over = true;
    this.result = { final, order, log: this.log, length: this.length, firstDealer: this.firstDealer, mode: 'american', cardId: this.cardId };
    await this.emit('gameEnd', this.result);
  }
}

export { DIRS, JOKER };
