// Rooms: connected regions of roofed, walkable hexes fully bounded by walls and doors. Each room keeps its
// own air temperature, integrated from the outdoor temperature, its envelope conductance and heat sources.
const FACE_M2 = 1.732 * 2.4;  // one hex edge (3 m / sqrt 3) by wall height
const HEX_M2 = 7.79;          // area of a hex with 3 m between centres
const HEAT_CAP_PER_HEX = 90e3; // J/K: air plus the furnishings and floor that exchange heat within an hour

export function rebuildRooms(sim) {
  const w = sim.world, defs = sim.defs, N = w.N;
  const old = sim.rooms; sim.rooms = new Map();
  w.room.fill(0);
  const isWall = (i) => w.struct[i] && defs.at('structure', w.struct[i]).type !== undefined && ['wall', 'door'].includes(defs.at('structure', w.struct[i]).type);
  let nextId = 1;
  const seen = new Uint8Array(N);
  for (let s = 0; s < N; s++) {
    if (seen[s] || !w.roof[s] || isWall(s)) continue;
    const tiles = [], q = [s]; seen[s] = 1; let leaky = false, UA = 0;
    while (q.length) {
      const c = q.pop(); tiles.push(c);
      UA += HEX_M2 * defs.at('structure', w.roof[c]).roofU;
      for (let d = 0; d < 6; d++) {
        const n = w.nb[c * 6 + d];
        if (n < 0) { leaky = true; continue; }
        if (isWall(n)) {
          const sd = defs.at('structure', w.struct[n]);
          const mat = w.structMat[n] ? defs.at('material', w.structMat[n]) : null;
          UA += FACE_M2 * (mat?.wallU && sd.matFromCost ? (mat.wallU + sd.wallU) / 2 : sd.wallU);
          continue;
        }
        if (!w.roof[n]) { leaky = true; continue; }
        if (!seen[n]) { seen[n] = 1; q.push(n); }
      }
      if (tiles.length > 400) { leaky = true; break; }
    }
    if (leaky) continue;
    const id = nextId++;
    // Infiltration: half an air change per hour through gaps (0.33 W/K per m3 per ACH).
    UA += tiles.length * HEX_M2 * 2.4 * 0.33 * 0.5;
    const prev = old && [...old.values()].find(r => r.tiles.includes(tiles[0]));
    const room = { id, tiles, UA, C: tiles.length * HEAT_CAP_PER_HEX, temp: prev ? prev.temp : null, heatW: 0 };
    sim.rooms.set(id, room);
    for (const t of tiles) w.room[t] = id;
  }
}
