// Fog of war: settlers reveal hexes within a sight radius that shrinks in the dark.
import { lightAt } from './environment.js';
import { traitMod } from './mind.js';
function run(sim) {
  const w = sim.world;
  for (const e of sim.ents.of('settler')) {
    if (!e.body.alive || e.i < 0) continue;
    const light = lightAt(sim, e.i);
    const r = Math.round((6 + 12 * light) * Math.max(0.3, e.body.caps.sight) * traitMod(sim, e, 'sight', 1));
    for (const i of w.within(e.i, r)) w.seen[i] = 1;
  }
}
export const visionSystem = { name: 'vision', every: 5, offset: 2, run };
