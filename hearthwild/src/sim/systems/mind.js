// Mood, thoughts, traits and stress. Hourly the settler's state is turned into ongoing moods; events add
// timed thoughts. Mood below -10 builds stress; at 100 stress the settler has a mental break.
import { clamp, HOUR } from '../core/units.js';
import { STATE_MOODS } from '../../data/mind.js';

export function traitMod(sim, e, key, dflt) {
  if (!e.traits) return dflt;
  let v = dflt;
  for (const t of e.traits) {
    const m = sim.defs.get('trait', t)?.mods?.[key];
    if (m === undefined) continue;
    v = typeof dflt === 'number' && dflt === 1 ? v * m : v + m;
  }
  return v;
}

export function addThought(sim, e, id, extra = {}) {
  if (!e.mind) return;
  const d = sim.defs.must('thought', id);
  const same = e.mind.thoughts.filter(t => t.id === id);
  let mood = d.mood;
  if (d.squeamish && e.traits?.includes('squeamish')) mood = d.squeamish;
  if (same.length >= d.stack) { same[0].until = sim.tick + d.hours * HOUR; return; }
  e.mind.thoughts.push({ id, mood, until: sim.tick + d.hours * HOUR, ...extra });
}

function run(sim, dt) {
  for (const e of sim.ents.of('settler')) {
    if (!e.body.alive) continue;
    const m = e.mind, p = e.phys;
    m.thoughts = m.thoughts.filter(t => t.until > sim.tick);
    const s = { hunger: p.hunger, thirst: p.thirst, sleepiness: p.sleepiness, cold: p.cold, hot: p.hot, wet: p.wet,
      pain: e.body.pain, starving: p.starving, sick: e.body.conds.some(c => c.sev > 0.2) };
    m.states = STATE_MOODS.filter(x => x.test(s)).map(x => ({ id: x.id, text: x.text, mood: x.mood }));
    const base = traitMod(sim, e, 'mood', 0);
    m.mood = clamp(base + m.thoughts.reduce((a, t) => a + t.mood, 0) + m.states.reduce((a, t) => a + t.mood, 0), -100, 100);
    const h = dt / HOUR, mult = traitMod(sim, e, 'stress', 1);
    if (m.mood < -10) m.stress += (-m.mood - 10) * 0.12 * h * mult;
    else m.stress -= (m.mood + 12) * 0.12 * h;
    m.stress = clamp(m.stress, 0, 100);
    if (m.breakdown && sim.tick > m.breakdown.until) { m.breakdown = null; addThought(sim, e, 'catharsis'); sim.events.emit('break_over', { id: e.id }); }
    // A break needs someone awake to have it.
    if (!m.breakdown && m.stress >= 100 && e.body.conscious && !p.asleep) {
      const type = p.hunger > 0.5 ? 'binge' : sim.rng.pick(['wander', 'hide', 'wander', 'sulk']);
      m.breakdown = { type, until: sim.tick + sim.rng.range(3, 8) * HOUR };
      m.stress = 25;
      sim.events.emit('breakdown', { id: e.id, type });
      sim.ai.interrupt(sim, e);
    }
  }
}

export const mindSystem = { name: 'mind', every: 600, offset: 19, run };

// Skills: learning by doing with diminishing returns.
export const skillFactor = (lvl) => 0.6 + lvl * 0.06;
export function skillLevel(e, id) { return e.skills?.[id]?.lvl ?? 0; }
export function learn(sim, e, id, seconds) {
  const s = e.skills?.[id]; if (!s) return;
  s.xp += seconds * traitMod(sim, e, 'learn', 1);
  s.used = sim.tick;
  const lvl = Math.min(20, Math.floor(Math.sqrt(s.xp / 400)));
  if (lvl > s.lvl) { s.lvl = lvl; sim.events.emit('skill_up', { id: e.id, skill: id, lvl }); }
}
