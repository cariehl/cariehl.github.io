// Voxel Studio: export to glTF binary (.glb). No DOM in here, so the tests run it under Node.
//
// Each grid becomes one mesh: only faces that touch air are kept, and neighbouring faces of the same
// colour are merged into larger rectangles (greedy meshing). Colours are vertex colours.
//
// glTF has no way to swap voxel grids, so animation clips are exported the usual way for flipbooks:
// every frame is its own node, hidden at rest (scale 0), and each clip is a glTF animation that shows
// one frame at a time with STEP keys. At rest only the model shows; playing a clip hides it.
(function (root) {
'use strict';
const G = (typeof module === 'object' && module.exports) ? require('./grid.js') : root.VXGrid;

// Merged quads for one grid: { pos: Float32Array, nrm: Float32Array, col: Uint8Array, idx: Uint32Array }.
// Positions are in voxels, origin at the grid corner.
function meshGrid(grid, size, palette) {
  const lin = palette.map(h => {
    if (!h) return null;
    const n = parseInt(h.slice(1), 16);
    // glTF vertex colours are linear.
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(c => { c /= 255; return Math.round(255 * (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))); });
  });
  const pos = [], nrm = [], col = [], idx = [];
  const at = (x, y, z) => (x < 0 || y < 0 || z < 0 || x >= size[0] || y >= size[1] || z >= size[2]) ? 0 : grid[(y * size[2] + z) * size[0] + x];
  for (let d = 0; d < 3; d++) {
    const u = (d + 1) % 3, v = (d + 2) % 3;
    const W = size[u], H = size[v];
    const mask = new Int32Array(W * H);
    for (const sgn of [1, -1]) {
      for (let s = 0; s < size[d]; s++) {
        // Which faces on this slice face air in direction sgn, and what colour they are.
        const c = [0, 0, 0];
        for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
          c[d] = s; c[u] = i; c[v] = j;
          const a = at(c[0], c[1], c[2]);
          c[d] = s + sgn;
          mask[j * W + i] = a && !at(c[0], c[1], c[2]) ? a : 0;
        }
        for (let j = 0; j < H; j++) for (let i = 0; i < W;) {
          const m = mask[j * W + i];
          if (!m) { i++; continue; }
          let w = 1;
          while (i + w < W && mask[j * W + i + w] === m) w++;
          let h = 1;
          grow: while (j + h < H) {
            for (let k = 0; k < w; k++) if (mask[(j + h) * W + i + k] !== m) break grow;
            h++;
          }
          for (let y = 0; y < h; y++) for (let k = 0; k < w; k++) mask[(j + y) * W + i + k] = 0;
          // The quad lies on the plane d = s (or s + 1 for a face pointing up the axis).
          const base = pos.length / 3;
          const p = [0, 0, 0];
          p[d] = sgn > 0 ? s + 1 : s;
          const corners = [[i, j], [i + w, j], [i + w, j + h], [i, j + h]];
          for (const [cu, cv] of corners) {
            p[u] = cu; p[v] = cv;
            pos.push(p[0], p[1], p[2]);
            const n = [0, 0, 0]; n[d] = sgn;
            nrm.push(n[0], n[1], n[2]);
            const rgb = lin[m] || [255, 0, 255];
            col.push(rgb[0], rgb[1], rgb[2], 255);
          }
          // Counter-clockwise seen from outside.
          if (sgn > 0) idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
          else idx.push(base, base + 2, base + 1, base, base + 3, base + 2);
          i += w;
        }
      }
    }
  }
  return { pos: new Float32Array(pos), nrm: new Float32Array(nrm), col: new Uint8Array(col), idx: new Uint32Array(idx) };
}

// tracks: [{ name, fps, frames: [grid, ...] }]. opts: { scale (metres per voxel), unlit, name }.
// Returns a Uint8Array holding the .glb file.
function exportGLB(doc, tracks, opts) {
  opts = opts || {};
  const size = doc.size, scale = opts.scale || 0.1;
  const off = [-size[0] / 2, 0, -size[2] / 2];
  const json = {
    asset: { version: '2.0', generator: 'Voxel Studio' },
    scene: 0, scenes: [{ name: opts.name || doc.name, nodes: [] }],
    nodes: [], meshes: [], materials: [{ name: 'voxels', pbrMetallicRoughness: { baseColorFactor: [1, 1, 1, 1], metallicFactor: 0, roughnessFactor: 1 } }],
    accessors: [], bufferViews: [], buffers: [{ byteLength: 0 }],
  };
  if (opts.unlit) { json.extensionsUsed = ['KHR_materials_unlit']; json.materials[0].extensions = { KHR_materials_unlit: {} }; }
  const chunks = [];
  let byteLength = 0;
  function view(typed, target) {
    const pad = (4 - (byteLength % 4)) % 4;
    if (pad) { chunks.push(new Uint8Array(pad)); byteLength += pad; }
    const bytes = new Uint8Array(typed.buffer, typed.byteOffset, typed.byteLength);
    chunks.push(bytes);
    json.bufferViews.push(Object.assign({ buffer: 0, byteOffset: byteLength, byteLength: bytes.byteLength }, target ? { target } : {}));
    byteLength += bytes.byteLength;
    return json.bufferViews.length - 1;
  }
  function accessor(typed, componentType, type, count, extra, target) {
    json.accessors.push(Object.assign({ bufferView: view(typed, target), componentType, count, type }, extra || {}));
    return json.accessors.length - 1;
  }
  // One mesh per distinct grid; identical frames share it.
  const meshFor = new Map();
  function mesh(grid, name) {
    const key = G.encodeGrid(grid);
    if (meshFor.has(key)) return meshFor.get(key);
    const m = meshGrid(grid, size, doc.palette);
    if (!m.idx.length) { meshFor.set(key, null); return null; }
    const n = m.pos.length / 3;
    const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < m.pos.length; i += 3) for (let a = 0; a < 3; a++) {
      const v = (m.pos[i + a] + off[a]) * scale;
      m.pos[i + a] = v;
      if (v < min[a]) min[a] = v;
      if (v > max[a]) max[a] = v;
    }
    const small = n <= 65535;
    const prim = {
      attributes: {
        POSITION: accessor(m.pos, 5126, 'VEC3', n, { min, max }, 34962),
        NORMAL: accessor(m.nrm, 5126, 'VEC3', n, null, 34962),
        COLOR_0: accessor(m.col, 5121, 'VEC4', n, { normalized: true }, 34962),
      },
      indices: accessor(small ? Uint16Array.from(m.idx) : m.idx, small ? 5123 : 5125, 'SCALAR', m.idx.length, null, 34963),
      material: 0,
    };
    json.meshes.push({ name, primitives: [prim] });
    meshFor.set(key, json.meshes.length - 1);
    return json.meshes.length - 1;
  }
  function node(name, grid, hidden) {
    const n = { name };
    const mi = mesh(grid, name);
    if (mi != null) n.mesh = mi;
    if (hidden) n.scale = [0, 0, 0];
    json.nodes.push(n);
    return json.nodes.length - 1;
  }
  const rootNode = { name: opts.name || doc.name, children: [] };
  json.nodes.push(rootNode);
  json.scenes[0].nodes.push(0);
  const modelNode = node('Model', doc.model, false);
  rootNode.children.push(modelNode);

  const anims = [];
  for (const t of tracks) {
    if (!t.frames.length) continue;
    const group = { name: t.name, children: [] };
    json.nodes.push(group);
    const gi = json.nodes.length - 1;
    rootNode.children.push(gi);
    const ids = t.frames.map((g, i) => node(`${t.name} ${i + 1}`, g, true));
    group.children = ids;
    const n = t.frames.length, fps = t.fps || 8;
    const times = new Float32Array(n + 1);
    for (let k = 0; k <= n; k++) times[k] = k / fps;
    const input = accessor(times, 5126, 'SCALAR', n + 1, { min: [0], max: [n / fps] });
    const channels = [], samplers = [];
    ids.forEach((id, i) => {
      const out = new Float32Array((n + 1) * 3);
      for (let k = 0; k <= n; k++) {
        const on = k < n ? k === i : i === n - 1;
        out.fill(on ? 1 : 0, k * 3, k * 3 + 3);
      }
      samplers.push({ input, output: accessor(out, 5126, 'VEC3', n + 1), interpolation: 'STEP' });
      channels.push({ sampler: samplers.length - 1, target: { node: id, path: 'scale' } });
    });
    // Hide the model while the clip plays.
    const hide = accessor(new Float32Array([0, 0, 0, 0, 0, 0]), 5126, 'VEC3', 2);
    const hideIn = accessor(new Float32Array([0, n / fps]), 5126, 'SCALAR', 2, { min: [0], max: [n / fps] });
    samplers.push({ input: hideIn, output: hide, interpolation: 'STEP' });
    channels.push({ sampler: samplers.length - 1, target: { node: modelNode, path: 'scale' } });
    anims.push({ name: t.name, samplers, channels });
  }
  if (anims.length) json.animations = anims;
  if (!json.meshes.length) delete json.meshes;
  json.buffers[0].byteLength = byteLength;

  const bin = new Uint8Array(byteLength + ((4 - (byteLength % 4)) % 4));
  let o = 0;
  for (const c of chunks) { bin.set(c, o); o += c.byteLength; }
  let text = JSON.stringify(json);
  while (text.length % 4) text += ' ';
  const jsonBytes = utf8(text);
  const total = 12 + 8 + jsonBytes.length + (bin.length ? 8 + bin.length : 0);
  const out = new Uint8Array(total);
  const dv = new DataView(out.buffer);
  dv.setUint32(0, 0x46546C67, true); // "glTF"
  dv.setUint32(4, 2, true);
  dv.setUint32(8, total, true);
  dv.setUint32(12, jsonBytes.length, true);
  dv.setUint32(16, 0x4E4F534A, true); // "JSON"
  out.set(jsonBytes, 20);
  if (bin.length) {
    const b = 20 + jsonBytes.length;
    dv.setUint32(b, bin.length, true);
    dv.setUint32(b + 4, 0x004E4942, true); // "BIN\0"
    out.set(bin, b + 8);
  }
  return out;
}
function utf8(s) {
  if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(s);
  return Uint8Array.from(Buffer.from(s, 'utf8'));
}

const API = { meshGrid, exportGLB };
if (typeof module === 'object' && module.exports) module.exports = API;
else root.VXGlb = API;
})(typeof window !== 'undefined' ? window : globalThis);
