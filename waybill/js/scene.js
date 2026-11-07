// Waybill: the painted panorama above the ledger. Sky, land by region, landmarks, and your wagon and team.
// WBScene.paint(canvas, opts) draws once (used for event vignettes); WBScene.live(canvas) keeps a canvas
// animated, and .set(opts) / .roll(ms) change what it shows.
(function (root) {
'use strict';

const PAL = {
  tall:     { sky: ['#86aec6', '#e9e2c4'], far: '#7d9a73', mid: '#6b8c4c', ground: '#6f8f47', grass: '#55753a', road: '#8b7a55' },
  mixed:    { sky: ['#93b6cc', '#eee2bd'], far: '#9aa477', mid: '#8f9758', ground: '#a29a5c', grass: '#7f7d40', road: '#9a8458' },
  plains:   { sky: ['#a3c0d3', '#f2e2b5'], far: '#b5a777', mid: '#ae9a62', ground: '#c1a96a', grass: '#9c8749', road: '#a48a5c' },
  dry:      { sky: ['#b2c9d7', '#f6dfae'], far: '#d0b483', mid: '#c9a873', ground: '#d8bd86', grass: '#ad9356', road: '#b89c6a' },
  mountain: { sky: ['#87abc7', '#e4dcc4'], far: '#6c7c8f', mid: '#56684f', ground: '#86884f', grass: '#5f6a3a', road: '#8c7b58' },
  nm:       { sky: ['#97bddb', '#f3d8a6'], far: '#b47c58', mid: '#a7744d', ground: '#c49a63', grass: '#8f8048', road: '#a8875c' },
};

function noise(x, seed) {
  return Math.sin(x * 0.013 + seed) * 0.5 + Math.sin(x * 0.031 + seed * 2.1) * 0.3 + Math.sin(x * 0.071 + seed * 3.7) * 0.2;
}
function mix(a, b, t) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const r = Math.round(((pa >> 16) & 255) * (1 - t) + ((pb >> 16) & 255) * t);
  const g = Math.round(((pa >> 8) & 255) * (1 - t) + ((pb >> 8) & 255) * t);
  const bl = Math.round((pa & 255) * (1 - t) + (pb & 255) * t);
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | bl).toString(16).slice(1);
}

function draw(ctx, W, H, o, t, clock) {
  const pal = PAL[o.region] || PAL.plains;
  const night = o.time === 'night', dusk = o.time === 'dusk';
  const shade = c => night ? mix(c, '#141a2a', 0.72) : dusk ? mix(c, '#5a2d1e', 0.28) : c;
  const hz = H * 0.6;          // horizon
  const gy = H * 0.84;         // where the wheels touch

  // sky
  const sg = ctx.createLinearGradient(0, 0, 0, hz);
  if (night) { sg.addColorStop(0, '#0b1020'); sg.addColorStop(1, '#2a3048'); }
  else if (dusk) { sg.addColorStop(0, '#5d6f93'); sg.addColorStop(0.6, '#e09a63'); sg.addColorStop(1, '#f3c27f'); }
  else if (o.scene === 'storm') { sg.addColorStop(0, '#3d4446'); sg.addColorStop(1, '#8b8f7a'); }
  else if (o.scene === 'fire') { sg.addColorStop(0, '#7a8a96'); sg.addColorStop(1, '#e4a066'); }
  else { sg.addColorStop(0, pal.sky[0]); sg.addColorStop(1, pal.sky[1]); }
  ctx.fillStyle = sg; ctx.fillRect(0, 0, W, hz + 2);

  if (night) {
    for (let i = 0; i < 90; i++) {
      const x = (Math.sin(i * 91.7) * 0.5 + 0.5) * W, y = (Math.sin(i * 47.3) * 0.5 + 0.5) * hz * 0.9;
      ctx.fillStyle = `rgba(255,250,230,${0.4 + 0.6 * ((i * 37) % 10) / 10})`;
      ctx.fillRect(x, y, i % 7 ? 1 : 2, i % 7 ? 1 : 2);
    }
    ctx.fillStyle = '#f4ecd2'; ctx.beginPath(); ctx.arc(W * 0.82, H * 0.16, H * 0.05, 0, 7); ctx.fill();
  } else if (o.scene !== 'storm') {
    ctx.fillStyle = dusk ? '#ffd28a' : 'rgba(255,248,220,.9)';
    ctx.beginPath(); ctx.arc(dusk ? W * 0.2 : W * 0.8, dusk ? hz * 0.92 : H * 0.14, H * (dusk ? 0.09 : 0.05), 0, 7); ctx.fill();
    // a few clouds
    ctx.fillStyle = dusk ? 'rgba(255,200,160,.5)' : 'rgba(255,255,255,.55)';
    for (let i = 0; i < 4; i++) {
      const cx = ((i * 0.29 + 0.1) * W - t * 0.03 + W * 2) % (W * 1.2) - W * 0.1, cy = H * (0.1 + 0.07 * (i % 3));
      for (let j = 0; j < 4; j++) { ctx.beginPath(); ctx.ellipse(cx + j * H * 0.07, cy + (j % 2) * 3, H * 0.08, H * 0.025, 0, 0, 7); ctx.fill(); }
    }
  } else {
    ctx.fillStyle = 'rgba(40,44,46,.85)';
    for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.ellipse((i / 8) * W, H * 0.12 + (i % 3) * 8, W * 0.12, H * 0.1, 0, 0, 7); ctx.fill(); }
  }

  // far layer
  const seed = { tall: 1, mixed: 2, plains: 3, dry: 4, mountain: 5, nm: 6 }[o.region] || 3;
  ctx.fillStyle = shade(pal.far);
  ctx.beginPath(); ctx.moveTo(0, hz);
  for (let x = 0; x <= W; x += 4) {
    const X = x + t * 0.08;
    let y;
    if (o.region === 'mountain') y = hz - H * (0.22 + 0.16 * noise(X * 0.6, seed)) ;
    else if (o.region === 'nm') { const n = noise(X * 0.5, seed); y = hz - H * (0.06 + (n > 0.25 ? 0.13 : 0.03 + n * 0.05)); }
    else if (o.region === 'tall') y = hz - H * (0.05 + 0.04 * noise(X, seed));
    else y = hz - H * (0.025 + 0.02 * noise(X, seed));
    ctx.lineTo(x, y);
  }
  ctx.lineTo(W, hz); ctx.closePath(); ctx.fill();
  if (o.region === 'mountain' && !night) { // snow on the peaks
    ctx.fillStyle = 'rgba(255,255,255,.55)';
    for (let x = 0; x <= W; x += 4) { const X = x + t * 0.08; const y = hz - H * (0.22 + 0.16 * noise(X * 0.6, seed)); if (y < hz - H * 0.33) ctx.fillRect(x, y, 4, 3); }
  }

  // landmark
  if (o.landmark) landmark(ctx, W, H, hz, o.landmark, shade, o, clock);

  // mid layer: a gentle rise in front of the far land
  ctx.fillStyle = shade(pal.mid);
  ctx.beginPath(); ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 4) ctx.lineTo(x, hz + H * 0.02 - H * 0.025 * noise((x + t * 0.3) * 1.3, seed + 9));
  ctx.lineTo(W, H); ctx.closePath(); ctx.fill();

  if (o.scene === 'mirage' && !night) {
    const mg = ctx.createLinearGradient(0, hz - 6, 0, hz + 8);
    mg.addColorStop(0, 'rgba(140,190,215,0)'); mg.addColorStop(0.5, 'rgba(140,190,215,.85)'); mg.addColorStop(1, 'rgba(140,190,215,0)');
    ctx.fillStyle = mg;
    for (let x = W * 0.45; x < W; x += 3) ctx.fillRect(x, hz - 4 + Math.sin(x * 0.1 + clock * 0.004) * 2, 3, 10);
  }

  // ground
  const gg = ctx.createLinearGradient(0, hz, 0, H);
  gg.addColorStop(0, shade(pal.ground)); gg.addColorStop(1, shade(mix(pal.ground, '#3a2c1c', 0.35)));
  ctx.fillStyle = gg; ctx.fillRect(0, hz + H * 0.02, W, H);
  if (o.scene === 'mud') { ctx.fillStyle = shade('#3b2f22'); ctx.beginPath(); ctx.ellipse(W * 0.4, gy, W * 0.25, H * 0.05, 0, 0, 7); ctx.fill(); }
  // ruts
  ctx.strokeStyle = shade(pal.road); ctx.lineWidth = Math.max(1, H * 0.012);
  for (const dy of [0.015, 0.06]) { ctx.beginPath(); ctx.moveTo(0, gy + H * dy); ctx.lineTo(W, gy + H * dy); ctx.stroke(); }
  // grass tufts
  ctx.strokeStyle = shade(pal.grass); ctx.lineWidth = 1;
  for (let i = 0; i < 70; i++) {
    const depth = (i % 7) / 7;
    const y = hz + H * 0.05 + depth * (H - hz) * 0.9;
    const sp = 0.4 + depth * 1.4;
    const x = ((i * 137.5) % W - t * sp % W + W * 2) % W;
    const hh = H * (0.01 + depth * 0.025);
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - hh * 0.4, y - hh); ctx.moveTo(x, y); ctx.lineTo(x + hh * 0.2, y - hh * 1.1); ctx.moveTo(x, y); ctx.lineTo(x + hh * 0.6, y - hh * 0.8); ctx.stroke();
  }

  // event set-pieces behind the wagon
  if (o.scene === 'herd') herd(ctx, W, H, hz, shade, clock);
  if (o.scene === 'riders') riders(ctx, W, H, hz, shade);
  if (o.scene === 'fire') {
    const fg = ctx.createLinearGradient(0, hz - H * 0.15, 0, hz + 4);
    fg.addColorStop(0, 'rgba(230,110,40,0)'); fg.addColorStop(1, 'rgba(240,120,40,.85)');
    ctx.fillStyle = fg; ctx.fillRect(0, hz - H * 0.15, W, H * 0.16);
    ctx.fillStyle = 'rgba(70,60,55,.35)';
    for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.ellipse(W * (i / 7) + Math.sin(clock * 0.001 + i) * 6, hz - H * 0.25, W * 0.09, H * 0.12, 0, 0, 7); ctx.fill(); }
  }

  // the wagon and team
  const tilt = o.scene === 'broken' ? -0.08 : 0;
  if (o.team && o.team.n > 0 || o.scene === 'broken') wagon(ctx, W * 0.36, gy, H / 150, o, t, clock, tilt, shade);
  if (o.scene === 'night' || o.scene === 'camp') campfire(ctx, W * 0.66, gy + H * 0.04, H / 150, clock);

  if (o.scene === 'storm') {
    ctx.strokeStyle = 'rgba(220,225,230,.45)'; ctx.lineWidth = 1;
    for (let i = 0; i < 120; i++) { const x = ((i * 53.3 + clock * 0.6) % (W + 40)) - 20, y = ((i * 31.7 + clock * 0.9) % H); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 4, y + 10); ctx.stroke(); }
  }
  if (night) { ctx.fillStyle = 'rgba(10,14,30,.15)'; ctx.fillRect(0, 0, W, H); }
}

function landmark(ctx, W, H, hz, kind, shade, o, clock) {
  const x = W * 0.74;
  ctx.save();
  switch (kind) {
    case 'town': case 'village': case 'city': {
      const adobe = kind !== 'town';
      for (let i = 0; i < (kind === 'city' ? 9 : 6); i++) {
        const bx = x - W * 0.2 + i * W * 0.055, bw = W * 0.045, bh = H * (0.06 + ((i * 7) % 4) * 0.015);
        ctx.fillStyle = shade(adobe ? (i % 2 ? '#b98a5e' : '#a87b52') : (i % 2 ? '#8b6f53' : '#9a8063'));
        ctx.fillRect(bx, hz + 4 - bh, bw, bh);
        if (!adobe) { ctx.beginPath(); ctx.moveTo(bx - 2, hz + 4 - bh); ctx.lineTo(bx + bw / 2, hz - 4 - bh - H * 0.03); ctx.lineTo(bx + bw + 2, hz + 4 - bh); ctx.fill(); }
        ctx.fillStyle = 'rgba(40,25,15,.5)'; ctx.fillRect(bx + bw * 0.4, hz + 4 - bh * 0.55, bw * 0.2, bh * 0.4);
      }
      if (kind === 'city' || kind === 'village') { // church towers
        ctx.fillStyle = shade('#c49870');
        const cx = x + W * 0.13;
        ctx.fillRect(cx, hz + 4 - H * 0.14, W * 0.07, H * 0.14);
        ctx.fillRect(cx - W * 0.008, hz + 4 - H * 0.2, W * 0.022, H * 0.2);
        if (kind === 'city') ctx.fillRect(cx + W * 0.056, hz + 4 - H * 0.2, W * 0.022, H * 0.2);
        ctx.fillStyle = '#3a2a1e'; ctx.fillRect(cx + W * 0.03, hz + 4 - H * 0.2 - H * 0.04, 2, H * 0.04); ctx.fillRect(cx + W * 0.022, hz + 4 - H * 0.225, W * 0.018, 2);
      }
      break;
    }
    case 'grove': case 'creek': case 'river': case 'spring': {
      if (kind !== 'spring') { ctx.fillStyle = shade('#7aa0b5'); ctx.fillRect(0, hz + H * 0.03, W, kind === 'river' ? H * 0.05 : H * 0.018); }
      const n = kind === 'grove' ? 16 : kind === 'spring' ? 4 : 9;
      for (let i = 0; i < n; i++) {
        const tx = (kind === 'grove' ? W * 0.45 : x - W * 0.25) + i * W * (kind === 'grove' ? 0.035 : 0.05), r = H * (0.05 + ((i * 5) % 3) * 0.018);
        ctx.fillStyle = shade('#4a3a28'); ctx.fillRect(tx - 1.5, hz + 2 - r, 3, r);
        ctx.fillStyle = shade(i % 2 ? '#4f6d3a' : '#5d7c40');
        ctx.beginPath(); ctx.ellipse(tx, hz - r, r * 0.8, r * 0.75, 0, 0, 7); ctx.fill();
      }
      if (kind === 'spring') { ctx.fillStyle = shade('#6f9fb8'); ctx.beginPath(); ctx.ellipse(x, hz + H * 0.06, W * 0.08, H * 0.022, 0, 0, 7); ctx.fill(); }
      break;
    }
    case 'rock': {
      ctx.fillStyle = shade('#9b6a4a');
      ctx.beginPath(); ctx.moveTo(x - W * 0.16, hz + 4); ctx.lineTo(x - W * 0.12, hz - H * 0.12); ctx.lineTo(x + W * 0.02, hz - H * 0.15); ctx.lineTo(x + W * 0.1, hz - H * 0.11); ctx.lineTo(x + W * 0.15, hz + 4); ctx.fill();
      ctx.strokeStyle = 'rgba(60,35,20,.35)'; ctx.lineWidth = 1;
      for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(x - W * 0.12 + i * 6, hz - H * (0.1 - i * 0.02)); ctx.lineTo(x + W * 0.1, hz - H * (0.09 - i * 0.02)); ctx.stroke(); }
      break;
    }
    case 'ears': {
      ctx.fillStyle = shade('#7b7088');
      for (const dx of [-0.06, 0.05]) { ctx.beginPath(); ctx.ellipse(x + W * dx, hz + 2, W * 0.065, H * (dx < 0 ? 0.2 : 0.16), 0, Math.PI, 0); ctx.fill(); }
      break;
    }
    case 'mound': {
      ctx.fillStyle = shade('#8c6a52');
      ctx.beginPath(); ctx.moveTo(x - W * 0.2, hz + 3); ctx.lineTo(x - W * 0.15, hz - H * 0.08); ctx.lineTo(x - W * 0.1, hz - H * 0.09);
      ctx.quadraticCurveTo(x - W * 0.02, hz - H * 0.21, x + W * 0.07, hz - H * 0.13); ctx.lineTo(x + W * 0.1, hz - H * 0.13); ctx.lineTo(x + W * 0.16, hz + 3); ctx.fill();
      break;
    }
    case 'fort': {
      const fx = x - W * 0.12, fw = W * 0.26, fh = H * 0.11;
      ctx.fillStyle = shade('#b38a5f'); ctx.fillRect(fx, hz + 4 - fh, fw, fh);
      ctx.fillStyle = shade('#a67d53');
      for (const tx of [fx - W * 0.012, fx + fw - W * 0.03]) { ctx.fillRect(tx, hz + 4 - fh * 1.35, W * 0.042, fh * 1.35); }
      ctx.fillStyle = 'rgba(40,25,15,.6)'; ctx.fillRect(fx + fw * 0.45, hz + 4 - fh * 0.55, fw * 0.1, fh * 0.55);
      ctx.fillStyle = '#3a2a1e'; ctx.fillRect(fx + fw * 0.5, hz + 4 - fh * 1.9, 1.5, fh * 0.9);
      ctx.fillStyle = shade('#b0302a'); ctx.fillRect(fx + fw * 0.5 + 1.5, hz + 4 - fh * 1.9, W * 0.025, H * 0.022);
      break;
    }
    case 'mountain': case 'pass': {
      for (let i = 0; i < 14; i++) {
        const px = (kind === 'pass' ? (i < 7 ? W * 0.02 + i * W * 0.04 : W * 0.6 + (i - 7) * W * 0.055) : W * 0.5 + i * W * 0.04), ph = H * (0.07 + ((i * 3) % 4) * 0.02);
        ctx.fillStyle = shade(i % 2 ? '#2f4a33' : '#3a5638');
        ctx.beginPath(); ctx.moveTo(px, hz - ph - H * 0.02); ctx.lineTo(px - ph * 0.3, hz + 4); ctx.lineTo(px + ph * 0.3, hz + 4); ctx.fill();
      }
      break;
    }
    case 'ruin': {
      ctx.fillStyle = shade('#a27c5a');
      ctx.fillRect(x - W * 0.05, hz + 4 - H * 0.13, W * 0.1, H * 0.13);
      ctx.fillRect(x - W * 0.06, hz + 4 - H * 0.18, W * 0.025, H * 0.18);
      ctx.fillStyle = shade(mix('#a27c5a', '#000000', 0.2));
      ctx.fillRect(x - W * 0.22, hz + 4 - H * 0.04, W * 0.15, H * 0.04); ctx.fillRect(x - W * 0.2, hz + 4 - H * 0.06, W * 0.05, H * 0.02);
      ctx.fillStyle = 'rgba(30,20,10,.6)'; ctx.fillRect(x - W * 0.01, hz + 4 - H * 0.07, W * 0.02, H * 0.07);
      break;
    }
  }
  ctx.restore();
}

function animalShape(ctx, x, y, s, kind, phase, color) {
  ctx.fillStyle = color; ctx.strokeStyle = color; ctx.lineWidth = 2.2 * s; ctx.lineCap = 'round';
  const ox = kind === 'oxen';
  const bw = (ox ? 15 : 12) * s, bh = (ox ? 6.5 : 5) * s, legH = (ox ? 8 : 10) * s;
  const by = y - legH - bh;
  // legs
  for (let i = 0; i < 4; i++) {
    const lx = x + (i < 2 ? -bw * 0.7 : bw * 0.6) + (i % 2) * 2 * s;
    const sw = Math.sin(phase + i * Math.PI / 2) * 2.5 * s;
    ctx.beginPath(); ctx.moveTo(lx, by + bh * 0.6); ctx.lineTo(lx + sw, y); ctx.stroke();
  }
  ctx.beginPath(); ctx.ellipse(x, by, bw, bh, 0, 0, 7); ctx.fill();
  if (ox) { ctx.beginPath(); ctx.ellipse(x + bw * 0.55, by - bh * 0.5, bw * 0.35, bh * 0.6, 0, 0, 7); ctx.fill(); }
  // neck and head
  const hx = x + bw + (ox ? 3 : 4) * s, hy = by - (ox ? 1 : 6) * s;
  ctx.beginPath(); ctx.moveTo(x + bw * 0.7, by - bh * 0.3); ctx.lineTo(hx, hy); ctx.lineWidth = (ox ? 5 : 4) * s; ctx.stroke();
  ctx.beginPath(); ctx.ellipse(hx + 2 * s, hy + 2 * s, (ox ? 4 : 3.5) * s, (ox ? 3.2 : 2.4) * s, 0.5, 0, 7); ctx.fill();
  ctx.lineWidth = 1.4 * s;
  if (ox) { ctx.beginPath(); ctx.moveTo(hx - 1 * s, hy - 1 * s); ctx.quadraticCurveTo(hx - 3 * s, hy - 6 * s, hx + 1 * s, hy - 7 * s); ctx.stroke(); }
  else { ctx.beginPath(); ctx.moveTo(hx, hy - 1 * s); ctx.lineTo(hx - 1.5 * s, hy - 7 * s); ctx.moveTo(hx + 1 * s, hy - 1 * s); ctx.lineTo(hx + 1.5 * s, hy - 7 * s); ctx.stroke(); }
  // tail
  ctx.beginPath(); ctx.moveTo(x - bw, by); ctx.lineTo(x - bw - 2 * s, by + bh * 1.2); ctx.stroke();
}

function wagon(ctx, x, gy, s, o, t, clock, tilt, shade) {
  const moving = o.moving;
  const phase = moving ? clock * 0.012 : 0;
  ctx.save();
  ctx.translate(x, gy); ctx.rotate(tilt); ctx.translate(-x, -gy);
  // team ahead (to the right)
  const team = o.team || { n: 0, kind: 'mules' };
  const pairs = Math.min(3, team.kind === 'oxen' ? team.n : Math.ceil(team.n / 2));
  const ox = team.kind === 'oxen';
  const step = (ox ? 36 : 32) * s;
  const dark = shade(ox ? '#5a3b22' : '#4b3a2c'), darker = shade(ox ? '#3e2816' : '#33271d');
  if (o.scene !== 'broken') {
    ctx.strokeStyle = shade('#3a2a1e'); ctx.lineWidth = 2 * s;
    ctx.beginPath(); ctx.moveTo(x + 40 * s, gy - 12 * s); ctx.lineTo(x + 40 * s + pairs * step, gy - 14 * s); ctx.stroke();
    for (let p = 0; p < pairs; p++) {
      const ax = x + 62 * s + p * step;
      animalShape(ctx, ax - 3 * s, gy - 2 * s, s * 0.95, team.kind, phase + p + 1.5, darker);
      animalShape(ctx, ax, gy, s, team.kind, phase + p, dark);
    }
  }
  // the wagon: running gear, bed and sheet
  const wy = gy;
  const wheel = (cx, r, a) => {
    ctx.strokeStyle = shade('#2c2017'); ctx.lineWidth = 2.6 * s;
    ctx.beginPath(); ctx.arc(cx, wy - r, r, 0, 7); ctx.stroke();
    ctx.lineWidth = 1.2 * s;
    for (let i = 0; i < 6; i++) { const aa = a + i * Math.PI / 6; ctx.beginPath(); ctx.moveTo(cx - Math.cos(aa) * r, wy - r - Math.sin(aa) * r); ctx.lineTo(cx + Math.cos(aa) * r, wy - r + Math.sin(aa) * r); ctx.stroke(); }
    ctx.fillStyle = shade('#2c2017'); ctx.beginPath(); ctx.arc(cx, wy - r, 2.2 * s, 0, 7); ctx.fill();
  };
  const bedY = wy - 24 * s;
  ctx.fillStyle = shade('#5c7a8c'); // painted bed
  ctx.beginPath(); ctx.moveTo(x - 46 * s, bedY - 12 * s); ctx.lineTo(x + 38 * s, bedY - 12 * s); ctx.lineTo(x + 34 * s, bedY + 2 * s); ctx.lineTo(x - 42 * s, bedY + 2 * s); ctx.fill();
  ctx.fillStyle = shade('#a33a24'); ctx.fillRect(x - 44 * s, bedY - 1 * s, 80 * s, 3 * s);
  // sheet over bows
  const sg = ctx.createLinearGradient(0, bedY - 44 * s, 0, bedY - 12 * s);
  sg.addColorStop(0, shade('#fbf4e2')); sg.addColorStop(1, shade('#d9ccb0'));
  ctx.fillStyle = sg;
  ctx.beginPath(); ctx.moveTo(x - 52 * s, bedY - 26 * s);
  ctx.quadraticCurveTo(x - 46 * s, bedY - 46 * s, x - 20 * s, bedY - 42 * s);
  ctx.lineTo(x + 18 * s, bedY - 42 * s);
  ctx.quadraticCurveTo(x + 42 * s, bedY - 46 * s, x + 46 * s, bedY - 26 * s);
  ctx.lineTo(x + 38 * s, bedY - 12 * s); ctx.lineTo(x - 46 * s, bedY - 12 * s); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = shade('rgba(120,100,70,.5)'); ctx.lineWidth = 1 * s;
  for (const bx of [-28, -8, 12]) { ctx.beginPath(); ctx.moveTo(x + bx * s, bedY - 42 * s); ctx.lineTo(x + bx * s, bedY - 12 * s); ctx.stroke(); }
  wheel(x - 28 * s, 13 * s, -phase * 0.6);
  wheel(x + 22 * s, 10.5 * s, -phase * 0.75);
  // driver walking beside
  const dx = x + 48 * s, bob = moving ? Math.abs(Math.sin(phase)) * 1.5 * s : 0;
  ctx.fillStyle = shade('#2b2118'); ctx.strokeStyle = shade('#2b2118'); ctx.lineWidth = 2.4 * s;
  ctx.beginPath(); ctx.moveTo(dx, wy - 14 * s - bob); ctx.lineTo(dx + Math.sin(phase) * 3 * s, wy); ctx.moveTo(dx, wy - 14 * s - bob); ctx.lineTo(dx - Math.sin(phase) * 3 * s, wy); ctx.stroke();
  ctx.fillRect(dx - 3 * s, wy - 27 * s - bob, 6 * s, 14 * s);
  ctx.beginPath(); ctx.arc(dx, wy - 30 * s - bob, 3 * s, 0, 7); ctx.fill();
  ctx.fillRect(dx - 5 * s, wy - 33 * s - bob, 10 * s, 1.6 * s); ctx.fillRect(dx - 3 * s, wy - 36 * s - bob, 6 * s, 3 * s);
  ctx.lineWidth = 1 * s; ctx.beginPath(); ctx.moveTo(dx + 2 * s, wy - 22 * s - bob); ctx.quadraticCurveTo(dx + 14 * s, wy - 44 * s, dx + 26 * s, wy - 34 * s); ctx.stroke();
  ctx.restore();
}

function campfire(ctx, x, y, s, clock) {
  const g = ctx.createRadialGradient(x, y - 6 * s, 2, x, y - 6 * s, 60 * s);
  g.addColorStop(0, 'rgba(255,170,80,.55)'); g.addColorStop(1, 'rgba(255,140,60,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y - 6 * s, 60 * s, 0, 7); ctx.fill();
  for (let i = 0; i < 3; i++) {
    const f = Math.sin(clock * 0.02 + i * 2) * 2 * s;
    ctx.fillStyle = ['#ffcf6a', '#ff9a3a', '#e8562a'][i];
    ctx.beginPath(); ctx.moveTo(x - (7 - i * 2) * s, y); ctx.quadraticCurveTo(x + f, y - (22 - i * 5) * s, x + (7 - i * 2) * s, y); ctx.fill();
  }
}

function herd(ctx, W, H, hz, shade, clock) {
  ctx.fillStyle = shade('#3b2a1c');
  for (let i = 0; i < 40; i++) {
    const depth = (i % 5) / 5;
    const x = ((i * 97.3) % W + clock * 0.004 * (1 + depth)) % W, y = hz + H * (0.03 + depth * 0.08), s = (0.5 + depth * 0.7) * H / 160;
    ctx.beginPath(); ctx.ellipse(x, y - 7 * s, 9 * s, 5 * s, 0, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x + 7 * s, y - 9 * s, 5 * s, 6 * s, 0, 0, 7); ctx.fill();
    ctx.fillRect(x - 7 * s, y - 4 * s, 2 * s, 4 * s); ctx.fillRect(x + 5 * s, y - 4 * s, 2 * s, 4 * s);
  }
}
function riders(ctx, W, H, hz, shade) {
  ctx.fillStyle = shade('#2e231a'); ctx.strokeStyle = shade('#2e231a');
  for (let i = 0; i < 9; i++) {
    const x = W * 0.5 + i * W * 0.05, y = hz - H * 0.005 - (i % 2) * 3, s = H / 200;
    ctx.beginPath(); ctx.ellipse(x, y - 9 * s, 8 * s, 4 * s, 0, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x + 8 * s, y - 13 * s, 3 * s, 2.5 * s, -0.6, 0, 7); ctx.fill();
    ctx.lineWidth = 1.6 * s; for (const lx of [-5, -3, 4, 6]) { ctx.beginPath(); ctx.moveTo(x + lx * s, y - 7 * s); ctx.lineTo(x + lx * s, y); ctx.stroke(); }
    ctx.fillRect(x - 1.5 * s, y - 20 * s, 3 * s, 9 * s); ctx.beginPath(); ctx.arc(x, y - 22 * s, 2 * s, 0, 7); ctx.fill();
    if (i % 3 === 0) { ctx.lineWidth = 1 * s; ctx.beginPath(); ctx.moveTo(x + 3 * s, y - 30 * s); ctx.lineTo(x + 1 * s, y - 8 * s); ctx.stroke(); }
  }
}

// ---------- public ----------
function size(cv) {
  const r = cv.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = Math.max(1, Math.round(r.width * dpr)), h = Math.max(1, Math.round(r.height * dpr));
  if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
  return [w, h];
}
function paint(cv, o) {
  const [w, h] = size(cv);
  draw(cv.getContext('2d'), w, h, o, o.t || 0, 0);
}
function live(cv) {
  let o = {}, t = 0, rollUntil = 0, last = performance.now(), raf = 0;
  function frame(now) {
    const dt = Math.min(50, now - last); last = now;
    const moving = now < rollUntil;
    if (moving) t += dt * 0.12 * (cv.width / 600);
    const [w, h] = size(cv);
    draw(cv.getContext('2d'), w, h, { ...o, moving }, t, now);
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);
  return {
    set(next) { o = next; },
    roll(ms) { rollUntil = performance.now() + ms; },
    stop() { cancelAnimationFrame(raf); },
  };
}
root.WBScene = { paint, live };
})(window);
