// Whistlebrook: wires the world, the view, the sounds and the page together.
import * as THREE from 'three';
import { Art } from './art.js';
import { View } from './view.js';
import { World, starterTown } from './world.js';
import { Sound } from './audio.js';
import { BUILDINGS, ALL_MODELS, MILESTONES, TRAIN_COST, TRACK_COST, TRAIN_COLORS, SAY, START_COINS } from './data.js';
import { countEdges } from './track.js';

const SAVE_KEY = 'whistlebrook-v1';
const $ = s => document.querySelector(s);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const TOOLS = [
  { id: 'hand', name: 'Hand', key: 'H', tip: 'Click townsfolk, trains and buildings to say hello. Click a junction to throw its switch. Drag to look around.' },
  { id: 'track', name: 'Track', key: 'T', model: 'track-curve', cost: TRACK_COST, tip: 'Drag across tiles to lay track. Corners curve on their own; a third branch makes a junction with a switch.' },
  { id: 'train', name: 'Train', key: 'N', model: 'loco-red', cost: TRAIN_COST, tip: 'Click a piece of track with room behind it for two coaches.' },
  ...Object.entries(BUILDINGS).map(([id, b]) => ({ id: 'b:' + id, name: b.name, model: b.model, cost: b.cost, tip: b.tip + (id === 'station' ? '' : ' R turns it.') })),
  { id: 'bulldoze', name: 'Bulldoze', key: 'X', tip: 'Click or drag to clear track and buildings. You get half the cost back.' },
];
const DRAG_BUILD = new Set(['b:tree', 'b:pine', 'b:lamp']);

let world, view, art, sound;
let tool = 'hand', rot = 0, speed = 1;
let panelFor = null; // { kind, id } shown in the side panel

// ------------------------------------------------------------------ start up
async function boot() {
  art = new Art();
  await art.load(ALL_MODELS, 'assets/', f => { $('#loadbar').style.width = Math.round(f * 100) + '%'; });
  world = loadSave() || starterTown(Date.now() % 100000);
  view = new View($('#scene'), art, world);
  sound = new Sound();
  try { const s = JSON.parse(localStorage.getItem(SAVE_KEY + '-prefs') || '{}'); sound.on = s.sound !== false; sound.music = s.music !== false; } catch {}
  buildToolbar();
  bindInput();
  updateSoundButton();
  $('#loading').classList.add('gone');
  setTimeout(() => $('#loading').remove(), 600);
  if (!localStorage.getItem(SAVE_KEY + '-seen')) showHelp(true);
  setTool('hand');
  // For tests and the curious: window.whistlebrook.world, .view
  window.whistlebrook = { get world() { return world; }, get view() { return view; }, setTool, setSpeed };
  let last = performance.now(), saveT = 0, hudT = 0;
  const frame = now => {
    const real = Math.max(0, Math.min(0.1, (now - last) / 1000)); last = Math.max(last, now);
    const dt = real * speed;
    if (dt > 0) {
      // Small steps keep fast speeds smooth for the trains.
      const steps = Math.ceil(dt / 0.05);
      for (let i = 0; i < steps; i++) world.update(dt / steps);
    }
    handleEvents();
    view.sync(dt);
    pan(real);
    view.render(real);
    chuffs(dt);
    sound.tick(world.night);
    drawBubbles(real);
    if ((hudT -= real) <= 0) { hudT = 0.25; updateHud(); if (panelFor) refreshPanel(); }
    if ((saveT += real) > 15) { saveT = 0; save(); }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
  window.addEventListener('beforeunload', save);
  window.addEventListener('resize', () => view.resize());
}

// ------------------------------------------------------------------ saving
function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(world.serialize())); } catch {} }
function loadSave() {
  try { const d = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); return d && d.v === 1 ? World.load(d) : null; } catch { return null; }
}
function newTown(kind) {
  if (kind === 'starter') world = starterTown(Date.now() % 100000);
  else world = new World({ seed: Date.now() % 100000, coins: kind === 'sandbox' ? 0 : START_COINS + 200, sandbox: kind === 'sandbox' });
  view.setWorld(world);
  closePanel();
  save();
  toast(kind === 'sandbox' ? 'A fresh baseboard, and coins don\'t matter.' : kind === 'empty' ? 'A fresh baseboard. Lay some track!' : 'Welcome to Whistlebrook!');
}

// ------------------------------------------------------------------ toolbar
function thumbnails(names) {
  const size = 112;
  const r = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  r.setSize(size, size); r.setPixelRatio(1);
  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight('#ffffff', '#6a7a5a', 2.0));
  const sun = new THREE.DirectionalLight('#ffffff', 1.6); sun.position.set(3, 5, 4); scene.add(sun);
  const cam = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
  const out = {};
  for (const n of names) {
    const f = art.make(n);
    if (n.startsWith('loco')) f.mesh.rotation.y = -0.6;
    scene.add(f.mesh);
    const box = new THREE.Box3().setFromObject(f.mesh), c = box.getCenter(new THREE.Vector3()), s = box.getSize(new THREE.Vector3()).length();
    cam.position.set(c.x + s * 1.3, c.y + s * 1.1, c.z + s * 1.7); cam.lookAt(c);
    r.render(scene, cam);
    out[n] = r.domElement.toDataURL();
    scene.remove(f.mesh);
  }
  r.dispose();
  return out;
}
const ICONS = {
  hand: '<svg viewBox="0 0 24 24"><path d="M8 11V5.5a1.5 1.5 0 0 1 3 0V10m0-.5V4a1.5 1.5 0 0 1 3 0v6m0-4.5a1.5 1.5 0 0 1 3 0V12m0-3.5a1.5 1.5 0 0 1 3 0V15c0 4-3 7-7 7h-1c-3 0-4.5-1.5-6-4l-2.5-4.3a1.5 1.5 0 0 1 2.6-1.5L8 14" fill="#fff3d6" stroke="#5a3a1a" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/></svg>',
  bulldoze: '<svg viewBox="0 0 24 24"><rect x="3" y="14" width="13" height="5" rx="2.5" fill="#3b3b44"/><rect x="5" y="8" width="8" height="6" rx="1" fill="#f2c43a" stroke="#8a6a10"/><rect x="9" y="5" width="4" height="4" fill="#9fd3ef" stroke="#8a6a10"/><path d="M16 10h3l2 8h-5z" fill="#c3c7cc" stroke="#5b6068"/><circle cx="6" cy="16.5" r="1.4" fill="#888"/><circle cx="13" cy="16.5" r="1.4" fill="#888"/></svg>',
};
function buildToolbar() {
  const nav = $('#tools');
  nav.innerHTML = '';
  const thumbs = thumbnails(TOOLS.filter(t => t.model).map(t => t.model));
  TOOLS.forEach((t, i) => {
    const b = el('button', 'tool', `${t.model ? `<img src="${thumbs[t.model]}" alt="">` : ICONS[t.id]}<span class="name">${t.name}</span>${t.cost ? `<span class="cost"><i class="coin"></i>${t.cost}</span>` : ''}`);
    b.dataset.tool = t.id;
    b.title = `${t.name}${t.key ? ` (${t.key})` : ''}`;
    b.onclick = () => { sound.start(); sound.click(); setTool(t.id); };
    nav.append(b);
    if (t.id === 'train' || t.id === 'b:station' || t.id === 'b:windmill') nav.append(el('span', 'sep'));
  });
}
function setTool(id) {
  tool = id;
  document.querySelectorAll('.tool').forEach(b => b.classList.toggle('on', b.dataset.tool === id));
  const t = TOOLS.find(o => o.id === id);
  $('#hint').innerHTML = `<b>${t.name}</b> ${esc(t.tip)}`;
  $('#scene').dataset.tool = id.split(':')[0];
}

// ------------------------------------------------------------------ input
const keys = new Set();
let drag = null;
function bindInput() {
  const cv = $('#scene');
  cv.addEventListener('contextmenu', e => e.preventDefault());
  const pointers = new Map();
  cv.addEventListener('pointerdown', e => {
    sound.start();
    cv.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) { drag = { kind: 'pinch', pts: new Map(pointers), dist: pinchDist(pointers), mid: pinchMid(pointers), anchor: view.groundPoint(...pinchMid(pointers)) }; return; }
    const tile = view.tileAt(e.clientX, e.clientY);
    if (e.button === 2 || e.button === 1) { drag = { kind: 'pan', anchor: view.groundPoint(e.clientX, e.clientY) }; return; }
    drag = { kind: 'tool', x: e.clientX, y: e.clientY, moved: false, last: tile, anchor: view.groundPoint(e.clientX, e.clientY) };
    if (tool === 'hand') return;
    act(tile, true);
  });
  cv.addEventListener('pointermove', e => {
    if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const tile = view.tileAt(e.clientX, e.clientY);
    hover(tile);
    if (!drag) return;
    if (drag.kind === 'pinch' && pointers.size === 2) {
      const d = pinchDist(pointers);
      view.cam.dist = clamp(view.cam.dist * drag.dist / d, 8, 48); drag.dist = d;
      panTo(drag.anchor, ...pinchMid(pointers));
      return;
    }
    if (drag.kind === 'pan') { panTo(drag.anchor, e.clientX, e.clientY); return; }
    if (Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 6) drag.moved = true;
    if (tool === 'hand') { if (drag.moved) panTo(drag.anchor, e.clientX, e.clientY); return; }
    if (!tile || (drag.last && tile[0] === drag.last[0] && tile[1] === drag.last[1])) return;
    if (tool === 'track' && drag.last) layTrack(drag.last, tile);
    else if (tool === 'bulldoze' || DRAG_BUILD.has(tool)) act(tile, false);
    drag.last = tile;
  });
  const up = e => {
    pointers.delete(e.pointerId);
    if (drag && drag.kind === 'tool' && tool === 'hand' && !drag.moved) poke(e.clientX, e.clientY);
    if (pointers.size === 0) drag = null;
  };
  cv.addEventListener('pointerup', up);
  cv.addEventListener('pointercancel', up);
  cv.addEventListener('pointerleave', () => hover(null));
  cv.addEventListener('wheel', e => { e.preventDefault(); view.cam.dist = clamp(view.cam.dist * Math.pow(1.0015, e.deltaY), 8, 48); }, { passive: false });

  window.addEventListener('keydown', e => {
    if (e.target.closest('input, textarea')) return;
    const k = e.key.toLowerCase();
    keys.add(k);
    if (k === 'r') { rot = (rot + 1) & 3; hover(lastHover); }
    if (k === 'q') view.cam.yawTo -= Math.PI / 2;
    if (k === 'e') view.cam.yawTo += Math.PI / 2;
    if (k === ' ') { e.preventDefault(); setSpeed(speed ? 0 : 1); }
    if (k === 'escape') { setTool('hand'); closePanel(); closeModal(); }
    const t = TOOLS.find(o => o.key && o.key.toLowerCase() === k);
    if (t) setTool(t.id);
    if (/^[1-9]$/.test(k)) { const b = TOOLS.filter(o => o.id.startsWith('b:'))[+k - 1]; if (b) setTool(b.id); }
  });
  window.addEventListener('keyup', e => keys.delete(e.key.toLowerCase()));
  window.addEventListener('blur', () => keys.clear());

  $('#speed').onclick = () => setSpeed(speed === 0 ? 1 : speed === 1 ? 3 : 0);
  $('#sound').onclick = () => {
    sound.start();
    if (sound.on && sound.music) sound.music = false; else if (sound.on) sound.on = false; else { sound.on = true; sound.music = true; }
    updateSoundButton();
  };
  $('#book').onclick = () => (panelFor && panelFor.kind === 'book' ? closePanel() : openPanel({ kind: 'book' }));
  $('#menu').onclick = () => showMenu();
}
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const pinchDist = p => { const [a, b] = [...p.values()]; return Math.hypot(a.x - b.x, a.y - b.y) || 1; };
const pinchMid = p => { const [a, b] = [...p.values()]; return [(a.x + b.x) / 2, (a.y + b.y) / 2]; };
function panTo(anchor, cx, cy) {
  if (!anchor) return;
  const p = view.groundPoint(cx, cy);
  if (!p) return;
  view.cam.x = clamp(view.cam.x + anchor.x - p.x, 0, world.size);
  view.cam.z = clamp(view.cam.z + anchor.z - p.z, 0, world.size);
}
function pan(dt) {
  const c = view.cam, s = dt * c.dist * 0.9;
  let fx = 0, fz = 0;
  if (keys.has('w') || keys.has('arrowup')) fz -= 1;
  if (keys.has('s') || keys.has('arrowdown')) fz += 1;
  if (keys.has('a') || keys.has('arrowleft')) fx -= 1;
  if (keys.has('d') || keys.has('arrowright')) fx += 1;
  if (!fx && !fz) return;
  const cs = Math.cos(c.yaw), sn = Math.sin(c.yaw);
  c.x = clamp(c.x + (fx * cs + fz * sn) * s, 0, world.size);
  c.z = clamp(c.z + (-fx * sn + fz * cs) * s, 0, world.size);
}
function setSpeed(s) {
  speed = s;
  $('#speed').textContent = s === 0 ? 'Paused' : s + 'x';
  $('#speed').classList.toggle('paused', s === 0);
}
function updateSoundButton() {
  $('#sound').textContent = !sound.on ? 'Sound off' : sound.music ? 'Sound + music' : 'Sound, no music';
  try { localStorage.setItem(SAVE_KEY + '-prefs', JSON.stringify({ sound: sound.on, music: sound.music })); } catch {}
}

let lastHover = null;
function hover(tile) {
  lastHover = tile;
  if (!tile || tool === 'hand') { view.setCursor(tool === 'hand' && tile && world.isJunction(...tile) ? tile : null, true); return; }
  if (tool.startsWith('b:')) {
    const type = tool.slice(2);
    let r = rot;
    if (type === 'station') { const s = world.stopTilesAt(...tile)[0]; r = s ? [2, 1, 0, 3][s.e] : 0; }
    view.setCursor(tile, world.canPlace(type, ...tile), BUILDINGS[type].model, r);
  } else if (tool === 'track') view.setCursor(tile, world.canTrack(...tile));
  else if (tool === 'train') view.setCursor(tile, countEdges(world.track[world.i(...tile)]) >= 2);
  else view.setCursor(tile, !!(world.buildingAt(...tile) || world.track[world.i(...tile)]));
}
function layTrack(a, b) {
  let [x, z] = a;
  let laid = 0;
  while (x !== b[0] || z !== b[1]) {
    const nx = x + Math.sign(b[0] - x) * (Math.abs(b[0] - x) >= Math.abs(b[1] - z) ? 1 : 0);
    const nz = nx === x ? z + Math.sign(b[1] - z) : z;
    if (world.connect(x, z, nx, nz)) laid++;
    x = nx; z = nz;
  }
  if (laid) sound.snap();
}
function act(tile, first) {
  if (!tile) return;
  if (tool === 'track') return; // drawn on drag
  if (tool === 'bulldoze') { world.remove(...tile); return; }
  if (tool === 'train') {
    if (!first) return;
    world.addTrain(...tile, TRAIN_COLORS[world.trains.length % 3]);
    return;
  }
  if (tool.startsWith('b:')) {
    if (!first && !DRAG_BUILD.has(tool)) return;
    const type = tool.slice(2);
    if (!world.canPlace(type, ...tile)) {
      if (first && type === 'station' && !world.buildingAt(...tile) && !world.track[world.i(...tile)]) toast('Stations go right next to the track.', 'warn');
      else if (first) sound.nope();
      return;
    }
    world.place(type, ...tile, rot);
  }
}
function poke(cx, cy) {
  const hit = view.pick(cx, cy);
  if (hit && hit.kind === 'person') {
    const p = world.people.find(o => o.id === hit.id);
    if (!p) return;
    world.say(p, world.night > 0.6 ? world.pick(SAY.night) : world.pick(SAY.hello), 3);
    view.pmap.get(p.id)?.play('Wave');
    sound.chirp();
    openPanel({ kind: 'person', id: p.id });
    return;
  }
  if (hit && hit.kind === 'train') {
    view.tmap.get(hit.id)?.[0].play('Whistle');
    sound.whistle();
    openPanel({ kind: 'train', id: hit.id });
    return;
  }
  const tile = view.tileAt(cx, cy);
  if (tile && world.isJunction(...tile) && (!hit || hit.kind !== 'building')) {
    world.toggleSwitch(...tile);
    return;
  }
  if (hit && hit.kind === 'building') {
    const b = world.buildings.get(hit.id);
    const f = view.bmap.get(hit.id);
    const def = BUILDINGS[b.type];
    if (f && def.poke && f.play(def.poke)) {
      ({ house: () => sound.boing(), cottage: () => sound.boing(), station: () => sound.bell(), windmill: () => sound.creak(), watertower: () => sound.splash(), tree: () => sound.chirp(), pine: () => sound.chirp() }[b.type] || (() => sound.pop()))();
    } else sound.click();
    openPanel({ kind: 'building', id: b.id });
  }
}

// ------------------------------------------------------------------ what happened this frame
let lastSnap = 0, lastBell = 0;
function handleEvents() {
  const now = performance.now();
  for (const ev of world.events) {
    switch (ev.type) {
      case 'place': sound.pop(); break;
      case 'remove': sound.crunch(); break;
      case 'switch': sound.click(); sound.creak(); break;
      case 'train': sound.whistle(); break;
      case 'arrive': if (now - lastBell > 1200) { lastBell = now; sound.bell(); } break;
      case 'depart': if (Math.random() < 0.4) sound.whistle(); break;
      case 'derail': sound.crunch(); toast('A train came off the track.', 'warn'); break;
      case 'fare': sound.coin(); coinPop(ev.x, ev.z, ev.fare); break;
      case 'say': showSay('p' + ev.person, ev.text); break;
      case 'noRoute': {
        const b = world.buildings.get(ev.building);
        if (b) houseBubble(b, ev.text);
        break;
      }
      case 'milestone': sound.fanfare(); toast(`<b>${esc(ev.title)}</b> done! +${ev.reward} coins`, 'gold'); break;
      case 'broke': if (now - lastSnap > 600) { lastSnap = now; sound.nope(); toast(`Not enough coins (needs ${ev.need}). Carry passengers to earn more.`, 'warn'); } break;
      case 'nope': sound.nope(); toast(ev.why, 'warn'); break;
      case 'dusk': toast('The lamps come on in Whistlebrook.'); break;
      case 'dawn': toast(`Good morning! Day ${world.day}.`); break;
    }
  }
  world.events.length = 0;
}
// One chuff per wheel turn for the two trains nearest the middle of the view.
function chuffs(dt) {
  const c = view.cam;
  const near = world.trains.filter(t => t.speed > 0.1).map(t => { const p = world.headPos(t); return { t, d: Math.hypot(p.x - c.x, p.z - c.z) }; }).sort((a, b) => a.d - b.d).slice(0, 2);
  for (const { t, d } of near) {
    t.phase = (t.phase || 0) + dt * t.speed * 2.4;
    if (t.phase > 1) { t.phase -= 1; sound.chuff(0.12 * clamp(1.4 - d / 14, 0.1, 1) * (20 / c.dist)); }
  }
}

// ------------------------------------------------------------------ speech, coins, toasts
const bubbles = new Map(); // key -> { el, x, y, z, t, follow }
function showSay(key, text) {
  let b = bubbles.get(key);
  if (!b) { b = { el: el('div', 'bubble') }; $('#bubbles').append(b.el); bubbles.set(key, b); }
  b.el.textContent = text; b.t = 3; b.follow = key;
}
function houseBubble(bld, text) {
  const key = 'b' + bld.id;
  let b = bubbles.get(key);
  if (!b) { b = { el: el('div', 'bubble think') }; $('#bubbles').append(b.el); bubbles.set(key, b); }
  b.el.textContent = text; b.t = 3.5; b.pos = [bld.x + 0.5, 1.5, bld.z + 0.5];
}
function drawBubbles(dt) {
  for (const [key, b] of bubbles) {
    b.t -= dt;
    let pos = b.pos;
    if (key[0] === 'p') {
      const p = world.people.find(o => o.id === +key.slice(1));
      pos = p && (p.state === 'walk' || p.state === 'wait') ? [p.x, 0.75, p.z] : null;
    }
    if (b.t <= 0 || !pos) { b.el.remove(); bubbles.delete(key); continue; }
    const s = view.screenOf(...pos);
    b.el.style.transform = `translate(${s.x}px, ${s.y}px) translate(-50%, -100%)`;
    b.el.style.opacity = s.behind ? 0 : Math.min(1, b.t * 3);
  }
}
function coinPop(x, z, n) {
  const s = view.screenOf(x, 1, z);
  const e = el('div', 'coinpop', `+${n}`);
  e.style.left = s.x + 'px'; e.style.top = s.y + 'px';
  document.body.append(e);
  setTimeout(() => e.remove(), 1400);
}
function toast(html, kind = '') {
  const e = el('div', 'toast ' + kind, html);
  $('#toasts').append(e);
  while ($('#toasts').children.length > 4) $('#toasts').firstChild.remove();
  setTimeout(() => e.classList.add('out'), 3800);
  setTimeout(() => e.remove(), 4400);
}

// ------------------------------------------------------------------ HUD and panels
function updateHud() {
  $('#coins').textContent = world.sandbox ? '∞' : world.coins;
  $('#pop').textContent = world.people.length;
  $('#riders').textContent = world.stats.riders;
  const t = world.dayFrac, hh = Math.floor(t * 24), mm = Math.floor((t * 24 - hh) * 60 / 15) * 15;
  $('#day').textContent = `Day ${world.day}, ${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  $('#sunmoon').className = 'sunmoon' + (world.night > 0.5 ? ' moon' : '');
  document.querySelectorAll('.tool').forEach(b => {
    const t = TOOLS.find(o => o.id === b.dataset.tool);
    b.classList.toggle('poor', !!t.cost && !world.sandbox && world.coins < t.cost);
  });
}
function openPanel(what) { panelFor = what; refreshPanel(); $('#panel').hidden = false; }
function closePanel() { panelFor = null; $('#panel').hidden = true; }
function personDoing(p) {
  const place = id => { const b = world.buildings.get(id); return b ? (BUILDINGS[b.type].label || (b.id === p.home ? 'home' : `${BUILDINGS[b.type].name.toLowerCase()} on ${b.street}`)) : 'somewhere'; };
  if (p.state === 'home') return 'At home.';
  if (p.state === 'visit') return `At ${place(p.dest)}.`;
  if (p.state === 'wait') return `Waiting for a train to ${place(p.dest)}.`;
  if (p.state === 'ride') { const t = world.trains.find(o => o.id === p.train); return `Riding the ${t ? t.color : ''} train to ${place(p.dest)}.`; }
  if (p.fromStation && p.target === p.fromStation) return `Walking to the station, on the way to ${place(p.dest)}.`;
  return p.dest === p.home ? 'Walking home.' : `Walking to ${place(p.dest)}.`;
}
function refreshPanel() {
  const pn = $('#panel');
  const close = '<button class="x" title="Close">&times;</button>';
  let html = '';
  if (panelFor.kind === 'book') {
    const s = world.statsNow();
    html = `${close}<h2>Town book</h2>
      <p class="sub">Day ${world.day} &middot; ${s.population} townsfolk &middot; ${s.riders} passengers carried &middot; ${world.stats.fares} coins in fares</p>
      <ul class="miles">${MILESTONES.map(m => `<li class="${world.done.has(m.id) ? 'done' : ''}"><span class="tick">${world.done.has(m.id) ? '&#10003;' : ''}</span><div><b>${esc(m.title)}</b><br>${esc(m.text)}</div><span class="rew"><i class="coin"></i>${m.reward}</span></li>`).join('')}</ul>`;
  } else if (panelFor.kind === 'person') {
    const p = world.people.find(o => o.id === panelFor.id);
    if (!p) return closePanel();
    const home = world.buildings.get(p.home);
    html = `${close}<h2>${esc(p.name)}</h2><p class="sub">Lives at ${esc(home ? home.street : 'nowhere yet')}</p><p>${esc(personDoing(p))}</p><p class="sub">${p.trips} outing${p.trips === 1 ? '' : 's'} so far.</p>`;
  } else if (panelFor.kind === 'train') {
    const t = world.trains.find(o => o.id === panelFor.id);
    if (!t) return closePanel();
    html = `${close}<h2>The ${t.color} engine</h2><p>${t.state === 'stop' ? 'Stopped at a platform.' : t.speed < 0.05 ? 'Waiting for the line to clear.' : 'Steaming along.'}</p>
      <p>${t.riders.length} passenger${t.riders.length === 1 ? '' : 's'} aboard${t.riders.length ? ': ' + t.riders.map(p => esc(p.name.split(' ')[0])).join(', ') : ''}.</p>
      <p class="sub">${t.odo.toFixed(0)} tiles travelled.</p>
      <button class="pill" id="rmtrain">Take it off the track (+${Math.floor(TRAIN_COST / 2)})</button>`;
  } else if (panelFor.kind === 'building') {
    const b = world.buildings.get(panelFor.id);
    if (!b) return closePanel();
    const def = BUILDINGS[b.type];
    let body = '';
    if (def.kind === 'home') {
      const folk = b.residents.map(id => world.people.find(p => p.id === id)).filter(Boolean);
      body = `<ul class="folk">${folk.map(p => `<li><b>${esc(p.name)}</b><br><span class="sub">${esc(personDoing(p))}</span></li>`).join('')}</ul>`;
      if (b.unhappy) body += '<p class="warn">Someone here can\'t get where they want to go. Is there a station nearby?</p>';
    } else if (def.kind === 'station') {
      const waiting = world.people.filter(p => p.state === 'wait' && p.fromStation === b.id);
      body = `<p>${waiting.length} waiting on the platform.</p><p class="sub">Folk walk up to 6 tiles to a station, and ride when it beats walking.</p>`;
    } else if (def.kind === 'place') {
      const inside = world.people.filter(p => p.state === 'visit' && p.dest === b.id).length;
      body = `<p>${inside ? `${inside} visiting right now.` : 'Nobody here right now.'}</p>`;
    } else body = `<p class="sub">${esc(def.tip)}</p>`;
    html = `${close}<h2>${esc(def.name)}</h2><p class="sub">${esc(b.street)}</p>${body}`;
  }
  pn.innerHTML = html;
  pn.querySelector('.x').onclick = closePanel;
  const rm = pn.querySelector('#rmtrain');
  if (rm) rm.onclick = () => { const t = world.trains.find(o => o.id === panelFor.id); if (t) { world.removeTrain(t); if (!world.sandbox) world.coins += Math.floor(TRAIN_COST / 2); } closePanel(); };
}

// ------------------------------------------------------------------ menu and help
function modal(html) {
  const m = $('#modal');
  m.innerHTML = `<div class="card">${html}</div>`;
  m.hidden = false;
  m.onclick = e => { if (e.target === m) closeModal(); };
  return m;
}
function closeModal() { $('#modal').hidden = true; }
function showMenu() {
  const m = modal(`<h2>Whistlebrook</h2>
    <div class="menu">
      <button class="pill big" data-a="help">How to play</button>
      <button class="pill big" data-a="starter">New town (with a starter railway)</button>
      <button class="pill big" data-a="empty">New town (empty baseboard)</button>
      <button class="pill big" data-a="sandbox">Sandbox (unlimited coins)</button>
      <button class="pill big" data-a="close">Back to town</button>
    </div>
    <p class="sub">Your town saves itself in this browser. Models made in <a href="../voxel-studio/" target="_blank">Voxel Studio</a>.</p>`);
  m.querySelectorAll('[data-a]').forEach(b => b.onclick = () => {
    const a = b.dataset.a;
    if (a === 'help') return showHelp();
    if (a === 'close') return closeModal();
    if (confirm('Start a new town? This one will be replaced.')) { newTown(a); closeModal(); }
  });
}
function showHelp(first) {
  const m = modal(`<h2>${first ? 'Welcome to Whistlebrook' : 'How to play'}</h2>
    <p>A little town on a tabletop. The townsfolk want to visit the bakery, the toy shop, the park, the mill and each other. Lay track, build stations, and run steam trains to carry them. Every passenger pays a fare when they get off.</p>
    <ul class="help">
      <li><b>Track</b>: drag across tiles. Corners curve by themselves. Draw a third branch off a tile to make a junction; click its little flag with the Hand to switch it.</li>
      <li><b>Stations</b> go right beside the track. Trains stop at the tile next to them. Folk walk up to 6 tiles to a station.</li>
      <li><b>Trains</b> need a bit of track behind them for their coaches. At a dead end they back up.</li>
      <li><b>Hand</b>: click townsfolk, trains and buildings. Everyone has something to say.</li>
      <li><b>Camera</b>: right-drag or WASD to pan, wheel to zoom, Q and E to turn the table. R turns a building before you place it. Space pauses.</li>
    </ul>
    <div class="menu"><button class="pill big" data-a="go">${first ? 'Let\'s go!' : 'Back to town'}</button></div>`);
  m.querySelector('[data-a=go]').onclick = () => { sound.start(); localStorage.setItem(SAVE_KEY + '-seen', '1'); closeModal(); };
}

boot().catch(err => {
  console.error(err);
  $('#loadmsg').textContent = 'Something went wrong loading the toy box: ' + err.message;
});
