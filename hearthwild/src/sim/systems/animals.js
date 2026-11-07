// Wildlife. Herbivores graze forage on plants (reducing it), keep together, rest at night and flee from
// people inside their flight distance. Predators hunt prey when hungry and may stalk a lone settler at night.
// Boar and bears fight back when cornered or hurt; bears sleep through winter. Populations recover by
// migration from the valley's edge toward the habitat's carrying capacity.
import { clamp, DAY, HOUR } from '../core/units.js';
import { setPath, moveAlong } from './actions.js';
import { passable } from '../world/path.js';
import { makeAnimal } from '../factory.js';
import { outdoorTemp } from './environment.js';

// Animals near people run every tick. Ones far from everyone (out of sight and out of reach) run every
// FAR_EVERY ticks with a longer dt, which every part of step() handles; this keeps a valley of a couple of
// hundred animals cheap.
const NEAR = 36, FAR_EVERY = 8;
function run(sim, dt) {
  const w = sim.world, people = [];
  for (const s of sim.ents.of('settler')) if (s.body.alive) people.push(s.i);
  const slot = sim.tick % FAR_EVERY;
  for (const a of sim.ents.of('animal')) {
    if (!a.body.alive) continue;
    const A = a.animal;
    let near = A.state === 'hunt' || A.state === 'attack' || A.state === 'charge' || A.state === 'flee';
    if (!near && (a.id + sim.tick) % 30 === 0 || A.near === undefined) A.near = people.some(p => w.dist(p, a.i) < NEAR);
    near ||= A.near;
    if (near) step(sim, a, dt);
    else if (a.id % FAR_EVERY === slot) step(sim, a, dt * FAR_EVERY);
  }
}

function step(sim, a, dt) {
  const d = sim.defs.must('fauna', a.species), A = a.animal, w = sim.world;
  A.stateT -= dt; A.attackCd -= dt;
  // hunger: one day's intake per day
  if (A.state !== 'hibernate') A.hunger += dt / DAY;
  if (A.hunger > 1.5) { A.starve = (A.starve || 0) + dt / DAY * 0.12; }
  if (!a.body.conscious) { a.mv = null; return; }
  const moving = clamp(a.body.caps.moving, 0.1, 1);
  // perception every 2 seconds
  if ((A.look = (A.look || 0) - dt) <= 0) { A.look = 2; perceive(sim, a, d); }
  switch (A.state) {
    case 'flee': case 'charge': case 'hunt': case 'attack': {
      const run = A.state === 'flee' || A.state === 'charge' || A.state === 'hunt';
      if (A.state === 'attack' || A.state === 'hunt' || A.state === 'charge') {
        const t = sim.ents.get(A.target);
        if (!t || t.dead || !t.body.alive || A.stateT <= 0) { A.state = 'idle'; a.mv = null; if (t && d.diet !== 'predator' && A.stateT <= 0) fleeFrom(sim, a, t.i); break; }
        const dist = w.dist(a.i, t.i);
        if (dist <= 1) {
          a.mv = null;
          if (A.attackCd <= 0 && d.attack) { A.attackCd = d.attack.cooldown; sim.combat.attack(sim, a, t, d.attack, 1); }
          if (!t.body.alive && t.kind === 'animal') { A.state = 'feed'; A.stateT = HOUR * 2; A.target = t.id; }
          break;
        }
        if (!a.mv || (A.repath = (A.repath || 0) - dt) <= 0) {
          A.repath = 3;
          // An unreachable target (across a river, up a cliff) is given up on instead of searched for forever.
          if (!setPath(sim, a, t.i, { adjacent: true, maxNodes: 1500, maxCost: (dist + 4) * 12 })) { A.state = 'idle'; A.stateT = 120; a.mv = null; break; }
        }
      }
      if (a.mv) { const r = moveAlong(sim, a, dt, (run ? d.run : d.walk) * moving * (A.state === 'hunt' ? 0.75 : 1)); if (r === true && A.state === 'flee') { A.state = 'idle'; A.stateT = 30; } }
      else if (A.state === 'flee') A.state = 'idle';
      break;
    }
    case 'feed': {
      // predators eat at a kill
      const c = [...sim.ents.at(a.i)].find(o => o.kind === 'corpse') || [...w.neighbors(a.i)].flatMap(j => [...sim.ents.at(j)]).find(o => o.kind === 'corpse');
      if (!c || A.hunger < 0.05 || A.stateT <= 0) { A.state = 'idle'; break; }
      const kg = Math.min(dt * 0.002 * a.massKg, c.massKg * (1 - (c.eaten || 0)));
      c.eaten = Math.min(1, (c.eaten || 0) + kg / c.massKg); A.hunger = Math.max(0, A.hunger - kg / (a.massKg * 0.08));
      break;
    }
    case 'rest': case 'hibernate':
      if (A.stateT <= 0) A.state = 'idle';
      break;
    case 'graze': {
      if (a.mv && a.mv.k < a.mv.path.length) { moveAlong(sim, a, dt, d.walk * moving); break; }
      const fi = w.flora[a.i];
      if (fi && w.forage[a.i] > 0.05 && w.snow[a.i] < 0.45) {
        const f = sim.defs.at('flora', fi), daily = a.massKg * 0.03;
        const take = Math.min(w.forage[a.i] * f.forage, daily * dt / (6 * HOUR));
        w.forage[a.i] -= take / f.forage; A.hunger = Math.max(0, A.hunger - take / daily);
      }
      if (A.stateT <= 0 || A.hunger < 0.05) A.state = 'idle';
      break;
    }
    default: { // idle: decide
      if (a.mv && a.mv.k < a.mv.path.length) { moveAlong(sim, a, dt, d.walk * moving); break; }
      if (A.stateT > 0) break;
      decide(sim, a, d);
    }
  }
}

function perceive(sim, a, d) {
  const A = a.animal, w = sim.world;
  if (A.state === 'hibernate') return;
  const dark = sim.t.sunEl < -4;
  const sight = d.sight * (dark && !d.nocturnal ? 0.55 : 1) * clamp(a.body.caps.sight, 0.2, 1);
  let nearest = null, nd = Infinity, group = 0;
  for (const s of sim.ents.of('settler')) {
    if (!s.body.alive) continue;
    let dist = w.dist(a.i, s.i);
    // a stalking hunter is harder to notice
    if (s.agent.plan?.hunt === a.id || s.agent.plan?.hunt) dist *= 1.3 + (s.skills.hunting.lvl * 0.04);
    if (dist < sight && dist < nd) { nd = dist; nearest = s; }
    if (w.dist(a.i, s.i) < 8) group++;
  }
  if (!nearest) return;
  const hurt = a.body.blood < a.body.bloodMax * 0.92 || a.body.pain > 0.2;
  if (d.diet === 'predator') {
    // hungry wolves stalk a lone person at night; otherwise they keep away
    if (A.state !== 'attack' && A.state !== 'hunt' && A.hunger > 1.4 && group <= 1 && dark && packSize(sim, a) >= 3 && sim.rng.chance(0.01)) {
      A.state = 'hunt'; A.target = nearest.id; A.stateT = 900; alertPack(sim, a, nearest); return;
    }
    if (A.state !== 'attack' && A.state !== 'hunt' && nd < d.flight * (group > 1 ? 1.5 : 1)) fleeFrom(sim, a, nearest.i);
    return;
  }
  if (d.id === 'bear' && nd <= 3 && A.state !== 'attack' && sim.rng.chance(d.aggression * 0.15)) { A.state = 'charge'; A.target = nearest.id; A.stateT = 120; return; }
  if (A.state === 'attack' || A.state === 'charge') return;
  if (nd < d.flight) {
    if (hurt && sim.rng.chance(d.aggression * (d.aggression >= 0.4 ? 1 : 0.3)) && nd <= 2) { A.state = 'attack'; A.target = nearest.id; A.stateT = boutSecs(d); return; }
    fleeFrom(sim, a, nearest.i);
    // the herd follows
    for (const o of sim.ents.of('animal')) if (o !== a && o.species === a.species && o.animal.group === A.group && w.dist(o.i, a.i) < 8 && o.animal.state !== 'flee') fleeFrom(sim, o, nearest.i);
  }
}

function packSize(sim, a) { let n = 0; for (const o of sim.ents.of('animal')) if (o.species === a.species && o.animal.group === a.animal.group && o.body.alive && sim.world.dist(o.i, a.i) < 10) n++; return n; }

function alertPack(sim, a, target) {
  for (const o of sim.ents.of('animal')) if (o !== a && o.species === a.species && o.animal.group === a.animal.group && o.body.alive) { o.animal.state = 'hunt'; o.animal.target = target.id; o.animal.stateT = 900; }
}

// Short moves (grazing, wandering, fleeing a few hexes) give up early when the target is across water or
// a cliff, instead of searching half the valley for a way round.
function localPath(sim, a, to) {
  return setPath(sim, a, to, { maxNodes: 400, maxCost: (sim.world.dist(a.i, to) + 1) * 14 });
}

export function fleeFrom(sim, a, from) {
  const w = sim.world, d = sim.defs.must('fauna', a.species);
  let best = -1, bs = -Infinity;
  for (const i of w.within(a.i, 7)) {
    if (!passable(sim, i)) continue;
    const s = w.dist(i, from) * 2 - w.dist(i, a.i) + sim.rng.next();
    if (s > bs) { bs = s; best = i; }
  }
  if (best >= 0 && localPath(sim, a, best)) { a.animal.state = 'flee'; a.animal.stateT = 60; }
}

// How long an animal keeps fighting once it turns on someone. Grazers lash out for a few kicks and then
// bolt; boar, bears and wolves press the attack.
export function boutSecs(d) { return d.diet === 'predator' ? 180 : d.aggression >= 0.4 ? 40 : 12; }

export function provoked(sim, a, by) {
  const d = sim.defs.must('fauna', a.species), A = a.animal;
  if (A.state === 'attack' || A.state === 'charge') return;
  // A timid animal only fights back when it can no longer run.
  const cornered = a.body.caps.moving < 0.5 || a.body.blood < a.body.bloodMax * 0.7;
  const fights = d.aggression >= 0.4 || cornered;
  if (fights && sim.rng.chance(d.aggression) && a.body.caps.moving > 0.3) { A.state = 'attack'; A.target = by.id; A.stateT = boutSecs(d); if (d.diet === 'predator') alertPack(sim, a, by); }
  else fleeFrom(sim, a, by.i);
}

function decide(sim, a, d) {
  const A = a.animal, w = sim.world, t = sim.t;
  const T = outdoorTemp(sim, a.i);
  if (d.hibernates && t.season === 3 && T < 2) { A.state = 'hibernate'; A.stateT = 6 * HOUR; a.mv = null; return; }
  const night = t.sunEl < -4;
  const restTime = d.nocturnal ? (t.sunEl > 10) : night;
  if (restTime && A.hunger < 0.8) { A.state = 'rest'; A.stateT = HOUR; return; }
  if (d.diet === 'predator' && A.hunger > 0.6) {
    // look for prey
    let prey = null, pd = Infinity;
    for (const o of sim.ents.of('animal')) {
      if (!o.body.alive || !d.prey.includes(o.species)) continue;
      const dd = w.dist(a.i, o.i); if (dd < d.sight * 1.5 && dd < pd) { pd = dd; prey = o; }
    }
    const corpse = [...sim.ents.of('corpse')].find(c => w.dist(a.i, c.i) < d.sight && (c.eaten || 0) < 0.9);
    if (corpse) { if (setPath(sim, a, corpse.i, { maxNodes: 4000 })) { A.state = 'feed'; A.stateT = HOUR * 2; } return; }
    if (prey) { A.state = 'hunt'; A.target = prey.id; A.stateT = 600; alertPack(sim, a, prey); return; }
  }
  if (d.diet !== 'predator' && A.hunger > 0.25) {
    // move to the best forage nearby, staying near the herd
    const mates = [...sim.ents.of('animal')].filter(o => o !== a && o.species === a.species && o.animal.group === A.group);
    const centre = mates.length ? mates[0].i : A.home;
    let best = -1, bs = -Infinity;
    for (const i of w.within(a.i, 6)) {
      const fi = w.flora[i]; if (!fi || !passable(sim, i)) continue;
      const f = sim.defs.at('flora', fi); if (!f.forage) continue;
      const s = w.forage[i] * f.forage * (w.snow[i] > 0.45 ? 0.1 : 1) - w.dist(i, centre) * 0.05 + sim.rng.next() * 0.3;
      if (s > bs) { bs = s; best = i; }
    }
    if (best >= 0 && (best === a.i || localPath(sim, a, best))) { A.state = 'graze'; A.stateT = 600 + sim.rng.int(1200); return; }
  }
  // wander within the home range
  const to = w.within(a.i, 4).filter(i => passable(sim, i) && w.dist(i, A.home) < 30);
  if (to.length) localPath(sim, a, sim.rng.pick(to));
  if (w.dist(a.i, A.home) > 30 && sim.rng.chance(0.1)) A.home = a.i;
  A.stateT = 60 + sim.rng.int(240);
}

// Migration toward carrying capacity, hourly.
function populate(sim) {
  const w = sim.world;
  for (const d of sim.defs.all('fauna')) {
    const cap = Math.floor(sim.landHexes / d.perHexes);
    const have = [...sim.ents.of('animal')].filter(a => a.species === d.id && a.body.alive).length;
    if (have >= cap || !sim.rng.chance(0.06)) continue;
    if (d.hibernates && sim.t.season === 3) continue;
    spawnGroup(sim, d, edgeHex(sim));
  }
}

export function spawnGroup(sim, d, at) {
  if (at < 0) return [];
  const n = d.group[0] + sim.rng.int(d.group[1] - d.group[0] + 1), group = sim.rng.int(1e9), out = [];
  for (let k = 0; k < n; k++) {
    const cands = sim.world.within(at, 2).filter(i => passable(sim, i));
    if (!cands.length) break;
    out.push(sim.ents.add(makeAnimal(sim, d.id, sim.rng.pick(cands), { group })));
  }
  return out;
}

function edgeHex(sim) {
  const w = sim.world;
  for (let tries = 0; tries < 40; tries++) {
    const side = sim.rng.int(4), t = sim.rng.int(side < 2 ? w.W : w.H);
    const col = side === 0 ? t : side === 1 ? t : side === 2 ? 1 : w.W - 2;
    const row = side === 0 ? 1 : side === 1 ? w.H - 2 : t;
    const i = row * w.W + Math.min(w.W - 1, col);
    if (passable(sim, i) && w.water[i] < 0.05) return i;
  }
  return -1;
}

export const animalsSystem = { name: 'animals', every: 1, run };
export const populationSystem = { name: 'population', every: 3600, offset: 29, run: (sim) => populate(sim) };
export const animalsApi = { provoked, fleeFrom, spawnGroup };
