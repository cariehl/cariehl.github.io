// Materials. Wood and stone come in species; items like logs and stones carry one of these as `mat`.
// density kg/m3, fuelMJ per kg (air dry), wallU W/(m2 K) when built into a wall.
export const MATERIALS = [
  { id: 'oak', name: 'oak', tags: ['wood'], density: 750, fuelMJ: 15.5, wallU: 0.65, color: '#8b6b45' },
  { id: 'pine', name: 'pine', tags: ['wood'], density: 520, fuelMJ: 16.5, wallU: 0.55, color: '#b48a5a' },
  { id: 'birch', name: 'birch', tags: ['wood'], density: 640, fuelMJ: 16.0, wallU: 0.6, color: '#d8cfb8' },
  { id: 'spruce', name: 'spruce', tags: ['wood'], density: 450, fuelMJ: 16.2, wallU: 0.5, color: '#a98457' },
  { id: 'willow', name: 'willow', tags: ['wood'], density: 420, fuelMJ: 14.5, wallU: 0.6, color: '#bfa77a' },
  { id: 'granite', name: 'granite', tags: ['stone'], density: 2700, wallU: 2.3, color: '#8d8a87' },
  { id: 'limestone', name: 'limestone', tags: ['stone'], density: 2500, wallU: 2.0, color: '#bdb59f' },
  { id: 'sandstone', name: 'sandstone', tags: ['stone'], density: 2300, wallU: 1.8, color: '#b88a62' },
  { id: 'slate', name: 'slate', tags: ['stone'], density: 2800, wallU: 2.2, color: '#5d6168' },
  { id: 'flint', name: 'flint', tags: ['stone', 'knappable'], density: 2600, color: '#3c3b3f' },
  { id: 'clay', name: 'clay', tags: ['earth'], density: 1800, wallU: 1.4, color: '#a0674a' },
  { id: 'hide', name: 'hide', tags: ['animal'], color: '#8c6a4f' },
  { id: 'fur', name: 'fur', tags: ['animal'], color: '#6e5b48' },
  { id: 'wool', name: 'wool', tags: ['cloth'], color: '#9b8f7d' },
  { id: 'linen', name: 'linen', tags: ['cloth'], color: '#cfc6b0' },
  { id: 'steel', name: 'steel', tags: ['metal'], color: '#a7adb4' },
  { id: 'iron', name: 'iron', tags: ['metal'], color: '#6f6a66' },
  { id: 'plant', name: 'plant fibre', tags: ['fibre'], color: '#a8a058' },
  { id: 'bone', name: 'bone', tags: ['animal'], color: '#e4dcc8' },
];
