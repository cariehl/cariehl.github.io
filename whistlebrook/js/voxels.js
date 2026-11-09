// Reads Voxel Studio project files (*.voxel.json) and turns their grids into meshes.
// No DOM and no three.js in here, so the tests run it under Node. The format and the mesher are
// the same as apps/voxel-studio (js/grid.js and js/glb.js): run-length pairs in base64, and greedy
// meshing of the faces that touch air.

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const B64I = new Int16Array(128).fill(-1);
for (let i = 0; i < 64; i++) B64I[B64.charCodeAt(i)] = i;

function b64decode(s) {
  s = String(s).replace(/[^A-Za-z0-9+/]/g, '');
  const out = new Uint8Array(Math.floor(s.length * 3 / 4));
  let o = 0;
  const at = i => (i < s.length ? B64I[s.charCodeAt(i)] : 0);
  for (let i = 0; i < s.length; i += 4) {
    const n = (at(i) << 18) | (at(i + 1) << 12) | (at(i + 2) << 6) | at(i + 3);
    out[o++] = (n >> 16) & 255;
    if (i + 2 < s.length) out[o++] = (n >> 8) & 255;
    if (i + 3 < s.length) out[o++] = n & 255;
  }
  return out.subarray(0, o);
}

export function decodeGrid(str, n) {
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

// { name, size, palette (palette[0] is null, like the editor), model, clips: [{ name, fps, frames }] }
export function readProject(data) {
  if (typeof data === 'string') data = JSON.parse(data);
  if (!data || data.format !== 'voxel-studio') throw new Error('Not a Voxel Studio project');
  const size = data.size.map(v => Math.max(1, Math.min(64, v | 0)));
  const n = size[0] * size[1] * size[2];
  return {
    name: String(data.name || ''),
    size,
    palette: [null, ...(data.palette || [])],
    model: decodeGrid(data.model, n),
    clips: (data.clips || []).map(c => ({ name: String(c.name), fps: Math.max(1, Number(c.fps) || 8), frames: (c.frames || []).map(f => decodeGrid(f, n)) })),
  };
}

export function hexToLinear(h) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(c => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); });
}

// Greedy mesh of one grid. Positions are in tiles (1/16 per voxel), centred on x and z, standing on y = 0,
// the way Voxel Studio's .glb export places a model. glow: palette indices that shine at night.
// Returns { pos, nrm, col (linear rgb floats), glow (0 or 1 per vertex), idx }.
export function meshGrid(grid, size, palette, opts = {}) {
  const scale = opts.scale || 1 / 16;
  const glowSet = opts.glow || new Set();
  const lin = palette.map(h => (h ? hexToLinear(h) : null));
  const off = [-size[0] / 2, 0, -size[2] / 2];
  const pos = [], nrm = [], col = [], glow = [], idx = [];
  const [X, Y, Z] = size;
  const at = (x, y, z) => (x < 0 || y < 0 || z < 0 || x >= X || y >= Y || z >= Z) ? 0 : grid[(y * Z + z) * X + x];
  for (let d = 0; d < 3; d++) {
    const u = (d + 1) % 3, v = (d + 2) % 3;
    const W = size[u], H = size[v];
    const mask = new Int32Array(W * H);
    for (const sgn of [1, -1]) {
      for (let s = 0; s < size[d]; s++) {
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
          const base = pos.length / 3;
          const p = [0, 0, 0];
          p[d] = sgn > 0 ? s + 1 : s;
          const rgb = lin[m] || [1, 0, 1];
          // Faces pointing down or away get a touch darker, like the editor's flat shading.
          const shade = d === 1 && sgn < 0 ? 0.7 : 1;
          for (const [cu, cv] of [[i, j], [i + w, j], [i + w, j + h], [i, j + h]]) {
            p[u] = cu; p[v] = cv;
            pos.push((p[0] + off[0]) * scale, (p[1] + off[1]) * scale, (p[2] + off[2]) * scale);
            const n = [0, 0, 0]; n[d] = sgn;
            nrm.push(n[0], n[1], n[2]);
            col.push(rgb[0] * shade, rgb[1] * shade, rgb[2] * shade);
            glow.push(glowSet.has(m) ? 1 : 0);
          }
          if (sgn > 0) idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
          else idx.push(base, base + 2, base + 1, base, base + 3, base + 2);
          i += w;
        }
      }
    }
  }
  return { pos: new Float32Array(pos), nrm: new Float32Array(nrm), col: new Float32Array(col), glow: new Float32Array(glow), idx: new Uint32Array(idx) };
}
