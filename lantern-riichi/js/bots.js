// The bots. Each one plays the same engine (tile efficiency from shanten and
// ukeire, a danger estimate for every tile against every threat) with its own
// weights, so their habits show at the table.

import { typeOf, counts, isRed, isYaochu, isHonor, isDragon, suitOf, numOf, doraOf } from './tiles.js';
import { shanten, waitsOf } from './shanten.js';
import { scoreWin } from './score.js';

export const PERSONAS = [
  {
    id: 'mashi', name: 'Mashi', emoji: '🐒', color: '#d9822b', style: 'Frequent caller',
    blurb: 'Calls pon and chi at every chance to race to a quick, cheap win. Rarely folds.',
    p: { call: 1.0, defense: 0.35, value: 0.2, closed: false, riichi: 0.5, dama: 0.3 },
  },
  {
    id: 'fuku', name: 'Fuku', emoji: '🦉', color: '#7a6bb0', style: 'Defensive',
    blurb: 'Folds the moment someone declares riichi unless it already has a strong hand. Hard to deal into.',
    p: { call: 0.3, defense: 1.7, value: 0.4, closed: false, riichi: 0.6, dama: 0.6 },
  },
  {
    id: 'kame', name: 'Kame', emoji: '🐢', color: '#3f8f6b', style: 'Keeps the hand closed',
    blurb: 'Never calls. Builds a closed hand and declares riichi as soon as it is ready.',
    p: { call: 0, defense: 0.6, value: 0.4, closed: true, riichi: 1.0, dama: 0 },
  },
  {
    id: 'rin', name: 'Rin', emoji: '🦊', color: '#c4553a', style: 'Value hunter',
    blurb: 'Chases flushes, dragons and dora. Stays quiet (no riichi) when the hand is already big.',
    p: { call: 0.5, defense: 0.6, value: 1.0, closed: false, riichi: 0.5, dama: 1.0 },
  },
  {
    id: 'bonta', name: 'Bonta', emoji: '🦝', color: '#8a6a4a', style: 'Gambler',
    blurb: 'Never folds. Declares riichi on anything, even a single bad wait.',
    p: { call: 0.35, defense: 0, value: 0.3, closed: false, riichi: 1.0, dama: 0 },
  },
  {
    id: 'kuma', name: 'Kuma', emoji: '🐻', color: '#4a6fa5', style: 'Balanced',
    blurb: 'Plays by the book: efficient, calls when it pays, folds when it should.',
    p: { call: 0.6, defense: 0.8, value: 0.5, closed: false, riichi: 0.8, dama: 0.5 },
  },
];

export const personaById = (id) => PERSONAS.find((x) => x.id === id) || PERSONAS[5];

const YAKUHAI_DRAGONS = [31, 32, 33];

// ------------------------------------------------------------------ what the bot can see

function remaining(game, seat) {
  const H = game.h;
  const rem = new Array(34).fill(4);
  for (const id of H.players[seat].hand) rem[typeOf(id)]--;
  for (const p of H.players) {
    for (const d of p.discards) if (!d.called) rem[typeOf(d.id)]--;
    for (const m of p.melds) for (const id of m.tiles) rem[typeOf(id)]--;
  }
  for (const id of H.doraInd.slice(0, H.doraShown)) rem[typeOf(id)]--;
  for (let t = 0; t < 34; t++) if (rem[t] < 0) rem[t] = 0;
  return rem;
}

function doraTypes(game) {
  return game.h.doraInd.slice(0, game.h.doraShown).map((id) => doraOf(typeOf(id)));
}

function yakuhaiTypes(game, seat) {
  return new Set([...YAKUHAI_DRAGONS, 27 + game.seatWind(seat), 27 + game.roundWind]);
}

function ukeire(c, melds, s, rem) {
  let uk = 0;
  for (let t = 0; t < 34; t++) {
    if (!rem[t] || c[t] >= 4) continue;
    c[t]++;
    if (shanten(c, melds) < s) uk += rem[t];
    c[t]--;
  }
  return uk;
}

// ------------------------------------------------------------------ danger

function threatOf(game, seat, o) {
  const q = game.h.players[o];
  let th = 0;
  if (q.riichi || q.pendingRiichi) th = 1;
  else {
    const open = q.melds.filter((m) => m.kind !== 'ankan');
    if (open.length >= 3) th = 0.7;
    else if (open.length === 2) {
      const yh = yakuhaiTypes(game, o);
      const dora = doraTypes(game);
      const strong = open.some((m) => yh.has(typeOf(m.tiles[0])) && m.kind !== 'chi') || open.some((m) => m.tiles.some((id) => dora.includes(typeOf(id)) || isRed(id)));
      th = strong ? 0.5 : 0.3;
    }
  }
  if (o === game.dealer) th *= 1.25;
  return th;
}

function safeAgainst(game, o) {
  const H = game.h, q = H.players[o];
  const safe = new Set(q.discards.map((d) => typeOf(d.id)));
  if (q.riichi && q.riichiIndex >= 0) {
    // everything discarded by anyone since the riichi passed
    const since = H.discardLog ? H.discardLog.slice(q.riichiLogIndex ?? 0) : [];
    for (const t of since) safe.add(t);
  }
  return safe;
}

function tileDanger(t, game, o, rem, safe) {
  if (safe.has(t)) return 0;
  if (isHonor(t)) {
    const left = rem[t];
    if (left === 0) return 0.01;
    if (left === 1) return 0.1;
    return left === 2 ? 0.35 : 0.5;
  }
  const n = numOf(t), base = t - n + 1;
  const sj = (k) => k >= 1 && k <= 9 && safe.has(base + k - 1);
  let d;
  if (n === 1) d = sj(4) ? 0.2 : 0.55;
  else if (n === 9) d = sj(6) ? 0.2 : 0.55;
  else if (n === 2) d = sj(5) ? 0.3 : 0.75;
  else if (n === 8) d = sj(5) ? 0.3 : 0.75;
  else if (n === 3) d = sj(6) ? 0.35 : 0.85;
  else if (n === 7) d = sj(4) ? 0.35 : 0.85;
  else d = sj(n - 3) && sj(n + 3) ? 0.3 : sj(n - 3) || sj(n + 3) ? 0.65 : 1;
  // walls: if every copy of a neighbour is gone, runs through it can't wait on this tile
  if (n <= 7 && rem[t + 1] === 0 && n >= 3 && rem[t - 1] === 0) d *= 0.5;
  return d;
}

function dangerMap(game, seat, rem) {
  const out = new Array(34).fill(0);
  let maxThreat = 0;
  for (let o = 0; o < 4; o++) {
    if (o === seat) continue;
    const th = threatOf(game, seat, o);
    if (!th) continue;
    maxThreat = Math.max(maxThreat, th);
    const safe = safeAgainst(game, o);
    for (let t = 0; t < 34; t++) out[t] += th * tileDanger(t, game, o, rem, safe);
  }
  return { danger: out, maxThreat };
}

// ------------------------------------------------------------------ hand plans

function planOf(game, seat, c, melds) {
  const yh = yakuhaiTypes(game, seat);
  const open = melds.some((m) => m.kind !== 'ankan');
  const meldTypes = melds.map((m) => m.tiles.map(typeOf));
  const flat = meldTypes.flat();
  const suitCount = [0, 0, 0];
  let honors = 0;
  for (let t = 0; t < 34; t++) { if (t < 27) suitCount[suitOf(t)] += c[t]; else honors += c[t]; }
  for (const t of flat) if (t < 27) suitCount[suitOf(t)]++; else honors++;
  const best = suitCount.indexOf(Math.max(...suitCount));
  const offSuit = suitCount.reduce((s, n, i) => (i === best ? s : s + n), 0);
  const meldsInSuit = flat.every((t) => t >= 27 || suitOf(t) === best);
  return {
    yh,
    open,
    yakuhaiMeld: melds.some((m) => m.kind !== 'chi' && yh.has(typeOf(m.tiles[0]))),
    yakuhaiPair: [...yh].some((t) => c[t] >= 2),
    tanyaoOk: flat.every((t) => !isYaochu(t)),
    flushSuit: best,
    flushOff: offSuit,
    flushOk: meldsInSuit && offSuit <= (open ? 4 : 3) && suitCount[best] + honors >= 8,
    toitoiOk: melds.every((m) => m.kind !== 'chi') && c.filter((x) => x >= 2).length >= 3,
  };
}

function yakuPathAfterCall(game, seat, c, melds, persona) {
  const pl = planOf(game, seat, c, melds);
  if (pl.yakuhaiMeld) return 'yakuhai';
  if (pl.tanyaoOk && c.reduce((s, n, t) => s + (isYaochu(t) ? n : 0), 0) <= (persona.p.call > 0.8 ? 2 : 1)) return 'tanyao';
  if (pl.flushOk && pl.flushOff <= 2) return 'flush';
  if (pl.toitoiOk && c.filter((x) => x >= 2).length >= 4) return 'toitoi';
  if (persona.p.call > 0.8 && [...pl.yh].some((t) => c[t] >= 2)) return 'yakuhai-pair';
  return null;
}

// rough han estimate for push/fold and dama
function valueEstimate(game, seat, c, melds) {
  const dora = doraTypes(game);
  let han = 0;
  const p = game.h.players[seat];
  for (const t of dora) han += c[t] + melds.reduce((s, m) => s + m.tiles.filter((id) => typeOf(id) === t).length, 0);
  han += p.hand.filter(isRed).length + melds.reduce((s, m) => s + m.tiles.filter(isRed).length, 0);
  const pl = planOf(game, seat, c, melds);
  for (const t of pl.yh) if (c[t] >= 3 || melds.some((m) => m.kind !== 'chi' && typeOf(m.tiles[0]) === t)) han++;
  if (pl.flushOk && pl.flushOff === 0) han += 2;
  if (!pl.open) han += 1;
  return han;
}

// ------------------------------------------------------------------ choosing a discard

function evaluateDiscards(game, seat, persona, ids, forced) {
  const H = game.h, p = H.players[seat];
  const melds = p.melds;
  const c = counts(p.hand);
  const rem = remaining(game, seat);
  const dora = doraTypes(game);
  const pl = planOf(game, seat, c, melds);
  const { danger, maxThreat } = dangerMap(game, seat, rem);
  const value = persona.p.value;
  const seen = new Set();
  const out = [];
  for (const id of ids) {
    const t = typeOf(id);
    if (seen.has(t)) continue;
    seen.add(t);
    c[t]--;
    const s = shanten(c, melds.length);
    const uk = s >= 0 ? ukeire(c, melds.length, s, rem) : 0;
    c[t]++;
    let score = -s * 1000 + uk * 8;
    // keep value
    const doraHere = dora.filter((x) => x === t).length;
    score -= doraHere * (30 + 60 * value);
    if (pl.yh.has(t) && c[t] >= 2) score -= 60 + 80 * value;
    if (pl.yh.has(t) && c[t] === 1) score -= 4;
    if (isHonor(t) && !pl.yh.has(t)) score += 6;
    if (isYaochu(t)) score += 3;
    // plans
    if (pl.open && !pl.yakuhaiMeld) {
      if (pl.tanyaoOk && isYaochu(t)) score += 400;
      else if (pl.flushOk && (t >= 27 ? false : suitOf(t) !== pl.flushSuit)) score += 400;
    }
    if (!pl.open && value >= 0.9 && pl.flushOk && t < 27 && suitOf(t) !== pl.flushSuit) score += 250;
    if (!pl.open && value >= 0.9 && pl.flushOk && (t >= 27 || suitOf(t) === pl.flushSuit)) score -= 60;
    out.push({ t, s, uk, score, danger: danger[t] });
  }
  return { list: out, maxThreat, c, rem, pl };
}

function pickId(ids, t, drawn) {
  const same = ids.filter((id) => typeOf(id) === t);
  if (drawn !== null && same.includes(drawn) && !isRed(drawn)) return drawn;
  return same.find((id) => !isRed(id)) ?? same[0];
}

function shouldFold(persona, best, maxThreat, est) {
  if (!maxThreat || persona.p.defense <= 0) return false;
  const reach = best.s <= 0 ? 1 : best.s === 1 ? 0.35 : 0.08;
  const push = reach * (1 + 0.3 * est) * (best.s <= 0 && best.uk >= 5 ? 1.2 : 1);
  return push < persona.p.defense * maxThreat;
}

export function chooseDiscard(game, seat, persona, ids, drawn) {
  const ev = evaluateDiscards(game, seat, persona, ids);
  const p = game.h.players[seat];
  let list = ev.list.slice().sort((a, b) => b.score - a.score);
  const best = list[0];
  const est = valueEstimate(game, seat, ev.c, p.melds);
  let fold = shouldFold(persona, best, ev.maxThreat, est);
  if (fold) {
    list.sort((a, b) => a.danger - b.danger || b.score - a.score);
  } else if (ev.maxThreat) {
    const w = 120 * persona.p.defense * ev.maxThreat;
    list.sort((a, b) => b.score - w * b.danger * (b.s <= 0 ? 0.3 : 1) - (a.score - w * a.danger * (a.s <= 0 ? 0.3 : 1)));
  }
  const pick = list[0];
  return { t: pick.t, id: pickId(ids, pick.t, drawn), s: pick.s, fold, est };
}

function hasDamaYaku(game, seat, handIds) {
  const p = game.h.players[seat];
  const c = counts(handIds);
  for (const w of waitsOf(c, p.melds.length)) {
    const fake = w * 4 + 3;
    const r = scoreWin({ hand: handIds.concat(fake), winTile: fake, tsumo: false, ...game.winFlags(seat, { riichi: false, doubleRiichi: false, ippatsu: false }) });
    if (r) return r.han;
  }
  return 0;
}

export function botTurn(game, seat, opts, persona) {
  const p = game.h.players[seat];
  if (opts.canTsumo) return { type: 'tsumo' };
  if (opts.kyuushu) {
    const c = counts(p.hand);
    const kinds = [0, 8, 9, 17, 18, 26, 27, 28, 29, 30, 31, 32, 33].filter((t) => c[t]).length;
    if (!(persona.p.value >= 0.9 && kinds >= 11)) return { type: 'kyuushu' };
  }
  if (opts.ankan.length) {
    if (p.riichi) return { type: 'ankan', t: opts.ankan[0] };
    const t = opts.ankan[0];
    const c = counts(p.hand);
    const s0 = shanten(c, p.melds.length);
    c[t] -= 4;
    // a kan draws a replacement; compare against 13-tile shape without the drawn tile
    const s1 = shanten(c, p.melds.length + 1);
    const { maxThreat } = dangerMap(game, seat, remaining(game, seat));
    if (s1 <= s0 + 1 && !(maxThreat && persona.p.defense > 1)) return { type: 'ankan', t };
  }
  if (opts.kakan.length && !p.riichi) {
    const { maxThreat } = dangerMap(game, seat, remaining(game, seat));
    if (!maxThreat || persona.p.defense < 0.5) return { type: 'kakan', t: opts.kakan[0] };
  }
  if (p.riichi) return { type: 'discard', tile: opts.drawn };

  const choice = chooseDiscard(game, seat, persona, opts.discards, opts.drawn);
  let riichi = false;
  if (opts.riichi.includes(choice.id) && !choice.fold) {
    const rest = p.hand.filter((x) => x !== choice.id);
    const damaHan = hasDamaYaku(game, seat, rest);
    const c = counts(rest);
    const rem = remaining(game, seat);
    const waitsLeft = waitsOf(c, p.melds.length).reduce((s, t) => s + rem[t], 0);
    if (!damaHan) riichi = true;
    else if (persona.p.riichi >= 1) riichi = true;
    else if (persona.p.dama >= 0.9 && damaHan >= 3) riichi = false;
    else if (damaHan >= 4 + (1 - persona.p.dama) * 2) riichi = false;
    else if (persona.p.dama >= 0.5 && waitsLeft <= 2) riichi = false;
    else riichi = persona.p.riichi >= 0.5 || damaHan < 2;
    if (game.h.wall.length < 6 && damaHan) riichi = false;
  }
  return { type: 'discard', tile: choice.id, riichi };
}

export function botReaction(game, seat, tile, from, opts, persona) {
  if (opts.ron) return { type: 'ron' };
  if (persona.p.closed || persona.p.call <= 0) return { type: 'pass' };
  const H = game.h, p = H.players[seat];
  const t = typeOf(tile);
  const c = counts(p.hand);
  const s0 = shanten(c, p.melds.length);
  const rem = remaining(game, seat);
  const { maxThreat } = dangerMap(game, seat, rem);
  const yh = yakuhaiTypes(game, seat);
  const tries = [];
  if (opts.pon) tries.push({ type: 'pon', combo: opts.pon });
  for (const combo of opts.chi) tries.push({ type: 'chi', combo });
  let bestCall = null;
  for (const tr of tries) {
    const hand = p.hand.slice();
    for (const id of tr.combo) hand.splice(hand.indexOf(id), 1);
    const melds = p.melds.concat([{ kind: tr.type, tiles: [...tr.combo, tile] }]);
    const cc = counts(hand);
    // best shanten after the forced discard
    let s1 = 9;
    for (let x = 0; x < 34; x++) {
      if (!cc[x] || x === t) continue;
      cc[x]--;
      s1 = Math.min(s1, shanten(cc, melds.length));
      cc[x]++;
    }
    const path = yakuPathAfterCall(game, seat, cc, melds, persona);
    if (!path) continue;
    const yakuhaiPon = tr.type === 'pon' && yh.has(t);
    const improve = s1 < s0;
    let ok = false;
    const call = persona.p.call;
    if (yakuhaiPon) ok = improve || (s1 <= s0 && persona.p.value >= 0.9);
    else if (!improve) ok = false;
    else if (call >= 0.9) ok = true;
    else if (call >= 0.5) ok = s1 <= 1 || path === 'flush' || (path === 'toitoi' && persona.p.value >= 0.9);
    else if (call >= 0.3) ok = s1 === 0 || (persona.p.value >= 0.9 && (path === 'flush' || path === 'yakuhai'));
    if (ok && maxThreat) {
      // calling with a threat on the table only to get ready
      if (persona.p.defense >= 1) ok = s1 === 0;
      else if (persona.p.defense > 0) ok = s1 <= 1;
    }
    if (ok && (!bestCall || s1 < bestCall.s1 || (s1 === bestCall.s1 && tr.type === 'pon'))) bestCall = { ...tr, s1 };
  }
  if (bestCall) return { type: bestCall.type, combo: bestCall.combo };
  if (opts.minkan && (persona.p.call >= 0.9 || persona.p.defense === 0) && !maxThreat) {
    const cc = counts(p.hand); cc[t] -= 3;
    if (shanten(cc, p.melds.length + 1) <= s0 && yakuPathAfterCall(game, seat, cc, p.melds.concat([{ kind: 'minkan', tiles: [...opts.minkan, tile] }]), persona)) return { type: 'minkan' };
  }
  return { type: 'pass' };
}

export function makeBot(persona) {
  return {
    persona,
    decideTurn: (game, seat, opts) => botTurn(game, seat, opts, persona),
    decideReaction: (game, seat, tile, from, opts) => botReaction(game, seat, tile, from, opts, persona),
  };
}
