// Reading a hand card, and matching tiles against it.
//
// Each hand on the card expands into concrete targets: one per way of choosing its suits
// (and, for hands that shift, its numbers). A target is a list of units { t, n }: n tiles
// of type t. Jokers can stand in for any tile of a unit of three or more, never in a pair
// or a single.

import { FLOWER, JOKER, NTYPES, SUIT_DRAGON } from './tiles.js';

const HONOR = { E: 27, S: 28, W: 29, N: 30, '0': 31, G: 32, R: 33, F: FLOWER };

// "FF 2026a 222b" -> [{ symbols: ['F','F'], suit: null }, { symbols: ['2','0','2','6'], suit: 'a' }, ...]
export function parseGroups(text) {
  return text.trim().split(/\s+/).map((g) => {
    const m = /^([0-9FESWNRGD]+)([abc]?)$/.exec(g);
    if (!m) throw new Error(`bad group "${g}" in "${text}"`);
    return { symbols: [...m[1]], suit: m[2] || null };
  });
}

function symbolType(sym, suit, shift) {
  if (sym in HONOR) return HONOR[sym];
  if (sym === 'D') {
    if (suit === undefined) throw new Error('D needs a suit letter');
    return SUIT_DRAGON[suit];
  }
  const n = +sym + shift;
  if (suit === undefined) throw new Error(`number ${sym} needs a suit letter`);
  if (n < 1 || n > 9) return -1;
  return suit * 9 + n - 1;
}

const PERMS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];

// All concrete unit lists for one hand on the card.
export function expandHand(hand) {
  const groups = parseGroups(hand.text);
  const digits = groups.flatMap((g) => g.symbols.filter((s) => /[1-9]/.test(s)).map(Number));
  const maxD = digits.length ? Math.max(...digits) : 9;
  const shifts = [0];
  if (hand.shift) for (let k = hand.shift; maxD + k <= 9; k += hand.shift) shifts.push(k);
  const seen = new Set();
  const out = [];
  for (const perm of PERMS) {
    for (const k of shifts) {
      const units = [];
      let ok = true;
      for (const [gi, g] of groups.entries()) {
        const suit = g.suit ? perm['abc'.indexOf(g.suit)] : undefined;
        const types = g.symbols.map((s) => symbolType(s, suit, /[1-9]/.test(s) ? k : 0));
        if (types.includes(-1)) { ok = false; break; }
        if (types.every((t) => t === types[0])) units.push({ t: types[0], n: types.length, g: gi });
        else for (const t of types) units.push({ t, n: 1, g: gi });
      }
      if (!ok) continue;
      const key = units.map((u) => `${u.t}x${u.n}`).sort().join(' ');
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(units);
    }
  }
  return out;
}

function makeTarget(units, hand) {
  const nonj = new Int8Array(NTYPES); // tiles that must be the real thing (pairs, singles)
  const jok = new Int8Array(NTYPES); // tiles in sets of 3+, where jokers may stand in
  const sets = {}; // "t:n" -> how many such sets, for matching exposures
  for (const u of units) {
    if (u.n >= 3) {
      jok[u.t] += u.n;
      sets[`${u.t}:${u.n}`] = (sets[`${u.t}:${u.n}`] || 0) + 1;
    } else nonj[u.t] += u.n;
  }
  const types = [];
  for (let t = 0; t < NTYPES; t++) if (nonj[t] || jok[t]) types.push(t);
  return {
    hand, units, nonj, jok, sets, types,
    size: units.reduce((s, u) => s + u.n, 0),
    concealed: !!hand.concealed,
    value: hand.value,
    jokerable: units.some((u) => u.n >= 3),
  };
}

// Compile a card: a flat list of its hands (with ids and section names) and all their targets.
const compiled = new Map();
export function compileCard(card) {
  if (compiled.has(card.id)) return compiled.get(card.id);
  const hands = [];
  const targets = [];
  card.sections.forEach((sec, si) => {
    sec.hands.forEach((h, hi) => {
      const hand = { ...h, id: `${si + 1}-${hi + 1}`, section: sec.name, index: hands.length };
      hands.push(hand);
      for (const units of expandHand(hand)) targets.push(makeTarget(units, hand));
    });
  });
  const out = { card, hands, targets };
  compiled.set(card.id, out);
  return out;
}

// Can these exposures (array of { t, n }) belong to this target?
export function exposuresFit(target, exposures) {
  if (!exposures.length) return true;
  if (target.concealed) return false;
  const need = {};
  for (const e of exposures) {
    const k = `${e.t}:${e.n}`;
    need[k] = (need[k] || 0) + 1;
    if (!target.sets[k] || need[k] > target.sets[k]) return false;
  }
  return true;
}

// How many more tiles the concealed part needs to make this target, given concealed counts
// c (c[JOKER] = jokers in hand) and the exposures. -1 if the exposures don't fit.
// 0 with a full hand means Mahjong.
export function missing(target, c, exposures) {
  if (!exposuresFit(target, exposures)) return -1;
  let exposed = 0;
  const jokAdj = exposures.length ? target.jok.slice() : target.jok;
  for (const e of exposures) { jokAdj[e.t] -= e.n; exposed += e.n; }
  let useful = 0, jokerSlots = 0;
  for (const t of target.types) {
    const have = c[t], nj = target.nonj[t], jk = jokAdj[t];
    if (have >= nj) {
      useful += nj;
      const spare = have - nj;
      if (spare >= jk) useful += jk;
      else { useful += spare; jokerSlots += jk - spare; }
    } else {
      useful += have;
      jokerSlots += jk;
    }
  }
  useful += Math.min(c[JOKER], jokerSlots);
  return target.size - exposed - useful;
}

// Concealed tile types a target still wants (beyond what the hand holds), for hints and bots.
// Returns an array of types, with repeats. Jokers aren't listed.
export function wanted(target, c, exposures) {
  const jokAdj = target.jok.slice();
  for (const e of exposures) jokAdj[e.t] -= e.n;
  const out = [];
  for (const t of target.types) {
    const need = target.nonj[t] + jokAdj[t] - c[t];
    for (let i = 0; i < need; i++) out.push(t);
  }
  return out;
}

// The best Mahjong a 14-tile hand makes, or null. jokers: jokers in the exposures too.
export function bestWin(compiledCard, c, exposures, exposedJokers = 0) {
  let total = exposures.reduce((s, e) => s + e.n, 0);
  for (let t = 0; t < NTYPES; t++) total += c[t];
  if (total !== 14) return null;
  const jokerless = c[JOKER] === 0 && exposedJokers === 0;
  let best = null;
  for (const tg of compiledCard.targets) {
    if (missing(tg, c, exposures) !== 0) continue;
    const bonus = jokerless && tg.jokerable;
    const value = tg.value * (bonus ? 2 : 1);
    if (!best || value > best.value) best = { target: tg, hand: tg.hand, value, base: tg.value, jokerless: bonus };
  }
  return best;
}
