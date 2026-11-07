// Work. Each labor has work givers: functions that look at the world and return a plan for one settler,
// or null. Each job type has a complete() that changes the world when the work is done. Adding a kind of
// work means adding a giver and a job type here; the AI picks givers by the settler's labor priorities.
import { DESIG } from '../world/world.js';
import { makeStack, addToInv, takeFromInv, countInv, matches, stackKg, unitNutrition, describe } from '../stacks.js';
import { spawnItem } from '../factory.js';
import { killPlant } from './plants.js';
import { addThought, learn } from './mind.js';
import { toolQuality, bestWeapon, carryCapacity, cargoKg, isKit } from './actions.js';
import { stockpileZone, isStored } from './items.js';
import { extinguish } from './fire.js';
import { outdoorTemp } from './environment.js';
import { clamp, DAY, HOUR } from '../core/units.js';
import { recompute } from './health.js';
import { blocked, passable } from '../world/path.js';

const near = (sim, e, list, f = (x) => x) => list.map(x => [x, sim.world.dist(e.i, f(x))]).sort((a, b) => a[1] - b[1]).map(x => x[0]);
const claimed = (sim, key, e) => { const c = sim.claims.get(key); return c && c !== e.id && sim.ents.get(c)?.agent?.plan?.claim === key; };
const unreachable = (e, key, sim) => { const t = e.agent.unreach?.[key]; return t && sim.tick - t < 1800; };
const MAX_JOB_DIST = 70;

// ---------- items: finding sources
export function freeItems(sim, e, pred) {
  const out = [];
  for (const it of sim.ents.of('item')) {
    if (it.reserved && it.reserved !== e.id) continue;
    if (it.forbidden || !pred(it.stack)) continue;
    if (unreachable(e, 'item:' + it.id, sim)) continue;
    out.push(it);
  }
  return near(sim, e, out, x => x.i);
}

// Steps to collect qty units matching spec into the settler's pack, from pack first, then the ground.
// Returns { steps, reserve } or null if the colony does not have enough.
export function collect(sim, e, spec, qty, maxDist = MAX_JOB_DIST) {
  const pred = typeof spec === 'function' ? spec : (s) => matches(sim.defs, s, spec);
  let have = countInv(e.inv, pred);
  const steps = [], reserve = [];
  if (have >= qty) return { steps, reserve };
  for (const it of freeItems(sim, e, pred)) {
    if (sim.world.dist(e.i, it.i) > maxDist) break;
    const take = Math.min(it.stack.qty, qty - have);
    steps.push({ a: 'goto', i: it.i }, { a: 'pickup', id: it.id, qty: take });
    reserve.push(it.id); have += take;
    if (have >= qty) return { steps, reserve };
  }
  return null;
}

export function bestToolItem(sim, e, q) {
  let best = null, bq = 0;
  for (const it of freeItems(sim, e, s => (sim.defs.must('item', s.item).tool?.[q] || 0) > 0)) {
    const v = sim.defs.must('item', it.stack.item).tool[q] - sim.world.dist(e.i, it.i) * 0.004;
    if (v > bq) { bq = v; best = it; }
  }
  return best;
}

// Prepend steps to fetch a tool if the settler does not carry one good enough.
function withTool(sim, e, q, min, plan) {
  const have = toolQuality(sim, e, q);
  const it = bestToolItem(sim, e, q);
  const better = it && sim.defs.must('item', it.stack.item).tool[q] > have + 0.2;
  if (have >= min && !better) return plan;
  if (!it) return have >= min ? plan : null;
  plan.steps.unshift({ a: 'goto', i: it.i }, { a: 'pickup', id: it.id, qty: 1 });
  plan.reserve = (plan.reserve || []).concat(it.id);
  return plan;
}

// ---------- job types
export const JOB_TYPES = {};

JOB_TYPES.chop = {
  valid: (sim, e, st) => !!sim.world.flora[st.i],
  complete(sim, e, st) {
    const w = sim.world, f = sim.defs.at('flora', w.flora[st.i]);
    if (f.chop) {
      const g = w.growth[st.i];
      const logs = f.chop.logs ? Math.max(g > 0.3 ? 1 : 0, Math.round(f.chop.logs * g)) : 0;
      if (logs) spawnItem(sim, st.i, makeStack(sim.defs, f.chop.item === 'log' ? 'log' : f.chop.item, logs, f.chop.mat ? { mat: f.chop.mat } : {}));
      const sticks = Math.round((f.chop.sticks ?? (f.chop.item === 'stick' ? f.chop.qty : 0)) * Math.max(0.3, g));
      if (sticks) spawnItem(sim, st.i, makeStack(sim.defs, 'stick', sticks));
      sim.events.emit('felled', { id: e.id, i: st.i, flora: f.id, logs });
    } else if (f.yield && w.yield[st.i] >= 1) spawnItem(sim, st.i, makeStack(sim.defs, f.yield.item, Math.floor(w.yield[st.i])));
    killPlant(sim, st.i, 'cleared');
    w.desig[st.i] &= ~(DESIG.chop | DESIG.clear);
    sim.desigDirty = true;
  },
};

JOB_TYPES.gather = {
  valid: (sim, e, st) => sim.world.yield[st.i] >= 1,
  complete(sim, e, st) {
    const w = sim.world, f = sim.defs.at('flora', w.flora[st.i]); if (!f || !f.yield) return false;
    const n = Math.min(Math.floor(w.yield[st.i]), st.units);
    if (n <= 0) return false;
    w.yield[st.i] -= n;
    // the order is done once the plant is picked clean; mark it again when it has regrown
    if (w.yield[st.i] < 1) w.desig[st.i] &= ~DESIG.gather;
    if (f.yield.verb === 'dig') w.regrow[st.i] = f.yield.regrowDays;
    const q = 1 + (e.skills.foraging.lvl - 5) * 0.02;
    spawnItem(sim, st.i, makeStack(sim.defs, f.yield.item, n));
    sim.events.emit('gathered', { id: e.id, item: f.yield.item, qty: n });
  },
};

JOB_TYPES.mine = {
  valid: (sim, e, st) => sim.defs.at('terrain', sim.world.terrain[st.i]).tags.includes('mineable'),
  complete(sim, e, st) {
    const w = sim.world, mat = sim.defs.at('material', w.bedrock[st.i]);
    w.terrain[st.i] = sim.defs.must('terrain', 'quarried').index; w.desig[st.i] &= ~DESIG.mine; w.version++; sim.desigDirty = true;
    spawnItem(sim, st.i, makeStack(sim.defs, 'stone', 3 + sim.rng.int(3), { mat: mat.id }));
    if (sim.rng.chance(mat.id === 'limestone' ? 0.45 : 0.12)) spawnItem(sim, st.i, makeStack(sim.defs, 'flint', 1 + sim.rng.int(2)));
    if (sim.rng.chance(0.15)) spawnItem(sim, st.i, makeStack(sim.defs, 'clay_lump', 1));
    sim.events.emit('mined', { id: e.id, i: st.i, mat: mat.id });
  },
};

JOB_TYPES.till = {
  complete(sim, e, st) {
    const w = sim.world;
    if (w.flora[st.i]) killPlant(sim, st.i, 'tilled');
    w.terrain[st.i] = sim.defs.must('terrain', 'tilled').index; w.version++;
  },
};

JOB_TYPES.sow = {
  complete(sim, e, st) {
    const w = sim.world, f = sim.defs.must('flora', st.crop);
    const got = takeFromInv(e.inv, s => s.item === f.seed, 1);
    if (!got.length || w.flora[st.i]) return false;
    w.flora[st.i] = f.index; w.growth[st.i] = 0; w.yield[st.i] = 0; w.regrow[st.i] = 0; w.version++;
  },
};

JOB_TYPES.harvest = {
  valid: (sim, e, st) => sim.world.growth[st.i] >= 1,
  complete(sim, e, st) {
    const w = sim.world, f = sim.defs.at('flora', w.flora[st.i]); if (!f || !f.crop) return false;
    const n = Math.max(1, Math.round(w.yield[st.i] * (0.85 + e.skills.farming.lvl * 0.015)));
    spawnItem(sim, st.i, makeStack(sim.defs, f.yield.item, n));
    if (f.seed) spawnItem(sim, st.i, makeStack(sim.defs, f.seed, f.yield.seedsBack + (sim.rng.chance(0.5) ? 1 : 0)));
    killPlant(sim, st.i, 'harvested');
    sim.events.emit('harvested', { id: e.id, i: st.i, crop: f.id, qty: n });
    addThought(sim, e, 'harvest');
  },
};

JOB_TYPES.build = {
  valid: (sim, e, st) => { const bp = sim.ents.get(st.bp); return bp && !bp.dead && sim.construction.ready(sim, bp); },
  complete(sim, e, st) { const bp = sim.ents.get(st.bp); if (!bp) return false; sim.construction.complete(sim, bp, e); addThought(sim, e, 'built_home'); },
};

JOB_TYPES.craft = {
  valid: (sim, e, st) => {
    const b = st.station ? sim.ents.get(st.station) : null;
    if (st.station && (!b || b.dead)) return false;
    const r = sim.defs.must('recipe', st.recipe);
    if (r.station === 'campfire' && !b.lit) return false;
    return true;
  },
  complete(sim, e, st) { return sim.crafting.finish(sim, e, st); },
};

JOB_TYPES.butcher = {
  valid: (sim, e, st) => { const c = sim.ents.get(st.corpse); return c && !c.dead; },
  complete(sim, e, st) {
    const c = sim.ents.get(st.corpse); if (!c) return false;
    const d = sim.defs.must('fauna', c.species), b = d.butcher;
    const skill = 0.75 + e.skills.butchery.lvl * 0.015, spoiled = (c.fresh ?? 1) < 0;
    const eaten = c.eaten || 0;
    const meat = Math.round(c.massKg * b.meatFrac * (1 - eaten) * skill / 0.5);
    if (meat > 0 && !spoiled) spawnItem(sim, c.i, makeStack(sim.defs, 'raw_meat', meat, { fresh: Math.max(0.2, c.fresh ?? 1) }));
    if (b.fat && !spoiled) spawnItem(sim, c.i, makeStack(sim.defs, 'animal_fat', Math.max(1, Math.round(b.fat * skill * (c.massKg / d.massKg))), { fresh: Math.max(0.2, c.fresh ?? 1) }));
    if (b.hide && (c.fresh ?? 1) > -0.5) spawnItem(sim, c.i, makeStack(sim.defs, b.hideSmall ? 'pelt' : 'hide', b.hide, { mat: b.hideMat }));
    if (b.bone) spawnItem(sim, c.i, makeStack(sim.defs, 'bone', Math.round(b.bone * (c.massKg / d.massKg))));
    // A kill far from camp is worth the long walk: haulers fetch these from further than usual.
    for (const it of sim.ents.at(c.i)) if (it.kind === 'item') it.fromKill = true;
    sim.ents.remove(c);
    addThought(sim, e, 'butchered');
    sim.events.emit('butchered', { id: e.id, species: c.species, meat });
  },
};

JOB_TYPES.tend = {
  valid: (sim, e, st) => { const p = sim.ents.get(st.patient); return p && p.body.alive && needsTending(p); },
  complete(sim, e, st) {
    const p = sim.ents.get(st.patient);
    const skill = 0.6 + e.skills.medicine.lvl * 0.04;
    let used = null;
    const ban = e.inv.find(s => sim.defs.must('item', s.item).medical);
    const d = ban ? sim.defs.must('item', ban.item) : null;
    let n = 0;
    for (const w of p.body.wounds) {
      if (w.treated && !(w.inf > 0.1 && d?.antiseptic && !w.antiseptic)) continue;
      w.treated = clamp((d ? d.medical : 0.35) * skill, 0.2, 1.2);
      if (d?.antiseptic) w.antiseptic = d.antiseptic * skill;
      w.bleed *= 0.3; n++;
    }
    if (ban && n) { ban.qty -= Math.ceil(n / 2) > ban.qty ? ban.qty : Math.ceil(n / 2); if (ban.qty <= 0) e.inv.splice(e.inv.indexOf(ban), 1); }
    learn(sim, e, 'medicine', 300);
    recompute(sim, p);
    if (p.kind === 'settler') addThought(sim, p, 'treated');
    sim.events.emit('tended', { id: e.id, patient: p.id, wounds: n });
  },
};

JOB_TYPES.refuel = {
  valid: (sim, e, st) => { const b = sim.ents.get(st.fire); return b && !b.dead && b.built; },
  complete(sim, e, st) {
    const b = sim.ents.get(st.fire), d = sim.defs.must('structure', b.def);
    let room = d.fire.maxKg - b.fuel;
    for (let k = e.inv.length - 1; k >= 0 && room > 0.3; k--) {
      const s = e.inv[k], id = sim.defs.must('item', s.item);
      if (!(id.tags || []).includes('fuel')) continue;
      const n = Math.min(s.qty, Math.max(1, Math.floor(room / id.kg)));
      b.fuel += n * id.kg * ((id.fuelMJ || 15) / 15); room -= n * id.kg; s.qty -= n;
      if (s.qty <= 0) e.inv.splice(k, 1);
    }
    if (!b.lit && b.fuel > 0.5) {
      const q = toolQuality(sim, e, 'fire');
      if (q > 0 && (sim.weather.precip < 2 || sim.world.roof[b.i])) { b.lit = true; sim.events.emit('fire_lit', { id: b.id, by: e.id }); }
    }
  },
};

JOB_TYPES.firefight = {
  valid: (sim, e, st) => sim.world.fire[st.i] > 0,
  tick(sim, e, st, dt) {
    const w = sim.world;
    w.fire[st.i] = Math.max(0, w.fire[st.i] - dt * 0.004 * (1 + e.skills.melee.lvl * 0.02));
    if (w.fire[st.i] <= 0.02) { extinguish(sim, st.i); st.done = st.secs; }
    if (sim.rng.chance(0.002 * dt * w.fire[st.i])) sim.health.wound(sim, e, sim.rng.pick(['lArm', 'rArm']), 'burn', sim.rng.range(1, 3), 'fire');
  },
  complete(sim, e, st) { if (sim.world.fire[st.i] > 0.02) return false; },
};

JOB_TYPES.fish = {
  complete(sim, e, st) {
    const p = 0.3 + e.skills.fishing.lvl * 0.035;
    if (sim.rng.chance(p)) { const n = 1 + sim.rng.int(3); spawnItem(sim, e.i, makeStack(sim.defs, 'fish', n)); sim.events.emit('fished', { id: e.id, qty: n }); }
  },
};

JOB_TYPES.bury = {
  complete(sim, e, st) { const c = sim.ents.get(st.corpse); if (c) { sim.ents.remove(c); sim.events.emit('buried', { id: e.id, name: c.name }); } },
};

export function needsTending(p) {
  return p.body.wounds.some(w => (!w.treated && (w.bleed > 0.2 || w.sev > 1.5) && w.type !== 'blunt') || (w.inf > 0.15 && !w.antiseptic));
}

// ---------- givers
function desigTiles(sim, bit) {
  const out = [];
  for (const i of sim.desigSet) if (sim.world.desig[i] & bit) out.push(i);
  return out;
}

function tileJob(sim, e, bit, type, make) {
  for (const i of near(sim, e, desigTiles(sim, bit))) {
    if (sim.world.dist(e.i, i) > MAX_JOB_DIST) break;
    const key = type + ':' + i;
    if (claimed(sim, key, e) || unreachable(e, key, sim)) continue;
    const p = make(i, key); if (p) return p;
  }
  return null;
}

const G = {};
G.chop = (sim, e) => tileJob(sim, e, DESIG.chop | DESIG.clear, 'chop', (i, key) => {
  const w = sim.world, f = sim.defs.at('flora', w.flora[i]); if (!f) { w.desig[i] &= ~(DESIG.chop | DESIG.clear); return null; }
  const tree = f.form === 'tree' || f.form === 'conifer';
  const secs = f.chop ? f.chop.work * (tree ? Math.max(0.3, w.growth[i]) : 1) : 60;
  const plan = { label: f.chop ? `Felling ${f.name}` : `Clearing ${f.name}`, claim: key, steps: [
    { a: 'goto', i, adj: true }, { a: 'work', job: 'chop', i, secs, skill: 'woodcutting', activity: 'chop', tool: f.chop ? 'chop' : null, minTool: tree ? 0.12 : 0.6 }] };
  return tree ? withTool(sim, e, 'chop', 0.3, plan) : plan;
});

G.forage = (sim, e) => tileJob(sim, e, DESIG.gather, 'gather', (i, key) => {
  const w = sim.world, f = sim.defs.at('flora', w.flora[i]);
  if (!f || !f.yield) { w.desig[i] &= ~DESIG.gather; return null; }
  if (w.yield[i] < 1) return null;
  if (f.yield.frozenBlocks && (w.snow[i] > 0.25 || outdoorTemp(sim, i) < -4)) return null;
  const unitKg = sim.defs.must('item', f.yield.item).kg;
  const units = Math.min(Math.floor(w.yield[i]), 30);
  const per = f.yield.verb === 'dig' ? 150 : unitKg > 0.3 ? 45 : 30 + unitKg * 300;
  const plan = { label: `${f.yield.verb === 'dig' ? 'Digging' : 'Gathering'} ${sim.defs.must('item', f.yield.item).plural || f.yield.item}`, claim: key, steps: [
    { a: 'goto', i }, { a: 'work', job: 'gather', i, units, secs: per * units, skill: 'foraging', activity: f.yield.verb === 'dig' ? 'dig' : 'gather', tool: f.yield.verb === 'dig' ? 'dig' : null, minTool: 0.35 }] };
  return f.yield.verb === 'dig' ? withTool(sim, e, 'dig', 0, plan) : plan;
});

G.mine = (sim, e) => tileJob(sim, e, DESIG.mine, 'mine', (i, key) => {
  if (!sim.defs.at('terrain', sim.world.terrain[i]).tags.includes('mineable')) { sim.world.desig[i] &= ~DESIG.mine; return null; }
  const plan = { label: 'Quarrying stone', claim: key, steps: [{ a: 'goto', i, adj: true }, { a: 'work', job: 'mine', i, secs: 4000, skill: 'mining', activity: 'mine', tool: 'mine', minTool: 0.1 }] };
  return withTool(sim, e, 'mine', 0.3, plan);
});

G.fish = (sim, e) => {
  if (!toolQuality(sim, e, 'fish') && !bestToolItem(sim, e, 'fish')) return null;
  return tileJob(sim, e, DESIG.fish, 'fish', (i, key) => withTool(sim, e, 'fish', 0.5, { label: 'Fishing', claim: key, steps: [
    { a: 'goto', i, adj: true }, { a: 'work', job: 'fish', i, secs: 1800, skill: 'fishing', activity: 'fish' }] }));
};

G.hunt = (sim, e) => {
  for (const a of near(sim, e, [...sim.ents.of('animal')].filter(a => a.hunt && a.body.alive), x => x.i)) {
    if (sim.world.dist(e.i, a.i) > 90) break;
    const key = 'hunt:' + a.id; if (claimed(sim, key, e) || unreachable(e, key, sim)) continue;
    const plan = { label: `Hunting a ${sim.defs.must('fauna', a.species).name}`, claim: key, hunt: a.id, steps: [
      { a: 'follow', id: a.id, range: 1, giveUp: 5400, stalk: true }, { a: 'attack', id: a.id, maxSwings: 6 }] };
    // Prefer a spear; a knife or hatchet will do.
    if (!e.inv.some(s => sim.defs.must('item', s.item).weapon)) {
      const w = freeItems(sim, e, s => !!sim.defs.must('item', s.item).weapon)[0];
      if (!w) return null;
      plan.steps.unshift({ a: 'goto', i: w.i }, { a: 'pickup', id: w.id, qty: 1 }); plan.reserve = [w.id];
    }
    const wpn = bestWeapon(sim, e);
    if (wpn.thrown) { plan.steps[plan.steps.length - 2].range = wpn.thrown; plan.steps[plan.steps.length - 1].thrown = true; }
    return plan;
  }
  return null;
};

G.butcher = (sim, e) => {
  for (const c of near(sim, e, [...sim.ents.of('corpse')].filter(c => !c.human && (c.colony || c.butcher) && (c.fresh ?? 1) > -0.6), x => x.i)) {
    if (sim.world.dist(e.i, c.i) > MAX_JOB_DIST) break;
    const key = 'butcher:' + c.id; if (claimed(sim, key, e) || unreachable(e, key, sim)) continue;
    const d = sim.defs.must('fauna', c.species);
    const plan = { label: `Butchering a ${d.name}`, claim: key, steps: [{ a: 'goto', i: c.i }, { a: 'work', job: 'butcher', corpse: c.id, secs: d.butcher.work, skill: 'butchery', activity: 'butcher', tool: 'butcher', minTool: 0.2 }] };
    return withTool(sim, e, 'butcher', 0.3, plan);
  }
  return null;
};

G.doctor = (sim, e) => {
  for (const p of near(sim, e, [...sim.ents.of('settler')].filter(p => p.body.alive && needsTending(p)), x => x.i)) {
    const key = 'tend:' + p.id; if (claimed(sim, key, e) || unreachable(e, key, sim)) continue;
    const steps = [];
    const plan = { label: p === e ? 'Tending own wounds' : `Tending ${p.name.split(' ')[0]}`, claim: key, steps, reserve: [] };
    const infected = p.body.wounds.some(w => w.inf > 0.15 && !w.antiseptic);
    if (!e.inv.some(s => sim.defs.must('item', s.item).medical)) {
      const it = freeItems(sim, e, s => !!sim.defs.must('item', s.item).medical && (!infected || !!sim.defs.must('item', s.item).antiseptic))[0]
        || freeItems(sim, e, s => !!sim.defs.must('item', s.item).medical)[0];
      if (it) { steps.push({ a: 'goto', i: it.i }, { a: 'pickup', id: it.id, qty: 2 }); plan.reserve.push(it.id); }
    }
    if (p !== e) steps.push({ a: 'follow', id: p.id, range: 1, giveUp: 1200 });
    steps.push({ a: 'work', job: 'tend', patient: p.id, secs: 240 + 120 * p.body.wounds.length, skill: 'medicine', activity: 'doctor', fine: true });
    return plan;
  }
  return null;
};

G.firefight = (sim, e) => {
  if (!sim.fires.size) return null;
  const home = sim.homeCenter;
  for (const i of near(sim, e, [...sim.fires])) {
    if (home >= 0 && sim.world.dist(home, i) > 30) continue;
    const key = 'fire:' + i; if (claimed(sim, key, e)) continue;
    return { label: 'Fighting a fire', claim: key, steps: [{ a: 'goto', i, adj: true }, { a: 'work', job: 'firefight', i, secs: 600, activity: 'firefight' }] };
  }
  return null;
};

G.build = (sim, e) => {
  for (const bp of near(sim, e, [...sim.ents.of('blueprint')], x => x.i)) {
    if (sim.world.dist(e.i, bp.i) > MAX_JOB_DIST) break;
    const key = 'build:' + bp.id; if (claimed(sim, key, e) || unreachable(e, key, sim)) continue;
    if (sim.world.flora[bp.i] && sim.defs.at('flora', sim.world.flora[bp.i]).chop) continue; // waits for felling
    const d = sim.defs.must('structure', bp.def);
    const adj = d.type === 'wall' || d.type === 'door' || (d.type === 'building' && !d.passable);
    const missing = sim.construction.missing(sim, bp);
    if (missing.length) {
      const m = missing[0], unitKg = m.spec.item ? sim.defs.must('item', m.spec.item).kg : 1;
      const qty = Math.min(m.qty, Math.max(1, Math.floor((carryCapacity(sim, e) - cargoKg(sim, e)) / unitKg)));
      const c = collect(sim, e, m.spec, qty);
      if (!c) { const f = forageSource(sim, e, m.spec, bp.i); if (f) return { label: `Gathering ${sim.defs.must('item', f.item).plural || f.item} for a ${d.name.toLowerCase()}`, claim: key, steps: [...f.steps, { a: 'goto', i: bp.i, adj }, { a: 'deliver', bp: bp.id }] }; continue; }
      return { label: `Carrying materials for a ${d.name.toLowerCase()}`, claim: key, reserve: c.reserve, steps: [...c.steps, { a: 'goto', i: bp.i, adj }, { a: 'deliver', bp: bp.id }] };
    }
    if (!sim.construction.ready(sim, bp)) continue;
    const plan = { label: `Building a ${d.name.toLowerCase()}`, claim: key, steps: [{ a: 'goto', i: bp.i, adj }, { a: 'work', job: 'build', bp: bp.id, secs: d.work, skill: d.skill, activity: 'build' }] };
    if (d.needs) for (const [q, min] of Object.entries(d.needs)) if (!withTool(sim, e, q, min, plan)) return null;
    return plan;
  }
  return null;
};

G.farm = (sim, e) => {
  const w = sim.world;
  const sowSeason = sim.t.yearFrac < 0.42;
  for (const z of sim.zones.values()) {
    if (z.type !== 'farm' || !z.crop) continue;
    const crop = sim.defs.must('flora', z.crop);
    for (const i of near(sim, e, [...z.tiles])) {
      if (w.dist(e.i, i) > MAX_JOB_DIST) break;
      const t = sim.defs.at('terrain', w.terrain[i]);
      const f = w.flora[i] ? sim.defs.at('flora', w.flora[i]) : null;
      if (f && f.crop && w.growth[i] >= 1) {
        const key = 'harvest:' + i; if (claimed(sim, key, e)) continue;
        return { label: `Harvesting ${f.name}`, claim: key, steps: [{ a: 'goto', i }, { a: 'work', job: 'harvest', i, secs: 400, skill: 'farming', activity: 'farm' }] };
      }
      if (f && f.crop) continue;
      if (!t.tags.includes('tilled')) {
        if (!t.tags.includes('diggable')) continue;
        if (f && f.chop) continue;
        const key = 'till:' + i; if (claimed(sim, key, e)) continue;
        if (!sowSeason && sim.t.yearFrac < 0.85) continue;
        return withTool(sim, e, 'dig', 0, { label: 'Tilling soil', claim: key, steps: [{ a: 'goto', i }, { a: 'work', job: 'till', i, secs: 1500, skill: 'farming', activity: 'dig', tool: 'dig', minTool: 0.25 }] });
      }
      if (!sowSeason || outdoorTemp(sim, i) < crop.growth.baseC + 1) continue;
      const key = 'sow:' + i; if (claimed(sim, key, e)) continue;
      const c = collect(sim, e, { item: crop.seed }, 1); if (!c) break;
      return { label: `Sowing ${crop.name}`, claim: key, reserve: c.reserve, steps: [...c.steps, { a: 'goto', i }, { a: 'work', job: 'sow', i, crop: crop.id, secs: 150, skill: 'farming', activity: 'farm' }] };
    }
  }
  return null;
};

G.refuel = (sim, e) => {
  const anyCold = [...sim.ents.of('settler')].some(s => s.body.alive && s.phys.cold > 0.2);
  const night = sim.t.sunEl < 4;
  for (const b of near(sim, e, [...sim.ents.of('building')].filter(b => b.built && b.fuel !== undefined), x => x.i)) {
    const d = sim.defs.must('structure', b.def);
    const want = b.keepLit !== false && (b.lit || night || anyCold || sim.crafting.wantsStation(sim, d.station));
    if (!want || b.fuel > d.fire.maxKg * 0.45) continue;
    if (!b.lit && !toolQuality(sim, e, 'fire') && !bestToolItem(sim, e, 'fire')) continue;
    const key = 'refuel:' + b.id; if (claimed(sim, key, e)) continue;
    const kg = d.fire.maxKg - b.fuel;
    const isFuel = (s) => (sim.defs.must('item', s.item).tags || []).includes('fuel');
    const units = (s) => Math.max(1, Math.ceil(kg / sim.defs.must('item', s.item).kg));
    const src = freeItems(sim, e, s => isFuel(s) && s.item === 'stick')[0] || freeItems(sim, e, isFuel)[0];
    const inInv = e.inv.find(isFuel);
    const steps = [], reserve = [];
    if (!src && !inInv) {
      const f = forageSource(sim, e, { item: 'stick' }, b.i); if (!f) continue;
      steps.push(...f.steps);
    } else if (!inInv) { steps.push({ a: 'goto', i: src.i }, { a: 'pickup', id: src.id, qty: Math.min(units(src.stack), src.stack.item === 'log' ? 1 : 30) }); reserve.push(src.id); }
    steps.push({ a: 'goto', i: b.i }, { a: 'work', job: 'refuel', fire: b.id, secs: b.lit ? 30 : 120, activity: 'build' });
    const plan = { label: b.lit ? 'Feeding the fire' : 'Lighting the fire', claim: key, steps, reserve };
    return b.lit ? plan : withTool(sim, e, 'fire', 0.2, plan);
  }
  return null;
};

G.haul = (sim, e) => {
  const zones = [...sim.zones.values()].filter(z => z.type === 'stockpile' && z.tiles.size);
  if (!zones.length) return null;
  const room = carryCapacity(sim, e) - cargoKg(sim, e);
  if (room < 0.5) return null;
  const candidates = [];
  for (const it of sim.ents.of('item')) {
    if (it.reserved || it.forbidden || isStored(sim, it)) continue;
    if (unreachable(e, 'item:' + it.id, sim)) continue;
    const cat = sim.defs.must('item', it.stack.item).cat;
    if (!zones.some(z => z.allow.includes(cat))) continue;
    candidates.push(it);
  }
  for (const it of near(sim, e, candidates, x => x.i).slice(0, 8)) {
    if (sim.world.dist(e.i, it.i) > MAX_JOB_DIST * (it.fromKill ? 3 : 1)) continue;
    const dest = stockpileSpot(sim, it);
    if (dest < 0) continue;
    const unitKg = sim.defs.must('item', it.stack.item).kg;
    const qty = Math.min(it.stack.qty, Math.max(1, Math.floor(room / unitKg)));
    return { label: `Hauling ${describe(sim.defs, { ...it.stack, qty })}`, reserve: [it.id], steps: [
      { a: 'goto', i: it.i }, { a: 'pickup', id: it.id, qty }, { a: 'goto', i: dest }, { a: 'drop', item: it.stack.item, mat: it.stack.mat, qty }] };
  }
  return null;
};

G.bury = (sim, e) => {
  for (const c of [...sim.ents.of('corpse')].filter(c => c.human)) {
    const key = 'bury:' + c.id; if (claimed(sim, key, e)) continue;
    return { label: `Burying ${c.name}`, claim: key, steps: [{ a: 'goto', i: c.i }, { a: 'work', job: 'bury', corpse: c.id, secs: 2400, activity: 'dig', tool: 'dig', minTool: 0.3 }] };
  }
  return null;
};

// When the colony has none of a material, gather it straight from plants (branches from trees, fibre from
// grass and reeds).
function forageSource(sim, e, spec, near_) {
  const w = sim.world;
  const want = (it) => spec.item ? it.id === spec.item : (it.tags || []).includes(spec.tag);
  let best = -1, bd = Infinity;
  for (const i of w.within(near_, 18)) {
    const f = w.flora[i] ? sim.defs.at('flora', w.flora[i]) : null;
    if (!f?.yield || f.yield.verb !== 'gather' || w.yield[i] < 1 || !want(sim.defs.must('item', f.yield.item))) continue;
    if (claimed(sim, 'gather:' + i, e)) continue;
    const d = w.dist(e.i, i) + w.dist(i, near_); if (d < bd) { bd = d; best = i; }
  }
  if (best < 0) return null;
  const f = sim.defs.at('flora', w.flora[best]), units = Math.min(Math.floor(w.yield[best]), 12);
  return { item: f.yield.item, steps: [{ a: 'goto', i: best }, { a: 'work', job: 'gather', i: best, units, secs: 30 * units, skill: 'foraging', activity: 'gather' }, { a: 'pickupHere', item: f.yield.item }] };
}

// Find a stockpile hex for an item: same stack first, then an empty slot (4 stacks per hex).
export function stockpileSpot(sim, it) {
  const cat = sim.defs.must('item', it.stack.item).cat;
  let best = -1, bd = Infinity;
  for (const z of sim.zones.values()) {
    if (z.type !== 'stockpile' || !z.allow.includes(cat)) continue;
    for (const i of z.tiles) {
      if (blocked(sim, i)) continue;
      let stacks = 0, same = false;
      for (const o of sim.ents.at(i)) if (o.kind === 'item') { stacks++; if (o.stack.item === it.stack.item && (o.stack.mat || '') === (it.stack.mat || '')) same = true; }
      if (!same && stacks >= 4) continue;
      const d = sim.world.dist(it.i, i) - (same ? 3 : 0);
      if (d < bd) { bd = d; best = i; }
    }
  }
  return best;
}

G.cook = (sim, e) => sim.crafting.giver(sim, e, true);
G.craft = (sim, e) => sim.crafting.giver(sim, e, false);

export const GIVERS = {
  doctor: [G.doctor], firefight: [G.firefight], cook: [G.cook], hunt: [G.hunt, G.butcher], build: [G.build],
  farm: [G.farm], forage: [G.forage], chop: [G.chop], mine: [G.mine], craft: [G.craft], fish: [G.fish],
  haul: [G.refuel, G.haul, G.bury],
};
