// Player commands. Every one validates its arguments like a server would, and returns a string on
// refusal. The UI and the gameplay layer only change the simulation through these.
import { DESIG } from './world/world.js';
import { passable, blocked } from './world/path.js';
import { spawnItem } from './factory.js';

const isInt = (v) => Number.isInteger(v);
function tilesArg(sim, tiles) {
  if (!Array.isArray(tiles)) throw new Error('tiles must be an array');
  if (tiles.length > 5000) throw new Error('too many tiles');
  return [...new Set(tiles.filter(i => isInt(i) && i >= 0 && i < sim.world.N))];
}
function entArg(sim, id, kind) {
  const e = sim.ents.get(id);
  if (!e || (kind && e.kind !== kind)) throw new Error(`no ${kind || 'entity'} ${id}`);
  return e;
}

export const COMMANDS = {
  designate(sim, { kind, tiles }) {
    const w = sim.world, defs = sim.defs; tiles = tilesArg(sim, tiles);
    if (kind !== 'cancel' && !(kind in DESIG)) return `Unknown designation ${kind}`;
    let n = 0;
    for (const i of tiles) {
      if (kind === 'cancel') { if (w.desig[i]) { w.desig[i] = 0; sim.desigSet.delete(i); n++; } continue; }
      const f = w.flora[i] ? defs.at('flora', w.flora[i]) : null;
      const t = defs.at('terrain', w.terrain[i]);
      const ok = kind === 'chop' ? !!f?.chop : kind === 'gather' ? !!f?.yield && f.yield.verb !== 'harvest' && w.yield[i] >= 1 : kind === 'mine' ? t.tags.includes('mineable')
        : kind === 'clear' ? !!f && !f.crop : kind === 'fish' ? w.water[i] > 0.5 : false;
      if (!ok) continue;
      w.desig[i] |= DESIG[kind]; sim.desigSet.add(i); n++;
    }
    return { count: n };
  },
  build(sim, { def, tiles }) {
    if (!sim.defs.get('structure', def)) return `Unknown structure ${def}`;
    tiles = tilesArg(sim, tiles);
    let n = 0, err = null;
    for (const i of tiles) { const r = sim.construction.place(sim, def, i); if (typeof r === 'string') err = r; else n++; }
    if (!n && err) return err;
    return { count: n };
  },
  cancelBuild(sim, { tiles }) {
    tiles = tilesArg(sim, tiles); let n = 0;
    for (const i of tiles) for (const e of [...sim.ents.at(i)]) if (e.kind === 'blueprint') {
      for (const s of e.delivered) spawnItem(sim, i, s);
      sim.ents.remove(e); n++;
    }
    return { count: n };
  },
  deconstruct(sim, { tiles }) {
    tiles = tilesArg(sim, tiles); let n = 0; const w = sim.world;
    for (const i of tiles) {
      for (const e of [...sim.ents.at(i)]) if (e.kind === 'building') { sim.ents.remove(e); n++; }
      if (w.struct[i] || w.roof[i]) { w.struct[i] = 0; w.roof[i] = 0; n++; }
    }
    if (n) { w.version++; sim.roomsDirty = true; }
    return { count: n };
  },
  zone(sim, { type, tiles, crop }) {
    const zd = sim.defs.get('zone', type); if (!zd) return `Unknown zone ${type}`;
    tiles = tilesArg(sim, tiles).filter(i => !sim.world.zone[i] && passable(sim, i) && sim.world.water[i] < 0.05);
    if (type === 'farm') tiles = tiles.filter(i => sim.defs.at('terrain', sim.world.terrain[i]).fertility > 0.1);
    if (!tiles.length) return 'Nowhere suitable';
    if (crop && !sim.defs.get('flora', crop)?.crop) return `Unknown crop ${crop}`;
    // merge with a touching zone of the same type
    let zone = null;
    for (const i of tiles) for (const n of sim.world.neighbors(i)) { const z = sim.zones.get(sim.world.zone[n]); if (z && z.type === type) zone = z; }
    if (!zone) {
      zone = { id: sim.nextZone++, type, tiles: new Set(), name: `${zd.name} ${sim.nextZone - 1}` };
      if (type === 'stockpile') zone.allow = ['food', 'materials', 'tools', 'clothing', 'medical', 'seeds'];
      if (type === 'farm') zone.crop = crop || 'barley';
      sim.zones.set(zone.id, zone);
    }
    for (const i of tiles) { zone.tiles.add(i); sim.world.zone[i] = zone.id; }
    return { id: zone.id, count: tiles.length };
  },
  unzone(sim, { tiles }) {
    tiles = tilesArg(sim, tiles); let n = 0;
    for (const i of tiles) {
      const z = sim.zones.get(sim.world.zone[i]); if (!z) continue;
      z.tiles.delete(i); sim.world.zone[i] = 0; n++;
      if (!z.tiles.size) sim.zones.delete(z.id);
    }
    return { count: n };
  },
  zoneSet(sim, { id, crop, allow }) {
    const z = sim.zones.get(id); if (!z) return 'No such zone';
    if (crop !== undefined) { if (z.type !== 'farm' || !sim.defs.get('flora', crop)?.crop) return 'Bad crop'; z.crop = crop; }
    if (allow !== undefined) { if (z.type !== 'stockpile' || !Array.isArray(allow)) return 'Bad filter'; z.allow = allow.filter(c => typeof c === 'string').slice(0, 10); }
    return {};
  },
  bill(sim, { recipe, mode = 'count', n = 1 }) {
    if (!sim.defs.get('recipe', recipe)) return `Unknown recipe ${recipe}`;
    if (!['count', 'until', 'forever'].includes(mode)) return 'Bad mode';
    if (!isInt(n) || n < 1 || n > 999) return 'Bad amount';
    const b = { id: sim.nextBill++, recipe, mode, n, done: 0, paused: false };
    sim.bills.push(b);
    return { id: b.id };
  },
  billSet(sim, { id, paused, n, mode, remove }) {
    const k = sim.bills.findIndex(b => b.id === id); if (k < 0) return 'No such bill';
    if (remove) { sim.bills.splice(k, 1); return {}; }
    const b = sim.bills[k];
    if (paused !== undefined) b.paused = !!paused;
    if (n !== undefined) { if (!isInt(n) || n < 1 || n > 999) return 'Bad amount'; b.n = n; }
    if (mode !== undefined) { if (!['count', 'until', 'forever'].includes(mode)) return 'Bad mode'; b.mode = mode; }
    return {};
  },
  prio(sim, { id, labor, value }) {
    const e = entArg(sim, id, 'settler');
    if (!sim.defs.get('labor', labor)) return 'Unknown labor';
    if (!isInt(value) || value < 0 || value > 4) return 'Priority is 0 to 4';
    e.agent.prio[labor] = value; return {};
  },
  order(sim, { id, i, run = false }) {
    const e = entArg(sim, id, 'settler');
    if (!isInt(i) || i < 0 || i >= sim.world.N || blocked(sim, i)) return 'Cannot go there';
    e.agent.order = { kind: 'move', i, run: !!run };
    sim.ai.interrupt(sim, e);
    return {};
  },
  orderClear(sim, { id }) { const e = entArg(sim, id, 'settler'); e.agent.order = null; return {}; },
  hunt(sim, { id, on = true }) { const a = entArg(sim, id, 'animal'); a.hunt = !!on; return {}; },
  forbid(sim, { id, on = true }) { const it = entArg(sim, id, 'item'); it.forbidden = !!on; return {}; },
  keepLit(sim, { id, on = true }) { const b = entArg(sim, id, 'building'); if (b.fuel === undefined) return 'Not a fire'; b.keepLit = !!on; return {}; },
  wear(sim, { id, item }) {
    const e = entArg(sim, id, 'settler');
    const k = e.inv.findIndex(s => s.item === item); if (k < 0) return 'Not carried';
    const d = sim.defs.must('item', item); if (!d.wear) return 'Not wearable';
    const s = e.inv.splice(k, 1)[0];
    if (s.qty > 1) { e.inv.push({ ...s, qty: s.qty - 1 }); s.qty = 1; }
    const old = e.equip[d.wear.slot]; if (old) e.inv.push(old);
    e.equip[d.wear.slot] = s; return {};
  },
};
