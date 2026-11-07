// Settler decision making. Every tick a settler runs its plan; when it has none, or when a check every
// 20 seconds finds something more urgent, it thinks again in this order:
//   unconscious -> mental break -> player order -> danger -> bleeding -> thirst -> hunger -> sleep ->
//   cold -> work by labor priority -> idle.
import { runPlan, setPath, moveAlong, settlerSpeed, toolQuality, isKit } from './actions.js';
import { GIVERS, freeItems, collect } from './jobs.js';
import { unitNutrition, countInv } from '../stacks.js';
import { reachMap, passable, findPath } from '../world/path.js';
import { lightAt, roofed, shelterAt, feltTemp } from './environment.js';
import { GLYCOGEN_MAX, STOMACH_G } from './physiology.js';
import { clamp, HOUR } from '../core/units.js';

export function adopt(sim, e, plan) {
  release(sim, e);
  e.agent.plan = { k: 0, ...plan };
  if (plan.claim) sim.claims.set(plan.claim, e.id);
  for (const id of plan.reserve || []) { const it = sim.ents.get(id); if (it) it.reserved = e.id; }
  e.agent.task = plan.label || 'Busy';
  e.agent.running = !!plan.run;
  e.mv = null;
}

export function release(sim, e) {
  const p = e.agent.plan; if (!p) return;
  if (p.claim && sim.claims.get(p.claim) === e.id) sim.claims.delete(p.claim);
  for (const id of p.reserve || []) { const it = sim.ents.get(id); if (it && it.reserved === e.id) it.reserved = null; }
  if (e.phys.asleep) e.phys.asleep = false;
  e.agent.plan = null; e.agent.running = false; e.mv = null;
}

export function interrupt(sim, e) { release(sim, e); e.agent.think = 0; }

function fail(sim, e) {
  const p = e.agent.plan;
  const st = p?.steps[p.k];
  e.agent.unreach = e.agent.unreach || {};
  if (p?.claim) e.agent.unreach[p.claim] = sim.tick;
  if (st?.a === 'pickup' || (st?.a === 'goto' && p.steps[p.k + 1]?.a === 'pickup')) {
    const id = st.a === 'pickup' ? st.id : p.steps[p.k + 1].id; e.agent.unreach['item:' + id] = sim.tick;
  }
  // forget old failures
  for (const k in e.agent.unreach) if (sim.tick - e.agent.unreach[k] > 3600) delete e.agent.unreach[k];
  release(sim, e);
  e.agent.thinkAfter = sim.tick + 3;
}

function run(sim, dt) {
  for (const e of sim.ents.of('settler')) {
    if (!e.body.alive) continue;
    const a = e.agent;
    if (!e.body.conscious) { if (a.plan) release(sim, e); a.task = 'Unconscious'; a.activity = 'rest'; continue; }
    a.think -= dt;
    if (a.plan && a.think <= 0) {
      a.think = 20;
      const urgent = urgentNeed(sim, e);
      if (urgent && urgent.rank < (a.plan.rank ?? 99)) release(sim, e);
      else if ((a.plan.rank ?? 0) >= 20) { release(sim, e); } // idle: look for something better
    }
    if (!a.plan && sim.tick >= (a.thinkAfter || 0)) { a.think = 20; think(sim, e); }
    if (!a.plan) continue;
    const r = runPlan(sim, e, dt);
    if (r === 'done') { release(sim, e); a.task = 'Idle'; }
    else if (r === 'fail') fail(sim, e);
  }
}

// Needs ranked: lower is more urgent. Returns { rank, kind } or null.
function urgentNeed(sim, e) {
  const p = e.phys, b = e.body;
  if (threatNear(sim, e)) return { rank: 0, kind: 'danger' };
  if (b.bleedRate > 3 && b.wounds.some(w => !w.treated && w.bleed > 0.5)) return { rank: 1, kind: 'bleeding' };
  if (p.thirst > 0.85) return { rank: 2, kind: 'thirst' };
  if (p.hunger > 0.9) return { rank: 3, kind: 'hunger' };
  if (p.cold > 0.7 || p.core < 35.5) return { rank: 3, kind: 'cold' };
  if (p.sleepiness > 0.93) return { rank: 4, kind: 'sleep' };
  return null;
}

function threatNear(sim, e) {
  for (const a of sim.ents.of('animal')) {
    if (!a.body.alive) continue;
    if ((a.animal.state === 'attack' || a.animal.state === 'hunt') && a.animal.target === e.id && sim.world.dist(a.i, e.i) <= 6) return a;
  }
  return null;
}

export function think(sim, e) {
  const p = e.phys, a = e.agent, m = e.mind;
  // mental break; even mid-break people drink when parched, warm up when freezing and defend themselves
  if (m.breakdown) {
    const u = urgentNeed(sim, e);
    if (!u || u.kind === 'sleep' || (u.kind === 'hunger' && m.breakdown.type === 'binge')) return breakdown(sim, e);
  }
  // player order
  if (a.order) {
    const o = a.order;
    if (o.kind === 'move') { if (e.i === o.i) { a.order = null; } else return adopt(sim, e, { label: 'Following orders', rank: -1, steps: [{ a: 'goto', i: o.i }], run: o.run }); }
  }
  // danger
  const th = threatNear(sim, e);
  if (th) return defend(sim, e, th);
  if (sim.world.fire[e.i] > 0) return flee(sim, e, e.i, 'Escaping the fire');
  // bleeding with nobody coming: lie down (the doctor giver finds them) or self-treat
  if (e.body.bleedRate > 3 && e.body.wounds.some(w => !w.treated && w.bleed > 0.5)) {
    const self = GIVERS.doctor[0](sim, e);
    if (self && self.claim === 'tend:' + e.id) return adopt(sim, e, { ...self, rank: 1 });
  }
  if (p.thirst > 0.5 || (p.thirst > 0.25 && !a.plan && sim.rng.chance(0.3))) { const pl = drinkPlan(sim, e); if (pl) return adopt(sim, e, { ...pl, rank: 2 }); }
  if (p.hunger > 0.5 || (p.hunger > 0.35 && isMealtime(sim))) { const pl = eatPlan(sim, e); if (pl) return adopt(sim, e, { ...pl, rank: 3 }); }
  if (p.cold > 0.4 || (p.wet > 0.5 && sim.weather.tempC < 12)) { const pl = warmPlan(sim, e); if (pl) return adopt(sim, e, { ...pl, rank: 3 }); }
  const night = sim.t.sunEl < -4;
  if (p.sleepiness > 0.68 || (night && p.sleepiness > 0.48) || e.body.caps.moving < 0.25) { const pl = sleepPlan(sim, e); if (pl) return adopt(sim, e, { ...pl, rank: 4 }); }
  // work
  const pl = workPlan(sim, e);
  if (pl) return adopt(sim, e, { ...pl, rank: 10 });
  // idle: sit by a fire when it is dark or cold, else stroll near camp
  return adopt(sim, e, idlePlan(sim, e));
}

function isMealtime(sim) { const h = sim.t.hour; return (h > 7 && h < 8.5) || (h > 12 && h < 13.5) || (h > 18 && h < 19.5); }

export function workPlan(sim, e) {
  const labors = sim.defs.all('labor').map((l, k) => ({ l, k, p: e.agent.prio[l.id] ?? 2 })).filter(x => x.p > 0).sort((a, b) => a.p - b.p || a.k - b.k);
  for (const { l } of labors) {
    for (const g of GIVERS[l.id] || []) {
      const plan = g(sim, e);
      if (plan) { plan.labor = l.id; return plan; }
    }
  }
  return null;
}

// ---- needs
function foodScore(sim, s, e) {
  const d = sim.defs.must('item', s.item); if (d.cat !== 'food' || d.water) return -Infinity;
  const nut = unitNutrition(sim.defs, s); if (!nut || nut.kcal * nut.digest < 5) return -Infinity;
  let sc = (d.mood || 0) * 2 + Math.log(nut.kcal * nut.digest / (d.kg * 10) + 1) * 2;
  const tags = d.tags || [];
  if (tags.includes('raw') && !tags.includes('raw_ok')) sc -= e.phys.hunger > 0.85 ? 2 : 8;
  if (s.fresh !== undefined && s.fresh < 0.3) sc -= 10;
  if (d.risk) sc -= 4;
  if (d.shelf > 300) sc -= 3; // keep preserves for lean times
  return sc;
}

export function eatPlan(sim, e) {
  const p = e.phys;
  const wantKcal = Math.max(250, (GLYCOGEN_MAX - p.glycogen) * 0.8 + (p.starving ? 800 : 200));
  const roomG = STOMACH_G - p.stomach.g;
  const units = (s) => { const n = unitNutrition(sim.defs, s), g = sim.defs.must('item', s.item).kg * 1000; return Math.max(1, Math.min(s.qty, Math.ceil(wantKcal / Math.max(5, n.kcal * n.digest)), Math.floor(roomG / g))); };
  const inv = e.inv.filter(s => foodScore(sim, s, e) > -Infinity).sort((x, y) => foodScore(sim, y, e) - foodScore(sim, x, e))[0];
  if (inv && foodScore(sim, inv, e) > -5) return { label: 'Eating', steps: [{ a: 'eat', item: inv.item, mat: inv.mat, meal: !!inv.nut, units: units(inv) }] };
  let best = null, bs = -Infinity;
  for (const it of freeItems(sim, e, s => foodScore(sim, s, e) > -Infinity).slice(0, 25)) {
    const d = sim.world.dist(e.i, it.i); if (d > (p.hunger > 0.8 ? 220 : 80)) continue;
    const sc = foodScore(sim, it.stack, e) - d * 0.12;
    if (sc > bs) { bs = sc; best = it; }
  }
  if (best && (bs > -6 || p.hunger > 0.8)) {
    const n = units(best.stack);
    return { label: 'Fetching food', reserve: [best.id], steps: [{ a: 'goto', i: best.i }, { a: 'pickup', id: best.id, qty: n }, { a: 'eat', item: best.stack.item, mat: best.stack.mat, meal: !!best.stack.nut, units: n }] };
  }
  if (inv) return { label: 'Eating', steps: [{ a: 'eat', item: inv.item, mat: inv.mat, meal: !!inv.nut, units: units(inv) }] };
  // forage: the nearest plant with something edible on it
  const w = sim.world;
  let tile = -1, td = Infinity;
  for (const i of w.within(e.i, 25)) {
    const f = w.flora[i] ? sim.defs.at('flora', w.flora[i]) : null;
    if (!f?.yield || w.yield[i] < 1) continue;
    if (e.agent.unreach?.['gather:' + i] && sim.tick - e.agent.unreach['gather:' + i] < 1800) continue;
    const it = sim.defs.must('item', f.yield.item);
    if (it.cat !== 'food' || !(it.tags || []).includes('raw_ok') && !(it.tags || []).includes('vegetable')) continue;
    const d = w.dist(e.i, i); if (d < td) { td = d; tile = i; }
  }
  if (tile >= 0) {
    const f = sim.defs.at('flora', w.flora[tile]);
    const n = Math.min(Math.floor(w.yield[tile]), 15);
    return { label: 'Foraging for food', claim: 'gather:' + tile, steps: [{ a: 'goto', i: tile }, { a: 'work', job: 'gather', i: tile, units: n, secs: 35 * n, skill: 'foraging', activity: 'gather' },
      { a: 'pickupHere', item: f.yield.item }, { a: 'eat', item: f.yield.item, units: n }] };
  }
  return null;
}

export function drinkPlan(sim, e) {
  if (e.inv.some(s => s.item === 'clean_water')) return { label: 'Drinking', steps: [{ a: 'drink', fromInv: true }] };
  const it = freeItems(sim, e, s => s.item === 'clean_water')[0];
  const w = sim.world;
  // nearest drinkable water hex (stand on the bank, or on ice)
  const r = findPath(sim, e.i, (i) => w.neighbors(i).some(n => w.water[n] > 0.05) || (w.water[i] > 0.05 && w.water[i] < 0.6), { maxNodes: 30000 });
  const waterCost = r ? r.cost : Infinity;
  if (it && sim.world.dist(e.i, it.i) * 2.5 < waterCost + 60) return { label: 'Fetching water', reserve: [it.id], steps: [{ a: 'goto', i: it.i }, { a: 'pickup', id: it.id, qty: 1 }, { a: 'drink', fromInv: true }] };
  if (!r) return null;
  const bank = r.end, wi = w.water[bank] > 0.05 ? bank : w.neighbors(bank).find(n => w.water[n] > 0.05);
  return { label: 'Going to drink', steps: [{ a: 'goto', i: bank }, { a: 'drink', i: wi }] };
}

export function sleepPlan(sim, e) {
  const p = e.phys;
  let bed = p.bedId ? sim.ents.get(p.bedId) : null;
  if (!bed || bed.dead) {
    p.bedId = null;
    const owned = new Set([...sim.ents.of('settler')].filter(s => s.body.alive).map(s => s.phys.bedId));
    bed = [...sim.ents.of('building')].filter(b => b.built && sim.defs.must('structure', b.def).bed && !owned.has(b.id))
      .sort((a, b) => sim.world.dist(e.i, a.i) - sim.world.dist(e.i, b.i))[0];
    if (bed) { p.bedId = bed.id; sim.events.emit('bed_claimed', { id: e.id, bed: bed.id }); }
  }
  if (bed && sim.world.dist(e.i, bed.i) < 90) return { label: 'Sleeping', steps: [{ a: 'goto', i: bed.i }, { a: 'sleep', bed: bed.id }] };
  // a sheltered spot near a fire, else here
  const spot = shelterSpot(sim, e, 40);
  return { label: 'Sleeping rough', steps: spot >= 0 && spot !== e.i ? [{ a: 'goto', i: spot }, { a: 'sleep' }] : [{ a: 'sleep' }] };
}

function shelterSpot(sim, e, radius) {
  const w = sim.world; let best = -1, bs = -Infinity;
  for (const i of w.within(e.i, radius)) {
    if (!passable(sim, i)) continue;
    let s = 0;
    if (w.room[i]) s += 6; else if (roofed(sim, i)) s += 4;
    s += Math.min(8, (sim.heat.get(i) || 0) * 0.6);
    if (sim.heat.get(i) > 10) s -= 6; // not in the flames
    if ([...sim.ents.at(i)].some(o => o.kind === 'building' && !sim.defs.must('structure', o.def).passable)) continue;
    if ([...sim.ents.at(i)].some(o => o.kind === 'settler' && o !== e && o.phys.asleep)) s -= 2;
    s -= w.dist(e.i, i) * 0.12;
    if (s > bs) { bs = s; best = i; }
  }
  return bs > 0 ? best : -1;
}

export function warmPlan(sim, e) {
  const w = sim.world;
  const fires = [...sim.ents.of('building')].filter(b => b.lit).sort((a, b) => w.dist(e.i, a.i) - w.dist(e.i, b.i));
  const f = fires[0];
  if (f && w.dist(e.i, f.i) < 60) {
    const spot = w.within(f.i, 1).filter(i => passable(sim, i) && i !== f.i).sort((a, b) => w.dist(e.i, a) - w.dist(e.i, b))[0] ?? f.i;
    return { label: 'Warming up by the fire', steps: [{ a: 'goto', i: spot }, { a: 'warm', fire: f.id }] };
  }
  const spot = shelterSpot(sim, e, 30);
  if (spot >= 0 && (w.room[spot] || roofed(sim, spot))) return { label: 'Seeking shelter', steps: [{ a: 'goto', i: spot }, { a: 'warm', max: 3600 }] };
  // nothing better: working keeps them warm; only stamp about when it is getting dangerous
  if (e.phys.cold < 0.65) return null;
  return { label: 'Stamping to keep warm', steps: [{ a: 'warm', exercise: true, max: 900 }] };
}

function idlePlan(sim, e) {
  const w = sim.world, dark = sim.t.sunEl < 0 || e.phys.cold > 0.2;
  if (dark) {
    const f = [...sim.ents.of('building')].filter(b => b.lit).sort((a, b) => w.dist(e.i, a.i) - w.dist(e.i, b.i))[0];
    if (f && w.dist(e.i, f.i) < 40) {
      const spot = w.within(f.i, 1).filter(i => passable(sim, i) && i !== f.i)[sim.rng.int(6)] ?? f.i;
      return { label: 'Sitting by the fire', rank: 20, steps: [{ a: 'goto', i: spot }, { a: 'wait', secs: 600, activity: 'rest' }] };
    }
  }
  const home = sim.homeCenter >= 0 ? sim.homeCenter : e.i;
  const cands = w.within(home, 6).filter(i => passable(sim, i));
  const to = cands.length ? sim.rng.pick(cands) : e.i;
  return { label: 'Idle', rank: 20, steps: [{ a: 'goto', i: to }, { a: 'wait', secs: 120 + sim.rng.int(240), activity: 'idle' }] };
}

function flee(sim, e, from, label) {
  const w = sim.world;
  let best = -1, bd = -1;
  for (const i of w.within(e.i, 8)) { if (!passable(sim, i) || w.fire[i] > 0) continue; const d = w.dist(i, from) - w.dist(e.i, i) * 0.3; if (d > bd) { bd = d; best = i; } }
  if (best < 0) return;
  adopt(sim, e, { label, rank: 0, run: true, steps: [{ a: 'goto', i: best }] });
}

function defend(sim, e, threat) {
  const healthy = e.body.caps.moving > 0.5 && e.body.caps.manipulation > 0.4 && e.body.blood > e.body.bloodMax * 0.8 && e.body.pain < 0.45;
  const hasWeapon = e.inv.some(s => sim.defs.must('item', s.item).weapon);
  const allies = [...sim.ents.of('settler')].filter(s => s !== e && s.body.alive && sim.world.dist(s.i, e.i) < 6).length;
  if (healthy && (hasWeapon || allies > 0)) {
    return adopt(sim, e, { label: `Fighting off a ${sim.defs.must('fauna', threat.species).name}`, rank: 0, steps: [{ a: 'follow', id: threat.id, range: 1, giveUp: 120 }, { a: 'attack', id: threat.id, maxSwings: 20 }] });
  }
  return flee(sim, e, threat.i, 'Running for it');
}

function breakdown(sim, e) {
  const b = e.mind.breakdown;
  e.agent.task = { wander: 'Wandering aimlessly', hide: 'Hiding away', binge: 'Binge eating', sulk: 'Sulking' }[b.type];
  if (b.type === 'binge') { const pl = eatPlan(sim, e); if (pl) return adopt(sim, e, { ...pl, label: 'Binge eating', rank: 5 }); }
  if (b.type === 'wander') {
    const to = sim.rng.pick(sim.world.within(e.i, 10).filter(i => passable(sim, i)));
    return adopt(sim, e, { label: 'Wandering aimlessly', rank: 5, steps: [{ a: 'goto', i: to }, { a: 'wait', secs: 300, activity: 'idle' }] });
  }
  if (b.type === 'hide') { const pl = sleepPlan(sim, e); return adopt(sim, e, { label: 'Hiding away', rank: 5, steps: [pl.steps[0].a === 'goto' ? pl.steps[0] : { a: 'wait', secs: 1 }, { a: 'wait', secs: 1800, activity: 'rest' }] }); }
  return adopt(sim, e, { label: 'Sulking', rank: 5, steps: [{ a: 'wait', secs: 1800, activity: 'rest' }] });
}

export const aiSystem = { name: 'ai', every: 1, run };
export const aiApi = { interrupt, adopt, release, think };
