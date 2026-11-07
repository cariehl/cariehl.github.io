// Items on the ground and in packs: spoilage by temperature (Q10 = 2, near-stopped below freezing), and
// colony-wide queries used by the AI and the UI.
import { DAY } from '../core/units.js';
import { airTemp } from './environment.js';

export function spoilRate(T) { return T < -1 ? 0.02 : Math.pow(2, (T - 20) / 10); }

function spoil(sim, s, T, days) {
  const d = sim.defs.must('item', s.item);
  if (!d.shelf || s.fresh === undefined) return false;
  s.fresh -= days / d.shelf * spoilRate(T);
  return s.fresh <= 0;
}

function run(sim, dt) {
  const days = dt / DAY, rotted = [];
  for (const e of [...sim.ents.of('item')]) {
    if (spoil(sim, e.stack, airTemp(sim, e.i), days)) { rotted.push(e.stack.item); sim.ents.remove(e); }
  }
  for (const e of sim.ents.of('settler')) {
    if (e.i < 0) continue;
    const T = airTemp(sim, e.i) + 4; // body heat warms a pack a little
    for (let k = e.inv.length - 1; k >= 0; k--) if (spoil(sim, e.inv[k], T, days)) { rotted.push(e.inv[k].item); e.inv.splice(k, 1); }
  }
  for (const c of [...sim.ents.of('corpse')]) {
    c.fresh = (c.fresh ?? 1) - days / 2.5 * spoilRate(airTemp(sim, c.i));
    if (c.fresh < -1.5) { sim.ents.remove(c); sim.events.emit('corpse_gone', { id: c.id }); }
  }
  if (rotted.length) sim.events.emit('rotted', { items: rotted });
}

export const itemsSystem = { name: 'items', every: 600, offset: 23, run };

// --- queries
export function stockpileZone(sim, i) {
  const z = sim.world.zone[i]; if (!z) return null;
  const zone = sim.zones.get(z); return zone && zone.type === 'stockpile' ? zone : null;
}

export function isStored(sim, e) {
  const z = stockpileZone(sim, e.i); if (!z) return false;
  return z.allow.includes(sim.defs.must('item', e.stack.item).cat);
}

// Units of an item (or matching a predicate) the colony has on the ground plus in packs.
export function colonyCount(sim, pred) {
  let n = 0;
  for (const e of sim.ents.of('item')) if (pred(e.stack)) n += e.stack.qty;
  for (const s of sim.ents.of('settler')) for (const st of s.inv) if (pred(st)) n += st.qty;
  return n;
}

export function colonyFoodKcal(sim) {
  let k = 0;
  const add = (s) => { const d = sim.defs.must('item', s.item); if (d.cat !== 'food' || d.water) return; const nut = s.nut ? s.nut.kcal : d.nut ? d.nut.kcal * d.kg * 10 : 0; k += nut * s.qty * (d.digest ?? 0.9); };
  for (const e of sim.ents.of('item')) add(e.stack);
  for (const s of sim.ents.of('settler')) for (const st of s.inv) add(st);
  return k;
}
