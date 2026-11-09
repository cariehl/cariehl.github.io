// Track geometry. A tile is one unit square; tile (x, z) spans [x, x+1] x [z, z+1].
// Edges: 0 north (-z), 1 east (+x), 2 south (+z), 3 west (-x). A track tile is a bitmask of its edges.
// A segment is one pass through one tile, from edge a to edge b; -1 means the tile's centre (a dead end).

export const DX = [0, 1, 0, -1];
export const DZ = [-1, 0, 1, 0];
export const opp = e => (e + 2) & 3;
export const edgesOf = mask => [0, 1, 2, 3].filter(e => mask & (1 << e));
export const countEdges = mask => ((mask & 1) + ((mask >> 1) & 1) + ((mask >> 2) & 1) + ((mask >> 3) & 1));

function endpoint(x, z, e) {
  return e < 0 ? [x + 0.5, z + 0.5] : [x + 0.5 + DX[e] * 0.5, z + 0.5 + DZ[e] * 0.5];
}

export function makeSeg(x, z, a, b) {
  let len;
  if (a < 0 || b < 0) len = 0.5;
  else if ((a ^ b) === 2) len = 1;
  else len = Math.PI / 4;
  return { x, z, a, b, len };
}
export const reverseSeg = s => makeSeg(s.x, s.z, s.b, s.a);

// Position and unit direction of travel at distance s along a segment.
export function segPoint(seg, s) {
  const t = Math.max(0, Math.min(1, s / seg.len));
  const { x, z, a, b } = seg;
  const p0 = endpoint(x, z, a), p1 = endpoint(x, z, b);
  if (a < 0 || b < 0 || (a ^ b) === 2) {
    const dx = p1[0] - p0[0], dz = p1[1] - p0[1], l = Math.hypot(dx, dz) || 1;
    return { x: p0[0] + dx * t, z: p0[1] + dz * t, dx: dx / l, dz: dz / l };
  }
  // Quarter circle of radius 1/2 about the corner the two edges share.
  const cx = x + 0.5 + (DX[a] + DX[b]) * 0.5, cz = z + 0.5 + (DZ[a] + DZ[b]) * 0.5;
  const v0 = [-0.5 * DX[b], -0.5 * DZ[b]], v1 = [-0.5 * DX[a], -0.5 * DZ[a]];
  const th = t * Math.PI / 2, c = Math.cos(th), sn = Math.sin(th);
  const tx = -v0[0] * sn + v1[0] * c, tz = -v0[1] * sn + v1[1] * c, l = Math.hypot(tx, tz) || 1;
  return { x: cx + v0[0] * c + v1[0] * sn, z: cz + v0[1] * c + v1[1] * sn, dx: tx / l, dz: tz / l };
}

// Which way a train leaving edge `entry` goes through a tile with edges `mask` and switch state `sw`.
// Returns the exit edge, or -1 for a dead end (the train runs to the middle and stops).
export function chooseExit(mask, entry, sw) {
  const exits = edgesOf(mask).filter(e => e !== entry);
  if (!exits.length) return -1;
  if (exits.length === 1) return exits[0];
  if (exits.length === 3) return opp(entry); // a crossing: straight over
  // A junction: the switch picks. With the straight route available, sw 0 is straight on.
  const straight = exits.find(e => e === opp(entry));
  if (straight !== undefined) {
    const other = exits.find(e => e !== straight);
    return sw ? other : straight;
  }
  return exits[sw & 1];
}

// How a tile's track is drawn: pieces of { kind: 'straight' | 'curve' | 'end', rot } where rot is a
// quarter turn count about +y. Straight runs along z; the curve joins west and south; the end joins south.
export function pieces(mask) {
  const es = edgesOf(mask);
  if (!es.length) return [];
  if (es.length === 1) return [{ kind: 'end', rot: END_ROT[es[0]], edges: [es[0]] }];
  const out = [];
  if (es.length === 4) return [{ kind: 'straight', rot: 0, edges: [0, 2] }, { kind: 'straight', rot: 1, edges: [1, 3] }];
  for (let i = 0; i < es.length; i++) for (let j = i + 1; j < es.length; j++) {
    const a = es[i], b = es[j];
    if ((a ^ b) === 2) out.push({ kind: 'straight', rot: a === 0 ? 0 : 1, edges: [a, b] });
    else out.push({ kind: 'curve', rot: curveRot(a, b), edges: [a, b] });
  }
  return out;
}
// Quarter turns that carry the model's south (+z) end to edge e.
const END_ROT = [2, 1, 0, 3];
function curveRot(a, b) {
  const k = (1 << a) | (1 << b);
  // west+south 0, south+east 1, east+north 2, north+west 3
  return { 12: 0, 6: 1, 3: 2, 9: 3 }[k];
}
