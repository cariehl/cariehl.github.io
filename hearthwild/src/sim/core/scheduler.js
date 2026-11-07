// Runs systems at their own intervals. A system is { name, every (ticks), offset, run(sim, dtSeconds) }.
// Offsets spread expensive systems across ticks so one frame never runs all of them at once.
import { TICK } from './units.js';
export class Scheduler {
  constructor() { this.systems = []; this.timing = {}; }
  add(sys) { this.systems.push({ offset: 0, every: 1, ...sys }); return this; }
  step(sim) {
    const t = sim.tick;
    for (const s of this.systems) {
      if ((t + s.offset) % s.every !== 0) continue;
      s.run(sim, s.every * TICK);
    }
  }
}
