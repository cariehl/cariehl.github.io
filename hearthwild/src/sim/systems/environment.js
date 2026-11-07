// Local conditions at a hex: air temperature, radiant heat from fires, wind exposure, rain exposure and
// light. Heat and light from fires are rebuilt every 10 seconds into sparse maps.
import { clamp } from '../core/units.js';

export function outdoorTemp(sim, i) {
  return sim.weather.tempC - sim.climate.lapseCPerM * (sim.world.elev[i] - sim.refElev);
}

export function airTemp(sim, i) {
  const r = sim.world.room[i];
  if (r) { const room = sim.rooms.get(r); if (room && room.temp !== null) return room.temp; }
  return outdoorTemp(sim, i) + (shelterAt(sim, i) ? 1 : 0);
}

// Temperature a body or an item actually feels, including radiant heat from nearby fires.
export function feltTemp(sim, i) { return airTemp(sim, i) + (sim.heat.get(i) || 0); }

export function shelterAt(sim, i) {
  for (const e of sim.ents.at(i)) if (e.kind === 'building' && e.built) { const d = sim.defs.must('structure', e.def); if (d.shelter) return d.shelter; }
  return null;
}

export function roofed(sim, i) { return !!sim.world.roof[i] || !!shelterAt(sim, i); }

export function windExposure(sim, i) {
  const w = sim.world;
  if (w.room[i]) return 0.03;
  let ex = 1;
  const f = w.flora[i]; if (f) ex *= 1 - (sim.defs.at('flora', f).wind || 0);
  let walls = 0; for (const n of w.neighbors(i)) if (w.struct[n]) walls++;
  ex *= 1 - walls * 0.1;
  // Trees around shelter too.
  let trees = 0; for (const n of w.neighbors(i)) { const g = w.flora[n]; if (g && sim.defs.at('flora', g).wind > 0.3) trees++; }
  ex *= 1 - trees * 0.06;
  const sh = shelterAt(sim, i); if (sh) ex *= 1 - sh.wind;
  return clamp(ex, 0.03, 1);
}

// 0..1 how much rain reaches a body standing here.
export function rainExposure(sim, i) {
  if (sim.world.roof[i]) return 0;
  const sh = shelterAt(sim, i); if (sh) return 1 - sh.rain;
  const f = sim.world.flora[i]; if (f) return 1 - (sim.defs.at('flora', f).shade || 0) * 0.6;
  return 1;
}

export function lightAt(sim, i) {
  const t = sim.t, W = sim.weather;
  let day = t.sky * (1 - 0.55 * W.cloud);
  if (sim.world.room[i]) day *= 0.25; else if (sim.world.roof[i]) day *= 0.6;
  const f = sim.world.flora[i]; if (f) day *= 1 - (sim.defs.at('flora', f).shade || 0) * 0.4;
  const moon = 0.04;
  return clamp(Math.max(day, moon, sim.light.get(i) || 0), 0, 1);
}

function rebuild(sim) {
  sim.heat = new Map(); sim.light = new Map();
  const w = sim.world;
  const add = (center, kw, lightR) => {
    for (const j of w.within(center, Math.max(3, lightR))) {
      const d = w.dist(center, j);
      if (d <= 3) { const dT = kw * 1.2 / (1 + d * d * 1.6); sim.heat.set(j, (sim.heat.get(j) || 0) + dT); }
      if (d <= lightR) { const l = clamp(1 - d / (lightR + 1), 0, 1) * 0.9; sim.light.set(j, Math.max(sim.light.get(j) || 0, l)); }
    }
  };
  for (const b of sim.ents.of('building')) {
    if (!b.lit) continue;
    const d = sim.defs.must('structure', b.def), frac = clamp(b.fuel / 4, 0.25, 1);
    add(b.i, d.fire.heatKW * frac, Math.round(d.fire.light * (0.6 + 0.4 * frac)));
  }
  for (const i of sim.fires) add(i, 25 * w.fire[i], 4);
}

export const environmentSystem = { name: 'environment', every: 10, offset: 1, run: (sim) => rebuild(sim) };
