// Procedural valley generation. Deterministic per seed. Produces elevation, rivers and lakes (by
// priority-flood depression filling and flow accumulation), soil moisture, soil types, bedrock and
// vegetation.
import { makeNoise } from '../core/noise.js';
import { Rng } from '../core/rng.js';
import { World } from './world.js';
import { clamp, smooth } from '../core/units.js';
import { toPlane } from '../core/hex.js';

export function generateWorld(defs, { seed = 1, W = 192, H = 192 } = {}) {
  const w = new World(W, H);
  const rng = new Rng(seed).fork('worldgen');
  const nElev = makeNoise(rng.int(2 ** 31)), nRidge = makeNoise(rng.int(2 ** 31)), nMask = makeNoise(rng.int(2 ** 31));
  const nWet = makeNoise(rng.int(2 ** 31)), nSoil = makeNoise(rng.int(2 ** 31)), nRock = makeNoise(rng.int(2 ** 31));
  const nForest = makeNoise(rng.int(2 ** 31)), nPatch = makeNoise(rng.int(2 ** 31));
  const N = w.N;
  const px = new Float32Array(N), py = new Float32Array(N);
  let maxX = 0, maxY = 0;
  for (let i = 0; i < N; i++) { const [x, y] = toPlane(w.q[i], w.r[i], 1); px[i] = x; py[i] = y; maxX = Math.max(maxX, x); maxY = Math.max(maxY, y); }

  // --- elevation: rolling hills, ridged highlands where a mask allows, raised rim so the valley drains
  // through it, and a gentle tilt toward one side.
  const tilt = rng.range(0, Math.PI * 2), tx = Math.cos(tilt), ty = Math.sin(tilt);
  for (let i = 0; i < N; i++) {
    const x = px[i], y = py[i];
    const u = x / maxX - 0.5, v = y / maxY - 0.5;
    // Raised rim with a gap where the valley drains out (toward the low side of the tilt).
    const ang = Math.atan2(v, u), gap = Math.abs(Math.atan2(Math.sin(ang - tilt), Math.cos(ang - tilt)));
    const rim = smooth((Math.max(Math.abs(u), Math.abs(v)) - 0.34) / 0.16) * smooth((gap - 0.25) / 0.6);
    const hills = nElev.fbm(x * 0.011, y * 0.011, 5) * 0.5 + 0.5;
    const mask = smooth((nMask.fbm(x * 0.006, y * 0.006, 3) + 0.15) / 0.5);
    const ridges = nRidge.ridged(x * 0.018, y * 0.018, 4);
    let e = 14 + hills * 26 + mask * ridges * 46 + rim * 22 - (u * tx + v * ty) * 40;
    w.elev[i] = Math.max(0, e);
  }
  // Smooth once so single-hex spikes do not form cliffs everywhere.
  const tmp = new Float32Array(N);
  for (let i = 0; i < N; i++) { let s = w.elev[i] * 2, c = 2; for (const n of w.neighbors(i)) { s += w.elev[n]; c++; } tmp[i] = s / c; }
  w.elev.set(tmp);

  // --- hydrology: fill depressions from the map edge inward, then route flow downhill.
  const filled = priorityFlood(w);
  const order = Array.from({ length: N }, (_, i) => i).sort((a, b) => filled[b] - filled[a]);
  const down = new Int32Array(N).fill(-1), acc = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    let best = -1, be = filled[i];
    for (const n of w.neighbors(i)) if (filled[n] < be) { be = filled[n]; best = n; }
    down[i] = best;
  }
  for (const i of order) { acc[i] += 1 + rng.next() * 0.1; if (down[i] >= 0) acc[down[i]] += acc[i]; }
  const riverT = N / 90;
  w.genStats = { lake: 0, river: 0 };
  const isLake = new Uint8Array(N);
  for (let i = 0; i < N; i++) {
    const lake = filled[i] - w.elev[i];
    if (lake > 0.3) { w.baseWater[i] = Math.min(lake, 6); isLake[i] = 1; w.genStats.lake++; continue; }
    if (acc[i] > riverT) w.genStats.river++;
    if (acc[i] > riverT) {
      const depth = clamp(0.35 + 0.35 * Math.log(acc[i] / riverT), 0.35, 2.2);
      w.elev[i] -= depth * 0.6; w.baseWater[i] = depth;
    }
  }
  levelWater(w, isLake);
  for (let i = 0; i < N; i++) w.water[i] = w.baseWater[i];

  // --- moisture from distance to water, noise, and elevation
  const dWater = bfsDistance(w, i => w.water[i] > 0.05, 12);
  let eMin = Infinity, eMax = -Infinity;
  for (let i = 0; i < N; i++) { eMin = Math.min(eMin, w.elev[i]); eMax = Math.max(eMax, w.elev[i]); }
  w.elevMin = eMin; w.elevMax = eMax;
  const relE = (i) => (w.elev[i] - eMin) / (eMax - eMin + 1e-6);
  for (let i = 0; i < N; i++) {
    const near = dWater[i] < 0 ? 0 : clamp(1 - dWater[i] / 7, 0, 1);
    const n = nWet.fbm(px[i] * 0.02, py[i] * 0.02, 4) * 0.5 + 0.5;
    w.wetness[i] = clamp(near * 0.55 + n * 0.45 + 0.08 - relE(i) * 0.25, 0, 1);
    w.moist[i] = w.wetness[i];
  }

  // --- soils and bedrock
  const T = (id) => defs.must('terrain', id).index;
  const stones = ['granite', 'limestone', 'sandstone', 'slate'].map(id => defs.must('material', id).index);
  for (let i = 0; i < N; i++) {
    let slope = 0; for (const n of w.neighbors(i)) slope = Math.max(slope, Math.abs(w.elev[n] - w.elev[i]));
    const re = relE(i), wet = w.wetness[i], s = nSoil.fbm(px[i] * 0.03, py[i] * 0.03, 3);
    const rockN = nRock.fbm(px[i] * 0.008, py[i] * 0.008, 2);
    w.bedrock[i] = stones[rockN < -0.25 ? 0 : rockN < 0.05 ? 1 : rockN < 0.3 ? 2 : 3];
    let t;
    if (w.water[i] > 0.05) t = wet > 0.5 && s > 0 ? T('sand') : T('gravel');
    else if (slope > 5.2 && re > 0.35) t = T('rock');
    else if (slope > 3.6 && re > 0.3) t = T('scree');
    else if (dWater[i] === 1 && s > 0.15) t = T('sand');
    else if (wet > 0.86 && slope < 1.2) t = T('peat');
    else if (re > 0.72) t = s > 0 ? T('gravel') : T('loam');
    else if (s > 0.32) t = T('sand');
    else if (s < -0.3) t = T('clay');
    else t = T('loam');
    w.terrain[i] = t;
  }
  // Scatter boulder outcrops in highlands so stone is reachable.
  for (let i = 0; i < N; i++) if (w.terrain[i] !== T('rock') && w.water[i] === 0 && relE(i) > 0.45 && rng.chance(0.012)) w.terrain[i] = T('rock');

  // --- vegetation
  const forest = new Uint8Array(N);
  for (let i = 0; i < N; i++) {
    if (w.water[i] > 0.05) continue;
    const f = nForest.fbm(px[i] * 0.016, py[i] * 0.016, 4) + (w.wetness[i] - 0.5) * 0.3;
    forest[i] = f > 0.02 ? 2 : f > -0.07 ? 1 : 0; // 2 forest, 1 edge, 0 open
  }
  w.forestMask = forest;
  const flora = defs.all('flora').filter(f => f.habitat);
  const trees = flora.filter(f => f.form === 'tree' || f.form === 'conifer');
  const understory = flora.filter(f => f.form !== 'tree' && f.form !== 'conifer');
  const suit = (f, i) => {
    const h = f.habitat, tdef = defs.at('terrain', w.terrain[i]);
    if (!h.soils.includes(tdef.id)) return 0;
    const m = w.wetness[i], e = relE(i);
    if (m < h.moist[0] || m > h.moist[1] || e < h.elev[0] || e > h.elev[1]) return 0;
    if (h.nearWater && !(dWater[i] > 0 && dWater[i] <= h.nearWater)) return 0;
    const mid = 1 - Math.abs((m - (h.moist[0] + h.moist[1]) / 2) / ((h.moist[1] - h.moist[0]) / 2 + 1e-6));
    const patch = nPatch.fbm(px[i] * h.patch + f.index * 13.1, py[i] * h.patch - f.index * 7.7, 2) * 0.5 + 0.5;
    return (0.3 + 0.7 * mid) * (0.25 + patch * 1.5);
  };
  for (let i = 0; i < N; i++) {
    if (w.water[i] > 0.05 || defs.at('terrain', w.terrain[i]).move === Infinity) continue;
    let pick = null;
    if (forest[i] === 2 && rng.chance(0.62)) {
      pick = weightedPick(rng, trees, f => suit(f, i) * f.habitat.density);
    } else if (forest[i] >= 1 && rng.chance(0.2)) {
      pick = weightedPick(rng, trees.concat(understory.filter(f => f.habitat.edge)), f => suit(f, i) * f.habitat.density);
    }
    if (!pick) {
      const cands = understory.filter(f => (!f.habitat.forest || forest[i] >= 1) && (!f.habitat.edge || forest[i] === 1 || rng.chance(0.15)));
      // Rare plants roll individually first so meadow grass does not crowd them out.
      for (const f of cands) if (f.id !== 'grass' && rng.chance(suit(f, i) * f.habitat.density * 0.6)) { pick = f; break; }
      if (!pick) { const g = defs.get('flora', 'grass'); if (rng.chance(suit(g, i) * g.habitat.density * 1.4)) pick = g; }
      if (!pick && dWater[i] > 0 && dWater[i] <= 3) pick = weightedPick(rng, trees.filter(t => t.habitat.nearWater), f => suit(f, i));
    }
    if (pick) {
      w.flora[i] = pick.index;
      w.growth[i] = pick.form === 'tree' || pick.form === 'conifer' ? clamp(rng.range(0.25, 1.4), 0, 1) : 1;
      w.forage[i] = 1;
    }
  }
  w.version++;
  return w;
}

function weightedPick(rng, list, wf) {
  let tot = 0; const ws = list.map(f => { const v = Math.max(0, wf(f)); tot += v; return v; });
  if (tot <= 0) return null;
  let x = rng.next() * tot;
  for (let k = 0; k < list.length; k++) { x -= ws[k]; if (x <= 0) return list[k]; }
  return list[list.length - 1];
}

// Priority-flood with limited breaching: from the map edge inward, a pit is drained by cutting a channel
// back along the path to the edge when the cut is shallow (rivers carve through low saddles); deeper pits
// are filled and become lakes. Returns the water surface; may lower w.elev along cut channels.
function priorityFlood(w, breachMax = 1.4) {
  const N = w.N, surf = Float32Array.from(w.elev), done = new Uint8Array(N), parent = new Int32Array(N).fill(-1);
  const heap = new MinHeap(), eps = 0.002;
  for (let i = 0; i < N; i++) {
    const c = w.col(i), r = w.row(i);
    if (c === 0 || r === 0 || c === w.W - 1 || r === w.H - 1) { done[i] = 1; heap.push(i, surf[i]); }
  }
  while (heap.size) {
    const c = heap.pop();
    for (const n of w.neighbors(c)) {
      if (done[n]) continue; done[n] = 1; parent[n] = c;
      if (surf[n] <= surf[c]) {
        let k = c, lvl = surf[n] - eps, cut = 0, steps = 0;
        while (k >= 0 && surf[k] >= lvl && steps < 600) { cut = Math.max(cut, surf[k] - lvl); lvl -= eps; k = parent[k]; steps++; }
        if (cut < breachMax) {
          k = c; lvl = surf[n] - eps;
          while (k >= 0 && surf[k] >= lvl) { surf[k] = lvl; w.elev[k] = Math.min(w.elev[k], lvl); lvl -= eps; k = parent[k]; }
        } else surf[n] = surf[c] + eps;
      }
      heap.push(n, surf[n]);
    }
  }
  return surf;
}

export function bfsDistance(w, isSource, maxD) {
  const d = new Int16Array(w.N).fill(-1), q = [];
  for (let i = 0; i < w.N; i++) if (isSource(i)) { d[i] = 0; q.push(i); }
  for (let h = 0; h < q.length; h++) {
    const c = q[h]; if (d[c] >= maxD) continue;
    for (const n of w.neighbors(c)) if (d[n] < 0) { d[n] = d[c] + 1; q.push(n); }
  }
  return d;
}

export class MinHeap {
  constructor() { this.k = []; this.v = []; }
  get size() { return this.k.length; }
  push(key, val) {
    const k = this.k, v = this.v; let i = k.length; k.push(key); v.push(val);
    while (i > 0) { const p = (i - 1) >> 1; if (v[p] <= val) break; k[i] = k[p]; v[i] = v[p]; i = p; }
    k[i] = key; v[i] = val;
  }
  pop() {
    const k = this.k, v = this.v, top = k[0], lk = k.pop(), lv = v.pop(), n = k.length;
    if (n > 0) {
      let i = 0;
      while (true) {
        let l = 2 * i + 1, r = l + 1, m = i, mv = lv;
        if (l < n && v[l] < mv) { m = l; mv = v[l]; }
        if (r < n && v[r] < mv) { m = r; mv = v[r]; }
        if (m === i) break;
        k[i] = k[m]; v[i] = v[m]; i = m;
      }
      k[i] = lk; v[i] = lv;
    }
    return top;
  }
}

// Water cannot stand above its banks. Breached outlets and carved channels can leave a lake or river hex
// with a surface higher than the dry ground next to it, which looks (and would behave) like a perched
// pond. Lower each surface to its lowest dry neighbour, keep every lake flat at the level of its lowest
// point, let lake margins that end up shallower than 5 cm become dry ground, and deepen river beds so a
// lowered river keeps its depth.
function levelWater(w, isLake) {
  const N = w.N, surf = new Float32Array(N);
  const wet = (i) => w.baseWater[i] > 0.05;
  for (let i = 0; i < N; i++) surf[i] = wet(i) ? w.elev[i] + w.baseWater[i] : w.elev[i];
  for (let pass = 0; pass < 200; pass++) {
    let changed = false;
    for (let i = 0; i < N; i++) {
      if (!wet(i)) continue;
      let cap = surf[i];
      for (const n of w.neighbors(i)) {
        if (!wet(n)) cap = Math.min(cap, w.elev[n] + 0.05);
        else if (isLake[i] && isLake[n]) cap = Math.min(cap, surf[n]);
      }
      if (cap < surf[i] - 1e-4) {
        surf[i] = cap; changed = true;
        if (isLake[i]) {
          w.baseWater[i] = Math.min(6, surf[i] - w.elev[i]);
          if (w.baseWater[i] <= 0.05) { w.baseWater[i] = 0; isLake[i] = 0; surf[i] = w.elev[i]; }
        } else w.elev[i] = surf[i] - w.baseWater[i];
      }
    }
    if (!changed) break;
  }
}
