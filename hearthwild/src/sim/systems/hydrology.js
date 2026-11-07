// Snow, soil moisture and ice, per hex, every 10 minutes.
//  - Snowfall at about 10:1 snow to water; under roofs none falls.
//  - Melt by degree-days: 4 mm of water (4 cm of snow) per degree-day, more in rain; fires melt nearby snow.
//  - Soil moisture: a 300 mm root zone. Rain and melt fill it; evapotranspiration (rising with temperature
//    and sun) drains it, scaled by how freely the soil drains; ground water keeps hexes by water damp.
//  - Ice: Stefan's law, thickness^2 grows with freezing degree-days.
import { clamp, DAY } from '../core/units.js';
import { outdoorTemp } from './environment.js';

function run(sim, dt) {
  const w = sim.world, W = sim.weather, days = dt / DAY, defs = sim.defs;
  const precipMM = W.precip * dt / 3600;
  const snowing = W.type === 'snow' || (W.type === 'sleet' && sim.rng.chance(0.5));
  const sun = sim.t.sky * (1 - W.cloud);
  for (let i = 0; i < w.N; i++) {
    const T = outdoorTemp(sim, i) + (sim.heat.get(i) || 0);
    const covered = w.roof[i] > 0;
    // snow
    let s = w.snow[i];
    if (!covered && precipMM > 0 && snowing) s += precipMM * 0.01;
    if (s > 0) {
      let melt = 0;
      if (T > 0) melt += 0.04 * T * days * (1 + sun * 0.6);
      if (!snowing && precipMM > 0) melt += precipMM * 0.0012;
      s = Math.max(0, s * (1 - 0.02 * days) - melt);
      if (s > 0 && w.water[i] > 0.05 && w.ice[i] < 0.05) s = 0;
      if (melt > 0) w.moist[i] = Math.min(1, w.moist[i] + melt * 0.1 / 0.3);
    }
    w.snow[i] = s;
    // soil moisture
    if (w.water[i] <= 0.05) {
      const td = defs.at('terrain', w.terrain[i]);
      let m = w.moist[i];
      if (!covered && precipMM > 0 && !snowing) m += precipMM / 300;
      const et = T > 0 && s < 0.02 ? (0.4 + 0.12 * T) * (0.4 + sun) : 0; // mm/day
      m -= et * days / 300 * td.drain;
      m = Math.max(m, w.wetness[i] * 0.6);     // groundwater floor
      w.moist[i] = clamp(m, 0, 1);
    } else {
      // ice
      const h = w.ice[i];
      if (T < 0) w.ice[i] = Math.sqrt(h * h + 0.00073 * -T * days * (w.water[i] > 2 ? 1 : 0.7));
      else if (h > 0) w.ice[i] = Math.max(0, h - 0.012 * T * days - (precipMM > 0 && !snowing ? precipMM * 0.0005 : 0));
    }
  }
}

export const hydrologySystem = { name: 'hydrology', every: 600, offset: 7, run };
