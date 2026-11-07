// Health: wounds by damage type with bleeding and clotting, blood volume, infection and fever, healing that
// depends on nutrition and rest, illnesses as data-driven conditions, pain, capacities and death.
// Shared by settlers and animals (animals use a quadruped body plan).
import { clamp, DAY, HOUR } from '../core/units.js';
import { DAMAGE } from '../../data/bodies.js';
import { conditionEffects, massOf } from './physiology.js';
import { traitMod, addThought } from './mind.js';

export function wound(sim, e, part, type, sev, source = '') {
  const b = e.body; if (!b.alive) return null;
  const dmg = DAMAGE[type]; if (!dmg) throw new Error('unknown damage type ' + type);
  if (!b.parts[part]) part = Object.keys(b.parts)[0];
  sev = Math.max(0.1, sev);
  const w = { part, type, sev, sev0: sev, bleed: sev * dmg.bleed, inf: 0, treated: 0, antiseptic: 0, age: 0, source };
  b.wounds.push(w);
  // Heavy blunt blows can break bones.
  if (dmg.fracture && sev > 8 && sim.rng.chance(dmg.fracture * (sev - 8) / 10)) {
    b.wounds.push({ part, type: 'fracture', sev: sev * 0.8, sev0: sev * 0.8, bleed: 0, inf: 0, treated: 0, antiseptic: 0, age: 0, source });
  }
  recompute(sim, e);
  sim.events.emit('wound', { id: e.id, part, type, sev, source });
  if (e.kind === 'settler') addThought(sim, e, 'wounded');
  return w;
}

export function hitPart(sim, e) {
  const plan = sim.defs.must('body', e.body.plan);
  return sim.rng.weighted(plan.parts, p => p.coverage).id;
}

export function addCondition(sim, e, id, source = '') {
  const b = e.body;
  if (b.conds.some(c => c.id === id)) return;
  const d = sim.defs.must('condition', id), rng = sim.rng;
  const immunity = traitMod(sim, e, 'immunity', 1);
  b.conds.push({ id, t: 0, onset: rng.range(...d.onsetH), dur: rng.range(...d.durationH) / immunity, sev: 0, source });
  sim.events.emit('contracted', { id: e.id, cond: id, source });
}

function run(sim, dt) {
  for (const e of sim.ents.of('settler')) if (e.body.alive) step(sim, e, dt);
  for (const e of sim.ents.of('animal')) if (e.body.alive) step(sim, e, dt);
}

export function step(sim, e, dt) {
  const b = e.body, days = dt / DAY, hours = dt / HOUR, rng = sim.rng, human = e.kind === 'settler';
  const p = e.phys;
  // healing conditions: fed, hydrated, resting
  let heal = 2.2 * traitMod(sim, e, 'heal', 1);
  if (human) {
    if (p.starving) heal *= 0.2; else if (p.protein < 5) heal *= 0.6;
    if (p.dehydPct > 4) heal *= 0.5;
    if (p.asleep) heal *= 1.6;
  }
  const immune = human ? clamp(1 - (p.starving ? 0.5 : 0) - (p.dehydPct > 5 ? 0.2 : 0) - (p.sleepiness > 0.85 ? 0.15 : 0), 0.2, 1) * traitMod(sim, e, 'immunity', 1) : 1;
  let bleedMl = 0;
  for (let k = b.wounds.length - 1; k >= 0; k--) {
    const w = b.wounds[k], dmg = DAMAGE[w.type];
    w.age += hours;
    // clotting: small wounds stop in minutes, big ones take an hour or more; dressings speed it up
    if (w.bleed > 0) {
      const tau = (w.treated ? 4 : w.sev < 4 ? 8 : w.sev < 10 ? 25 : 80) * 60;
      bleedMl += w.bleed * dt / 60 * (w.treated ? 0.25 : 1);
      w.bleed *= Math.exp(-dt / tau);
      if (w.bleed < 0.05) w.bleed = 0;
    }
    // infection
    if (dmg.open && w.sev > 0.5) {
      if (w.inf <= 0) {
        const dirt = w.antiseptic ? 0.15 : w.treated ? 0.4 : 1;
        if (w.age < 72 && rng.chance(dmg.infect * dirt * (w.sev / 6) * days)) { w.inf = 0.02; sim.events.emit('infection', { id: e.id, part: w.part }); }
      } else {
        w.inf += (0.32 * (w.antiseptic ? 0.2 : 1) - 0.18 * immune - w.antiseptic * 0.2) * days;
        if (w.inf <= 0) w.inf = 0;
        if (w.inf >= 1) { w.inf = 1; b.organ += 0.12 * days; }
      }
    }
    const rate = heal * (w.treated ? 1.35 : 1) * (w.inf > 0.2 ? 0.25 : 1) / (dmg.slowHeal || 1);
    w.sev -= rate * days;
    if (w.sev <= 0) b.wounds.splice(k, 1);
  }
  b.blood -= bleedMl;
  b.bleedRate = bleedMl / (dt / 60);
  const hydrated = !human || p.dehydPct < 3;
  if (b.blood < b.bloodMax && bleedMl === 0 && hydrated) b.blood = Math.min(b.bloodMax, b.blood + (human && p.starving ? 120 : 400) * days);

  // illnesses
  if (human) {
    for (let k = b.conds.length - 1; k >= 0; k--) {
      const c = b.conds[k]; c.t += hours;
      const active = c.t - c.onset;
      if (active < 0) { c.sev = 0; continue; }
      c.sev = clamp(Math.min(active / 3, (c.dur - active) / (c.dur * 0.25) + 0.2), 0, 1);
      if (active >= c.dur) { b.conds.splice(k, 1); sim.events.emit('recovered', { id: e.id, cond: c.id }); continue; }
      const d = sim.defs.must('condition', c.id).effects;
      if (d.nausea && c.sev > 0.4 && p.stomach.g > 100 && rng.chance(d.nausea * c.sev * 0.25 * hours)) {
        p.stomach = { kcal: 0, p: 0, f: 0, c: 0, w: 0, g: 0 }; p.waterDef += 0.3;
        addThought(sim, e, 'vomited'); sim.events.emit('vomited', { id: e.id });
      }
    }
    const fx = conditionEffects(sim, e);
    b.organ += fx.organ * days;
    if (p.core > 41) b.organ += (p.core - 41) * 0.4 * days;
    b.organ = Math.max(0, b.organ - 0.03 * days * immune);
  }
  recompute(sim, e);
  checkDeath(sim, e);
}

export function recompute(sim, e) {
  const b = e.body, plan = sim.defs.must('body', b.plan);
  for (const part of plan.parts) b.parts[part.id].hp = b.parts[part.id].max;
  let painSum = 0, maxTot = 0;
  for (const w of b.wounds) {
    b.parts[w.part].hp -= w.sev;
    painSum += w.sev * DAMAGE[w.type].pain * (w.inf > 0.3 ? 1.5 : 1);
  }
  for (const part of plan.parts) maxTot += b.parts[part.id].max;
  const human = e.kind === 'settler';
  const fx = human ? conditionEffects(sim, e) : { caps: {}, pain: 0 };
  b.pain = clamp((painSum / (maxTot * 0.3) + fx.pain) * traitMod(sim, e, 'pain', 1), 0, 1);
  const frac = (id) => { const pp = b.parts[id]; return pp ? clamp(pp.hp / pp.max, 0, 1) : 1; };
  const group = (cap) => plan.parts.filter(pp => pp.caps.includes(cap)).map(pp => frac(pp.id));
  const avg = (a) => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 1;
  const minOf = (a) => a.length ? Math.min(...a) : 1;
  const bloodLoss = 1 - b.blood / b.bloodMax;
  let cons = 1 - b.pain * 0.3 - Math.max(0, bloodLoss - 0.15) * 2.4 - b.organ * 0.5;
  if (human) {
    const p = e.phys;
    if (p.core < 35) cons -= (35 - p.core) * 0.2;
    if (p.core > 39.5) cons -= (p.core - 39.5) * 0.25;
    if (p.dehydPct > 4) cons -= (p.dehydPct - 4) * 0.07;
    if (p.starving) cons -= 0.15;
    if (p.sleepiness > 0.9) cons -= (p.sleepiness - 0.9) * 2;
  }
  cons = clamp(cons * minOf(group('consciousness')) ** 0.5 * (fx.caps.consciousness ?? 1), 0, 1);
  const legs = group('moving');
  b.caps = {
    consciousness: cons,
    moving: clamp(cons * (0.4 * avg(legs) + 0.6 * minOf(legs) ** 0.7) * (fx.caps.moving ?? 1), 0, 1),
    manipulation: clamp(cons * avg(group('manipulation')) * (fx.caps.manipulation ?? 1), 0, 1),
    sight: clamp(minOf(group('sight')) * Math.max(0.3, cons), 0, 1),
    breathing: clamp(avg(group('breathing')) * (fx.caps.breathing ?? 1), 0, 1),
  };
  b.conscious = cons > 0.12;
}

function checkDeath(sim, e) {
  const b = e.body, plan = sim.defs.must('body', b.plan);
  let cause = null;
  for (const part of plan.parts) if (part.vital && b.parts[part.id].hp <= 0) cause = `wounds to the ${part.name}`;
  if (!cause && b.blood < b.bloodMax * 0.5) cause = 'blood loss';
  if (!cause && b.organ >= 1) cause = 'organ failure';
  if (!cause && e.kind === 'settler') {
    const p = e.phys;
    if (p.core < 26) cause = 'hypothermia';
    else if (p.core > 43) cause = 'heatstroke';
    else if (p.dehydPct > 15) cause = 'dehydration';
    else if (p.lean < p.leanStart * 0.62) cause = 'starvation';
  }
  if (!cause && e.kind === 'animal' && e.animal.starve > 1) cause = 'starvation';
  if (cause) kill(sim, e, cause);
}

export function kill(sim, e, cause) {
  if (!e.body.alive) return;
  e.body.alive = false; e.body.conscious = false; e.causeOfDeath = cause;
  sim.events.emit('died', { id: e.id, kind: e.kind, name: e.name || sim.defs.get('fauna', e.species)?.name, cause, i: e.i });
  sim.onDeath?.(e, cause);
}

export const healthSystem = { name: 'health', every: 60, offset: 17, run };
export const healthApi = { wound, addCondition, hitPart, kill, recompute };
export { massOf };
