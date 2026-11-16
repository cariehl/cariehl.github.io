// The simulation: player, robots, time, noise, survival, items and actions. No DOM, so it
// runs under Node for tests. One simulated second is one game minute.
import { makeRng } from './rng.js';
import { ITEMS, FURNITURE, LOOT, RECIPES, ROBOTS, NOISE, PLANK_HP, BWALL_HP, DOOR_HP } from './data.js';
import {
  W, H, S, G, idx, inBounds, createWorld, blocksMove, MOVE_PLAYER, MOVE_WALK, MOVE_FLY,
  isIndoors, addContainer, buildingAt,
} from './world.js';
import { findPath, tileCost } from './path.js';
import { lineOfSight } from './fov.js';
import { DOCS, BROADCASTS, EVAC, OCCUPATIONS } from './lore.js';

export const START_MINUTE = 8 * 60;          // day 1 starts at 08:00
export const START_DATE = Date.UTC(2034, 9, 3); // Tuesday 3 October 2034
export const REACH = 1.75;
const PLAYER_R = 0.28, ROBOT_R = 0.3;
const JAM_RADIUS = 7;

// ---------- setup ----------

// Difficulty: how many robots, how big the night sweep, how fast you get hungry, how hard they hit.
export const DIFFICULTY = {
  calm:   { name: 'Calm',   pop: 0.7,  sweep: 0.6, needs: 0.75, dmg: 0.75, blurb: 'Fewer robots, gentler nights, slower hunger. For learning the county.' },
  normal: { name: 'Normal', pop: 1,    sweep: 1,   needs: 1,    dmg: 1,    blurb: 'The county as it is.' },
  hard:   { name: 'Hard',   pop: 1.25, sweep: 1.4, needs: 1.15, dmg: 1.25, blurb: 'More robots, bigger sweeps, they hit harder. Good luck.' },
};
const diff = g => DIFFICULTY[g.difficulty] || DIFFICULTY.normal;

export function newGame(seed = (Math.random() * 2 ** 31) | 0, opts = {}) {
  const world = createWorld(seed);
  const rng = makeRng(seed ^ 0x5bd1e995);
  const g = {
    seed, world, rng,
    t: 0,
    player: {
      x: world.start.x, y: world.start.y, face: Math.PI / 4,
      hp: 100, hunger: 82, thirst: 78, fatigue: 18, endurance: 100,
      wounds: [], infected: false, infection: 0,
      inv: [], equip: { weapon: null, body: null, back: null },
      throwId: 'tincan', flashlight: false, sneak: false,
      moveX: 0, moveY: 0, run: false, aim: 0,
      action: null, sleeping: false, attackCd: 0, noiseT: 0,
      lastHurt: null, hitFlash: 0, swing: 0,
    },
    robots: [], nextRobotId: 1,
    noises: [], effects: [], thrown: [], decoys: [],
    weather: { rain: false, until: 60 * 5 },
    waterOffAt: (1 + rng.int(1, 3)) * 1440 + rng.int(-6, 8) * 60,
    waterOff: false,
    spawnT: 30, sweepDay: 0,
    stats: { kills: 0, crafted: 0, searched: 0 },
    messages: [],
    dead: false, cause: null, won: false,
    name: opts.name || 'You',
    occupation: (OCCUPATIONS.find(o => o.id === opts.occupation) || OCCUPATIONS[OCCUPATIONS.length - 1]).id,
    journal: { docs: [], heard: [], seen: [] },
    difficulty: DIFFICULTY[opts.difficulty] ? opts.difficulty : 'normal',
    heardAt: null, pins: [],
    fx: [], // transient events for the renderer/UI: {type, ...}
  };
  // Starting kit: the clothes you stood up in.
  addItem(g.player.inv, 'granola', 1);
  addItem(g.player.inv, 'water', 1);
  const occ = OCCUPATIONS.find(o => o.id === g.occupation);
  g.player.perks = { ...occ.perks };
  for (const [id, n] of occ.kit) addItem(g.player.inv, id, n);
  for (const id of occ.equip || []) {
    const st = g.player.inv.find(s => s.id === id);
    const slot = ITEMS[id].cat === 'weapon' ? 'weapon' : ITEMS[id].slot;
    if (st && slot) g.player.equip[slot] = st;
  }
  if (!opts.noRobots) spawnInitial(g);
  seedStartHouse(g);
  seedLore(g);
  log(g, 'Tuesday, 3 October 2034. Six days since the Quiet. The food has run out.', 'story');
  log(g, 'Search the house. Find something to swing. Keep quiet.', 'hint');
  return g;
}

// The house you start in has what you need to get through the first night, if you look.
function seedStartHouse(g) {
  const w = g.world, home = w.start.building;
  const mine = [...w.containers].filter(([k, c]) => w.room[k] === home + 1 && LOOT[c.table]?.rolls[1] > 0);
  if (!mine.length) return;
  for (const [k] of mine) openContainer(g, k % W, Math.floor(k / W));
  const pick = () => g.rng.pick(mine)[1].items;
  const kitchen = mine.find(([, c]) => c.kind === 'counter');
  addItem(kitchen ? kitchen[1].items : pick(), 'knife', 1, { dur: 34 });
  const tools = pick();
  addItem(tools, 'hammer', 1, { dur: 50 });
  addItem(tools, 'nails', 9);
  addItem(pick(), 'plank', 2);
  addItem(pick(), 'rag', 2);
  addItem(pick(), 'radio', 1);
  g.stats.searched = 0;
}

export function perk(g, k, dflt = 1) { const v = g.player.perks?.[k]; return v == null ? dflt : v; }

// Hide the county's documents in furniture: the start house gets its own, the rest go
// where they belong (the sheriff's log in the sheriff's office, and so on).
function seedLore(g) {
  const w = g.world, home = w.start.building;
  const used = new Set();
  // only furniture you can actually search (not toilets, nodes or transmitters)
  const all = [...w.containers].filter(([k, c]) => w.room[k] && FURNITURE[c.kind] && !FURNITURE[c.kind].placed && c.kind !== 'car' && c.table !== 'none' && (FURNITURE[c.kind].loot || 'none') !== 'none');
  for (const d of DOCS) {
    const fits = ([k]) => {
      if (used.has(k)) return false;
      const b = w.buildings[w.room[k] - 1];
      if (d.where.includes('start')) return b.id === home;
      if (b.id === home) return false;
      return d.where.includes(b.type) || d.where.includes(b.store) || (d.where.includes('store') && b.type === 'store');
    };
    let cands = all.filter(fits);
    if (!cands.length) cands = all.filter(([k]) => !used.has(k) && w.buildings[w.room[k] - 1].type === 'house' && w.buildings[w.room[k] - 1].id !== home);
    if (!cands.length) continue;
    const [k, c] = g.rng.pick(cands);
    c.doc = d.id; used.add(k);
  }
}

export function log(g, text, kind = 'info') {
  g.messages.push({ text, kind, t: g.t });
  if (g.messages.length > 60) g.messages.shift();
  g.fx.push({ type: 'msg', text, kind });
}

// ---------- time ----------

export function clock(g) {
  const m = START_MINUTE + g.t;
  return { day: Math.floor(m / 1440) + 1, hour: Math.floor(m / 60) % 24, minute: Math.floor(m % 60), minuteOfDay: m % 1440 };
}
export function dateText(g) {
  const c = clock(g);
  const d = new Date(START_DATE + (c.day - 1) * 86400000);
  const wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getUTCDay()];
  const mo = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getUTCMonth()];
  return { day: c.day, date: `${wd} ${d.getUTCDate()} ${mo} 2034`, time: `${String(c.hour).padStart(2, '0')}:${String(c.minute).padStart(2, '0')}` };
}
// 0 at night, 1 in full day
export function daylight(g) {
  const m = clock(g).minuteOfDay;
  const ramp = (a, b, v) => Math.min(1, Math.max(0, (v - a) / (b - a)));
  if (m < 360) return 0;
  if (m < 450) return ramp(360, 450, m);
  if (m < 1110) return 1;
  if (m < 1230) return 1 - ramp(1110, 1230, m);
  return 0;
}
export function survivedText(g) {
  const days = Math.floor(g.t / 1440), hours = Math.floor((g.t % 1440) / 60);
  return `${days} day${days === 1 ? '' : 's'} and ${hours} hour${hours === 1 ? '' : 's'}`;
}

// ---------- inventory ----------

export function stackable(id) { const d = ITEMS[id]; return !(d.dur || id === 'flashlight' || d.place === 'jammer'); }

export function addItem(list, id, n = 1, extra = null) {
  if (!ITEMS[id]) throw new Error('unknown item ' + id);
  if (stackable(id) && !extra) {
    const s = list.find(x => x.id === id && !x.dur && x.charge == null);
    if (s) { s.n += n; return s; }
    const ns = { id, n };
    list.push(ns);
    return ns;
  }
  let last = null;
  for (let k = 0; k < n; k++) {
    last = { id, n: 1, ...(extra || {}) };
    if (ITEMS[id].dur && last.dur == null) last.dur = ITEMS[id].dur;
    if (id === 'flashlight' && last.charge == null) last.charge = 100;
    list.push(last);
  }
  return last;
}
export function count(list, id) { let n = 0; for (const s of list) if (s.id === id) n += s.n; return n; }
export function has(list, id, n = 1) { return count(list, id) >= n; }
export function removeItem(g, list, id, n = 1) {
  for (let k = list.length - 1; k >= 0 && n > 0; k--) {
    const s = list[k];
    if (s.id !== id) continue;
    const take = Math.min(n, s.n);
    s.n -= take; n -= take;
    if (s.n <= 0) { list.splice(k, 1); if (g) unequipGone(g, s); }
  }
}
function removeStack(g, list, s) {
  const k = list.indexOf(s);
  if (k >= 0) list.splice(k, 1);
  unequipGone(g, s);
}
function unequipGone(g, s) {
  const e = g.player.equip;
  for (const slot of ['weapon', 'body', 'back']) if (e[slot] === s) e[slot] = null;
}
export function weight(list) { let w = 0; for (const s of list) w += ITEMS[s.id].wt * s.n; return Math.round(w * 10) / 10; }
export function capacity(g) { const b = g.player.equip.back; return 14 + (b ? ITEMS[b.id].carry : 0) + perk(g, 'carry', 0); }

function rollLoot(g, table) {
  const t = LOOT[table] || LOOT.none;
  const out = [];
  const n = g.rng.int(t.rolls[0], t.rolls[1]);
  for (let k = 0; k < n; k++) {
    const id = g.rng.weighted(t.items);
    const d = ITEMS[id];
    let qty = 1;
    if (id === 'nails') qty = g.rng.int(4, 14);
    else if (id === 'shells') qty = g.rng.int(2, 7);
    else if (id === 'plank') qty = g.rng.int(1, 3);
    else if (id === 'batteries' || id === 'tincan' || id === 'scrap' || id === 'cloth') qty = g.rng.int(1, 2);
    const extra = d.dur ? { dur: Math.round(d.dur * g.rng.range(0.45, 1)) } : id === 'flashlight' ? { charge: g.rng.int(25, 100) } : null;
    addItem(out, id, qty, extra);
  }
  return out;
}

export function containerAt(g, x, y) { return inBounds(x, y) ? g.world.containers.get(idx(x, y)) : null; }

export function openContainer(g, x, y) {
  const c = containerAt(g, x, y);
  if (!c) return null;
  if (c.items == null) { c.items = rollLoot(g, c.table); g.stats.searched++; }
  if (c.doc && !g.journal.docs.includes(c.doc)) {
    g.journal.docs.push(c.doc);
    const d = DOCS.find(d => d.id === c.doc);
    log(g, `You find a document: “${d.title}”. (J to read it again)`, 'story');
    g.fx.push({ type: 'doc', id: c.doc });
  }
  return c;
}

// ---------- noise ----------

export function noise(g, x, y, radius, src = 'player') {
  if (radius <= 0) return;
  g.noises.push({ x, y, r: radius, t: 0, src });
  // loud noise carries to the network; quieter noise only counts if a robot actually hears it
  if (src === 'player' && radius >= 9 && !jammed(g, x, y)) g.heardAt = { x, y, t: g.t };
  const rainMul = g.weather.rain ? 0.75 : 1;
  for (const r of g.robots) {
    const def = ROBOTS[r.type];
    if (r.hp <= 0 || jammed(g, r.x, r.y)) continue;
    const eff = radius * def.hear * rainMul;
    const d = Math.hypot(r.x - x, r.y - y);
    if (d > eff) continue;
    if (src !== 'player' && src !== 'decoy' && r.state !== 'idle') continue;
    if (r.state === 'chase' && r.seeT < 3) continue;
    const jitter = Math.min(3, d * 0.15);
    setState(r, 'investigate');
    if (src === 'player') g.heardAt = { x, y, t: g.t };
    r.tx = x + g.rng.range(-jitter, jitter); r.ty = y + g.rng.range(-jitter, jitter);
    r.repath = 0;
  }
}

function jammerList(g) {
  if (g._jamVer !== g.world.version || !g._jams) {
    g._jamVer = g.world.version;
    g._jams = [...g.world.containers].filter(([, c]) => c.kind === 'jammer');
  }
  return g._jams;
}
function jammed(g, x, y) {
  for (const [k, c] of jammerList(g)) {
    if (!(c.charge > 0)) continue;
    const jx = (k % W) + 0.5, jy = Math.floor(k / W) + 0.5;
    if (Math.hypot(jx - x, jy - y) <= JAM_RADIUS) return true;
  }
  return false;
}
export { jammed, JAM_RADIUS };

// ---------- robots ----------

function setState(r, s) {
  if (r.state !== s) {
    r.state = s; r.stateT = 0;
    if (s === 'chase') r.bubble = { ch: '!', t: 1.2 };
    else if (s === 'investigate') r.bubble = { ch: '?', t: 1.2 };
  }
}

export function spawnRobot(g, type, x, y, extra = {}) {
  const def = ROBOTS[type];
  const r = {
    id: g.nextRobotId++, type, x, y, hp: def.hp, face: g.rng.range(0, Math.PI * 2),
    state: 'idle', stateT: 0, tx: x, ty: y, path: [], repath: 0, wait: g.rng.range(0, 4),
    senseT: g.rng.range(0, 0.3), seeT: 99, cd: 0, windup: 0, stun: 0, bash: 0, broadcastT: 0,
    bubble: null, hurt: 0, home: null, ax: x, ay: y, ...extra,
  };
  g.robots.push(r);
  return r;
}

function typeForDay(g, day) {
  const opts = [['tender', 70]];
  opts.push(['lamplighter', 11]);
  if (day >= 2) opts.push(['rover', 14 + day * 2]);
  if (day >= 3) opts.push(['breaker', 3 + day]);
  return g.rng.weighted(opts);
}

function spawnInitial(g) {
  const w = g.world;
  const sx = w.start.x, sy = w.start.y;
  let placed = 0, guard = 0;
  // Tenders still inside the homes they used to keep.
  const houses = w.buildings.filter(b => (b.type === 'house' || b.type === 'store') && b.id !== w.start.building);
  for (const b of g.rng.shuffle(houses.slice()).slice(0, Math.round(12 * diff(g).pop))) {
    if (Math.hypot(b.inX - sx, b.inY - sy) < 16) continue;
    spawnRobot(g, 'tender', b.inX + 0.5, b.inY + 0.5, { home: b.id });
    placed++;
  }
  // The Depot is guarded: Tenders walking the rows, a Lamplighter over the cots.
  const depot = w.buildings[w.depot];
  if (depot) {
    const spots = [];
    for (let y = depot.y + 1; y < depot.y + depot.h - 1; y++) for (let x = depot.x + 1; x < depot.x + depot.w - 1; x++) if (w.struct[idx(x, y)] === S.NONE) spots.push([x, y]);
    for (let k = 0; k < 7; k++) {
      const [x, y] = g.rng.pick(spots);
      spawnRobot(g, k === 0 ? 'lamplighter' : 'tender', x + 0.5, y + 0.5, { home: depot.id });
    }
  }
  const want = Math.round(46 * diff(g).pop);
  while (placed < want && guard++ < 5000) {
    const x = g.rng.int(8, W - 9), y = g.rng.int(8, H - 9);
    if (Math.hypot(x - sx, y - sy) < 20) continue;
    if (blocksMove(w, x, y, MOVE_WALK) || w.room[idx(x, y)]) continue;
    const type = g.rng.chance(0.13) ? 'lamplighter' : 'tender';
    spawnRobot(g, type, x + 0.5, y + 0.5);
    placed++;
  }
}

function spawnAtEdge(g, n, target, type = null) {
  const p = g.player;
  const exits = g.world.exits.filter(([x, y]) => Math.hypot(x - p.x, y - p.y) > 28);
  if (!exits.length) return [];
  const [ex, ey] = g.rng.pick(exits);
  const out = [];
  const day = clock(g).day;
  for (let k = 0; k < n; k++) {
    const r = spawnRobot(g, type || typeForDay(g, day), ex + 0.5 + g.rng.range(-0.3, 0.3), ey + 0.5 + g.rng.range(-0.3, 0.3));
    if (target) { setState(r, 'investigate'); r.tx = target[0]; r.ty = target[1]; r.patience = 30; }
    out.push(r);
  }
  return out;
}

function populationCap(g) { return Math.round(Math.min(170, 48 + (clock(g).day - 1) * 14) * diff(g).pop); }

function spawning(g, dt) {
  g.spawnT -= dt;
  const alive = g.robots.length;
  const p = g.player;
  if (g.spawnT <= 0) {
    g.spawnT = 22;
    if (alive < populationCap(g)) {
      const b = g.rng.pick(g.world.buildings);
      const lead = lastHeard(g, 120);
      const target = daylight(g) < 0.3 && lead && g.rng.chance(0.5)
        ? [lead.x + g.rng.range(-18, 18), lead.y + g.rng.range(-18, 18)]
        : [b.inX ?? b.x, b.inY ?? b.y];
      spawnAtEdge(g, g.rng.int(1, 3), target);
    }
  }
  // The night sweep: a column walks in towards wherever you are.
  const c = clock(g);
  if (c.hour === 23 && g.sweepDay < c.day) {
    g.sweepDay = c.day;
    const n = Math.max(1, Math.round(Math.min(14, 1 + c.day * 2) * diff(g).sweep));
    // The sweep heads for where you were last heard. Keep quiet (or sit under a jammer) and it
    // combs some other part of town instead.
    const lead = lastHeard(g, 150);
    const town = g.world.buildings.filter(b => b.inX != null);
    const guess = g.rng.pick(town);
    const target = lead ? [lead.x + g.rng.range(-8, 8), lead.y + g.rng.range(-8, 8)] : [guess.inX + 0.5, guess.inY + 0.5];
    const group = spawnAtEdge(g, n, target);
    if (group.length) {
      if (c.day >= 2) spawnAtEdge(g, 1, target, 'lamplighter');
      log(g, 'A low hum rolls in from the highway. Something is sweeping the county tonight.', 'warn');
    }
  }
}

// Where the robots last heard you, if recently enough and not under a jammer's cover.
function lastHeard(g, within) {
  const h = g.heardAt;
  if (!h || g.t - h.t > within || jammed(g, h.x, h.y)) return null;
  return h;
}

function canSee(g, r) {
  const p = g.player, def = ROBOTS[r.type];
  if (g.dead) return false;
  const dx = p.x - r.x, dy = p.y - r.y;
  const d = Math.hypot(dx, dy);
  const light = daylight(g);
  const inBush = g.world.struct[idx(p.x | 0, p.y | 0)] === S.BUSH;
  let range = def.sight * (0.42 + 0.58 * light);
  if (p.flashlight) range = Math.max(range, def.sight * 1.25);
  if (p.sneak) range *= 0.6;
  if (p.sneak && inBush) range = Math.min(range, 1.4);
  if (isIndoors(g.world, p.x, p.y) && !isIndoors(g.world, r.x, r.y)) range *= 0.8;
  if (p.sleeping) range *= 0.7;
  let seen = false;
  if (d <= range) {
    if (d < 1.6) seen = true;
    else {
      let a = Math.atan2(dy, dx) - r.face;
      a = Math.atan2(Math.sin(a), Math.cos(a));
      seen = Math.abs(a) < 1.25;
    }
  }
  if (!seen && r.type === 'lamplighter' && !(p.sneak && inBush)) {
    // the searchlight lands a few tiles ahead of the drone
    const lx = r.x + Math.cos(r.face) * 2.6, ly = r.y + Math.sin(r.face) * 2.6;
    if (Math.hypot(p.x - lx, p.y - ly) < 2.3) seen = true;
  }
  if (!seen) return false;
  return lineOfSight(g.world, r.x, r.y, p.x, p.y);
}

function updateRobot(g, r, dt) {
  const def = ROBOTS[r.type];
  const p = g.player;
  r.stateT += dt;
  if (r.hurt > 0) r.hurt -= dt;
  if (r.bubble) { r.bubble.t -= dt; if (r.bubble.t <= 0) r.bubble = null; }
  if (r.stun > 0) { r.stun -= dt; r.windup = 0; return; }
  r.cd -= dt;
  const dPlayer = Math.hypot(p.x - r.x, p.y - r.y);
  const far = dPlayer > 45;

  // Senses
  r.senseT -= dt;
  r.seeT += dt;
  if (r.senseT <= 0) {
    r.senseT = far ? 1.5 : 0.25;
    if (!far && canSee(g, r)) {
      r.seeT = 0;
      r.tx = p.x; r.ty = p.y;
      g.heardAt = { x: p.x, y: p.y, t: g.t };
      if (r.state !== 'chase') { setState(r, 'chase'); r.repath = 0; }
      if (r.type === 'lamplighter' && r.broadcastT <= 0) {
        r.broadcastT = 7;
        broadcast(g, r);
      }
    } else if (r.state === 'chase' && jammed(g, r.x, r.y) && r.seeT > 0.5) {
      setState(r, 'investigate'); r.tx = r.x + g.rng.range(-3, 3); r.ty = r.y + g.rng.range(-3, 3);
    }
  }
  r.broadcastT -= dt;

  // Decide where to go
  let speed = def.wander;
  if (r.state === 'chase') {
    if (r.pathMode !== 1) { r.pathMode = 1; r.repath = 0; }
    speed = def.speed;
    if (r.seeT > 8 && reached(r)) { setState(r, 'investigate'); r.tx = r.x; r.ty = r.y; }
  } else if (r.state === 'investigate') {
    if (r.pathMode !== 0) { r.pathMode = 0; r.repath = 0; }
    speed = def.speed * 0.7;
    if (reached(r)) {
      // look around, then give up
      r.face += dt * 1.6;
      if (r.stateT > 8 || (r.patience != null && r.stateT > r.patience)) { setState(r, 'idle'); r.wait = g.rng.range(2, 6); r.ax = r.x; r.ay = r.y; r.patience = null; }
    }
  } else {
    // idle: amble about, or stand still
    if (reached(r)) {
      r.wait -= dt;
      if (r.wait <= 0) {
        const pt = wanderPoint(g, r);
        if (pt) { r.tx = pt[0]; r.ty = pt[1]; r.repath = 0; }
        r.wait = g.rng.range(3, 9);
      }
    }
  }
  if (far && r.state === 'idle') speed *= 0.6;

  // Lamplighters hold off at searchlight distance once they have found you.
  if (r.type === 'lamplighter' && r.state === 'chase' && r.seeT < 1) {
    r.face = turnTo(r.face, Math.atan2(p.y - r.y, p.x - r.x), dt * 4);
    if (dPlayer < 3.2) { stepAway(g, r, p, def.speed * 0.6, dt); return; }
    if (dPlayer < 4.6) return;
  }

  // Close in and attack
  if (r.state === 'chase' && def.dmg > 0 && r.seeT < 0.6 && dPlayer < 4 && lineOfSight(g.world, r.x, r.y, p.x, p.y) && directClear(g, r, p)) {
    r.face = turnTo(r.face, Math.atan2(p.y - r.y, p.x - r.x), dt * 8);
    if (dPlayer > def.reach + PLAYER_R) {
      moveEntity(g, r, (p.x - r.x) / dPlayer * speed * dt, (p.y - r.y) / dPlayer * speed * dt, ROBOT_R, MOVE_WALK);
      r.windup = 0;
    } else attackPlayer(g, r, def, dt);
    separate(g, r);
    return;
  }
  if (r.windup > 0) r.windup = 0;

  // Follow a path
  r.repath -= dt;
  const tx = Math.floor(r.tx), ty = Math.floor(r.ty);
  if (r.repath <= 0 || r.pathVer !== g.world.version || r.goal !== idx(clampT(tx), clampT(ty))) {
    r.goal = idx(clampT(tx), clampT(ty));
    r.pathVer = g.world.version;
    r.path = findPath(g.world, Math.floor(r.x), Math.floor(r.y), clampT(tx), clampT(ty), pathDef(r), far ? 600 : 2600);
    r.repath = r.state === 'chase' ? 0.8 : 4 + g.rng.next() * 2;
  }
  if (!r.path.length) {
    // arrived at the tile: drift to the exact spot
    const ddx = r.tx - r.x, ddy = r.ty - r.y, dd = Math.hypot(ddx, ddy);
    if (dd > 0.15) moveEntity(g, r, ddx / dd * Math.min(dd, speed * dt), ddy / dd * Math.min(dd, speed * dt), ROBOT_R, def.flies ? MOVE_FLY : MOVE_WALK);
    separate(g, r);
    return;
  }
  const next = r.path[0];
  const nx = next % W, ny = Math.floor(next / W);
  const mode = def.flies ? MOVE_FLY : MOVE_WALK;
  if (blocksMove(g.world, nx, ny, mode)) {
    // something in the way: open it, break it, or find another way
    r.face = turnTo(r.face, Math.atan2(ny + 0.5 - r.y, nx + 0.5 - r.x), dt * 6);
    const near = Math.hypot(nx + 0.5 - r.x, ny + 0.5 - r.y) < 1.25;
    if (!near) { moveTowards(g, r, nx + 0.5, ny + 0.5, speed, dt, mode); return; }
    workOnObstacle(g, r, pathDef(r), nx, ny, dt);
    return;
  }
  const cx = nx + 0.5, cy = ny + 0.5;
  if (Math.hypot(cx - r.x, cy - r.y) < 0.25) { r.path.shift(); }
  else {
    // slow through windows and bushes
    const s = g.world.struct[next];
    const slow = s === S.WINDOW ? 0.4 : s === S.BUSH && !def.flies ? 0.7 : 1;
    moveTowards(g, r, cx, cy, speed * slow, dt, mode);
  }
  separate(g, r);
}

// Only a robot that is chasing you (or a Breaker) smashes its way through barricades,
// windows and walls. One that is just looking around goes through open ways and doors.
const CALM = {};
for (const [k, d] of Object.entries(ROBOTS)) CALM[k] = { ...d, bash: 0 };
function pathDef(r) {
  return r.state === 'chase' || r.type === 'breaker' ? ROBOTS[r.type] : CALM[r.type];
}

function clampT(v) { return Math.max(0, Math.min(W - 1, v)); }
function reached(r) { return !r.path.length && Math.hypot(r.tx - r.x, r.ty - r.y) < 0.6; }
function turnTo(a, b, rate) {
  let d = Math.atan2(Math.sin(b - a), Math.cos(b - a));
  return a + Math.max(-rate, Math.min(rate, d));
}
function moveTowards(g, r, x, y, speed, dt, mode) {
  const dx = x - r.x, dy = y - r.y, d = Math.hypot(dx, dy);
  if (d < 1e-4) return;
  r.face = turnTo(r.face, Math.atan2(dy, dx), dt * 7);
  const s = Math.min(d, speed * dt);
  moveEntity(g, r, dx / d * s, dy / d * s, ROBOT_R, mode);
}
function stepAway(g, r, p, speed, dt) {
  const dx = r.x - p.x, dy = r.y - p.y, d = Math.hypot(dx, dy) || 1;
  moveEntity(g, r, dx / d * speed * dt, dy / d * speed * dt, ROBOT_R, MOVE_FLY);
}
function directClear(g, r, p) {
  // a straight run at the player is only safe if nothing solid is in between
  const steps = Math.ceil(Math.hypot(p.x - r.x, p.y - r.y) * 3);
  for (let k = 1; k < steps; k++) {
    const x = r.x + (p.x - r.x) * k / steps, y = r.y + (p.y - r.y) * k / steps;
    if (blocksMove(g.world, x | 0, y | 0, MOVE_WALK)) return false;
  }
  return true;
}

function wanderPoint(g, r) {
  const def = ROBOTS[r.type];
  for (let k = 0; k < 8; k++) {
    let x, y;
    if (r.home != null && g.rng.chance(0.85)) {
      const b = g.world.buildings[r.home];
      x = g.rng.int(b.x + 1, b.x + b.w - 2); y = g.rng.int(b.y + 1, b.y + b.h - 2);
    } else {
      // amble around the spot it settled at
      const ax = r.ax ?? r.x, ay = r.ay ?? r.y;
      x = Math.floor(ax + g.rng.range(-6, 6)); y = Math.floor(ay + g.rng.range(-6, 6));
    }
    if (!inBounds(x, y) || tileCost(g.world, x, y, def) !== 1) continue;
    if (!def.flies && g.world.room[idx(x, y)] && r.home == null && g.rng.chance(0.7)) continue;
    return [x + 0.5, y + 0.5];
  }
  return null;
}

function broadcast(g, src) {
  g.fx.push({ type: 'broadcast', x: src.x, y: src.y });
  g.noises.push({ x: src.x, y: src.y, r: 22, t: 0, src: 'broadcast' });
  for (const r of g.robots) {
    if (r === src || r.hp <= 0) continue;
    if (Math.hypot(r.x - src.x, r.y - src.y) > 22 || jammed(g, r.x, r.y)) continue;
    if (r.state !== 'chase') { setState(r, 'investigate'); r.tx = g.player.x; r.ty = g.player.y; r.repath = 0; r.patience = 12; }
  }
}

function workOnObstacle(g, r, def, x, y, dt) {
  const w = g.world, i = idx(x, y), s = w.struct[i];
  if (s === S.DOOR && w.barr[i] === 0 && w.open[i] === 0 && def.opensDoors) {
    r.bash += dt;
    if (r.bash > 0.9) { r.bash = 0; w.open[i] = 1; w.version++; noise(g, x + 0.5, y + 0.5, 3, 'robot'); g.fx.push({ type: 'door', x, y }); }
    return;
  }
  if (!def.bash || !(s === S.DOOR || s === S.WINDOW || s === S.BWALL || s === S.FENCE)) { r.repath = 0; r.path = []; return; }
  if (s === S.WINDOW && w.open[i] >= 1 && w.barr[i] === 0) return; // passable
  if (r.cd > 0) return;
  r.cd = def.cd * 1.2;
  damageStructure(g, x, y, def.bash, 'robot');
}

export function damageStructure(g, x, y, dmg, by) {
  const w = g.world, i = idx(x, y), s = w.struct[i];
  g.fx.push({ type: 'bash', x: x + 0.5, y: y + 0.5 });
  if ((s === S.DOOR || s === S.WINDOW) && w.barr[i] > 0) {
    w.bhp[i] -= dmg;
    noise(g, x + 0.5, y + 0.5, NOISE.doorBash, by);
    if (w.bhp[i] <= 0) {
      w.barr[i]--; w.bhp[i] = w.barr[i] > 0 ? PLANK_HP : 0; w.version++;
      if (near(g, x, y, 14)) log(g, w.barr[i] ? 'A plank splinters off a barricade.' : 'The last plank gives way.', 'warn');
    }
    return;
  }
  w.hp[i] -= dmg;
  if (s === S.WINDOW) {
    if (w.hp[i] <= 0 && w.open[i] !== 2) {
      w.open[i] = 2; w.version++;
      noise(g, x + 0.5, y + 0.5, NOISE.smashWindow, by);
      if (near(g, x, y, 16)) log(g, 'Glass shatters nearby.', 'warn');
    }
    return;
  }
  noise(g, x + 0.5, y + 0.5, NOISE.doorBash, by);
  if (w.hp[i] <= 0) {
    if (s === S.DOOR) { w.open[i] = 2; }
    else { w.struct[i] = S.NONE; }
    w.version++;
    if (near(g, x, y, 16)) log(g, s === S.DOOR ? 'A door bursts off its hinges.' : 'Something you built comes down.', 'warn');
  }
}
function near(g, x, y, r) { return Math.hypot(g.player.x - x, g.player.y - y) < r; }

function attackPlayer(g, r, def, dt) {
  if (r.cd > 0) return;
  r.windup += dt;
  if (r.windup < 0.45) return;
  r.windup = 0; r.cd = def.cd;
  const p = g.player;
  const d = Math.hypot(p.x - r.x, p.y - r.y);
  g.fx.push({ type: 'robotSwing', id: r.id });
  if (d > def.reach + PLAYER_R + 0.35) return; // stepped back in time
  hurtPlayer(g, def.dmg * g.rng.range(0.8, 1.2), def.wound, def.name);
}

export function hurtPlayer(g, dmg, woundChance, by) {
  const p = g.player;
  if (g.dead) return;
  if (p.sleeping) { p.sleeping = false; log(g, 'You wake to something on top of you!', 'bad'); }
  cancelAction(g);
  const armor = p.equip.body ? ITEMS[p.equip.body.id].armor : 0;
  p.hp -= dmg * diff(g).dmg * (1 - armor * 0.4);
  p.hitFlash = 0.35;
  p.lastHurt = by;
  if (g.rng.chance(woundChance * (1 - armor))) {
    p.wounds.push({ bleeding: true, bandaged: false, dirty: false, age: 0, heal: g.rng.range(300, 520) });
    log(g, `The ${by} cuts you. You are bleeding.`, 'bad');
  }
  g.fx.push({ type: 'hurt' });
  if (p.hp <= 0) die(g, `Torn apart by a ${by}`);
}

function separate(g, r) {
  const p = g.player;
  for (const o of g.robots) {
    if (o === r || o.hp <= 0) continue;
    const dx = r.x - o.x, dy = r.y - o.y;
    if (Math.abs(dx) > 0.6 || Math.abs(dy) > 0.6) continue;
    const d = Math.hypot(dx, dy);
    if (d < 0.55 && d > 1e-4) {
      const push = (0.55 - d) * 0.5;
      moveEntity(g, r, dx / d * push, dy / d * push, ROBOT_R, ROBOTS[r.type].flies ? MOVE_FLY : MOVE_WALK);
    }
  }
  const dx = r.x - p.x, dy = r.y - p.y, d = Math.hypot(dx, dy);
  if (d < 0.6 && d > 1e-4 && !ROBOTS[r.type].flies) {
    moveEntity(g, r, dx / d * (0.6 - d), dy / d * (0.6 - d), ROBOT_R, MOVE_WALK);
  }
}

// Circle-vs-tiles movement, one axis at a time.
export function moveEntity(g, e, dx, dy, rad, mode) {
  const w = g.world;
  const blocked = (x, y) => {
    const x0 = Math.floor(x - rad), x1 = Math.floor(x + rad), y0 = Math.floor(y - rad), y1 = Math.floor(y + rad);
    for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) {
      if (!blocksMove(w, tx, ty, mode)) continue;
      // circle vs box
      const cx = Math.max(tx, Math.min(x, tx + 1)), cy = Math.max(ty, Math.min(y, ty + 1));
      if ((x - cx) ** 2 + (y - cy) ** 2 < rad * rad) return true;
    }
    return false;
  };
  // If already overlapping (a door shut on us), allow moving out.
  const stuck = blocked(e.x, e.y);
  if (dx) { const nx = e.x + dx; if (stuck || !blocked(nx, e.y)) e.x = nx; }
  if (dy) { const ny = e.y + dy; if (stuck || !blocked(e.x, ny)) e.y = ny; }
  e.x = Math.max(0.5, Math.min(W - 0.5, e.x));
  e.y = Math.max(0.5, Math.min(H - 0.5, e.y));
}

function killRobot(g, r) {
  const def = ROBOTS[r.type];
  r.hp = 0;
  g.stats.kills++;
  const tx = Math.floor(r.x), ty = Math.floor(r.y);
  const items = [];
  for (const [id, lo, hi, p] of def.drops) {
    if (p != null && !g.rng.chance(p)) continue;
    const n = g.rng.int(lo, hi);
    if (n > 0) addItem(items, id, n);
  }
  let i = idx(tx, ty);
  const existing = g.world.containers.get(i);
  if (existing && (existing.kind === 'pile' || existing.kind === 'wreck')) {
    if (existing.items == null) existing.items = [];
    for (const s of items) addItem(existing.items, s.id, s.n);
    existing.kind = 'wreck'; existing.robot = r.type;
  } else if (!existing && g.world.struct[i] !== S.FURN) {
    g.world.containers.set(i, { kind: 'wreck', table: 'wreck', items, robot: r.type, face: r.face });
  }
  g.fx.push({ type: 'kill', x: r.x, y: r.y, robot: r.type });
}

// ---------- player ----------

export function playerSpeed(g) {
  const p = g.player;
  let s = 3.0;
  if (p.sneak) s = 1.7;
  else if (p.run && p.endurance > 3) s = 5.2;
  const over = weight(p.inv) - capacity(g);
  if (over > 0) s *= Math.max(0.35, 1 - over / 12);
  if (p.fatigue > 80) s *= 0.85;
  if (p.hp < 30) s *= 0.85;
  const st = g.world.struct[idx(p.x | 0, p.y | 0)];
  if (st === S.BUSH) s *= 0.75;
  return s;
}

function updatePlayer(g, dt) {
  const p = g.player;
  p.hitFlash = Math.max(0, p.hitFlash - dt);
  p.attackCd = Math.max(0, p.attackCd - dt);
  p.swing = Math.max(0, p.swing - dt);

  // Needs
  const asleep = p.sleeping;
  const nm = diff(g).needs;
  p.hunger = Math.max(0, p.hunger - dt * 0.046 * nm * (asleep ? 0.6 : 1));
  p.thirst = Math.max(0, p.thirst - dt * 0.069 * nm * (asleep ? 0.6 : 1));
  if (asleep) p.fatigue = Math.max(0, p.fatigue - dt * 0.24);
  else p.fatigue = Math.min(100, p.fatigue + dt * (p.run && (p.moveX || p.moveY) ? 0.13 : 0.085));

  // Wounds and infection
  let bleeding = 0;
  for (let k = p.wounds.length - 1; k >= 0; k--) {
    const wd = p.wounds[k];
    wd.age += dt;
    if (wd.bleeding && !wd.bandaged) bleeding++;
    if (wd.bandaged) {
      wd.heal -= dt * (asleep ? 2 : 1) * perk(g, 'healMul');
      if (wd.heal <= 0) { p.wounds.splice(k, 1); log(g, 'A wound has closed up.', 'good'); continue; }
    }
    if (!p.infected && !wd.checked && ((wd.dirty && wd.age > 40) || (!wd.bandaged && wd.age > 90))) {
      wd.checked = true;
      if (g.rng.chance((wd.dirty ? 0.3 : 0.5) * perk(g, 'infectMul'))) { p.infected = true; log(g, 'A wound has gone hot and angry. It is infected.', 'bad'); }
    }
  }
  if (bleeding) { p.hp -= dt * 0.16 * bleeding; p.lastHurt = p.lastHurt || 'blood loss'; }
  if (p.infected) { p.hp -= dt * 0.012; p.fatigue = Math.min(100, p.fatigue + dt * 0.03); }
  if (p.hunger <= 0) p.hp -= dt * 0.03;
  if (p.thirst <= 0) p.hp -= dt * 0.05;
  if (!bleeding && !p.infected && p.hunger > 25 && p.thirst > 25) p.hp = Math.min(100, p.hp + dt * (asleep ? 0.06 : 0.02));
  if (p.hp <= 0) {
    die(g, bleeding ? 'Bled out' : p.thirst <= 0 ? 'Died of thirst' : p.hunger <= 0 ? 'Starved' : p.infected ? 'Taken by infection' : 'Succumbed to wounds');
    return;
  }

  // Flashlight battery
  if (p.flashlight) {
    const fl = p.inv.find(s => s.id === 'flashlight' && s.charge > 0);
    if (!fl) { p.flashlight = false; log(g, 'The flashlight flickers out.', 'warn'); }
    else { const was = fl.charge; fl.charge = Math.max(0, fl.charge - dt * 0.07); if (was >= 15 && fl.charge < 15) log(g, 'The flashlight is dimming. Find batteries.', 'warn'); }
  }

  if (asleep) {
    // something hunting nearby wakes you
    for (const r of g.robots) {
      if (r.hp > 0 && (r.state === 'chase' || r.state === 'investigate') && Math.hypot(r.x - p.x, r.y - p.y) < 7 && ROBOTS[r.type].dmg > 0) {
        p.sleeping = false; log(g, 'You jolt awake. Something is moving close by.', 'warn'); break;
      }
    }
    if (p.sleeping && p.fatigue <= 1) { p.sleeping = false; log(g, 'You wake up rested.', 'good'); }
    if (p.sleeping && (p.hunger < 5 || p.thirst < 5)) { p.sleeping = false; log(g, p.thirst < 5 ? 'You wake up parched.' : 'You wake up starving.', 'warn'); }
    return;
  }

  // Actions in progress
  const moving = p.moveX !== 0 || p.moveY !== 0;
  if (p.action) {
    if (moving) { cancelAction(g); }
    else {
      p.action.t += dt;
      p.action.noiseT = (p.action.noiseT || 0) - dt;
      if (p.action.noise && p.action.noiseT <= 0) { p.action.noiseT = 1; noise(g, p.x, p.y, p.action.noise); g.fx.push({ type: 'work', label: p.action.label }); }
      if (p.action.t >= p.action.dur) { const a = p.action; p.action = null; a.done(); }
      p.endurance = Math.min(100, p.endurance + dt * 6);
      return;
    }
  }

  // Movement
  const sp = playerSpeed(g);
  if (moving) {
    const m = Math.hypot(p.moveX, p.moveY);
    moveEntity(g, p, p.moveX / m * sp * dt, p.moveY / m * sp * dt, PLAYER_R, MOVE_PLAYER);
    const running = p.run && !p.sneak && p.endurance > 3;
    if (running) p.endurance = Math.max(0, p.endurance - dt * 7 * perk(g, 'enduranceMul'));
    else p.endurance = Math.min(100, p.endurance + dt * 4);
    p.noiseT -= dt;
    if (p.noiseT <= 0) {
      p.noiseT = 0.5;
      const r = p.sneak ? NOISE.sneak : running ? NOISE.run : NOISE.walk;
      if (r > 0) noise(g, p.x, p.y, r);
    }
  } else p.endurance = Math.min(100, p.endurance + dt * (p.fatigue > 80 ? 4 : 8));
  p.face = p.aim;

  // Keep robots off the player's tile
  for (const r of g.robots) {
    if (r.hp <= 0 || ROBOTS[r.type].flies) continue;
    const dx = p.x - r.x, dy = p.y - r.y, d = Math.hypot(dx, dy);
    if (d < 0.55 && d > 1e-4) moveEntity(g, p, dx / d * (0.55 - d) * 0.5, dy / d * (0.55 - d) * 0.5, PLAYER_R, MOVE_PLAYER);
  }
}

function die(g, cause) {
  if (g.dead) return;
  g.dead = true;
  g.cause = cause;
  g.player.hp = 0;
  g.player.sleeping = false;
  g.player.action = null;
  log(g, `${cause}. You lasted ${survivedText(g)}.`, 'bad');
  g.fx.push({ type: 'death' });
}

export function cancelAction(g) {
  const p = g.player;
  if (p.action) { log(g, `Stopped ${p.action.label.toLowerCase()}.`, 'dim'); p.action = null; }
}

function startAction(g, label, dur, done, noiseR = 0) {
  const p = g.player;
  if (p.action || p.sleeping || g.dead) return false;
  p.action = { label, dur, t: 0, done, noise: noiseR };
  return true;
}

// ---------- combat ----------

const FISTS = { name: 'Fists', dmg: 4, range: 0.95, cd: 0.5 };

export function attack(g) {
  const p = g.player;
  if (g.dead || p.sleeping || p.action || p.attackCd > 0) return;
  const st = p.equip.weapon;
  const wd = st ? ITEMS[st.id] : FISTS;
  if (wd.gun) return fireGun(g, st, wd);
  const tired = p.endurance < 10;
  p.attackCd = wd.cd * (tired ? 1.6 : 1) * (p.fatigue > 85 ? 1.2 : 1);
  p.endurance = Math.max(0, p.endurance - (4 + (ITEMS[st?.id]?.wt || 0) * 2.5));
  p.swing = 0.22;
  g.fx.push({ type: 'swing' });
  let targets = [];
  for (const r of g.robots) {
    if (r.hp <= 0) continue;
    const dx = r.x - p.x, dy = r.y - p.y, d = Math.hypot(dx, dy);
    if (d > wd.range + ROBOT_R + 0.1) continue;
    let a = Math.atan2(dy, dx) - p.aim;
    a = Math.atan2(Math.sin(a), Math.cos(a));
    if (Math.abs(a) > 1.0 && d > 0.6) continue;
    if (!lineOfSight(g.world, p.x, p.y, r.x, r.y)) continue;
    targets.push([d, r]);
  }
  targets.sort((a, b) => a[0] - b[0]);
  if (st?.id !== 'sledge' && st?.id !== 'axe') targets = targets.slice(0, 1);
  else targets = targets.slice(0, 3);
  if (!targets.length) { noise(g, p.x, p.y, NOISE.swing * 0.5); return; }
  for (const [, r] of targets) {
    const unaware = r.state !== 'chase';
    let dmg = wd.dmg * g.rng.range(0.85, 1.15) * (tired ? 0.6 : 1) * perk(g, 'dmgMul');
    if (unaware) dmg *= perk(g, 'sneakMul', 2.5);
    hitRobot(g, r, dmg, st?.id === 'sledge' ? 1.3 : 0.35, 0.3);
    if (unaware && r.hp <= 0) log(g, `You drop the ${ROBOTS[r.type].name} before it knows you are there.`, 'good');
  }
  noise(g, p.x, p.y, NOISE.hit);
  if (st) wear(g, st);
}

function wear(g, st) {
  st.dur -= 1;
  if (st.dur <= 0) {
    log(g, `Your ${ITEMS[st.id].name.toLowerCase()} breaks.`, 'bad');
    removeStack(g, g.player.inv, st);
  }
}

function hitRobot(g, r, dmg, stun, knock) {
  const p = g.player;
  r.hp -= dmg;
  r.hurt = 0.2;
  r.stun = Math.max(r.stun, stun);
  const dx = r.x - p.x, dy = r.y - p.y, d = Math.hypot(dx, dy) || 1;
  moveEntity(g, r, dx / d * knock, dy / d * knock, ROBOT_R, ROBOTS[r.type].flies ? MOVE_FLY : MOVE_WALK);
  g.fx.push({ type: 'hit', x: r.x, y: r.y });
  if (r.hp <= 0) { killRobot(g, r); return; }
  if (r.state !== 'chase') { setState(r, 'chase'); r.tx = p.x; r.ty = p.y; r.seeT = 0; r.face = Math.atan2(-dy, -dx); }
}

function fireGun(g, st, wd) {
  const p = g.player;
  if (!has(p.inv, 'shells')) { log(g, 'Click. No shells.', 'warn'); p.attackCd = 0.5; return; }
  removeItem(g, p.inv, 'shells', 1);
  p.attackCd = wd.cd;
  g.fx.push({ type: 'gunshot', x: p.x, y: p.y, a: p.aim });
  for (const r of g.robots) {
    if (r.hp <= 0) continue;
    const dx = r.x - p.x, dy = r.y - p.y, d = Math.hypot(dx, dy);
    if (d > wd.range) continue;
    let a = Math.atan2(dy, dx) - p.aim;
    a = Math.atan2(Math.sin(a), Math.cos(a));
    if (Math.abs(a) > 0.32) continue;
    if (!lineOfSight(g.world, p.x, p.y, r.x, r.y)) continue;
    hitRobot(g, r, wd.dmg * Math.max(0.35, 1 - d / wd.range * 0.7), 0.6, 0.5);
  }
  noise(g, p.x, p.y, NOISE.shotgun);
  wear(g, st);
}

export function throwItem(g, tx, ty) {
  const p = g.player;
  if (g.dead || p.sleeping || p.action || p.attackCd > 0) return;
  let id = p.throwId;
  if (!has(p.inv, id)) id = ['tincan', 'noisemaker', 'pulse'].find(t => has(p.inv, t));
  if (!id) { log(g, 'Nothing to throw. Empty cans work.', 'dim'); return; }
  const dx = tx - p.x, dy = ty - p.y, d = Math.hypot(dx, dy);
  const maxD = 9;
  if (d > maxD) { tx = p.x + dx / d * maxD; ty = p.y + dy / d * maxD; }
  // stop at the first wall
  const steps = Math.ceil(Math.min(d, maxD) * 3);
  let lx = p.x, ly = p.y;
  for (let k = 1; k <= steps; k++) {
    const x = p.x + (tx - p.x) * k / steps, y = p.y + (ty - p.y) * k / steps;
    const s = g.world.struct[idx(x | 0, y | 0)];
    if (s === S.WALL || s === S.BWALL || (s === S.DOOR && g.world.open[idx(x | 0, y | 0)] === 0) || (s === S.WINDOW && g.world.open[idx(x | 0, y | 0)] === 0) || s === S.TREE) break;
    lx = x; ly = y;
  }
  removeItem(g, p.inv, id, 1);
  p.attackCd = 0.6;
  g.thrown.push({ id, x0: p.x, y0: p.y, x1: lx, y1: ly, t: 0, dur: 0.15 + Math.hypot(lx - p.x, ly - p.y) * 0.06 });
}

function landThrown(g, th) {
  if (th.id === 'tincan') {
    noise(g, th.x1, th.y1, NOISE.canLand, 'decoy');
    g.fx.push({ type: 'clatter', x: th.x1, y: th.y1 });
  } else if (th.id === 'noisemaker') {
    g.decoys.push({ x: th.x1, y: th.y1, t: 45, beat: 0 });
  } else if (th.id === 'pulse') {
    g.fx.push({ type: 'pulse', x: th.x1, y: th.y1 });
    noise(g, th.x1, th.y1, 6, 'decoy');
    let n = 0;
    for (const r of g.robots) {
      if (r.hp <= 0) continue;
      const d = Math.hypot(r.x - th.x1, r.y - th.y1);
      if (d > 3.2) continue;
      n++;
      r.hp -= ROBOTS[r.type].flies ? 999 : 38 * (1 - d / 6);
      r.stun = 8; r.hurt = 0.4;
      if (r.hp <= 0) killRobot(g, r);
    }
    log(g, n ? `The pulse charge cracks blue. ${n} robot${n > 1 ? 's' : ''} lock up.` : 'The pulse charge cracks blue over nothing.', n ? 'good' : 'dim');
  }
}

// ---------- the main step ----------

export function step(g, dtReal) {
  if (g.dead || g.won) { tickFx(g, dtReal); return; }
  const scale = g.player.sleeping ? 24 : 1;
  let left = Math.min(dtReal, 0.25) * scale;
  while (left > 0) {
    const dt = Math.min(0.1, left);
    left -= dt;
    tick(g, dt);
    if (g.dead) break;
  }
  tickFx(g, dtReal);
}

function tickFx(g, dt) {
  for (const n of g.noises) n.t += dt;
  g.noises = g.noises.filter(n => n.t < 1.2);
}

function tick(g, dt) {
  g.t += dt;
  updatePlayer(g, dt);
  if (g.dead) return;
  for (const r of g.robots) if (r.hp > 0) updateRobot(g, r, dt);
  g.robots = g.robots.filter(r => r.hp > 0);
  for (const th of g.thrown) { th.t += dt; if (th.t >= th.dur) landThrown(g, th); }
  g.thrown = g.thrown.filter(th => th.t < th.dur);
  for (const d of g.decoys) {
    d.t -= dt; d.beat -= dt;
    if (d.beat <= 0) { d.beat = 2.5; noise(g, d.x, d.y, NOISE.noisemaker, 'decoy'); }
  }
  g.decoys = g.decoys.filter(d => d.t > 0);
  spawning(g, dt);
  world(g, dt);
}

function world(g, dt) {
  // Weather
  if (g.t >= g.weather.until) {
    g.weather.rain = !g.weather.rain && g.rng.chance(0.45);
    g.weather.until = g.t + (g.weather.rain ? g.rng.int(60, 240) : g.rng.int(180, 600));
    if (g.weather.rain) log(g, 'It starts to rain.', 'dim');
  }
  // Faraday Free Radio is on at dawn; the bus waits at the county line on day 7.
  const c = clock(g);
  if (c.hour === 6 && g.radioDay !== c.day) {
    g.radioDay = c.day;
    if (has(g.player.inv, 'radio') && c.day <= BROADCASTS.length) log(g, 'Your radio crackles at dawn: Faraday Free Radio is on the air. (Use the radio to listen.)', 'story');
  }
  if (c.hour === 19 && g.duskDay !== c.day) { g.duskDay = c.day; log(g, 'The light is going. Robots see less in the dark, and so do you.', 'warn'); }
  if (c.hour === 22 && g.sweepWarnDay !== c.day) { g.sweepWarnDay = c.day; log(g, 'An hour until the night sweep. Be somewhere strong, and be quiet.', 'warn'); }
  if (c.day === EVAC.day && c.hour === 11 && g.evacWarned !== true && g.journal.heard.some(d => d >= 5)) {
    g.evacWarned = true;
    log(g, 'One hour until the Pruitt bus at the north end of Route 9.', 'warn');
  }
  if (evacOpen(g)) {
    const e = evacPoint();
    if (Math.hypot(g.player.x - e.x, g.player.y - e.y) < EVAC.radius) {
      g.won = true; g.ending = 'bus'; g.player.sleeping = false; g.player.action = null;
      log(g, 'A church bus noses through the gap by the ditch. Hands pull you aboard.', 'good');
      g.fx.push({ type: 'evac' });
      return;
    }
  }
  // Water shut-off
  if (!g.waterOff && g.t >= g.waterOffAt) {
    g.waterOff = true;
    log(g, 'The pipes knock, and the taps run dry. Halcyon has shut off the county water.', 'warn');
  }
  // Devices
  for (const [, c] of g.world.containers) {
    if (c.kind === 'jammer' && c.charge > 0) c.charge = Math.max(0, c.charge - dt * 0.035);
    if (c.kind === 'barrel' && g.weather.rain) c.water = Math.min(100, (c.water || 0) + dt * 0.25);
  }
}

// ---------- interaction ----------

function hasTool(inv, ids) { return ids.some(id => has(inv, id)); }

// What the player can do with a tile. Returns [{id, label, run}].
export function actionsAt(g, x, y) {
  const p = g.player, w = g.world, inv = p.inv;
  if (!inBounds(x, y) || g.dead) return [];
  const d = Math.hypot(x + 0.5 - p.x, y + 0.5 - p.y);
  if (d > REACH) return [];
  const i = idx(x, y), s = w.struct[i];
  const out = [];
  const canBarricade = has(inv, 'hammer') && has(inv, 'plank') && has(inv, 'nails', 2);
  const canPry = hasTool(inv, ['hammer', 'crowbar']);
  if (s === S.DOOR) {
    const broken = w.open[i] === 2;
    if (w.barr[i] === 0 && !broken) out.push({ id: 'door', label: w.open[i] ? 'Close door' : 'Open door', run: () => toggleDoor(g, x, y) });
    if (w.barr[i] < 3 && !broken) out.push({ id: 'barricade', label: `Barricade door (${w.barr[i]}/3)`, disabled: !canBarricade && 'Needs a hammer, a plank and 2 nails', run: () => barricade(g, x, y) });
    if (broken && w.barr[i] < 3) out.push({ id: 'barricade', label: `Board up doorway (${w.barr[i]}/3)`, disabled: !canBarricade && 'Needs a hammer, a plank and 2 nails', run: () => barricade(g, x, y) });
    if (w.barr[i] > 0) out.push({ id: 'pry', label: 'Pry off a plank', disabled: !canPry && 'Needs a hammer or crowbar', run: () => pry(g, x, y) });
  } else if (s === S.WINDOW) {
    const st = w.open[i];
    if (w.barr[i] === 0) {
      if (st >= 1) out.push({ id: 'climb', label: 'Climb through window', run: () => climb(g, x, y) });
      if (st === 0) out.push({ id: 'openwin', label: 'Open window', run: () => { w.open[i] = 1; w.version++; noise(g, x + 0.5, y + 0.5, 2); } });
      if (st === 1) out.push({ id: 'closewin', label: 'Close window', run: () => { w.open[i] = 0; w.version++; } });
      if (st === 0) out.push({ id: 'smash', label: 'Smash window', run: () => { w.hp[i] = 0; w.open[i] = 2; w.version++; noise(g, x + 0.5, y + 0.5, NOISE.smashWindow); g.fx.push({ type: 'glass', x, y }); } });
    }
    if (w.barr[i] < 3) out.push({ id: 'barricade', label: `Barricade window (${w.barr[i]}/3)`, disabled: !canBarricade && 'Needs a hammer, a plank and 2 nails', run: () => barricade(g, x, y) });
    if (w.barr[i] > 0) out.push({ id: 'pry', label: 'Pry off a plank', disabled: !canPry && 'Needs a hammer or crowbar', run: () => pry(g, x, y) });
  } else if (s === S.BWALL) {
    out.push({ id: 'dismantle', label: 'Take down wall', disabled: !has(inv, 'hammer') && 'Needs a hammer', run: () => takeDownWall(g, x, y) });
  }
  const c = w.containers.get(i);
  if (c) {
    const f = FURNITURE[c.kind];
    if (c.kind === 'pile') out.push({ id: 'search', label: 'Look at items on the ground', run: () => ({ open: [x, y] }) });
    else if (c.kind === 'wreck') out.push({ id: 'search', label: `Strip ${ROBOTS[c.robot]?.name || 'robot'} wreck`, run: () => ({ open: [x, y] }) });
    else if (c.kind === 'crate') out.push({ id: 'search', label: 'Open storage crate', run: () => ({ open: [x, y] }) });
    else if (f && c.table !== 'none') out.push({ id: 'search', label: `Search ${f.name.toLowerCase()}${c.items && !c.items.length ? ' (empty)' : ''}`, run: () => ({ open: [x, y] }) });
    if (f?.water) {
      const hasWater = c.kind === 'barrel' ? (c.water || 0) >= 1 : !g.waterOff;
      const why = c.kind === 'barrel' ? 'The barrel is empty' : 'The water is off';
      out.push({ id: 'drink', label: c.kind === 'barrel' ? `Drink from barrel (${Math.floor(c.water || 0)}%)` : 'Drink from tap', disabled: !hasWater && why, run: () => drinkFrom(g, c) });
      out.push({ id: 'fill', label: 'Fill empty bottles', disabled: (!hasWater && why) || (!has(inv, 'bottle') && 'No empty bottles'), run: () => fillBottles(g, c) });
    }
    if (f?.bed) out.push({ id: 'sleep', label: 'Sleep', disabled: p.fatigue < 20 && 'You are not tired', run: () => sleep(g) });
    if (f?.wood && !f.placed) out.push({ id: 'saw', label: `Saw up for planks`, disabled: !has(inv, 'saw') && 'Needs a saw', run: () => dismantle(g, x, y, 'wood') });
    if (f?.elec) out.push({ id: 'unscrew', label: `Take apart for parts`, disabled: !has(inv, 'screwdriver') && 'Needs a screwdriver', run: () => dismantle(g, x, y, 'elec') });
    if (f?.node) {
      const ready = has(inv, 'pulse', 2) && has(inv, 'screwdriver');
      out.push({ id: 'sabotage', label: 'Hard-reset the node', disabled: !ready && 'Needs 2 pulse charges and a screwdriver', run: () => sabotageNode(g, x, y) });
    }
    if (f?.studio) out.push({ id: 'studio', label: 'Listen on the studio set', run: () => { const day = listen(g); return { radio: day }; } });
    if (c.kind === 'jammer') {
      out.unshift({ id: 'info', label: `Jammer charge ${Math.ceil(c.charge || 0)}%`, disabled: 'Robots within 7 tiles cannot hear', run: () => null });
      out.push({ id: 'recharge', label: 'Fit a new power cell', disabled: !has(inv, 'cell') && 'Needs a power cell', run: () => { removeItem(g, inv, 'cell'); c.charge = 100; log(g, 'The jammer hums back to full.', 'good'); } });
    }
    if (f?.placed) out.push({ id: 'pickup', label: `Pick up ${f.name.toLowerCase()}`, disabled: c.items && c.items.length && 'Empty it first', run: () => pickUp(g, x, y) });
  }
  return out;
}

// The second way out: drop the Depot's node and every door in the building opens.
function sabotageNode(g, x, y) {
  const inv = g.player.inv;
  noise(g, x + 0.5, y + 0.5, 30);
  log(g, 'The node shrieks a service alarm. Every unit in the building turns toward you.', 'warn');
  for (const r of g.robots) if (r.home === g.world.depot) { setState(r, 'investigate'); r.tx = x + 0.5; r.ty = y + 0.5; r.patience = 30; }
  return startAction(g, 'Resetting the node', 10, () => {
    if (!(has(inv, 'pulse', 2) && has(inv, 'screwdriver'))) return;
    removeItem(g, inv, 'pulse', 2);
    g.fx.push({ type: 'pulse', x: x + 0.5, y: y + 0.5 });
    const w = g.world, b = w.buildings[w.depot];
    for (let yy = b.y; yy < b.y + b.h; yy++) for (let xx = b.x; xx < b.x + b.w; xx++) {
      const i = idx(xx, yy);
      if (w.struct[i] === S.DOOR) { w.open[i] = 1; w.barr[i] = 0; }
    }
    w.version++;
    for (const r of g.robots) if (Math.hypot(r.x - x, r.y - y) < 30) { r.stun = 9999; setState(r, 'idle'); }
    g.won = true; g.ending = 'depot'; g.player.action = null;
    log(g, 'Two flashes, a smell of hot copper, and the cores come out in your hands. The lights go off.', 'good');
    g.fx.push({ type: 'evac' });
  }, NOISE.hammer);
}

function toggleDoor(g, x, y) {
  const w = g.world, i = idx(x, y);
  if (w.open[i] === 1) {
    // don't shut it on anyone
    for (const e of [g.player, ...g.robots]) if (Math.floor(e.x) === x && Math.floor(e.y) === y) return;
    w.open[i] = 0;
  } else w.open[i] = 1;
  w.version++;
  noise(g, x + 0.5, y + 0.5, 1.5);
  g.fx.push({ type: 'door', x, y });
}

function barricade(g, x, y) {
  const inv = g.player.inv;
  return startAction(g, 'Barricading', 4 * perk(g, 'buildMul'), () => {
    const w = g.world, i = idx(x, y);
    if (!(has(inv, 'hammer') && has(inv, 'plank') && has(inv, 'nails', 2)) || w.barr[i] >= 3) return;
    for (const e of [g.player, ...g.robots]) if (Math.floor(e.x) === x && Math.floor(e.y) === y) { log(g, 'Something is in the way.', 'warn'); return; }
    removeItem(g, inv, 'plank', 1); removeItem(g, inv, 'nails', 2);
    if (w.struct[i] === S.DOOR && w.open[i] === 1) w.open[i] = 0;
    w.barr[i]++; w.bhp[i] = PLANK_HP; w.version++;
    log(g, `You nail a plank across it (${w.barr[i]}/3).`, 'good');
  }, NOISE.hammer);
}

function pry(g, x, y) {
  return startAction(g, 'Prying off a plank', 3, () => {
    const w = g.world, i = idx(x, y);
    if (w.barr[i] <= 0) return;
    w.barr[i]--; w.bhp[i] = w.barr[i] ? PLANK_HP : 0; w.version++;
    addItem(g.player.inv, 'plank', 1);
    if (g.rng.chance(0.5)) addItem(g.player.inv, 'nails', 1);
    log(g, 'You pry a plank loose.', 'info');
  }, 6);
}

function climb(g, x, y) {
  const p = g.player;
  return startAction(g, 'Climbing through', 1.2, () => {
    const w = g.world, i = idx(x, y);
    if (w.struct[i] !== S.WINDOW || w.open[i] === 0 || w.barr[i]) return;
    // land on the far side
    const fx = Math.floor(p.x), fy = Math.floor(p.y);
    const tx = x + Math.sign(x - fx), ty = y + Math.sign(y - fy);
    const opts = [[tx, ty], [x + (x - fx), y], [x, y + (y - fy)]];
    for (const [ax, ay] of opts) {
      if (!blocksMove(w, ax, ay, MOVE_PLAYER) && (ax === x || ay === y)) {
        p.x = ax + 0.5; p.y = ay + 0.5;
        noise(g, p.x, p.y, NOISE.climb);
        if (w.open[i] === 2 && g.rng.chance(0.18)) {
          p.wounds.push({ bleeding: true, bandaged: false, dirty: false, age: 0, heal: g.rng.range(200, 350) });
          log(g, 'Broken glass slices your arm.', 'bad');
          p.lastHurt = 'broken glass';
        }
        return;
      }
    }
    log(g, 'No room on the other side.', 'warn');
  });
}

function drinkFrom(g, c) {
  const p = g.player;
  if (c.kind === 'barrel') {
    const want = Math.min(100 - p.thirst, (c.water || 0) * 2);
    p.thirst += want; c.water -= want / 2;
  } else if (!g.waterOff) p.thirst = 100;
  else return;
  log(g, 'You drink until you can drink no more.', 'good');
  g.fx.push({ type: 'drink' });
}

function fillBottles(g, c) {
  const inv = g.player.inv;
  let n = 0;
  while (has(inv, 'bottle')) {
    if (c.kind === 'barrel') { if ((c.water || 0) < 20) break; c.water -= 20; }
    else if (g.waterOff) break;
    removeItem(g, inv, 'bottle', 1); addItem(inv, 'water', 1); n++;
  }
  if (n) log(g, `You fill ${n} bottle${n > 1 ? 's' : ''}.`, 'good');
}

function sleep(g) {
  const p = g.player;
  if (p.fatigue < 20) return;
  const threat = g.robots.some(r => r.hp > 0 && r.state === 'chase' && Math.hypot(r.x - p.x, r.y - p.y) < 14);
  if (threat) { log(g, 'You cannot sleep with that thing hunting you.', 'warn'); return; }
  p.sleeping = true; p.flashlight = false; p.action = null;
  log(g, 'You lie down and close your eyes.', 'dim');
}

function dismantle(g, x, y, kind) {
  const c = containerAt(g, x, y);
  const f = FURNITURE[c.kind];
  const wood = kind === 'wood';
  return startAction(g, wood ? 'Sawing' : 'Unscrewing', wood ? 6 * perk(g, 'buildMul') : 5 * perk(g, 'unscrewMul'), () => {
    const w = g.world, i = idx(x, y);
    if (!w.containers.has(i)) return;
    const inv = g.player.inv;
    // contents spill onto the floor... which is this tile: keep them as a pile
    const items = c.items == null ? rollLoot(g, c.table) : c.items;
    if (wood) { addItem(inv, 'plank', f.wood); if (g.rng.chance(0.6)) addItem(inv, 'nails', g.rng.int(1, 4)); }
    else for (const [id, n] of f.elec) addItem(inv, id, g.rng.int(Math.max(1, n - 1), n));
    w.struct[i] = S.NONE; w.version++;
    if (items.length) w.containers.set(i, { kind: 'pile', table: 'none', items });
    else w.containers.delete(i);
    log(g, wood ? `You saw the ${f.name.toLowerCase()} into ${f.wood} planks.` : `You strip the ${f.name.toLowerCase()} for parts.`, 'good');
  }, wood ? NOISE.saw : NOISE.unscrew);
}

function takeDownWall(g, x, y) {
  return startAction(g, 'Taking down the wall', 5, () => {
    const w = g.world, i = idx(x, y);
    if (w.struct[i] !== S.BWALL) return;
    w.struct[i] = S.NONE; w.version++;
    addItem(g.player.inv, 'plank', 2); addItem(g.player.inv, 'nails', 2);
  }, NOISE.hammer);
}

function pickUp(g, x, y) {
  const w = g.world, i = idx(x, y), c = w.containers.get(i);
  const kit = { jammer: 'jammer', barrel: 'barrelkit', crate: 'cratekit' }[c.kind];
  if (!kit) return;
  if (c.items && c.items.length) return;
  w.struct[i] = S.NONE; w.containers.delete(i); w.version++;
  if (kit === 'jammer') addItem(g.player.inv, 'jammer', 1, { charge: c.charge ?? 0 });
  else addItem(g.player.inv, kit, 1);
}

// Placing a crafted kit on a tile.
export function canPlace(g, st, x, y) {
  const p = g.player, w = g.world;
  if (!inBounds(x, y)) return 'Out of bounds';
  if (Math.hypot(x + 0.5 - p.x, y + 0.5 - p.y) > REACH) return 'Too far';
  const i = idx(x, y);
  if (w.struct[i] !== S.NONE || w.containers.has(i)) return 'Something is there';
  const g0 = w.ground[i];
  if (g0 === G.ROAD || g0 === G.LINE) return 'Not on the road';
  for (const e of [p, ...g.robots]) if (Math.floor(e.x) === x && Math.floor(e.y) === y) return 'Someone is standing there';
  const what = ITEMS[st.id].place;
  if (what === 'barrel' && w.room[i]) return 'Rain barrels go outdoors';
  if (what === 'bwall' && !has(p.inv, 'hammer')) return 'Needs a hammer';
  return null;
}

export function place(g, st, x, y) {
  if (canPlace(g, st, x, y)) return false;
  const what = ITEMS[st.id].place;
  const dur = (what === 'bwall' ? 5 : 2) * perk(g, 'buildMul');
  return startAction(g, what === 'bwall' ? 'Building a wall' : 'Setting it down', dur, () => {
    if (canPlace(g, st, x, y) || !g.player.inv.includes(st)) return;
    const w = g.world, i = idx(x, y);
    removeStack(g, g.player.inv, st);
    if (what === 'bwall') { w.struct[i] = S.BWALL; w.hp[i] = BWALL_HP; w.style[i] = 6; }
    else {
      w.struct[i] = S.FURN;
      addContainer(w, x, y, what, 'none', what === 'crate' ? [] : null);
      const c = w.containers.get(i);
      if (what === 'jammer') { c.charge = st.charge ?? 100; c.items = []; }
      if (what === 'barrel') { c.water = 0; c.items = []; }
    }
    w.version++;
    log(g, what === 'jammer' ? 'The jammer whines up. Nothing nearby will hear you now.' : what === 'bwall' ? 'The wall is up.' : 'Done.', 'good');
  }, what === 'bwall' ? NOISE.hammer : 0);
}

// ---------- using items ----------

export function itemActions(g, st) {
  const d = ITEMS[st.id], p = g.player, out = [];
  if (d.cat === 'food' || d.cat === 'drink') {
    const blocked = d.canned && !hasTool(p.inv, ['opener', 'knife', 'screwdriver']);
    out.push({ id: 'eat', label: d.cat === 'drink' ? 'Drink' : 'Eat', disabled: blocked && 'Needs a can opener, knife or screwdriver', run: () => consume(g, st) });
  }
  if (d.cat === 'med') out.push({ id: 'use', label: 'Use', run: () => useMed(g, st) });
  if (d.cat === 'weapon') {
    const on = p.equip.weapon === st;
    out.push({ id: 'equip', label: on ? 'Put away' : 'Wield', run: () => { p.equip.weapon = on ? null : st; } });
  }
  if (d.cat === 'wear') {
    const on = p.equip[d.slot] === st;
    out.push({ id: 'wear', label: on ? 'Take off' : 'Wear', run: () => { p.equip[d.slot] = on ? null : st; } });
  }
  if (d.throwable) out.push({ id: 'ready', label: p.throwId === st.id ? 'Ready to throw ✓' : 'Ready to throw (G)', run: () => { p.throwId = st.id; } });
  if (st.id === 'flashlight') out.push({ id: 'light', label: p.flashlight ? 'Switch off (F)' : 'Switch on (F)', run: () => toggleFlashlight(g) });
  if (st.id === 'batteries') out.push({ id: 'recharge', label: 'Put in flashlight', disabled: !has(p.inv, 'flashlight') && 'No flashlight', run: () => {
    const fl = p.inv.filter(s => s.id === 'flashlight').sort((a, b) => a.charge - b.charge)[0];
    if (!fl) return; fl.charge = 100; removeItem(g, p.inv, 'batteries', 1); log(g, 'Fresh batteries.', 'good');
  } });
  if (d.place) out.push({ id: 'place', label: 'Place…', run: () => ({ place: st }) });
  if (st.id === 'radio') out.push({ id: 'listen', label: 'Listen', run: () => ({ radio: listen(g) }) });
  out.push({ id: 'drop', label: st.n > 1 ? 'Drop one' : 'Drop', run: () => drop(g, st, 1) });
  if (st.n > 1) out.push({ id: 'dropall', label: `Drop all ${st.n}`, run: () => drop(g, st, st.n) });
  return out;
}

// Today's broadcast (the radio repeats the last one after the evacuation).
export function listen(g) {
  const day = Math.min(clock(g).day, BROADCASTS.length);
  if (!g.journal.heard.includes(day)) g.journal.heard.push(day);
  noise(g, g.player.x, g.player.y, 2);
  return day;
}
export function evacPoint() { return { x: 38.5, y: 2.5 }; }
export function evacOpen(g) {
  const c = clock(g);
  return c.day === EVAC.day && c.minuteOfDay >= EVAC.from && c.minuteOfDay < EVAC.to;
}

export function toggleFlashlight(g) {
  const p = g.player;
  if (p.flashlight) { p.flashlight = false; return; }
  const fl = p.inv.find(s => s.id === 'flashlight' && s.charge > 0);
  if (!fl) { log(g, has(p.inv, 'flashlight') ? 'The flashlight is dead. Find batteries.' : 'You have no flashlight.', 'dim'); return; }
  p.flashlight = true;
}

function consume(g, st) {
  const d = ITEMS[st.id], p = g.player;
  if (d.canned && !hasTool(p.inv, ['opener', 'knife', 'screwdriver'])) return;
  p.hunger = Math.min(100, Math.max(0, p.hunger + (d.hunger || 0)));
  p.thirst = Math.min(100, Math.max(0, p.thirst + (d.thirst || 0)));
  removeItem(g, p.inv, st.id, 1);
  if (d.leaves) addItem(p.inv, d.leaves, 1);
  else if (d.canned) addItem(p.inv, 'tincan', 1);
  g.fx.push({ type: d.cat === 'drink' ? 'drink' : 'eat' });
}

function useMed(g, st) {
  const p = g.player;
  const id = st.id;
  if (id === 'bandage' || id === 'rag') {
    const wd = p.wounds.find(w => !w.bandaged);
    if (!wd) { log(g, 'You have no open wounds.', 'dim'); return; }
    wd.bandaged = true; wd.bleeding = false; wd.dirty = id === 'rag';
    removeItem(g, p.inv, id, 1);
    log(g, id === 'rag' ? 'You tie a rag around the wound. It will have to do.' : 'You bandage the wound.', 'good');
  } else if (id === 'antiseptic') {
    const dirty = p.wounds.filter(w => w.dirty || !w.bandaged);
    if (!p.infected && !dirty.length) { log(g, 'Nothing needs cleaning.', 'dim'); return; }
    for (const w of p.wounds) { w.dirty = false; w.checked = true; }
    if (p.infected) log(g, 'The antiseptic burns. The infection starts to fade.', 'good');
    else log(g, 'You clean your wounds.', 'good');
    p.infected = false;
    removeItem(g, p.inv, id, 1);
  } else if (id === 'painkillers') {
    p.hp = Math.min(100, p.hp + 8);
    p.fatigue = Math.max(0, p.fatigue - 8);
    removeItem(g, p.inv, id, 1);
    log(g, 'The painkillers take the edge off.', 'good');
  }
}

// Q: the most urgent first aid you can do with what you carry.
export function quickHeal(g) {
  const p = g.player, inv = p.inv;
  const open = p.wounds.some(w => !w.bandaged);
  const dirty = p.infected || p.wounds.some(w => w.dirty);
  let id = null;
  if (open) id = has(inv, 'bandage') ? 'bandage' : has(inv, 'rag') ? 'rag' : null;
  if (!id && dirty && has(inv, 'antiseptic')) id = 'antiseptic';
  if (!id && p.hp < 60 && has(inv, 'painkillers')) id = 'painkillers';
  if (!id) {
    log(g, open ? 'You are bleeding and have nothing to bind it with. Rags, bandages, anything.' : dirty ? 'You need antiseptic.' : 'Nothing needs patching up.', open ? 'warn' : 'dim');
    return false;
  }
  useMed(g, inv.find(s => s.id === id));
  return true;
}

export function drop(g, st, n) {
  const p = g.player, w = g.world;
  const tx = Math.floor(p.x), ty = Math.floor(p.y), i = idx(tx, ty);
  let c = w.containers.get(i);
  if (!c) { c = { kind: 'pile', table: 'none', items: [] }; w.containers.set(i, c); }
  if (c.items == null) c.items = [];
  moveStack(g, p.inv, c.items, st, n);
  if (p.flashlight && !has(p.inv, 'flashlight')) p.flashlight = false;
}

// Moves n of a stack from one list to another, keeping durability and charge.
export function moveStack(g, from, to, st, n = st.n) {
  n = Math.min(n, st.n);
  if (st.dur != null || st.charge != null) {
    removeStack(g, from, st);
    to.push(st);
  } else {
    addItem(to, st.id, n);
    st.n -= n;
    if (st.n <= 0) removeStack(g, from, st);
  }
}

export function cleanPile(g, x, y) {
  const i = idx(x, y), c = g.world.containers.get(i);
  if (c && c.kind === 'pile' && c.items && !c.items.length) g.world.containers.delete(i);
}

// ---------- crafting ----------

export function recipeState(g, r) {
  const inv = g.player.inv;
  const missing = [];
  for (const [id, n] of r.needs) if (!has(inv, id, n)) missing.push(`${n} × ${ITEMS[id].name}`);
  for (const opts of r.tools || []) if (!hasTool(inv, opts)) missing.push(opts.map(id => ITEMS[id].name).join(' or '));
  if (r.special === 'repair') {
    const wpn = g.player.equip.weapon;
    if (!wpn || !wpn.dur) missing.push('a wielded weapon');
    else if (wpn.dur >= ITEMS[wpn.id].dur) missing.push('a worn weapon');
  }
  return missing;
}

export function craft(g, r) {
  if (recipeState(g, r).length) return false;
  return startAction(g, 'Crafting', r.time * (r.tools?.some(t => t.includes('hammer')) ? perk(g, 'buildMul') : 1), () => {
    if (recipeState(g, r).length) return;
    const inv = g.player.inv;
    for (const [id, n] of r.needs) {
      // consuming a worn item: take the one not equipped first
      if (!stackable(id)) {
        const cands = inv.filter(s => s.id === id).sort((a, b) => (isEquipped(g, a) ? 1 : 0) - (isEquipped(g, b) ? 1 : 0));
        for (let k = 0; k < n; k++) removeStack(g, inv, cands[k]);
      } else removeItem(g, inv, id, n);
    }
    if (r.special === 'repair') {
      const wpn = g.player.equip.weapon;
      wpn.dur = Math.min(ITEMS[wpn.id].dur, wpn.dur + Math.ceil(ITEMS[wpn.id].dur / 2));
      log(g, `You tape up your ${ITEMS[wpn.id].name.toLowerCase()}.`, 'good');
    } else {
      addItem(inv, r.out[0], r.out[1]);
      log(g, `You make ${r.out[1] > 1 ? r.out[1] + ' × ' : ''}${ITEMS[r.out[0]].name.toLowerCase()}.`, 'good');
    }
    g.stats.crafted++;
  }, r.tools?.some(t => t.includes('hammer')) ? NOISE.hammer * 0.6 : 0);
}

export function isEquipped(g, st) { const e = g.player.equip; return e.weapon === st || e.body === st || e.back === st; }

export { RECIPES, buildingAt };

// ---------- save / load ----------

const SAVE_VERSION = 2; // 2: the Depot and KFDC changed the county layout

export function serialize(g) {
  const w = g.world, p = g.player;
  const enc = arr => {
    // run-length encode
    const out = [];
    let prev = arr[0], run = 1;
    for (let k = 1; k < arr.length; k++) {
      if (arr[k] === prev && run < 65535) run++;
      else { out.push(prev, run); prev = arr[k]; run = 1; }
    }
    out.push(prev, run);
    return out;
  };
  const inv = p.inv;
  return {
    v: SAVE_VERSION, seed: g.seed, t: g.t, rng: g.rng.state,
    world: {
      struct: enc(w.struct), open: enc(w.open), barr: enc(w.barr), bhp: enc(w.bhp), hp: enc(w.hp), style: enc(w.style),
      explored: enc(w.explored),
      containers: [...w.containers].map(([k, c]) => [k, c]),
    },
    player: { ...p, action: null, inv, equip: { weapon: inv.indexOf(p.equip.weapon), body: inv.indexOf(p.equip.body), back: inv.indexOf(p.equip.back) } },
    robots: g.robots.map(r => ({ ...r, path: [] })), nextRobotId: g.nextRobotId,
    decoys: g.decoys, weather: g.weather, waterOffAt: g.waterOffAt, waterOff: g.waterOff,
    spawnT: g.spawnT, sweepDay: g.sweepDay, stats: g.stats, messages: g.messages.slice(-20),
    name: g.name, occupation: g.occupation, journal: g.journal, radioDay: g.radioDay, evacWarned: g.evacWarned, ending: g.ending, duskDay: g.duskDay, sweepWarnDay: g.sweepWarnDay,
    difficulty: g.difficulty, heardAt: g.heardAt, pins: g.pins, tipsShown: g.tipsShown,
  };
}

export function deserialize(data) {
  if (!data || data.v !== SAVE_VERSION) return null;
  const g = newGame(data.seed, { noRobots: true });
  const w = g.world;
  const dec = (rle, arr) => { let k = 0; for (let j = 0; j < rle.length; j += 2) { arr.fill(rle[j], k, k + rle[j + 1]); k += rle[j + 1]; } };
  dec(data.world.struct, w.struct); dec(data.world.open, w.open); dec(data.world.barr, w.barr);
  dec(data.world.bhp, w.bhp); dec(data.world.hp, w.hp); dec(data.world.style, w.style); dec(data.world.explored, w.explored);
  w.containers = new Map(data.world.containers);
  w.version++;
  g.t = data.t; g.rng.state = data.rng;
  const p = data.player;
  const eq = p.equip;
  g.player = { ...p, equip: { weapon: p.inv[eq.weapon] || null, body: p.inv[eq.body] || null, back: p.inv[eq.back] || null }, action: null, moveX: 0, moveY: 0, run: false };
  g.robots = data.robots.map(r => ({ ...r, path: [], repath: 0 }));
  g.nextRobotId = data.nextRobotId;
  g.decoys = data.decoys || [];
  g.weather = data.weather; g.waterOffAt = data.waterOffAt; g.waterOff = data.waterOff;
  g.spawnT = data.spawnT; g.sweepDay = data.sweepDay; g.stats = data.stats;
  g.messages = data.messages || [];
  g.name = data.name || 'You'; g.occupation = data.occupation || 'none';
  g.journal = data.journal || { docs: [], heard: [], seen: [] };
  g.radioDay = data.radioDay; g.evacWarned = data.evacWarned; g.ending = data.ending; g.duskDay = data.duskDay; g.sweepWarnDay = data.sweepWarnDay;
  g.difficulty = data.difficulty || 'normal'; g.heardAt = data.heardAt || null; g.pins = data.pins || []; g.tipsShown = data.tipsShown;
  g.fx = [];
  return g;
}

export { DOOR_HP, ITEMS, FURNITURE, ROBOTS };
