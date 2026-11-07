// Crafting and cooking: bills (standing orders) at stations, ingredient collection, and producing the
// result. Meals carry the summed nutrition of what went in.
import { matches, takeFromInv, makeStack, unitNutrition, countInv } from '../stacks.js';
import { spawnItem } from '../factory.js';
import { collect, bestToolItem, freeItems } from './jobs.js';
import { toolQuality } from './actions.js';
import { colonyCount } from './items.js';
import { learn } from './mind.js';

export function billActive(sim, bill) {
  if (bill.paused) return false;
  const r = sim.defs.must('recipe', bill.recipe);
  if (bill.mode === 'count') return bill.done < bill.n;
  if (bill.mode === 'until') return colonyCount(sim, s => s.item === r.out[0].item) < bill.n;
  return true;
}

export function stations(sim, type) { return [...sim.ents.of('building')].filter(b => b.built && sim.defs.must('structure', b.def).station === type); }

export function wantsStation(sim, type) {
  if (!type) return false;
  return sim.bills.some(b => sim.defs.must('recipe', b.recipe).station === type && billActive(sim, b));
}

function toolAvailable(sim, e, q, min) {
  if (toolQuality(sim, e, q) >= min) return { steps: [], reserve: [] };
  const it = bestToolItem(sim, e, q);
  if (!it || sim.defs.must('item', it.stack.item).tool[q] < min) return null;
  return { steps: [{ a: 'goto', i: it.i }, { a: 'pickup', id: it.id, qty: 1 }], reserve: [it.id] };
}

export function giver(sim, e, cooking) {
  for (const bill of sim.bills) {
    const r = sim.defs.must('recipe', bill.recipe);
    if ((r.skill === 'cooking') !== cooking || !billActive(sim, bill)) continue;
    const key = 'bill:' + bill.id;
    const c = sim.claims.get(key); if (c && c !== e.id && sim.ents.get(c)?.agent?.plan?.claim === key) continue;
    let station = null;
    if (r.station) {
      const list = stations(sim, r.station).filter(b => r.station !== 'campfire' || b.lit).sort((a, b) => sim.world.dist(e.i, a.i) - sim.world.dist(e.i, b.i));
      station = list[0]; if (!station) continue;
      if (r.nearWater && !sim.world.within(station.i, r.nearWater).some(j => sim.world.water[j] > 0.05)) continue;
    }
    const steps = [], reserve = [];
    let ok = true;
    for (const [q, min] of Object.entries(r.needs || {})) {
      const t = toolAvailable(sim, e, q, min); if (!t) { ok = false; break; }
      steps.push(...t.steps); reserve.push(...t.reserve);
    }
    if (!ok) continue;
    const used = [];
    for (const spec of r.in) {
      const pred = (s) => matches(sim.defs, s, spec) && !used.some(u => u === s);
      const col = collect(sim, e, pred, spec.qty);
      if (!col) { if (spec.optional) continue; ok = false; break; }
      steps.push(...col.steps); reserve.push(...col.reserve);
    }
    if (!ok) continue;
    const at = station ? station.i : e.i;
    const adj = station && !sim.defs.must('structure', station.def).passable;
    steps.push({ a: 'goto', i: at, adj }, { a: 'work', job: 'craft', recipe: r.id, bill: bill.id, station: station?.id, secs: r.work, skill: r.skill, activity: r.skill === 'cooking' ? 'cook' : 'craft', fine: r.skill !== 'cooking' });
    return { label: r.name, claim: key, steps, reserve };
  }
  return null;
}

export function finish(sim, e, st) {
  const r = sim.defs.must('recipe', st.recipe), bill = sim.bills.find(b => b.id === st.bill);
  // take ingredients
  const taken = [];
  for (const spec of r.in) {
    const got = takeFromInv(e.inv, s => matches(sim.defs, s, spec), spec.qty);
    const n = got.reduce((a, s) => a + s.qty, 0);
    if (n < spec.qty && !spec.optional) { for (const s of got) e.inv.push(s); for (const s of taken) e.inv.push(s); return false; }
    taken.push(...got);
  }
  const station = st.station ? sim.ents.get(st.station) : null;
  if (r.fuelMJ && station?.fuel !== undefined) station.fuel = Math.max(0, station.fuel - r.fuelMJ / 15);
  // meals: nutrition per unit from the ingredients
  let nut = null;
  if (r.meal) {
    nut = { kcal: 0, p: 0, f: 0, c: 0, w: 0 };
    for (const s of taken) { const n = unitNutrition(sim.defs, s); if (!n) continue; for (const k of Object.keys(nut)) nut[k] += n[k] * s.qty; }
    const outQ = r.out[0].qty, kg = sim.defs.must('item', r.out[0].item).kg;
    for (const k of Object.keys(nut)) nut[k] /= outQ;
    nut.w = Math.max(nut.w, kg * 1000 - nut.p - nut.f - nut.c);
  }
  const skill = e.skills[r.skill]?.lvl ?? 0;
  for (const o of r.out) {
    const extra = {};
    if (o.mat === 'input') { const src = taken.find(s => s.mat); if (src) extra.mat = src.mat; } else if (o.mat) extra.mat = o.mat;
    if (nut && o === r.out[0]) extra.nut = { ...nut };
    if (sim.defs.must('item', o.item).tool || sim.defs.must('item', o.item).wear) extra.q = Math.min(1.3, 0.7 + skill * 0.03);
    spawnItem(sim, station ? station.i : e.i, makeStack(sim.defs, o.item, o.qty, extra));
  }
  if (bill) bill.done++;
  learn(sim, e, r.skill, r.work * 0.4);
  sim.events.emit('crafted', { id: e.id, recipe: r.id });
}

export const craftingApi = { giver, finish, billActive, wantsStation, stations };
