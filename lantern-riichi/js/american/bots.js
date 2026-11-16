// Bots for American mahjong. They share the personalities of the riichi bots (../bots.js)
// and read the same weights: call (how readily they expose), defense (how hard they avoid
// feeding a hand that looks close), value (how much they chase the big hands) and closed
// (never expose).
//
// The engine scores a hand by summing, over every target on the card that its exposures
// still allow, exp(-K x tiles missing), weighted by the hand's value. So early on it keeps
// tiles that serve many hands, and as one hand gets close that hand takes over.

import { amType, amCounts, isJoker, JOKER, FLOWER, NTYPES } from './tiles.js';
import { missing, exposuresFit } from './hands.js';

const K = 1.5;
const avail = (t) => (t === FLOWER || t === JOKER ? 8 : 4);

// Tiles the bot can't get any more: every copy it can see outside its own hand.
function remaining(game, seat) {
  const H = game.h;
  const rem = new Array(NTYPES);
  for (let t = 0; t < NTYPES; t++) rem[t] = avail(t);
  for (const id of H.players[seat].hand) rem[amType(id)]--;
  for (const p of H.players) {
    for (const d of p.discards) if (!d.called) rem[amType(d.id)]--;
    for (const e of p.exposures) for (const id of e.tiles) rem[amType(id)]--;
  }
  return rem.map((x) => Math.max(0, x));
}

const variantCache = new WeakMap();
function variants(cc, hand) {
  let m = variantCache.get(cc);
  if (!m) {
    m = new Map();
    for (const tg of cc.targets) m.set(tg.hand.index, (m.get(tg.hand.index) || 0) + 1);
    variantCache.set(cc, m);
  }
  return m.get(hand.index);
}

const exposuresOf = (p) => p.exposures.map((e) => ({ t: e.t, n: e.n }));

// The targets worth thinking about for this seat, with a weight from the persona.
function context(game, seat, persona, exposures) {
  const pp = persona.p;
  const rem = remaining(game, seat);
  const targets = [];
  for (const tg of game.cc.targets) {
    if (!exposuresFit(tg, exposures)) continue;
    // hands with many suit/number variants would otherwise crowd out the rest
    let w = Math.pow(tg.value / 25, 0.5 + 1.5 * pp.value) / Math.sqrt(variants(game.cc, tg.hand));
    if (tg.concealed) w *= pp.closed ? 2.2 : 0.75;
    targets.push({ tg, w });
  }
  return { rem, targets, exposures, persona };
}

// How good a set of concealed counts is, and the fewest tiles missing for any target.
function score(ctx, c) {
  let s = 0, best = 99;
  for (const { tg, w } of ctx.targets) {
    const m = missing(tg, c, ctx.exposures);
    if (m < 0) continue;
    // a pair or single the bot can no longer get kills the target
    let dead = false;
    for (const t of tg.types) if (tg.nonj[t] > c[t] && tg.nonj[t] - c[t] > ctx.rem[t]) { dead = true; break; }
    if (dead) continue;
    s += w * Math.exp(-K * m);
    if (m < best) best = m;
  }
  return { s, best };
}

// How likely each tile type is to hand an opponent their Mahjong, judged from exposures.
function riskMap(game, seat) {
  const H = game.h;
  const risk = new Array(NTYPES).fill(0);
  let any = false;
  for (let o = 0; o < 4; o++) {
    if (o === seat) continue;
    const q = H.players[o];
    if (!q.exposures.length) continue;
    const exposed = q.exposures.reduce((s, e) => s + e.n, 0);
    const threat = Math.min(1, Math.max(0, exposed - 3) / 8);
    if (!threat) continue;
    const ex = exposuresOf(q);
    const fits = game.cc.targets.filter((tg) => exposuresFit(tg, ex));
    if (!fits.length) continue;
    const hits = new Array(NTYPES).fill(0);
    for (const tg of fits) {
      const left = tg.jok.slice();
      for (const e of ex) left[e.t] -= e.n;
      for (const t of tg.types) if (tg.nonj[t] || left[t] > 0) hits[t]++;
    }
    for (let t = 0; t < NTYPES; t++) if (hits[t]) { risk[t] += threat * hits[t] / fits.length; any = true; }
  }
  risk[JOKER] = 0; // discarded jokers can't be claimed
  return any ? risk : null;
}

// Pick a discard from concealed counts c. Returns the tile type.
function pickDiscardType(game, seat, ctx, c, risk) {
  const pp = ctx.persona.p;
  let bestT = -1, bestV = -Infinity, bestS = null;
  const cur = score(ctx, c);
  for (let t = 0; t < NTYPES; t++) {
    if (!c[t] || t === JOKER) continue;
    c[t]--;
    const r = score(ctx, c);
    c[t]++;
    let v = Math.log(r.s + 1e-9);
    if (risk && pp.defense > 0) v -= pp.defense * risk[t] * (cur.best >= 2 ? 3 : 1);
    if (v > bestV) { bestV = v; bestT = t; bestS = r; }
  }
  if (bestT < 0) bestT = JOKER; // only jokers left: has to throw one
  return { t: bestT, s: bestS };
}

const idOfType = (hand, t, prefer) => (prefer !== null && prefer !== undefined && amType(prefer) === t ? prefer : hand.find((id) => amType(id) === t));

export function amBotTurn(game, seat, opts, persona) {
  if (opts.canWin) return { type: 'mahjong' };
  const p = game.h.players[seat];
  const ex = exposuresOf(p);
  const ctx = context(game, seat, persona, ex);
  const c = amCounts(p.hand);
  // swap a natural tile for a joker whenever that helps (it nearly always does)
  if (opts.swaps.length) {
    const before = score(ctx, c).s;
    for (const s of opts.swaps) {
      c[s.t]--; c[JOKER]++;
      const after = score(ctx, c).s;
      c[s.t]++; c[JOKER]--;
      if (after >= before) return { type: 'swap', owner: s.owner, idx: s.idx };
    }
  }
  const { t } = pickDiscardType(game, seat, ctx, c, riskMap(game, seat));
  return { type: 'discard', tile: idOfType(opts.discards, t, opts.drawn) };
}

export function amBotReaction(game, seat, tile, from, opts, persona) {
  if (opts.mahjong) return { type: 'mahjong' };
  const pp = persona.p;
  if (pp.closed || pp.call <= 0 || !opts.calls.length) return { type: 'pass' };
  const p = game.h.players[seat];
  const ex = exposuresOf(p);
  const c = amCounts(p.hand);
  const before = score(context(game, seat, persona, ex), c).s;
  if (!before) return { type: 'pass' };
  const risk = riskMap(game, seat);
  // calling commits the hand: the more cautious the bot, the bigger the gain it wants
  const need = 1 + (1 - pp.call) * 1.2;
  let best = null;
  for (const call of opts.calls) {
    const ex2 = ex.concat({ t: amType(tile), n: call.n });
    const ctx2 = context(game, seat, persona, ex2);
    const c2 = c.slice();
    for (const id of call.combo) c2[amType(id)]--;
    const d = pickDiscardType(game, seat, ctx2, c2, risk);
    if (!d.s) continue;
    const jokers = call.combo.filter(isJoker).length;
    // jokers put into an exposure can be taken by anyone; the value hunter hates that
    const after = d.s.s * Math.pow(pp.value >= 0.9 ? 0.6 : 0.85, jokers);
    if (after > before * need && (!best || after > best.after)) best = { n: call.n, after };
  }
  return best ? { type: 'call', n: best.n } : { type: 'pass' };
}

// Charleston: pass the tiles the hand misses least. Never jokers.
export function amBotPass(game, seat, count, persona) {
  const p = game.h.players[seat];
  const ctx = context(game, seat, persona, []);
  const c = amCounts(p.hand);
  const out = [];
  const hand = p.hand.slice();
  for (let i = 0; i < count; i++) {
    let bestT = -1, bestS = -1;
    for (let t = 0; t < NTYPES; t++) {
      if (!c[t] || t === JOKER) continue;
      c[t]--;
      const s = score(ctx, c).s;
      c[t]++;
      if (s > bestS) { bestS = s; bestT = t; }
    }
    if (bestT < 0) break;
    c[bestT]--;
    const id = hand.find((x) => amType(x) === bestT);
    hand.splice(hand.indexOf(id), 1);
    out.push(id);
  }
  return out;
}

// Keep passing in the second Charleston while the hand is still far from anything.
export function amBotVote(game, seat, persona) {
  const p = game.h.players[seat];
  const { best } = score(context(game, seat, persona, []), amCounts(p.hand));
  return best >= (persona.p.closed ? 4 : 5);
}

// Courtesy pass: offer as many tiles (up to 3) as the hand can spare without losing much.
export function amBotCourtesy(game, seat, persona) {
  const p = game.h.players[seat];
  const ctx = context(game, seat, persona, []);
  const c = amCounts(p.hand);
  let s0 = score(ctx, c).s;
  let n = 0;
  for (; n < 3; n++) {
    let bestT = -1, bestS = -1;
    for (let t = 0; t < NTYPES; t++) {
      if (!c[t] || t === JOKER) continue;
      c[t]--;
      const s = score(ctx, c).s;
      c[t]++;
      if (s > bestS) { bestS = s; bestT = t; }
    }
    if (bestT < 0 || bestS < s0 * 0.8) break;
    c[bestT]--;
    s0 = bestS;
  }
  return n;
}

export function makeAmBot(persona) {
  return {
    persona,
    decideCharleston: (game, seat, { count }) => amBotPass(game, seat, count, persona),
    decideVote: (game, seat) => amBotVote(game, seat, persona),
    decideCourtesy: (game, seat) => amBotCourtesy(game, seat, persona),
    decideTurn: (game, seat, opts) => amBotTurn(game, seat, opts, persona),
    decideReaction: (game, seat, tile, from, opts) => amBotReaction(game, seat, tile, from, opts, persona),
  };
}

// For the hint strip and the card sheet: the closest targets for a set of tiles.
export function closestTargets(cc, c, exposures, limit = 3) {
  const best = new Map(); // hand index -> { tg, m }
  for (const tg of cc.targets) {
    const m = missing(tg, c, exposures);
    if (m < 0) continue;
    const cur = best.get(tg.hand.index);
    if (!cur || m < cur.m || (m === cur.m && tg.value > cur.tg.value)) best.set(tg.hand.index, { tg, m });
  }
  const list = [...best.values()].sort((a, b) => a.m - b.m || b.tg.value - a.tg.value);
  return limit ? list.slice(0, limit) : list;
}
