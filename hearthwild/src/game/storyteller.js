// Incidents: occasional events chosen by weight, spaced out in time. The storyteller only uses the
// simulation's public API.
import { makeSettler, wear, giveItem } from '../sim/factory.js';
import { spawnGroup } from '../sim/systems/animals.js';
import { passable } from '../sim/world/path.js';
import { DAY, HOUR } from '../sim/core/units.js';
import { addThought } from '../sim/systems/mind.js';

const alive = (s) => [...s.ents.of('settler')].filter(e => e.body.alive);

export const INCIDENTS = [
  { id: 'wanderer', weight: (s) => alive(s).length < 8 ? 1 + (s.gameState.goals?.shelter ? 1 : 0) : 0, run(s) {
    const at = edgeNear(s); if (at < 0) return null;
    const e = makeSettler(s, { i: at }); wear(s, e, 'wool_shirt'); wear(s, e, 'wool_trousers'); wear(s, e, 'leather_boots');
    if (s.rng.chance(0.5)) giveItem(s, e, 'steel_knife'); giveItem(s, e, 'wool_blanket');
    e.phys.fat *= 0.8; e.phys.glycogen = 600; e.phys.waterDef = 1.2;
    s.ents.add(e);
    for (const o of alive(s)) if (o !== e) addThought(s, o, 'new_arrival');
    s.events.emit('joined', { id: e.id, name: e.name });
    return null;
  } },
  { id: 'wolves', weight: (s) => s.t.season === 3 || s.t.season === 2 ? 1 : 0.3, run(s) {
    const d = s.defs.must('fauna', 'wolf'); const at = edgeNear(s); if (at < 0) return null;
    spawnGroup(s, d, at); return 'Wolves were heard howling at the edge of the valley.';
  } },
  { id: 'cold_snap', weight: (s) => s.t.season === 3 ? 1.5 : s.t.season === 2 || s.t.season === 0 ? 0.6 : 0, run(s) {
    const h = 24 + s.rng.int(48); s.weather.override = { deltaC: -(6 + s.rng.int(6)), hours: h };
    return 'A cold snap settled over the valley.';
  } },
  { id: 'heat_wave', weight: (s) => s.t.season === 1 ? 0.8 : 0, run(s) {
    s.weather.override = { deltaC: 6 + s.rng.int(5), hours: 48 + s.rng.int(48) }; return 'A heat wave began. The ground is drying out.';
  } },
  { id: 'storm', weight: () => 0.8, run(s) { s.weather.storm = 4 + s.rng.int(6); s.weather.cloudy = true; return 'A storm rolled in from the hills.'; } },
  { id: 'deer_herd', weight: () => 0.7, run(s) { const at = edgeNear(s); if (at >= 0) spawnGroup(s, s.defs.must('fauna', 'deer'), at); return 'A herd of red deer moved into the valley.'; } },
];

function edgeNear(s) {
  const w = s.world, home = s.homeCenter;
  for (let tries = 0; tries < 60; tries++) {
    const i = s.rng.int(w.N);
    const d = home >= 0 ? w.dist(i, home) : 40;
    if (d < 30 || d > 70 || !passable(s, i) || w.water[i] > 0.05) continue;
    return i;
  }
  return -1;
}

export function storytellerTick(sim) {
  const gs = sim.gameState;
  gs.nextIncident = gs.nextIncident ?? sim.tick + 3 * DAY;
  if (sim.tick < gs.nextIncident) return;
  gs.nextIncident = sim.tick + (2 + sim.rng.next() * 4) * DAY;
  const pick = sim.rng.weighted(INCIDENTS, i => i.weight(sim));
  if (!pick || pick.weight(sim) <= 0) return;
  const text = pick.run(sim);
  if (text) sim.events.emit('incident', { id: pick.id, text });
}
