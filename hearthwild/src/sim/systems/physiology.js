// Human physiology, once a game minute per settler: metabolism and digestion, hydration, heat balance and
// core temperature, and the two-process model of sleep. All quantities are physical; the AI reads the
// derived signals (hunger, thirst, sleepiness, cold, hot).
import { clamp, DAY, HOUR, KCAL_J } from '../core/units.js';
import { feltTemp, windExposure, rainExposure, airTemp } from './environment.js';
import { traitMod } from './mind.js';

export const GLYCOGEN_MAX = 2000;   // kcal in liver and muscle glycogen
export const STOMACH_G = 1300;      // comfortable stomach capacity, g
const FAT_KCAL_KG = 7700, LEAN_KCAL_KG = 1100;

// MET values (multiples of resting metabolic rate) for what a settler is doing.
export const ACTIVITY_MET = {
  sleep: 0.95, rest: 1.2, idle: 1.4, eat: 1.5, walk: 3.3, run: 8, carry: 4.8, chop: 6.5, mine: 7, dig: 5.5,
  build: 4.5, craft: 2.2, cook: 2.3, gather: 3, butcher: 3.5, hunt: 5, fight: 7.5, doctor: 2.5, farm: 4.2,
  fish: 2.3, firefight: 7, drink: 1.5,
};

export function massOf(e) { return e.phys.lean + e.phys.fat - Math.max(0, e.phys.waterDef); }

export function bmrKcalDay(e) {
  const p = e.phys, m = massOf(e);
  return 10 * m + 6.25 * p.heightCm - 5 * e.age + (e.sex === 'm' ? 5 : -161);
}

export function bodySurfaceM2(e) { return 0.007184 * Math.pow(massOf(e), 0.425) * Math.pow(e.phys.heightCm, 0.725); }

// Clothing insulation in clo, using the ISO 9920 summation (0.835 * sum + 0.161).
export function clothing(sim, e) {
  let sum = 0, wind = 0, water = 0, n = 0;
  for (const s of Object.values(e.equip)) {
    if (!s) continue; const w = sim.defs.must('item', s.item).wear; if (!w) continue;
    sum += w.clo; wind = Math.max(wind, w.wind); water = Math.max(water, w.water); n++;
  }
  return { clo: n ? 0.835 * sum + 0.161 : 0, wind, water };
}

function run(sim, dt) {
  for (const e of sim.ents.of('settler')) if (e.body.alive) step(sim, e, dt);
}

export function step(sim, e, dt) {
  const p = e.phys, b = e.body, hours = dt / HOUR, days = dt / DAY;
  const mass = massOf(e);
  const bmr = bmrKcalDay(e);
  const condFx = conditionEffects(sim, e);
  const met = p.asleep ? ACTIVITY_MET.sleep : (ACTIVITY_MET[e.agent.activity] ?? 1.4);
  p.met = met;

  // --- digestion: first-order gastric emptying, half-life about 100 minutes
  const st = p.stomach, fe = st.g > 0 ? 1 - Math.exp(-dt / (100 * 60 / Math.LN2)) : 0;
  const fw = st.w > 0 ? 1 - Math.exp(-dt / (20 * 60 / Math.LN2)) : 0;  // water leaves faster
  const aK = st.kcal * fe, aP = st.p * fe, aW = st.w * fw;
  st.kcal -= aK; st.p -= aP; st.f -= st.f * fe; st.c -= st.c * fe; st.w -= aW;
  st.g = Math.max(0, st.g - st.g * fe - aW);
  if (st.g < 1) { st.g = 0; st.kcal = 0; st.p = 0; st.f = 0; st.c = 0; }

  // --- energy balance
  p.glycogen += aK;
  if (p.glycogen > GLYCOGEN_MAX) { p.fat += (p.glycogen - GLYCOGEN_MAX) * 0.85 / FAT_KCAL_KG; p.glycogen = GLYCOGEN_MAX; }
  const burn = bmr / DAY * dt * met * (condFx.kcalMult || 1) + p.shiverKcal;
  p.kcalToday += burn;
  const gShare = clamp(p.glycogen / GLYCOGEN_MAX * 1.1, 0.25, 0.75);
  let fromG = Math.min(p.glycogen, burn * gShare), fromF = burn - fromG;
  p.glycogen -= fromG;
  const fatAvail = (p.fat - p.essentialFat) * FAT_KCAL_KG;
  if (fromF <= fatAvail) p.fat -= fromF / FAT_KCAL_KG;
  else { p.fat = p.essentialFat; p.lean -= (fromF - Math.max(0, fatAvail)) / LEAN_KCAL_KG; }
  // protein turnover: 0.8 g/kg/day; a deficit is taken from lean tissue (1 g protein ~ 5 g lean)
  p.protein += aP - 0.8 * mass * days;
  if (p.protein > 60) p.protein = 60;
  if (p.protein < 0) { p.lean += p.protein * 5 / 1000; p.protein = 0; }
  p.starving = p.fat <= p.essentialFat * 1.15 || p.lean < p.leanStart * 0.88;

  // --- water balance (litres): insensible and minimum urine loss, breathing harder when working,
  // sweat, illness; kidneys shed any surplus within an hour or two.
  const baseL = 1.7 * (mass / 70) * days;
  const breathL = (met - 1) * 0.025 * hours;
  const lossL = baseL + breathL + p.sweatLh * hours + (condFx.waterLPerDay || 0) * days;
  p.waterDef += lossL - aW / 1000;
  if (p.waterDef < 0) p.waterDef = Math.min(0, p.waterDef + 0.8 * hours);
  const dehydPct = Math.max(0, p.waterDef) / mass * 100;
  p.dehydPct = dehydPct;

  // --- heat balance
  thermo(sim, e, dt, bmr, met, condFx, mass);

  // --- sleep pressure (Process S) and circadian rhythm (Process C)
  const quality = p.asleep ? sleepQuality(sim, e) : 0;
  if (p.asleep) p.S *= Math.exp(-hours / 4.2 * quality);
  else p.S += (1 - p.S) * (1 - Math.exp(-hours / 18.2 * (met > 4 ? 1.15 : 1)));
  p.sleepQuality = quality;
  const shift = traitMod(sim, e, 'circadian', 0);
  const C = 0.5 * (1 + Math.cos(2 * Math.PI * (sim.t.hour - 3.5 - shift) / 24));
  p.circadian = C;
  p.sleepiness = clamp(p.S * 0.9 + C * 0.22 - 0.06, 0, 1);

  // --- perceived signals
  const appetite = traitMod(sim, e, 'appetite', 1);
  const gFrac = p.glycogen / GLYCOGEN_MAX, sat = clamp(st.g / 700, 0, 1);
  p.hunger = p.starving ? 1 : clamp((1 - gFrac * 0.9 - sat * 0.95 + 0.12) * appetite, 0, 1);
  if (condFx.nausea) p.hunger *= 1 - condFx.nausea;
  p.thirst = clamp(dehydPct / 3.5 - st.w / 1500, 0, 1);
}

function thermo(sim, e, dt, bmr, met, condFx, mass) {
  const p = e.phys, W = sim.weather;
  const i = e.i;
  const Teff = feltTemp(sim, i);
  const exposure = windExposure(sim, i);
  const cl = clothing(sim, e);
  // wetting and drying
  const rainEx = rainExposure(sim, i);
  if (W.precip > 0 && W.type !== 'snow' && rainEx > 0) p.wet = clamp(p.wet + W.precip * rainEx * (1 - cl.water * 0.7) * dt / HOUR * 0.12, 0, 1);
  else if (W.type === 'snow' && W.precip > 0 && rainEx > 0) p.wet = clamp(p.wet + W.precip * rainEx * 0.02 * dt / HOUR, 0, 1);
  if (sim.world.water[i] > 0.3 && sim.world.ice[i] < 0.08) p.wet = Math.min(1, p.wet + 0.5);
  const dry = (0.15 + 0.03 * Math.max(0, Teff) + W.wind * exposure * 0.02 + (sim.heat.get(i) || 0) * 0.04) * (1 - W.humidity * 0.4);
  p.wet = Math.max(0, p.wet - dry * dt / HOUR);

  let clo = cl.clo * (1 - p.wet * 0.55);
  if (p.asleep) {
    const bed = p.bedId ? sim.ents.get(p.bedId) : null;
    clo += bed && bed.built ? sim.defs.must('structure', bed.def).bed.clo : 0.2;
    for (const s of e.inv) { const d = sim.defs.must('item', s.item); if (d.bedClo) clo += d.bedClo * (bed ? 1 : 0.8); }
  }
  for (const be of sim.ents.at(i)) if (be.kind === 'building' && be.built) { const sh = sim.defs.must('structure', be.def).shelter; if (sh) clo += sh.clo; }
  clo += traitMod(sim, e, 'cold', 0);
  const wind = Math.max(0.1, W.wind * 0.6 * exposure * (1 - cl.wind * 0.5));
  const Ra = 1 / (3.1 + 8.3 * Math.sqrt(wind) + 4.7);
  const vaso = clamp((37.05 - p.core) / 0.5, 0, 1);
  const Rt = 0.035 + 0.085 * vaso;
  const A = bodySurfaceM2(e);
  const loss = (p.core - Teff) / (Rt + clo * 0.155 + Ra) * A;
  const metW = bmr / DAY * met * (condFx.kcalMult || 1) * KCAL_J;
  const respW = 0.08 * metW + 8;
  // set point rises with fever
  const setPoint = 37 + (condFx.fever || 0) + woundFever(e);
  // shivering: anticipatory when losing heat fast, plus proportional to how far core has dropped
  const bmrW = bmr / DAY * KCAL_J;
  const deficit = loss + respW - metW;
  // Sustained shivering tops out around 2.5x resting heat and fades as glycogen runs down.
  const shiverMax = 2.5 * bmrW * clamp(p.glycogen / GLYCOGEN_MAX * 1.6, 0.25, 1) * clamp(e.body.caps.consciousness * 1.2, 0, 1);
  let shiverW = 0;
  if (!p.asleep || p.core < 36.2) shiverW = clamp(deficit * 0.6 * (Teff < 22 ? 1 : 0) + (setPoint - 0.2 - p.core) * 300, 0, shiverMax);
  else shiverW = clamp((setPoint - 0.5 - p.core) * 250, 0, shiverMax);
  // sweating, limited by humidity and clothing
  let sweatW = 0;
  if (p.core > setPoint + 0.1) sweatW = Math.min((p.core - setPoint - 0.1) * 450 + Math.max(0, -deficit) * 0.7, 700 * (1 - W.humidity * 0.5) / (1 + clo * 0.6));
  if (p.dehydPct > 5) sweatW *= 0.6;
  p.sweatLh = sweatW / 675;
  p.shiverKcal = shiverW / KCAL_J * dt;
  const net = metW + shiverW - loss - respW - sweatW;
  p.core += net * dt / (mass * 3470);
  p.core = clamp(p.core, 15, 46);
  p.heatW = metW + shiverW; p.lossW = loss + respW + sweatW; p.clo = clo; p.feltC = Teff; p.windAtBody = wind; p.shiverW = shiverW;
  p.cold = clamp((setPoint - 0.15 - p.core) / 1.6 + clamp((loss - metW - shiverW * 0.5) / 160, 0, 0.6) * (Teff < 15 ? 1 : 0), 0, 1);
  p.hot = clamp((p.core - setPoint - 0.3) / 1.4 + (sweatW > 300 ? 0.25 : 0), 0, 1);
  // frostbite on exposed extremities in hard cold
  const windChill = Teff - wind * 0.9;
  if (windChill < -12 && sim.rng.chance(clamp((-12 - windChill) * 0.004, 0, 0.2) * dt / HOUR)) {
    const covered = (slot) => !!e.equip[slot];
    const parts = [];
    if (!covered('hands')) parts.push('lArm', 'rArm');
    if (!covered('feet')) parts.push('lLeg', 'rLeg');
    if (!covered('head')) parts.push('head');
    if (parts.length) sim.health.wound(sim, e, sim.rng.pick(parts), 'frostbite', sim.rng.range(1, 4), 'the cold');
  }
}

function woundFever(e) {
  let m = 0; for (const w of e.body.wounds) m = Math.max(m, w.inf || 0);
  return m > 0.3 ? (m - 0.3) * 2.2 : 0;
}

export function conditionEffects(sim, e) {
  const fx = { kcalMult: 1, waterLPerDay: 0, nausea: 0, fever: 0, pain: 0, organ: 0, caps: {} };
  for (const c of e.body.conds) {
    if (!c.sev) continue;
    const d = sim.defs.must('condition', c.id).effects, s = c.sev;
    fx.kcalMult *= 1 + ((d.kcalMult || 1) - 1) * s;
    fx.waterLPerDay += (d.waterLPerDay || 0) * s;
    fx.nausea = Math.max(fx.nausea, (d.nausea || 0) * s);
    fx.fever = Math.max(fx.fever, (d.fever || 0) * s);
    fx.pain += (d.pain || 0) * s; fx.organ += (d.organ || 0) * s;
    for (const [k, v] of Object.entries(d.caps || {})) fx.caps[k] = (fx.caps[k] ?? 1) * (1 - (1 - v) * s);
  }
  return fx;
}

export function sleepQuality(sim, e) {
  const p = e.phys;
  const bed = p.bedId ? sim.ents.get(p.bedId) : null;
  let q = bed && bed.built && bed.i === e.i ? sim.defs.must('structure', bed.def).bed.quality : 0.68;
  if (sim.world.roof[e.i] || sim.world.room[e.i]) q += 0.1;
  q *= 1 - clamp(p.cold, 0, 1) * 0.5;
  q *= 1 - p.wet * 0.3;
  q *= 1 - e.body.pain * 0.5;
  if (p.hunger > 0.85) q *= 0.8;
  return clamp(q, 0.15, 1.1);
}

// Eating: puts a portion in the stomach. Returns grams eaten.
export function ingest(sim, e, nut, units, gramsPerUnit) {
  const st = e.phys.stomach;
  st.kcal += nut.kcal * nut.digest * units; st.p += nut.p * units * Math.min(1, nut.digest + 0.1); st.f += nut.f * units; st.c += nut.c * units;
  st.w += nut.w * units; st.g += gramsPerUnit * units;
  e.phys.lastMeal = sim.tick;
}

export function drinkWater(e, litres) { e.phys.stomach.w += litres * 1000; e.phys.stomach.g += litres * 1000; }

export const physiologySystem = { name: 'physiology', every: 60, offset: 13, run };
export { airTemp };
