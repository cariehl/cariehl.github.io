// Plant life, hourly, per hex: growth from growing degree days (scaled for season compression), moisture
// stress, frost, fruiting windows, regrowth after picking, forage recovery, and spread into empty ground.
import { clamp, DAY } from '../core/units.js';
import { outdoorTemp } from './environment.js';

export function seasonScale(sim) { return 91.25 / sim.cal.daysPerSeason; }

function inWindow(win, f) { return win[0] <= win[1] ? f >= win[0] && f <= win[1] : f >= win[0] || f <= win[1]; }

function run(sim, dt) {
  const w = sim.world, defs = sim.defs, scale = seasonScale(sim), hours = dt / 3600, days = dt / DAY;
  const yf = sim.t.yearFrac, rng = sim.rng;
  for (let i = 0; i < w.N; i++) {
    const fi = w.flora[i]; if (!fi) continue;
    const f = defs.at('flora', fi), g = f.growth;
    const T = outdoorTemp(sim, i);
    const gdd = Math.max(0, Math.min(T, 30) - g.baseC) * hours / 24 * scale;
    const m = w.moist[i];
    const stress = m < g.moist[0] ? (g.moist[0] - m) / Math.max(0.05, g.moist[0]) : m > g.moist[1] ? (m - g.moist[1]) / Math.max(0.05, 1 - g.moist[1]) : 0;
    const fert = defs.at('terrain', w.terrain[i]).fertility || 0.3;
    if (f.crop) {
      if (w.growth[i] < 1) {
        w.growth[i] = Math.min(1, w.growth[i] + gdd / g.gdd * clamp(1 - stress, 0, 1) * (0.5 + 0.5 * fert));
        if (w.growth[i] >= 1) { w.yield[i] = f.yield.max * clamp(0.55 + 0.45 * fert, 0.3, 1.2); w.regrow[i] = 0; sim.events.emit('crop_ripe', { i }); }
      } else {
        w.regrow[i] += days * scale / 6; // overripe clock in season-scaled days
        if (w.regrow[i] > f.yield.overripeDays) w.yield[i] = Math.max(0, w.yield[i] - f.yield.max * 0.05 * hours);
      }
      if (T < g.frostC) {
        const dmg = (g.frostC - T) * 0.08 * hours;
        w.growth[i] = Math.max(0, w.growth[i] - dmg); w.yield[i] *= Math.max(0, 1 - dmg);
        if (w.growth[i] <= 0.02 || (w.growth[i] < 1 && T < g.frostC - 4)) { killPlant(sim, i, 'frost'); continue; }
      }
      if (stress > 0.8 && rng.chance(0.002 * hours)) { killPlant(sim, i, 'drought'); continue; }
      continue;
    }
    // trees and shrubs mature over years
    if (w.growth[i] < 1) w.growth[i] = Math.min(1, w.growth[i] + gdd / g.gdd * (1 - Math.min(1, stress)));
    // yield
    const y = f.yield;
    if (y) {
      const max = y.max * (f.form === 'tree' || f.form === 'conifer' ? Math.max(0.3, w.growth[i]) : 1);
      if (y.window) {
        if (inWindow(y.window, yf)) {
          if (w.regrow[i] <= 0) w.yield[i] = Math.min(max, w.yield[i] + max * hours / (24 * (y.window[1] - y.window[0]) * sim.cal.daysPerSeason * 4 * 0.3));
        } else { w.yield[i] = Math.max(0, w.yield[i] - max * 0.02 * hours); w.regrow[i] = 0; }
      } else if (T > 2 || f.form === 'tree' || f.form === 'conifer') {
        w.yield[i] = Math.min(max, w.yield[i] + max * days / y.regrowDays);
      }
      if (w.regrow[i] > 0) w.regrow[i] = Math.max(0, w.regrow[i] - days);
    }
    // forage regrows when warm
    if (f.forage && w.forage[i] < 1 && T > 4) w.forage[i] = Math.min(1, w.forage[i] + gdd * 0.004);
    // drought and frost damage to perennials are rare; hard frost kills tender ones
    if (T < g.frostC) { killPlant(sim, i, 'frost'); continue; }
    // spread
    if (f.spread && T > 6 && rng.chance(f.spread * hours / (24 * sim.cal.daysPerSeason * 4) * 4)) {
      const n = w.nb[i * 6 + rng.int(6)];
      if (n >= 0 && canGrow(sim, n, f)) { w.flora[n] = f.index; w.growth[n] = 0.05; w.yield[n] = 0; w.forage[n] = 0.3; }
    }
  }
}

export function canGrow(sim, i, f) {
  const w = sim.world;
  if (w.flora[i] || w.struct[i] || w.water[i] > 0.05 || w.zone[i] || w.fire[i] > 0) return false;
  for (const e of sim.ents.at(i)) if (e.kind === 'building' || e.kind === 'blueprint') return false;
  const t = sim.defs.at('terrain', w.terrain[i]);
  if (!t.fertility) return false;
  if (f.habitat && !f.habitat.soils.includes(t.id) && t.id !== 'ash') return false;
  const m = w.moist[i];
  return m >= f.growth.moist[0] && m <= f.growth.moist[1];
}

export function killPlant(sim, i, cause) {
  const w = sim.world, f = sim.defs.at('flora', w.flora[i]);
  w.flora[i] = 0; w.growth[i] = 0; w.yield[i] = 0; w.regrow[i] = 0; w.forage[i] = 0;
  if (f?.crop) sim.events.emit('crop_died', { i, cause, flora: f.id });
  w.version++;
}

export const plantsSystem = { name: 'plants', every: 3600, offset: 11, run };
