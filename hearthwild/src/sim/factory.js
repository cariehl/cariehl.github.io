// Creating creatures and things. Bodies are built from realistic anthropometrics: height, mass, body fat
// and age give lean mass, blood volume and basal metabolic rate.
import { makeStack, addToInv } from './stacks.js';
import { GIVEN, FAMILY } from '../data/names.js';

export function makeBody(defs, planId, massKg, hpScale = 1) {
  const plan = defs.must('body', planId);
  const parts = {};
  for (const p of plan.parts) { const max = Math.round(p.hp * hpScale); parts[p.id] = { hp: max, max }; }
  const bloodMax = 70 * massKg; // ml
  return { plan: planId, parts, wounds: [], conds: [], blood: bloodMax, bloodMax, pain: 0, organ: 0,
    caps: { consciousness: 1, moving: 1, manipulation: 1, sight: 1, breathing: 1 }, alive: true, conscious: true };
}

const SHIRTS = ['#9b4d3a', '#3e6b8a', '#6b7d3a', '#8a6a3e', '#5d4a7a', '#3e7a6b', '#a07a3a', '#7a3e5a'];

export function makeSettler(sim, opts = {}) {
  const { defs, rng } = sim;
  const sex = opts.sex || (rng.chance(0.5) ? 'f' : 'm');
  const age = opts.age ?? Math.round(rng.range(19, 52));
  const heightCm = opts.heightCm ?? Math.round(rng.normal(sex === 'm' ? 176 : 163, 6.5));
  const bmi = opts.bmi ?? rng.normal(23.5, 2);
  const massKg = Math.round(bmi * (heightCm / 100) ** 2 * 10) / 10;
  const fatPct = opts.fatPct ?? Math.max(0.08, rng.normal(sex === 'm' ? 0.18 : 0.27, 0.035));
  const fat = massKg * fatPct, lean = massKg - fat;
  const traits = opts.traits || pickTraits(sim);
  const hpScale = traits.includes('frail') ? 0.85 : 1;
  const skills = {};
  for (const s of defs.all('skill')) { const lvl = opts.skills?.[s.id] ?? Math.max(0, Math.round(rng.normal(2, 2.2))); skills[s.id] = { xp: 400 * lvl * lvl, lvl, used: 0 }; }
  const prio = {}; for (const l of defs.all('labor')) prio[l.id] = 2;
  const e = {
    kind: 'settler', i: opts.i ?? -1,
    name: opts.name || `${rng.pick(GIVEN)} ${rng.pick(FAMILY)}`, sex, age, color: opts.color || rng.pick(SHIRTS),
    traits, backstory: opts.backstory || '',
    body: makeBody(defs, 'humanoid', massKg, hpScale),
    phys: { heightCm, lean, fat, leanStart: lean, essentialFat: massKg * (sex === 'm' ? 0.03 : 0.1),
      glycogen: 1600, stomach: { kcal: 0, p: 0, f: 0, c: 0, w: 0, g: 0 }, waterDef: 0, protein: 20,
      core: 37, wet: 0, S: 0.25, asleep: false, met: 1.3, shiverKcal: 0, sweatLh: 0,
      hunger: 0.2, thirst: 0.1, sleepiness: 0.2, cold: 0, hot: 0, heatW: 0, lossW: 0, starving: false, kcalToday: 0, lastMeal: 0 },
    mind: { mood: 0, stress: 10, thoughts: [], states: [], breakdown: null },
    skills,
    agent: { plan: null, job: null, prio, task: 'Idle', order: null, think: 0, activity: 'idle' },
    inv: [], equip: { torso: null, legs: null, outer: null, feet: null, head: null, hands: null },
    mv: null,
  };
  return e;
}

function pickTraits(sim) {
  const all = sim.defs.all('trait').map(t => t.id), out = [];
  const opposites = [['optimist', 'pessimist'], ['night_owl', 'early_riser'], ['nervous', 'steady'], ['hardy', 'frail']];
  const n = sim.rng.chance(0.3) ? 1 : sim.rng.chance(0.8) ? 2 : 3;
  while (out.length < n) {
    const t = sim.rng.pick(all);
    if (out.includes(t) || opposites.some(([a, b]) => (t === a && out.includes(b)) || (t === b && out.includes(a)))) continue;
    out.push(t);
  }
  return out;
}

export function giveItem(sim, e, item, qty = 1, extra = {}) { addToInv(e.inv, makeStack(sim.defs, item, qty, extra)); }

export function wear(sim, e, item) {
  const d = sim.defs.must('item', item);
  e.equip[d.wear.slot] = makeStack(sim.defs, item, 1);
}

export function makeAnimal(sim, species, i, opts = {}) {
  const d = sim.defs.must('fauna', species), rng = sim.rng;
  const massKg = opts.massKg ?? Math.max(d.massKg * 0.3, rng.normal(d.massKg, d.massKg * 0.15));
  const hpScale = Math.max(0.15, Math.pow(massKg / 70, 0.5));
  return {
    kind: 'animal', i, species, sex: rng.chance(0.5) ? 'f' : 'm', massKg,
    body: makeBody(sim.defs, d.body, massKg, hpScale),
    animal: { hunger: rng.range(0, 0.4), fat: 0.6, state: 'idle', stateT: 0, target: null, group: opts.group || 0, home: i, alarm: 0, rest: 0, attackCd: 0 },
    mv: null,
  };
}

export function spawnItem(sim, i, stack) {
  // Merge into an identical stack already on the hex.
  for (const e of sim.ents.at(i)) if (e.kind === 'item' && e.stack.item === stack.item && (e.stack.mat || '') === (stack.mat || '') && !e.stack.nut === !stack.nut && !e.reserved) {
    const s = e.stack, n = s.qty + stack.qty;
    if (s.fresh !== undefined) s.fresh = ((s.fresh ?? 1) * s.qty + (stack.fresh ?? 1) * stack.qty) / n;
    if (s.nut && stack.nut) for (const k in s.nut) s.nut[k] = (s.nut[k] * s.qty + stack.nut[k] * stack.qty) / n;
    s.qty = n; return e;
  }
  return sim.ents.add({ kind: 'item', i, stack });
}
