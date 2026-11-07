// Fire. Campfires burn fuel and go out; in dry, windy weather they throw embers. Wildfire on a hex burns
// the plant's fuel load, spreads by fuel, dryness, wind direction and slope, and is put out by rain.
import { clamp } from '../core/units.js';
import { DIRS, toPlane } from '../core/hex.js';
import { killPlant } from './plants.js';

export function ignite(sim, i, intensity = 0.3) {
  const w = sim.world;
  if (w.water[i] > 0.05 || w.fire[i] > 0) return false;
  if (fuelAt(sim, i) <= 0.1) return false;
  w.fire[i] = intensity; sim.fires.add(i);
  sim.events.emit('wildfire', { i });
  return true;
}

export function fuelAt(sim, i) {
  const w = sim.world, f = w.flora[i];
  let kg = f ? sim.defs.at('flora', f).fuelKg * (0.3 + 0.7 * w.growth[i]) : 0;
  if (w.roof[i]) kg += 8;
  if (w.struct[i]) kg += 20 * (sim.defs.at('structure', w.struct[i]).flam || 0);
  return kg * (1 - 0.8 * Math.min(1, w.snow[i] * 5));
}

function flamAt(sim, i) {
  const w = sim.world, f = w.flora[i];
  let fl = f ? sim.defs.at('flora', f).flam : 0;
  if (w.roof[i]) fl = Math.max(fl, sim.defs.at('structure', w.roof[i]).flam);
  if (w.struct[i]) fl = Math.max(fl, sim.defs.at('structure', w.struct[i]).flam);
  return fl;
}

function run(sim, dt) {
  const w = sim.world, W = sim.weather, rng = sim.rng, h = dt / 3600;
  const rain = W.type === 'rain' || W.type === 'sleet' ? W.precip : 0;
  // campfires
  for (const b of sim.ents.of('building')) {
    if (!b.lit) continue;
    const d = sim.defs.must('structure', b.def);
    const exposed = !w.roof[b.i] && !w.room[b.i];
    b.fuel -= d.fire.burnKgH * h * (1 + W.wind * 0.03);
    if (exposed && rain > 0.5 && rng.chance(rain * 0.04 * h * 6)) { b.lit = false; sim.events.emit('fire_out', { id: b.id, cause: 'rain' }); continue; }
    if (b.fuel <= 0) { b.fuel = 0; b.lit = false; sim.events.emit('fire_out', { id: b.id, cause: 'fuel' }); continue; }
    // embers
    if (W.wind > 5 && rain === 0) {
      const p = 0.0015 * (W.wind - 5) * h * 360;
      if (rng.chance(p)) {
        const n = downwind(sim, b.i, 1 + rng.int(2));
        if (n >= 0 && w.moist[n] < 0.35 && rng.chance(flamAt(sim, n) * (1 - w.moist[n] * 2))) { if (ignite(sim, n, 0.15)) sim.events.emit('ember', { from: b.id, i: n }); }
      }
    }
  }
  // wildfire
  if (!sim.fires.size) return;
  for (const i of [...sim.fires]) {
    let it = w.fire[i];
    const fuel = fuelAt(sim, i);
    if (fuel <= 0.05 || it <= 0.01) { extinguish(sim, i, true); continue; }
    it = clamp(it + (flamAt(sim, i) * (1 - w.moist[i]) * 0.5 - rain * 0.15 - 0.05) * h * 6, 0, 1);
    w.fire[i] = it;
    // consume fuel: growth stands in for the plant's remaining fuel
    if (w.flora[i]) { w.growth[i] -= it * h * 4; w.yield[i] = 0; w.forage[i] = 0; if (w.growth[i] <= 0) killPlant(sim, i, 'fire'); }
    if (w.roof[i] && rng.chance(it * h * 6)) { w.roof[i] = 0; w.version++; sim.roomsDirty = true; sim.events.emit('burned', { i, what: 'roof' }); }
    if (w.struct[i]) { w.structHp[i] -= it * 60 * h * 6 * flamAt(sim, i); if (w.structHp[i] <= 0) { w.struct[i] = 0; w.version++; sim.roomsDirty = true; sim.events.emit('burned', { i, what: 'wall' }); } }
    // spread
    for (let d = 0; d < 6; d++) {
      const n = w.nb[i * 6 + d]; if (n < 0 || w.fire[n] > 0) continue;
      const fl = flamAt(sim, n); if (!fl) continue;
      const wf = windFactor(sim, d), slope = clamp(1 + (w.elev[n] - w.elev[i]) * 0.15, 0.5, 2);
      const p = it * fl * Math.max(0, 1 - w.moist[n] * 1.6) * wf * slope * h * 6 * 0.35;
      if (rng.chance(p)) ignite(sim, n, it * 0.4);
    }
    if (rain > 2 && rng.chance(0.3 * h * 6)) w.fire[i] *= 0.5;
  }
}

export function extinguish(sim, i, burntOut = false) {
  const w = sim.world;
  w.fire[i] = 0; sim.fires.delete(i);
  if (burntOut) { w.burnt[i] = 1; const t = sim.defs.at('terrain', w.terrain[i]); if (t.tags.includes('soil') && !t.tags.includes('tilled')) w.terrain[i] = sim.defs.must('terrain', 'ash').index; w.version++; }
}

function windFactor(sim, d) {
  const [x, y] = toPlane(DIRS[d][0], DIRS[d][1]);
  const a = Math.atan2(y, x), wd = sim.weather.windDir;
  const along = Math.cos(a - wd);
  return clamp(1 + along * sim.weather.wind * 0.12, 0.2, 3);
}

function downwind(sim, i, n) {
  const w = sim.world; let best = 0, bd = -2;
  for (let d = 0; d < 6; d++) { const [x, y] = toPlane(DIRS[d][0], DIRS[d][1]); const c = Math.cos(Math.atan2(y, x) - sim.weather.windDir); if (c > bd) { bd = c; best = d; } }
  let j = i; for (let k = 0; k < n; k++) { const nx = w.nb[j * 6 + best]; if (nx < 0) break; j = nx; }
  return j === i ? -1 : j;
}

export const fireSystem = { name: 'fire', every: 10, offset: 5, run };
