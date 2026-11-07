// Things settlers build. type: wall and door occupy the hex structure layer; roof is a separate layer;
// building is an entity standing on the hex. cost items or tags; work in seconds.
// wallU is heat conductance W/(m2 K); a wall hex face is about 3 m x 2.4 m.
export const STRUCTURES = [
  { id: 'log_wall', name: 'Log wall', type: 'wall', cost: [{ item: 'log', qty: 2 }], work: 3600, skill: 'construction',
    wallU: 0.7, height: 2.4, hp: 400, flam: 0.25, matFromCost: true, color: '#8b6b45' },
  { id: 'wattle_wall', name: 'Wattle and daub wall', type: 'wall', cost: [{ item: 'stick', qty: 8 }, { item: 'clay_lump', qty: 2 }], work: 3000, skill: 'construction',
    wallU: 1.6, height: 2.2, hp: 200, flam: 0.15, color: '#a0835e' },
  { id: 'stone_wall', name: 'Dry stone wall', type: 'wall', cost: [{ item: 'stone', qty: 5 }], work: 5400, skill: 'construction',
    wallU: 1.8, height: 2.4, hp: 900, flam: 0, matFromCost: true, color: '#8d8a87' },
  { id: 'door', name: 'Plank door', type: 'door', cost: [{ item: 'log', qty: 1 }, { item: 'cordage', qty: 2 }], work: 2400, skill: 'construction',
    wallU: 2.5, height: 2.1, hp: 150, flam: 0.3, needs: { cut: 0.5 }, color: '#6f4f33' },
  { id: 'thatch_roof', name: 'Thatch roof', type: 'roof', cost: [{ tag: 'fibre', qty: 12 }, { item: 'stick', qty: 4 }], work: 1800, skill: 'construction',
    roofU: 0.9, rain: 1, hp: 80, flam: 0.7, color: '#b39b5c' },
  { id: 'campfire', name: 'Campfire', type: 'building', cost: [{ item: 'stick', qty: 5 }], work: 600, skill: 'construction',
    needs: { fire: 0.3 }, fire: { maxKg: 18, burnKgH: 2.2, heatKW: 12, light: 5, start: 6 }, station: 'campfire', passable: true, color: '#7a6e64' },
  { id: 'workbench', name: 'Workbench', type: 'building', cost: [{ item: 'log', qty: 2 }], work: 2400, skill: 'construction', needs: { cut: 0.5 },
    station: 'workbench', color: '#8b6b45' },
  { id: 'drying_rack', name: 'Drying rack', type: 'building', cost: [{ item: 'stick', qty: 8 }, { item: 'cordage', qty: 2 }], work: 1200, skill: 'construction',
    station: 'drying_rack', passable: true, color: '#a58a5c' },
  { id: 'hearth', name: 'Stone hearth', type: 'building', cost: [{ item: 'stone', qty: 6 }], work: 3600, skill: 'construction',
    needs: { fire: 0.3 }, fire: { maxKg: 30, burnKgH: 2.6, heatKW: 16, light: 5, start: 4 }, station: 'campfire', passable: false, safe: true, color: '#8d8a87' },
  { id: 'straw_bed', name: 'Straw pallet', type: 'building', cost: [{ tag: 'fibre', qty: 10 }], work: 600, skill: 'construction',
    bed: { quality: 0.82, clo: 0.6 }, passable: true, color: '#b9a35e' },
  { id: 'frame_bed', name: 'Frame bed', type: 'building', cost: [{ item: 'log', qty: 1 }, { item: 'stick', qty: 4 }, { tag: 'fibre', qty: 10 }, { item: 'cordage', qty: 2 }], work: 2400, skill: 'construction', needs: { cut: 0.5 },
    bed: { quality: 1.0, clo: 0.9 }, passable: true, color: '#7d5c3c' },
  { id: 'lean_to', name: 'Lean-to', type: 'building', cost: [{ item: 'stick', qty: 10 }, { tag: 'fibre', qty: 12 }], work: 2400, skill: 'construction',
    shelter: { rain: 0.9, wind: 0.65, clo: 0.35 }, passable: true, color: '#8f7a4c' },
];

// Zones are areas painted by the player.
export const ZONES = [
  { id: 'stockpile', name: 'Stockpile', color: 'rgba(230,200,120,0.22)' },
  { id: 'farm', name: 'Farm plot', color: 'rgba(140,200,90,0.22)' },
];
