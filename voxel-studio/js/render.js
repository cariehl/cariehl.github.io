// Voxel Studio: draws voxel grids on a 2D canvas. Faces are flat-shaded by direction, which keeps the
// look close to pixel art, and voxels are painted back to front.
(function (root) {
'use strict';

const FOV = 50 * Math.PI / 180;
// Faces: normal, the four corners as offsets, and how bright that side is.
const FACES = [
  { n: [1, 0, 0], c: [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]], light: 0.80 },
  { n: [-1, 0, 0], c: [[0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]], light: 0.70 },
  { n: [0, 1, 0], c: [[0, 1, 0], [0, 1, 1], [1, 1, 1], [1, 1, 0]], light: 1.00 },
  { n: [0, -1, 0], c: [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]], light: 0.50 },
  { n: [0, 0, 1], c: [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]], light: 0.90 },
  { n: [0, 0, -1], c: [[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]], light: 0.62 },
];

function norm(v) { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; }
function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }

// cam: { yaw, pitch, zoom (pixels per voxel at the target), target [x, y, z], ortho }
function camera(cam, W, H) {
  const cp = Math.cos(cam.pitch), back = [cp * Math.sin(cam.yaw), Math.sin(cam.pitch), cp * Math.cos(cam.yaw)];
  const f = norm([-back[0], -back[1], -back[2]]);
  const r = norm(cross(f, [0, 1, 0]));
  const u = cross(r, f);
  const focal = H / (2 * Math.tan(FOV / 2));
  const dist = cam.ortho ? 1000 : focal / cam.zoom;
  const C = [cam.target[0] + back[0] * dist, cam.target[1] + back[1] * dist, cam.target[2] + back[2] * dist];
  return { C, f, r, u, W, H, ortho: !!cam.ortho, scale: cam.zoom, focal, dist };
}
// Screen position and depth of a world point; null if behind a perspective camera.
function project(cb, p) {
  const v0 = p[0] - cb.C[0], v1 = p[1] - cb.C[1], v2 = p[2] - cb.C[2];
  const x = v0 * cb.r[0] + v1 * cb.r[1] + v2 * cb.r[2];
  const y = v0 * cb.u[0] + v1 * cb.u[1] + v2 * cb.u[2];
  const z = v0 * cb.f[0] + v1 * cb.f[1] + v2 * cb.f[2];
  if (cb.ortho) return [cb.W / 2 + x * cb.scale, cb.H / 2 - y * cb.scale, z];
  if (z < 0.05) return null;
  return [cb.W / 2 + x * cb.focal / z, cb.H / 2 - y * cb.focal / z, z];
}
function ray(cb, sx, sy) {
  const dx = sx - cb.W / 2, dy = -(sy - cb.H / 2);
  if (cb.ortho) {
    const a = dx / cb.scale, b = dy / cb.scale;
    return { o: [cb.C[0] + cb.r[0] * a + cb.u[0] * b, cb.C[1] + cb.r[1] * a + cb.u[1] * b, cb.C[2] + cb.r[2] * a + cb.u[2] * b], d: cb.f.slice() };
  }
  const a = dx / cb.focal, b = dy / cb.focal;
  return { o: cb.C.slice(), d: norm([cb.f[0] + cb.r[0] * a + cb.u[0] * b, cb.f[1] + cb.r[1] * a + cb.u[1] * b, cb.f[2] + cb.r[2] * a + cb.u[2] * b]) };
}

function hexRgb(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function shadeTable(palette) {
  return palette.map(h => {
    if (!h) return null;
    const c = hexRgb(h);
    return FACES.map(F => {
      const k = F.light;
      const fill = `rgb(${Math.round(c[0] * k)},${Math.round(c[1] * k)},${Math.round(c[2] * k)})`;
      const e = k * 0.72;
      const edge = `rgb(${Math.round(c[0] * e)},${Math.round(c[1] * e)},${Math.round(c[2] * e)})`;
      return { fill, edge };
    });
  });
}

// Every voxel with a face that can be seen, back to front.
function visibleList(cb, grid, size, maxY, out, flag) {
  const [X, Y, Z] = size;
  const top = Math.min(Y - 1, maxY == null ? Y - 1 : maxY);
  const facing = FACES.map(F => cb.ortho ? dot(F.n, cb.f) < 0 : null);
  for (let y = 0; y <= top; y++) for (let z = 0; z < Z; z++) {
    let i = (y * Z + z) * X;
    for (let x = 0; x < X; x++, i++) {
      const v = grid[i];
      if (!v) continue;
      let mask = 0;
      for (let k = 0; k < 6; k++) {
        const F = FACES[k];
        const nx = x + F.n[0], ny = y + F.n[1], nz = z + F.n[2];
        const open = nx < 0 || ny < 0 || nz < 0 || nx >= X || ny > top || nz >= Z || !grid[(ny * Z + nz) * X + nx];
        if (!open) continue;
        let front = facing[k];
        if (front === null) {
          const px = x + 0.5 + F.n[0] * 0.5 - cb.C[0], py = y + 0.5 + F.n[1] * 0.5 - cb.C[1], pz = z + 0.5 + F.n[2] * 0.5 - cb.C[2];
          front = F.n[0] * px + F.n[1] * py + F.n[2] * pz < 0;
        }
        if (front) mask |= 1 << k;
      }
      if (!mask) continue;
      const vx = x + 0.5 - cb.C[0], vy = y + 0.5 - cb.C[1], vz = z + 0.5 - cb.C[2];
      const depth = cb.ortho ? vx * cb.f[0] + vy * cb.f[1] + vz * cb.f[2] : vx * vx + vy * vy + vz * vz;
      out.push({ x, y, z, v, mask, depth, ghost: flag });
    }
  }
}

function pathQuad(ctx, pts) {
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  ctx.lineTo(pts[1][0], pts[1][1]);
  ctx.lineTo(pts[2][0], pts[2][1]);
  ctx.lineTo(pts[3][0], pts[3][1]);
  ctx.closePath();
}

// scene: { grid, size, palette, cam, edges, maxY, floorY, ghost, ghostColor, background, floor, highlight, bones, selBone }
function draw(ctx, W, H, scene) {
  const cb = camera(scene.cam, W, H);
  const size = scene.size;
  if (scene.background) { ctx.fillStyle = scene.background; ctx.fillRect(0, 0, W, H); }
  else ctx.clearRect(0, 0, W, H);
  if (scene.floor !== false) drawFloor(ctx, cb, size, scene.floorY || 0, scene.maxY);

  const list = [];
  visibleList(cb, scene.grid, size, scene.maxY, list, false);
  if (scene.ghost) {
    const g = scene.ghost, cur = scene.grid;
    const only = new Uint8Array(g.length);
    for (let i = 0; i < g.length; i++) if (g[i] && g[i] !== cur[i]) only[i] = cur[i] ? 0 : g[i];
    visibleList(cb, only, size, scene.maxY, list, true);
  }
  list.sort((a, b) => b.depth - a.depth);
  const shades = shadeTable(scene.palette);
  const edges = !!scene.edges;
  ctx.lineJoin = 'round';
  const pts = [[0, 0], [0, 0], [0, 0], [0, 0]];
  for (const it of list) {
    const sh = shades[it.v];
    if (!sh) continue;
    if (it.ghost) ctx.globalAlpha = 0.28;
    for (let k = 0; k < 6; k++) {
      if (!(it.mask & (1 << k))) continue;
      const F = FACES[k];
      let ok = true;
      for (let c = 0; c < 4; c++) {
        const o = F.c[c];
        const p = project(cb, [it.x + o[0], it.y + o[1], it.z + o[2]]);
        if (!p) { ok = false; break; }
        pts[c][0] = p[0]; pts[c][1] = p[1];
      }
      if (!ok) continue;
      pathQuad(ctx, pts);
      const s = sh[k];
      ctx.fillStyle = s.fill;
      ctx.fill();
      if (it.ghost) continue;
      // A hairline in the face colour hides the seams canvas antialiasing leaves between quads.
      ctx.strokeStyle = edges ? s.edge : s.fill;
      ctx.lineWidth = edges ? Math.max(0.6, Math.min(1.5, cb.scale / 24)) : 0.7;
      ctx.stroke();
    }
    if (it.ghost) ctx.globalAlpha = 1;
  }
  if (scene.highlight) drawCellBox(ctx, cb, scene.highlight.cell, scene.highlight.color || '#fff');
  if (scene.bones) drawBones(ctx, cb, scene.bones, scene.selBone);
  return cb;
}

function line(ctx, cb, a, b) {
  const p = project(cb, a), q = project(cb, b);
  if (!p || !q) return;
  ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]);
}
function drawFloor(ctx, cb, size, fy, maxY) {
  const [X, Y, Z] = size;
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(150,165,210,0.16)';
  ctx.beginPath();
  for (let x = 0; x <= X; x++) line(ctx, cb, [x, fy, 0], [x, fy, Z]);
  for (let z = 0; z <= Z; z++) line(ctx, cb, [0, fy, z], [X, fy, z]);
  ctx.stroke();
  // The front edge (z = Z) is drawn brighter so it is always clear which way the model faces.
  ctx.strokeStyle = 'rgba(255,200,90,0.55)';
  ctx.beginPath(); line(ctx, cb, [0, fy, Z], [X, fy, Z]); ctx.stroke();
  // The box the model has to fit in.
  const top = maxY == null ? Y : Math.min(Y, maxY + 1);
  ctx.strokeStyle = 'rgba(150,165,210,0.22)';
  ctx.setLineDash([3, 4]);
  ctx.beginPath();
  for (const [x, z] of [[0, 0], [X, 0], [X, Z], [0, Z]]) line(ctx, cb, [x, 0, z], [x, top, z]);
  line(ctx, cb, [0, top, 0], [X, top, 0]); line(ctx, cb, [X, top, 0], [X, top, Z]);
  line(ctx, cb, [X, top, Z], [0, top, Z]); line(ctx, cb, [0, top, Z], [0, top, 0]);
  ctx.stroke();
  ctx.setLineDash([]);
}
function drawCellBox(ctx, cb, c, color) {
  const [x, y, z] = c;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  const P = (a, b, d) => [x + a, y + b, z + d];
  const E = [[P(0, 0, 0), P(1, 0, 0)], [P(1, 0, 0), P(1, 0, 1)], [P(1, 0, 1), P(0, 0, 1)], [P(0, 0, 1), P(0, 0, 0)],
    [P(0, 1, 0), P(1, 1, 0)], [P(1, 1, 0), P(1, 1, 1)], [P(1, 1, 1), P(0, 1, 1)], [P(0, 1, 1), P(0, 1, 0)],
    [P(0, 0, 0), P(0, 1, 0)], [P(1, 0, 0), P(1, 1, 0)], [P(1, 0, 1), P(1, 1, 1)], [P(0, 0, 1), P(0, 1, 1)]];
  for (const [a, b] of E) line(ctx, cb, a, b);
  ctx.stroke();
}
// bones: [{ id, head, tail, color }]
function drawBones(ctx, cb, bones, sel) {
  for (const b of bones) {
    const h = project(cb, b.head), t = project(cb, b.tail);
    if (!h || !t) continue;
    const on = b.id === sel;
    const dx = t[0] - h[0], dy = t[1] - h[1], len = Math.hypot(dx, dy) || 1;
    const w = Math.min(9, Math.max(4, len * 0.16));
    const nx = -dy / len * w, ny = dx / len * w;
    const m = [h[0] + dx * 0.2, h[1] + dy * 0.2];
    ctx.beginPath();
    ctx.moveTo(h[0], h[1]); ctx.lineTo(m[0] + nx, m[1] + ny); ctx.lineTo(t[0], t[1]); ctx.lineTo(m[0] - nx, m[1] - ny); ctx.closePath();
    ctx.fillStyle = on ? b.color : b.color + '99';
    ctx.fill();
    ctx.lineWidth = on ? 2.5 : 1.5;
    ctx.strokeStyle = on ? '#fff' : '#0a0c16';
    ctx.stroke();
    for (const [p, r] of [[h, on ? 6 : 5], [t, on ? 4.5 : 3.5]]) {
      ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, Math.PI * 2);
      ctx.fillStyle = on ? '#fff' : b.color; ctx.fill();
      ctx.lineWidth = 1.5; ctx.strokeStyle = '#0a0c16'; ctx.stroke();
    }
  }
}

// A camera that fits the whole grid into W x H.
function fitZoom(size, W, H, pad) {
  const diag = Math.hypot(size[0], size[1], size[2]);
  return Math.min(W, H) / (diag * (pad || 1.05));
}

const API = { FACES, camera, project, ray, draw, fitZoom, shadeTable };
if (typeof module === 'object' && module.exports) module.exports = API;
else root.VXRender = API;
})(typeof window !== 'undefined' ? window : globalThis);
