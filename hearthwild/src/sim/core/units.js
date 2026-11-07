// Units and fixed constants shared by every system. Everything in the simulation is SI unless a name says
// otherwise: seconds, metres, kilograms, degrees Celsius, kilocalories for food energy, litres for water.
export const TICK = 1;            // game seconds per simulation tick
export const MINUTE = 60;
export const HOUR = 3600;
export const DAY = 86400;
export const HEX_M = 3;           // metres between neighbouring hex centres
export const KCAL_J = 4184;       // joules per kilocalorie
export const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
