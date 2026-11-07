// Movement cost and pathfinding. Cost is seconds to walk from one hex to a neighbour at normal pace:
// Tobler's hiking function on the slope, times terrain, vegetation, snow and water.
import { MinHeap } from './worldgen.js';
import { HEX_M } from '../core/units.js';

const FLAT_KMH = 6 * Math.exp(-3.5 * 0.05);

export function stepCost(sim, a, b) {
  const w = sim.world, defs = sim.defs;
  if (blocked(sim, b)) return Infinity;
  const dh = w.elev[b] - w.elev[a];
  if (Math.abs(dh) > 2.4) return Infinity;
  const kmh = 6 * Math.exp(-3.5 * Math.abs(dh / HEX_M + 0.05));
  let c = (HEX_M / 1.4) * (FLAT_KMH / kmh);
  c *= defs.at('terrain', w.terrain[b]).move;
  const f = w.flora[b]; if (f) c *= defs.at('flora', f).move;
  const s = w.snow[b]; if (s > 0.02) c *= 1 + s * 2.5;
  const d = w.water[b]; if (d > 0.05 && w.ice[b] < 0.08) c *= 1 + d * 5;
  if (w.struct[b] && defs.at('structure', w.struct[b]).type === 'door') c *= 1.3;
  return c;
}

export function blocked(sim, i) {
  const w = sim.world;
  if (w.struct[i] && sim.defs.at('structure', w.struct[i]).type === 'wall') return true;
  if (sim.defs.at('terrain', w.terrain[i]).move === Infinity) return true;
  if (w.water[i] > 0.95 && w.ice[i] < 0.08) return true;
  if (sim.blockers && sim.blockers.has(i)) return true;
  return false;
}

export const passable = (sim, i) => i >= 0 && !blocked(sim, i);

let gen = 1, G = null, STAMP = null, FROM = null, CLOSED = null;
function scratch(N) {
  if (!G || G.length !== N) { G = new Float32Array(N); STAMP = new Uint32Array(N); FROM = new Int32Array(N); CLOSED = new Uint32Array(N); gen = 1; }
  gen++;
}

// A* from start to goal (an index), or to any hex where goal(i) is true when goal is a function (then
// it is a Dijkstra search). opts.adjacent: finishing next to the goal hex is enough (for blocked targets).
export function findPath(sim, start, goal, opts = {}) {
  const w = sim.world, N = w.N, maxCost = opts.maxCost ?? Infinity, maxNodes = opts.maxNodes ?? 40000;
  scratch(N);
  const isFn = typeof goal === 'function';
  const adj = !!opts.adjacent;
  const done = isFn ? goal : adj ? (i) => i === goal || w.dist(i, goal) <= 1 : (i) => i === goal;
  if (!isFn && !adj && blocked(sim, goal)) return null;
  const h = isFn ? () => 0 : (i) => w.dist(i, goal) * 1.9; // a little under the cheapest step for admissibility
  const heap = new MinHeap();
  G[start] = 0; STAMP[start] = gen; FROM[start] = -1; heap.push(start, h(start));
  let expanded = 0;
  while (heap.size) {
    const c = heap.pop();
    if (CLOSED[c] === gen) continue; CLOSED[c] = gen;
    if (done(c)) return rebuild(c, start, G[c]);
    if (++expanded > maxNodes) return null;
    const gc = G[c];
    for (let d = 0; d < 6; d++) {
      const n = w.nb[c * 6 + d]; if (n < 0 || CLOSED[n] === gen) continue;
      const sc = stepCost(sim, c, n); if (sc === Infinity) continue;
      const g = gc + sc; if (g > maxCost) continue;
      if (STAMP[n] !== gen || g < G[n]) { STAMP[n] = gen; G[n] = g; FROM[n] = c; heap.push(n, g + h(n)); }
    }
  }
  return null;
}

function rebuild(end, start, cost) {
  const p = []; let c = end;
  while (c !== start && c >= 0) { p.push(c); c = FROM[c]; }
  p.reverse();
  return { path: p, cost, end };
}

// Every hex reachable within maxCost seconds, with its cost. Used for "what is near me" questions.
export function reachMap(sim, start, maxCost) {
  const w = sim.world, out = new Map(), heap = new MinHeap();
  out.set(start, 0); heap.push(start, 0);
  while (heap.size) {
    const c = heap.pop(), gc = out.get(c);
    for (let d = 0; d < 6; d++) {
      const n = w.nb[c * 6 + d]; if (n < 0) continue;
      const sc = stepCost(sim, c, n); if (sc === Infinity) continue;
      const g = gc + sc; if (g > maxCost) continue;
      const old = out.get(n); if (old === undefined || g < old) { out.set(n, g); heap.push(n, g); }
    }
  }
  return out;
}
