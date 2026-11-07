// Weather: seasonal mean + diurnal cycle damped by cloud + an autoregressive anomaly, with a two-state
// cloud process, precipitation (rain, sleet or snow by temperature), wind and storms.
import { clamp, HOUR, DAY } from '../core/units.js';

export function initWeather(sim) {
  const c = sim.climate;
  sim.weather = { tempC: 5, anomaly: sim.rng.normal(0, 2), cloudy: false, cloud: 0.3, precip: 0, type: 'none',
    wind: c.windMean, windDir: sim.rng.range(0, Math.PI * 2), humidity: 0.7, storm: 0, frontC: 0, override: null };
  update(sim, 0);
}

function seasonalMean(sim) {
  const c = sim.climate, t = sim.t;
  return c.meanC + c.annualAmpC * Math.cos(2 * Math.PI * (t.realDoy - c.warmestDoy) / 365);
}

function update(sim, dt) {
  const W = sim.weather, c = sim.climate, t = sim.t, rng = sim.rng, h = dt / HOUR, s = t.season;
  // anomaly: AR(1) scaled to the step
  if (dt > 0) {
    const rho = Math.pow(c.anomalyRho, h);
    const sdStationary = c.anomalySd / Math.sqrt(1 - c.anomalyRho * c.anomalyRho);
    W.anomaly = W.anomaly * rho + rng.normal(0, sdStationary * Math.sqrt(1 - rho * rho));
    // cloud regime switches
    if (!W.cloudy && rng.chance(1 - Math.pow(1 - c.cloudBuild[s], h))) W.cloudy = true;
    else if (W.cloudy && rng.chance(1 - Math.pow(1 - c.cloudBreak[s], h))) W.cloudy = false;
    const target = W.cloudy ? 0.88 : 0.18 + 0.15 * Math.sin(t.hour / 24 * Math.PI);
    W.cloud += (target - W.cloud) * (1 - Math.exp(-h / 1.5));
    // storms
    if (W.storm > 0) W.storm = Math.max(0, W.storm - h);
    else if (rng.chance(c.stormChancePerDay[s] * dt / DAY)) { W.storm = rng.range(3, 10); W.cloudy = true; }
    // precipitation
    const raining = W.cloud > 0.72 && (W.storm > 0 || (W.precip > 0 ? rng.chance(Math.pow(0.97, h)) : rng.chance(0.25 * h)));
    W.precip = raining ? c.rainRate[s] * Math.exp(rng.normal(0, 0.5)) * (W.storm > 0 ? 3 : 1) : 0;
    // wind: log-AR(1)
    const lw = Math.log(Math.max(0.3, W.wind)), mu = Math.log(c.windMean * (W.storm > 0 ? 3 : 1) * (W.cloudy ? 1.2 : 0.9));
    W.wind = Math.exp(mu + (lw - mu) * Math.pow(0.9, h) + rng.normal(0, 0.15 * Math.sqrt(h)));
    W.windDir += rng.normal(0, 0.12 * Math.sqrt(h));
  }
  const diurnal = c.diurnalAmpC * (1 - 0.6 * W.cloud) * Math.cos(2 * Math.PI * (t.hour - 15) / 24);
  let temp = seasonalMean(sim) + diurnal + W.anomaly + W.frontC - (W.precip > 0 ? 1.5 : 0);
  if (W.override) { temp += W.override.deltaC; W.override.hours -= h; if (W.override.hours <= 0) W.override = null; }
  W.tempC = temp;
  W.type = W.precip <= 0 ? 'none' : temp < 0.5 ? 'snow' : temp < 2 ? 'sleet' : 'rain';
  W.humidity = clamp(0.55 + W.cloud * 0.3 + (W.precip > 0 ? 0.12 : 0) + (t.isNight ? 0.1 : 0), 0.3, 1);
  W.desc = describeWeather(W);
}

export function describeWeather(W) {
  const p = W.precip;
  if (W.storm > 0 && p > 0) return W.type === 'snow' ? 'Blizzard' : 'Storm';
  if (p > 0) return (p > 3 ? 'Heavy ' : p < 0.8 ? 'Light ' : '') + ({ snow: 'snow', sleet: 'sleet', rain: 'rain' }[W.type]);
  if (W.cloud > 0.75) return 'Overcast';
  if (W.cloud > 0.45) return 'Cloudy';
  return W.wind > 9 ? 'Windy' : 'Clear';
}

export const weatherSystem = { name: 'weather', every: 600, offset: 3, run: (sim, dt) => update(sim, dt) };
