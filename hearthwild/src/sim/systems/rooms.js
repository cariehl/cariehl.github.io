// Room air temperature: each enclosed room approaches Tout + Q / UA with time constant C / UA, where Q is
// heat from fires and bodies inside, UA the envelope conductance and C the room's heat capacity.
import { rebuildRooms } from '../world/rooms.js';
import { outdoorTemp } from './environment.js';

function run(sim, dt) {
  if (sim.roomsDirty) { rebuildRooms(sim); sim.roomsDirty = false; }
  if (!sim.rooms.size) return;
  const heat = new Map();
  for (const b of sim.ents.of('building')) if (b.lit && sim.world.room[b.i]) {
    const d = sim.defs.must('structure', b.def), r = sim.world.room[b.i];
    heat.set(r, (heat.get(r) || 0) + d.fire.heatKW * 1000 * 0.6);
  }
  for (const s of sim.ents.of('settler')) if (s.body.alive && sim.world.room[s.i]) heat.set(sim.world.room[s.i], (heat.get(sim.world.room[s.i]) || 0) + (s.phys.heatW || 100));
  for (const room of sim.rooms.values()) {
    const Tout = outdoorTemp(sim, room.tiles[0]);
    if (room.temp === null) room.temp = Tout;
    room.heatW = heat.get(room.id) || 0;
    const Teq = Tout + room.heatW / room.UA;
    room.temp += (Teq - room.temp) * (1 - Math.exp(-dt * room.UA / room.C));
    room.eq = Teq;
  }
}
export const roomsSystem = { name: 'rooms', every: 60, offset: 31, run };
