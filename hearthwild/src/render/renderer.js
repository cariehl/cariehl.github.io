// Isometric hex renderer (Canvas 2D). Reads simulation state; never changes it.
// Rows are drawn back to front: each row's hex prisms, then everything standing on that row, so taller
// things in front hide things behind.
import { SQRT3, fromPlane, DIRS } from '../sim/core/hex.js';
import { clamp } from '../sim/core/units.js';
import { DESIG } from '../sim/world/world.js';

export const R = 16;        // hex radius in pixels at zoom 1
export const SQ = 0.6;      // vertical squash of the ground plane
export const HS = 3.0;      // pixels per metre of elevation

const CORNERS = [-90, -30, 30, 90, 150, 210].map(a => [Math.cos(a * Math.PI / 180), Math.sin(a * Math.PI / 180) * SQ]);
const rgb = (c) => `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`;
const shade = (c, k) => [c[0] * k, c[1] * k, c[2] * k];
const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const hex2rgb = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const DECIDUOUS = new Set(['birch', 'oak', 'willow', 'hazel', 'bramble']);
const CAT_COLOR = { food: '#d9a441', materials: '#a07850', tools: '#9fb0c0', clothing: '#8e7cc3', medical: '#e06666', seeds: '#b6d36b' };

export class Renderer {
  constructor(canvas, game) {
    this.cv = canvas; this.ctx = canvas.getContext('2d');
    this.game = game;
    this.cam = { x: 0, y: 0, zoom: 1.4 };
    this.hover = -1; this.selection = new Set(); this.selected = null;
    this.showRoofs = true; this.overlay = null;
    this.dark = document.createElement('canvas');
    this.colorsAt = -1e9; this.colors = null; this.colorsRgb = null;
    this.particles = [];
    this.t0 = performance.now();
    this.mini = null;
  }
  get sim() { return this.game.sim; }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = this.cv.clientWidth, h = this.cv.clientHeight;
    this.cv.width = Math.round(w * dpr); this.cv.height = Math.round(h * dpr);
    this.dark.width = this.cv.width; this.dark.height = this.cv.height;
    this.dpr = dpr; this.W = w; this.H = h;
  }

  // ---- projection
  planeXY(i) { const w = this.sim.world; return [R * SQRT3 * (w.q[i] + w.r[i] / 2), R * 1.5 * w.r[i] * SQ]; }
  topZ(i) { const w = this.sim.world; return w.elev[i] + (w.water[i] > 0.05 ? w.water[i] - 0.15 : 0); }
  toScreen(x, y) { const z = this.cam.zoom; return [(x - this.cam.x) * z + this.W / 2, (y - this.cam.y) * z + this.H / 2]; }
  tileScreen(i) { const [x, y] = this.planeXY(i); return this.toScreen(x, y - this.topZ(i) * HS); }
  centerOn(i) { const [x, y] = this.planeXY(i); this.cam.x = x; this.cam.y = y - this.topZ(i) * HS; }

  pick(sx, sy) {
    const w = this.sim.world, z = this.cam.zoom;
    const x = (sx - this.W / 2) / z + this.cam.x, y = (sy - this.H / 2) / z + this.cam.y;
    const r0 = Math.floor(y / (R * 1.5 * SQ));
    const maxLift = Math.ceil((w.elevMax + 6) * HS / (R * 1.5 * SQ)) + 2;
    for (let r = Math.min(w.H - 1, r0 + maxLift); r >= Math.max(0, r0 - 2); r--) {
      const qMid = Math.round(x / (R * SQRT3) - r / 2);
      for (let q = qMid - 2; q <= qMid + 2; q++) {
        const i = w.idx(q, r); if (i < 0) continue;
        const [px, py] = this.planeXY(i);
        const dy = (y - (py - this.topZ(i) * HS)) / SQ, dx = x - px;
        const [hq, hr] = fromPlane(dx, dy, R);
        if (hq === 0 && hr === 0) return i;
      }
    }
    return -1;
  }

  // ---- tile colours, refreshed every couple of seconds
  refreshColors() {
    const s = this.sim, w = s.world, defs = s.defs, N = w.N;
    if (!this.colors) { this.colors = new Array(N); this.colorsRgb = new Uint8ClampedArray(N * 3); }
    const season = s.t.season, yf = s.t.yearFrac;
    const grassTint = season === 0 ? [96, 132, 58] : season === 1 ? [92, 124, 52] : season === 2 ? [140, 126, 64] : [118, 108, 78];
    for (let i = 0; i < N; i++) {
      let c;
      if (w.water[i] > 0.05) {
        const d = clamp(w.water[i] / 3, 0, 1);
        c = mix([78, 128, 150], [32, 66, 100], d);
        if (w.ice[i] > 0.02) c = mix(c, [205, 222, 232], clamp(w.ice[i] * 8, 0.3, 0.95));
      } else {
        const t = defs.at('terrain', w.terrain[i]);
        c = t.color;
        const f = w.flora[i] ? defs.at('flora', w.flora[i]) : null;
        if (f && (f.form === 'grass' || f.id === 'heather')) c = mix(c, f.id === 'heather' ? (season === 2 ? [120, 80, 120] : [96, 84, 86]) : grassTint, 0.55 * clamp(w.forage[i] + 0.3, 0, 1));
        if (w.forestMask && w.forestMask[i] === 2 && t.fertility > 0.1) c = mix(c, [60, 74, 44], 0.25);
        c = shade(c, 1.08 - w.moist[i] * 0.22);
        const sn = w.snow[i];
        if (sn > 0.005) c = mix(c, [236, 240, 246], clamp(sn * 9, 0.25, 0.96));
      }
      // gentle light from the west on slopes
      const e = w.nb[i * 6 + 0], wv = w.nb[i * 6 + 3];
      if (e >= 0 && wv >= 0) c = shade(c, clamp(1 + (w.elev[wv] - w.elev[e]) * 0.035, 0.8, 1.2));
      this.colorsRgb[i * 3] = c[0]; this.colorsRgb[i * 3 + 1] = c[1]; this.colorsRgb[i * 3 + 2] = c[2];
      this.colors[i] = rgb(c);
    }
    this.colorsAt = performance.now();
    this.colorsVer = w.version;
  }

  draw() {
    const s = this.sim, w = s.world, ctx = this.ctx, z = this.cam.zoom;
    if (!this.colors || performance.now() - this.colorsAt > 2500 || this.colorsVer !== w.version) this.refreshColors();
    // Animation time only runs while the game does, so a paused game is a still picture.
    const real = performance.now(), step = Math.min(0.1, (real - (this.lastReal ?? real)) / 1000);
    this.lastReal = real;
    if (this.game.speed) this.animT = (this.animT || 0) + step;
    const now = this.animT || 0;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    const sky = s.t.sky;
    ctx.fillStyle = `rgb(${12 + sky * 30},${16 + sky * 34},${24 + sky * 40})`;
    ctx.fillRect(0, 0, this.W, this.H);

    // visible window
    const rowH = R * 1.5 * SQ;
    const top = this.cam.y - this.H / 2 / z, bot = this.cam.y + this.H / 2 / z;
    const left = this.cam.x - this.W / 2 / z, right = this.cam.x + this.W / 2 / z;
    const r0 = Math.max(0, Math.floor(top / rowH) - 2);
    const r1 = Math.min(w.H - 1, Math.ceil((bot + (w.elevMax + 8) * HS) / rowH) + 1);
    const cw = R * SQRT3;
    const corners = CORNERS.map(([cx, cy]) => [cx * R * z, cy * R * z]);
    const objects = [];
    const lights = [];
    for (let r = r0; r <= r1; r++) {
      const q0 = Math.floor(left / cw - r / 2) - 1, q1 = Math.ceil(right / cw - r / 2) + 1;
      // tiles
      for (let q = q0; q <= q1; q++) {
        const i = w.idx(q, r); if (i < 0) continue;
        this.drawTile(i, corners, z);
      }
      // things on this row
      for (let q = q0; q <= q1; q++) {
        const i = w.idx(q, r); if (i < 0) continue;
        if (!w.seen[i]) continue;
        this.drawStuff(i, z, now, lights);
      }
    }
    this.drawOverlays(z);
    this.drawNight(lights, z, now);
    this.drawWeather(now);
  }

  drawTile(i, corners, z) {
    const s = this.sim, w = s.world, ctx = this.ctx;
    const [sx, sy] = this.tileScreen(i);
    if (sx < -40 || sx > this.W + 40 || sy < -60 || sy > this.H + 200) return;
    const seen = w.seen[i];
    const top = this.topZ(i);
    const c = seen ? this.colors[i] : '#14171c';
    // side faces down to the south-east and south-west neighbours
    const se = w.nb[i * 6 + 5], sw = w.nb[i * 6 + 4];
    const hSE = (top - (se >= 0 ? this.topZ(se) : top - 4)) * HS * z;
    const hSW = (top - (sw >= 0 ? this.topZ(sw) : top - 4)) * HS * z;
    const base = seen ? [this.colorsRgb[i * 3], this.colorsRgb[i * 3 + 1], this.colorsRgb[i * 3 + 2]] : [20, 23, 28];
    const isWater = w.water[i] > 0.05;
    const sideBase = isWater ? [60, 70, 76] : seen ? mix(base, [96, 84, 70], 0.5) : base;
    if (hSE > 0.5) {
      ctx.fillStyle = rgb(shade(sideBase, 0.62));
      ctx.beginPath();
      ctx.moveTo(sx + corners[2][0], sy + corners[2][1]); ctx.lineTo(sx + corners[3][0], sy + corners[3][1]);
      ctx.lineTo(sx + corners[3][0], sy + corners[3][1] + hSE); ctx.lineTo(sx + corners[2][0], sy + corners[2][1] + hSE);
      ctx.fill();
    }
    if (hSW > 0.5) {
      ctx.fillStyle = rgb(shade(sideBase, 0.78));
      ctx.beginPath();
      ctx.moveTo(sx + corners[3][0], sy + corners[3][1]); ctx.lineTo(sx + corners[4][0], sy + corners[4][1]);
      ctx.lineTo(sx + corners[4][0], sy + corners[4][1] + hSW); ctx.lineTo(sx + corners[3][0], sy + corners[3][1] + hSW);
      ctx.fill();
    }
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.moveTo(sx + corners[0][0], sy + corners[0][1]);
    for (let k = 1; k < 6; k++) ctx.lineTo(sx + corners[k][0], sy + corners[k][1]);
    ctx.closePath(); ctx.fill();
    if (z > 1.1 && seen) { ctx.strokeStyle = 'rgba(0,0,0,0.07)'; ctx.lineWidth = 1; ctx.stroke(); }
    if (!seen) return;
    // zones and designations tint the top
    if (w.zone[i]) {
      const zone = s.zones.get(w.zone[i]);
      if (zone) { ctx.fillStyle = s.defs.must('zone', zone.type).color; ctx.fill(); }
    }
    if (w.fire[i] > 0) { ctx.fillStyle = `rgba(255,${120 + Math.random() * 60},40,${0.35 + w.fire[i] * 0.4})`; ctx.fill(); }
  }

  drawStuff(i, z, now, lights) {
    const s = this.sim, w = s.world, ctx = this.ctx, defs = s.defs;
    const [sx, sy] = this.tileScreen(i);
    if (sx < -80 || sx > this.W + 80 || sy < -120 || sy > this.H + 120) return;
    const u = R * z; // unit length
    // structures
    if (w.struct[i]) this.drawWall(i, sx, sy, z);
    // flora
    if (w.flora[i]) this.drawFlora(i, sx, sy, u, z);
    // designations
    if (w.desig[i]) this.drawDesig(i, sx, sy, u);
    // entities
    const list = s.ents.at(i);
    if (list.size) {
      const sorted = [...list].sort((a, b) => order(a) - order(b));
      for (const e of sorted) this.drawEntity(e, sx, sy, u, z, now, lights);
    }
    if (w.roof[i] && this.showRoofs) this.drawRoof(i, sx, sy, z);
    if (w.fire[i] > 0) { this.drawFlame(sx, sy - u * 0.2, u * (0.6 + w.fire[i]), now + i); lights.push([sx, sy, 5 * u * w.fire[i] + 2 * u, 1]); }
  }

  drawWall(i, sx, sy, z) {
    const s = this.sim, w = s.world, ctx = this.ctx, d = s.defs.at('structure', w.struct[i]);
    const mat = w.structMat[i] ? s.defs.at('material', w.structMat[i]) : null;
    let col = hex2rgb(mat?.color && d.matFromCost ? mat.color : d.color);
    const h = d.height * HS * z, u = R * z * 0.92;
    const cs = CORNERS.map(([cx, cy]) => [cx * u, cy * u]);
    const door = d.type === 'door';
    if (door) col = hex2rgb(d.color);
    // two visible faces and the top
    ctx.fillStyle = rgb(shade(col, 0.62));
    ctx.beginPath(); ctx.moveTo(sx + cs[2][0], sy + cs[2][1] - h); ctx.lineTo(sx + cs[3][0], sy + cs[3][1] - h); ctx.lineTo(sx + cs[3][0], sy + cs[3][1]); ctx.lineTo(sx + cs[2][0], sy + cs[2][1]); ctx.fill();
    ctx.fillStyle = rgb(shade(col, 0.8));
    ctx.beginPath(); ctx.moveTo(sx + cs[3][0], sy + cs[3][1] - h); ctx.lineTo(sx + cs[4][0], sy + cs[4][1] - h); ctx.lineTo(sx + cs[4][0], sy + cs[4][1]); ctx.lineTo(sx + cs[3][0], sy + cs[3][1]); ctx.fill();
    ctx.fillStyle = rgb(shade(col, 1.08));
    ctx.beginPath(); ctx.moveTo(sx + cs[0][0], sy + cs[0][1] - h); for (let k = 1; k < 6; k++) ctx.lineTo(sx + cs[k][0], sy + cs[k][1] - h); ctx.closePath(); ctx.fill();
    if (door) { ctx.fillStyle = 'rgba(30,20,10,0.6)'; ctx.fillRect(sx - u * 0.25, sy - h * 0.85 + u * 0.3, u * 0.5, h * 0.8); }
    else if (z > 1 && d.id === 'log_wall') { ctx.strokeStyle = 'rgba(0,0,0,0.18)'; ctx.lineWidth = 1; for (let k = 1; k < 4; k++) { const yy = sy - h * k / 4; ctx.beginPath(); ctx.moveTo(sx + cs[4][0], yy + cs[4][1]); ctx.lineTo(sx + cs[3][0], yy + cs[3][1]); ctx.lineTo(sx + cs[2][0], yy + cs[2][1]); ctx.stroke(); } }
  }

  drawRoof(i, sx, sy, z) {
    const s = this.sim, ctx = this.ctx, d = s.defs.at('structure', s.world.roof[i]);
    const h = 2.6 * HS * z, u = R * z * 1.04;
    const sel = this.selected && this.selected.i === i;
    ctx.fillStyle = sel ? 'rgba(179,155,92,0.35)' : d.color;
    ctx.beginPath(); for (let k = 0; k < 6; k++) { const [cx, cy] = CORNERS[k]; ctx[k ? 'lineTo' : 'moveTo'](sx + cx * u, sy + cy * u - h); } ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(80,60,30,0.35)'; ctx.lineWidth = 1; ctx.stroke();
  }

  drawFlora(i, sx, sy, u, z) {
    const s = this.sim, w = s.world, ctx = this.ctx, f = s.defs.at('flora', w.flora[i]);
    const g = w.growth[i], season = s.t.season, yf = s.t.yearFrac;
    const snowy = w.snow[i] > 0.05;
    const jx = ((i * 9301 + 49297) % 233280) / 233280 - 0.5, jy = ((i * 4271 + 1237) % 1000) / 1000 - 0.5;
    const x = sx + jx * u * 0.5, y = sy + jy * u * 0.25;
    switch (f.form) {
      case 'tree': {
        const h = (0.6 + 1.6 * g) * u * (f.height / 18), cr = (0.35 + 0.45 * g) * u * (f.height > 14 ? 1 : 0.8);
        ctx.strokeStyle = f.trunk; ctx.lineWidth = Math.max(1, u * 0.12);
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - h * 0.65); ctx.stroke();
        const bare = DECIDUOUS.has(f.id) && (season === 3 || yf > 0.72 || yf < 0.04);
        if (bare) {
          ctx.lineWidth = Math.max(0.6, u * 0.05);
          ctx.beginPath(); for (let k = -1; k <= 1; k++) { ctx.moveTo(x, y - h * 0.5); ctx.lineTo(x + k * cr * 0.8, y - h * 0.9); } ctx.stroke();
          if (snowy) { ctx.fillStyle = 'rgba(240,244,250,0.8)'; ctx.fillRect(x - cr * 0.6, y - h * 0.92, cr * 1.2, u * 0.08); }
        } else {
          let col = hex2rgb(f.color);
          if (season === 2) col = mix(col, f.id === 'oak' ? [150, 110, 40] : [200, 160, 50], clamp((yf - 0.5) * 6, 0, 0.8));
          if (season === 0 && yf < 0.12) col = mix(col, [150, 180, 110], 0.4);
          ctx.fillStyle = rgb(shade(col, 0.82));
          circle(ctx, x + cr * 0.3, y - h * 0.72, cr * 0.8);
          ctx.fillStyle = rgb(col);
          circle(ctx, x - cr * 0.25, y - h * 0.82, cr * 0.85);
          ctx.fillStyle = rgb(shade(col, 1.12));
          circle(ctx, x, y - h * 1.0, cr * 0.7);
          if (snowy) { ctx.fillStyle = 'rgba(240,244,250,0.85)'; circle(ctx, x, y - h * 1.12, cr * 0.4); }
        }
        break;
      }
      case 'conifer': {
        const h = (0.6 + 1.8 * g) * u * (f.height / 20), wd = (0.3 + 0.4 * g) * u;
        ctx.strokeStyle = f.trunk; ctx.lineWidth = Math.max(1, u * 0.1);
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - h * 0.3); ctx.stroke();
        const col = hex2rgb(f.color);
        for (let k = 0; k < 3; k++) {
          const yb = y - h * (0.2 + k * 0.27), yt = yb - h * 0.45, ww = wd * (1 - k * 0.25);
          ctx.fillStyle = rgb(shade(col, 0.85 + k * 0.1));
          ctx.beginPath(); ctx.moveTo(x - ww, yb); ctx.lineTo(x + ww, yb); ctx.lineTo(x, yt); ctx.closePath(); ctx.fill();
          if (snowy) { ctx.fillStyle = 'rgba(238,242,248,0.85)'; ctx.beginPath(); ctx.moveTo(x - ww * 0.35, yt + h * 0.16); ctx.lineTo(x + ww * 0.35, yt + h * 0.16); ctx.lineTo(x, yt); ctx.fill(); }
        }
        break;
      }
      case 'shrub': {
        if (f.id === 'heather') { if (z < 0.9) break; ctx.fillStyle = season === 2 ? '#9a6aa0' : '#6e5a68'; circle(ctx, x, y - u * 0.08, u * 0.18); break; }
        const r = u * (f.height > 2 ? 0.42 : f.height > 1 ? 0.3 : 0.2) * (0.5 + 0.5 * g);
        const bare = DECIDUOUS.has(f.id) && season === 3;
        ctx.fillStyle = bare ? '#6b5a48' : f.color;
        circle(ctx, x - r * 0.4, y - r * 0.7, r * 0.8); circle(ctx, x + r * 0.4, y - r * 0.7, r * 0.8); circle(ctx, x, y - r * 1.2, r * 0.8);
        if (w.yield[i] >= 1 && f.yield) {
          const it = f.yield.item; ctx.fillStyle = it === 'berries' ? (f.id === 'bilberry' ? '#3d4bb0' : '#b0303a') : it === 'hazelnuts' ? '#9a6a30' : '#ddd';
          const n = Math.min(5, Math.ceil(w.yield[i] / 2));
          for (let k = 0; k < n; k++) circle(ctx, x + Math.cos(k * 2.3) * r * 0.7, y - r * (0.9 + Math.sin(k * 2.3) * 0.4), Math.max(1, u * 0.05));
        }
        if (snowy) { ctx.fillStyle = 'rgba(240,244,250,0.8)'; circle(ctx, x, y - r * 1.5, r * 0.5); }
        break;
      }
      case 'grass': {
        if (z < 1 && f.id === 'grass') break;
        const tall = f.height > 1;
        ctx.strokeStyle = tall ? (season === 3 ? '#9a8a60' : f.color) : season === 2 || season === 3 ? '#a09060' : '#6f8f3a';
        ctx.lineWidth = Math.max(0.7, u * 0.04);
        const n = tall ? 6 : 3, hh = u * (tall ? 0.7 : 0.22);
        ctx.beginPath();
        for (let k = 0; k < n; k++) { const ox = (k - n / 2) * u * 0.1 + jx * u * 0.2; ctx.moveTo(x + ox, y); ctx.lineTo(x + ox + u * 0.05, y - hh * (0.7 + (k % 2) * 0.3)); }
        ctx.stroke();
        break;
      }
      case 'herb': {
        if (z < 0.8) break;
        if (f.id === 'mushrooms') { if (w.yield[i] >= 1) { ctx.fillStyle = '#c9a77a'; circle(ctx, x, y - u * 0.05, u * 0.08); circle(ctx, x + u * 0.12, y, u * 0.06); } break; }
        if (f.id === 'cattail') { ctx.strokeStyle = '#6c7a3c'; ctx.lineWidth = Math.max(0.7, u * 0.05); ctx.beginPath(); for (let k = -1; k <= 1; k++) { ctx.moveTo(x + k * u * 0.12, y); ctx.lineTo(x + k * u * 0.14, y - u * 0.7); } ctx.stroke(); ctx.fillStyle = '#5a3a20'; for (let k = -1; k <= 1; k++) ctx.fillRect(x + k * u * 0.14 - u * 0.03, y - u * 0.7, u * 0.06, u * 0.18); break; }
        ctx.fillStyle = f.color; circle(ctx, x, y - u * 0.08, u * 0.14);
        if (f.id === 'yarrow' && w.yield[i] >= 1) { ctx.fillStyle = '#f0eee0'; circle(ctx, x, y - u * 0.2, u * 0.07); }
        break;
      }
      case 'crop': {
        const col = mix([90, 140, 60], hex2rgb(f.color), g);
        ctx.strokeStyle = rgb(col); ctx.lineWidth = Math.max(0.8, u * 0.05);
        const hh = u * (0.1 + 0.5 * g) * (f.height);
        ctx.beginPath();
        for (let rr = -1; rr <= 1; rr++) for (let k = -2; k <= 2; k++) { const ox = k * u * 0.16, oy = rr * u * 0.14; ctx.moveTo(sx + ox, sy + oy); ctx.lineTo(sx + ox, sy + oy - hh); }
        ctx.stroke();
        if (g >= 1) { ctx.fillStyle = 'rgba(255,230,120,0.35)'; circle(ctx, sx, sy - hh, u * 0.25); }
        break;
      }
    }
  }

  drawDesig(i, sx, sy, u) {
    const ctx = this.ctx, d = this.sim.world.desig[i];
    const marks = [];
    if (d & DESIG.chop) marks.push(['#e05a3a', 'C']);
    if (d & DESIG.gather) marks.push(['#5ac85a', 'G']);
    if (d & DESIG.mine) marks.push(['#b0b0c0', 'M']);
    if (d & DESIG.clear) marks.push(['#e0a03a', 'X']);
    if (d & DESIG.fish) marks.push(['#5ab0e0', 'F']);
    marks.forEach(([c, l], k) => {
      const x = sx + (k - (marks.length - 1) / 2) * u * 0.5, y = sy + u * 0.1;
      ctx.fillStyle = c; ctx.globalAlpha = 0.85; circle(ctx, x, y, Math.max(3, u * 0.18)); ctx.globalAlpha = 1;
      if (u > 14) { ctx.fillStyle = '#111'; ctx.font = `bold ${Math.round(u * 0.24)}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(l, x, y + 0.5); }
    });
  }

  drawEntity(e, sx, sy, u, z, now, lights) {
    const s = this.sim, ctx = this.ctx;
    // interpolate movement
    let x = sx, y = sy;
    if (e.mv && e.mv.from !== undefined && e.mv.from !== e.i && e.mv.cost > 0) {
      // between previous hex and this one: draw progress toward next hex instead
      const nxt = e.mv.path[e.mv.k];
      if (nxt !== undefined) { const [nx, ny] = this.tileScreen(nxt); const t = clamp(e.mv.prog / e.mv.cost, 0, 1); x = sx + (nx - sx) * t; y = sy + (ny - sy) * t; }
    }
    switch (e.kind) {
      case 'item': {
        const d = s.defs.must('item', e.stack.item);
        const k = [...s.ents.at(e.i)].filter(o => o.kind === 'item').indexOf(e);
        const ox = ((k % 2) - 0.5) * u * 0.45, oy = (Math.floor(k / 2) - 0.5) * u * 0.25;
        if (e.stack.item === 'log') { ctx.fillStyle = '#7a5532'; ctx.fillRect(x + ox - u * 0.25, y + oy - u * 0.12, u * 0.5, u * 0.14); ctx.fillStyle = '#c9a070'; circle(ctx, x + ox + u * 0.25, y + oy - u * 0.05, u * 0.07); }
        else if (e.stack.item === 'stone') { ctx.fillStyle = s.defs.get('material', e.stack.mat)?.color || '#888'; circle(ctx, x + ox, y + oy - u * 0.06, u * 0.12); circle(ctx, x + ox + u * 0.1, y + oy - u * 0.02, u * 0.09); }
        else { ctx.fillStyle = CAT_COLOR[d.cat] || '#ccc'; ctx.fillRect(x + ox - u * 0.11, y + oy - u * 0.16, u * 0.22, u * 0.16); ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(x + ox - u * 0.11, y + oy - u * 0.02, u * 0.22, u * 0.03); }
        if (e.forbidden) { ctx.strokeStyle = '#e04040'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x + ox - 4, y + oy - 4); ctx.lineTo(x + ox + 4, y + oy + 4); ctx.stroke(); }
        break;
      }
      case 'blueprint': {
        const d = s.defs.must('structure', e.def);
        ctx.strokeStyle = 'rgba(120,190,255,0.9)'; ctx.setLineDash([3, 3]); ctx.lineWidth = 1.5;
        const h = d.type === 'roof' ? 2.6 * HS * z : d.type === 'building' ? 0 : d.height * HS * z;
        ctx.beginPath(); for (let k = 0; k < 6; k++) { const [cx, cy] = CORNERS[k]; ctx[k ? 'lineTo' : 'moveTo'](sx + cx * u * 0.85, sy + cy * u * 0.85 - h); } ctx.closePath(); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(120,190,255,0.18)'; ctx.fill();
        break;
      }
      case 'building': this.drawBuilding(e, sx, sy, u, z, now, lights); break;
      case 'corpse': {
        const col = e.human ? '#8a8a90' : s.defs.get('fauna', e.species)?.color || '#777';
        const sz = e.human ? 0.4 : 0.25 + (s.defs.get('fauna', e.species)?.size || 0.5) * 0.3;
        ctx.fillStyle = col; ctx.globalAlpha = (e.fresh ?? 1) < 0 ? 0.55 : 0.9;
        ctx.beginPath(); ctx.ellipse(x, y - u * 0.05, u * sz, u * sz * 0.35, 0.2, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
        if ((e.fresh ?? 1) < 0.3) { ctx.fillStyle = 'rgba(80,90,40,0.4)'; circle(ctx, x, y - u * 0.05, u * sz * 0.5); }
        break;
      }
      case 'animal': this.drawAnimal(e, x, y, u, z, now); break;
      case 'settler': this.drawSettler(e, x, y, u, z, now, lights); break;
    }
  }

  drawBuilding(b, sx, sy, u, z, now, lights) {
    const s = this.sim, ctx = this.ctx, d = s.defs.must('structure', b.def);
    if (d.fire) {
      if (d.id === 'hearth') { ctx.fillStyle = '#7d7a76'; ctx.fillRect(sx - u * 0.4, sy - u * 0.4, u * 0.8, u * 0.45); ctx.fillStyle = '#3a3532'; ctx.fillRect(sx - u * 0.22, sy - u * 0.3, u * 0.44, u * 0.25); }
      else { ctx.fillStyle = '#6e665e'; for (let k = 0; k < 7; k++) { const a = k / 7 * Math.PI * 2; circle(ctx, sx + Math.cos(a) * u * 0.3, sy + Math.sin(a) * u * 0.3 * SQ, u * 0.08); } ctx.fillStyle = '#3a2e26'; circle(ctx, sx, sy, u * 0.18); }
      if (b.lit) {
        const k = clamp(b.fuel / 6, 0.3, 1);
        this.drawFlame(sx, sy - (d.id === 'hearth' ? u * 0.2 : 0), u * 0.6 * k, now + b.id);
        lights.push([sx, sy, d.fire.light * u * (0.7 + 0.3 * k) * 1.4, 1]);
      }
      return;
    }
    if (d.bed) { ctx.fillStyle = d.id === 'frame_bed' ? '#7d5c3c' : '#b9a35e'; ctx.save(); ctx.translate(sx, sy); ctx.scale(1, SQ); ctx.rotate(0.5); ctx.fillRect(-u * 0.25, -u * 0.45, u * 0.5, u * 0.9); ctx.fillStyle = '#d8d0c0'; ctx.fillRect(-u * 0.2, -u * 0.42, u * 0.4, u * 0.2); ctx.restore(); return; }
    if (d.id === 'workbench') { ctx.fillStyle = '#5e4630'; ctx.fillRect(sx - u * 0.4, sy - u * 0.35, u * 0.08, u * 0.35); ctx.fillRect(sx + u * 0.32, sy - u * 0.35, u * 0.08, u * 0.35); ctx.fillStyle = '#8b6b45'; ctx.fillRect(sx - u * 0.45, sy - u * 0.45, u * 0.9, u * 0.14); return; }
    if (d.id === 'drying_rack') { ctx.strokeStyle = '#a58a5c'; ctx.lineWidth = Math.max(1, u * 0.06); ctx.beginPath(); ctx.moveTo(sx - u * 0.4, sy); ctx.lineTo(sx - u * 0.4, sy - u * 0.6); ctx.moveTo(sx + u * 0.4, sy); ctx.lineTo(sx + u * 0.4, sy - u * 0.6); ctx.moveTo(sx - u * 0.45, sy - u * 0.55); ctx.lineTo(sx + u * 0.45, sy - u * 0.55); ctx.stroke(); ctx.fillStyle = '#8a3a30'; for (let k = -1; k <= 1; k++) ctx.fillRect(sx + k * u * 0.22 - u * 0.05, sy - u * 0.55, u * 0.1, u * 0.22); return; }
    if (d.shelter) { ctx.fillStyle = '#8f7a4c'; ctx.beginPath(); ctx.moveTo(sx - u * 0.6, sy + u * 0.1); ctx.lineTo(sx + u * 0.6, sy + u * 0.1); ctx.lineTo(sx + u * 0.4, sy - u * 0.9); ctx.lineTo(sx - u * 0.4, sy - u * 0.9); ctx.closePath(); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(sx - u * 0.6, sy - u * 0.05, u * 1.2, u * 0.15); return; }
    ctx.fillStyle = d.color; ctx.fillRect(sx - u * 0.3, sy - u * 0.3, u * 0.6, u * 0.3);
  }

  drawFlame(x, y, size, t) {
    const ctx = this.ctx, f = 0.85 + Math.sin(t * 13) * 0.1 + Math.sin(t * 7.3) * 0.06;
    ctx.fillStyle = 'rgba(255,140,40,0.85)';
    ctx.beginPath(); ctx.moveTo(x - size * 0.35, y); ctx.quadraticCurveTo(x, y - size * 1.4 * f, x + size * 0.35, y); ctx.fill();
    ctx.fillStyle = 'rgba(255,220,120,0.9)';
    ctx.beginPath(); ctx.moveTo(x - size * 0.18, y); ctx.quadraticCurveTo(x, y - size * 0.8 * f, x + size * 0.18, y); ctx.fill();
  }

  drawAnimal(a, x, y, u, z, now) {
    const s = this.sim, ctx = this.ctx, d = s.defs.must('fauna', a.species);
    const sz = u * (0.25 + d.size * 0.35) * Math.pow(a.massKg / d.massKg, 0.33);
    const moving = a.mv && a.mv.k < a.mv.path.length;
    const dir = moving ? Math.sign(this.tileScreen(a.mv.path[a.mv.k])[0] - x) || 1 : (a.id % 2 ? 1 : -1);
    const resting = a.animal.state === 'rest' || a.animal.state === 'hibernate' || !a.body.conscious;
    ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.beginPath(); ctx.ellipse(x, y, sz * 0.9, sz * 0.3, 0, 0, Math.PI * 2); ctx.fill();
    const legH = resting ? 0 : sz * 0.55, by = y - legH - sz * 0.35;
    if (!resting) {
      ctx.strokeStyle = shadeHex(d.color, 0.7); ctx.lineWidth = Math.max(1, sz * 0.12);
      const sw = moving ? Math.sin(now * 14 + a.id) * sz * 0.2 : 0;
      ctx.beginPath();
      ctx.moveTo(x - sz * 0.45, by); ctx.lineTo(x - sz * 0.45 + sw, y);
      ctx.moveTo(x + sz * 0.45, by); ctx.lineTo(x + sz * 0.45 - sw, y);
      ctx.stroke();
    }
    ctx.fillStyle = d.color;
    ctx.beginPath(); ctx.ellipse(x, by, sz * 0.7, sz * 0.36, 0, 0, Math.PI * 2); ctx.fill();
    // head
    ctx.beginPath(); ctx.ellipse(x + dir * sz * 0.75, by - sz * 0.25, sz * 0.26, sz * 0.2, 0, 0, Math.PI * 2); ctx.fill();
    if (a.species === 'deer' && a.sex === 'm' && s.t.yearFrac > 0.25 && s.t.yearFrac < 0.95) {
      ctx.strokeStyle = '#d8c8a8'; ctx.lineWidth = Math.max(1, sz * 0.06);
      ctx.beginPath(); ctx.moveTo(x + dir * sz * 0.75, by - sz * 0.4); ctx.lineTo(x + dir * sz * 0.65, by - sz * 0.85); ctx.moveTo(x + dir * sz * 0.7, by - sz * 0.6); ctx.lineTo(x + dir * sz * 0.95, by - sz * 0.8); ctx.stroke();
    }
    if (a.species === 'hare') { ctx.fillStyle = d.color; ctx.fillRect(x + dir * sz * 0.8 - 1, by - sz * 0.75, Math.max(1.5, sz * 0.1), sz * 0.45); }
    if (a.hunt) { ctx.strokeStyle = '#e05a3a'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, by - sz, sz * 0.25, 0, Math.PI * 2); ctx.moveTo(x - sz * 0.4, by - sz); ctx.lineTo(x + sz * 0.4, by - sz); ctx.stroke(); }
    if (this.selected === a) selRing(ctx, x, y, sz * 1.2);
    if (a.body.blood < a.body.bloodMax * 0.9) { ctx.fillStyle = '#a01818'; circle(ctx, x - sz * 0.2, y + 1, Math.max(1, sz * 0.08)); }
  }

  drawSettler(e, x, y, u, z, now, lights) {
    const ctx = this.ctx, s = this.sim;
    const asleep = e.phys.asleep || !e.body.conscious;
    const h = u * 0.9;
    if (this.selected === e) selRing(ctx, x, y, u * 0.45);
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.ellipse(x, y, u * 0.25, u * 0.09, 0, 0, Math.PI * 2); ctx.fill();
    const skin = ['#e8c4a0', '#c99a72', '#a5754f', '#7a5236'][e.id % 4];
    if (asleep) {
      ctx.fillStyle = e.color; ctx.beginPath(); ctx.ellipse(x, y - u * 0.08, u * 0.32, u * 0.12, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = skin; circle(ctx, x - u * 0.34, y - u * 0.1, u * 0.1);
      if (e.phys.asleep) { ctx.fillStyle = 'rgba(220,230,255,0.9)'; ctx.font = `${Math.round(u * 0.3)}px sans-serif`; ctx.textAlign = 'center'; ctx.fillText('z', x + u * 0.2 + Math.sin(now * 2) * 2, y - u * 0.35 - (now * 6 % 6)); }
      return;
    }
    const moving = e.mv && e.mv.k < e.mv.path.length;
    const sw = moving ? Math.sin(now * 12 + e.id) * u * 0.08 : 0;
    // legs
    ctx.strokeStyle = '#3a3428'; ctx.lineWidth = Math.max(1, u * 0.09);
    ctx.beginPath(); ctx.moveTo(x - u * 0.06, y - h * 0.4); ctx.lineTo(x - u * 0.07 + sw, y); ctx.moveTo(x + u * 0.06, y - h * 0.4); ctx.lineTo(x + u * 0.07 - sw, y); ctx.stroke();
    // body
    const coat = e.equip.outer ? (s.defs.must('item', e.equip.outer.item).id === 'fur_cloak' ? '#6e5b48' : '#5a5048') : e.color;
    ctx.fillStyle = coat; ctx.beginPath(); ctx.ellipse(x, y - h * 0.62, u * 0.16, h * 0.26, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = e.color; ctx.fillRect(x - u * 0.06, y - h * 0.82, u * 0.12, h * 0.3);
    // head
    ctx.fillStyle = skin; circle(ctx, x, y - h * 0.97, u * 0.12);
    if (e.equip.head) { ctx.fillStyle = '#5a4a3a'; ctx.beginPath(); ctx.arc(x, y - h * 0.99, u * 0.125, Math.PI, 0); ctx.fill(); }
    // activity
    const act = e.agent.activity;
    if (['chop', 'mine', 'build', 'dig', 'fight', 'firefight'].includes(act)) {
      const a = Math.sin(now * 8 + e.id) * 0.8;
      ctx.strokeStyle = '#ccc'; ctx.lineWidth = Math.max(1, u * 0.06);
      ctx.beginPath(); ctx.moveTo(x + u * 0.12, y - h * 0.7); ctx.lineTo(x + u * 0.12 + Math.cos(a - 0.8) * u * 0.4, y - h * 0.7 + Math.sin(a - 0.8) * u * 0.4); ctx.stroke();
    }
    if (e.agent.activity === 'warm' || e.phys.cold > 0.5) { ctx.fillStyle = 'rgba(160,200,255,0.9)'; ctx.font = `${Math.round(u * 0.28)}px sans-serif`; ctx.textAlign = 'center'; ctx.fillText('❄', x + u * 0.3, y - h * 1.1); }
    if (e.body.bleedRate > 1) { ctx.fillStyle = '#c01818'; circle(ctx, x - u * 0.15, y - h * 0.5, Math.max(1.5, u * 0.05)); }
    if (e.mind.breakdown) { ctx.fillStyle = '#e0a03a'; ctx.font = `bold ${Math.round(u * 0.35)}px sans-serif`; ctx.textAlign = 'center'; ctx.fillText('!', x, y - h * 1.25); }
    if (z > 1.3 || this.selected === e) {
      ctx.font = `${Math.max(10, Math.round(u * 0.32))}px "Barlow Semi Condensed", sans-serif`; ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillText(e.name.split(' ')[0], x + 1, y - h * 1.22 + 1);
      ctx.fillStyle = '#f2ead8'; ctx.fillText(e.name.split(' ')[0], x, y - h * 1.22);
    }
    // a lantern glow of body heat is not a thing; but settlers near fires are lit by them
  }

  drawOverlays(z) {
    const ctx = this.ctx, w = this.sim.world;
    const outline = (i, color, width = 1.5) => {
      const [sx, sy] = this.tileScreen(i), u = R * z;
      ctx.strokeStyle = color; ctx.lineWidth = width;
      ctx.beginPath(); for (let k = 0; k < 6; k++) { const [cx, cy] = CORNERS[k]; ctx[k ? 'lineTo' : 'moveTo'](sx + cx * u, sy + cy * u); } ctx.closePath(); ctx.stroke();
    };
    for (const i of this.selection) outline(i, 'rgba(255,240,180,0.85)');
    if (this.hover >= 0) outline(this.hover, 'rgba(255,255,255,0.9)', 2);
    if (this.selected && this.selected.kind === 'settler' && this.selected.mv) {
      const mv = this.selected.mv; ctx.strokeStyle = 'rgba(255,240,160,0.5)'; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.5;
      ctx.beginPath(); const [x0, y0] = this.tileScreen(this.selected.i); ctx.moveTo(x0, y0);
      for (let k = mv.k; k < mv.path.length; k++) { const [x, y] = this.tileScreen(mv.path[k]); ctx.lineTo(x, y); }
      ctx.stroke(); ctx.setLineDash([]);
    }
    if (this.overlay === 'temp' || this.overlay === 'moist' || this.overlay === 'fertility') this.drawDataOverlay(z);
  }

  drawDataOverlay(z) {
    const s = this.sim, w = s.world, ctx = this.ctx;
    const step = z < 0.8 ? 2 : 1;
    for (let i = 0; i < w.N; i += 1) {
      if (!w.seen[i]) continue;
      const [sx, sy] = this.tileScreen(i);
      if (sx < -20 || sx > this.W + 20 || sy < -20 || sy > this.H + 20) continue;
      let v, col;
      if (this.overlay === 'moist') { v = w.moist[i]; col = `rgba(${60 - v * 40},${120 + v * 60},${200},${0.15 + v * 0.45})`; }
      else if (this.overlay === 'fertility') { v = s.defs.at('terrain', w.terrain[i]).fertility; col = `rgba(${200 - v * 140},${80 + v * 140},60,0.45)`; }
      else { v = s.environmentTemp ? s.environmentTemp(i) : 0; const t = clamp((v + 15) / 45, 0, 1); col = `rgba(${t * 255},${80},${(1 - t) * 255},0.4)`; }
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(sx, sy, R * z * 0.45, 0, Math.PI * 2); ctx.fill();
    }
  }

  drawNight(lights, z, now) {
    const s = this.sim, sky = s.t.sky, cloud = s.weather.cloud;
    const darkness = clamp((1 - sky) * 0.74 + cloud * 0.12 * sky + (s.weather.precip > 0 ? 0.08 : 0), 0, 0.82);
    if (darkness < 0.03) return;
    const d = this.dark, dc = d.getContext('2d');
    dc.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    dc.globalCompositeOperation = 'source-over';
    dc.clearRect(0, 0, this.W, this.H);
    dc.fillStyle = `rgba(6,10,28,${darkness})`;
    dc.fillRect(0, 0, this.W, this.H);
    dc.globalCompositeOperation = 'destination-out';
    for (const [x, y, r, k] of lights) {
      const fl = 0.92 + Math.sin(now * 9 + x) * 0.05;
      const g = dc.createRadialGradient(x, y, 0, x, y, r * fl);
      g.addColorStop(0, `rgba(0,0,0,${0.95 * k})`); g.addColorStop(0.5, `rgba(0,0,0,${0.55 * k})`); g.addColorStop(1, 'rgba(0,0,0,0)');
      dc.fillStyle = g; dc.beginPath(); dc.ellipse(x, y, r * fl, r * fl * 0.75, 0, 0, Math.PI * 2); dc.fill();
    }
    const ctx = this.ctx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(d, 0, 0);
    // warm tint near fires
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.globalCompositeOperation = 'lighter';
    for (const [x, y, r] of lights) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 0.6);
      g.addColorStop(0, `rgba(255,140,50,${0.18 * darkness})`); g.addColorStop(1, 'rgba(255,140,50,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 0.6, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  drawWeather(now) {
    const W = this.sim.weather, ctx = this.ctx;
    const want = W.precip > 0 ? Math.min(600, Math.round(W.precip * 90 + 40)) : 0;
    const snow = W.type === 'snow';
    while (this.particles.length < want) this.particles.push({ x: Math.random() * this.W, y: Math.random() * this.H, v: 0.6 + Math.random() * 0.6 });
    if (this.particles.length > want) this.particles.length = want;
    if (!want) return;
    const dt = Math.min(0.05, now - (this.lastWeather || now)); this.lastWeather = now;
    const wind = Math.cos(W.windDir) * W.wind;
    ctx.strokeStyle = 'rgba(190,210,235,0.45)'; ctx.fillStyle = 'rgba(245,248,255,0.85)'; ctx.lineWidth = 1;
    ctx.beginPath();
    for (const p of this.particles) {
      const vy = snow ? 40 * p.v : 700 * p.v, vx = wind * (snow ? 8 : 25);
      p.y += vy * dt; p.x += vx * dt + (snow ? Math.sin(now * 2 + p.v * 10) * 0.4 : 0);
      if (p.y > this.H) { p.y -= this.H; p.x = Math.random() * this.W; }
      if (p.x > this.W) p.x -= this.W; if (p.x < 0) p.x += this.W;
      if (snow) ctx.rect(p.x, p.y, 2, 2);
      else { ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - vx * 0.02, p.y - 12 * p.v); }
    }
    if (snow) ctx.fill(); else ctx.stroke();
  }

  // ---- minimap
  drawMinimap(canvas) {
    const s = this.sim, w = s.world;
    if (!this.colorsRgb) return;
    const c = canvas.getContext('2d');
    if (!this.miniImg || this.miniImg.width !== w.W) this.miniImg = c.createImageData(w.W, w.H);
    const d = this.miniImg.data;
    for (let i = 0; i < w.N; i++) {
      const k = i * 4;
      if (!w.seen[i]) { d[k] = 16; d[k + 1] = 18; d[k + 2] = 22; d[k + 3] = 255; continue; }
      let r = this.colorsRgb[i * 3], g = this.colorsRgb[i * 3 + 1], b = this.colorsRgb[i * 3 + 2];
      const f = w.flora[i] && s.defs.at('flora', w.flora[i]);
      if (f && (f.form === 'tree' || f.form === 'conifer')) { r *= 0.6; g *= 0.75; b *= 0.6; }
      if (w.struct[i] || w.roof[i]) { r = 200; g = 170; b = 120; }
      d[k] = r; d[k + 1] = g; d[k + 2] = b; d[k + 3] = 255;
    }
    canvas.width = w.W; canvas.height = w.H;
    c.putImageData(this.miniImg, 0, 0);
    for (const e of s.ents.of('settler')) { c.fillStyle = '#ffe066'; c.fillRect(w.col(e.i) - 1, w.row(e.i) - 1, 3, 3); }
    // camera rectangle in offset coordinates (approximate)
    const z = this.cam.zoom, rowH = R * 1.5 * SQ;
    const rTop = (this.cam.y - this.H / 2 / z) / rowH, rBot = (this.cam.y + this.H / 2 / z) / rowH;
    const cL = (this.cam.x - this.W / 2 / z) / (R * SQRT3), cR = (this.cam.x + this.W / 2 / z) / (R * SQRT3);
    c.strokeStyle = 'rgba(255,255,255,0.8)'; c.lineWidth = 1;
    c.strokeRect(cL, rTop, cR - cL, rBot - rTop);
  }
  minimapToCam(fx, fy) {
    const w = this.sim.world, col = fx * w.W, row = fy * w.H;
    this.cam.x = col * R * SQRT3; this.cam.y = row * R * 1.5 * SQ - 10 * HS;
  }
}

function order(e) { return { blueprint: 0, building: 1, item: 2, corpse: 3, animal: 4, settler: 5 }[e.kind] ?? 6; }
function circle(ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y, Math.max(0.5, r), 0, Math.PI * 2); ctx.fill(); }
function selRing(ctx, x, y, r) { ctx.strokeStyle = '#ffd84a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.4, 0, 0, Math.PI * 2); ctx.stroke(); }
function shadeHex(h, k) { const c = hex2rgb(h); return rgb(shade(c, k)); }
