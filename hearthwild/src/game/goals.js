// Milestones: a light gameplay spine on top of the open-ended simulation.
import { colonyFoodKcal } from '../sim/systems/items.js';
const alive = (s) => [...s.ents.of('settler')].filter(e => e.body.alive);
export const GOALS = [
  { id: 'fire', text: 'Light a fire', hint: 'Your first campfire is planned at camp. It needs branches.', test: s => [...s.ents.of('building')].some(b => b.lit) },
  { id: 'stockpile', text: 'Store the supplies', hint: 'Settlers haul loose items to stockpile zones.', test: s => [...s.ents.of('item')].filter(i => s.world.zone[i.i]).length >= 8 },
  { id: 'shelter', text: 'Sleep under shelter', hint: 'Build lean-tos, or walls with a thatch roof.', test: s => alive(s).some(e => e.phys.asleep && (s.world.roof[e.i] || [...s.ents.at(e.i)].some(b => b.kind === 'building' && s.defs.must('structure', b.def).shelter))) },
  { id: 'beds', text: 'A bed for everyone', hint: 'Straw pallets need plant fibre: gather grass or reeds.', test: s => [...s.ents.of('building')].filter(b => s.defs.must('structure', b.def).bed).length >= alive(s).length },
  { id: 'cook', text: 'Cook a meal', hint: 'Add a cooking bill at the campfire (Craft tab).', test: s => [...s.ents.of('item')].some(i => (s.defs.must('item', i.stack.item).tags || []).includes('cooked')) },
  { id: 'hunt', text: 'Bring down game', hint: 'Select an animal and mark it for hunting.', test: s => s.gameState.kills > 0 },
  { id: 'room', text: 'Build an enclosed room', hint: 'Walls on every side, a door, and a roof over every hex inside.', test: s => s.rooms.size > 0 },
  { id: 'sow', text: 'Sow a field', hint: 'Paint a farm zone and pick a crop; it is sown in spring.', test: s => { for (let i = 0; i < s.world.N; i++) if (s.world.flora[i] && s.defs.at('flora', s.world.flora[i]).crop) return true; return false; } },
  { id: 'harvest', text: 'Bring in a harvest', hint: 'Crops ripen with warmth; frost kills them.', test: s => s.gameState.harvests > 0 },
  { id: 'larder', text: 'Lay in a winter larder', hint: 'Enough food for 30 days for everyone. Jerky and grain keep.', test: s => colonyFoodKcal(s) > alive(s).length * 2400 * 30 },
  { id: 'winter', text: 'Survive the first winter', hint: 'Warmth, food and firewood.', test: s => s.t.year >= 2 && alive(s).length > 0 },
];

export function attachGoals(sim) {
  const gs = sim.gameState;
  gs.goals = gs.goals || {};
  gs.kills = gs.kills || 0; gs.harvests = gs.harvests || 0;
  sim.events.on('died', (d) => { if (d.kind === 'animal') { const c = [...sim.ents.at(d.i)].find(x => x.kind === 'corpse' && x.colony); if (c) gs.kills++; } });
  sim.events.on('harvested', () => { gs.harvests++; });
}

export function checkGoals(sim) {
  const gs = sim.gameState;
  for (const g of GOALS) if (!gs.goals[g.id] && g.test(sim)) { gs.goals[g.id] = sim.tick; sim.events.emit('goal', { id: g.id, text: g.text }); }
}
