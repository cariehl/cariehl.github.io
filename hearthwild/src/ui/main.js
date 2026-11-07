// Browser entry: boots a game, runs the frame loop, and turns input into commands.
import { Game, SPEEDS } from '../game/game.js';
import { Renderer } from '../render/renderer.js';
import { Panels, entName, setHTML } from './panels.js';
import { computeAlerts } from '../game/alerts.js';
import { fmtTime } from '../sim/systems/time.js';
import { line, offsetToAxial } from '../sim/core/hex.js';
import { DESIG } from '../sim/world/world.js';
import { airTemp } from '../sim/systems/environment.js';

const $ = (s) => document.querySelector(s);
const SAVE_KEY = 'hearthwild.save.v1';

const TOOLS = {
  orders: [
    { id: 'chop', label: 'Chop', tip: 'Fell trees and shrubs for logs and branches', type: 'desig' },
    { id: 'gather', label: 'Gather', tip: 'Pick berries, nuts, fibre, branches and roots; the mark clears once a plant is picked clean', type: 'desig' },
    { id: 'mine', label: 'Quarry', tip: 'Break rock outcrops into stone (needs a hammerstone or pick)', type: 'desig' },
    { id: 'clear', label: 'Clear', tip: 'Remove any plant', type: 'desig' },
    { id: 'fish', label: 'Fish', tip: 'Fish here (needs a fishing line)', type: 'desig' },
    { id: 'cancel', label: 'Cancel', tip: 'Remove orders and plans', type: 'desig' },
  ],
  zones: [
    { id: 'stockpile', label: 'Stockpile', tip: 'Where hauled items are stored', type: 'zone' },
    { id: 'farm', label: 'Farm', tip: 'Tilled and sown with a crop in spring', type: 'zone' },
    { id: 'unzone', label: 'Unzone', tip: 'Remove zones', type: 'unzone' },
  ],
};

class UI {
  constructor() {
    this.cv = $('#view');
    this.tool = null; this.drag = null; this.keys = new Set();
    this.lastFrame = performance.now(); this.panelT = 0; this.miniT = 0;
    this.toastSeen = 0;
  }

  start(game) {
    this.game = game;
    if (this.renderer) { this.renderer.game = game; this.renderer.colors = null; this.renderer.selected = null; }
    else { this.renderer = new Renderer(this.cv, game); this.panels = new Panels(this); this.bind(); }
    this.renderer.resize();
    const home = game.sim.homeCenter >= 0 ? game.sim.homeCenter : (game.sim.world.N >> 1);
    this.renderer.centerOn(home);
    game.sim.run(5); // reveal around settlers
    this.buildToolbar();
    game.sim.events.on('*', (d, type) => this.onEvent(d, type));
    game.onSettlerDied = (d) => this.toast(`${d.name} has died (${d.cause}).`);
    this.setSpeed(1);
    if (!this.looping) { this.looping = true; requestAnimationFrame(() => this.frame()); }
  }

  frame() {
    const now = performance.now(), dt = Math.min(0.25, (now - this.lastFrame) / 1000); this.lastFrame = now;
    this.game.advance(dt);
    this.panKeys(dt);
    this.renderer.draw();
    this.panelT -= dt; this.miniT -= dt;
    if (this.panelT <= 0) { this.panelT = 0.25; this.updatePanels(); }
    if (this.miniT <= 0) { this.miniT = 1; this.renderer.drawMinimap($('#minimap')); }
    requestAnimationFrame(() => this.frame());
  }

  updatePanels() {
    const s = this.game.sim, t = s.t, W = s.weather;
    $('#clock').innerHTML = `<b>${t.seasonName}</b> ${t.dayOfSeason}, year ${t.year} · ${fmtTime(t)}`;
    const home = s.homeCenter >= 0 ? s.homeCenter : 0;
    const windDir = ['E', 'SE', 'S', 'SW', 'W', 'NW', 'N', 'NE'][Math.round(((W.windDir % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) / (Math.PI / 4)) % 8];
    $('#weather').innerHTML = `${W.desc} · <b>${airTemp(s, home).toFixed(1)} °C</b> · wind ${W.wind.toFixed(1)} m/s ${windDir}${W.precip > 0 ? ` · ${W.precip.toFixed(1)} mm/h` : ''}`;
    this.panels.colonists($('#colonists'));
    this.panels.inspector($('#inspector'));
    const alerts = computeAlerts(s).slice(0, 6);
    setHTML($('#alerts'), alerts.map(a => `<div class="alert l${a.level}" data-id="${a.id ?? ''}" data-i="${a.i ?? ''}">${a.text}</div>`).join(''));
    // the build menu is static; craft and work redraw when something changes
    if (this.drawer && !['build', 'craft', 'work'].includes(this.drawer)) setHTML($('#drawer'), this.panels.drawerHtml(this.drawer));
  }

  // ---------- toolbar and drawers
  buildToolbar() {
    const s = this.game.sim;
    const builds = s.defs.all('structure');
    const grp = (items) => `<div class="grp">${items.join('')}</div>`;
    const b = (id, label, tip) => `<button data-tool="${id}" title="${tip || ''}">${label}</button>`;
    $('#toolbar').innerHTML =
      grp(TOOLS.orders.map(t => b('desig:' + t.id, t.label, t.tip)) .concat([`<button data-tool="huntmode" title="Click animals to mark them for hunting">Hunt</button>`])) +
      grp([`<button data-open="build">Build ▴</button>`]) +
      grp(TOOLS.zones.map(t => b(t.type + ':' + t.id, t.label, t.tip))) +
      grp([`<button data-open="craft">Craft</button>`, `<button data-open="work">Work</button>`, `<button data-open="goals">Goals</button>`, `<button data-open="chronicle">Chronicle</button>`]) +
      grp([`<button data-toggle="roofs" class="${this.renderer.showRoofs ? 'on' : ''}" title="Show roofs (R)">Roofs</button>`, `<button data-toggle="moist" title="Soil moisture overlay">Moisture</button>`]);
    this.buildMenu = builds.map(d => `<button data-tool="build:${d.id}" title="${d.name}">${d.name}<small>${d.cost.map(c => `${c.qty} ${c.item ? s.defs.must('item', c.item).plural || c.item : c.tag}`).join(', ')} · ${Math.round(d.work / 60)} min</small></button>`).join('')
      + `<button data-tool="cancelBuild:">Cancel plans<small>Refunds delivered materials</small></button><button data-tool="deconstruct:">Demolish<small>Remove built things</small></button>`;
  }

  openDrawer(kind) {
    const el = $('#drawer');
    if (this.drawer === kind) { this.drawer = null; el.hidden = true; this.markToolbar(); return; }
    this.drawer = kind; el.hidden = false;
    // sit just above the toolbar, however many rows it wraps to
    el.style.bottom = ($('#toolbar').offsetHeight + 14) + 'px';
    el._html = null;
    el.innerHTML = kind === 'build' ? `<h3>Build</h3><div class="muted" style="margin-bottom:6px">Drag to draw walls and roofs. Materials come from stockpiles or straight from plants.</div><div class="opts">${this.buildMenu}</div>` : this.panels.drawerHtml(kind);
    this.markToolbar();
  }
  refreshDrawer() { if (this.drawer && this.drawer !== 'build') setHTML($('#drawer'), this.panels.drawerHtml(this.drawer)); }

  setTool(t) {
    this.tool = this.tool === t ? null : t;
    if (this.tool && this.drawer === 'build' && !this.tool.startsWith('build') && !this.tool.startsWith('cancelBuild') && !this.tool.startsWith('deconstruct')) this.openDrawer('build');
    this.markToolbar();
    const hint = $('#hint');
    if (this.tool) { hint.style.display = 'block'; hint.textContent = toolHint(this.tool, this.game.sim) + ' · right-click or Esc to stop'; }
    else hint.style.display = 'none';
  }
  markToolbar() {
    document.querySelectorAll('[data-tool]').forEach(b => b.classList.toggle('on', b.dataset.tool === this.tool));
    document.querySelectorAll('[data-open]').forEach(b => b.classList.toggle('on', b.dataset.open === this.drawer));
  }

  setSpeed(k) {
    this.game.speed = k;
    document.querySelectorAll('#speeds button').forEach(b => b.classList.toggle('on', Number(b.dataset.speed) === k));
  }

  select(ent) {
    this.renderer.selected = ent;
    if (ent && ent.kind === 'settler' && !['needs', 'body', 'health', 'mind', 'skills', 'gear', 'work'].includes(this.panels.tab)) this.panels.tab = 'needs';
    this.updatePanels();
  }

  // ---------- input
  bind() {
    window.addEventListener('resize', () => this.renderer.resize());
    const cv = this.cv;
    cv.addEventListener('contextmenu', e => e.preventDefault());
    cv.addEventListener('wheel', e => {
      e.preventDefault();
      const r = this.renderer, before = this.screenToWorld(e.offsetX, e.offsetY);
      r.cam.zoom = Math.max(0.35, Math.min(4, r.cam.zoom * Math.exp(-e.deltaY * 0.0015)));
      const after = this.screenToWorld(e.offsetX, e.offsetY);
      r.cam.x += before[0] - after[0]; r.cam.y += before[1] - after[1];
    }, { passive: false });
    let down = null;
    cv.addEventListener('pointerdown', e => {
      cv.setPointerCapture(e.pointerId);
      down = { x: e.offsetX, y: e.offsetY, btn: e.button, moved: false, cam: { ...this.renderer.cam }, tile: this.renderer.pick(e.offsetX, e.offsetY) };
      if (e.button === 0 && this.tool && this.tool !== 'huntmode') this.drag = { from: down.tile, to: down.tile };
    });
    cv.addEventListener('pointermove', e => {
      const r = this.renderer;
      r.hover = r.pick(e.offsetX, e.offsetY);
      if (!down) return;
      const dx = e.offsetX - down.x, dy = e.offsetY - down.y;
      if (Math.abs(dx) + Math.abs(dy) > 6) down.moved = true;
      if (this.drag) { this.drag.to = r.hover; r.selection = new Set(this.dragTiles()); return; }
      if (down.moved && (down.btn === 0 || down.btn === 1 || down.btn === 2)) { r.cam.x = down.cam.x - dx / r.cam.zoom; r.cam.y = down.cam.y - dy / r.cam.zoom; }
    });
    cv.addEventListener('pointerup', e => {
      const r = this.renderer, d = down; down = null;
      if (!d) return;
      if (this.drag) { this.applyTool(this.dragTiles()); this.drag = null; r.selection = new Set(); return; }
      if (d.moved) return;
      const i = r.pick(e.offsetX, e.offsetY);
      if (d.btn === 2) {
        if (this.tool) { this.setTool(null); return; }
        const sel = r.selected;
        if (sel && sel.kind === 'settler' && i >= 0) { const res = this.game.sim.command('order', { id: sel.id, i, run: e.shiftKey }); if (!res.ok) this.toast(res.err); }
        return;
      }
      if (d.btn !== 0 || i < 0) return;
      if (this.tool === 'huntmode') {
        const a = [...this.game.sim.ents.at(i), ...this.game.sim.world.neighbors(i).flatMap(j => [...this.game.sim.ents.at(j)])].find(x => x.kind === 'animal');
        if (a) { this.game.sim.command('hunt', { id: a.id, on: !a.hunt }); this.toast(`${a.hunt ? 'Hunting' : 'No longer hunting'} the ${entName(this.game.sim, a)}.`); }
        return;
      }
      this.clickTile(i);
    });
    window.addEventListener('keydown', e => {
      if (e.target.tagName === 'INPUT') return;
      const k = e.key.toLowerCase();
      if (k === ' ') { e.preventDefault(); this.setSpeed(this.game.speed ? 0 : (this.prevSpeed || 1)); if (this.game.speed === 0) this.prevSpeed = 1; return; }
      if (k >= '1' && k <= '4') { this.prevSpeed = Number(k); this.setSpeed(Number(k)); return; }
      if (k === 'escape') { if (this.tool) this.setTool(null); else if (this.drawer) this.openDrawer(this.drawer); else this.select(null); return; }
      if (k === 'r') { this.renderer.showRoofs = !this.renderer.showRoofs; this.buildToolbar(); return; }
      if (k === 'c' && this.game.sim.homeCenter >= 0) { this.renderer.centerOn(this.game.sim.homeCenter); return; }
      this.keys.add(k);
    });
    window.addEventListener('keyup', e => this.keys.delete(e.key.toLowerCase()));
    document.addEventListener('pointerdown', e => { setHTML.pressed = e.target; }, true);
    document.addEventListener('pointerup', () => setTimeout(() => { setHTML.pressed = null; }, 0), true);
    document.addEventListener('click', e => this.onClick(e));
    document.addEventListener('change', e => this.onChange(e));
    $('#minimap').addEventListener('click', e => { const r = e.target.getBoundingClientRect(); this.renderer.minimapToCam((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height); });
  }

  screenToWorld(sx, sy) { const r = this.renderer; return [(sx - r.W / 2) / r.cam.zoom + r.cam.x, (sy - r.H / 2) / r.cam.zoom + r.cam.y]; }

  panKeys(dt) {
    const r = this.renderer, sp = 600 * dt / r.cam.zoom;
    if (this.keys.has('w') || this.keys.has('arrowup')) r.cam.y -= sp;
    if (this.keys.has('s') || this.keys.has('arrowdown')) r.cam.y += sp;
    if (this.keys.has('a') || this.keys.has('arrowleft')) r.cam.x -= sp;
    if (this.keys.has('d') || this.keys.has('arrowright')) r.cam.x += sp;
  }

  dragTiles() {
    const d = this.drag, w = this.game.sim.world; if (!d || d.from < 0 || d.to < 0) return [];
    const kind = this.tool.split(':')[1];
    const def = this.tool.startsWith('build:') ? this.game.sim.defs.get('structure', kind) : null;
    if (def && def.type === 'building') return [d.to];
    if (def && (def.type === 'wall' || def.type === 'door')) return line(w.q[d.from], w.r[d.from], w.q[d.to], w.r[d.to]).map(([q, r]) => w.idx(q, r)).filter(i => i >= 0);
    const c0 = Math.min(w.col(d.from), w.col(d.to)), c1 = Math.max(w.col(d.from), w.col(d.to));
    const r0 = Math.min(w.row(d.from), w.row(d.to)), r1 = Math.max(w.row(d.from), w.row(d.to));
    if ((c1 - c0 + 1) * (r1 - r0 + 1) > 4000) return [d.to];
    const out = []; for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) out.push(r * w.W + c);
    return out;
  }

  applyTool(tiles) {
    if (!tiles.length) return;
    const s = this.game.sim, [type, id] = this.tool.split(':');
    let res;
    if (type === 'desig') res = s.command('designate', { kind: id, tiles });
    if (type === 'desig' && id === 'cancel') { s.command('cancelBuild', { tiles }); }
    if (type === 'build') res = s.command('build', { def: id, tiles });
    if (type === 'zone') res = s.command('zone', { type: id, tiles });
    if (type === 'unzone') res = s.command('unzone', { tiles });
    if (type === 'cancelBuild') res = s.command('cancelBuild', { tiles });
    if (type === 'deconstruct') res = s.command('deconstruct', { tiles });
    if (res && !res.ok) this.toast(res.err);
    else if (res && res.count === 0 && type === 'desig' && id !== 'cancel') this.toast(`Nothing there to ${id}.`);
  }

  // Clicking a hex selects what stands on it; clicking the same hex again steps through everything there
  // and then the hex itself, so the ground under a settler can always be inspected.
  clickTile(i) {
    const s = this.game.sim, cur = this.renderer.selected;
    const rank = { settler: 0, animal: 1, building: 2 };
    // someone walking out of this hex is still drawn over it for the first half of the step
    const leaving = s.world.neighbors(i).flatMap(j => [...s.ents.at(j)]).filter(e => e.mv?.from === i && e.mv.prog < (e.mv.cost || 1) / 2);
    const here = [...s.ents.at(i), ...leaving].filter(e => rank[e.kind] !== undefined).sort((a, b) => rank[a.kind] - rank[b.kind]);
    const options = [...here, { kind: 'tile', i }];
    const at = cur ? options.findIndex(o => o.kind === 'tile' ? cur.kind === 'tile' && cur.i === i : o === cur) : -1;
    this.select(options[(at + 1) % options.length]);
  }

  onClick(e) {
    const t = e.target.closest('button, .card, .alert');
    if (!t) return;
    const s = this.game.sim, ds = t.dataset;
    if (t.classList.contains('card') && ds.id) { const ent = s.ents.get(Number(ds.id)); if (ent) { this.select(ent); if (e.detail === 2) this.renderer.centerOn(ent.i); } return; }
    if (t.classList.contains('alert')) { const ent = ds.id ? s.ents.get(Number(ds.id)) : null; if (ent) { this.select(ent); this.renderer.centerOn(ent.i); } else if (ds.i) this.renderer.centerOn(Number(ds.i)); return; }
    if (ds.speed !== undefined) { this.setSpeed(Number(ds.speed)); return; }
    if (ds.tool !== undefined) { this.setTool(ds.tool); return; }
    if (ds.open) { this.openDrawer(ds.open); return; }
    if (ds.toggle === 'roofs') { this.renderer.showRoofs = !this.renderer.showRoofs; t.classList.toggle('on'); return; }
    if (ds.toggle === 'moist') { this.renderer.overlay = this.renderer.overlay === 'moist' ? null : 'moist'; t.classList.toggle('on'); return; }
    if (ds.tab) { this.panels.tab = ds.tab; this.updatePanels(); return; }
    const sel = this.renderer.selected;
    switch (ds.act) {
      case 'close': this.select(null); break;
      case 'pick': this.select(s.ents.get(Number(ds.id))); break;
      case 'hunt': s.command('hunt', { id: sel.id, on: !sel.hunt }); break;
      case 'keepLit': s.command('keepLit', { id: sel.id, on: sel.keepLit === false }); break;
      case 'forbid': { const it = s.ents.get(Number(ds.id)); if (it) s.command('forbid', { id: it.id, on: !it.forbidden }); break; }
      case 'orderClear': s.command('orderClear', { id: sel.id }); break;
      case 'wear': { const r = s.command('wear', { id: sel.id, item: ds.item }); if (!r.ok) this.toast(r.err); break; }
      case 'prio': { const ent = s.ents.get(Number(ds.id)); const v = ent.agent.prio[ds.labor] ?? 2; s.command('prio', { id: ent.id, labor: ds.labor, value: v === 0 ? 1 : v === 4 ? 0 : v + 1 }); this.refreshDrawer(); break; }
      case 'allow': { const z = s.zones.get(Number(ds.id)); const allow = z.allow.includes(ds.cat) ? z.allow.filter(c => c !== ds.cat) : [...z.allow, ds.cat]; s.command('zoneSet', { id: z.id, allow }); break; }
      case 'bill': { const r = e.ctrlKey || e.metaKey ? s.command('bill', { recipe: ds.recipe, mode: 'until', n: 10 }) : s.command('bill', { recipe: ds.recipe, mode: 'count', n: e.shiftKey ? 5 : 1 }); if (r.ok) this.toast(`Bill added: ${s.defs.must('recipe', ds.recipe).name}`); this.refreshDrawer(); break; }
      case 'billPause': { const b = s.bills.find(x => x.id === Number(ds.id)); s.command('billSet', { id: b.id, paused: !b.paused }); this.refreshDrawer(); break; }
      case 'billRemove': s.command('billSet', { id: Number(ds.id), remove: true }); this.refreshDrawer(); break;
      case 'drawer': this.openDrawer(ds.drawer); break;
    }
    this.updatePanels();
  }

  onChange(e) {
    const t = e.target, s = this.game.sim;
    if (t.dataset.act === 'crop') { s.command('zoneSet', { id: Number(t.dataset.id), crop: t.value }); t.blur(); }
  }

  onEvent(d, type) {
    const s = this.game.sim;
    const msg = {
      goal: () => `Milestone reached: ${d.text}`,
      incident: () => d.text,
      joined: () => `${d.name} has joined the camp.`,
      breakdown: () => `${s.ents.get(d.id)?.name.split(' ')[0]} has had a mental break.`,
      contracted: () => `${s.ents.get(d.id)?.name.split(' ')[0]} has come down with ${s.defs.must('condition', d.cond).name}.`,
      wildfire: () => this.lastFireToast && s.tick - this.lastFireToast < 3600 ? null : (this.lastFireToast = s.tick, 'Wildfire!'),
    }[type];
    if (msg) { const m = msg(); if (m) this.toast(m); }
    if (type === 'goal' || type === 'crafted') this.refreshDrawer();
  }

  toast(text) {
    const el = document.createElement('div'); el.textContent = text; $('#toast').appendChild(el);
    setTimeout(() => el.remove(), 5200);
  }
}

function toolHint(tool, s) {
  const [type, id] = tool.split(':');
  if (type === 'desig') return TOOLS.orders.find(t => t.id === id).tip + ' · drag an area';
  if (type === 'build') { const d = s.defs.must('structure', id); return `${d.name}: ${d.type === 'wall' || d.type === 'door' ? 'drag a line' : d.type === 'roof' ? 'drag an area inside walls' : 'click a hex'}`; }
  if (type === 'zone') return TOOLS.zones.find(t => t.id === id).tip + ' · drag an area';
  if (type === 'huntmode') return 'Click animals to mark them for hunting';
  return 'Drag an area';
}

// ---------- saving: gzip when the browser supports it
async function saveGame(game) {
  const json = JSON.stringify(game.save());
  try {
    if (typeof CompressionStream !== 'undefined') {
      const stream = new Blob([json]).stream().pipeThrough(new CompressionStream('gzip'));
      const buf = new Uint8Array(await new Response(stream).arrayBuffer());
      let s = ''; for (let k = 0; k < buf.length; k += 0x8000) s += String.fromCharCode.apply(null, buf.subarray(k, k + 0x8000));
      localStorage.setItem(SAVE_KEY, 'gz:' + btoa(s));
    } else localStorage.setItem(SAVE_KEY, json);
    return true;
  } catch (err) { console.warn('save failed', err); return false; }
}
async function loadSaved() {
  let raw = null; try { raw = localStorage.getItem(SAVE_KEY); } catch { return null; }
  if (!raw) return null;
  try {
    if (raw.startsWith('gz:')) {
      const bin = atob(raw.slice(3)), buf = new Uint8Array(bin.length); for (let k = 0; k < bin.length; k++) buf[k] = bin.charCodeAt(k);
      const stream = new Blob([buf]).stream().pipeThrough(new DecompressionStream('gzip'));
      return JSON.parse(await new Response(stream).text());
    }
    return JSON.parse(raw);
  } catch (err) { console.warn('load failed', err); return null; }
}
const hasSave = () => { try { return !!localStorage.getItem(SAVE_KEY); } catch { return false; } };

// ---------- intro and menu
const ui = new UI();
window.__hw = ui;

function showIntro() {
  const ov = $('#overlay'); ov.hidden = false;
  const seed = Math.floor(Math.random() * 1e6);
  ov.innerHTML = `<div class="dialog">
    <h1>Hearthwild</h1>
    <p>Three people and a handcart, late in a cold spring, at the mouth of a valley no one has farmed. There is timber, water and game, and about one season before the weather turns.</p>
    <p>You do not control them directly. You mark trees to fell and plants to gather, plan buildings, paint stockpiles and fields, and set who does what. They decide when to eat, drink, sleep and warm up, and they get hungry, cold, wet, sick, hurt and sad on their own. Everything is simulated, and you can inspect all of it: click anyone or anything.</p>
    <div class="row">Valley seed <input id="seed" value="${seed}"> <button class="btn on" id="go">Start a new settlement</button> ${hasSave() ? '<button class="btn" id="cont">Continue saved game</button>' : ''}</div>
    <div class="sect" style="margin-top:16px">Controls</div>
    <div class="keys"><div><b>Drag</b> pan · <b>wheel</b> zoom</div><div><b>Click</b> inspect · <b>right-click</b> send selected settler</div><div><b>Space</b> pause · <b>1–4</b> speed</div><div><b>WASD</b> pan · <b>C</b> camp · <b>R</b> roofs</div><div><b>Esc</b> cancel tool</div><div>Tools are on the bar at the bottom</div></div>
  </div>`;
  $('#go').onclick = () => { const v = $('#seed').value.trim(); ov.hidden = true; const g = Game.newGame(/^\d+$/.test(v) ? Number(v) : v || 1); ui.start(g); ui.toast('Mark some branches to gather or trees to chop, and the first fire will follow.'); };
  const c = $('#cont'); if (c) c.onclick = async () => { const data = await loadSaved(); if (!data) { ui.toast?.('Could not read the save.'); return; } ov.hidden = true; ui.start(Game.load(data)); };
}

function showMenu() {
  const ov = $('#overlay'); ov.hidden = false;
  const prev = ui.game.speed; ui.setSpeed(0);
  ov.innerHTML = `<div class="dialog"><h1 style="font-size:34px">Paused</h1>
    <div class="row"><button class="btn on" id="resume">Resume</button><button class="btn" id="save">Save</button><button class="btn" id="load" ${hasSave() ? '' : 'disabled'}>Load</button><button class="btn" id="new">New game</button></div>
    <p class="muted" style="font-size:13px">The game also saves itself every dawn. Saves live in this browser only.</p></div>`;
  $('#resume').onclick = () => { ov.hidden = true; ui.setSpeed(prev || 1); };
  $('#save').onclick = async () => { const ok = await saveGame(ui.game); ui.toast(ok ? 'Saved.' : 'Saving failed (storage full?)'); ov.hidden = true; ui.setSpeed(prev || 1); };
  $('#load').onclick = async () => { const d = await loadSaved(); if (d) { ov.hidden = true; ui.start(Game.load(d)); } };
  $('#new').onclick = () => showIntro();
}

$('#menuBtn').onclick = () => showMenu();
setInterval(() => { if (ui.game && ui.game.sim.t.hour > 6 && ui.game.sim.t.hour < 6.5 && ui.lastAutosave !== ui.game.sim.t.day) { ui.lastAutosave = ui.game.sim.t.day; saveGame(ui.game); } }, 2000);

// A game runs behind the intro so the valley is visible.
ui.start(Game.newGame(Math.floor(Math.random() * 1e6)));
ui.setSpeed(0);
showIntro();
