// The chronicle: a readable history built from simulation events. Kept in sim.gameState so it saves.
import { fmtTime } from '../sim/systems/time.js';

const nameOf = (sim, id) => { const e = sim.ents.get(id); return e?.name?.split(' ')[0] || (e?.species && sim.defs.get('fauna', e.species)?.name) || 'someone'; };

const TEXT = {
  arrived: (s, d) => `${d.names.join(', ')} reached the valley with a handcart and what they could carry.`,
  died: (s, d) => d.kind === 'settler' ? `${d.name} died of ${d.cause}.` : null,
  built: (s, d) => ({ campfire: 'A campfire was built.', hearth: 'A stone hearth was built.', lean_to: 'A lean-to went up.', workbench: 'A workbench was built.', drying_rack: 'A drying rack was built.', straw_bed: 'A straw pallet was laid.', frame_bed: 'A frame bed was built.' }[d.def] || null),
  contracted: (s, d) => `${nameOf(s, d.id)} came down with ${s.defs.must('condition', d.cond).name}${d.source ? ` (${d.source})` : ''}.`,
  recovered: (s, d) => `${nameOf(s, d.id)} recovered from ${s.defs.must('condition', d.cond).name}.`,
  breakdown: (s, d) => `${nameOf(s, d.id)} could not take any more and ${({ wander: 'wandered off', hide: 'hid away', binge: 'started binge eating', sulk: 'sat sulking' })[d.type]}.`,
  infection: (s, d) => `A wound on ${nameOf(s, d.id)}'s ${d.part.replace(/^l|^r/, m => m === 'l' ? 'left ' : 'right ').toLowerCase()} became infected.`,
  wildfire: (s, d) => s.gameState._fireNoted && s.tick - s.gameState._fireNoted < 3600 ? null : (s.gameState._fireNoted = s.tick, 'Fire broke out in the undergrowth.'),
  harvested: (s, d) => null,
  crop_died: (s, d) => s.gameState._cropNoted === s.t.day ? null : (s.gameState._cropNoted = s.t.day, `${d.cause === 'frost' ? 'Frost' : 'Drought'} killed some of the ${s.defs.must('flora', d.flora).name}.`),
  skill_up: (s, d) => d.lvl % 5 === 0 ? `${nameOf(s, d.id)} became ${d.lvl >= 15 ? 'a master' : d.lvl >= 10 ? 'an expert' : 'skilled'} at ${s.defs.must('skill', d.skill).name.toLowerCase()}.` : null,
  incident: (s, d) => d.text,
  goal: (s, d) => `Milestone: ${d.text}`,
  joined: (s, d) => `${d.name} walked into camp and asked to stay.`,
};

export function attachChronicle(sim) {
  const gs = sim.gameState;
  gs.chronicle = gs.chronicle || [];
  sim.events.on('*', (d, type) => {
    const f = TEXT[type]; if (!f) return;
    const text = f(sim, d); if (!text) return;
    gs.chronicle.push({ tick: sim.tick, when: `Y${sim.t.year} ${sim.t.seasonName} ${sim.t.dayOfSeason}, ${fmtTime(sim.t)}`, text, type });
    if (gs.chronicle.length > 400) gs.chronicle.shift();
  });
}
