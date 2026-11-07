// Plan steps and their executors. A plan is { label, job, steps: [...], k } of plain objects so it
// saves with the game. Each executor returns 'run', 'done' or 'fail'.
import { findPath, stepCost, blocked } from '../world/path.js';
import { clamp, HOUR } from '../core/units.js';
import { makeStack, addToInv, takeFromInv, stackKg, invKg, unitNutrition, split, sameKind } from '../stacks.js';
import { spawnItem } from '../factory.js';
import { ingest, drinkWater, GLYCOGEN_MAX, STOMACH_G } from './physiology.js';
import { addThought, traitMod, skillFactor, learn } from './mind.js';
import { lightAt, roofed, rainExposure } from './environment.js';
import { addCondition } from './health.js';

// ---------- movement shared by settlers and animals
export function moveAlong(sim, e, dt, speedMps) {
  const mv = e.mv; if (!mv || mv.k >= mv.path.length) return true;
  mv.prog += dt * speedMps / 1.4;
  // A long dt can cover several hexes, so the result is the same at any system interval.
  for (;;) {
    const next = mv.path[mv.k];
    const cost = stepCost(sim, e.i, next);
    if (cost === Infinity) { e.mv = null; return 'blocked'; }
    mv.cost = cost;
    if (mv.prog < cost) return false;
    mv.prog -= cost; mv.from = e.i; sim.ents.move(e, next); mv.k++;
    if (mv.k >= mv.path.length) { mv.prog = 0; return true; }
  }
}

export function setPath(sim, e, goal, opts = {}) {
  const r = findPath(sim, e.i, goal, opts);
  if (!r) return false;
  e.mv = { path: r.path, k: 0, prog: 0, from: e.i, cost: 1, goal: typeof goal === 'number' ? goal : r.end };
  return true;
}

export function carryCapacity(sim, e) { return 28 * traitMod(sim, e, 'carry', 1) * clamp(e.body.caps.moving, 0.3, 1); }
export function cargoKg(sim, e) { return invKg(sim.defs, e.inv.filter(s => !isKit(sim, s))); }
export function isKit(sim, s) { const d = sim.defs.must('item', s.item); return !!(d.tool || d.weapon || d.bedClo || d.cat === 'medical'); }

export function settlerSpeed(sim, e) {
  const kg = invKg(sim.defs, e.inv), cap = carryCapacity(sim, e);
  let v = 1.4 * clamp(e.body.caps.moving, 0.15, 1.05);
  if (kg > cap) v *= cap / kg;
  if (e.phys.sleepiness > 0.85) v *= 0.85;
  if (e.agent.running) v *= 2.4;
  return v;
}

// Work speed for a skill and an optional tool quality.
export function workSpeed(sim, e, skill, quality = 1, fine = false) {
  let s = (skill ? skillFactor(e.skills[skill]?.lvl ?? 0) : 1) * clamp(e.body.caps.manipulation, 0.1, 1);
  s *= Math.pow(clamp(quality, 0.15, 1.5), 0.8);
  const light = lightAt(sim, e.i);
  if (light < 0.3) s *= fine ? 0.35 + light : 0.6 + light;
  s *= 1 - e.phys.cold * 0.35;
  if (e.mind.stress > 80) s *= 0.85;
  if (sim.weather.precip > 0 && rainExposure(sim, e.i) > 0.5) s *= 0.9;
  return s;
}

export function toolQuality(sim, e, q) {
  let best = 0;
  for (const s of e.inv) { const t = sim.defs.must('item', s.item).tool; if (t && t[q] > best) best = t[q]; }
  return best;
}
export function bestWeapon(sim, e) {
  let best = null;
  for (const s of e.inv) { const w = sim.defs.must('item', s.item).weapon; if (w && (!best || w.dmg > best.dmg)) best = w; }
  return best || { type: 'blunt', dmg: 3, cooldown: 1.2 };
}

// ---------- executors
const X = {};

X.goto = (sim, e, st, dt) => {
  const w = sim.world;
  const arrived = () => st.adj ? (e.i === st.i || w.dist(e.i, st.i) <= 1) : e.i === st.i;
  if (arrived()) { e.mv = null; return 'done'; }
  if (!e.mv || e.mv.goal !== st.i) {
    if (!setPath(sim, e, st.i, { adjacent: !!st.adj, maxNodes: 60000 })) return 'fail';
    e.mv.goal = st.i;
  }
  e.agent.activity = cargoKg(sim, e) > 8 ? 'carry' : e.agent.running ? 'run' : 'walk';
  const r = moveAlong(sim, e, dt, settlerSpeed(sim, e));
  if (r === 'blocked') return 'run'; // repath next tick
  return arrived() ? (e.mv = null, 'done') : 'run';
};

// Follow a moving entity until within range hexes.
X.follow = (sim, e, st, dt) => {
  const t = sim.ents.get(st.id); if (!t || t.dead) return 'fail';
  if (sim.world.dist(e.i, t.i) <= (st.range ?? 1)) { e.mv = null; return 'done'; }
  st.t = (st.t || 0) + dt; if (st.t > (st.giveUp ?? 7200)) return 'fail';
  // Repath when the path runs out, or now and then if the target has moved off the end of it. A far target
  // is repathed less often: the first few hexes of the route barely change.
  const dist = sim.world.dist(e.i, t.i);
  if (!e.mv || e.mv.k >= e.mv.path.length || ((st.repath = (st.repath || 0) - dt) <= 0 && sim.world.dist(e.mv.goal, t.i) > 1)) {
    st.repath = Math.max(6, dist * 0.6);
    if (!setPath(sim, e, t.i, { adjacent: true, maxNodes: 12000 })) return 'fail';
  }
  e.agent.activity = e.agent.running ? 'run' : 'walk';
  moveAlong(sim, e, dt, settlerSpeed(sim, e));
  return 'run';
};

X.pickup = (sim, e, st) => {
  const it = sim.ents.get(st.id);
  if (!it || it.dead || it.i !== e.i && sim.world.dist(it.i, e.i) > 1) return 'fail';
  const room = Math.max(0, carryCapacity(sim, e) * 1.15 - cargoKg(sim, e));
  const unitKg = sim.defs.must('item', it.stack.item).kg;
  let n = Math.min(st.qty ?? it.stack.qty, it.stack.qty, Math.max(1, Math.floor(room / unitKg)));
  const s = split(it.stack, n);
  addToInv(e.inv, s);
  if (it.stack.qty <= 0) sim.ents.remove(it); else it.reserved = null;
  st.got = n;
  return 'done';
};

X.pickupHere = (sim, e, st) => {
  for (const it of [...sim.ents.at(e.i)]) if (it.kind === 'item' && it.stack.item === st.item && (!it.reserved || it.reserved === e.id)) {
    addToInv(e.inv, split(it.stack, it.stack.qty)); sim.ents.remove(it);
  }
  return 'done';
};

X.drop = (sim, e, st) => {
  const out = takeFromInv(e.inv, s => s.item === st.item && (st.mat === undefined || (s.mat || '') === (st.mat || '')), st.qty ?? Infinity);
  for (const s of out) spawnItem(sim, e.i, s);
  return 'done';
};

X.dropCargo = (sim, e) => {
  for (let k = e.inv.length - 1; k >= 0; k--) if (!isKit(sim, e.inv[k])) { spawnItem(sim, e.i, e.inv[k]); e.inv.splice(k, 1); }
  return 'done';
};

X.wait = (sim, e, st, dt) => {
  e.agent.activity = st.activity || 'idle';
  st.left = (st.left ?? st.secs) - dt;
  return st.left <= 0 ? 'done' : 'run';
};

// Generic work: accumulates work seconds at the settler's speed; the job type finishes it.
X.work = (sim, e, st, dt) => {
  const jt = sim.jobTypes[st.job];
  if (jt.valid && !jt.valid(sim, e, st)) return 'fail';
  e.agent.activity = st.activity || 'build';
  const q = st.tool ? Math.max(toolQuality(sim, e, st.tool), st.minTool ?? 0.25) : 1;
  const sp = workSpeed(sim, e, st.skill, q, !!st.fine);
  st.done = (st.done || 0) + dt * sp;
  if (st.skill) learn(sim, e, st.skill, dt * 0.6);
  if (jt.tick) jt.tick(sim, e, st, dt);
  if (st.done >= st.secs) return jt.complete(sim, e, st) === false ? 'fail' : 'done';
  return 'run';
};

X.eat = (sim, e, st, dt) => {
  e.agent.activity = 'eat';
  const s = e.inv.find(x => x.item === st.item && (x.mat || '') === (st.mat || '') && !!x.nut === !!st.meal);
  if (!s) return 'done';
  st.t = (st.t || 0) + dt;
  const d = sim.defs.must('item', s.item), gPerUnit = d.kg * 1000;
  const secsPerUnit = Math.max(6, gPerUnit / 100 * 50);
  if (st.t < secsPerUnit) return 'run';
  st.t = 0;
  const p = e.phys;
  const nut = unitNutrition(sim.defs, s);
  if (p.stomach.g + gPerUnit > STOMACH_G * 1.05 || (p.hunger < 0.05 && st.eaten > 0)) return 'done';
  ingest(sim, e, nut, 1, gPerUnit);
  st.eaten = (st.eaten || 0) + 1;
  // food safety
  if (d.risk) {
    const tagCooked = (d.tags || []).includes('cooked');
    const pr = (tagCooked && d.risk.cookedP !== undefined ? d.risk.cookedP : d.risk.p) * gPerUnit / 100;
    if (sim.rng.chance(pr)) addCondition(sim, e, d.risk.cond, d.name);
  }
  if (s.fresh !== undefined && s.fresh < 0.3) {
    if (sim.rng.chance((0.3 - s.fresh) * 0.5 * gPerUnit / 100)) addCondition(sim, e, 'food_poisoning', 'spoiled ' + d.name);
    addThought(sim, e, 'ate_spoiled');
  }
  const tags = d.tags || [];
  if (st.eaten === 1) {
    if (d.id === 'stew') addThought(sim, e, 'ate_fine');
    else if (tags.includes('cooked') || tags.includes('meal')) addThought(sim, e, 'ate_cooked');
    else if (tags.includes('raw')) addThought(sim, e, 'ate_raw');
  }
  s.qty--; if (s.qty <= 0) e.inv.splice(e.inv.indexOf(s), 1);
  const target = st.units ?? 99;
  return st.eaten >= target ? 'done' : 'run';
};

X.drink = (sim, e, st, dt) => {
  e.agent.activity = 'drink';
  st.t = (st.t || 0) + dt;
  if (st.t < 12) return 'run';
  st.t = 0;
  const p = e.phys;
  if (st.fromInv) {
    const s = e.inv.find(x => x.item === 'clean_water'); if (!s) return 'done';
    drinkWater(e, 0.25); s.fresh = s.fresh; st.sipped = (st.sipped || 0) + 0.25;
    if (st.sipped >= 1 - 1e-6) { s.qty--; st.sipped = 0; if (s.qty <= 0) e.inv.splice(e.inv.indexOf(s), 1); }
  } else {
    const w = sim.world;
    if (w.water[st.i] <= 0.05) return 'fail';
    if (w.ice[st.i] > 0.06 && !st.holeCut) { st.holeCut = true; st.t = -120; return 'run'; }   // chop a hole in the ice
    drinkWater(e, 0.25);
    // untreated surface water: still water is riskier than a flowing stream
    const still = w.baseWater[st.i] > 1.6;
    if (sim.rng.chance((still ? 0.012 : 0.005) * 0.25)) addCondition(sim, e, 'gut_infection', 'untreated water');
  }
  st.l = (st.l || 0) + 0.25;
  const want = Math.max(0.5, p.waterDef + 0.4);
  return st.l >= want || p.stomach.w > 1200 ? 'done' : 'run';
};

X.sleep = (sim, e, st, dt) => {
  const p = e.phys;
  if (!p.asleep) {
    p.asleep = true; st.start = sim.tick; st.coldMax = 0; st.rained = false;
    if (st.bed) p.bedId = st.bed;
  }
  e.agent.activity = 'sleep';
  st.coldMax = Math.max(st.coldMax || 0, p.cold);
  if (sim.weather.precip > 0 && sim.weather.type !== 'snow' && rainExposure(sim, e.i) > 0.5) st.rained = true;
  const slept = (sim.tick - st.start) / HOUR;
  const wake = (p.S < 0.1 + 0.18 * (1 - p.circadian) && slept > 2) || p.S < 0.04 ||
    p.thirst > 0.8 || p.hunger > 0.92 || (p.cold > 0.65 && slept > 0.5) || slept > 14 || st.wakeNow;
  if (!wake) return 'run';
  p.asleep = false;
  const bed = st.bed ? sim.ents.get(st.bed) : null;
  if (slept > 2) {
    if (st.coldMax > 0.45) addThought(sim, e, 'slept_cold');
    if (st.rained) addThought(sim, e, 'slept_rain');
    if (bed && bed.built) addThought(sim, e, 'slept_bed'); else addThought(sim, e, 'slept_ground');
    if (sim.world.room[e.i]) addThought(sim, e, 'slept_indoors');
  }
  return 'done';
};

// Stand by a fire or shelter until warm and dry.
X.warm = (sim, e, st, dt) => {
  e.agent.activity = st.exercise ? 'build' : 'rest';
  st.t = (st.t || 0) + dt;
  const p = e.phys;
  if (st.fire) { const f = sim.ents.get(st.fire); if (!f || !f.lit) return 'done'; if ((st.th = (st.th || 0) + dt) > 600) { st.th = 0; addThought(sim, e, 'fireside'); } }
  if ((p.cold < 0.08 && p.wet < 0.25) || st.t > (st.max ?? 5400) || p.thirst > 0.75 || p.hunger > 0.8 || p.sleepiness > 0.8) return 'done';
  return 'run';
};

X.deliver = (sim, e, st) => {
  const bp = sim.ents.get(st.bp); if (!bp || bp.dead) return 'fail';
  sim.construction.deliver(sim, e, bp);
  return 'done';
};

X.attack = (sim, e, st, dt) => {
  const t = sim.ents.get(st.id); if (!t || t.dead || !t.body.alive) return 'done';
  const wpn = bestWeapon(sim, e);
  const dist = sim.world.dist(e.i, t.i);
  const reach = st.thrown && wpn.thrown ? wpn.thrown : (wpn.reach || 1);
  if (dist > reach) return 'fail';
  e.agent.activity = 'fight';
  e.agent.attackCd = (e.agent.attackCd || 0) - dt;
  if (e.agent.attackCd > 0) return 'run';
  e.agent.attackCd = wpn.cooldown / clamp(e.body.caps.manipulation, 0.2, 1);
  sim.combat.attack(sim, e, t, wpn, dist);
  st.swings = (st.swings || 0) + 1;
  if (!t.body.alive) return 'done';
  return st.swings >= (st.maxSwings || 12) ? 'done' : 'run';
};

export const EXECUTORS = X;

export function runPlan(sim, e, dt) {
  const plan = e.agent.plan; if (!plan) return 'none';
  const st = plan.steps[plan.k];
  if (!st) { e.agent.plan = null; return 'done'; }
  const ex = X[st.a]; if (!ex) throw new Error('no executor ' + st.a);
  const r = ex(sim, e, st, dt);
  if (r === 'done') { plan.k++; if (plan.k >= plan.steps.length) return 'done'; return 'run'; }
  return r;
}
