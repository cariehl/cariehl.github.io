// The simulation: world, entities, systems, the command API and saving. Runs in Node and the browser.
import { Rng } from './core/rng.js';
import { Events } from './core/events.js';
import { Entities } from './core/entities.js';
import { Scheduler } from './core/scheduler.js';
import { DAY, HOUR } from './core/units.js';
import { buildRegistry } from '../data/index.js';
import { CALENDAR, CLIMATE } from '../data/climate.js';
import { generateWorld } from './world/worldgen.js';
import { MUTABLE_FIELDS, DESIG } from './world/world.js';
import { passable, blocked } from './world/path.js';
import { timeSystem, computeTime } from './systems/time.js';
import { weatherSystem, initWeather } from './systems/weather.js';
import { environmentSystem } from './systems/environment.js';
import { hydrologySystem } from './systems/hydrology.js';
import { plantsSystem } from './systems/plants.js';
import { fireSystem } from './systems/fire.js';
import { physiologySystem } from './systems/physiology.js';
import { healthSystem, healthApi } from './systems/health.js';
import { mindSystem, addThought } from './systems/mind.js';
import { itemsSystem } from './systems/items.js';
import { aiSystem, aiApi } from './systems/ai.js';
import { animalsSystem, populationSystem, animalsApi } from './systems/animals.js';
import { combatApi } from './systems/combat.js';
import { constructionApi } from './systems/construction.js';
import { craftingApi } from './systems/crafting.js';
import { visionSystem } from './systems/vision.js';
import { roomsSystem } from './systems/rooms.js';
import { JOB_TYPES } from './systems/jobs.js';
import { spawnItem } from './factory.js';
import { makeStack } from './stacks.js';
import { COMMANDS } from './commands.js';

export function createSim({ seed = 1, W = 192, H = 192, defs = buildRegistry(), world = null } = {}) {
  const sim = {
    seed, defs, tick: 0, cal: CALENDAR, climate: CLIMATE,
    rng: new Rng(seed), events: new Events(), ents: new Entities(),
    world: world || generateWorld(defs, { seed, W, H }),
    zones: new Map(), nextZone: 1, bills: [], nextBill: 1, claims: new Map(), desigSet: new Set(),
    fires: new Set(), heat: new Map(), light: new Map(), rooms: new Map(), roomsDirty: true,
    homeCenter: -1, gameState: {},
    jobTypes: JOB_TYPES, health: healthApi, ai: aiApi, animals: animalsApi, combat: combatApi,
    construction: constructionApi, crafting: craftingApi,
  };
  const st = CALENDAR.start;
  sim.startClock = ((st.season * CALENDAR.daysPerSeason + st.day - 1) * 24 + st.hour) * HOUR;
  sim.t = computeTime(sim);
  // Reference elevation for the lapse rate: the valley floor.
  sim.refElev = sim.world.elevMin ?? 0;
  let land = 0; for (let i = 0; i < sim.world.N; i++) if (passable(sim, i) && sim.world.water[i] < 0.05) land++;
  sim.landHexes = land;
  initWeather(sim);
  sim.scheduler = new Scheduler()
    .add(timeSystem).add(weatherSystem).add(environmentSystem).add(roomsSystem).add(hydrologySystem)
    .add(plantsSystem).add(fireSystem).add(physiologySystem).add(healthSystem).add(mindSystem)
    .add(itemsSystem).add(aiSystem).add(animalsSystem).add(populationSystem).add(visionSystem);
  sim.onDeath = (e, cause) => onDeath(sim, e, cause);
  sim.step = () => step(sim);
  sim.run = (seconds) => { for (let k = 0; k < seconds; k++) step(sim); };
  sim.command = (name, args = {}) => command(sim, name, args);
  if (!world) settlePlants(sim);
  return sim;
}

// Give wild plants the yields they would have at this time of year.
function settlePlants(sim) {
  const w = sim.world, yf = sim.t.yearFrac;
  for (let i = 0; i < w.N; i++) {
    const f = w.flora[i] ? sim.defs.at('flora', w.flora[i]) : null; if (!f?.yield || f.crop) continue;
    const max = f.yield.max * (f.form === 'tree' || f.form === 'conifer' ? Math.max(0.3, w.growth[i]) : 1);
    const win = f.yield.window;
    if (!win) w.yield[i] = max * sim.rng.range(0.4, 1);
    else if (yf >= win[0] && yf <= win[1]) w.yield[i] = max * Math.min(1, (yf - win[0]) / ((win[1] - win[0]) * 0.3));
  }
}

function step(sim) {
  sim.tick++;
  sim.scheduler.step(sim);
}

function command(sim, name, args) {
  const c = COMMANDS[name];
  if (!c) return { ok: false, err: `Unknown command ${name}` };
  try {
    const r = c(sim, args || {});
    if (typeof r === 'string') return { ok: false, err: r };
    sim.events.emit('command', { name, args });
    return { ok: true, ...(r && typeof r === 'object' ? r : {}) };
  } catch (err) {
    return { ok: false, err: err.message };
  }
}

function onDeath(sim, e, cause) {
  const w = sim.world;
  if (e.kind === 'settler') {
    sim.ai.release(sim, e);
    for (const s of e.inv) spawnItem(sim, e.i, s);
    for (const s of Object.values(e.equip)) if (s) spawnItem(sim, e.i, s);
    e.inv = []; for (const k of Object.keys(e.equip)) e.equip[k] = null;
    for (const o of sim.ents.of('settler')) {
      if (o === e || !o.body.alive) continue;
      addThought(sim, o, 'friend_died');
      if (w.dist(o.i, e.i) < 12) addThought(sim, o, 'saw_death');
    }
    sim.ents.remove(e);
    sim.dead = sim.dead || []; sim.dead.push({ name: e.name, cause, day: sim.t.day, tick: sim.tick });
    sim.ents.add({ kind: 'corpse', human: true, name: e.name, i: e.i, massKg: e.phys.lean + e.phys.fat, fresh: 1, color: e.color });
  } else if (e.kind === 'animal') {
    sim.ents.remove(e);
    sim.ents.add({ kind: 'corpse', species: e.species, i: e.i, massKg: e.massKg, fresh: 1, colony: e.lastHitBy === 'settler' || e.hunt || (sim.homeCenter >= 0 && w.dist(e.i, sim.homeCenter) < 20) });
  }
}

// ---------- saving: mutable world fields as base64, everything else as JSON
function toB64(arr) {
  const bytes = new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
  if (typeof Buffer !== 'undefined') return Buffer.from(bytes).toString('base64');
  let s = ''; for (let k = 0; k < bytes.length; k += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(k, k + 0x8000));
  return btoa(s);
}
function fromB64(str, T) {
  let bytes;
  if (typeof Buffer !== 'undefined') bytes = new Uint8Array(Buffer.from(str, 'base64'));
  else { const s = atob(str); bytes = new Uint8Array(s.length); for (let k = 0; k < s.length; k++) bytes[k] = s.charCodeAt(k); }
  return new T(bytes.buffer, 0, bytes.byteLength / T.BYTES_PER_ELEMENT);
}

export function serialize(sim) {
  const w = sim.world, fields = {};
  for (const k of Object.keys(MUTABLE_FIELDS)) fields[k] = toB64(w[k]);
  fields.elev = toB64(w.elev); // mining and river carving change it
  return {
    v: 1, seed: sim.seed, W: w.W, H: w.H, tick: sim.tick, rng: sim.rng.s, fields,
    ents: sim.ents.toJSON(), weather: sim.weather, zones: [...sim.zones.values()].map(z => ({ ...z, tiles: [...z.tiles] })),
    nextZone: sim.nextZone, bills: sim.bills, nextBill: sim.nextBill, fires: [...sim.fires], homeCenter: sim.homeCenter,
    dead: sim.dead || [], gameState: sim.gameState,
  };
}

export function deserialize(o, defs = buildRegistry()) {
  const world = generateWorld(defs, { seed: o.seed, W: o.W, H: o.H });
  for (const [k, T] of Object.entries(MUTABLE_FIELDS)) if (o.fields[k]) world[k].set(fromB64(o.fields[k], T));
  if (o.fields.elev) world.elev.set(fromB64(o.fields.elev, Float32Array));
  const sim = createSim({ seed: o.seed, W: o.W, H: o.H, defs, world });
  sim.tick = o.tick; sim.rng.s = o.rng; sim.t = computeTime(sim);
  sim.ents = Entities.fromJSON(o.ents);
  sim.weather = o.weather;
  for (const z of o.zones) sim.zones.set(z.id, { ...z, tiles: new Set(z.tiles) });
  sim.nextZone = o.nextZone; sim.bills = o.bills; sim.nextBill = o.nextBill;
  sim.fires = new Set(o.fires); sim.homeCenter = o.homeCenter; sim.dead = o.dead; sim.gameState = o.gameState || {};
  for (let i = 0; i < world.N; i++) if (world.desig[i]) sim.desigSet.add(i);
  // plans hold reservations and claims: rebuild claims from plans
  for (const e of sim.ents.of('settler')) if (e.agent.plan?.claim) sim.claims.set(e.agent.plan.claim, e.id);
  sim.roomsDirty = true;
  world.version++;
  return sim;
}
