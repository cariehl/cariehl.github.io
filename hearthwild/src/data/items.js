// Items. kg is the mass of one unit. Food nutrition is per 100 g: kcal, protein, fat, carbohydrate, water
// (grams). digest is the fraction of energy absorbed (raw grain and beans are poorly digested). shelf is
// days to spoil at 20 C (spoilage doubles every 10 C warmer, and stops below freezing). risk names an
// illness and its chance per 100 g eaten.
const N = (kcal, p, f, c, w) => ({ kcal, p, f, c, w });
export const ITEMS = [
  // --- materials
  { id: 'log', name: 'log', kg: 22, cat: 'materials', tags: ['wood', 'fuel', 'heavy'], hasMat: true },
  { id: 'stick', name: 'branch', plural: 'branches', kg: 0.6, cat: 'materials', tags: ['wood', 'fuel', 'kindling'], fuelMJ: 15 },
  { id: 'stone', name: 'stone', kg: 6, cat: 'materials', tags: ['stone', 'heavy'], hasMat: true },
  { id: 'flint', name: 'flint nodule', kg: 0.4, cat: 'materials', tags: ['knappable'] },
  { id: 'clay_lump', name: 'clay', kg: 3, cat: 'materials', tags: ['clay'] },
  { id: 'fibre', name: 'plant fibre', plural: 'plant fibre', kg: 0.15, cat: 'materials', tags: ['fibre', 'kindling'], fuelMJ: 14 },
  { id: 'linen_fibre', name: 'flax fibre', plural: 'flax fibre', kg: 0.1, cat: 'materials', tags: ['fibre', 'fine_fibre'] },
  { id: 'cordage', name: 'cordage', plural: 'cordage', kg: 0.05, cat: 'materials', tags: ['cordage'] },
  { id: 'hide', name: 'raw hide', kg: 4, cat: 'materials', tags: ['hide'], shelf: 3, hasMat: true },
  { id: 'pelt', name: 'raw pelt', kg: 0.5, cat: 'materials', tags: ['hide', 'small_hide'], shelf: 3, hasMat: true },
  { id: 'leather', name: 'cured hide', kg: 3, cat: 'materials', tags: ['leather'], hasMat: true },
  { id: 'bone', name: 'bone', kg: 0.5, cat: 'materials', tags: ['bone'] },
  { id: 'linen_cloth', name: 'linen cloth', plural: 'linen cloth', kg: 0.2, cat: 'materials', tags: ['cloth'] },
  { id: 'charcoal', name: 'charcoal', plural: 'charcoal', kg: 0.5, cat: 'materials', tags: ['fuel'], fuelMJ: 29 },

  // --- foraged and farmed food
  { id: 'berries', name: 'berries', plural: 'berries', kg: 0.1, cat: 'food', tags: ['food', 'fruit', 'raw_ok'], nut: N(50, 0.8, 0.4, 12, 85), digest: 0.95, shelf: 3, mood: 2 },
  { id: 'hazelnuts', name: 'hazelnuts', plural: 'hazelnuts', kg: 0.1, cat: 'food', tags: ['food', 'nut', 'raw_ok'], nut: N(628, 15, 61, 17, 5), digest: 0.9, shelf: 240, mood: 1 },
  { id: 'mushrooms', name: 'mushrooms', plural: 'mushrooms', kg: 0.1, cat: 'food', tags: ['food', 'vegetable'], nut: N(25, 3, 0.4, 3.3, 92), digest: 0.9, shelf: 4, risk: { cond: 'mushroom_poisoning', p: 0.02, cookedP: 0.015 } },
  { id: 'wild_garlic', name: 'wild garlic', plural: 'wild garlic', kg: 0.05, cat: 'food', tags: ['food', 'vegetable', 'raw_ok', 'herb'], nut: N(40, 2, 0.4, 6, 88), digest: 0.95, shelf: 5, mood: 1 },
  { id: 'cattail_root', name: 'cattail root', plural: 'cattail roots', kg: 0.2, cat: 'food', tags: ['food', 'vegetable', 'root'], nut: N(80, 1.2, 0.2, 18, 78), digest: 0.7, shelf: 10, risk: { cond: 'gut_infection', p: 0.01 } },
  { id: 'turnip', name: 'turnip', kg: 0.25, cat: 'food', tags: ['food', 'vegetable', 'root', 'raw_ok'], nut: N(28, 0.9, 0.1, 6.4, 92), digest: 0.95, shelf: 60 },
  { id: 'barley', name: 'barley', plural: 'barley', kg: 0.5, cat: 'food', tags: ['food', 'grain'], nut: N(354, 12.5, 2.3, 73, 10), digest: 0.35, shelf: 700 },
  { id: 'dried_beans', name: 'dried beans', plural: 'dried beans', kg: 0.1, cat: 'food', tags: ['food', 'legume'], nut: N(341, 21, 1.2, 63, 11), digest: 0.25, shelf: 700, risk: { cond: 'food_poisoning', p: 0.05 } },
  { id: 'yarrow', name: 'yarrow', plural: 'yarrow', kg: 0.05, cat: 'medical', tags: ['herb', 'medicinal'], shelf: 6 },

  // --- animal food
  { id: 'raw_meat', name: 'raw meat', plural: 'raw meat', kg: 0.5, cat: 'food', tags: ['food', 'meat', 'raw'], nut: N(140, 22, 5, 0, 72), digest: 0.85, shelf: 2.5, risk: { cond: 'food_poisoning', p: 0.03 }, mood: -3 },
  { id: 'animal_fat', name: 'animal fat', plural: 'animal fat', kg: 0.25, cat: 'food', tags: ['food', 'fat', 'raw'], nut: N(860, 1, 94, 0, 4), digest: 0.95, shelf: 6, mood: -2 },
  { id: 'fish', name: 'raw fish', plural: 'raw fish', kg: 0.4, cat: 'food', tags: ['food', 'meat', 'raw'], nut: N(120, 20, 4, 0, 75), digest: 0.9, shelf: 1.5, risk: { cond: 'food_poisoning', p: 0.03 }, mood: -3 },

  // --- prepared food. Meals carry their own nutrition, summed from what went into them.
  { id: 'roast_meat', name: 'roast meat', plural: 'roast meat', kg: 0.35, cat: 'food', tags: ['food', 'meat', 'cooked'], nut: N(200, 31, 7, 0, 60), digest: 0.95, shelf: 4, mood: 4 },
  { id: 'roast_roots', name: 'roast roots', plural: 'roast roots', kg: 0.18, cat: 'food', tags: ['food', 'vegetable', 'cooked'], nut: N(95, 1.5, 0.3, 21, 74), digest: 0.92, shelf: 3, mood: 2 },
  { id: 'jerky', name: 'jerky', plural: 'jerky', kg: 0.15, cat: 'food', tags: ['food', 'meat', 'preserved'], nut: N(410, 33, 25, 11, 23), digest: 0.92, shelf: 240, mood: 2 },
  { id: 'stew', name: 'stew', plural: 'stew', kg: 0.45, cat: 'food', tags: ['food', 'meal', 'cooked'], meal: true, digest: 0.95, shelf: 3, mood: 6 },
  { id: 'porridge', name: 'porridge', plural: 'porridge', kg: 0.4, cat: 'food', tags: ['food', 'meal', 'cooked'], meal: true, digest: 0.92, shelf: 2, mood: 3 },
  { id: 'pottage', name: 'bean pottage', plural: 'bean pottage', kg: 0.4, cat: 'food', tags: ['food', 'meal', 'cooked'], meal: true, digest: 0.9, shelf: 2, mood: 3 },
  { id: 'hardtack', name: 'hardtack', plural: 'hardtack', kg: 0.1, cat: 'food', tags: ['food', 'preserved', 'raw_ok'], nut: N(400, 10, 2, 82, 8), digest: 0.92, shelf: 1500, mood: -1 },
  { id: 'clean_water', name: 'boiled water', plural: 'boiled water', kg: 1, cat: 'food', tags: ['drink'], water: 1 },

  // --- seeds
  { id: 'barley_seed', name: 'barley seed', plural: 'barley seed', kg: 0.05, cat: 'seeds', tags: ['seed'], plants: 'barley' },
  { id: 'turnip_seed', name: 'turnip seed', plural: 'turnip seed', kg: 0.01, cat: 'seeds', tags: ['seed'], plants: 'turnip' },
  { id: 'bean_seed', name: 'bean seed', plural: 'bean seed', kg: 0.05, cat: 'seeds', tags: ['seed'], plants: 'beans' },
  { id: 'flax_seed', name: 'flax seed', plural: 'flax seed', kg: 0.02, cat: 'seeds', tags: ['seed'], plants: 'flax' },

  // --- tools and weapons. tool qualities multiply work speed for jobs that need them.
  { id: 'steel_hatchet', name: 'steel hatchet', kg: 1.1, cat: 'tools', tags: ['tool'], tool: { chop: 1.0, cut: 0.5 }, weapon: { type: 'cut', dmg: 10, cooldown: 1.6 } },
  { id: 'steel_knife', name: 'steel knife', kg: 0.25, cat: 'tools', tags: ['tool'], tool: { cut: 1.0, butcher: 1.0 }, weapon: { type: 'cut', dmg: 6, cooldown: 1.0 } },
  { id: 'iron_pot', name: 'iron cooking pot', kg: 2.5, cat: 'tools', tags: ['tool'], tool: { boil: 1.0 } },
  { id: 'fire_steel', name: 'flint and steel', plural: 'flint and steel', kg: 0.1, cat: 'tools', tags: ['tool'], tool: { fire: 1.0 } },
  { id: 'spade', name: 'iron spade', kg: 2, cat: 'tools', tags: ['tool'], tool: { dig: 1.0 }, weapon: { type: 'blunt', dmg: 7, cooldown: 1.8 } },
  { id: 'stone_axe', name: 'stone axe', kg: 1.4, cat: 'tools', tags: ['tool'], tool: { chop: 0.5 }, weapon: { type: 'blunt', dmg: 8, cooldown: 1.8 } },
  { id: 'flint_knife', name: 'flint knife', kg: 0.15, cat: 'tools', tags: ['tool'], tool: { cut: 0.6, butcher: 0.7 }, weapon: { type: 'cut', dmg: 5, cooldown: 1 } },
  { id: 'hammerstone', name: 'hammerstone', kg: 1.2, cat: 'tools', tags: ['tool'], tool: { mine: 0.35 } },
  { id: 'iron_pick', name: 'iron pick', kg: 2.8, cat: 'tools', tags: ['tool'], tool: { mine: 1.0 }, weapon: { type: 'pierce', dmg: 11, cooldown: 2 } },
  { id: 'digging_stick', name: 'digging stick', kg: 0.6, cat: 'tools', tags: ['tool'], tool: { dig: 0.45 } },
  { id: 'bow_drill', name: 'bow drill', kg: 0.4, cat: 'tools', tags: ['tool'], tool: { fire: 0.35 } },
  { id: 'spear', name: 'fire-hardened spear', kg: 1.5, cat: 'tools', tags: ['tool', 'weapon'], weapon: { type: 'pierce', dmg: 13, cooldown: 1.6, reach: 1, thrown: 3 } },
  { id: 'fishing_line', name: 'fishing line', kg: 0.1, cat: 'tools', tags: ['tool'], tool: { fish: 1.0 } },

  // --- clothing. clo is thermal insulation (1 clo = 0.155 m2K/W); wind and water are 0..1 protection.
  { id: 'wool_shirt', name: 'wool shirt', kg: 0.5, cat: 'clothing', wear: { slot: 'torso', clo: 0.35, wind: 0.1, water: 0.1, cover: ['torso', 'lArm', 'rArm'] } },
  { id: 'wool_trousers', name: 'wool trousers', plural: 'wool trousers', kg: 0.6, cat: 'clothing', wear: { slot: 'legs', clo: 0.3, wind: 0.1, water: 0.1, cover: ['lLeg', 'rLeg'] } },
  { id: 'wool_coat', name: 'wool coat', kg: 1.6, cat: 'clothing', wear: { slot: 'outer', clo: 0.7, wind: 0.4, water: 0.3, cover: ['torso', 'lArm', 'rArm'] } },
  { id: 'leather_boots', name: 'leather boots', plural: 'leather boots', kg: 1.2, cat: 'clothing', wear: { slot: 'feet', clo: 0.1, wind: 0.8, water: 0.6, cover: ['lLeg', 'rLeg'], armor: 0.1 } },
  { id: 'wool_cap', name: 'wool cap', kg: 0.1, cat: 'clothing', wear: { slot: 'head', clo: 0.08, wind: 0.3, water: 0.1, cover: ['head'] } },
  { id: 'mittens', name: 'wool mittens', plural: 'wool mittens', kg: 0.15, cat: 'clothing', wear: { slot: 'hands', clo: 0.06, wind: 0.3, water: 0.1, cover: ['lArm', 'rArm'] } },
  { id: 'fur_cloak', name: 'fur cloak', kg: 3, cat: 'clothing', wear: { slot: 'outer', clo: 1.3, wind: 0.8, water: 0.5, cover: ['torso', 'lArm', 'rArm', 'lLeg', 'rLeg'], armor: 0.15 } },
  { id: 'hide_boots', name: 'hide boots', plural: 'hide boots', kg: 1, cat: 'clothing', wear: { slot: 'feet', clo: 0.15, wind: 0.8, water: 0.5, cover: ['lLeg', 'rLeg'], armor: 0.1 } },
  { id: 'fur_hat', name: 'fur hat', kg: 0.3, cat: 'clothing', wear: { slot: 'head', clo: 0.15, wind: 0.8, water: 0.4, cover: ['head'], armor: 0.05 } },
  { id: 'wool_blanket', name: 'wool blanket', kg: 2, cat: 'clothing', tags: ['bedding'], bedClo: 1.6 },
  { id: 'fur_blanket', name: 'fur blanket', kg: 3.5, cat: 'clothing', tags: ['bedding'], bedClo: 2.5 },

  // --- medicine
  { id: 'linen_bandage', name: 'linen bandage', kg: 0.03, cat: 'medical', tags: ['bandage'], medical: 1.0 },
  { id: 'moss_dressing', name: 'moss dressing', kg: 0.05, cat: 'medical', tags: ['bandage'], medical: 0.6 },
  { id: 'poultice', name: 'yarrow poultice', kg: 0.05, cat: 'medical', tags: ['bandage', 'antiseptic'], medical: 0.9, antiseptic: 0.6, shelf: 10 },
];
