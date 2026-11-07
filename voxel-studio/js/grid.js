// Voxel Studio: voxel grids, picking and the project file. No DOM in here, so the tests run it under Node.
// A grid is a Uint8Array of size X*Y*Z. 0 is empty, any other value is an index into the palette.
// Y is up. Cell (x, y, z) fills the unit cube [x, x+1] x [y, y+1] x [z, z+1].
(function (root) {
'use strict';

const FORMAT = 'voxel-studio';
const VERSION = 1;
const MAX_SIZE = 64;
const MAX_COLORS = 255;

// Index 0 is a placeholder for "empty" so palette[i] lines up with voxel value i.
const DEFAULT_PALETTE = [
  null,
  '#1b1d2b', '#3a3f5c', '#6b7194', '#a5abc8', '#e8ebf5',
  '#5a2a1f', '#9b4a2c', '#d9763a', '#f2b45a', '#f8e28c',
  '#7a1f34', '#c2334a', '#f06a6a', '#f7a5a0',
  '#1e4a2f', '#2f7d3c', '#5cb85a', '#a8e07a',
  '#173a5e', '#2a6fb0', '#4fb0e8', '#9fe3f5',
  '#3f2468', '#7a45b8', '#c08af0',
  '#6b4a2a', '#a8784a', '#e0c49a',
];

function cells(size) { return size[0] * size[1] * size[2]; }
function makeGrid(size) { return new Uint8Array(cells(size)); }
function idx(size, x, y, z) { return (y * size[2] + z) * size[0] + x; }
function inside(size, x, y, z) {
  return x >= 0 && y >= 0 && z >= 0 && x < size[0] && y < size[1] && z < size[2];
}
function get(grid, size, x, y, z) { return inside(size, x, y, z) ? grid[idx(size, x, y, z)] : 0; }
function set(grid, size, x, y, z, v) {
  if (!inside(size, x, y, z)) return false;
  const i = idx(size, x, y, z);
  if (grid[i] === v) return false;
  grid[i] = v;
  return true;
}
function coords(size, i) {
  const x = i % size[0], r = (i - x) / size[0], z = r % size[2], y = (r - z) / size[2];
  return [x, y, z];
}
// Move everything by (dx, dy, dz); voxels pushed past the edge are lost.
function shiftGrid(grid, size, dx, dy, dz) {
  const out = new Uint8Array(grid.length);
  const [X, Y, Z] = size;
  for (let y = 0; y < Y; y++) for (let z = 0; z < Z; z++) for (let x = 0; x < X; x++) {
    const v = grid[(y * Z + z) * X + x];
    if (!v) continue;
    const nx = x + dx, ny = y + dy, nz = z + dz;
    if (nx < 0 || ny < 0 || nz < 0 || nx >= X || ny >= Y || nz >= Z) continue;
    out[(ny * Z + nz) * X + nx] = v;
  }
  return out;
}
// Mirror the whole grid left to right (across x).
function flipX(grid, size) {
  const out = new Uint8Array(grid.length);
  const [X, Y, Z] = size;
  for (let y = 0; y < Y; y++) for (let z = 0; z < Z; z++) for (let x = 0; x < X; x++) out[(y * Z + z) * X + X - 1 - x] = grid[(y * Z + z) * X + x];
  return out;
}
function count(grid) { let n = 0; for (let i = 0; i < grid.length; i++) if (grid[i]) n++; return n; }

// Recolour the 6-connected region of one colour that contains (x, y, z). Returns how many cells changed.
function floodFill(grid, size, x, y, z, color) {
  if (!inside(size, x, y, z)) return 0;
  const from = grid[idx(size, x, y, z)];
  if (!from || from === color) return 0;
  const stack = [idx(size, x, y, z)];
  const X = size[0], XZ = size[0] * size[2];
  let n = 0;
  while (stack.length) {
    const i = stack.pop();
    if (grid[i] !== from) continue;
    grid[i] = color; n++;
    const [cx, cy, cz] = coords(size, i);
    if (cx > 0) stack.push(i - 1);
    if (cx < size[0] - 1) stack.push(i + 1);
    if (cz > 0) stack.push(i - X);
    if (cz < size[2] - 1) stack.push(i + X);
    if (cy > 0) stack.push(i - XZ);
    if (cy < size[1] - 1) stack.push(i + XZ);
  }
  return n;
}

// Walk a ray through the grid (Amanatides & Woo). solid(x, y, z) says which cells stop it.
// Returns { cell, normal, t, mid } for the first solid cell, where mid is the middle of the solid run
// the ray passes through (handy for dropping a bone inside a limb rather than on its skin);
// or { cell, normal, floor: true } if it misses everything and lands on the floor plane at height floorY;
// or null.
function raycast(size, o, d, solid, floorY) {
  const [X, Y, Z] = size;
  let tEnter = 0, tExit = Infinity, enterAxis = -1;
  for (let a = 0; a < 3; a++) {
    const lo = 0, hi = size[a];
    if (Math.abs(d[a]) < 1e-12) {
      if (o[a] < lo || o[a] > hi) { tExit = -1; break; }
      continue;
    }
    let t0 = (lo - o[a]) / d[a], t1 = (hi - o[a]) / d[a];
    if (t0 > t1) { const s = t0; t0 = t1; t1 = s; }
    if (t0 > tEnter) { tEnter = t0; enterAxis = a; }
    if (t1 < tExit) tExit = t1;
  }
  if (tExit >= tEnter && tExit > 0) {
    const p = [o[0] + d[0] * (tEnter + 1e-7), o[1] + d[1] * (tEnter + 1e-7), o[2] + d[2] * (tEnter + 1e-7)];
    const c = p.map((v, a) => Math.min(size[a] - 1, Math.max(0, Math.floor(v))));
    const step = d.map(v => (v > 0 ? 1 : v < 0 ? -1 : 0));
    const tMax = [0, 0, 0], tDelta = [0, 0, 0];
    for (let a = 0; a < 3; a++) {
      if (step[a] === 0) { tMax[a] = Infinity; tDelta[a] = Infinity; continue; }
      const edge = c[a] + (step[a] > 0 ? 1 : 0);
      tMax[a] = (edge - o[a]) / d[a];
      tDelta[a] = Math.abs(1 / d[a]);
    }
    let normal = [0, 0, 0];
    if (enterAxis >= 0) normal[enterAxis] = -step[enterAxis];
    let t = tEnter;
    let hit = null;
    while (inside(size, c[0], c[1], c[2])) {
      if (!hit && solid(c[0], c[1], c[2])) {
        hit = { cell: c.slice(), normal: normal.slice(), t };
      } else if (hit && !solid(c[0], c[1], c[2])) {
        break;
      }
      let a = tMax[0] < tMax[1] ? (tMax[0] < tMax[2] ? 0 : 2) : (tMax[1] < tMax[2] ? 1 : 2);
      t = tMax[a];
      c[a] += step[a];
      tMax[a] += tDelta[a];
      normal = [0, 0, 0]; normal[a] = -step[a];
    }
    if (hit) {
      const tm = (hit.t + Math.min(t, tExit)) / 2;
      hit.mid = [o[0] + d[0] * tm, o[1] + d[1] * tm, o[2] + d[2] * tm];
      return hit;
    }
  }
  const fy = floorY || 0;
  if (d[1] < -1e-9 && o[1] > fy) {
    const t = (fy - o[1]) / d[1];
    const px = o[0] + d[0] * t, pz = o[2] + d[2] * t;
    if (px >= 0 && pz >= 0 && px < X && pz < Z) {
      return { cell: [Math.floor(px), fy - 1, Math.floor(pz)], normal: [0, 1, 0], t, floor: true };
    }
  }
  return null;
}

// ---------- encoding ----------
const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function b64encode(bytes) {
  let s = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i], b = i + 1 < bytes.length ? bytes[i + 1] : 0, c = i + 2 < bytes.length ? bytes[i + 2] : 0;
    const n = (a << 16) | (b << 8) | c;
    s += B64[(n >> 18) & 63] + B64[(n >> 12) & 63];
    s += i + 1 < bytes.length ? B64[(n >> 6) & 63] : '=';
    s += i + 2 < bytes.length ? B64[n & 63] : '=';
  }
  return s;
}
function b64decode(s) {
  s = String(s).replace(/[^A-Za-z0-9+/]/g, '');
  const out = new Uint8Array(Math.floor(s.length * 3 / 4));
  let o = 0;
  for (let i = 0; i < s.length; i += 4) {
    const n = (B64.indexOf(s[i]) << 18) | (B64.indexOf(s[i + 1]) << 12) |
      ((i + 2 < s.length ? B64.indexOf(s[i + 2]) : 0) << 6) | (i + 3 < s.length ? B64.indexOf(s[i + 3]) : 0);
    out[o++] = (n >> 16) & 255;
    if (i + 2 < s.length) out[o++] = (n >> 8) & 255;
    if (i + 3 < s.length) out[o++] = n & 255;
  }
  return out.subarray(0, o);
}
// Run-length pairs (count 1-255, value), then base64. Voxel models are mostly air, so this is small.
function encodeGrid(grid) {
  const out = [];
  for (let i = 0; i < grid.length;) {
    const v = grid[i];
    let n = 1;
    while (n < 255 && i + n < grid.length && grid[i + n] === v) n++;
    out.push(n, v);
    i += n;
  }
  return b64encode(out);
}
function decodeGrid(str, n) {
  const bytes = b64decode(str);
  const grid = new Uint8Array(n);
  let o = 0;
  for (let i = 0; i + 1 < bytes.length && o < n; i += 2) {
    const run = Math.min(bytes[i], n - o);
    grid.fill(bytes[i + 1], o, o + run);
    o += run;
  }
  return grid;
}

// ---------- the project ----------
function newProject(size, name) {
  size = clampSize(size);
  return {
    name: name || 'Untitled',
    size,
    palette: DEFAULT_PALETTE.slice(),
    model: makeGrid(size),
    clips: [],
    rig: { bones: [], skin: makeGrid(size), nextId: 1 },
    actions: [],
  };
}
function clampSize(size) {
  return [0, 1, 2].map(a => Math.max(1, Math.min(MAX_SIZE, Math.round(Number(size && size[a]) || 16))));
}

// Copy everything except the grids, which are shared. Edits copy a grid before changing it,
// so this is a cheap undo snapshot.
function snapshot(v) {
  if (Array.isArray(v)) return v.map(snapshot);
  if (v && typeof v === 'object' && !ArrayBuffer.isView(v)) {
    const o = {};
    for (const k in v) o[k] = snapshot(v[k]);
    return o;
  }
  return v;
}

function serialize(doc) {
  return {
    format: FORMAT, version: VERSION,
    name: doc.name, size: doc.size.slice(), palette: doc.palette.slice(1),
    model: encodeGrid(doc.model),
    clips: doc.clips.map(c => ({ name: c.name, fps: c.fps, frames: c.frames.map(encodeGrid) })),
    rig: {
      bones: doc.rig.bones.map(b => ({ id: b.id, name: b.name, parent: b.parent, head: b.head.slice(), tail: b.tail.slice(), color: b.color })),
      skin: encodeGrid(doc.rig.skin),
    },
    actions: doc.actions.map(a => ({
      name: a.name, length: a.length, fps: a.fps, loop: a.loop,
      keys: a.keys.map(k => ({ frame: k.frame, pose: snapshot(k.pose) })),
    })),
  };
}

// Reads a project file defensively: anything malformed falls back to a default instead of throwing,
// except a file that is not a Voxel Studio project at all.
function deserialize(data) {
  if (typeof data === 'string') data = JSON.parse(data);
  if (!data || data.format !== FORMAT) throw new Error('Not a Voxel Studio project');
  const size = clampSize(data.size);
  const n = cells(size);
  const doc = newProject(size, str(data.name, 'Untitled', 60));
  if (Array.isArray(data.palette) && data.palette.length) {
    doc.palette = [null].concat(data.palette.slice(0, MAX_COLORS).map(c => (isHex(c) ? c.toLowerCase() : '#ff00ff')));
  }
  const maxColor = doc.palette.length - 1;
  const clean = g => { for (let i = 0; i < g.length; i++) if (g[i] > maxColor) g[i] = 0; return g; };
  if (typeof data.model === 'string') doc.model = clean(decodeGrid(data.model, n));
  doc.clips = (Array.isArray(data.clips) ? data.clips : []).slice(0, 100).map((c, i) => ({
    name: str(c && c.name, 'Clip ' + (i + 1), 40),
    fps: num(c && c.fps, 8, 1, 60),
    frames: (Array.isArray(c && c.frames) ? c.frames : []).slice(0, 500).map(f => clean(decodeGrid(String(f), n))),
  })).filter(c => c.frames.length);
  const rig = data.rig || {};
  const bones = Array.isArray(rig.bones) ? rig.bones.slice(0, 250) : [];
  const ids = new Set();
  doc.rig.bones = [];
  for (const b of bones) {
    const id = Math.round(Number(b && b.id));
    if (!(id > 0) || ids.has(id)) continue;
    ids.add(id);
    doc.rig.bones.push({
      id, name: str(b.name, 'Bone ' + id, 30),
      parent: b.parent == null ? null : Math.round(Number(b.parent)),
      head: vec(b.head), tail: vec(b.tail),
      color: isHex(b.color) ? b.color : boneColor(doc.rig.bones.length),
    });
  }
  for (const b of doc.rig.bones) if (b.parent != null && (!ids.has(b.parent) || b.parent === b.id)) b.parent = null;
  breakCycles(doc.rig.bones);
  doc.rig.nextId = Math.max(0, ...ids) + 1;
  if (typeof rig.skin === 'string') {
    doc.rig.skin = decodeGrid(rig.skin, n);
    for (let i = 0; i < n; i++) if (doc.rig.skin[i] > doc.rig.bones.length) doc.rig.skin[i] = 0;
  }
  doc.actions = (Array.isArray(data.actions) ? data.actions : []).slice(0, 100).map((a, i) => {
    const length = Math.round(num(a && a.length, 8, 1, 240));
    return {
      name: str(a && a.name, 'Action ' + (i + 1), 40), length,
      fps: num(a && a.fps, 8, 1, 60), loop: !!(a && a.loop),
      keys: (Array.isArray(a && a.keys) ? a.keys : []).map(k => ({ frame: Math.round(num(k && k.frame, 0, 0, length - 1)), pose: cleanPose(k && k.pose, ids) }))
        .filter((k, j, arr) => arr.findIndex(o => o.frame === k.frame) === j)
        .sort((p, q) => p.frame - q.frame),
    };
  });
  return doc;
}
function cleanPose(pose, ids) {
  const out = {};
  if (!pose || typeof pose !== 'object') return out;
  for (const k of Object.keys(pose)) {
    const id = Number(k);
    if (!ids.has(id)) continue;
    const p = pose[k] || {};
    const q = Array.isArray(p.q) && p.q.length === 4 ? p.q.map(v => num(v, 0, -1, 1)) : [0, 0, 0, 1];
    const len = Math.hypot(...q);
    out[id] = { q: len < 1e-6 ? [0, 0, 0, 1] : q.map(v => v / len), t: vec(p.t, 128) };
  }
  return out;
}
// A parent chain that loops back on itself would hang forward kinematics; cut it.
function breakCycles(bones) {
  const byId = new Map(bones.map(b => [b.id, b]));
  for (const b of bones) {
    const seen = new Set([b.id]);
    let p = b.parent;
    while (p != null) {
      if (seen.has(p)) { b.parent = null; break; }
      seen.add(p);
      p = byId.get(p) ? byId.get(p).parent : null;
    }
  }
}
function str(v, def, max) { return typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : def; }
function num(v, def, lo, hi) { v = Number(v); return Number.isFinite(v) ? Math.max(lo, Math.min(hi, v)) : def; }
function vec(v, lim) { lim = lim || 256; return [0, 1, 2].map(a => num(Array.isArray(v) ? v[a] : 0, 0, -lim, lim)); }
function isHex(c) { return typeof c === 'string' && /^#[0-9a-fA-F]{6}$/.test(c); }

const BONE_COLORS = ['#ff6b6b', '#4fc3f7', '#ffd54f', '#81c784', '#ba68c8', '#ff8a65', '#4dd0e1', '#f06292', '#aed581', '#9575cd', '#ffb74d', '#64b5f6'];
function boneColor(i) { return BONE_COLORS[i % BONE_COLORS.length]; }

const API = {
  FORMAT, VERSION, MAX_SIZE, MAX_COLORS, DEFAULT_PALETTE, BONE_COLORS,
  cells, makeGrid, idx, inside, get, set, coords, count, shiftGrid, flipX, floodFill, raycast,
  b64encode, b64decode, encodeGrid, decodeGrid,
  newProject, clampSize, snapshot, serialize, deserialize, boneColor, isHex,
};
if (typeof module === 'object' && module.exports) module.exports = API;
else root.VXGrid = API;
})(typeof window !== 'undefined' ? window : globalThis);
