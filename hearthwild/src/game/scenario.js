// The starting scenario: a site, a party of three and what they carried in. Pure gameplay layer: it uses
// only the simulation's public API (factory functions and commands).
import { makeSettler, wear, giveItem, spawnItem } from '../sim/factory.js';
import { makeStack } from '../sim/stacks.js';
import { passable } from '../sim/world/path.js';
import { bfsDistance } from '../sim/world/worldgen.js';
import { spawnGroup } from '../sim/systems/animals.js';

export const PARTY = [
  { role: 'Woodsman', skills: { woodcutting: 7, construction: 5, hunting: 3, melee: 3 }, backstory: 'Felled timber for a sawmill until the mill burned.', prio: { chop: 1, build: 1 } },
  { role: 'Herbalist', skills: { foraging: 7, medicine: 6, cooking: 4, farming: 3 }, backstory: 'Kept a physic garden and knows which mushrooms not to eat.', prio: { doctor: 1, forage: 1, cook: 1 } },
  { role: 'Trapper', skills: { hunting: 7, butchery: 6, crafting: 5, fishing: 4, melee: 4 }, backstory: 'Spent winters running trap lines in the high country.', prio: { hunt: 1, craft: 1 } },
];

export function chooseSite(sim) {
  const w = sim.world;
  const dWater = bfsDistance(w, i => w.water[i] > 0.3, 14);
  let best = -1, bs = -Infinity;
  for (let i = 0; i < w.N; i++) {
    const c = w.col(i), r = w.row(i);
    if (c < 30 || r < 30 || c > w.W - 30 || r > w.H - 30) continue;
    if (!passable(sim, i) || w.water[i] > 0.05 || dWater[i] < 3 || dWater[i] > 9) continue;
    if ((i * 7919) % 5) continue; // sample a fifth of hexes for speed
    let flat = 0, trees = 0, food = 0, rock = 0;
    for (const j of w.within(i, 4)) { flat += Math.abs(w.elev[j] - w.elev[i]) < 1.5 ? 1 : 0; if (w.water[j] > 0.05) flat -= 1; }
    for (const j of w.within(i, 10)) {
      const f = w.flora[j] ? sim.defs.at('flora', w.flora[j]) : null;
      if (f?.chop) trees++;
      if (f?.yield && sim.defs.must('item', f.yield.item).cat === 'food') food++;
      if (sim.defs.at('terrain', w.terrain[j]).tags.includes('mineable')) rock++;
    }
    const s = flat * 1.2 + Math.min(trees, 60) * 0.5 + Math.min(food, 15) * 1 + Math.min(rock, 8) * 1.5 - Math.abs(dWater[i] - 5) * 2;
    if (s > bs) { bs = s; best = i; }
  }
  return best;
}

export function setupScenario(sim, opts = {}) {
  const w = sim.world, site = opts.site ?? chooseSite(sim);
  sim.homeCenter = site;
  const spots = w.within(site, 2).filter(i => passable(sim, i));
  const settlers = [];
  PARTY.forEach((p, k) => {
    const e = makeSettler(sim, { i: spots[k % spots.length], skills: p.skills, backstory: p.backstory });
    e.role = p.role;
    for (const [l, v] of Object.entries(p.prio)) e.agent.prio[l] = v;
    wear(sim, e, 'wool_shirt'); wear(sim, e, 'wool_trousers'); wear(sim, e, 'leather_boots'); wear(sim, e, 'wool_coat');
    if (k === 0) wear(sim, e, 'wool_cap');
    giveItem(sim, e, 'wool_blanket', 1);
    sim.ents.add(e); settlers.push(e);
  });
  giveItem(sim, settlers[0], 'steel_hatchet');
  giveItem(sim, settlers[1], 'steel_knife'); giveItem(sim, settlers[1], 'linen_bandage', 6);
  giveItem(sim, settlers[2], 'fire_steel'); giveItem(sim, settlers[2], 'spear');
  // the cart's load, set down at camp
  const drop = (item, qty, extra) => spawnItem(sim, sim.rng.pick(spots), makeStack(sim.defs, item, qty, extra));
  drop('hardtack', 60); drop('dried_beans', 40); drop('iron_pot', 1); drop('spade', 1); drop('steel_knife', 1);
  drop('barley_seed', 30); drop('turnip_seed', 20); drop('bean_seed', 16); drop('flax_seed', 12);
  drop('linen_cloth', 4); drop('cordage', 8); drop('mittens', 2); drop('fishing_line', 1);
  // a stockpile and a campfire plan to start from
  const pile = w.within(w.neighbors(site).find(i => passable(sim, i)) ?? site, 1).filter(i => passable(sim, i));
  sim.command('zone', { type: 'stockpile', tiles: pile });
  const fireAt = w.within(site, 3).find(i => passable(sim, i) && !w.zone[i] && !w.flora[i] && w.dist(i, site) >= 2);
  if (fireAt !== undefined) sim.command('build', { def: 'campfire', tiles: [fireAt] });
  // wildlife
  for (const d of sim.defs.all('fauna')) {
    const n = Math.max(d.id === 'bear' ? 0 : 1, Math.round(sim.landHexes / d.perHexes * 0.7));
    for (let k = 0; k < n; k++) {
      for (let tries = 0; tries < 30; tries++) {
        const i = sim.rng.int(w.N);
        if (!passable(sim, i) || w.water[i] > 0.05 || w.dist(i, site) < (d.diet === 'predator' ? 50 : 18)) continue;
        spawnGroup(sim, d, i); break;
      }
    }
  }
  sim.gameState.started = sim.tick;
  sim.events.emit('arrived', { site, names: settlers.map(s => s.name) });
  return settlers;
}
