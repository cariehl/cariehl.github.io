// Scoring: yaku, fu and points for a winning hand, following the usual
// four-player ranked rules: open tanyao, red fives, no kiriage mangan,
// counted yakuman at 13 han, double yakuman for the 13-sided thirteen orphans,
// single-wait four concealed triplets, pure nine gates and big four winds.

import { counts, typeOf, isRed, isYaochu, isHonor, isTerminal, isDragon, suitOf, doraOf } from './tiles.js';

// All ways to split closed counts into a pair and sets.
export function decompositions(c) {
  const out = [];
  const sets = [];
  const rec = (i) => {
    while (i < 34 && !c[i]) i++;
    if (i >= 34) { out.push(sets.slice()); return; }
    if (c[i] >= 3) { c[i] -= 3; sets.push({ kind: 'trip', t: i }); rec(i); sets.pop(); c[i] += 3; }
    if (i < 27 && i % 9 <= 6 && c[i + 1] && c[i + 2]) {
      c[i]--; c[i + 1]--; c[i + 2]--; sets.push({ kind: 'seq', t: i }); rec(i); sets.pop(); c[i]++; c[i + 1]++; c[i + 2]++;
    }
  };
  const res = [];
  for (let p = 0; p < 34; p++) {
    if (c[p] < 2) continue;
    c[p] -= 2;
    out.length = 0;
    rec(0);
    for (const s of out) res.push({ pair: p, sets: s });
    c[p] += 2;
  }
  return res;
}

const GREEN = new Set([19, 20, 21, 23, 25, 32]);

function meldToSet(m) {
  const t = typeOf(m.tiles[0]);
  if (m.kind === 'chi') return { kind: 'seq', t: Math.min(...m.tiles.map(typeOf)), open: true, concealed: false };
  if (m.kind === 'pon') return { kind: 'trip', t, open: true, concealed: false };
  return { kind: 'kan', t, open: m.kind !== 'ankan', concealed: m.kind === 'ankan' };
}

export const LIMITS = { 5: 'Mangan', 6: 'Haneman', 8: 'Baiman', 11: 'Sanbaiman' };

export function basePoints(han, fu, yakuman) {
  if (yakuman) return { base: 8000 * yakuman, limit: yakuman > 1 ? `${['', '', 'Double', 'Triple', 'Quadruple', 'Quintuple', 'Sextuple'][yakuman] || yakuman + '×'} Yakuman` : 'Yakuman' };
  if (han >= 13) return { base: 8000, limit: 'Counted Yakuman' };
  if (han >= 11) return { base: 6000, limit: 'Sanbaiman' };
  if (han >= 8) return { base: 4000, limit: 'Baiman' };
  if (han >= 6) return { base: 3000, limit: 'Haneman' };
  const b = fu * 2 ** (han + 2);
  if (han >= 5 || b >= 2000) return { base: 2000, limit: 'Mangan' };
  return { base: b, limit: '' };
}

const up100 = (x) => Math.ceil(x / 100) * 100;

// What each player pays. Returns { ron } or { fromDealer, fromOthers } (tsumo), honba included.
export function payment(base, dealer, tsumo, honba = 0) {
  if (!tsumo) return { ron: up100(base * (dealer ? 6 : 4)) + 300 * honba };
  if (dealer) return { fromOthers: up100(base * 2) + 100 * honba };
  return { fromDealer: up100(base * 2) + 100 * honba, fromOthers: up100(base) + 100 * honba };
}

export function totalFor(base, dealer, tsumo) {
  const p = payment(base, dealer, tsumo, 0);
  if (!tsumo) return p.ron;
  return dealer ? p.fromOthers * 3 : p.fromDealer + p.fromOthers * 2;
}

/*
 w = {
   hand: closed tile ids including the winning tile, melds: [{kind, tiles}], winTile: id, tsumo,
   seatWind, roundWind (0-3), dealer, riichi, doubleRiichi, ippatsu, haitei, houtei, rinshan,
   chankan, tenhou, chiihou, dora: [indicator types], ura: [indicator types]
 }
 Returns the highest-scoring reading, or null when the hand isn't complete or has no yaku.
*/
export function scoreWin(w) {
  const c = counts(w.hand);
  const win = typeOf(w.winTile);
  const melds = w.melds || [];
  const closed = melds.every((m) => m.kind === 'ankan');
  const meldSets = melds.map(meldToSet);
  const seatT = 27 + w.seatWind, roundT = 27 + w.roundWind;
  const allIds = w.hand.concat(...melds.map((m) => m.tiles));
  const allTypes = allIds.map(typeOf);
  const ac = counts(allIds);
  const candidates = [];

  // situational yaku (any hand shape)
  const situational = [];
  if (w.doubleRiichi) situational.push(['Double Riichi', 2]);
  else if (w.riichi) situational.push(['Riichi', 1]);
  if (w.ippatsu && (w.riichi || w.doubleRiichi)) situational.push(['Ippatsu', 1]);
  if (closed && w.tsumo) situational.push(['Fully Concealed Hand', 1]);
  if (w.haitei && w.tsumo && !w.rinshan) situational.push(['Under the Sea', 1]);
  if (w.houtei && !w.tsumo) situational.push(['Under the River', 1]);
  if (w.rinshan) situational.push(['After a Kan', 1]);
  if (w.chankan) situational.push(['Robbing a Kan', 1]);

  const situationalYakuman = [];
  if (w.tenhou) situationalYakuman.push(['Blessing of Heaven', 1]);
  if (w.chiihou) situationalYakuman.push(['Blessing of Earth', 1]);

  const allSimple = allTypes.every((t) => !isYaochu(t));
  const suits = new Set(allTypes.filter((t) => t < 27).map(suitOf));
  const hasHonor = allTypes.some(isHonor);
  const flush = suits.size === 1 ? (hasHonor ? ['Half Flush', closed ? 3 : 2] : ['Full Flush', closed ? 6 : 5]) : suits.size === 0 ? null : null;
  const allHonor = allTypes.every(isHonor);
  const allTermHonor = allTypes.every(isYaochu);
  const allTerminal = allTypes.every(isTerminal);
  const allGreen = allTypes.every((t) => GREEN.has(t));

  const doraCount = () => {
    let d = 0;
    for (const ind of w.dora || []) d += ac[doraOf(ind)];
    let u = 0;
    if (w.riichi || w.doubleRiichi) for (const ind of w.ura || []) u += ac[doraOf(ind)];
    const r = allIds.filter(isRed).length;
    return { d, u, r };
  };

  const finish = (yaku, yakuman, fu) => {
    if (yakuman.length) {
      const n = yakuman.reduce((s, y) => s + y[1], 0);
      const bp = basePoints(0, 0, n);
      candidates.push({ yaku: yakuman.map(([name, k]) => ({ name, han: k > 1 ? 'Double Yakuman' : 'Yakuman' })), han: 13 * n, fu, yakuman: n, ...bp });
      return;
    }
    if (!yaku.length) return;
    const { d, u, r } = doraCount();
    const list = yaku.map(([name, han]) => ({ name, han }));
    if (d) list.push({ name: 'Dora', han: d });
    if (r) list.push({ name: 'Red Five', han: r });
    if (u) list.push({ name: 'Ura Dora', han: u });
    const han = list.reduce((s, y) => s + y.han, 0);
    const bp = basePoints(han, fu, 0);
    candidates.push({ yaku: list, han, fu, yakuman: 0, ...bp });
  };

  // thirteen orphans
  if (melds.length === 0) {
    const yao = [0, 8, 9, 17, 18, 26, 27, 28, 29, 30, 31, 32, 33];
    if (yao.every((t) => c[t] >= 1) && yao.reduce((s, t) => s + c[t], 0) === 14) {
      const thirteen = c[win] === 2;
      finish([], [...situationalYakuman, [thirteen ? 'Thirteen Orphans (13-sided)' : 'Thirteen Orphans', thirteen ? 2 : 1]], 0);
    }
  }

  // seven pairs
  if (melds.length === 0 && c.filter((x) => x === 2).length === 7) {
    const yakuman = [...situationalYakuman];
    if (allHonor) yakuman.push(['All Honors', 1]);
    const yaku = [...situational, ['Seven Pairs', 2]];
    if (allSimple) yaku.push(['All Simples', 1]);
    if (allTermHonor) yaku.push(['All Terminals and Honors', 2]);
    if (flush) yaku.push(flush);
    finish(yaku, yakuman, 25);
  }

  // regular hands
  for (const dec of decompositions(c.slice())) {
    const closedSets = dec.sets.map((s) => ({ ...s, open: false, concealed: true }));
    const pair = dec.pair;
    // ways the winning tile can sit in the hand
    const waits = [];
    if (pair === win) waits.push({ wait: 'tanki', idx: -1 });
    closedSets.forEach((s, idx) => {
      if (s.kind === 'seq' && win >= s.t && win <= s.t + 2) {
        let wait = 'ryanmen';
        if (win === s.t + 1) wait = 'kanchan';
        else if ((s.t % 9 === 0 && win === s.t + 2) || (s.t % 9 === 6 && win === s.t)) wait = 'penchan';
        waits.push({ wait, idx });
      } else if (s.kind === 'trip' && s.t === win) waits.push({ wait: 'shanpon', idx });
    });
    for (const { wait, idx } of waits) {
      const sets = closedSets.map((s, i) => (i === idx && s.kind === 'trip' && !w.tsumo ? { ...s, concealed: false, ronned: true } : s)).concat(meldSets);
      const trips = sets.filter((s) => s.kind !== 'seq');
      const seqs = sets.filter((s) => s.kind === 'seq');
      const concealedTrips = trips.filter((s) => s.concealed).length;
      const kans = sets.filter((s) => s.kind === 'kan').length;
      const tripTypes = new Set(trips.map((s) => s.t));
      const dragonTrips = [31, 32, 33].filter((t) => tripTypes.has(t)).length;
      const windTrips = [27, 28, 29, 30].filter((t) => tripTypes.has(t)).length;

      const yakuman = [...situationalYakuman];
      if (concealedTrips === 4) yakuman.push(wait === 'tanki' ? ['Four Concealed Triplets (single wait)', 2] : ['Four Concealed Triplets', 1]);
      if (dragonTrips === 3) yakuman.push(['Big Three Dragons', 1]);
      if (windTrips === 4) yakuman.push(['Big Four Winds', 2]);
      else if (windTrips === 3 && pair >= 27 && pair <= 30) yakuman.push(['Little Four Winds', 1]);
      if (allHonor) yakuman.push(['All Honors', 1]);
      if (allGreen) yakuman.push(['All Green', 1]);
      if (allTerminal) yakuman.push(['All Terminals', 1]);
      if (kans === 4) yakuman.push(['Four Kans', 1]);
      if (melds.length === 0 && suits.size === 1 && !hasHonor) {
        const s0 = [...suits][0] * 9;
        const pat = [3, 1, 1, 1, 1, 1, 1, 1, 3];
        if (pat.every((n, i) => c[s0 + i] >= n)) {
          const before = c.slice(); before[win]--;
          const pure = pat.every((n, i) => before[s0 + i] === n);
          yakuman.push(pure ? ['Pure Nine Gates', 2] : ['Nine Gates', 1]);
        }
      }

      // fu
      const pairFu = (isDragon(pair) ? 2 : 0) + (pair === seatT ? 2 : 0) + (pair === roundT ? 2 : 0);
      const pinfu = closed && seqs.length === 4 && pairFu === 0 && wait === 'ryanmen';
      let fu = 20;
      if (closed && !w.tsumo) fu += 10;
      for (const s of trips) {
        let f = isYaochu(s.t) ? 4 : 2;
        if (s.concealed) f *= 2;
        if (s.kind === 'kan') f *= 4;
        fu += f;
      }
      fu += pairFu;
      if (wait === 'kanchan' || wait === 'penchan' || wait === 'tanki') fu += 2;
      if (w.tsumo && !pinfu) fu += 2;
      if (pinfu && w.tsumo) fu = 20;
      if (!closed && fu === 20) fu = 30;
      fu = Math.ceil(fu / 10) * 10;

      // yaku
      const yaku = [...situational];
      if (pinfu) yaku.push(['Pinfu', 1]);
      if (allSimple) yaku.push(['All Simples', 1]);
      if (closed) {
        const seqKeys = seqs.map((s) => s.t).sort((a, b) => a - b);
        let peiko = 0;
        const seen = new Map();
        for (const k of seqKeys) seen.set(k, (seen.get(k) || 0) + 1);
        for (const n of seen.values()) peiko += Math.floor(n / 2);
        if (peiko === 2) yaku.push(['Twice Pure Double Sequence', 3]);
        else if (peiko === 1) yaku.push(['Pure Double Sequence', 1]);
      }
      for (const t of [31, 32, 33]) if (tripTypes.has(t)) yaku.push([['White Dragon', 'Green Dragon', 'Red Dragon'][t - 31], 1]);
      if (tripTypes.has(seatT)) yaku.push([`Seat Wind`, 1]);
      if (tripTypes.has(roundT)) yaku.push([`Round Wind`, 1]);
      // mixed triple sequence / pure straight
      for (let n = 0; n < 7; n++) if ([0, 9, 18].every((b) => seqs.some((s) => s.t === b + n))) { yaku.push(['Mixed Triple Sequence', closed ? 2 : 1]); break; }
      for (const b of [0, 9, 18]) if ([0, 3, 6].every((o) => seqs.some((s) => s.t === b + o))) { yaku.push(['Pure Straight', closed ? 2 : 1]); break; }
      for (let n = 0; n < 9; n++) if ([0, 9, 18].every((b) => tripTypes.has(b + n))) { yaku.push(['Triple Triplets', 2]); break; }
      // outside hands
      const setHasYaochu = (s) => (s.kind === 'seq' ? s.t % 9 === 0 || s.t % 9 === 6 : isYaochu(s.t));
      if (seqs.length && sets.every(setHasYaochu) && isYaochu(pair)) {
        const pure = !hasHonor;
        yaku.push(pure ? ['Terminals in All Sets', closed ? 3 : 2] : ['Half Outside Hand', closed ? 2 : 1]);
      }
      if (trips.length === 4) yaku.push(['All Triplets', 2]);
      if (concealedTrips === 3) yaku.push(['Three Concealed Triplets', 2]);
      if (kans === 3) yaku.push(['Three Kans', 2]);
      if (dragonTrips === 2 && isDragon(pair)) yaku.push(['Little Three Dragons', 2]);
      if (allTermHonor) yaku.push(['All Terminals and Honors', 2]);
      if (flush) yaku.push(flush);
      finish(yaku, yakuman, fu);
    }
  }

  if (!candidates.length) return null;
  const dealer = !!w.dealer;
  for (const k of candidates) k.total = totalFor(k.base, dealer, w.tsumo);
  candidates.sort((a, b) => b.total - a.total || b.han - a.han || b.fu - a.fu);
  return candidates[0];
}

// Does this ready hand have a yaku for some winning tile? (for the hint display and bots)
export function hasYakuFor(w) {
  return !!scoreWin(w);
}
