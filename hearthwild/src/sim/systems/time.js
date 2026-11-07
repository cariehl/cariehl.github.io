// Calendar, sun and daylight. sim.t is recomputed every tick and read by everything else.
import { DAY, HOUR, clamp, smooth } from '../core/units.js';
const RAD = Math.PI / 180;

export function computeTime(sim) {
  const cal = sim.cal;
  const clock = sim.tick + sim.startClock;
  const day = Math.floor(clock / DAY), hour = (clock % DAY) / HOUR;
  const yearDays = cal.daysPerSeason * 4;
  const dayOfYear = day % yearDays;
  const yearFrac = (dayOfYear + hour / 24) / yearDays;
  const season = Math.floor(dayOfYear / cal.daysPerSeason);
  const decl = 23.44 * Math.sin(2 * Math.PI * yearFrac) * RAD;
  const lat = cal.latitude * RAD, ha = (hour - 12) * 15 * RAD;
  const sinEl = Math.sin(lat) * Math.sin(decl) + Math.cos(lat) * Math.cos(decl) * Math.cos(ha);
  const sunEl = Math.asin(clamp(sinEl, -1, 1)) / RAD;
  // Day length from the sunrise equation.
  const cosH0 = clamp(-Math.tan(lat) * Math.tan(decl), -1, 1);
  const dayLengthH = 2 * Math.acos(cosH0) / RAD / 15;
  const sunrise = 12 - dayLengthH / 2, sunset = 12 + dayLengthH / 2;
  // Civil twilight down to -6 degrees; full daylight above about 8 degrees.
  const sky = smooth((sunEl + 6) / 14);
  return {
    clock, day, hour, year: Math.floor(day / yearDays) + 1, season, seasonName: cal.seasons[season],
    dayOfSeason: dayOfYear % cal.daysPerSeason + 1, dayOfYear, yearFrac, sunEl, sky, dayLengthH, sunrise, sunset,
    // Real day-of-year (for climate tables that think in real months).
    realDoy: (cal.equinoxDoy + yearFrac * 365) % 365,
    isNight: sunEl < -3,
  };
}

export const timeSystem = { name: 'time', every: 1, run(sim) { sim.t = computeTime(sim); } };

export function fmtTime(t) {
  const h = Math.floor(t.hour), m = Math.floor((t.hour - h) * 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
