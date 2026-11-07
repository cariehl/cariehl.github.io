// Voxel Studio: bones, poses and turning a pose into voxel art. No DOM in here.
//
// A bone is a segment from head to tail in grid space, with an optional parent. Every voxel of the
// model belongs to at most one bone (the skin; 0 means it never moves). A pose gives each bone a
// rotation q (a unit quaternion [x, y, z, w], about its head, in its parent's frame) and an offset t.
//
// Posing never moves voxels around smoothly. bake() asks, for every cell of the output grid, which
// voxel of the rest model would land there, and copies its colour: nearest-neighbour resampling,
// which gives the same stair-stepped look as hand-drawn pixel art.
(function (root) {
'use strict';
const G = (typeof module === 'object' && module.exports) ? require('./grid.js') : root.VXGrid;

// ---------- quaternions ----------
const QI = () => [0, 0, 0, 1];
function qMul(a, b) {
  return [
    a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
    a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
    a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
    a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2],
  ];
}
function qConj(q) { return [-q[0], -q[1], -q[2], q[3]]; }
function qNorm(q) { const l = Math.hypot(q[0], q[1], q[2], q[3]) || 1; return [q[0] / l, q[1] / l, q[2] / l, q[3] / l]; }
function qRot(q, v) {
  const tx = 2 * (q[1] * v[2] - q[2] * v[1]), ty = 2 * (q[2] * v[0] - q[0] * v[2]), tz = 2 * (q[0] * v[1] - q[1] * v[0]);
  return [
    v[0] + q[3] * tx + (q[1] * tz - q[2] * ty),
    v[1] + q[3] * ty + (q[2] * tx - q[0] * tz),
    v[2] + q[3] * tz + (q[0] * ty - q[1] * tx),
  ];
}
function qAxisAngle(axis, rad) {
  const l = Math.hypot(axis[0], axis[1], axis[2]) || 1, s = Math.sin(rad / 2);
  return [axis[0] / l * s, axis[1] / l * s, axis[2] / l * s, Math.cos(rad / 2)];
}
// Euler angles in degrees, applied X, then Y, then Z (about fixed axes).
function qFromEuler(e) {
  const r = Math.PI / 360;
  const cx = Math.cos(e[0] * r), sx = Math.sin(e[0] * r), cy = Math.cos(e[1] * r), sy = Math.sin(e[1] * r), cz = Math.cos(e[2] * r), sz = Math.sin(e[2] * r);
  return [
    sx * cy * cz - cx * sy * sz,
    cx * sy * cz + sx * cy * sz,
    cx * cy * sz - sx * sy * cz,
    cx * cy * cz + sx * sy * sz,
  ];
}
function qToEuler(q) {
  const [x, y, z, w] = q, d = 180 / Math.PI;
  return [
    Math.atan2(2 * (w * x + y * z), 1 - 2 * (x * x + y * y)) * d,
    Math.asin(Math.max(-1, Math.min(1, 2 * (w * y - z * x)))) * d,
    Math.atan2(2 * (w * z + x * y), 1 - 2 * (y * y + z * z)) * d,
  ];
}
function qSlerp(a, b, t) {
  let d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  if (d < 0) { b = [-b[0], -b[1], -b[2], -b[3]]; d = -d; }
  if (d > 0.9995) return qNorm(a.map((v, i) => v + (b[i] - v) * t));
  const th = Math.acos(d), s = Math.sin(th);
  const wa = Math.sin((1 - t) * th) / s, wb = Math.sin(t * th) / s;
  return a.map((v, i) => v * wa + b[i] * wb);
}
const lerp3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const add3 = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub3 = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];

// ---------- bones ----------
// Parents before children.
function boneOrder(bones) {
  const byId = new Map(bones.map(b => [b.id, b]));
  const out = [], done = new Set();
  const visit = (b, depth) => {
    if (done.has(b.id) || depth > bones.length) return;
    const p = b.parent != null ? byId.get(b.parent) : null;
    if (p) visit(p, depth + 1);
    if (!done.has(b.id)) { done.add(b.id); out.push(b); }
  };
  for (const b of bones) visit(b, 0);
  return out;
}

function addBone(rig, head, tail, parent, name) {
  const id = rig.nextId++;
  const b = { id, name: name || 'Bone ' + id, parent: parent == null ? null : parent, head: head.slice(), tail: tail.slice(), color: G.boneColor(rig.bones.length) };
  rig.bones.push(b);
  return b;
}

// Removes a bone; its children move up to its parent, and its voxels go to the parent too.
function removeBone(rig, id) {
  const i = rig.bones.findIndex(b => b.id === id);
  if (i < 0) return;
  const gone = rig.bones[i];
  const parentIdx = gone.parent != null ? rig.bones.findIndex(b => b.id === gone.parent) : -1;
  for (const b of rig.bones) if (b.parent === id) b.parent = gone.parent;
  const skin = rig.skin;
  for (let k = 0; k < skin.length; k++) {
    const s = skin[k];
    if (s === i + 1) skin[k] = parentIdx >= 0 ? (parentIdx < i ? parentIdx + 1 : parentIdx) : 0;
    else if (s > i + 1) skin[k] = s - 1;
  }
  rig.bones.splice(i, 1);
}

// Copies a bone (and the voxels skinned to it) to the other side of the model, across x = X/2.
function mirrorName(n) {
  if (/\bL\b|Left|left/.test(n)) return n.replace(/\bL\b/, 'R').replace('Left', 'Right').replace('left', 'right');
  if (/\bR\b|Right|right/.test(n)) return n.replace(/\bR\b/, 'L').replace('Right', 'Left').replace('right', 'left');
  return n + ' (mirror)';
}
function mirrorBone(rig, size, id, model) {
  const src = rig.bones.find(b => b.id === id);
  if (!src) return null;
  const X = size[0];
  const flip = p => [X - p[0], p[1], p[2]];
  // The mirror of the parent, if one exists at the mirrored spot; otherwise the same parent.
  let parent = src.parent;
  const pb = rig.bones.find(b => b.id === src.parent);
  if (pb) {
    const want = flip(pb.head);
    const m = rig.bones.find(b => b !== pb && Math.hypot(...sub3(b.head, want)) < 0.6);
    if (m) parent = m.id;
  }
  const b = addBone(rig, flip(src.head), flip(src.tail), parent, mirrorName(src.name));
  if (model) {
    const si = rig.bones.indexOf(src) + 1, ni = rig.bones.length;
    for (let y = 0; y < size[1]; y++) for (let z = 0; z < size[2]; z++) for (let x = 0; x < X; x++) {
      if (rig.skin[G.idx(size, x, y, z)] !== si) continue;
      const j = G.idx(size, X - 1 - x, y, z);
      if (model[j]) rig.skin[j] = ni;
    }
  }
  return b;
}

function segDist2(p, a, b) {
  const ab = sub3(b, a), ap = sub3(p, a);
  const l2 = ab[0] * ab[0] + ab[1] * ab[1] + ab[2] * ab[2];
  let t = l2 > 1e-9 ? (ap[0] * ab[0] + ap[1] * ab[1] + ap[2] * ab[2]) / l2 : 0;
  t = Math.max(0, Math.min(1, t));
  const dx = ap[0] - ab[0] * t, dy = ap[1] - ab[1] * t, dz = ap[2] - ab[2] * t;
  return dx * dx + dy * dy + dz * dz;
}

// Gives every solid voxel to the nearest bone. Returns the number of voxels skinned.
function autoSkin(rig, model, size) {
  const skin = rig.skin;
  skin.fill(0);
  if (!rig.bones.length) return 0;
  let n = 0;
  for (let i = 0; i < model.length; i++) {
    if (!model[i]) continue;
    const c = G.coords(size, i), p = [c[0] + 0.5, c[1] + 0.5, c[2] + 0.5];
    let best = 0, bd = Infinity;
    rig.bones.forEach((b, k) => { const d = segDist2(p, b.head, b.tail); if (d < bd - 1e-9) { bd = d; best = k + 1; } });
    skin[i] = best; n++;
  }
  return n;
}

// ---------- poses ----------
// World transform of every bone for a pose: maps a rest-space point x to W x + o.
function solve(bones, pose) {
  const out = new Map();
  for (const b of boneOrder(bones)) {
    const p = (pose && pose[b.id]) || {};
    const q = p.q || QI(), t = p.t || [0, 0, 0];
    // local: x -> q (x - head) + head + t
    const lo = add3(sub3(b.head, qRot(q, b.head)), t);
    const par = b.parent != null ? out.get(b.parent) : null;
    if (par) out.set(b.id, { W: qNorm(qMul(par.W, q)), o: add3(qRot(par.W, lo), par.o) });
    else out.set(b.id, { W: q.slice(), o: lo });
  }
  return out;
}
function apply(m, x) { return add3(qRot(m.W, x), m.o); }
function unapply(m, y) { return qRot(qConj(m.W), sub3(y, m.o)); }

// The pose an action has at a (possibly fractional) frame. Keys hold whole poses. A looping action
// blends from its last key back to its first.
function sampleAction(action, frame) {
  const keys = action.keys;
  if (!keys.length) return {};
  if (keys.length === 1) return clonePose(keys[0].pose);
  let a = null, b = null, span = 0, t = 0;
  for (let i = 0; i < keys.length; i++) {
    if (keys[i].frame <= frame) a = keys[i];
    if (keys[i].frame >= frame && !b) b = keys[i];
  }
  if (a && b) {
    if (a === b) return clonePose(a.pose);
    span = b.frame - a.frame; t = (frame - a.frame) / span;
  } else if (action.loop) {
    const first = keys[0], last = keys[keys.length - 1];
    span = first.frame + action.length - last.frame;
    a = last; b = first;
    t = span > 0 ? ((frame - last.frame + action.length) % action.length) / span : 0;
  } else {
    return clonePose((a || b).pose);
  }
  return blendPose(a.pose, b.pose, t);
}
function blendPose(pa, pb, t) {
  const out = {};
  const ids = new Set([...Object.keys(pa), ...Object.keys(pb)]);
  for (const id of ids) {
    const A = pa[id] || { q: QI(), t: [0, 0, 0] }, B = pb[id] || { q: QI(), t: [0, 0, 0] };
    out[id] = { q: qSlerp(A.q, B.q, t), t: lerp3(A.t, B.t, t) };
  }
  return out;
}
function clonePose(p) {
  const o = {};
  for (const k in p) o[k] = { q: p[k].q.slice(), t: p[k].t.slice() };
  return o;
}

// Turn a pose into a new voxel grid. ctx (from bakeContext) can be reused across frames.
function bakeContext(model, rig, size) {
  const nb = rig.bones.length;
  const lo = [], hi = [];
  for (let k = 0; k <= nb; k++) { lo.push([Infinity, Infinity, Infinity]); hi.push([-Infinity, -Infinity, -Infinity]); }
  for (let i = 0; i < model.length; i++) {
    if (!model[i]) continue;
    const s = rig.skin[i] <= nb ? rig.skin[i] : 0;
    const c = G.coords(size, i);
    for (let a = 0; a < 3; a++) { if (c[a] < lo[s][a]) lo[s][a] = c[a]; if (c[a] + 1 > hi[s][a]) hi[s][a] = c[a] + 1; }
  }
  return { model, rig, size, lo, hi };
}
function bake(ctx, pose) {
  const { model, rig, size, lo, hi } = ctx;
  const [X, Y, Z] = size;
  const out = new Uint8Array(model.length);
  const err = new Float32Array(model.length).fill(Infinity);
  // Voxels that belong to no bone stay put.
  for (let i = 0; i < model.length; i++) if (model[i] && !rig.skin[i]) { out[i] = model[i]; err[i] = 0; }
  if (!rig.bones.length) return out;
  const xf = solve(rig.bones, pose);
  rig.bones.forEach((b, k) => {
    const s = k + 1;
    if (lo[s][0] === Infinity) return;
    const m = xf.get(b.id);
    // Bounds of this bone's voxels once posed.
    const bl = [Infinity, Infinity, Infinity], bh = [-Infinity, -Infinity, -Infinity];
    for (let c = 0; c < 8; c++) {
      const p = apply(m, [c & 1 ? hi[s][0] : lo[s][0], c & 2 ? hi[s][1] : lo[s][1], c & 4 ? hi[s][2] : lo[s][2]]);
      for (let a = 0; a < 3; a++) { bl[a] = Math.min(bl[a], p[a]); bh[a] = Math.max(bh[a], p[a]); }
    }
    const x0 = Math.max(0, Math.floor(bl[0])), x1 = Math.min(X - 1, Math.ceil(bh[0]));
    const y0 = Math.max(0, Math.floor(bl[1])), y1 = Math.min(Y - 1, Math.ceil(bh[1]));
    const z0 = Math.max(0, Math.floor(bl[2])), z1 = Math.min(Z - 1, Math.ceil(bh[2]));
    const inv = qConj(m.W);
    for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++) for (let x = x0; x <= x1; x++) {
      const r = qRot(inv, [x + 0.5 - m.o[0], y + 0.5 - m.o[1], z + 0.5 - m.o[2]]);
      const sx = Math.floor(r[0]), sy = Math.floor(r[1]), sz = Math.floor(r[2]);
      if (sx < 0 || sy < 0 || sz < 0 || sx >= X || sy >= Y || sz >= Z) continue;
      const si = (sy * Z + sz) * X + sx;
      if (!model[si] || rig.skin[si] !== s) continue;
      // When two bones both claim a cell, the voxel that lands closest to the cell centre wins.
      const dx = r[0] - sx - 0.5, dy = r[1] - sy - 0.5, dz = r[2] - sz - 0.5;
      const e = dx * dx + dy * dy + dz * dz + 1e-6 * k;
      const ti = (y * Z + z) * X + x;
      if (e < err[ti]) { err[ti] = e; out[ti] = model[si]; }
    }
  });
  return out;
}

function bakeAction(model, rig, size, action) {
  const ctx = bakeContext(model, rig, size);
  const frames = [];
  for (let f = 0; f < action.length; f++) frames.push(bake(ctx, sampleAction(action, f)));
  return frames;
}

// Posed head and tail of every bone, for drawing.
function posedBones(bones, pose) {
  const xf = solve(bones, pose);
  return bones.map(b => { const m = xf.get(b.id); return { id: b.id, head: apply(m, b.head), tail: apply(m, b.tail), W: m.W }; });
}

// Rotate one bone about a world axis while keeping its parent still: returns its new local rotation.
function rotateWorld(bones, pose, id, axis, rad) {
  const b = bones.find(o => o.id === id);
  const local = (pose[id] && pose[id].q) || QI();
  const parW = b && b.parent != null ? solve(bones, pose).get(b.parent).W : QI();
  const R = qAxisAngle(axis, rad);
  return qNorm(qMul(qMul(qMul(qConj(parW), R), parW), local));
}

const API = {
  QI, qMul, qConj, qNorm, qRot, qAxisAngle, qFromEuler, qToEuler, qSlerp,
  boneOrder, addBone, removeBone, mirrorBone, mirrorName, autoSkin, segDist2,
  solve, apply, unapply, sampleAction, blendPose, clonePose,
  bakeContext, bake, bakeAction, posedBones, rotateWorld,
};
if (typeof module === 'object' && module.exports) module.exports = API;
else root.VXRig = API;
})(typeof window !== 'undefined' ? window : globalThis);
