// The game: a simulation plus the gameplay layer (scenario, chronicle, goals, storyteller, saving) and
// the clock that advances it. No DOM here either; the UI drives Game.
import { createSim, serialize, deserialize } from '../sim/sim.js';
import { setupScenario } from './scenario.js';
import { attachChronicle } from './chronicle.js';
import { attachGoals, checkGoals } from './goals.js';
import { storytellerTick } from './storyteller.js';
import { DAY, HOUR } from '../sim/core/units.js';

export const SPEEDS = [0, 15, 60, 240, 900]; // ticks (game seconds) per real second; at 1x a day takes 96 minutes

export class Game {
  constructor(sim) {
    this.sim = sim; this.speed = 1; this.acc = 0; this.budgetMs = 14;
    attachChronicle(sim); attachGoals(sim);
    sim.events.on('died', (d) => { if (d.kind === 'settler') this.onSettlerDied?.(d); });
  }
  static newGame(seed) {
    const sim = createSim({ seed });
    const g = new Game(sim);
    setupScenario(sim);
    return g;
  }
  static load(json) { return new Game(deserialize(json)); }
  save() { return serialize(this.sim); }
  // Advance by real elapsed seconds; bounded by a time budget so the page stays responsive.
  advance(realSec) {
    const tps = SPEEDS[this.speed]; if (!tps) return 0;
    this.acc += realSec * tps;
    const start = performance.now(); let n = 0;
    while (this.acc >= 1) {
      this.stepOnce(); this.acc -= 1; n++;
      if ((n & 63) === 0 && performance.now() - start > this.budgetMs) { this.acc = Math.min(this.acc, tps * 0.25); break; }
    }
    return n;
  }
  stepOnce() {
    const s = this.sim;
    s.step();
    if (s.tick % 600 === 0) { checkGoals(s); storytellerTick(s); }
  }
  get alive() { return [...this.sim.ents.of('settler')].filter(e => e.body.alive); }
}
