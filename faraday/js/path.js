// A* over the tile grid for robots. Doors, windows and built walls are passable at a cost:
// the robot breaks through when it gets there.
import { W, H, S, idx, bashCost } from './world.js';

const N = W * H;
const gScore = new Float32Array(N);
const came = new Int32Array(N);
const stamp = new Uint32Array(N);
const closed = new Uint32Array(N);
let gen = 1;

// heap of node indices keyed by f
const heapI = new Int32Array(N * 2);
const heapF = new Float32Array(N * 2);
let heapN = 0;
function push(i, f) {
  let k = heapN++;
  heapI[k] = i; heapF[k] = f;
  while (k > 0) {
    const p = (k - 1) >> 1;
    if (heapF[p] <= heapF[k]) break;
    swap(p, k); k = p;
  }
}
function pop() {
  const top = heapI[0];
  heapN--;
  if (heapN > 0) {
    heapI[0] = heapI[heapN]; heapF[0] = heapF[heapN];
    let k = 0;
    for (;;) {
      const l = k * 2 + 1, r = l + 1;
      let m = k;
      if (l < heapN && heapF[l] < heapF[m]) m = l;
      if (r < heapN && heapF[r] < heapF[m]) m = r;
      if (m === k) break;
      swap(m, k); k = m;
    }
  }
  return top;
}
function swap(a, b) {
  const ti = heapI[a]; heapI[a] = heapI[b]; heapI[b] = ti;
  const tf = heapF[a]; heapF[a] = heapF[b]; heapF[b] = tf;
}

// Cost of stepping onto tile i for this robot (Infinity = never).
export function tileCost(w, x, y, def) {
  if (x < 0 || y < 0 || x >= W || y >= H) return Infinity;
  const i = idx(x, y), s = w.struct[i];
  switch (s) {
    case S.NONE: return 1;
    case S.BUSH: return def.flies ? 1 : 1.4;
    case S.WALL: return Infinity;
    case S.TREE: case S.FURN: return def.flies ? 1 : Infinity;
    case S.FENCE: return def.flies ? 1 : 1 + bashCost(w, x, y, def);
    case S.DOOR: case S.WINDOW: case S.BWALL: return 1 + bashCost(w, x, y, def);
    default: return Infinity;
  }
}

// Returns an array of tile indices from (but not including) the start to the goal, or the
// way to the closest reachable tile when the goal can't be reached within the budget.
export function findPath(w, sx, sy, gx, gy, def, budget = 3500) {
  gen++;
  if (gen > 0xfffffff0) { stamp.fill(0); closed.fill(0); gen = 1; }
  heapN = 0;
  const start = idx(sx, sy), goal = idx(gx, gy);
  if (start === goal) return [];
  gScore[start] = 0; stamp[start] = gen; came[start] = -1;
  push(start, h(sx, sy, gx, gy));
  let best = start, bestH = h(sx, sy, gx, gy);
  let expanded = 0;
  while (heapN > 0) {
    const cur = pop();
    if (closed[cur] === gen) continue;
    closed[cur] = gen;
    if (cur === goal) { best = cur; break; }
    if (++expanded > budget) break;
    const cx = cur % W, cy = (cur / W) | 0;
    const cg = gScore[cur];
    for (let d = 0; d < 8; d++) {
      const dx = DX[d], dy = DY[d];
      const nx = cx + dx, ny = cy + dy;
      let c = tileCost(w, nx, ny, def);
      if (c === Infinity) continue;
      if (dx !== 0 && dy !== 0) {
        // no cutting corners, and no diagonal steps through doors or windows
        if (tileCost(w, cx + dx, cy, def) !== 1 && !(def.flies && tileCost(w, cx + dx, cy, def) < 2)) continue;
        if (tileCost(w, cx, cy + dy, def) !== 1 && !(def.flies && tileCost(w, cx, cy + dy, def) < 2)) continue;
        if (c > 1.5) continue;
        c *= 1.414;
      }
      const ni = idx(nx, ny);
      const ng = cg + c;
      if (stamp[ni] === gen && ng >= gScore[ni]) continue;
      stamp[ni] = gen; gScore[ni] = ng; came[ni] = cur;
      const hh = h(nx, ny, gx, gy);
      if (hh < bestH) { bestH = hh; best = ni; }
      push(ni, ng + hh);
    }
  }
  const out = [];
  let k = best;
  while (k !== start && k !== -1) { out.push(k); k = came[k]; }
  out.reverse();
  return out;
}

const DX = [1, -1, 0, 0, 1, 1, -1, -1];
const DY = [0, 0, 1, -1, 1, -1, 1, -1];
function h(x, y, gx, gy) {
  const dx = Math.abs(x - gx), dy = Math.abs(y - gy);
  return Math.max(dx, dy) + 0.414 * Math.min(dx, dy);
}
