// Isometric canvas renderer. Everything is drawn with paths each frame: ground, walls with a
// cutaway around the player, furniture, trees, people, robots, light and weather.
import { W, H, G, S, WALL_STYLES, idx, inBounds } from './world.js';
import { FURNITURE, ITEMS, ROBOTS } from './data.js';
import { hash2 } from './rng.js';
import { daylight, REACH, JAM_RADIUS, evacOpen, evacPoint } from './sim.js';
import { computeFov } from './fov.js';

const TW = 64, TH = 32;
const WALL_H = 50;

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');
  const dark = document.createElement('canvas');
  const dctx = dark.getContext('2d');
  const R = {
    canvas, ctx, zoom: 1.3, camX: 0, camY: 0, w: 0, h: 0, dpr: 1,
    vis: new Uint8Array(W * H), visR: 0,
    hover: null, ghost: null, time: 0, walk: 0, lastPX: 0, lastPY: 0,
    effects: [],
  };

  function resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    R.dpr = dpr;
    R.w = canvas.clientWidth; R.h = canvas.clientHeight;
    canvas.width = Math.round(R.w * dpr); canvas.height = Math.round(R.h * dpr);
    dark.width = canvas.width; dark.height = canvas.height;
  }
  resize();
  window.addEventListener('resize', resize);

  // world -> screen (CSS px)
  function sx(x, y) { return (x - y) * TW / 2 * R.zoom + R.offX; }
  function sy(x, y) { return (x + y) * TH / 2 * R.zoom + R.offY; }
  R.toScreen = (x, y) => [sx(x, y), sy(x, y)];
  R.toWorld = (px, py) => {
    const a = (px - R.offX) / (TW / 2 * R.zoom), b = (py - R.offY) / (TH / 2 * R.zoom);
    return [(a + b) / 2, (b - a) / 2];
  };

  // ---------- colour helpers ----------
  const shadeCache = new Map();
  function shade(hex, f) {
    const key = hex + f;
    let v = shadeCache.get(key);
    if (v) return v;
    const n = parseInt(hex.slice(1), 16);
    let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    if (f < 0) { r *= 1 + f; g *= 1 + f; b *= 1 + f; }
    else { r += (255 - r) * f; g += (255 - g) * f; b += (255 - b) * f; }
    v = `rgb(${r | 0},${g | 0},${b | 0})`;
    shadeCache.set(key, v);
    return v;
  }
  let dim = 0; // extra darkening for remembered tiles
  const C = (hex, f = 0) => shade(hex, dim ? (f < 0 ? f - dim * (1 + f) : f * (1 - dim) - dim) : f);

  function poly(pts, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(pts[0], pts[1]);
    for (let k = 2; k < pts.length; k += 2) ctx.lineTo(pts[k], pts[k + 1]);
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); }
  }

  // An iso box on a tile, inset from the edges. h in unzoomed px; z0 base height.
  function box(x, y, inset, h, base, opts = {}) {
    const z = R.zoom;
    const x0 = x + inset, y0 = y + inset, x1 = x + 1 - inset, y1 = y + 1 - inset;
    const hz = h * z, bz = (opts.z0 || 0) * z;
    const T = [sx(x0, y0), sy(x0, y0) - bz], Rr = [sx(x1, y0), sy(x1, y0) - bz];
    const B = [sx(x1, y1), sy(x1, y1) - bz], L = [sx(x0, y1), sy(x0, y1) - bz];
    if (opts.left !== false) poly([L[0], L[1], B[0], B[1], B[0], B[1] - hz, L[0], L[1] - hz], C(base, -0.18));
    if (opts.right !== false) poly([B[0], B[1], Rr[0], Rr[1], Rr[0], Rr[1] - hz, B[0], B[1] - hz], C(base, -0.34));
    if (opts.top !== false) poly([T[0], T[1] - hz, Rr[0], Rr[1] - hz, B[0], B[1] - hz, L[0], L[1] - hz], C(opts.topColor || base, 0.08));
    return { T, R: Rr, B, L, hz };
  }
  // A flat diamond at a height inside a tile
  function topDiamond(x, y, inset, h, fill) {
    const z = R.zoom, hz = h * z;
    const x0 = x + inset, y0 = y + inset, x1 = x + 1 - inset, y1 = y + 1 - inset;
    poly([sx(x0, y0), sy(x0, y0) - hz, sx(x1, y0), sy(x1, y0) - hz, sx(x1, y1), sy(x1, y1) - hz, sx(x0, y1), sy(x0, y1) - hz], fill);
  }

  // ---------- ground ----------
  const GROUND = {
    [G.GRASS]: '#5f7438', [G.ROAD]: '#3a3c41', [G.WALK]: '#8a877f', [G.WOOD]: '#8a6845', [G.TILE]: '#b5b2a8',
    [G.CARPET]: '#76586a', [G.CONCRETE]: '#78787a', [G.DIRT]: '#6c5940', [G.LINE]: '#3a3c41', [G.LOT]: '#47484d', [G.FIELD]: '#7b6c3c',
  };
  const LEAVES = ['#c4682c', '#d9a23a', '#a8452a', '#e0c056'];

  function drawGround(x, y, i) {
    const g = game.world.ground[i];
    const z = R.zoom;
    const T = [sx(x, y), sy(x, y)];
    const pts = [T[0], T[1], T[0] + TW / 2 * z, T[1] + TH / 2 * z, T[0], T[1] + TH * z, T[0] - TW / 2 * z, T[1] + TH / 2 * z];
    const hv = hash2(x, y, 3);
    let base = GROUND[g];
    let f = (hv - 0.5) * 0.08;
    if (g === G.TILE) f += ((x + y) & 1) ? 0.05 : -0.03;
    if (g === G.GRASS) { if (hv > 0.82) base = '#6f7a3a'; else if (hv < 0.12) base = '#566c35'; }
    // ground needs to overlap neighbours by a hair to avoid seams
    ctx.beginPath();
    ctx.moveTo(pts[0], pts[1] - 0.6); ctx.lineTo(pts[2] + 0.6, pts[3]); ctx.lineTo(pts[4], pts[5] + 0.6); ctx.lineTo(pts[6] - 0.6, pts[7]); ctx.closePath();
    ctx.fillStyle = C(base, f); ctx.fill();
    if (z < 0.75) return;
    // details
    if (g === G.LINE) {
      // centre dashes run along whichever axis the road does
      const horiz = game.world.ground[idx(Math.min(W - 1, x + 1), y)] === G.LINE || game.world.ground[idx(Math.max(0, x - 1), y)] === G.LINE;
      ctx.strokeStyle = C('#d6b84a', -0.1); ctx.lineWidth = 2 * z;
      ctx.beginPath();
      if (horiz) { ctx.moveTo(sx(x + 0.15, y + 0.5), sy(x + 0.15, y + 0.5)); ctx.lineTo(sx(x + 0.85, y + 0.5), sy(x + 0.85, y + 0.5)); }
      else { ctx.moveTo(sx(x + 0.5, y + 0.15), sy(x + 0.5, y + 0.15)); ctx.lineTo(sx(x + 0.5, y + 0.85), sy(x + 0.5, y + 0.85)); }
      ctx.stroke(); ctx.lineWidth = 1;
    } else if (g === G.WOOD) {
      ctx.strokeStyle = C('#6e5134'); ctx.lineWidth = 1;
      ctx.beginPath();
      for (let k = 1; k < 4; k++) { const t = k / 4; ctx.moveTo(sx(x + t, y), sy(x + t, y)); ctx.lineTo(sx(x + t, y + 1), sy(x + t, y + 1)); }
      ctx.stroke();
    } else if (g === G.GRASS || g === G.FIELD) {
      if (hv > 0.55) {
        const n = 1 + Math.floor(hv * 4);
        for (let k = 0; k < n; k++) {
          const a = hash2(x, y, 10 + k), b = hash2(x, y, 20 + k);
          ctx.fillStyle = C(LEAVES[Math.floor(hash2(x, y, 30 + k) * 4)], -0.05);
          const px = sx(x + a, y + b), py = sy(x + a, y + b);
          ctx.fillRect(px - 1.5 * z, py - 1 * z, 3 * z, 2 * z);
        }
      }
      if (g === G.FIELD) {
        ctx.strokeStyle = C('#5f522c'); ctx.beginPath();
        for (let k = 1; k < 3; k++) { const t = k / 3; ctx.moveTo(sx(x, y + t), sy(x, y + t)); ctx.lineTo(sx(x + 1, y + t), sy(x + 1, y + t)); }
        ctx.stroke();
      }
    } else if (g === G.WALK && hv > 0.6) {
      ctx.strokeStyle = C('#77746c'); ctx.beginPath();
      ctx.moveTo(sx(x, y + 0.5), sy(x, y + 0.5)); ctx.lineTo(sx(x + 1, y + 0.5), sy(x + 1, y + 0.5)); ctx.stroke();
    }
  }

  // ---------- structures ----------
  const wallLike = s => s === S.WALL || s === S.DOOR || s === S.WINDOW || s === S.BWALL;

  function isCut(x, y) {
    const p = game.player;
    const ds = (x + y) - (Math.floor(p.x) + Math.floor(p.y));
    if (ds <= 0 || ds > 9) return false;
    const dd = Math.abs((x - y) - (Math.floor(p.x) - Math.floor(p.y)));
    return dd <= 7 - Math.max(0, ds - 6);
  }

  function wallBox(x, y, style, h, cut, opts = {}) {
    const w = game.world;
    const pal = WALL_STYLES[style] || WALL_STYLES[0];
    const nY = inBounds(x, y + 1) ? w.struct[idx(x, y + 1)] : S.WALL;
    const nX = inBounds(x + 1, y) ? w.struct[idx(x + 1, y)] : S.WALL;
    const hideLeft = wallLike(nY) && isCut(x, y + 1) === cut;
    const hideRight = wallLike(nX) && isCut(x + 1, y) === cut;
    const z = R.zoom, hz = h * z, bz = (opts.z0 || 0) * z;
    const T = [sx(x, y), sy(x, y) - bz], Rr = [sx(x + 1, y), sy(x + 1, y) - bz], B = [sx(x + 1, y + 1), sy(x + 1, y + 1) - bz], L = [sx(x, y + 1), sy(x, y + 1) - bz];
    if (!hideLeft) poly([L[0], L[1], B[0], B[1], B[0], B[1] - hz, L[0], L[1] - hz], C(pal[1]));
    if (!hideRight) poly([B[0], B[1], Rr[0], Rr[1], Rr[0], Rr[1] - hz, B[0], B[1] - hz], C(pal[2]));
    if (opts.top !== false) {
      poly([T[0], T[1] - hz, Rr[0], Rr[1] - hz, B[0], B[1] - hz, L[0], L[1] - hz], C(pal[0], cut ? -0.15 : 0));
    }
    return { T, R: Rr, B, L, hz, hideLeft, hideRight };
  }

  // Planks across a door or window, drawn on both visible faces.
  function planks(x, y, n, h) {
    const z = R.zoom;
    for (let k = 0; k < n; k++) {
      const t0 = 0.22 + k * 0.24, t1 = t0 + 0.12;
      const zz0 = h * (0.2 + k * 0.26) * z, zz1 = h * (0.6 - k * 0.12 + 0.2) * z;
      for (const face of [0, 1]) {
        const a = face ? [x + 1, y + 1] : [x, y + 1];
        const b = face ? [x + 1, y] : [x + 1, y + 1];
        const ax = sx(a[0], a[1]), ay = sy(a[0], a[1]), bx = sx(b[0], b[1]), by = sy(b[0], b[1]);
        const lerp = (t, zz) => [ax + (bx - ax) * t, ay + (by - ay) * t - zz];
        const p1 = lerp(0.02, zz0), p2 = lerp(0.98, zz1), p3 = lerp(0.98, zz1 + 6 * z), p4 = lerp(0.02, zz0 + 6 * z);
        poly([...p1, ...p2, ...p3, ...p4], C('#9a7448', face ? -0.25 : -0.05), C('#4a3420'));
        void t0; void t1;
      }
    }
  }

  function drawStruct(x, y, i, s) {
    const w = game.world;
    const cut = isCut(x, y);
    const fullH = cut ? 9 : WALL_H;
    if (s === S.WALL) { wallBox(x, y, w.style[i], fullH, cut); return; }
    if (s === S.BWALL) {
      const r = wallBox(x, y, 6, cut ? 9 : 38, cut);
      if (!cut) { ctx.strokeStyle = C('#3e2c1c'); ctx.beginPath(); for (let k = 1; k < 4; k++) { const zz = 38 * R.zoom * k / 4; ctx.moveTo(r.L[0], r.L[1] - zz); ctx.lineTo(r.B[0], r.B[1] - zz); ctx.lineTo(r.R[0], r.R[1] - zz); } ctx.stroke(); }
      return;
    }
    if (s === S.DOOR) {
      const st = w.open[i];
      if (st === 0) {
        const r = wallBox(x, y, w.style[i], fullH, cut);
        // door panel on the visible faces
        const z = R.zoom, dh = Math.min(fullH, 40) * z;
        if (!r.hideLeft) doorPanel(r.L, r.B, dh, '#6d4a2c');
        if (!r.hideRight) doorPanel(r.B, r.R, dh, '#5a3c23');
      } else {
        if (!cut) wallBox(x, y, w.style[i], 10, false, { z0: WALL_H - 10 });
        if (st === 2) {
          ctx.fillStyle = C('#6d4a2c');
          for (let k = 0; k < 3; k++) { const a = hash2(x, y, k), b = hash2(x, y, k + 9); ctx.fillRect(sx(x + a, y + b) - 4, sy(x + a, y + b) - 1, 8 * R.zoom, 2 * R.zoom); }
        }
      }
      if (w.barr[i]) planks(x, y, w.barr[i], cut ? 9 : 42);
      return;
    }
    if (s === S.WINDOW) {
      const st = w.open[i];
      const sill = cut ? 9 : 16;
      const r = wallBox(x, y, w.style[i], sill, cut);
      if (!cut) {
        wallBox(x, y, w.style[i], 10, false, { z0: WALL_H - 10 });
        const z = R.zoom;
        const z0 = sill * z, z1 = (WALL_H - 10) * z;
        const glass = st === 0 ? 'rgba(160,205,230,0.42)' : st === 1 ? 'rgba(160,205,230,0.18)' : null;
        for (const [a, b, hide] of [[r.L, r.B, r.hideLeft], [r.B, r.R, r.hideRight]]) {
          if (hide) continue;
          if (glass) {
            poly([a[0], a[1] - z0, b[0], b[1] - z0, b[0], b[1] - z1, a[0], a[1] - z1], dim ? 'rgba(60,80,95,0.4)' : glass, C('#3b3a36'));
          } else {
            // smashed: shards on the frame
            ctx.fillStyle = 'rgba(170,210,235,0.55)';
            ctx.beginPath();
            ctx.moveTo(a[0], a[1] - z0); ctx.lineTo(a[0] + (b[0] - a[0]) * 0.3, a[1] + (b[1] - a[1]) * 0.3 - z0); ctx.lineTo(a[0] + (b[0] - a[0]) * 0.12, a[1] + (b[1] - a[1]) * 0.12 - z0 - 10 * z); ctx.closePath(); ctx.fill();
            ctx.beginPath();
            ctx.moveTo(b[0], b[1] - z1); ctx.lineTo(b[0] + (a[0] - b[0]) * 0.35, b[1] + (a[1] - b[1]) * 0.35 - z1); ctx.lineTo(b[0] + (a[0] - b[0]) * 0.1, b[1] + (a[1] - b[1]) * 0.1 - z1 + 12 * z); ctx.closePath(); ctx.fill();
          }
        }
      }
      if (w.barr[i]) planks(x, y, w.barr[i], cut ? 9 : 42);
      return;
    }
    if (s === S.TREE) { drawTree(x, y, cut); return; }
    if (s === S.BUSH) { drawBush(x, y); return; }
    if (s === S.FENCE) { box(x, y, 0.42, 18, '#8a6a48'); return; }
  }

  function doorPanel(a, b, dh, col) {
    const t0 = 0.25, t1 = 0.75;
    const p = t => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    const p0 = p(t0), p1 = p(t1);
    poly([p0[0], p0[1], p1[0], p1[1], p1[0], p1[1] - dh, p0[0], p0[1] - dh], C(col));
    ctx.fillStyle = C('#d8c27a');
    const k = p(0.68);
    ctx.fillRect(k[0] - 1, k[1] - dh * 0.5 - 1, 2.5 * R.zoom, 2.5 * R.zoom);
  }

  const CANOPY = [['#3f5f2e', '#557a38', '#6d9442'], ['#8c4a1f', '#b8642a', '#d9873a'], ['#9a7a1e', '#c9a12e', '#e3c24c'], ['#7a2a1c', '#a33a26', '#c85538'], ['#35502a', '#4a6d33', '#5e8a3d']];
  function drawTree(x, y, cut) {
    const z = R.zoom;
    const cx = sx(x + 0.5, y + 0.5), cy = sy(x + 0.5, y + 0.5);
    const hv = hash2(x, y, 7);
    const pal = CANOPY[Math.floor(hash2(x, y, 8) * CANOPY.length)];
    const size = (0.8 + hv * 0.5) * z;
    const fade = cut;
    if (fade) ctx.globalAlpha = 0.28;
    // shadow
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.beginPath(); ctx.ellipse(cx, cy, 18 * size, 9 * size, 0, 0, Math.PI * 2); ctx.fill();
    // trunk
    ctx.fillStyle = C('#4b3626');
    ctx.fillRect(cx - 3 * z, cy - 26 * size, 6 * z, 26 * size);
    // canopy
    const top = cy - (40 + hv * 22) * size;
    const blobs = [[-10, 8, 16, 0], [10, 6, 15, 0], [0, -6, 18, 1], [-6, -14, 12, 2], [7, -12, 11, 2]];
    for (const [ox, oy, r, c] of blobs) {
      ctx.fillStyle = C(pal[c]);
      ctx.beginPath(); ctx.arc(cx + ox * size, top + oy * size, r * size, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  function drawBush(x, y) {
    const z = R.zoom;
    const cx = sx(x + 0.5, y + 0.5), cy = sy(x + 0.5, y + 0.5);
    const hv = hash2(x, y, 11);
    const pal = CANOPY[hv > 0.6 ? 4 : hv > 0.3 ? 0 : 1];
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath(); ctx.ellipse(cx, cy + 2 * z, 15 * z, 7 * z, 0, 0, Math.PI * 2); ctx.fill();
    for (const [ox, oy, r, c] of [[-7, -5, 9, 0], [6, -6, 9, 1], [0, -11, 9, 2]]) {
      ctx.fillStyle = C(pal[c]);
      ctx.beginPath(); ctx.arc(cx + ox * z, cy + oy * z, r * z, 0, Math.PI * 2); ctx.fill();
    }
  }

  // ---------- furniture ----------
  function drawFurniture(x, y, c) {
    const f = FURNITURE[c.kind];
    if (!f) return;
    const z = R.zoom;
    const k = c.kind;
    const cut = isCut(x, y) && f.h > 30;
    const h = cut ? 12 : f.h;
    if (k === 'car') return drawCar(x, y, c);
    if (k === 'barrel') {
      const cx = sx(x + 0.5, y + 0.5), cy = sy(x + 0.5, y + 0.5);
      ctx.fillStyle = C('#2e5878'); ctx.fillRect(cx - 12 * z, cy - 24 * z, 24 * z, 24 * z);
      ctx.beginPath(); ctx.ellipse(cx, cy, 12 * z, 6 * z, 0, 0, Math.PI); ctx.fill();
      ctx.fillStyle = C('#3a6f9a'); ctx.beginPath(); ctx.ellipse(cx, cy - 24 * z, 12 * z, 6 * z, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = C('#5c8fb5', -0.1); ctx.beginPath(); ctx.ellipse(cx, cy - 24 * z, 9 * z * Math.min(1, (c.water || 0) / 100 + 0.1), 4.5 * z * Math.min(1, (c.water || 0) / 100 + 0.1), 0, 0, Math.PI * 2); ctx.fill();
      return;
    }
    if (k === 'mast') {
      // a red-and-white lattice mast with a blinking beacon
      box(x, y, 0.3, 8, '#7a7a7a');
      const cx = sx(x + 0.5, y + 0.5), cy = sy(x + 0.5, y + 0.5) - 8 * z;
      const H2 = 230 * z, segs = 10;
      for (let k2 = 0; k2 < segs; k2++) {
        const a = k2 / segs, b2 = (k2 + 1) / segs;
        const wa = (1 - a) * 12 * z + 2 * z, wb = (1 - b2) * 12 * z + 2 * z;
        const ya = cy - a * H2, yb = cy - b2 * H2;
        ctx.strokeStyle = C(k2 % 2 ? '#e8e2d6' : '#b8402e'); ctx.lineWidth = 2 * z;
        ctx.beginPath();
        ctx.moveTo(cx - wa, ya); ctx.lineTo(cx - wb, yb); ctx.moveTo(cx + wa, ya); ctx.lineTo(cx + wb, yb);
        ctx.moveTo(cx - wa, ya); ctx.lineTo(cx + wb, yb); ctx.moveTo(cx + wa, ya); ctx.lineTo(cx - wb, yb);
        ctx.stroke();
      }
      ctx.lineWidth = 1;
      const on = Math.sin(R.time * 2.5) > 0;
      ctx.fillStyle = on ? '#ff4a3a' : '#5a1d18';
      ctx.beginPath(); ctx.arc(cx, cy - H2 - 3 * z, 3.5 * z, 0, Math.PI * 2); ctx.fill();
      if (on) { ctx.fillStyle = 'rgba(255,74,58,0.25)'; ctx.beginPath(); ctx.arc(cx, cy - H2 - 3 * z, 10 * z, 0, Math.PI * 2); ctx.fill(); }
      return;
    }
    if (k === 'node') {
      // a white cabinet with a breathing cyan band
      const r = box(x, y, 0.12, cut ? 12 : 48, '#e9ecef');
      if (cut) return;
      const glow = 0.55 + 0.45 * Math.sin(R.time * 1.6);
      ctx.fillStyle = dim ? '#2a4048' : `rgba(110,230,255,${glow})`;
      for (const yy of [0.35, 0.62]) {
        poly([r.L[0], r.L[1] - r.hz * yy, r.B[0], r.B[1] - r.hz * yy, r.B[0], r.B[1] - r.hz * (yy + 0.06), r.L[0], r.L[1] - r.hz * (yy + 0.06)], ctx.fillStyle);
        poly([r.B[0], r.B[1] - r.hz * yy, r.R[0], r.R[1] - r.hz * yy, r.R[0], r.R[1] - r.hz * (yy + 0.06), r.B[0], r.B[1] - r.hz * (yy + 0.06)], ctx.fillStyle);
      }
      return;
    }
    if (k === 'jammer') {
      box(x, y, 0.28, 14, '#3b4250');
      const cx = sx(x + 0.5, y + 0.5), cy = sy(x + 0.5, y + 0.5) - 14 * z;
      ctx.strokeStyle = C('#9aa3ad'); ctx.lineWidth = 1.5 * z;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, cy - 22 * z); ctx.stroke(); ctx.lineWidth = 1;
      const on = c.charge > 0;
      const blink = on && (Math.sin(R.time * 6) > 0);
      ctx.fillStyle = on ? (blink ? '#6dff9a' : '#2f8a4f') : '#5a2a2a';
      ctx.beginPath(); ctx.arc(cx, cy - 22 * z, 2.5 * z, 0, Math.PI * 2); ctx.fill();
      return;
    }
    const inset = k === 'bed' || k === 'sofa' || k === 'storeshelf' || k === 'tub' ? 0.06 : k === 'toilet' || k === 'computer' || k === 'microwave' ? 0.28 : k === 'tv' ? 0.22 : 0.1;
    if (k === 'tv' || k === 'computer' || k === 'microwave') {
      box(x, y, 0.12, 14, '#7a5a3c');
      box(x, y, inset, k === 'tv' ? 18 : 10, f.color, { z0: 14 });
      return;
    }
    if (k === 'medcab') { box(x, y, 0.3, 14, f.color, { z0: 18 }); return; }
    const r = box(x, y, inset, h, f.color);
    if (cut) return;
    const hz = r.hz;
    if (k === 'stove') {
      ctx.fillStyle = C('#2a2a2a');
      for (const [a, b] of [[0.32, 0.32], [0.68, 0.32], [0.32, 0.68], [0.68, 0.68]]) { ctx.beginPath(); ctx.ellipse(sx(x + a, y + b), sy(x + a, y + b) - hz, 4 * z, 2 * z, 0, 0, Math.PI * 2); ctx.fill(); }
    } else if (k === 'sink' || k === 'tub') {
      topDiamond(x, y, k === 'tub' ? 0.16 : 0.25, h, C('#7f9aa6'));
    } else if (k === 'bed') {
      topDiamond(x, y, 0.06, h + 1, C('#5f78a8'));
      box(x, y, 0.62, 4, '#eef0ec', { z0: h, left: false });
    } else if (k === 'sofa') {
      box(x, y, 0.06, 10, f.color, { z0: h, top: true });
    } else if (k === 'fridge' || k === 'wardrobe' || k === 'locker' || k === 'storefridge') {
      ctx.strokeStyle = C('#222222');
      ctx.beginPath();
      const m = [(r.L[0] + r.B[0]) / 2, (r.L[1] + r.B[1]) / 2];
      if (k === 'fridge') { ctx.moveTo(r.L[0], r.L[1] - hz * 0.62); ctx.lineTo(r.B[0], r.B[1] - hz * 0.62); }
      else { ctx.moveTo(m[0], m[1]); ctx.lineTo(m[0], m[1] - hz); }
      ctx.stroke();
      if (k === 'storefridge') poly([r.L[0] + 3, r.L[1] - 4, r.B[0] - 3, r.B[1] - 4, r.B[0] - 3, r.B[1] - hz + 4, r.L[0] + 3, r.L[1] - hz + 4], dim ? 'rgba(60,90,110,0.5)' : 'rgba(190,235,255,0.35)');
    } else if (k === 'shelf' || k === 'storeshelf') {
      const cols = ['#c0473b', '#d9b13b', '#4a7fb3', '#5aa35a', '#e0e0d8'];
      for (let row = 1; row <= 3; row++) {
        const zz = hz * row / 4;
        for (let s2 = 0; s2 < 5; s2++) {
          const t = 0.1 + s2 * 0.18;
          const px = r.L[0] + (r.B[0] - r.L[0]) * t, py = r.L[1] + (r.B[1] - r.L[1]) * t - zz;
          ctx.fillStyle = C(cols[Math.floor(hash2(x * 7 + s2, y * 3 + row, 5) * 5)], -0.1);
          ctx.fillRect(px, py - 5 * z, 4 * z, 5 * z);
        }
      }
    } else if (k === 'register') {
      box(x, y, 0.36, 8, '#2b2d33', { z0: h });
    } else if (k === 'crate') {
      ctx.strokeStyle = C('#5d4428'); ctx.beginPath();
      ctx.moveTo(r.L[0], r.L[1]); ctx.lineTo(r.B[0], r.B[1] - hz); ctx.moveTo(r.L[0], r.L[1] - hz); ctx.lineTo(r.B[0], r.B[1]); ctx.stroke();
    } else if (k === 'toolbox') {
      ctx.strokeStyle = C('#5a1a14'); ctx.beginPath();
      for (const t of [0.33, 0.66]) { ctx.moveTo(r.L[0], r.L[1] - hz * t); ctx.lineTo(r.B[0], r.B[1] - hz * t); ctx.lineTo(r.R[0], r.R[1] - hz * t); }
      ctx.stroke();
    } else if (k === 'gunrack') {
      ctx.strokeStyle = C('#1d2420'); ctx.beginPath();
      for (const t of [0.3, 0.5, 0.7]) { const px = r.L[0] + (r.B[0] - r.L[0]) * t, py = r.L[1] + (r.B[1] - r.L[1]) * t; ctx.moveTo(px, py - 4); ctx.lineTo(px, py - hz + 4); }
      ctx.stroke();
    }
  }

  function drawCar(x, y, c) {
    const z = R.zoom;
    const col = c.color || '#5a7fa6';
    // along the road: decide orientation from the neighbours
    const w = game.world;
    const along = w.ground[idx(Math.min(W - 1, x + 1), y)] === G.LINE || w.ground[idx(Math.max(0, x - 1), y)] === G.LINE || hash2(x, y, 4) > 0.5;
    const ins = along ? [0.0, 0.2] : [0.2, 0.0];
    const corners = (ix, iy, zz) => {
      const x0 = x + ix, y0 = y + iy, x1 = x + 1 - ix, y1 = y + 1 - iy;
      return { T: [sx(x0, y0), sy(x0, y0) - zz], R: [sx(x1, y0), sy(x1, y0) - zz], B: [sx(x1, y1), sy(x1, y1) - zz], L: [sx(x0, y1), sy(x0, y1) - zz] };
    };
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    const s0 = corners(ins[0] - 0.04, ins[1] - 0.04, -2 * z);
    poly([...s0.T, ...s0.R, ...s0.B, ...s0.L], 'rgba(0,0,0,0.25)');
    const a = corners(ins[0], ins[1], 4 * z), hz = 12 * z;
    poly([a.L[0], a.L[1], a.B[0], a.B[1], a.B[0], a.B[1] - hz, a.L[0], a.L[1] - hz], C(col, -0.2));
    poly([a.B[0], a.B[1], a.R[0], a.R[1], a.R[0], a.R[1] - hz, a.B[0], a.B[1] - hz], C(col, -0.36));
    poly([a.T[0], a.T[1] - hz, a.R[0], a.R[1] - hz, a.B[0], a.B[1] - hz, a.L[0], a.L[1] - hz], C(col, 0.05));
    // cabin
    const ci = along ? [0.25, 0.24] : [0.24, 0.25];
    const b = corners(ci[0], ci[1], 4 * z + hz), ch = 9 * z;
    poly([b.L[0], b.L[1], b.B[0], b.B[1], b.B[0], b.B[1] - ch, b.L[0], b.L[1] - ch], C('#2a3440', 0.1));
    poly([b.B[0], b.B[1], b.R[0], b.R[1], b.R[0], b.R[1] - ch, b.B[0], b.B[1] - ch], C('#222a33'));
    poly([b.T[0], b.T[1] - ch, b.R[0], b.R[1] - ch, b.B[0], b.B[1] - ch, b.L[0], b.L[1] - ch], C(col, 0.1));
    // wheels
    ctx.fillStyle = C('#151515');
    for (const t of [0.18, 0.82]) {
      const px = a.L[0] + (a.B[0] - a.L[0]) * t, py = a.L[1] + (a.B[1] - a.L[1]) * t;
      ctx.beginPath(); ctx.ellipse(px, py, 4 * z, 3 * z, 0, 0, Math.PI * 2); ctx.fill();
    }
  }

  function drawPile(x, y, c) {
    const z = R.zoom;
    if (c.kind === 'wreck') return drawWreck(x, y, c);
    if (!c.items || !c.items.length) return;
    const n = Math.min(4, c.items.length);
    for (let k = 0; k < n; k++) {
      const a = 0.3 + hash2(x, y, k) * 0.4, b = 0.3 + hash2(x, y, k + 5) * 0.4;
      const px = sx(x + a, y + b), py = sy(x + a, y + b);
      ctx.fillStyle = C(['#c9b27a', '#8a9aa8', '#b85c3c', '#d8d8d0'][k]);
      ctx.fillRect(px - 3 * z, py - 3 * z, 6 * z, 4 * z);
      ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.strokeRect(px - 3 * z, py - 3 * z, 6 * z, 4 * z);
    }
  }

  const ROBOT_COL = { tender: '#e4e2da', rover: '#4a4f57', lamplighter: '#6c7480', breaker: '#d9a521' };
  function drawWreck(x, y, c) {
    const z = R.zoom;
    const col = ROBOT_COL[c.robot] || '#888';
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    const cx = sx(x + 0.5, y + 0.5), cy = sy(x + 0.5, y + 0.5);
    ctx.beginPath(); ctx.ellipse(cx, cy, 16 * z, 7 * z, 0, 0, Math.PI * 2); ctx.fill();
    for (let k = 0; k < 5; k++) {
      const a = 0.2 + hash2(x, y, k + 40) * 0.6, b = 0.2 + hash2(x, y, k + 50) * 0.6;
      const px = sx(x + a, y + b), py = sy(x + a, y + b);
      ctx.fillStyle = C(col, -0.1 - k * 0.08);
      ctx.save(); ctx.translate(px, py); ctx.rotate(hash2(x, y, k + 60) * 3);
      ctx.fillRect(-5 * z, -3 * z, (6 + k * 2) * z, 4 * z);
      ctx.restore();
    }
    if (c.items && c.items.length) {
      ctx.fillStyle = C('#e9c46a');
      ctx.beginPath(); ctx.arc(cx, cy - 2 * z, 1.8 * z, 0, Math.PI * 2); ctx.fill();
    }
  }

  // ---------- people and robots ----------
  function screenDir(a) {
    const dx = Math.cos(a) - Math.sin(a), dy = (Math.cos(a) + Math.sin(a)) / 2;
    const m = Math.hypot(dx, dy) || 1;
    return [dx / m, dy / m];
  }

  function drawPlayer() {
    const p = game.player, z = R.zoom;
    const px = sx(p.x, p.y), py = sy(p.x, p.y);
    const [fx, fy] = screenDir(p.face);
    const crouch = p.sneak ? 0.78 : 1;
    const step = Math.sin(R.walk * 9) * (p.moveX || p.moveY ? 1 : 0);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.ellipse(px, py, 9 * z, 4.5 * z, 0, 0, Math.PI * 2); ctx.fill();
    if (p.sleeping) {
      ctx.fillStyle = '#3d5a7a'; ctx.fillRect(px - 10 * z, py - 8 * z, 20 * z, 7 * z);
      ctx.fillStyle = '#e0b48c'; ctx.beginPath(); ctx.arc(px + 10 * z, py - 6 * z, 4 * z, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#cfe0ff'; ctx.font = `${12 * z}px system-ui`; ctx.fillText('z', px + 12 * z, py - 16 * z - Math.sin(R.time * 2) * 3);
      return;
    }
    const body = p.equip.body ? { jacket: '#7b5b34', platejacket: '#7d838a', vest: '#2e3a33' }[p.equip.body.id] : '#3f6f8f';
    const behind = fy < 0;
    // legs
    ctx.fillStyle = '#2b2f3a';
    ctx.fillRect(px - 4 * z, py - 12 * z * crouch + step * 1.5 * z, 3.4 * z, 12 * z * crouch - step * 1.5 * z);
    ctx.fillRect(px + 0.6 * z, py - 12 * z * crouch - step * 1.5 * z, 3.4 * z, 12 * z * crouch + step * 1.5 * z);
    const top = py - 12 * z * crouch;
    // backpack behind the body when facing away... drawn first when facing us
    const pack = p.equip.back;
    if (pack && !behind) { ctx.fillStyle = '#5b4a2a'; ctx.fillRect(px - 6 * z - fx * 3 * z, top - 14 * z, 12 * z, 12 * z); }
    if (behind) drawWeapon(px, top - 8 * z, fx, fy);
    // torso
    ctx.fillStyle = p.hitFlash > 0 ? '#ffb0a0' : body;
    roundRect(px - 6 * z, top - 15 * z, 12 * z, 16 * z, 3 * z);
    if (pack && behind) { ctx.fillStyle = '#6b5832'; ctx.fillRect(px - 5 * z, top - 14 * z, 10 * z, 11 * z); }
    // head
    ctx.fillStyle = '#e0b48c';
    ctx.beginPath(); ctx.arc(px + fx * 1.5 * z, top - 20 * z, 5 * z, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#3a2a1e';
    ctx.beginPath(); ctx.arc(px + fx * 0.5 * z, top - 21.5 * z, 5 * z, Math.PI * (behind ? 0 : 1.05), Math.PI * (behind ? 2 : 1.95)); ctx.fill();
    if (!behind) drawWeapon(px, top - 8 * z, fx, fy);
    if (p.flashlight) { ctx.fillStyle = '#fff3b0'; ctx.beginPath(); ctx.arc(px + fx * 8 * z, top - 8 * z + fy * 8 * z, 2 * z, 0, Math.PI * 2); ctx.fill(); }
  }

  function drawWeapon(hx, hy, fx, fy) {
    const p = game.player, z = R.zoom;
    const st = p.equip.weapon;
    if (!st) return;
    const d = ITEMS[st.id];
    let a = Math.atan2(fy, fx);
    if (p.swing > 0) a += (p.swing / 0.22 - 0.5) * 2.2;
    const len = (d.gun ? 20 : st.id === 'knife' ? 9 : 16 + d.wt * 2) * z;
    ctx.strokeStyle = d.gun ? '#2a2a2a' : st.id === 'bat' || st.id === 'spikedbat' ? '#b8915a' : st.id === 'axe' ? '#a33' : '#9aa0a6';
    ctx.lineWidth = (d.gun ? 3.5 : 3) * z;
    ctx.beginPath(); ctx.moveTo(hx + fx * 4 * z, hy + fy * 4 * z); ctx.lineTo(hx + Math.cos(a) * len, hy + Math.sin(a) * len - 4 * z); ctx.stroke();
    ctx.lineWidth = 1;
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath(); ctx.fill();
  }

  function eyeColor(r) { return r.stun > 0 ? '#7fb2ff' : r.state === 'chase' ? '#ff3b2f' : r.state === 'investigate' ? '#ffb02e' : '#4fe3ff'; }

  // One long box along y, drawn with the front-most tile so it sits over the road behind it.
  function drawBus(x, y0, y1) {
    const z = R.zoom, hz = 30 * z;
    const x0 = x + 0.12, x1 = x + 0.88, Y0 = y0 + 0.05, Y1 = y1 + 0.95;
    const T = [sx(x0, Y0), sy(x0, Y0)], Rr = [sx(x1, Y0), sy(x1, Y0)], B = [sx(x1, Y1), sy(x1, Y1)], L = [sx(x0, Y1), sy(x0, Y1)];
    const base = '#d9a527';
    poly([L[0], L[1], B[0], B[1], B[0], B[1] - hz, L[0], L[1] - hz], C(base, -0.18));
    poly([B[0], B[1], Rr[0], Rr[1], Rr[0], Rr[1] - hz, B[0], B[1] - hz], C(base, -0.34));
    poly([T[0], T[1] - hz, Rr[0], Rr[1] - hz, B[0], B[1] - hz, L[0], L[1] - hz], C('#e8e2d0', dim ? -0.4 : 0));
    // a row of windows along the long (right-facing) side
    const glass = dim ? '#2a3440' : '#9cc6d8';
    const n = Math.max(3, Math.round((y1 - y0 + 1) * 1.6));
    for (let k = 0; k < n; k++) {
      const a = 0.08 + k * (0.86 / n), b2 = a + 0.86 / n - 0.05;
      const ya = Y0 + (Y1 - Y0) * a, yb = Y0 + (Y1 - Y0) * b2;
      const p1 = [sx(x1, ya), sy(x1, ya)], p2 = [sx(x1, yb), sy(x1, yb)];
      poly([p1[0], p1[1] - hz * 0.88, p2[0], p2[1] - hz * 0.88, p2[0], p2[1] - hz * 0.55, p1[0], p1[1] - hz * 0.55], glass);
    }
    // black stripe and wheels
    poly([B[0], B[1] - hz * 0.3, Rr[0], Rr[1] - hz * 0.3, Rr[0], Rr[1] - hz * 0.24, B[0], B[1] - hz * 0.24], '#2a2420');
    ctx.fillStyle = '#1a1a1c';
    for (const f of [0.18, 0.8]) { const yy = Y0 + (Y1 - Y0) * f; ctx.beginPath(); ctx.ellipse(sx(x1, yy), sy(x1, yy) - 3 * z, 5 * z, 4 * z, 0, 0, Math.PI * 2); ctx.fill(); }
    // destination sign over the windscreen (the north end)
    const sxp = sx(x + 0.5, Y0), syp = sy(x + 0.5, Y0) - hz - 8 * z;
    ctx.font = `700 ${Math.round(9 * z)}px system-ui`; ctx.textAlign = 'center';
    const tw = ctx.measureText('PRUITT · COUNTY LINE').width + 8;
    ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(sxp - tw / 2, syp - 11 * z, tw, 14 * z);
    ctx.fillStyle = '#ffe48a'; ctx.fillText('PRUITT · COUNTY LINE', sxp, syp);
  }

  function drawRobot(r) {
    const z = R.zoom;
    const px = sx(r.x, r.y), py = sy(r.x, r.y);
    const [fx, fy] = screenDir(r.face);
    const eye = eyeColor(r);
    const flash = r.hurt > 0;
    const t = R.time + r.id;
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    if (r.type === 'tender') {
      ctx.beginPath(); ctx.ellipse(px, py, 9 * z, 4.5 * z, 0, 0, Math.PI * 2); ctx.fill();
      const stepA = Math.sin(t * 7) * (r.state === 'idle' ? 0.5 : 1);
      ctx.fillStyle = flash ? '#fff' : '#9a9a94';
      ctx.fillRect(px - 4 * z, py - 13 * z + stepA * z, 3 * z, 13 * z - stepA * z);
      ctx.fillRect(px + 1 * z, py - 13 * z - stepA * z, 3 * z, 13 * z + stepA * z);
      const top = py - 13 * z;
      ctx.fillStyle = flash ? '#fff' : '#e4e2da';
      roundRect(px - 7 * z, top - 17 * z, 14 * z, 18 * z, 5 * z);
      // arms
      ctx.strokeStyle = flash ? '#fff' : '#b9b8b0'; ctx.lineWidth = 2.5 * z;
      const reach = r.windup > 0 ? 8 : 0;
      ctx.beginPath();
      ctx.moveTo(px - 7 * z, top - 14 * z); ctx.lineTo(px - 8 * z + fx * reach * z, top - 2 * z + fy * reach * z);
      ctx.moveTo(px + 7 * z, top - 14 * z); ctx.lineTo(px + 8 * z + fx * reach * z, top - 2 * z + fy * reach * z);
      ctx.stroke(); ctx.lineWidth = 1;
      // head with visor
      ctx.fillStyle = flash ? '#fff' : '#f0eee6';
      roundRect(px - 6 * z, top - 28 * z, 12 * z, 10 * z, 4 * z);
      if (fy > -0.2) {
        ctx.fillStyle = '#1b1f26'; roundRect(px - 5 * z + fx * 1.5 * z, top - 25 * z, 10 * z, 4 * z, 2 * z);
        ctx.fillStyle = eye; ctx.fillRect(px - 3.5 * z + fx * 2 * z, top - 23.8 * z, 7 * z, 1.6 * z);
      }
      r._eye = [px + fx * 2 * z, top - 23 * z];
    } else if (r.type === 'rover') {
      ctx.beginPath(); ctx.ellipse(px, py, 11 * z, 5 * z, 0, 0, Math.PI * 2); ctx.fill();
      const run = Math.sin(t * 14);
      const bx = fx * 7 * z, by = fy * 7 * z;
      ctx.strokeStyle = flash ? '#fff' : '#2e3238'; ctx.lineWidth = 2 * z;
      ctx.beginPath();
      for (const [ox, oy, ph] of [[bx, by, 1], [-bx, -by, -1]]) {
        ctx.moveTo(px + ox - 3 * z, py + oy * 0.5 - 9 * z); ctx.lineTo(px + ox - 3 * z + run * ph * 2 * z, py + oy * 0.5);
        ctx.moveTo(px + ox + 3 * z, py + oy * 0.5 - 9 * z); ctx.lineTo(px + ox + 3 * z - run * ph * 2 * z, py + oy * 0.5);
      }
      ctx.stroke(); ctx.lineWidth = 1;
      ctx.fillStyle = flash ? '#fff' : '#4a4f57';
      ctx.beginPath(); ctx.ellipse(px, py - 11 * z, 11 * z, 5.5 * z, Math.atan2(fy, fx) * 0.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = flash ? '#fff' : '#3b4047';
      ctx.beginPath(); ctx.ellipse(px + fx * 11 * z, py - 14 * z + fy * 5 * z, 5 * z, 4 * z, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = eye;
      ctx.beginPath(); ctx.arc(px + fx * 13 * z, py - 15 * z + fy * 6 * z, 1.8 * z, 0, Math.PI * 2); ctx.fill();
      r._eye = [px + fx * 13 * z, py - 15 * z + fy * 6 * z];
    } else if (r.type === 'lamplighter') {
      const hover = 30 + Math.sin(t * 3) * 3;
      ctx.beginPath(); ctx.ellipse(px, py, 8 * z, 4 * z, 0, 0, Math.PI * 2); ctx.fill();
      const cy = py - hover * z;
      ctx.strokeStyle = '#2b3038'; ctx.lineWidth = 1.5 * z;
      ctx.beginPath();
      for (const [ox, oy] of [[-10, -3], [10, -3], [-7, 3], [7, 3]]) { ctx.moveTo(px, cy); ctx.lineTo(px + ox * z, cy + oy * z); }
      ctx.stroke(); ctx.lineWidth = 1;
      ctx.fillStyle = 'rgba(200,210,220,0.35)';
      for (const [ox, oy] of [[-10, -3], [10, -3], [-7, 3], [7, 3]]) { ctx.beginPath(); ctx.ellipse(px + ox * z, cy + oy * z, 5 * z, 2 * z, 0, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = flash ? '#fff' : '#6c7480';
      ctx.beginPath(); ctx.ellipse(px, cy, 7 * z, 4 * z, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = eye;
      ctx.beginPath(); ctx.arc(px + fx * 4 * z, cy + 2 * z + fy * 2 * z, 2.2 * z, 0, Math.PI * 2); ctx.fill();
      r._eye = [px + fx * 4 * z, cy + 2 * z + fy * 2 * z];
    } else if (r.type === 'breaker') {
      ctx.beginPath(); ctx.ellipse(px, py, 16 * z, 8 * z, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#26282c';
      roundRect(px - 15 * z, py - 9 * z, 30 * z, 9 * z, 4 * z);
      ctx.fillStyle = flash ? '#fff' : '#d9a521';
      ctx.fillRect(px - 12 * z, py - 30 * z, 24 * z, 22 * z);
      ctx.fillStyle = '#1e1f22';
      for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(px - 12 * z + k * 7 * z, py - 8 * z); ctx.lineTo(px - 8 * z + k * 7 * z, py - 8 * z); ctx.lineTo(px - 12 * z + k * 7 * z + 7 * z, py - 15 * z); ctx.lineTo(px - 12 * z + k * 7 * z + 3 * z, py - 15 * z); ctx.closePath(); ctx.fill(); }
      ctx.fillStyle = flash ? '#fff' : '#b88a18';
      ctx.fillRect(px - 8 * z, py - 40 * z, 16 * z, 11 * z);
      // arm and scoop
      const reach = r.windup > 0 ? 14 : 6;
      ctx.strokeStyle = '#3a3a3a'; ctx.lineWidth = 4 * z;
      ctx.beginPath(); ctx.moveTo(px, py - 26 * z); ctx.lineTo(px + fx * (12 + reach) * z, py - 18 * z + fy * (6 + reach / 2) * z); ctx.stroke(); ctx.lineWidth = 1;
      ctx.fillStyle = eye;
      ctx.fillRect(px - 5 * z + fx * 2 * z, py - 36 * z, 10 * z, 2.5 * z);
      r._eye = [px + fx * 2 * z, py - 35 * z];
    }
    if (r.stun > 0) {
      ctx.strokeStyle = '#9cc8ff';
      ctx.beginPath();
      for (let k = 0; k < 3; k++) {
        const a = t * 8 + k * 2.1;
        ctx.moveTo(px + Math.cos(a) * 8 * z, py - 30 * z + Math.sin(a) * 4 * z);
        ctx.lineTo(px + Math.cos(a + 0.5) * 11 * z, py - 34 * z + Math.sin(a + 0.5) * 4 * z);
      }
      ctx.stroke();
    }
    const headY = py - (r.type === 'breaker' ? 50 : r.type === 'lamplighter' ? 48 : 46) * z;
    // a health bar once it has been hurt
    const maxHp = ROBOTS[r.type].hp;
    if (r.hp < maxHp && r.hp > 0) {
      const bw = 26 * z, bh = 3.5 * z, bx = px - bw / 2, by = headY + 4 * z;
      ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(bx - 1, by - 1, bw + 2, bh + 2);
      ctx.fillStyle = r.hp / maxHp > 0.5 ? '#e0c060' : '#e0604a'; ctx.fillRect(bx, by, bw * r.hp / maxHp, bh);
    }
    // name and mood under the mouse
    const ms = R.mouseScreen;
    if (ms && Math.abs(ms[0] - px) < 16 * z && ms[1] < py + 6 * z && ms[1] > headY - 6 * z) {
      const mood = r.stun > 0 ? 'stunned' : r.state === 'chase' ? 'hunting you' : r.state === 'investigate' ? 'searching' : 'hasn\u2019t noticed you';
      const label = `${ROBOTS[r.type].name} · ${mood}`;
      ctx.font = `600 ${Math.round(11 * Math.max(1, z))}px system-ui`; ctx.textAlign = 'center';
      const tw = ctx.measureText(label).width + 10, ly = headY - 16 * z;
      ctx.fillStyle = 'rgba(8,10,14,0.82)'; ctx.fillRect(px - tw / 2, ly - 13, tw, 18);
      ctx.fillStyle = r.state === 'chase' ? '#ff9c8c' : r.state === 'investigate' ? '#ffd27a' : '#cfe8f0';
      ctx.fillText(label, px, ly);
      ctx.textAlign = 'left';
    }
    if (r.bubble) {
      ctx.font = `bold ${15 * z}px system-ui`; ctx.textAlign = 'center';
      ctx.fillStyle = r.bubble.ch === '!' ? '#ff5a4a' : '#ffc04a';
      ctx.fillText(r.bubble.ch, px, py - (r.type === 'breaker' ? 50 : r.type === 'lamplighter' ? 48 : 46) * z);
      ctx.textAlign = 'left';
    }
  }

  // ---------- light ----------
  function drawDarkness(light, vr) {
    const p = game.player;
    const dpr = R.dpr;
    const alpha = Math.min(0.9, 0.86 * (1 - light) + (game.weather.rain ? 0.12 : 0) + 0.04);
    dctx.setTransform(1, 0, 0, 1, 0, 0);
    dctx.globalCompositeOperation = 'source-over';
    dctx.clearRect(0, 0, dark.width, dark.height);
    if (alpha < 0.03) return false;
    dctx.fillStyle = `rgba(6,9,20,${alpha})`;
    dctx.fillRect(0, 0, dark.width, dark.height);
    dctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    dctx.globalCompositeOperation = 'destination-out';
    const z = R.zoom;
    const px = sx(p.x, p.y), py = sy(p.x, p.y) - 10 * z;
    // around you: enough to see your own hands
    radial(px, py, 70 * z, 0.75);
    if (p.flashlight) {
      const [fx, fy] = screenDir(p.aim);
      const len = 420 * z;
      const a = Math.atan2(fy, fx);
      const gr = dctx.createRadialGradient(px, py, 10, px, py, len);
      gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(0.7, 'rgba(0,0,0,0.85)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      dctx.fillStyle = gr;
      dctx.beginPath(); dctx.moveTo(px, py);
      dctx.ellipse(px, py, len, len * 0.55, 0, a - 0.5, a + 0.5);
      dctx.closePath(); dctx.fill();
    }
    for (const r of game.robots) {
      if (r.type !== 'lamplighter' || !R.vis[idx(r.x | 0, r.y | 0)]) continue;
      const lx = r.x + Math.cos(r.face) * 2.6, ly = r.y + Math.sin(r.face) * 2.6;
      ellipseLight(sx(lx, ly), sy(lx, ly), 2.3 * TW / 2 * z, 2.3 * TH / 2 * z, 0.9);
    }
    for (const d of game.decoys) if (Math.sin(R.time * 10) > 0) radial(sx(d.x, d.y), sy(d.x, d.y), 30 * z, 0.6);
    for (const e of R.effects) if (e.type === 'gunshot' || e.type === 'pulse') radial(sx(e.x, e.y), sy(e.x, e.y), (e.type === 'pulse' ? 160 : 120) * z * (1 - e.t / e.dur), 1);
    // jammer lights
    for (const [k, c] of game.world.containers) {
      if (c.kind === 'jammer' && c.charge > 0 && R.vis[k]) radial(sx((k % W) + 0.5, Math.floor(k / W) + 0.5), sy((k % W) + 0.5, Math.floor(k / W) + 0.5) - 30 * z, 20 * z, 0.5);
    }
    void vr;
    dctx.globalCompositeOperation = 'source-over';
    return true;
  }
  function radial(x, y, r, a) {
    const gr = dctx.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, `rgba(0,0,0,${a})`); gr.addColorStop(1, 'rgba(0,0,0,0)');
    dctx.fillStyle = gr; dctx.beginPath(); dctx.arc(x, y, r, 0, Math.PI * 2); dctx.fill();
  }
  function ellipseLight(x, y, rx, ry, a) {
    dctx.save(); dctx.translate(x, y); dctx.scale(1, ry / rx);
    const gr = dctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    gr.addColorStop(0, `rgba(0,0,0,${a})`); gr.addColorStop(0.75, `rgba(0,0,0,${a * 0.7})`); gr.addColorStop(1, 'rgba(0,0,0,0)');
    dctx.fillStyle = gr; dctx.beginPath(); dctx.arc(0, 0, rx, 0, Math.PI * 2); dctx.fill();
    dctx.restore();
  }

  // ---------- frame ----------
  let game = null;
  R.draw = function (g, dt) {
    game = g;
    R.time += dt;
    const p = g.player;
    const moved = Math.hypot(p.x - R.lastPX, p.y - R.lastPY);
    R.walk += moved * 1.2; R.lastPX = p.x; R.lastPY = p.y;
    // camera follows the player, eased
    const k = Math.min(1, dt * 8);
    if (!R.camInit) { R.camX = p.x; R.camY = p.y; R.camInit = true; }
    R.camX += (p.x - R.camX) * k; R.camY += (p.y - R.camY) * k;
    R.offX = R.w / 2 - (R.camX - R.camY) * TW / 2 * R.zoom;
    R.offY = R.h / 2 - (R.camX + R.camY) * TH / 2 * R.zoom + 20 * R.zoom;
    // shake
    if (R.shake > 0) { R.offX += (Math.random() - 0.5) * R.shake; R.offY += (Math.random() - 0.5) * R.shake; R.shake = Math.max(0, R.shake - dt * 30); }

    // FOV
    const light = daylight(g);
    const baseR = g.dead ? 30 : p.sleeping ? 3 : 5.5 + 17 * light - (g.weather.rain ? 3 * light : 0);
    const flashR = p.flashlight ? 15 : 0;
    const maxR = Math.ceil(Math.max(baseR, flashR));
    R.vis.fill(0);
    const ax = Math.cos(p.aim), ay = Math.sin(p.aim);
    const px0 = Math.floor(p.x), py0 = Math.floor(p.y);
    computeFov(g.world, px0, py0, maxR, (x, y) => {
      const dx = x + 0.5 - p.x, dy = y + 0.5 - p.y, d = Math.hypot(dx, dy);
      let ok = d <= baseR;
      if (!ok && flashR && d <= flashR && (dx * ax + dy * ay) / (d || 1) > 0.86) ok = true;
      if (ok || d < 1.6) { const i = idx(x, y); R.vis[i] = 1; g.world.explored[i] = 1; }
    });

    if (g.backdrop) R.vis.fill(1);
    const ctx2 = ctx;
    ctx2.setTransform(R.dpr, 0, 0, R.dpr, 0, 0);
    ctx2.fillStyle = '#07080c';
    ctx2.fillRect(0, 0, R.w, R.h);

    // visible tile range
    const corners = [R.toWorld(0, 0), R.toWorld(R.w, 0), R.toWorld(0, R.h + 140), R.toWorld(R.w, R.h + 140)];
    const minX = Math.max(0, Math.floor(Math.min(...corners.map(c => c[0]))) - 2);
    const maxX = Math.min(W - 1, Math.ceil(Math.max(...corners.map(c => c[0]))) + 2);
    const minY = Math.max(0, Math.floor(Math.min(...corners.map(c => c[1]))) - 2);
    const maxY = Math.min(H - 1, Math.ceil(Math.max(...corners.map(c => c[1]))) + 2);
    const inView = (x, y) => {
      const X = sx(x + 0.5, y + 0.5), Y = sy(x + 0.5, y + 0.5);
      return X > -80 && X < R.w + 80 && Y > -40 && Y < R.h + 160;
    };
    const w = g.world;

    // ground
    for (let y = minY; y <= maxY; y++) for (let x = minX; x <= maxX; x++) {
      if (!inView(x, y)) continue;
      const i = idx(x, y);
      if (!w.explored[i]) continue;
      dim = R.vis[i] ? 0 : 0.55;
      drawGround(x, y, i);
    }
    dim = 0;

    // effects on the floor: noise rings
    for (const n of g.noises) {
      if (R.showRings === false && n.src !== 'broadcast') continue;
      if (n.src !== 'player' && n.src !== 'decoy' && n.src !== 'broadcast') continue;
      const tt = n.t / 1.2;
      ctx.strokeStyle = n.src === 'broadcast' ? `rgba(255,70,60,${0.5 * (1 - tt)})` : `rgba(240,230,200,${0.28 * (1 - tt)})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(sx(n.x, n.y), sy(n.x, n.y), n.r * tt * TW / 2 * R.zoom * 1.41, n.r * tt * TH / 2 * R.zoom * 1.41, 0, 0, Math.PI * 2);
      ctx.stroke(); ctx.lineWidth = 1;
    }

    // hover highlight
    if (R.hover && !g.dead && !(R.hoverH > 0)) {
      const [hx, hy] = R.hover;
      const ok = R.hoverOk;
      ctx.strokeStyle = ok ? 'rgba(255,230,150,0.9)' : 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 2;
      poly([sx(hx, hy), sy(hx, hy), sx(hx + 1, hy), sy(hx + 1, hy), sx(hx + 1, hy + 1), sy(hx + 1, hy + 1), sx(hx, hy + 1), sy(hx, hy + 1)], null, ctx.strokeStyle);
      ctx.lineWidth = 1;
    }
    if (R.ghost) {
      const [gx, gy, ok] = R.ghost;
      ctx.globalAlpha = 0.55;
      box(gx, gy, 0.08, 30, ok ? '#7fbf6a' : '#c0504a');
      ctx.globalAlpha = 1;
    }
    // jammer radius when close
    for (const [k2, c] of w.containers) {
      if (c.kind !== 'jammer' || !(c.charge > 0) || !R.vis[k2]) continue;
      const jx = (k2 % W) + 0.5, jy = Math.floor(k2 / W) + 0.5;
      ctx.strokeStyle = 'rgba(110,255,160,0.18)'; ctx.setLineDash([6, 6]);
      ctx.beginPath(); ctx.ellipse(sx(jx, jy), sy(jx, jy), JAM_RADIUS * TW / 2 * R.zoom * 1.41, JAM_RADIUS * TH / 2 * R.zoom * 1.41, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);
    }

    // bucket entities by diagonal
    const buckets = new Map();
    const addE = (key, e) => { let b = buckets.get(key); if (!b) buckets.set(key, b = []); b.push(e); };
    if (!g.backdrop) addE(px0 + py0, { kind: 'player', d: p.x + p.y });
    for (const r of g.robots) {
      const i = idx(r.x | 0, r.y | 0);
      if (!R.vis[i] && !g.dead) continue;
      addE((r.x | 0) + (r.y | 0), { kind: 'robot', r, d: r.x + r.y });
    }

    // the Pruitt bus, parked at the county line during the evacuation window
    const bus = evacOpen(g) ? evacPoint() : null;
    const bx = bus ? Math.floor(bus.x) : -9, by = bus ? Math.floor(bus.y) : -9;

    // structures, furniture and entities, back to front
    const minS = minX + minY, maxS = maxX + maxY;
    for (let s = minS; s <= maxS; s++) {
      const x0 = Math.max(minX, s - maxY), x1 = Math.min(maxX, s - minY);
      for (let x = x0; x <= x1; x++) {
        const y = s - x;
        const i = idx(x, y);
        if ((!w.explored[i] && i !== w.mast) || !inView(x, y)) continue;
        dim = R.vis[i] ? 0 : 0.55;
        const c = w.containers.get(i);
        if (c && (c.kind === 'pile' || c.kind === 'wreck')) drawPile(x, y, c);
        const st = w.struct[i];
        if (st === S.FURN && c) drawFurniture(x, y, c);
        else if (st !== S.NONE) drawStruct(x, y, i, st);
        if (x === bx && y === by + 1) drawBus(x, by - 1, by + 1);
      }
      dim = 0;
      const b = buckets.get(s);
      if (b) {
        b.sort((a, c) => a.d - c.d);
        for (const e of b) e.kind === 'player' ? (g.dead ? drawCorpse() : drawPlayer()) : drawRobot(e.r);
      }
    }

    // hover outline around the whole object (wall, window, furniture), drawn on top so it is
    // clear exactly which thing E and right click will use
    if (R.hover && !g.dead && R.hoverH > 0) {
      const [hx, hy] = R.hover;
      const st = w.struct[idx(hx, hy)];
      const hz = Math.min((st === S.WALL || st === S.DOOR || st === S.WINDOW || st === S.BWALL) && isCut(hx, hy) ? 12 : R.hoverH, 50) * R.zoom;
      const L = [sx(hx, hy + 1), sy(hx, hy + 1)], B = [sx(hx + 1, hy + 1), sy(hx + 1, hy + 1)];
      const Rt = [sx(hx + 1, hy), sy(hx + 1, hy)], T = [sx(hx, hy), sy(hx, hy)];
      ctx.save();
      ctx.lineJoin = 'round';
      ctx.strokeStyle = R.hoverOk ? 'rgba(255,226,140,0.95)' : 'rgba(255,255,255,0.35)';
      ctx.shadowColor = R.hoverOk ? 'rgba(255,200,80,0.8)' : 'transparent'; ctx.shadowBlur = 6;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(L[0], L[1]); ctx.lineTo(B[0], B[1]); ctx.lineTo(Rt[0], Rt[1]);
      ctx.lineTo(Rt[0], Rt[1] - hz); ctx.lineTo(T[0], T[1] - hz); ctx.lineTo(L[0], L[1] - hz); ctx.closePath();
      ctx.stroke();
      ctx.globalAlpha = 0.5; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(B[0], B[1]); ctx.lineTo(B[0], B[1] - hz); ctx.lineTo(L[0], L[1] - hz); ctx.moveTo(B[0], B[1] - hz); ctx.lineTo(Rt[0], Rt[1] - hz); ctx.stroke();
      ctx.restore();
    }

    // thrown things in flight
    for (const th of g.thrown) {
      const t = th.t / th.dur;
      const x = th.x0 + (th.x1 - th.x0) * t, y = th.y0 + (th.y1 - th.y0) * t;
      const arc = Math.sin(t * Math.PI) * 30 * R.zoom;
      ctx.fillStyle = th.id === 'pulse' ? '#7fd0ff' : th.id === 'noisemaker' ? '#ff6a6a' : '#c8c8c8';
      ctx.beginPath(); ctx.arc(sx(x, y), sy(x, y) - 14 * R.zoom - arc, 3 * R.zoom, 0, Math.PI * 2); ctx.fill();
    }
    for (const d of g.decoys) {
      const on = Math.sin(R.time * 10) > 0;
      ctx.fillStyle = on ? '#ff4a3a' : '#5a1a14';
      ctx.beginPath(); ctx.arc(sx(d.x, d.y), sy(d.x, d.y) - 3 * R.zoom, 3.5 * R.zoom, 0, Math.PI * 2); ctx.fill();
    }

    // transient effects
    for (const e of R.effects) {
      e.t += dt;
      const tt = e.t / e.dur;
      const X = sx(e.x, e.y), Y = sy(e.x, e.y);
      if (e.type === 'hit' || e.type === 'bash') {
        ctx.strokeStyle = e.type === 'hit' ? `rgba(255,220,120,${1 - tt})` : `rgba(220,200,160,${1 - tt})`;
        ctx.beginPath();
        for (let k2 = 0; k2 < 6; k2++) { const a = k2 * 1.05 + e.seed; ctx.moveTo(X + Math.cos(a) * 4, Y - 20 * R.zoom + Math.sin(a) * 4); ctx.lineTo(X + Math.cos(a) * (6 + tt * 16), Y - 20 * R.zoom + Math.sin(a) * (6 + tt * 16)); }
        ctx.stroke();
      } else if (e.type === 'pulse') {
        ctx.strokeStyle = `rgba(120,200,255,${1 - tt})`; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.ellipse(X, Y, 3.2 * TW / 2 * R.zoom * 1.41 * tt, 3.2 * TH / 2 * R.zoom * 1.41 * tt, 0, 0, Math.PI * 2); ctx.stroke(); ctx.lineWidth = 1;
      } else if (e.type === 'gunshot') {
        const [fx, fy] = screenDir(e.a);
        ctx.strokeStyle = `rgba(255,240,180,${1 - tt})`; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(X, Y - 16 * R.zoom); ctx.lineTo(X + fx * 260 * R.zoom, Y - 16 * R.zoom + fy * 260 * R.zoom); ctx.stroke(); ctx.lineWidth = 1;
      } else if (e.type === 'kill') {
        ctx.fillStyle = `rgba(255,190,90,${1 - tt})`;
        for (let k2 = 0; k2 < 8; k2++) { const a = k2 * 0.8 + e.seed; ctx.fillRect(X + Math.cos(a) * tt * 30, Y - 18 * R.zoom + Math.sin(a) * tt * 20 - (1 - tt) * 10, 2.5, 2.5); }
      } else if (e.type === 'clatter' || e.type === 'glass') {
        ctx.fillStyle = `rgba(230,230,230,${1 - tt})`;
        for (let k2 = 0; k2 < 5; k2++) { const a = k2 * 1.3 + e.seed; ctx.fillRect(X + Math.cos(a) * tt * 14, Y + Math.sin(a) * tt * 7 - 4, 2, 2); }
      }
    }
    R.effects = R.effects.filter(e => e.t < e.dur);

    // darkness
    if (drawDarkness(light, baseR)) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(dark, 0, 0);
      ctx.setTransform(R.dpr, 0, 0, R.dpr, 0, 0);
      // glowing eyes show through the dark
      for (const r of g.robots) {
        if (!r._eye || !R.vis[idx(r.x | 0, r.y | 0)]) continue;
        const [ex, ey] = r._eye;
        const gr = ctx.createRadialGradient(ex, ey, 0, ex, ey, 9 * R.zoom);
        gr.addColorStop(0, eyeColor(r)); gr.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalAlpha = 0.8 * (1 - light);
        ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(ex, ey, 9 * R.zoom, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
    // searchlight tint
    for (const r of g.robots) {
      if (r.type !== 'lamplighter' || !R.vis[idx(r.x | 0, r.y | 0)]) continue;
      const lx = r.x + Math.cos(r.face) * 2.6, ly = r.y + Math.sin(r.face) * 2.6;
      ctx.fillStyle = r.state === 'chase' ? 'rgba(255,90,70,0.13)' : 'rgba(255,245,200,0.12)';
      ctx.beginPath(); ctx.ellipse(sx(lx, ly), sy(lx, ly), 2.3 * TW / 2 * R.zoom, 2.3 * TH / 2 * R.zoom, 0, 0, Math.PI * 2); ctx.fill();
    }

    // rain
    if (g.weather.rain) {
      ctx.strokeStyle = 'rgba(180,200,230,0.28)';
      ctx.beginPath();
      for (let k2 = 0; k2 < 160; k2++) {
        const rx = (hash2(k2, 1, 2) * R.w + R.time * 40) % R.w;
        const ry = (hash2(k2, 2, 3) * R.h + R.time * 700 * (0.8 + hash2(k2, 3, 4) * 0.4)) % R.h;
        ctx.moveTo(rx, ry); ctx.lineTo(rx - 3, ry + 14);
      }
      ctx.stroke();
    }

    // action progress
    if (p.action) {
      const X = sx(p.x, p.y), Y = sy(p.x, p.y) - 52 * R.zoom;
      ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(X - 26, Y, 52, 7);
      ctx.fillStyle = '#e9c46a'; ctx.fillRect(X - 25, Y + 1, 50 * Math.min(1, p.action.t / p.action.dur), 5);
    }
    // hurt vignette
    if (p.hitFlash > 0 || p.hp < 30) {
      const a = Math.max(p.hitFlash * 1.5, p.hp < 30 ? 0.25 + Math.sin(R.time * 4) * 0.08 : 0);
      const gr = ctx.createRadialGradient(R.w / 2, R.h / 2, Math.min(R.w, R.h) * 0.3, R.w / 2, R.h / 2, Math.max(R.w, R.h) * 0.7);
      gr.addColorStop(0, 'rgba(120,0,0,0)'); gr.addColorStop(1, `rgba(140,0,0,${Math.min(0.7, a)})`);
      ctx.fillStyle = gr; ctx.fillRect(0, 0, R.w, R.h);
    }
  };

  function drawCorpse() {
    const p = game.player, z = R.zoom;
    const px = sx(p.x, p.y), py = sy(p.x, p.y);
    ctx.fillStyle = 'rgba(110,10,10,0.6)';
    ctx.beginPath(); ctx.ellipse(px, py, 16 * z, 8 * z, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#3f6f8f'; ctx.fillRect(px - 10 * z, py - 6 * z, 18 * z, 7 * z);
    ctx.fillStyle = '#e0b48c'; ctx.beginPath(); ctx.arc(px + 11 * z, py - 3 * z, 4.5 * z, 0, Math.PI * 2); ctx.fill();
  }

  R.addEffect = (e) => { R.effects.push({ t: 0, dur: 0.5, seed: Math.random() * 6, ...e }); };
  R.reach = REACH;
  R.isCut = (x, y) => !!game && isCut(x, y);
  return R;
}

// Top-down map of everything explored, for the map panel.
export function drawMinimap(canvas, g, scale = 3, opts = {}) {
  const ctx = canvas.getContext('2d');
  canvas.width = W * scale * 2; canvas.height = H * scale;
  const w = g.world;
  const gcol = { [G.GRASS]: '#3e4d2a', [G.ROAD]: '#2b2c30', [G.LINE]: '#2b2c30', [G.WALK]: '#6a675f', [G.WOOD]: '#7a5c3e', [G.TILE]: '#9d9a90', [G.CARPET]: '#6a4e5e', [G.CONCRETE]: '#646466', [G.DIRT]: '#5a4a35', [G.LOT]: '#38393d', [G.FIELD]: '#5f5430' };
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // same orientation as the game view: x runs down-right, y down-left
  ctx.setTransform(scale, scale / 2, -scale, scale / 2, W * scale, 0);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = idx(x, y);
    if (!w.explored[i]) continue;
    const s = w.struct[i];
    let c = gcol[w.ground[i]];
    if (s === S.WALL || s === S.BWALL) c = '#c9c2b0';
    else if (s === S.DOOR) c = w.barr[i] ? '#e07a3a' : '#a07850';
    else if (s === S.WINDOW) c = w.barr[i] ? '#e07a3a' : '#8ab4cc';
    else if (s === S.TREE) c = '#2c3d22';
    else if (s === S.BUSH) c = '#3a5230';
    else if (s === S.FURN) c = w.containers.get(i)?.kind === 'car' ? '#56677a' : '#6a5a48';
    ctx.fillStyle = c;
    ctx.fillRect(x - 0.02, y - 0.02, 1.04, 1.04);
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const P = (x, y) => [(x - y) * scale + W * scale, (x + y) * scale / 2];
  ctx.font = `600 ${Math.max(10, scale * 3.4)}px system-ui`;
  ctx.textAlign = 'center';
  for (const b of opts.labels === false ? [] : w.buildings) {
    if (!b.name || !(b.type === 'store' || b.type === 'depot' || b.type === 'tower')) continue;
    if (!w.explored[idx(b.inX, b.inY)]) continue;
    const [tx, ty] = P(b.x + b.w / 2, b.y + b.h / 2);
    const wd = ctx.measureText(b.name).width + 8;
    ctx.fillStyle = 'rgba(0,0,0,0.65)';
    ctx.fillRect(tx - wd / 2, ty - 10, wd, 14);
    ctx.fillStyle = '#f2e6c8'; ctx.fillText(b.name, tx, ty);
  }
  if (opts.labels !== false && (g.journal?.heard?.some(d => d >= 5) || evacOpen(g))) {
    const e = evacPoint();
    const [ex, ey] = P(e.x, e.y);
    ctx.fillStyle = '#7fe08a';
    ctx.beginPath(); ctx.arc(ex, ey, 5, 0, Math.PI * 2); ctx.fill();
    const label = 'Pruitt bus · day 7, noon';
    ctx.font = `600 ${Math.max(9, scale * 2.6)}px system-ui`;
    const wd = ctx.measureText(label).width + 8;
    ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(ex - wd / 2, ey + 8, wd, 14);
    ctx.fillStyle = '#b8f0c0'; ctx.fillText(label, ex, ey + 19);
  }
  (g.pins || []).forEach((pin, k) => {
    const [px, py] = P(pin.x, pin.y);
    ctx.fillStyle = '#ff7a59'; ctx.strokeStyle = '#000'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - 6, py - 12); ctx.lineTo(px + 6, py - 12); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(px, py - 13, 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.font = '700 9px system-ui'; ctx.fillText(String(k + 1), px, py - 10);
  });
  const p = g.player;
  const [mx, my] = P(p.x, p.y);
  ctx.fillStyle = '#ffd36b';
  ctx.beginPath(); ctx.arc(mx, my, 4, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#000'; ctx.lineWidth = 1.5; ctx.stroke();
  return [mx, my];
}

// Map-canvas pixel to county tile, the inverse of the minimap projection.
export function minimapToWorld(px, py, scale) {
  const X = (px - W * scale) / scale, Y = 2 * py / scale;
  return [(X + Y) / 2, (Y - X) / 2];
}

// The corner radar: a crop of the explored map around you, with robots you can see.
let radarSrc = null, radarT = 0;
export function drawRadar(canvas, g, vis, dt) {
  const scale = 2;
  radarT -= dt;
  if (!radarSrc || radarT <= 0) { radarSrc ||= document.createElement('canvas'); drawMinimap(radarSrc, g, scale, { labels: false }); radarT = 1; }
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const P = (x, y) => [(x - y) * scale + W * scale, (x + y) * scale / 2];
  const [mx, my] = P(g.player.x, g.player.y);
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(7,8,12,0.9)'; ctx.fillRect(0, 0, w, h);
  const zoom = 2.6;
  ctx.save();
  ctx.translate(w / 2, h / 2); ctx.scale(zoom, zoom); ctx.translate(-mx, -my);
  ctx.drawImage(radarSrc, 0, 0);
  for (const r of g.robots) {
    if (!vis[idx(r.x | 0, r.y | 0)]) continue;
    const [rx, ry] = P(r.x, r.y);
    ctx.fillStyle = r.state === 'chase' ? '#ff4a3a' : r.state === 'investigate' ? '#ffb43a' : '#9fd8e8';
    ctx.beginPath(); ctx.arc(rx, ry, 2.2, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = '#ffd36b';
  ctx.beginPath(); ctx.arc(mx, my, 2.6, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
