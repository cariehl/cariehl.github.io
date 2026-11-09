// Shanten (tiles away from ready; -1 = complete) for regular hands, seven pairs and thirteen orphans.
// Each suit is solved on its own and cached, then the suits are combined.

const cache = new Map();

// For one suit (9 counts) or the honors (7 counts, no runs): best taatsu count for each (sets, pair).
function groupOptions(c, start, len, runs) {
  let key = runs ? 'n' : 'h';
  for (let i = 0; i < len; i++) key += c[start + i];
  let res = cache.get(key);
  if (res) return res;
  const a = c.slice(start, start + len);
  res = new Int8Array(10).fill(-1); // index m*2+p -> max t
  const rec = (i, m, t, p) => {
    while (i < len && !a[i]) i++;
    if (i >= len) {
      if (m <= 4) { const k = m * 2 + p; if (t > res[k]) res[k] = t; }
      return;
    }
    if (a[i] >= 3) { a[i] -= 3; rec(i, m + 1, t, p); a[i] += 3; }
    if (runs && i <= 6 && a[i + 1] && a[i + 2]) { a[i]--; a[i + 1]--; a[i + 2]--; rec(i, m + 1, t, p); a[i]++; a[i + 1]++; a[i + 2]++; }
    if (a[i] >= 2) { a[i] -= 2; if (!p) rec(i, m, t, 1); rec(i, m, t + 1, p); a[i] += 2; }
    if (runs && i <= 7 && a[i + 1]) { a[i]--; a[i + 1]--; rec(i, m, t + 1, p); a[i]++; a[i + 1]++; }
    if (runs && i <= 6 && a[i + 2]) { a[i]--; a[i + 2]--; rec(i, m, t + 1, p); a[i]++; a[i + 2]++; }
    const n = a[i]; a[i] = 0; rec(i + 1, m, t, p); a[i] = n;
  };
  rec(0, 0, 0, 0);
  cache.set(key, res);
  return res;
}

export function shantenRegular(c, melds = 0) {
  const groups = [groupOptions(c, 0, 9, true), groupOptions(c, 9, 9, true), groupOptions(c, 18, 9, true), groupOptions(c, 27, 7, false)];
  let best = 8;
  // combine: state is array indexed m*2+p with max t
  let acc = new Int8Array(10).fill(-1);
  acc[melds * 2] = 0;
  for (const g of groups) {
    const next = new Int8Array(10).fill(-1);
    for (let k1 = 0; k1 < 10; k1++) {
      if (acc[k1] < 0) continue;
      for (let k2 = 0; k2 < 10; k2++) {
        if (g[k2] < 0) continue;
        const m = (k1 >> 1) + (k2 >> 1), p = (k1 & 1) + (k2 & 1);
        if (m > 4 || p > 1) continue;
        const k = m * 2 + p, t = acc[k1] + g[k2];
        if (t > next[k]) next[k] = t;
      }
    }
    acc = next;
  }
  for (let k = 0; k < 10; k++) {
    if (acc[k] < 0) continue;
    const m = k >> 1, p = k & 1;
    const s = 8 - 2 * m - Math.min(acc[k], 4 - m) - p;
    if (s < best) best = s;
  }
  return best;
}

export function shantenChiitoi(c) {
  let pairs = 0, kinds = 0;
  for (let t = 0; t < 34; t++) { if (c[t]) kinds++; if (c[t] >= 2) pairs++; }
  return 6 - pairs + Math.max(0, 7 - kinds);
}

const YAOCHU = [0, 8, 9, 17, 18, 26, 27, 28, 29, 30, 31, 32, 33];
export function shantenKokushi(c) {
  let k = 0, pair = 0;
  for (const t of YAOCHU) if (c[t]) { k++; if (c[t] >= 2) pair = 1; }
  return 13 - k - pair;
}

export function shanten(c, melds = 0) {
  let s = shantenRegular(c, melds);
  if (melds === 0) s = Math.min(s, shantenChiitoi(c), shantenKokushi(c));
  return s;
}

// Tile types that complete a ready hand (13 - 3*melds tiles). Waits on a fifth copy don't count.
export function waitsOf(c, melds = 0) {
  const out = [];
  for (let t = 0; t < 34; t++) {
    if (c[t] >= 4) continue;
    c[t]++;
    if (shanten(c, melds) === -1) out.push(t);
    c[t]--;
  }
  return out;
}

export function isComplete(c, melds = 0) {
  return shanten(c, melds) === -1;
}
