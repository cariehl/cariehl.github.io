// The world grid: pointy-top hexes in odd-r offset rows, stored as typed arrays (structure of arrays).
// Static fields are regenerated from the seed on load; mutable fields are saved.
import { DIRS, offsetToAxial, axialToOffset, distance } from '../core/hex.js';

export const STATIC_FIELDS = { elev: Float32Array, bedrock: Uint8Array, wetness: Float32Array, baseWater: Float32Array };
export const MUTABLE_FIELDS = {
  terrain: Uint8Array,     // terrain def index
  water: Float32Array,     // standing water depth, m (lakes and rivers)
  ice: Float32Array,       // ice thickness on water, m
  snow: Float32Array,      // snow depth, m
  moist: Float32Array,     // soil moisture 0..1
  flora: Uint8Array,       // flora def index, 0 = bare
  growth: Float32Array,    // flora maturity 0..1 (crops and young trees)
  yield: Float32Array,     // harvestable units on the plant now
  forage: Float32Array,    // grazing biomass remaining as a fraction of the plant's maximum
  regrow: Float32Array,    // days until picked plant refills
  struct: Uint8Array,      // wall/door structure def index, 0 = none
  structHp: Float32Array,
  structMat: Uint8Array,   // material index for walls built of a material
  roof: Uint8Array,        // roof structure def index
  fire: Float32Array,      // wildfire intensity 0..1 on the hex
  burnt: Float32Array,     // hours since burnt (for scorched look), 0 = never
  desig: Uint8Array,       // designation bitmask (DESIG)
  zone: Uint16Array,       // zone id, 0 = none
  seen: Uint8Array,        // explored by any settler
};
export const DESIG = { chop: 1, gather: 2, mine: 4, clear: 8, dig: 16, fish: 32 };

export class World {
  constructor(W, H) {
    this.W = W; this.H = H; const N = this.N = W * H;
    for (const [k, T] of Object.entries(STATIC_FIELDS)) this[k] = new T(N);
    for (const [k, T] of Object.entries(MUTABLE_FIELDS)) this[k] = new T(N);
    this.q = new Int16Array(N); this.r = new Int16Array(N);
    this.nb = new Int32Array(N * 6).fill(-1);
    for (let row = 0; row < H; row++) for (let col = 0; col < W; col++) {
      const i = row * W + col, [q, r] = offsetToAxial(col, row);
      this.q[i] = q; this.r[i] = r;
    }
    for (let i = 0; i < N; i++) for (let d = 0; d < 6; d++) {
      this.nb[i * 6 + d] = this.idx(this.q[i] + DIRS[d][0], this.r[i] + DIRS[d][1]);
    }
    this.room = new Int32Array(N);     // derived: room id per hex, 0 = outdoors
    this.version = 0;                  // bumps when terrain/structures change (renderer caches)
  }
  idx(q, r) {
    const [col, row] = axialToOffset(q, r);
    if (col < 0 || row < 0 || col >= this.W || row >= this.H) return -1;
    return row * this.W + col;
  }
  col(i) { return i % this.W; }
  row(i) { return (i / this.W) | 0; }
  dist(a, b) { return distance(this.q[a], this.r[a], this.q[b], this.r[b]); }
  neighbors(i) { const o = []; for (let d = 0; d < 6; d++) { const n = this.nb[i * 6 + d]; if (n >= 0) o.push(n); } return o; }
  within(i, n) {
    const out = [], q0 = this.q[i], r0 = this.r[i];
    for (let dq = -n; dq <= n; dq++) {
      const lo = Math.max(-n, -dq - n), hi = Math.min(n, -dq + n);
      for (let dr = lo; dr <= hi; dr++) { const j = this.idx(q0 + dq, r0 + dr); if (j >= 0) out.push(j); }
    }
    return out;
  }
  surface(i) { return this.elev[i] + this.water[i]; }
  isWater(i) { return this.water[i] > 0.05; }
}
