// Construction: placing blueprints, delivering materials, and turning finished blueprints into walls,
// roofs and buildings.
import { matches, takeFromInv, countInv } from '../stacks.js';
import { DESIG } from '../world/world.js';
import { killPlant } from './plants.js';
import { blocked, passable } from '../world/path.js';

export function canPlace(sim, defId, i) {
  const w = sim.world, d = sim.defs.get('structure', defId);
  if (!d) return 'Unknown structure';
  if (i < 0 || i >= w.N) return 'Outside the valley';
  if (w.water[i] > 0.05) return 'Cannot build on water';
  const t = sim.defs.at('terrain', w.terrain[i]);
  if (t.move === Infinity) return 'Solid rock in the way';
  for (const e of sim.ents.at(i)) {
    if (e.kind === 'blueprint' && sim.defs.must('structure', e.def).type === d.type) return 'Already planned here';
    if (e.kind === 'blueprint' && d.type !== 'roof' && sim.defs.must('structure', e.def).type !== 'roof') return 'Something is planned here';
    if (e.kind === 'building' && d.type !== 'roof') return 'A building is in the way';
  }
  if (d.type === 'roof') {
    if (w.roof[i]) return 'Already roofed';
    // a roof needs support: a wall within two hexes
    if (!w.within(i, 2).some(j => w.struct[j] || [...sim.ents.at(j)].some(e => e.kind === 'blueprint' && ['wall', 'door'].includes(sim.defs.must('structure', e.def).type)))) return 'A roof needs a wall within two hexes';
  } else if (w.struct[i]) return 'A wall is in the way';
  if (d.type === 'building' && w.struct[i]) return 'A wall is in the way';
  return null;
}

export function place(sim, defId, i) {
  const err = canPlace(sim, defId, i); if (err) return err;
  const d = sim.defs.must('structure', defId), w = sim.world;
  const bp = sim.ents.add({ kind: 'blueprint', i, def: defId, delivered: [], placed: sim.tick });
  if (w.flora[i] && d.type !== 'roof') {
    const f = sim.defs.at('flora', w.flora[i]);
    if (f.chop) { w.desig[i] |= DESIG.chop; sim.desigSet.add(i); }
  }
  sim.events.emit('planned', { id: bp.id, def: defId, i });
  return bp;
}

export function missing(sim, bp) {
  const d = sim.defs.must('structure', bp.def), out = [];
  for (const c of d.cost) {
    const have = bp.delivered.reduce((a, s) => a + (matches(sim.defs, s, c) ? s.qty : 0), 0);
    if (have < c.qty) out.push({ spec: c, qty: c.qty - have });
  }
  return out;
}

export function deliver(sim, e, bp) {
  for (const m of missing(sim, bp)) {
    const got = takeFromInv(e.inv, s => matches(sim.defs, s, m.spec), m.qty);
    bp.delivered.push(...got);
  }
}

export function ready(sim, bp) {
  if (missing(sim, bp).length) return false;
  const w = sim.world;
  if (w.flora[bp.i] && sim.defs.at('flora', w.flora[bp.i]).chop && sim.defs.must('structure', bp.def).type !== 'roof') return false;
  return true;
}

export function complete(sim, bp, builder) {
  const d = sim.defs.must('structure', bp.def), w = sim.world, i = bp.i;
  sim.ents.remove(bp);
  if (d.type !== 'roof' && w.flora[i]) killPlant(sim, i, 'built over');
  if (d.type === 'wall' || d.type === 'door') {
    w.struct[i] = d.index; w.structHp[i] = d.hp;
    const matStack = d.matFromCost ? bp.delivered.find(s => s.mat) : null;
    w.structMat[i] = matStack ? sim.defs.must('material', matStack.mat).index : 0;
    // anyone standing in a new wall steps aside
    if (d.type === 'wall') for (const o of [...sim.ents.at(i)]) {
      if (o.kind === 'item') { const n = w.neighbors(i).find(j => passable(sim, j)); if (n !== undefined) sim.ents.move(o, n); }
      if (o.kind === 'settler' || o.kind === 'animal') { const n = w.neighbors(i).find(j => passable(sim, j)); if (n !== undefined) { sim.ents.move(o, n); o.mv = null; } }
    }
  } else if (d.type === 'roof') {
    w.roof[i] = d.index;
  } else {
    const b = sim.ents.add({ kind: 'building', i, def: d.id, built: true, hp: 100 });
    if (d.fire) {
      b.fuel = d.fire.start; b.keepLit = true;
      b.lit = !!builder && builder.inv.some(s => sim.defs.must('item', s.item).tool?.fire);
      if (b.lit) sim.events.emit('fire_lit', { id: b.id, by: builder.id });
    }
  }
  w.version++;
  sim.roomsDirty = true;
  sim.events.emit('built', { def: d.id, i, by: builder?.id });
}

export const constructionApi = { canPlace, place, missing, deliver, ready, complete };
