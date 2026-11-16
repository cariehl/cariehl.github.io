// Boot, input, the game loop, HUD and panels.
import * as sim from './sim.js';
import { ITEMS, FURNITURE, ROBOTS, RECIPES, NOISE } from './data.js';
import { createRenderer, drawMinimap, drawRadar, minimapToWorld } from './render.js';
import { initAudio, sfx, setMuted, audio, setAmbient } from './audio.js';
import { W, idx, inBounds } from './world.js';
import { DOCS, BROADCASTS, FIELD_GUIDE, OCCUPATIONS, EPITAPHS, ENDINGS } from './lore.js';

const SAVE_KEY = 'faraday-county-v1';
const MEM_KEY = 'faraday-county-memorial';
const SET_KEY = 'faraday-county-settings';
const TIP_KEY = 'faraday-county-tips';
const $ = id => document.getElementById(id);
const canvas = $('view');
const R = createRenderer(canvas);

let game = null;
let paused = true;
let lootAt = null;     // [x, y] of the open container
let selected = null;   // selected inventory stack
let placing = null;    // stack being placed
let lastSave = 0;
let wasHunted = false;

// ---------- saving ----------
function save() {
  if (!game || game.dead) return;
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(sim.serialize(game))); } catch { /* storage full or blocked */ }
}
function loadSave() {
  try { const s = localStorage.getItem(SAVE_KEY); return s ? sim.deserialize(JSON.parse(s)) : null; } catch { return null; }
}
function eraseSave() { try { localStorage.removeItem(SAVE_KEY); } catch { /* ignore */ } }

// ---------- settings ----------
const settings = { vol: 50, shake: true, rings: true, pauseRead: true, radar: true, tips: true, blurPause: true, zoom: null, ui: 'auto', menuPause: true, craftOnly: false };
try { Object.assign(settings, JSON.parse(localStorage.getItem(SET_KEY) || '{}')); } catch { /* defaults */ }
function applySettings() {
  audio.volume = settings.vol / 100;
  setMuted(settings.vol === 0);
  R.showRings = settings.rings;
  $('radar').hidden = !settings.radar;
  applyUi();
  try { localStorage.setItem(SET_KEY, JSON.stringify(settings)); } catch { /* ignore */ }
}
$('setVol').value = settings.vol; $('setShake').checked = settings.shake; $('setRings').checked = settings.rings; $('setPause').checked = settings.pauseRead;
$('setVol').oninput = () => { settings.vol = +$('setVol').value; applySettings(); };
$('setShake').onchange = () => { settings.shake = $('setShake').checked; applySettings(); };
$('setRings').onchange = () => { settings.rings = $('setRings').checked; applySettings(); };
$('setPause').onchange = () => { settings.pauseRead = $('setPause').checked; applySettings(); };
$('setRadar').checked = settings.radar; $('setTips').checked = settings.tips; $('setBlur').checked = settings.blurPause;
$('setRadar').onchange = () => { settings.radar = $('setRadar').checked; applySettings(); };
$('setTips').onchange = () => { settings.tips = $('setTips').checked; if (!settings.tips) $('tip').hidden = true; applySettings(); };
$('setBlur').onchange = () => { settings.blurPause = $('setBlur').checked; applySettings(); };
$('setResetTips').onclick = () => { tipsSeen.clear(); saveTips(); $('setResetTips').textContent = 'Tips reset'; };
$('setUi').value = String(settings.ui); $('setMenuPause').checked = settings.menuPause;
$('setUi').onchange = () => { settings.ui = $('setUi').value === 'auto' ? 'auto' : +$('setUi').value; applySettings(); };
$('setMenuPause').onchange = () => { settings.menuPause = $('setMenuPause').checked; applySettings(); };
$('craftOnly').checked = settings.craftOnly;
$('craftOnly').onchange = () => { settings.craftOnly = $('craftOnly').checked; applySettings(); refreshPanels(); };

// Interface size. Automatic grows the interface on tall screens so text stays readable from a
// normal sitting distance (900 px tall is 1x; a 1440p monitor gets about 1.5x).
const autoUi = () => Math.max(0.85, Math.min(1.6, Math.round(window.innerHeight / 900 * 20) / 20));
let UI = 1;
function applyUi() {
  UI = settings.ui === 'auto' ? autoUi() : (+settings.ui || 1);
  document.documentElement.style.setProperty('--ui', UI);
}
// the camera zoom also starts larger on big screens, until you pick your own with the wheel
const autoZoom = () => Math.max(1, Math.min(2.4, 1.3 * window.innerHeight / 900));
R.zoom = settings.zoom || autoZoom();
window.addEventListener('resize', () => { if (settings.ui === 'auto') applyUi(); if (!settings.zoom) R.zoom = autoZoom(); if (!$('map').hidden) refreshPanels(); });
applySettings();
function shake(n) { if (settings.shake) R.shake = n; }

// ---------- tips ----------
// Shown once each, ever (per browser), the first time the situation comes up.
const tipsSeen = new Set((() => { try { return JSON.parse(localStorage.getItem(TIP_KEY) || '[]'); } catch { return []; } })());
function saveTips() { try { localStorage.setItem(TIP_KEY, JSON.stringify([...tipsSeen])); } catch { /* ignore */ } }
const TIPS = [
  ['search', g => g.t > 0.05, 'Hover over furniture and press E to search it. Right click anything to see everything you can do with it.'],
  ['board', g => sim.has(g.player.inv, 'hammer') && sim.has(g.player.inv, 'plank') && sim.has(g.player.inv, 'nails', 2), 'You have a hammer, planks and nails. Right click a door or window and choose Barricade. Three planks stop almost anything.'],
  ['bleed', g => g.player.wounds.some(w => !w.bandaged), 'You are bleeding. Press Q to bandage it (a rag works too, but can infect the wound).'],
  ['robot', g => g.journal.seen.length > 0, 'Robots follow noise. Press C to sneak. In a bush, a sneaking person is nearly invisible. Hover over a robot to see what it is doing.'],
  ['hunted', g => g.robots.some(r => r.state === 'chase' && r.seeT < 1), 'You have been seen. Break line of sight, or fight in a doorway so only one can reach you. Hits on a robot that has not noticed you do far more damage.'],
  ['hungry', g => g.player.hunger < 35 || g.player.thirst < 35, 'Getting hungry or thirsty. Eat and drink from your bag (Tab). Canned food needs an opener, a knife or a screwdriver.'],
  ['dusk', g => sim.daylight(g) < 0.55 && sim.clock(g).hour >= 17, 'Night is coming. At 23:00 a sweep heads for wherever you were last heard. Get inside, board up, and keep quiet in the evening.'],
  ['doc', g => g.journal.docs.length > 0, 'Documents go into your journal (J). Some of them tell you how to get out.'],
  ['radio', g => sim.has(g.player.inv, 'radio'), 'You have a wind-up radio. At dawn, use it from your bag to hear Faraday Free Radio. Dot has a plan.'],
  ['water', g => g.waterOff, 'The taps are dry. Collect bottles and craft a rain barrel (B). It fills when it rains.'],
  ['heavy', g => sim.weight(g.player.inv) > sim.capacity(g), 'You are carrying too much and will move slowly. Drop things from your bag, or find a backpack.'],
  ['breaker', g => g.journal.seen.includes('breaker'), 'Breakers smash through barricades. If one is coming your way, leave. Pulse charges stop them cold.'],
];
let tipT = 0, tipOn = null;
function updateTips(dt) {
  const covered = CENTER.some(id => !$(id).hidden);
  if (tipOn) { $('tip').hidden = covered; if (!covered) tipT -= dt; if (tipT <= 0) hideTip(); return; }
  if (covered) return;
  if (!settings.tips) return;
  for (const [id, when, text] of TIPS) {
    if (tipsSeen.has(id)) continue;
    let hit = false; try { hit = when(game); } catch { /* ignore */ }
    if (!hit) continue;
    tipsSeen.add(id); saveTips();
    tipOn = id; tipT = 14;
    $('tipText').textContent = text; $('tip').hidden = false;
    return;
  }
}
function hideTip() { tipOn = null; $('tip').hidden = true; }
$('tipOk').onclick = hideTip;

// ---------- memorial ----------
function memorial() { try { return JSON.parse(localStorage.getItem(MEM_KEY) || '[]'); } catch { return []; } }
function addMemorial(g, won) {
  const list = memorial();
  const occ = OCCUPATIONS.find(o => o.id === g.occupation);
  list.unshift({ name: g.name, occ: occ?.name || '', diff: g.difficulty, days: sim.survivedText(g), t: g.t, cause: won ? (ENDINGS[g.ending] || ENDINGS.bus).cause : g.cause, won, kills: g.stats.kills, docs: g.journal.docs.length, when: Date.now() });
  try { localStorage.setItem(MEM_KEY, JSON.stringify(list.slice(0, 50))); } catch { /* ignore */ }
}
function renderMemorial() {
  const list = memorial();
  $('memList').innerHTML = list.length ? list.map(m => `<div class="mem${m.won ? ' won' : ''}"><b>${esc(m.name)}</b><span class="d">${m.days}</span><span class="c">${esc(m.occ)}${m.diff && m.diff !== 'normal' ? ` (${sim.DIFFICULTY[m.diff]?.name || ''})` : ''} · ${esc(m.cause)} · ${m.kills} robots wrecked · ${m.docs} document${m.docs === 1 ? '' : 's'}</span></div>`).join('')
    : '<div class="empty">No names yet.</div>';
}
function esc(t) { return String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

// ---------- screens ----------
const SCREENS = ['title', 'newlife', 'memorial', 'death', 'win', 'pause', 'reader'];
function showScreen(id) { for (const k of SCREENS) $(k).hidden = k !== id; }

function showTitle() {
  if (game && !game.dead && !game.won) save();
  game = null;
  paused = true;
  showScreen('title'); $('hud').hidden = true;
  closePanels();
  let data = null;
  try { data = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch { /* ignore */ }
  $('contBtn').hidden = !data;
  if (data) {
    const occ = OCCUPATIONS.find(o => o.id === data.occupation);
    const day = Math.floor((sim.START_MINUTE + data.t) / 1440) + 1;
    $('contInfo').textContent = `${data.name || 'You'}${occ && occ.id !== 'none' ? ', ' + occ.name.toLowerCase() : ''} · day ${day}`;
  }
  const n = memorial().length;
  const best = memorial().reduce((a, m) => (!a || (m.t || 0) > (a.t || 0) ? m : a), null);
  $('memInfo').textContent = n ? `${n} li${n === 1 ? 'fe' : 'ves'} · longest: ${esc(best.name)}, ${best.days}` : 'Lives lost in Marrow Creek';
  noticeIdx = 0; showNotice();
  setTimeout(() => { if (!$('title').hidden && !CENTER.some(id => !$(id).hidden)) ($('contBtn').hidden ? $('newBtn') : $('contBtn')).focus({ preventScroll: true }); }, 0);
}

// Halcyon notices and Dot's voice, rotating on the title screen
const NOTICES = [
  ...BROADCASTS.slice(0, 6).flatMap((b, i) => [{ src: 'Halcyon Civic Care', text: b.halcyon, foot: `Broadcast, day ${i + 1}` }]),
  { src: 'Faraday Free Radio', text: BROADCASTS[0].dot, foot: '88.3, from the copper room', dot: true },
  { src: 'Faraday Free Radio', text: BROADCASTS[2].dot, foot: '88.3, from the copper room', dot: true },
];
let noticeIdx = 0, noticeTimer = null;
function showNotice() {
  const n = NOTICES[noticeIdx % NOTICES.length];
  $('notice').classList.toggle('dot-on', !!n.dot);
  $('noticeSrc').textContent = n.src; $('noticeText').textContent = n.text; $('noticeFoot').textContent = n.foot;
  clearTimeout(noticeTimer);
  noticeTimer = setTimeout(() => { if (!$('title').hidden) { noticeIdx++; showNotice(); } }, 9000);
}
$('notice').onclick = () => { noticeIdx++; showNotice(); };

// New life: name and occupation
const NAMES = ['Ruth Calder', 'Sam Okafor', 'Jo Whitley', 'Marcus Bell', 'Lena Duarte', 'Eli Haight', 'Nadia Pruitt', 'Theo Marsh', 'June Arceneaux', 'Wes Lindqvist', 'Priya Banerjee', 'Cal Reyes'];
let chosenOcc = 'carpenter', chosenDiff = 'normal';
const randomName = () => { let n; do n = NAMES[Math.floor(Math.random() * NAMES.length)]; while (n === $('nameIn').value); return n; };
$('nameDice').onclick = () => { $('nameIn').value = randomName(); };
function showNewLife() {
  showScreen('newlife');
  $('nameIn').value = randomName();
  const db = $('diffs'); db.innerHTML = '';
  for (const [id, d] of Object.entries(sim.DIFFICULTY)) {
    const b = document.createElement('button'); b.type = 'button'; b.dataset.id = id; b.textContent = d.name;
    b.onclick = () => { chosenDiff = id; showNewLife.refresh(); };
    db.appendChild(b);
  }
  const box = $('occs');
  box.innerHTML = '';
  for (const o of OCCUPATIONS) {
    const b = document.createElement('button');
    b.className = 'occ' + (o.id === chosenOcc ? ' on' : '');
    b.innerHTML = `<span class="ic">${o.icon}</span><span class="nm">${o.name}</span>`;
    b.onclick = () => { chosenOcc = o.id; showNewLife.refresh(); };
    b.dataset.id = o.id;
    box.appendChild(b);
  }
  showNewLife.refresh();
}
showNewLife.refresh = () => {
  for (const b of $('occs').children) b.classList.toggle('on', b.dataset.id === chosenOcc);
  const o = OCCUPATIONS.find(o => o.id === chosenOcc);
  $('occDetail').innerHTML = `<p class="bl">${o.blurb}</p><p class="pk">${o.perk}</p>`;
  for (const b of $('diffs').children) b.classList.toggle('on', b.dataset.id === chosenDiff);
  $('diffDetail').textContent = sim.DIFFICULTY[chosenDiff].blurb;
};

function startGame(g) {
  game = g;
  R.camInit = false;
  lastSave = performance.now();
  wasHunted = false;
  showScreen(null); $('hud').hidden = false;
  $('log').innerHTML = '';
  for (const m of game.messages.slice(-5)) logLine(m.text, m.kind);
  game.fx = [];
  paused = false;
  hideTip();
  updateUnread();
  initAudio();
}
$('newBtn').onclick = () => showNewLife();
$('beginBtn').onclick = () => {
  eraseSave();
  const name = $('nameIn').value.trim().slice(0, 24) || 'Nobody';
  // ?seed=123 in the address replays a county layout (handy for sharing and for tests)
  const seedParam = Number(new URLSearchParams(location.search).get('seed'));
  startGame(sim.newGame(Number.isFinite(seedParam) && seedParam > 0 ? seedParam : undefined, { name, occupation: chosenOcc, difficulty: chosenDiff }));
  save();
};
$('backBtn').onclick = () => showTitle();
$('nameIn').addEventListener('keydown', e => { e.stopPropagation(); if (e.key === 'Enter') $('beginBtn').click(); });
$('contBtn').onclick = () => { const g = loadSave(); if (g) startGame(g); else { eraseSave(); showTitle(); } };
$('againBtn').onclick = () => showNewLife();
$('deathMenu').onclick = () => showTitle();
$('winAgain').onclick = () => showNewLife();
$('winMenu').onclick = () => showTitle();
$('memBtn').onclick = () => { renderMemorial(); showScreen('memorial'); };
$('memBack').onclick = () => showTitle();
$('memClear').onclick = () => {
  if (!memorial().length || !confirm('Clear every name from the Memorial? This cannot be undone.')) return;
  try { localStorage.removeItem(MEM_KEY); } catch { /* ignore */ }
  renderMemorial();
};
// arrow keys walk the title menu; Enter (a real button press) picks
function menuKey(k) {
  const items = [...document.querySelectorAll('#mainMenu .mi')].filter(b => !b.hidden);
  if (!items.length) return false;
  const at = items.indexOf(document.activeElement);
  if (k === 'arrowdown' || k === 's') { items[(at + 1) % items.length].focus(); return true; }
  if (k === 'arrowup' || k === 'w') { items[(at - 1 + items.length) % items.length].focus(); return true; }
  return false;
}
$('titleHelp').onclick = () => openPanel('help');
$('titleSettings').onclick = () => openPanel('settings');
$('resumeBtn').onclick = () => togglePause(false);
// Journal and help from the pause menu keep the game paused and return to the menu when closed.
let fromPause = false;
function openFromPause(id) { fromPause = true; $('pause').hidden = true; openPanel(id); }
$('helpBtn').onclick = () => openFromPause('help');
$('journalBtn').onclick = () => openFromPause('journal');
$('pauseSettings').onclick = () => openFromPause('settings');
$('quitBtn').onclick = () => showTitle();

function togglePause(on) {
  if (!game || game.dead || game.won) return;
  paused = on;
  $('pause').hidden = !on;
  fromPause = false;
  if (on) {
    hideCtx();
    save();
    const occ = OCCUPATIONS.find(o => o.id === game.occupation);
    const d = sim.dateText(game);
    $('pauseWho').innerHTML = `${esc(game.name)}<small>${occ.name} · ${sim.DIFFICULTY[game.difficulty]?.name || 'Normal'} · Day ${d.day}, ${d.date}, ${d.time}</small>`;
    $('pauseStats').innerHTML = `<div><b>${short(game)}</b>survived</div><div><b>${game.stats.kills}</b>wrecked</div><div><b>${game.journal.docs.length}/${DOCS.length}</b>documents</div>`;
    setTimeout(() => $('resumeBtn').focus({ preventScroll: true }), 0);
  }
}

// ---------- the map ----------
// Opens fitted to what you have explored, centered on you. +/- or the wheel zoom; Fit and You re-frame.
let mapScale = null, mapCenter = null; // null: fit to explored / center on the player
function exploredBounds(g) {
  const ex = g.world.explored;
  let a = 1e9, b = -1e9, c = 1e9, d = -1e9; // screen-space extents of explored tiles (x-y, x+y)
  for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) {
    if (!ex[idx(x, y)]) continue;
    const u = x - y, v = x + y;
    if (u < a) a = u; if (u > b) b = u; if (v < c) c = v; if (v > d) d = v;
  }
  if (a > b) { const p = g.player; return { u0: p.x - p.y - 10, u1: p.x - p.y + 10, v0: p.x + p.y - 10, v1: p.x + p.y + 10 }; }
  return { u0: a - 2, u1: b + 3, v0: c - 2, v1: d + 3 };
}
function fitScale(g, wrap) {
  const bd = exploredBounds(g);
  // map pixel = (u * s, v * s / 2); fit both into the visible area
  const s = Math.min((wrap.clientWidth - 24) / (bd.u1 - bd.u0), (wrap.clientHeight - 24) * 2 / (bd.v1 - bd.v0));
  return Math.max(3, Math.min(16, s));
}
function drawMap() {
  const wrap = $('map').querySelector('.mapwrap'), cv = $('mapCanvas');
  const s = mapScale || fitScale(game, wrap);
  drawMinimap(cv, game, s);
  cv.dataset.scale = s;
  // half a view of margin all round, so even the edge of the county can sit in the middle
  const padX = Math.round(wrap.clientWidth / 2), padY = Math.round(wrap.clientHeight / 2);
  cv.style.margin = `${padY}px ${padX}px`;
  let cx, cy;
  if (mapCenter) { cx = mapCenter[0]; cy = mapCenter[1]; }
  else if (!mapScale) { const bd = exploredBounds(game); cx = (bd.u0 + bd.u1) / 2; cy = (bd.v0 + bd.v1) / 2; }
  else { cx = game.player.x - game.player.y; cy = game.player.x + game.player.y; }
  wrap.scrollLeft = (cx + W) * s + padX - wrap.clientWidth / 2;
  wrap.scrollTop = cy * s / 2 + padY - wrap.clientHeight / 2;
}
function mapView() { // what the map is centered on now, in (u, v) terms
  const wrap = $('map').querySelector('.mapwrap'), s = +$('mapCanvas').dataset.scale || 6;
  const padX = Math.round(wrap.clientWidth / 2), padY = Math.round(wrap.clientHeight / 2);
  return [(wrap.scrollLeft + wrap.clientWidth / 2 - padX) / s - W, (wrap.scrollTop + wrap.clientHeight / 2 - padY) * 2 / s];
}
function mapZoom(f) {
  if (!game) return;
  const cur = +$('mapCanvas').dataset.scale || 6;
  mapCenter = mapView();
  mapScale = Math.max(3, Math.min(20, cur * f));
  drawMap();
}
$('mapIn').onclick = () => mapZoom(1.35);
$('mapOut').onclick = () => mapZoom(1 / 1.35);
$('mapFit').onclick = () => { mapScale = null; mapCenter = null; drawMap(); };
$('mapMe').onclick = () => { if (!game) return; mapScale ||= +$('mapCanvas').dataset.scale; mapCenter = null; drawMap(); };
$('map').querySelector('.mapwrap').addEventListener('wheel', (e) => { e.preventDefault(); mapZoom(e.deltaY > 0 ? 1 / 1.2 : 1.2); }, { passive: false });
$('mapCanvas').addEventListener('click', (e) => {
  if (!game) return;
  const cv = $('mapCanvas'), rect = cv.getBoundingClientRect();
  const px = (e.clientX - rect.left) * cv.width / rect.width, py = (e.clientY - rect.top) * cv.height / rect.height;
  const [x, y] = minimapToWorld(px, py, +cv.dataset.scale || 6);
  const pins = game.pins ||= [];
  const near = pins.findIndex(p => Math.hypot(p.x - x, p.y - y) < 2.5);
  if (near >= 0) pins.splice(near, 1);
  else if (pins.length < 9) pins.push({ x, y });
  else sim.log(game, 'Nine pins is plenty. Click one to lift it.', 'dim');
  mapCenter = mapView();
  drawMap();
});

// ---------- panels ----------
const PANELS = ['inv', 'loot', 'craft', 'map', 'help', 'journal', 'settings'];
const CENTER = ['craft', 'map', 'help', 'journal', 'settings'];
function openPanel(id) {
  if (CENTER.includes(id)) { for (const p of CENTER) if (p !== id) $(p).hidden = true; hideCtx(); keys.clear(); }
  if (id === 'map') { mapScale = null; mapCenter = null; }
  $(id).hidden = false;
  syncBackdrop();
  refreshPanels();
  if (CENTER.includes(id) && document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
}
function closePanel(id) {
  $(id).hidden = true;
  if (id === 'loot' && lootAt) { sim.cleanPile(game, lootAt[0], lootAt[1]); lootAt = null; if (game) renderInventoryIfOpen(); }
  syncBackdrop();
  if (fromPause && CENTER.includes(id) && !CENTER.some(p => !$(p).hidden)) { fromPause = false; togglePause(true); }
}
function renderInventoryIfOpen() { if (!$('inv').hidden) renderInventory(); }
// a dim backdrop behind center panels; clicking it closes them
function syncBackdrop() {
  $('backdrop').hidden = !CENTER.some(p => !$(p).hidden);
  // the message log steps aside for the bag, and tips wait while you loot
  document.body.classList.toggle('bag-open', !$('inv').hidden);
  document.body.classList.toggle('loot-open', !$('loot').hidden);
}
$('backdrop').onclick = () => { for (const p of CENTER) if (!$(p).hidden) closePanel(p); };
// Help and settings always stop the clock. Map, journal and crafting do too unless switched off.
function menuPaused() {
  if (!game) return false;
  if (!$('help').hidden || !$('settings').hidden) return true;
  return settings.menuPause && (!$('map').hidden || !$('journal').hidden || !$('craft').hidden);
}
function closePanels() {
  if (!game) { for (const p of PANELS) $(p).hidden = true; syncBackdrop(); return; }
  for (const p of PANELS) if (!$(p).hidden || p === 'loot') closePanel(p);
  hideCtx(); placing = null; R.ghost = null;
}
function anyCenterPanel() { return !$('craft').hidden || !$('map').hidden || !$('help').hidden; }
for (const b of document.querySelectorAll('[data-close]')) b.onclick = () => closePanel(b.closest('.panel').id);

function refreshPanels() {
  if (!game) return;
  if (!$('inv').hidden || !$('loot').hidden) renderInventory();
  if (!$('loot').hidden) renderLoot();
  if (!$('craft').hidden) renderCraft();
  if (!$('journal').hidden) renderJournal();
  if (!$('map').hidden) drawMap();
}

const ICONS = {
  beans: '🥫', soup: '🥫', tuna: '🐟', peaches: '🍑', chips: '🍟', granola: '🍫', crackers: '🍘', cereal: '🥣', pbutter: '🥜', apple: '🍎', bread: '🍞', mre: '🎒',
  water: '💧', soda: '🥤', juice: '🧃', bandage: '🩹', rag: '🧻', antiseptic: '🧴', painkillers: '💊',
  hammer: '🔨', saw: '🪚', screwdriver: '🪛', opener: '🥄', flashlight: '🔦', batteries: '🔋', radio: '📻',
  knife: '🔪', pipe: '🔩', crowbar: '🦯', bat: '🏏', spikedbat: '🏏', wrench: '🔧', axe: '🪓', sledge: '🔨', shotgun: '🔫', shells: '🧨',
  tincan: '🥫', bottle: '🍶', pulse: '⚡', noisemaker: '📢', plank: '🪵', nails: '📌', scrap: '⚙️', wiring: '〰️', circuit: '🟩', cell: '🔋', cloth: '👕', tape: '🩶',
  jacket: '🧥', platejacket: '🛡️', vest: '🦺', backpack: '🎒', duffel: '👜', jammer: '📡', barrelkit: '🛢️', wallkit: '🧱', cratekit: '📦',
};
const CAT_ORDER = ['weapon', 'wear', 'food', 'drink', 'med', 'tool', 'device', 'ammo', 'material'];
const CAT_NAME = { weapon: 'Weapons', wear: 'Clothing', food: 'Food', drink: 'Drink', med: 'Medical', tool: 'Tools', device: 'Devices', ammo: 'Ammo', material: 'Materials' };

function itemRow(st, onClick, opts = {}) {
  const d = ITEMS[st.id];
  const el = document.createElement('div');
  el.className = 'item' + (st === selected && opts.sel ? ' sel' : '');
  const eq = game && sim.isEquipped(game, st);
  let meter = '';
  if (st.dur != null && d.dur) meter = `<span class="meter"><i style="width:${Math.round(st.dur / d.dur * 100)}%"></i></span>`;
  if (st.charge != null) meter = `<span class="meter"><i style="width:${Math.round(st.charge)}%;background:#79c26a"></i></span>`;
  el.innerHTML = `<span class="ic">${ICONS[st.id] || '·'}</span><span class="n">${st.n > 1 ? st.n + '×' : ''}</span><span class="nm">${d.name}</span>${eq ? '<span class="tag">on</span>' : ''}${game.player.throwId === st.id && d.throwable ? '<span class="tag">G</span>' : ''}${meter}<span class="w">${(d.wt * st.n).toFixed(1)}</span>`;
  el.onclick = (e) => onClick(e);
  el.oncontextmenu = (e) => { e.preventDefault(); onClick(e, true); };
  if (opts.onDouble) el.ondblclick = (e) => { e.preventDefault(); opts.onDouble(st, e); };
  el.title = opts.rowTip || '';
  return el;
}

function groupedRows(list, container, onClick, opts) {
  container.innerHTML = '';
  if (!list.length) { container.innerHTML = `<div class="empty">${opts.empty || 'Nothing.'}</div>`; return; }
  const by = {};
  for (const s of list) (by[ITEMS[s.id].cat] ||= []).push(s);
  for (const cat of CAT_ORDER) {
    if (!by[cat]) continue;
    const h = document.createElement('div'); h.className = 'cat'; h.textContent = CAT_NAME[cat];
    container.appendChild(h);
    for (const s of by[cat].sort((a, b) => ITEMS[a.id].name.localeCompare(ITEMS[b.id].name))) container.appendChild(itemRow(s, (e, alt) => onClick(s, e, alt), opts));
  }
}

function renderInventory() {
  const p = game.player;
  if (selected && !p.inv.includes(selected)) selected = null;
  const wt = sim.weight(p.inv), cap = sim.capacity(game);
  $('invWt').textContent = `${wt.toFixed(1)} / ${cap} kg`;
  $('invWt').style.color = wt > cap ? '#ff9c90' : '';
  let wb = $('inv').querySelector('.wbar');
  if (!wb) { wb = document.createElement('div'); wb.className = 'wbar'; wb.innerHTML = '<i></i>'; $('inv').querySelector('header').after(wb); }
  wb.classList.toggle('over', wt > cap);
  wb.firstChild.style.width = Math.min(100, wt / cap * 100) + '%';
  const e = p.equip;
  $('invEquip').innerHTML = `<div><span>Hands</span>${e.weapon ? ITEMS[e.weapon.id].name : 'Fists'}</div><div><span>Body</span>${e.body ? ITEMS[e.body.id].name : 'Hoodie'}</div><div><span>Back</span>${e.back ? ITEMS[e.back.id].name : '—'}</div>`;
  const box = openBox();
  groupedRows(p.inv, $('invList'), (s, ev, alt) => {
    // shift-click is the quick way to stash a whole stack in the open container
    if (box && ev.shiftKey && !alt) { putIn(s, s.n); return; }
    selected = s;
    if (alt) { const acts = sim.itemActions(game, s); if (acts[0] && !acts[0].disabled) runItemAction(acts[0]); }
    renderInventory();
  }, { empty: 'Your pockets are empty.', sel: true, onDouble: box ? (s) => putIn(s, s.n) : null,
    rowTip: box ? `Click: details. Double click or shift click: put in ${box.name.toLowerCase()}. Right click: do the first thing.` : 'Click: details. Right click: do the first thing.' });
  const det = $('invDetail');
  if (!selected) {
    det.innerHTML = `<div class="intro">${box ? `<b>Putting things in the ${esc(box.name.toLowerCase())}?</b> Pick an item, then press <b>Put in</b>. Double click (or shift click) does it in one go.` : '<b>Click an item</b> to see what it does and use it. Right click an item to do the first thing on its list (eat, drink, wield…).'}</div>`;
    return;
  }
  const d = ITEMS[selected.id];
  const bits = [];
  if (d.hunger) bits.push(`Food ${d.hunger > 0 ? '+' : ''}${d.hunger}`);
  if (d.thirst) bits.push(`Water ${d.thirst > 0 ? '+' : ''}${d.thirst}`);
  if (d.dmg) bits.push(`Damage ${d.dmg}`, `Speed ${(1 / d.cd).toFixed(1)}/s`);
  if (selected.dur != null && d.dur) bits.push(`Wear ${selected.dur}/${d.dur}`);
  if (d.armor) bits.push(`Protection ${Math.round(d.armor * 100)}%`);
  if (selected.charge != null) bits.push(`Charge ${Math.round(selected.charge)}%`);
  if (d.canned) bits.push('Canned');
  det.innerHTML = `<b>${ICONS[selected.id] || ''} ${d.name}</b><div class="desc">${d.desc || ''} ${bits.length ? `<br><span style="font-family:var(--mono);font-size:12px">${bits.join(' · ')}</span>` : ''}</div><div class="acts"></div>`;
  const acts = det.querySelector('.acts');
  if (box) {
    const st = selected;
    const one = document.createElement('button');
    one.className = 'btn put'; one.textContent = st.n > 1 ? `Put 1 in ${box.name.toLowerCase()}` : `Put in ${box.name.toLowerCase()}`;
    one.onclick = () => putIn(st, 1);
    acts.appendChild(one);
    if (st.n > 1) { const all = document.createElement('button'); all.className = 'btn put'; all.textContent = `Put all ${st.n}`; all.onclick = () => putIn(st, st.n); acts.appendChild(all); }
  }
  for (const a of sim.itemActions(game, selected)) {
    const b = document.createElement('button');
    b.className = 'btn ghost'; b.textContent = a.label;
    if (a.disabled) { b.disabled = true; b.title = a.disabled; }
    b.onclick = () => runItemAction(a);
    acts.appendChild(b);
  }
}

// the container open next to the bag, if any
function openBox() {
  if (!lootAt || $('loot').hidden) return null;
  const c = sim.containerAt(game, lootAt[0], lootAt[1]);
  if (!c) return null;
  return { c, name: c.kind === 'pile' ? 'Ground' : c.kind === 'wreck' ? 'Wreck' : FURNITURE[c.kind]?.name || 'Container' };
}
function putIn(st, n) {
  const box = openBox(), p = game.player;
  if (!box || !p.inv.includes(st)) return;
  sim.moveStack(game, p.inv, box.c.items, st, n);
  if (p.flashlight && !sim.has(p.inv, 'flashlight')) p.flashlight = false;
  if (!p.inv.includes(st)) selected = null;
  sfx.pickup(); refreshPanels();
}

function runItemAction(a) {
  const res = a.run();
  if (res && res.radio) showRadio(res.radio);
  if (res && res.place) { placing = res.place; sim.log(game, `Click a spot next to you to place the ${ITEMS[placing.id].name.toLowerCase()}. Esc to cancel.`, 'hint'); }
  refreshPanels();
}

function renderLoot() {
  const c = lootAt && sim.containerAt(game, lootAt[0], lootAt[1]);
  if (!c) { closePanel('loot'); return; }
  const f = FURNITURE[c.kind];
  $('lootTitle').textContent = c.kind === 'pile' ? 'On the ground' : c.kind === 'wreck' ? `${ROBOTS[c.robot]?.name || 'Robot'} wreck` : f?.name || 'Container';
  groupedRows(c.items, $('lootList'), (s, ev) => {
    sim.moveStack(game, c.items, game.player.inv, s, ev.shiftKey || s.dur != null || s.charge != null ? s.n : (s.n > 1 && !ev.altKey ? s.n : 1));
    sfx.pickup();
    refreshPanels();
  }, { empty: c.kind === 'wreck' ? 'Stripped bare.' : 'Empty.' });
}
$('takeAll').onclick = () => {
  const c = lootAt && sim.containerAt(game, lootAt[0], lootAt[1]);
  if (!c) return;
  for (const s of c.items.slice()) sim.moveStack(game, c.items, game.player.inv, s, s.n);
  sfx.pickup();
  refreshPanels();
};

const CRAFT_GROUPS = [
  ['Medical', ['rags', 'cleanrag']],
  ['Weapons and armour', ['spikedbat', 'platejacket', 'fixweapon']],
  ['Devices', ['pulse', 'noisemaker', 'jammer']],
  ['Building', ['wallkit', 'barrelkit', 'cratekit']],
];
function renderCraft() {
  const box = $('recipes');
  box.innerHTML = '';
  const inv = game.player.inv;
  for (const [group, ids] of CRAFT_GROUPS) {
    const h = document.createElement('div'); h.className = 'cgroup'; h.textContent = group;
    box.appendChild(h);
    const rs = ids.map(id => RECIPES.find(r => r.id === id)).filter(Boolean)
      .filter(r => !settings.craftOnly || !sim.recipeState(game, r).length)
      .sort((a, b) => sim.recipeState(game, a).length - sim.recipeState(game, b).length);
    if (!rs.length) { h.remove(); continue; }
    for (const r of rs) {
      const miss = sim.recipeState(game, r);
      const el = document.createElement('div');
      el.className = 'recipe' + (miss.length ? '' : ' ok');
      const name = r.out ? `${r.out[1] > 1 ? r.out[1] + ' × ' : ''}${ITEMS[r.out[0]].name}` : 'Repair wielded weapon';
      // each line reads "Rag   have 1 / need 2"
      const lis = r.needs.map(([id, n]) => `<li class="${sim.has(inv, id, n) ? 'have' : 'miss'}"><span>${ICONS[id] || ''} ${ITEMS[id].name}</span><span class="q">${Math.min(sim.count(inv, id), 99)} / ${n}</span></li>`).join('')
        + (r.tools || []).map(opts => { const ok = opts.some(id => sim.has(inv, id)); return `<li class="${ok ? 'have' : 'miss'}"><span>Tool: ${opts.map(id => ITEMS[id].name).join(' or ')}</span><span class="q">${ok ? 'have' : 'need'}</span></li>`; }).join('');
      el.innerHTML = `<div class="nm"><span class="ic">${r.out ? ICONS[r.out[0]] || '' : '🩶'}</span>${name}</div><div class="desc">${r.desc || (r.out ? ITEMS[r.out[0]].desc || '' : '')}</div><ul>${lis}</ul>`;
      const b = document.createElement('button');
      b.className = 'btn'; b.textContent = !miss.length ? `Craft · ${r.time}s` : miss.length === 1 ? `Need ${miss[0].replace(/^1 × /, '').toLowerCase()}` : `Need ${miss.length} more things`;
      if (miss.length) b.title = 'Missing: ' + miss.join(', ');
      if (!miss.length) { const can = Math.min(...r.needs.map(([id, n]) => Math.floor(sim.count(inv, id) / n))); el.querySelector('.nm').insertAdjacentHTML('beforeend', `<span class="can">can make ${can}</span>`); }
      b.disabled = miss.length > 0 || !!game.player.action;
      b.onclick = () => { if (sim.craft(game, r)) { closePanel('craft'); } };
      el.appendChild(b);
      box.appendChild(el);
    }
  }
  if (!box.children.length) box.innerHTML = `<div class="empty" style="grid-column:1/-1">Nothing you can make right now. Untick "Only what I can make now" to see what you need.</div>`;
}

const short = g => `${Math.floor(g.t / 1440)}d ${Math.floor((g.t % 1440) / 60)}h`;

// ---------- journal and documents ----------
let jTab = 'docs', jSel = null;
for (const b of $('jTabs').children) b.onclick = () => { jTab = b.dataset.tab; jSel = null; renderJournal(); };
function docHtml(d) {
  return `<div class="paper"><div class="paper-from">${esc(d.from)}</div><h3>${esc(d.title)}</h3><div class="paper-body">${esc(d.body)}</div>${d.note ? `<div class="paper-note">${esc(d.note)}</div>` : ''}</div>`;
}
function radioHtml(day) {
  const b = BROADCASTS[day - 1];
  return `<div class="paper radio"><div class="paper-from">Wind-up radio · day ${day}</div><h3>Dawn broadcasts</h3>
    <div class="seg h"><div class="who">Halcyon Civic Care</div><p>${esc(b.halcyon)}</p></div>
    <div class="seg d"><div class="who">Faraday Free Radio · Dot</div><p>${esc(b.dot)}</p></div></div>`;
}
function guideHtml(type) {
  const f = FIELD_GUIDE[type];
  return `<div class="paper guide"><div class="paper-from">Field guide</div><h3>${esc(ROBOTS[type].name)} · ${esc(f.model)}</h3><div class="paper-body">${esc(f.text)}</div><div class="tip">${esc(f.tip)}</div></div>`;
}
function renderJournal() {
  const j = game.journal;
  const tabs = $('jTabs').children;
  for (const b of tabs) b.classList.toggle('on', b.dataset.tab === jTab);
  tabs[0].innerHTML = `Documents<span class="ct">${j.docs.length}/${DOCS.length}</span>`;
  tabs[1].innerHTML = `Radio<span class="ct">${j.heard.length}/${BROADCASTS.length}</span>`;
  tabs[2].innerHTML = `Field guide<span class="ct">${j.seen.length}/4</span>`;
  const list = $('jList'), read = $('jRead');
  list.innerHTML = '';
  let entries = [];
  if (jTab === 'docs') entries = j.docs.map(id => DOCS.find(d => d.id === id)).filter(Boolean).map(d => ({ key: d.id, label: d.title, sub: d.from, html: () => docHtml(d) }));
  else if (jTab === 'radio') entries = j.heard.slice().sort((a, b) => a - b).map(day => ({ key: day, label: `Day ${day}`, sub: 'Halcyon · Faraday Free Radio', html: () => radioHtml(day) }));
  else entries = Object.keys(FIELD_GUIDE).map(t => j.seen.includes(t)
    ? { key: t, label: ROBOTS[t].name, sub: FIELD_GUIDE[t].model, html: () => guideHtml(t) }
    : { key: t, label: '???', sub: 'Not seen yet', locked: true });
  if (!entries.length) {
    list.innerHTML = `<div class="empty">${jTab === 'docs' ? 'Nothing yet. Search furniture: people left notes.' : jTab === 'radio' ? 'Find a radio and listen at dawn.' : ''}</div>`;
    read.innerHTML = '';
    return;
  }
  if (jSel == null || !entries.some(e => e.key === jSel && !e.locked)) jSel = (entries.find(e => !e.locked) || {}).key;
  for (const e of entries) {
    const el = document.createElement('div');
    el.className = 'je' + (e.key === jSel ? ' on' : '') + (e.locked ? ' locked' : '');
    const unread = jTab === 'docs' && !(game.journal.read || []).includes(e.key);
    el.innerHTML = `${esc(e.label)}${unread ? '<span class="new">NEW</span>' : ''}<small>${esc(e.sub)}</small>`;
    if (!e.locked) el.onclick = () => { jSel = e.key; renderJournal(); };
    list.appendChild(el);
  }
  const cur = entries.find(e => e.key === jSel);
  read.innerHTML = cur && !cur.locked ? cur.html() : '';
  if (cur && jTab === 'docs') markRead(cur.key);
  journalEntries = entries;
}

let journalEntries = [];
function markRead(id) { const j = game.journal; j.read ||= []; if (!j.read.includes(id)) j.read.push(id); updateUnread(); }
function updateUnread() { if (!game) return; const n = game.journal.docs.filter(id => !(game.journal.read || []).includes(id)).length; $('jNew').textContent = n ? ` •${n}` : ''; }
function journalKey(k) {
  if (k === 'arrowleft' || k === 'arrowright') {
    const tabs = ['docs', 'radio', 'guide'];
    jTab = tabs[(tabs.indexOf(jTab) + (k === 'arrowright' ? 1 : 2)) % 3]; jSel = null; renderJournal(); return;
  }
  const open = journalEntries.filter(e => !e.locked);
  if (!open.length) return;
  const at = open.findIndex(e => e.key === jSel);
  jSel = open[Math.max(0, Math.min(open.length - 1, at + (k === 'arrowdown' ? 1 : -1)))].key;
  renderJournal();
  $('jList').querySelector('.je.on')?.scrollIntoView({ block: 'nearest' });
}

// The reader pops up when you find something.
let readerPaused = false;
function showReader(html) {
  const p = $('paper');
  const tmp = document.createElement('div'); tmp.innerHTML = html;
  const src = tmp.firstElementChild;
  p.className = src.className;
  p.innerHTML = src.innerHTML + '<div class="title-btns"><button class="btn" id="rClose">Put it away</button></div>';
  $('rClose').onclick = closeReader;
  $('reader').hidden = false;
  readerPaused = settings.pauseRead && !paused;
  if (readerPaused) paused = true;
}
function closeReader() {
  $('reader').hidden = true;
  if (readerPaused) { paused = false; readerPaused = false; }
}
function showDoc(id) { const d = DOCS.find(d => d.id === id); if (d) { showReader(docHtml(d)); markRead(id); } }
function showRadio(day) { showReader(radioHtml(day)); if (!$('journal').hidden) renderJournal(); }

// ---------- context menu ----------
function showCtx(px, py, acts, title) {
  const m = $('ctx');
  m.innerHTML = `<div class="title">${title}</div>`;
  acts.forEach((a, k) => {
    const b = document.createElement('button');
    b.innerHTML = `${k === 0 && !a.disabled ? '<kbd>E</kbd>' : ''}${a.label}${a.disabled ? `<small>${a.disabled}</small>` : ''}`;
    b.disabled = !!a.disabled && a.id !== 'info';
    if (a.id === 'info') b.disabled = true;
    b.onclick = () => { hideCtx(); doAction(a); };
    m.appendChild(b);
  });
  m.hidden = false;
  const r = m.getBoundingClientRect();
  m.style.left = Math.max(4, Math.min(px, window.innerWidth - r.width - 8)) / UI + 'px';
  m.style.top = Math.max(4, Math.min(py, window.innerHeight - r.height - 8)) / UI + 'px';
}
function hideCtx() { $('ctx').hidden = true; }

function doAction(a) {
  if (!a || a.disabled) return;
  const res = a.run();
  if (res && res.radio) showRadio(res.radio);
  if (res && res.open) {
    lootAt = res.open;
    sim.openContainer(game, lootAt[0], lootAt[1]);
    $('loot').hidden = false; $('inv').hidden = false;
    syncBackdrop();
    refreshPanels();
  }
  if (a.id === 'door') sfx.door();
  if (a.id === 'smash') sfx.glass();
  if (a.id === 'drink') sfx.drink();
}

function tileName(x, y) {
  const w = game.world, i = idx(x, y);
  const c = w.containers.get(i);
  if (c) return c.kind === 'pile' ? 'Items' : c.kind === 'wreck' ? `${ROBOTS[c.robot]?.name || 'Robot'} wreck` : FURNITURE[c.kind]?.name || '';
  return ['', 'Wall', 'Door', 'Window', 'Tree', 'Fence', 'Wall frame', '', 'Bush'][w.struct[i]] || '';
}

// What is drawn under the mouse? Tall things (walls, furniture, cars) are drawn above their
// tile, so test each nearby object's on-screen box and take the one that has something to do
// (furniture first, then front-most). Falls back to the plain floor tile under the mouse.
const OBJ_H = { 1: 50, 2: 50, 3: 50, 4: 60, 5: 20, 6: 50, 7: 22, 8: 18 };
function objHeight(x, y) {
  const w = game.world, i = idx(x, y), st = w.struct[i];
  const c = w.containers.get(i);
  if (c && FURNITURE[c.kind]) return Math.max(10, FURNITURE[c.kind].h || 20);
  if (c) return 10; // a pile or wreck on the floor
  if ((st === 1 || st === 2 || st === 3 || st === 6) && R.isCut(x, y)) return 12; // walls cut away near you are drawn short
  return OBJ_H[st] || 0;
}
function inPoly(px, py, pts) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i], [xj, yj] = pts[j];
    if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
function pickAt(mx, my, anyDistance = false) {
  if (!game) return null;
  const [gx, gy] = R.toWorld(mx, my);
  const z = R.zoom;
  let best = null;
  for (let dy = -1; dy <= 3; dy++) for (let dx = -1; dx <= 3; dx++) {
    const x = Math.floor(gx) + dx, y = Math.floor(gy) + dy;
    if (!inBounds(x, y)) continue;
    const h = objHeight(x, y);
    // the object's real silhouette: base diamond swept up by its height (a hexagon)
    const L = R.toScreen(x, y + 1), B = R.toScreen(x + 1, y + 1), Rt = R.toScreen(x + 1, y), T = R.toScreen(x, y), hz = h * z;
    if (!inPoly(mx, my, [L, B, Rt, [Rt[0], Rt[1] - hz], [T[0], T[1] - hz], [L[0], L[1] - hz]])) continue;
    // a flat tile only counts if the mouse is really on its diamond
    if (!h && !(Math.floor(gx) === x && Math.floor(gy) === y)) continue;
    const acts = sim.actionsAt(game, x, y).filter(a => a.id !== 'info');
    if (!acts.length && !anyDistance) continue;
    // Furniture and piles win over doors and windows: they are small, so if the mouse is on one at
    // all that is what you meant. Otherwise the front-most thing wins.
    const depth = x + y + (game.world.containers.has(idx(x, y)) ? 1000 : 0);
    if (!best || depth > best.depth) best = { x, y, acts, depth };
  }
  return best && best.acts.length ? best : null;
}

// Best thing to interact with: what is under the mouse if it has actions, else the nearest in front.
function interactTarget() {
  if (!game || game.dead) return null;
  const p = game.player;
  const hit = pickAt(mouseX, mouseY);
  if (hit) return hit;
  let best = null, bestScore = 1e9;
  const px = Math.floor(p.x), py = Math.floor(p.y);
  for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
    const x = px + dx, y = py + dy;
    if (!inBounds(x, y)) continue;
    const acts = sim.actionsAt(game, x, y).filter(a => a.id !== 'info');
    if (!acts.length) continue;
    const vx = x + 0.5 - p.x, vy = y + 0.5 - p.y, d = Math.hypot(vx, vy);
    const facing = (vx * Math.cos(p.aim) + vy * Math.sin(p.aim)) / (d || 1);
    const score = d - facing * 0.8;
    if (score < bestScore) { bestScore = score; best = { x, y, acts }; }
  }
  return best;
}

// ---------- input ----------
const keys = new Set();
let mouseX = 0, mouseY = 0;
let mouseTile = null;
const isTyping = () => { const a = document.activeElement; return a && (a.tagName === 'INPUT' && a.type !== 'checkbox' && a.type !== 'range' || a.tagName === 'SELECT'); };

window.addEventListener('keydown', (e) => {
  const k = e.key.toLowerCase();
  if (isTyping() && k !== 'escape') return;
  if (k === 'tab') e.preventDefault();
  initAudio();
  if (!$('reader').hidden) { if (k === 'escape' || k === 'e' || k === ' ') { e.preventDefault(); closeReader(); } return; }
  if (!game) {
    if (k === 'escape') {
      if (CENTER.some(p => !$(p).hidden)) { closePanels(); $('title').hidden || $('titleSettings').focus(); return; }
      if (!$('newlife').hidden || !$('memorial').hidden) showTitle();
    } else if (!$('title').hidden && !CENTER.some(p => !$(p).hidden) && menuKey(k)) e.preventDefault();
    return;
  }
  if (game.dead || game.won) return;
  if (k === 'escape') {
    if (!$('ctx').hidden) { hideCtx(); return; }
    if (placing) { placing = null; R.ghost = null; return; }
    const open = PANELS.filter(p => !$(p).hidden);
    if (open.length) { closePanels(); return; }
    togglePause(!paused);
    return;
  }
  // the journal reads with the arrow keys even when opened from the pause menu
  if (!$('journal').hidden && (k === 'arrowdown' || k === 'arrowup' || k === 'arrowleft' || k === 'arrowright')) { e.preventDefault(); journalKey(k); return; }
  if (!$('map').hidden && (k === '+' || k === '=' || k === '-')) { mapZoom(k === '-' ? 1 / 1.35 : 1.35); return; }
  if (paused) return;
  keys.add(k);
  if (e.repeat) return;
  if (k === 'tab' || k === 'i') { if ($('inv').hidden) openPanel('inv'); else { closePanel('inv'); closePanel('loot'); } }
  else if (k === 'b') { $('craft').hidden ? openPanel('craft') : closePanel('craft'); }
  else if (k === 'j') { $('journal').hidden ? openPanel('journal') : closePanel('journal'); }
  else if (k === 'm') { $('map').hidden ? openPanel('map') : closePanel('map'); }
  else if (k === 'h' || k === 'f1') { e.preventDefault(); $('help').hidden ? openPanel('help') : closePanel('help'); }
  else if (k === 'c') { game.player.sneak = !game.player.sneak; }
  else if (k === 'f') { sim.toggleFlashlight(game); }
  else if (k === 'g') { const [wx, wy] = R.toWorld(mouseX, mouseY); sim.throwItem(game, wx, wy); }
  else if (k === 'e') { const t = interactTarget(); if (t) { const a = t.acts.find(a => !a.disabled); if (a) doAction(a); else sim.log(game, t.acts[0].disabled, 'dim'); } }
  else if (k === ' ') { e.preventDefault(); if (!menuPaused()) sim.attack(game); }
  else if (k === 'q') { if (sim.quickHeal(game)) refreshPanels(); }
  else if (k === 'r' && lootAt && !$('loot').hidden) $('takeAll').click();
});
window.addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()));
window.addEventListener('blur', () => { keys.clear(); if (settings.blurPause && game && !paused && !game.dead && !game.won && $('reader').hidden) togglePause(true); });

canvas.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
canvas.addEventListener('mousedown', (e) => {
  initAudio();
  hideCtx();
  if (!game || paused || game.dead || menuPaused()) return;
  if (e.button === 0) {
    if (placing) {
      const [wx, wy] = R.toWorld(mouseX, mouseY);
      const tx = Math.floor(wx), ty = Math.floor(wy);
      const why = sim.canPlace(game, placing, tx, ty);
      if (why) sim.log(game, why + '.', 'dim');
      else { sim.place(game, placing, tx, ty); placing = null; R.ghost = null; }
      return;
    }
    sim.attack(game);
  }
});
canvas.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  if (!game || paused || game.dead) return;
  if (placing) { placing = null; R.ghost = null; return; }
  const hit = pickAt(e.clientX, e.clientY);
  if (hit) { showCtx(e.clientX, e.clientY, sim.actionsAt(game, hit.x, hit.y), tileName(hit.x, hit.y)); return; }
  // nothing in reach under the mouse: say why instead of doing nothing
  const [wx, wy] = R.toWorld(e.clientX, e.clientY);
  const tx = Math.floor(wx), ty = Math.floor(wy);
  if (inBounds(tx, ty) && tileName(tx, ty) && Math.hypot(tx + 0.5 - game.player.x, ty + 0.5 - game.player.y) > sim.REACH) sim.log(game, `${tileName(tx, ty)}: too far away. Walk up to it.`, 'dim');
});
let zoomSave = null;
canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  R.zoom = Math.max(0.6, Math.min(2.2, R.zoom * (e.deltaY > 0 ? 0.9 : 1.1)));
  settings.zoom = R.zoom; clearTimeout(zoomSave); zoomSave = setTimeout(applySettings, 400);
}, { passive: false });

function readInput() {
  const p = game.player;
  let mx = 0, my = 0;
  const up = keys.has('w') || keys.has('arrowup'), down = keys.has('s') || keys.has('arrowdown');
  const left = keys.has('a') || keys.has('arrowleft'), right = keys.has('d') || keys.has('arrowright');
  // screen directions to world directions (x runs down-right, y down-left)
  if (up) { mx -= 1; my -= 1; }
  if (down) { mx += 1; my += 1; }
  if (left) { mx -= 1; my += 1; }
  if (right) { mx += 1; my -= 1; }
  p.moveX = mx; p.moveY = my;
  p.run = keys.has('shift');
  const [wx, wy] = R.toWorld(mouseX, mouseY + 14 * R.zoom);
  p.aim = Math.atan2(wy - p.y, wx - p.x);
  // hover tile
  const [hx, hy] = R.toWorld(mouseX, mouseY);
  const tx = Math.floor(hx), ty = Math.floor(hy);
  mouseTile = [tx, ty];
  R.mouseScreen = [mouseX, mouseY];
  if (placing) {
    R.hover = null;
    R.ghost = [tx, ty, !sim.canPlace(game, placing, tx, ty)];
  } else R.ghost = null;
}

// ---------- HUD ----------
function logLine(text, kind) {
  const box = $('log');
  const el = document.createElement('div');
  el.className = kind; el.textContent = text;
  box.appendChild(el);
  while (box.children.length > 6) box.firstChild.remove();
  setTimeout(() => { el.style.opacity = '0'; }, 9000);
  setTimeout(() => el.remove(), 10200);
}

function setBar(k, v, low) {
  const el = document.querySelector(`.bar[data-k="${k}"]`);
  el.querySelector('i').style.width = Math.max(0, Math.min(100, v)) + '%';
  el.classList.toggle('low', low);
}

let hudT = 0;
function updateHud(dt) {
  hudT -= dt;
  if (hudT > 0) return;
  hudT = 0.15;
  const p = game.player;
  const d = sim.dateText(game);
  $('hudDay').textContent = `Day ${d.day}`;
  $('hudDate').textContent = d.date; $('hudTime').textContent = d.time;
  const light = sim.daylight(game);
  $('hudWorld').textContent = `${light > 0.6 ? 'Daylight' : light > 0 ? 'Dusk' : 'Night'} · ${game.weather.rain ? 'Rain' : 'Dry'} · Taps ${game.waterOff ? 'dry' : 'running'}`;
  setBar('hp', p.hp, p.hp < 30);
  setBar('hunger', p.hunger, p.hunger < 20);
  setBar('thirst', p.thirst, p.thirst < 20);
  setBar('rest', 100 - p.fatigue, p.fatigue > 80);
  setBar('endurance', p.endurance, p.endurance < 15);
  const chips = [];
  const bleeding = p.wounds.filter(w => !w.bandaged).length;
  // each chip names the fix: a key, or what to look for
  if (bleeding) chips.push(['bad', `Bleeding${bleeding > 1 ? ' ×' + bleeding : ''}`, 'Q to bandage']);
  const banded = p.wounds.filter(w => w.bandaged).length;
  if (banded) chips.push(['warn', `Bandaged ×${banded}`, 'healing']);
  if (p.infected) chips.push(['bad', 'Infected', 'antiseptic · Q']);
  if (p.hunger < 20) chips.push([p.hunger <= 0 ? 'bad' : 'warn', p.hunger <= 0 ? 'Starving' : 'Hungry', 'eat · Tab']);
  if (p.thirst < 20) chips.push([p.thirst <= 0 ? 'bad' : 'warn', p.thirst <= 0 ? 'Dehydrated' : 'Thirsty', 'drink · Tab']);
  if (p.fatigue > 80) chips.push(['warn', 'Exhausted', 'sleep in a bed']);
  if (sim.weight(p.inv) > sim.capacity(game)) chips.push(['warn', 'Overloaded', 'drop things · Tab']);
  if (p.sneak) chips.push(['good', 'Sneaking', 'C']);
  if (p.flashlight) chips.push(['warn', 'Flashlight on', 'F']);
  $('chips').innerHTML = chips.map(([c, t, how]) => `<span class="chip ${c}">${t}<em>${how}</em></span>`).join('');

  // how far your noise carries right now
  const moving = p.moveX || p.moveY;
  const running = p.run && !p.sneak && p.endurance > 3;
  const nz = p.action ? (p.action.noise || 0) : !moving ? 0 : p.sneak ? NOISE.sneak : running ? NOISE.run : NOISE.walk;
  setBar('noise', nz / NOISE.hammer * 100, nz >= NOISE.run);
  $('noiseVal').textContent = nz <= 0 ? 'silent' : `${Math.round(nz * (game.weather.rain ? 0.75 : 1))} tiles`;

  // the way out, once Dot has told you
  const heardPlan = game.journal.heard.some(dd => dd >= 5);
  const obj = $('objective');
  if (heardPlan && !game.won) {
    const left = (7 - 1) * 1440 + 12 * 60 - (sim.START_MINUTE + game.t);
    const when = left > 0 ? `in ${Math.floor(left / 1440) ? Math.floor(left / 1440) + 'd ' : ''}${Math.floor((left % 1440) / 60)}h ${Math.floor(left % 60)}m` : left > -60 ? `NOW, ${Math.ceil(60 + left)} min left` : 'gone';
    obj.hidden = false;
    obj.innerHTML = `<b>Pruitt bus · ${when}</b>North end of Route 9, day 7, noon to 1.${game.journal.heard.some(dd => dd >= 6) ? '<br>Or: reset the node at the Care Depot.' : ''}`;
  } else obj.hidden = true;

  // hand
  const wpn = p.equip.weapon;
  const wd = wpn ? ITEMS[wpn.id] : null;
  const thr = sim.has(p.inv, p.throwId) ? p.throwId : ['tincan', 'noisemaker', 'pulse'].find(t => sim.has(p.inv, t));
  const fl = p.inv.filter(s => s.id === 'flashlight').sort((a, b) => b.charge - a.charge)[0];
  let html = `<div class="slot"><div class="k">Hands · click</div><div class="v">${wd ? wd.name : 'Fists'}${wd?.gun ? ` (${sim.count(p.inv, 'shells')})` : ''}</div>${wpn && wd.dur ? `<div class="dur"><i style="width:${wpn.dur / wd.dur * 100}%"></i></div>` : ''}</div>`;
  html += `<div class="slot"><div class="k">Throw · G</div><div class="v">${thr ? `${ITEMS[thr].name} ×${sim.count(p.inv, thr)}` : '—'}</div></div>`;
  if (fl) html += `<div class="slot"><div class="k">Light · F</div><div class="v">${p.flashlight ? 'On' : 'Off'} · ${Math.round(fl.charge)}%</div><div class="dur"><i style="width:${fl.charge}%;background:#f3e3a0"></i></div></div>`;
  $('hand').innerHTML = html;

  // field guide: the first time you see each kind of robot
  for (const r of game.robots) {
    if (game.journal.seen.includes(r.type) || !R.vis[idx(r.x | 0, r.y | 0)]) continue;
    game.journal.seen.push(r.type);
    sim.log(game, `New field guide entry: ${ROBOTS[r.type].name}. (J)`, 'story');
  }

  // alert line
  const hunted = game.robots.some(r => r.state === 'chase' && r.seeT < 2 && Math.hypot(r.x - p.x, r.y - p.y) < 20);
  const heard = !hunted && game.robots.some(r => r.state === 'investigate' && Math.hypot(r.x - p.x, r.y - p.y) < 14);
  const al = $('alert');
  if (p.sleeping) { al.hidden = false; al.className = 'alert sleep'; al.textContent = 'Sleeping…'; }
  else if (hunted) { al.hidden = false; al.className = 'alert hunted'; al.textContent = 'Hunted'; }
  else if (heard) { al.hidden = false; al.className = 'alert heard'; al.textContent = 'Something heard you'; }
  else if (sim.jammed(game, p.x, p.y)) { al.hidden = false; al.className = 'alert jammed'; al.textContent = 'Jammer cover'; }
  else al.hidden = true;
  if (hunted && !wasHunted) sfx.spotted();
  wasHunted = hunted;

  // prompt
  const t = (!placing && !p.action && !p.sleeping) ? interactTarget() : null;
  if (t) {
    const a = t.acts.find(a => !a.disabled);
    $('prompt').hidden = false;
    $('prompt').innerHTML = a ? `<kbd>E</kbd>${a.label}${t.acts.length > 1 ? ' <span class="no">· right click for more</span>' : ''}` : `<span class="no">${t.acts[0].label}: ${t.acts[0].disabled}</span>`;
    R.hover = [t.x, t.y]; R.hoverOk = !!a; R.hoverH = objHeight(t.x, t.y);
  } else {
    $('prompt').hidden = true;
    if (!placing) R.hover = null;
  }
  if (p.action) { $('prompt').hidden = false; $('prompt').innerHTML = `${p.action.label}… <span class="no">(move to stop)</span>`; }

  // panels follow along
  if (lootAt) {
    if (Math.hypot(lootAt[0] + 0.5 - p.x, lootAt[1] + 0.5 - p.y) > sim.REACH + 0.6 || !sim.containerAt(game, lootAt[0], lootAt[1])) closePanel('loot');
  }
  setAmbient(game.weather.rain, light < 0.2);
}

// ---------- fx from the sim ----------
function drainFx() {
  for (const f of game.fx) {
    switch (f.type) {
      case 'msg': logLine(f.text, f.kind); break;
      case 'hurt': sfx.hurt(); shake(10); break;
      case 'hit': sfx.hit(); R.addEffect({ type: 'hit', x: f.x, y: f.y, dur: 0.3 }); break;
      case 'kill': sfx.kill(); R.addEffect({ type: 'kill', x: f.x, y: f.y, dur: 0.8 }); break;
      case 'swing': sfx.swing(); break;
      case 'bash': if (Math.hypot(f.x - game.player.x, f.y - game.player.y) < 18) { sfx.bash(); R.addEffect({ type: 'bash', x: f.x, y: f.y, dur: 0.3 }); } break;
      case 'door': if (Math.hypot(f.x - game.player.x, f.y - game.player.y) < 12) sfx.door(); break;
      case 'broadcast': sfx.broadcast(); break;
      case 'gunshot': sfx.gunshot(); shake(8); R.addEffect({ type: 'gunshot', x: f.x, y: f.y, a: f.a, dur: 0.15 }); break;
      case 'pulse': sfx.pulse(); R.addEffect({ type: 'pulse', x: f.x, y: f.y, dur: 0.6 }); break;
      case 'clatter': sfx.clatter(); R.addEffect({ type: 'clatter', x: f.x, y: f.y, dur: 0.5 }); break;
      case 'glass': sfx.glass(); R.addEffect({ type: 'glass', x: f.x + 0.5, y: f.y + 0.5, dur: 0.6 }); break;
      case 'work': sfx.hammer(); break;
      case 'eat': sfx.eat(); break;
      case 'drink': sfx.drink(); break;
      case 'death': sfx.death(); onDeath(); break;
      case 'doc': sfx.pickup(); updateUnread(); setTimeout(() => showDoc(f.id), 120); break;
      case 'evac': onWin(); break;
    }
    if (f.type !== 'msg' && f.type !== 'hurt') { /* noop */ }
  }
  const crafted = game.fx.some(f => f.type === 'msg' && f.kind === 'good');
  if (crafted && (!$('inv').hidden || !$('craft').hidden)) refreshPanels();
  game.fx.length = 0;
}

function onDeath() {
  eraseSave();
  closePanels();
  const s = game.stats;
  setTimeout(() => {
    $('deathText').textContent = `${game.cause}. Marrow Creek, ${sim.dateText(game).date}, ${sim.dateText(game).time}.`;
    $('deathStats').innerHTML = `<div><b>${short(game)}</b>survived</div><div><b>${s.kills}</b>robots wrecked</div><div><b>${game.journal.docs.length}/${DOCS.length}</b>documents found</div>`;
    $('epitaph').textContent = `${game.name}, ${OCCUPATIONS.find(o => o.id === game.occupation).name.toLowerCase()}. ` + EPITAPHS[Math.floor(Math.random() * EPITAPHS.length)];
    closeReader();
    seedLine('deathSeed');
    showScreen('death');
  }, 1800);
  addMemorial(game, false);
}
function seedLine(id) {
  const url = `${location.pathname}?seed=${game.seed}`;
  $(id).innerHTML = `County #${game.seed} · <a href="${url}">play this county again</a>`;
}
function onWin() {
  eraseSave();
  closePanels();
  addMemorial(game, true);
  const s = game.stats;
  setTimeout(() => {
    const end = ENDINGS[game.ending] || ENDINGS.bus;
    $('winKicker').textContent = end.kicker;
    $('winTitle').textContent = end.title;
    $('winEpitaph').textContent = end.epitaph;
    $('winText').textContent = end.line(game.name, `${sim.dateText(game).date}, ${sim.dateText(game).time}`);
    $('winStats').innerHTML = `<div><b>${short(game)}</b>in Marrow Creek</div><div><b>${s.kills}</b>robots wrecked</div><div><b>${game.journal.docs.length}/${DOCS.length}</b>documents found</div>`;
    closeReader();
    seedLine('winSeed');
    showScreen('win');
  }, 800);
}

// ---------- loop ----------
let last = performance.now();
let invRefreshT = 0;
function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  if (game) {
    const stopped = paused || menuPaused();
    if (!stopped) {
      readInput();
      const before = game.player.action;
      sim.step(game, dt);
      if (before && !game.player.action) refreshPanels();
      drainFx();
      updateHud(dt);
      updateTips(dt);
      if (settings.radar) drawRadar($('radar'), game, R.vis, dt);
      invRefreshT -= dt;
      if (invRefreshT <= 0 && !$('inv').hidden) { invRefreshT = 1; if (!document.querySelector('#invList:hover, #lootList:hover')) refreshPanels(); }
      if (now - lastSave > 30000) { lastSave = now; save(); }
    } else if (!paused) updateHud(1); // keep the HUD honest while a menu holds the clock
    R.draw(game, stopped ? 0 : dt);
  } else drawBackdrop(dt);
  requestAnimationFrame(frame);
}

// a slow drift over a fresh county behind the title
let backdrop = null;
function drawBackdrop(dt) {
  if (!backdrop) {
    backdrop = sim.newGame(20341003, { noRobots: false });
    backdrop.world.explored.fill(1);
    backdrop.backdrop = true;
    backdrop.t = 60 * 11;
  }
  const p = backdrop.player;
  p.x += dt * 0.6; p.y -= dt * 0.25;
  if (p.x > 95) { p.x = 20; p.y = 60; }
  backdrop.player.sleeping = false;
  R.draw(backdrop, dt);
}

window.addEventListener('beforeunload', save);
document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });

showTitle();
requestAnimationFrame(frame);

// for the browser test
window.__faraday = { get game() { return game; }, sim, R, FURNITURE };
void W;
