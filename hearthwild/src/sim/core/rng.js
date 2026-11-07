// Seeded random numbers. The whole simulation draws from one Rng so a seed plus a command list replays
// exactly. State is a single uint32, which makes saving trivial.
export function hashStr(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

export class Rng {
  constructor(seed = 1) { this.s = (typeof seed === 'string' ? hashStr(seed) : seed) >>> 0; }
  next() { // mulberry32
    let t = (this.s = (this.s + 0x6D2B79F5) >>> 0);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  range(a, b) { return a + (b - a) * this.next(); }
  int(n) { return Math.floor(this.next() * n); }
  chance(p) { return this.next() < p; }
  pick(a) { return a[Math.floor(this.next() * a.length)]; }
  normal(mu = 0, sd = 1) {
    const u = 1 - this.next(), v = this.next();
    return mu + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  weighted(items, w) {
    let tot = 0; for (const it of items) tot += Math.max(0, w(it));
    let x = this.next() * tot;
    for (const it of items) { x -= Math.max(0, w(it)); if (x <= 0) return it; }
    return items[items.length - 1];
  }
  // Probability that an event with a mean rate (per second) happens at least once within dt seconds.
  poisson(ratePerSec, dt) { return this.next() < 1 - Math.exp(-ratePerSec * dt); }
  fork(label) { return new Rng((this.s ^ hashStr(String(label))) >>> 0); }
}
