// Static game data: items, furniture and what can be found in it, recipes and robots.
// No DOM here; tests import this under Node.

// cat: food | drink | med | tool | weapon | material | wear | device | ammo
// Food values are how much of a 0-100 bar one item restores.
export const ITEMS = {
  // Food
  beans:     { name: 'Can of beans', wt: 0.5, cat: 'food', hunger: 32, canned: true },
  soup:      { name: 'Can of soup', wt: 0.5, cat: 'food', hunger: 24, thirst: 8, canned: true },
  tuna:      { name: 'Can of tuna', wt: 0.3, cat: 'food', hunger: 22, canned: true },
  peaches:   { name: 'Canned peaches', wt: 0.5, cat: 'food', hunger: 16, thirst: 12, canned: true },
  chips:     { name: 'Bag of chips', wt: 0.2, cat: 'food', hunger: 14, thirst: -4 },
  granola:   { name: 'Granola bar', wt: 0.1, cat: 'food', hunger: 12 },
  crackers:  { name: 'Crackers', wt: 0.2, cat: 'food', hunger: 12, thirst: -3 },
  cereal:    { name: 'Box of cereal', wt: 0.4, cat: 'food', hunger: 20 },
  pbutter:   { name: 'Peanut butter', wt: 0.5, cat: 'food', hunger: 34, thirst: -6 },
  apple:     { name: 'Apple', wt: 0.2, cat: 'food', hunger: 9, thirst: 5 },
  bread:     { name: 'Loaf of bread', wt: 0.4, cat: 'food', hunger: 22 },
  mre:       { name: 'Ration pack', wt: 0.6, cat: 'food', hunger: 45, thirst: 5 },
  // Drink
  water:     { name: 'Bottle of water', wt: 0.6, cat: 'drink', thirst: 40, leaves: 'bottle' },
  soda:      { name: 'Can of soda', wt: 0.4, cat: 'drink', thirst: 26, hunger: 4, leaves: 'tincan' },
  juice:     { name: 'Carton of juice', wt: 0.5, cat: 'drink', thirst: 30, hunger: 6 },
  // Medical
  bandage:   { name: 'Bandage', wt: 0.1, cat: 'med', desc: 'Stops bleeding. Clean, so the wound will not go bad.' },
  rag:       { name: 'Rag', wt: 0.1, cat: 'med', desc: 'Stops bleeding, but a dirty rag can infect the wound.' },
  antiseptic:{ name: 'Antiseptic', wt: 0.2, cat: 'med', desc: 'Cleans a wound and cures infection.' },
  painkillers:{ name: 'Painkillers', wt: 0.1, cat: 'med', desc: 'Restores some health and takes the edge off tiredness.' },
  // Tools
  hammer:    { name: 'Hammer', wt: 1.0, cat: 'weapon', dmg: 9, range: 1.15, cd: 0.55, dur: 60, tool: true, desc: 'Barricading and building. Also a weapon.' },
  saw:       { name: 'Saw', wt: 0.8, cat: 'tool', desc: 'Dismantle wooden furniture into planks.' },
  screwdriver:{ name: 'Screwdriver', wt: 0.2, cat: 'tool', desc: 'Dismantle electronics. Opens cans.' },
  opener:    { name: 'Can opener', wt: 0.1, cat: 'tool', desc: 'Opens cans quietly.' },
  flashlight:{ name: 'Flashlight', wt: 0.4, cat: 'tool', desc: 'F toggles it. Lights the way, and makes you easy to spot.' },
  radio:     { name: 'Wind-up radio', wt: 0.8, cat: 'tool', desc: 'Picks up Faraday Free Radio, and Halcyon. Use it to listen.' },
  batteries: { name: 'Batteries', wt: 0.1, cat: 'tool', desc: 'Recharges a flashlight.' },
  // Weapons
  knife:     { name: 'Kitchen knife', wt: 0.3, cat: 'weapon', dmg: 8, range: 1.0, cd: 0.38, dur: 40, desc: 'Quick and quiet. Also opens cans.' },
  pipe:      { name: 'Lead pipe', wt: 1.4, cat: 'weapon', dmg: 13, range: 1.3, cd: 0.7, dur: 90 },
  crowbar:   { name: 'Crowbar', wt: 1.5, cat: 'weapon', dmg: 15, range: 1.3, cd: 0.72, dur: 140, desc: 'Sturdy. Pries off barricades.' },
  bat:       { name: 'Baseball bat', wt: 1.1, cat: 'weapon', dmg: 13, range: 1.4, cd: 0.66, dur: 60 },
  spikedbat: { name: 'Nailed bat', wt: 1.3, cat: 'weapon', dmg: 18, range: 1.4, cd: 0.68, dur: 70 },
  wrench:    { name: 'Pipe wrench', wt: 1.4, cat: 'weapon', dmg: 14, range: 1.2, cd: 0.7, dur: 110 },
  axe:       { name: 'Fire axe', wt: 2.4, cat: 'weapon', dmg: 26, range: 1.4, cd: 1.05, dur: 90, desc: 'Slow and heavy. Splits a chassis.' },
  sledge:    { name: 'Sledgehammer', wt: 4.0, cat: 'weapon', dmg: 34, range: 1.4, cd: 1.4, dur: 120, desc: 'Very slow. Knocks robots flat.' },
  shotgun:   { name: 'Shotgun', wt: 3.2, cat: 'weapon', gun: true, dmg: 48, range: 8, cd: 1.1, dur: 200, desc: 'Click to fire. Every robot for blocks will hear it.' },
  shells:    { name: 'Shotgun shells', wt: 0.05, cat: 'ammo' },
  // Throwables and devices
  tincan:    { name: 'Empty can', wt: 0.05, cat: 'material', throwable: true, desc: 'Ready it and press G to throw: robots go to look.' },
  bottle:    { name: 'Empty bottle', wt: 0.1, cat: 'material', desc: 'Fill it at a sink or rain barrel.' },
  pulse:     { name: 'Pulse charge', wt: 0.6, cat: 'device', throwable: true, desc: 'Thrown, it fries every robot close to where it lands.' },
  noisemaker:{ name: 'Noisemaker', wt: 0.4, cat: 'device', throwable: true, desc: 'Thrown, it wails for a while and draws robots to it.' },
  // Materials
  plank:     { name: 'Plank', wt: 1.0, cat: 'material' },
  nails:     { name: 'Nails', wt: 0.02, cat: 'material' },
  scrap:     { name: 'Scrap metal', wt: 0.5, cat: 'material' },
  wiring:    { name: 'Wiring', wt: 0.1, cat: 'material' },
  circuit:   { name: 'Circuit board', wt: 0.1, cat: 'material' },
  cell:      { name: 'Power cell', wt: 0.5, cat: 'material', desc: 'A robot battery. Powers jammers and pulse charges.' },
  cloth:     { name: 'Old clothes', wt: 0.3, cat: 'material', desc: 'Tear into rags.' },
  tape:      { name: 'Duct tape', wt: 0.2, cat: 'material' },
  // Wearables
  jacket:    { name: 'Work jacket', wt: 1.0, cat: 'wear', slot: 'body', armor: 0.25, desc: 'Turns some blows that would have cut you.' },
  platejacket:{ name: 'Plated jacket', wt: 2.2, cat: 'wear', slot: 'body', armor: 0.5, desc: 'Scrap plates taped over a work jacket.' },
  vest:      { name: 'Body armor', wt: 2.0, cat: 'wear', slot: 'body', armor: 0.45 },
  backpack:  { name: 'Hiking pack', wt: 0.8, cat: 'wear', slot: 'back', carry: 12, desc: 'Carry 12 kg more.' },
  duffel:    { name: 'Duffel bag', wt: 0.6, cat: 'wear', slot: 'back', carry: 7, desc: 'Carry 7 kg more.' },
  // Placeables (crafted)
  jammer:    { name: 'Signal jammer', wt: 3.0, cat: 'device', place: 'jammer', desc: 'Place it: robots near it lose your trail and cannot hear. Runs on a power cell.' },
  barrelkit: { name: 'Rain barrel kit', wt: 4.0, cat: 'device', place: 'barrel', desc: 'Place it outdoors. Collects rain to drink.' },
  wallkit:   { name: 'Wall frame', wt: 3.0, cat: 'device', place: 'bwall', desc: 'Place it to wall off a gap.' },
  cratekit:  { name: 'Storage crate', wt: 3.0, cat: 'device', place: 'crate', desc: 'Place it to store things.' },
};

export const FOOD_NEEDS_OPENER = 'Needs a can opener, knife or screwdriver.';

// Furniture and other containers. h: drawn height. loot: table name. wood: planks when sawn.
// elec: parts when unscrewed. water: is a tap. bed: can sleep. tall: blocks robots seeing over it.
export const FURNITURE = {
  fridge:   { name: 'Fridge', h: 42, loot: 'fridge', elec: [['wiring', 2], ['scrap', 2]], color: '#d9dcd6' },
  counter:  { name: 'Kitchen cabinet', h: 22, loot: 'kitchen', wood: 2, color: '#a07a52' },
  stove:    { name: 'Stove', h: 22, loot: 'stove', elec: [['wiring', 1], ['scrap', 2]], color: '#c8c8c0' },
  sink:     { name: 'Sink', h: 22, loot: 'sink', water: true, color: '#b9c2c6' },
  bed:      { name: 'Bed', h: 12, loot: 'bed', wood: 3, bed: true, color: '#7d8fb3' },
  wardrobe: { name: 'Wardrobe', h: 44, loot: 'wardrobe', wood: 4, color: '#7b5a3c' },
  dresser:  { name: 'Dresser', h: 22, loot: 'dresser', wood: 2, color: '#8a6644' },
  sofa:     { name: 'Sofa', h: 16, loot: 'sofa', wood: 2, color: '#7a4b4b' },
  tv:       { name: 'Television', h: 24, loot: 'none', elec: [['circuit', 1], ['wiring', 2]], color: '#2b2d33' },
  shelf:    { name: 'Bookshelf', h: 40, loot: 'bookshelf', wood: 3, color: '#6d4f33' },
  desk:     { name: 'Desk', h: 18, loot: 'desk', wood: 2, color: '#8b6a48' },
  computer: { name: 'Computer', h: 22, loot: 'none', elec: [['circuit', 2], ['wiring', 1]], color: '#9aa0a8' },
  toilet:   { name: 'Toilet', h: 14, loot: 'none', color: '#e8ece9' },
  medcab:   { name: 'Medicine cabinet', h: 26, loot: 'medcab', color: '#e2e6e3' },
  tub:      { name: 'Bathtub', h: 12, loot: 'none', water: true, color: '#e8ece9' },
  workbench:{ name: 'Workbench', h: 22, loot: 'workbench', wood: 3, color: '#9a7a50' },
  toolbox:  { name: 'Tool chest', h: 26, loot: 'toolbox', color: '#b23a2e' },
  table:    { name: 'Table', h: 16, loot: 'none', wood: 2, color: '#94704b' },
  microwave:{ name: 'Microwave', h: 22, loot: 'none', elec: [['circuit', 1], ['wiring', 1]], color: '#d0d0cc' },
  // Stores
  storeshelf:{ name: 'Store shelf', h: 34, loot: 'store', wood: 0, color: '#c9ccd1', tall: true },
  storefridge:{ name: 'Drinks cooler', h: 40, loot: 'cooler', elec: [['wiring', 2], ['scrap', 3]], color: '#a9c6d6' },
  register: { name: 'Checkout counter', h: 20, loot: 'register', color: '#6b6f78' },
  locker:   { name: 'Locker', h: 44, loot: 'locker', color: '#5f6e66' },
  gunrack:  { name: 'Weapons locker', h: 44, loot: 'gunrack', color: '#3e4a43' },
  crate:    { name: 'Storage crate', h: 20, loot: 'none', wood: 2, color: '#a98454', placed: true },
  // Landmarks
  cot:      { name: 'Depot cot', h: 10, loot: 'cot', bed: true, color: '#c4c9cf' },
  bin:      { name: 'Resident property bin', h: 22, loot: 'bin', color: '#7d8c99' },
  node:     { name: 'Civic Care node', h: 48, loot: 'none', node: true, color: '#e9ecef' },
  transmitter: { name: 'KFDC transmitter', h: 40, loot: 'none', studio: true, color: '#4d545e' },
  mast:     { name: 'Radio mast', h: 20, loot: 'none', color: '#b8402e' },
  // Outdoor
  car:      { name: 'Car', h: 22, loot: 'trunk', color: '#5a7fa6' },
  mailbox:  { name: 'Mailbox', h: 18, loot: 'none', color: '#4b6a8a' },
  dumpster: { name: 'Dumpster', h: 24, loot: 'dumpster', color: '#3f6b4c' },
  // Placed devices
  barrel:   { name: 'Rain barrel', h: 24, loot: 'none', water: true, placed: true, color: '#3a6f9a' },
  jammer:   { name: 'Signal jammer', h: 20, loot: 'none', placed: true, color: '#3b4250' },
};

// Loot tables: each roll picks one entry by weight; rolls = [min, max].
export const LOOT = {
  none: { rolls: [0, 0], items: [] },
  fridge: { rolls: [1, 4], items: [['water', 6], ['soda', 5], ['juice', 4], ['apple', 4], ['bread', 2]] },
  kitchen: { rolls: [1, 3], items: [['beans', 5], ['soup', 5], ['tuna', 4], ['peaches', 3], ['cereal', 3], ['crackers', 3], ['pbutter', 2], ['opener', 3], ['knife', 3], ['bottle', 2], ['tape', 1], ['batteries', 1]] },
  stove: { rolls: [0, 1], items: [['pipe', 1], ['tincan', 3]] },
  sink: { rolls: [0, 1], items: [['rag', 2], ['bottle', 2]] },
  bed: { rolls: [0, 1], items: [['cloth', 3], ['bat', 1], ['flashlight', 1]] },
  wardrobe: { rolls: [1, 3], items: [['cloth', 8], ['jacket', 2], ['duffel', 1], ['backpack', 1], ['bat', 1]] },
  dresser: { rolls: [1, 2], items: [['radio', 1], ['cloth', 6], ['batteries', 2], ['painkillers', 1], ['flashlight', 1]] },
  sofa: { rolls: [0, 1], items: [['chips', 3], ['granola', 2], ['batteries', 1]] },
  bookshelf: { rolls: [0, 2], items: [['batteries', 2], ['flashlight', 1], ['tape', 1], ['cloth', 1]] },
  desk: { rolls: [0, 2], items: [['radio', 1], ['batteries', 3], ['circuit', 1], ['wiring', 1], ['granola', 1], ['screwdriver', 1]] },
  medcab: { rolls: [1, 3], items: [['bandage', 4], ['painkillers', 4], ['antiseptic', 2], ['rag', 1]] },
  workbench: { rolls: [1, 3], items: [['nails', 6], ['plank', 3], ['hammer', 2], ['saw', 2], ['screwdriver', 2], ['tape', 2], ['wiring', 2]] },
  toolbox: { rolls: [1, 3], items: [['hammer', 3], ['screwdriver', 3], ['wrench', 2], ['nails', 4], ['tape', 2], ['crowbar', 1], ['saw', 1]] },
  trunk: { rolls: [0, 2], items: [['crowbar', 2], ['tape', 2], ['water', 3], ['granola', 2], ['flashlight', 1], ['duffel', 1], ['bandage', 1]] },
  dumpster: { rolls: [0, 3], items: [['tincan', 6], ['bottle', 4], ['scrap', 3], ['plank', 2], ['cloth', 2], ['chips', 1]] },
  register: { rolls: [0, 2], items: [['granola', 3], ['batteries', 2], ['chips', 2]] },
  cot: { rolls: [0, 1], items: [['rag', 3], ['granola', 2], ['painkillers', 2], ['bandage', 1], ['crackers', 2]] },
  bin: { rolls: [1, 3], items: [['flashlight', 2], ['batteries', 3], ['radio', 1], ['knife', 2], ['water', 3], ['jacket', 1], ['backpack', 1], ['cell', 2], ['screwdriver', 2], ['mre', 1]] },
  locker: { rolls: [1, 2], items: [['vest', 1], ['bandage', 3], ['flashlight', 2], ['batteries', 2], ['mre', 2]] },
  gunrack: { rolls: [1, 3], items: [['shotgun', 2], ['shells', 8], ['vest', 1], ['mre', 1]] },
  cooler: { rolls: [2, 5], items: [['water', 6], ['soda', 6], ['juice', 4]] },
  // Store shelves draw from the store's own table (set when the town is built).
  'store:grocery': { rolls: [2, 5], items: [['beans', 6], ['soup', 6], ['tuna', 5], ['peaches', 4], ['chips', 5], ['crackers', 4], ['cereal', 4], ['pbutter', 3], ['granola', 4], ['bread', 2], ['water', 4], ['opener', 1]] },
  'store:hardware': { rolls: [2, 4], items: [['nails', 8], ['plank', 6], ['hammer', 3], ['saw', 3], ['screwdriver', 3], ['tape', 4], ['wiring', 3], ['crowbar', 2], ['wrench', 2], ['axe', 1], ['sledge', 1], ['flashlight', 2], ['batteries', 3]] },
  'store:pharmacy': { rolls: [1, 4], items: [['bandage', 6], ['antiseptic', 4], ['painkillers', 5], ['granola', 2], ['water', 2], ['batteries', 1]] },
  'store:electronics': { rolls: [1, 3], items: [['radio', 2], ['circuit', 5], ['wiring', 5], ['batteries', 5], ['flashlight', 2], ['cell', 1], ['screwdriver', 1]] },
  'store:gas': { rolls: [1, 3], items: [['chips', 5], ['soda', 4], ['water', 4], ['granola', 4], ['batteries', 2], ['tape', 2], ['crackers', 2]] },
  'store:police': { rolls: [0, 2], items: [['bandage', 2], ['flashlight', 2], ['batteries', 2], ['shells', 2]] },
  'store:fire': { rolls: [1, 2], items: [['axe', 3], ['bandage', 3], ['antiseptic', 2], ['crowbar', 2], ['vest', 1]] },
  wreck: { rolls: [0, 0], items: [] },
};

// Recipes. needs: consumed. tools: kept (any one of a list works).
export const RECIPES = [
  { id: 'rags', out: ['rag', 3], needs: [['cloth', 1]], time: 2, desc: 'Tear old clothes into rags.' },
  { id: 'cleanrag', out: ['bandage', 1], needs: [['rag', 1], ['antiseptic', 1]], time: 2, desc: 'Soak a rag into a clean bandage.' },
  { id: 'spikedbat', out: ['spikedbat', 1], needs: [['bat', 1], ['nails', 6]], tools: [['hammer']], time: 5 },
  { id: 'platejacket', out: ['platejacket', 1], needs: [['jacket', 1], ['scrap', 4], ['tape', 1]], time: 8, desc: 'Tape scrap plates over a work jacket.' },
  { id: 'pulse', out: ['pulse', 1], needs: [['cell', 1], ['wiring', 1], ['circuit', 1], ['tincan', 1]], tools: [['screwdriver']], time: 6, desc: 'Short a power cell through a board: a one-shot pulse.' },
  { id: 'noisemaker', out: ['noisemaker', 1], needs: [['batteries', 1], ['circuit', 1], ['tincan', 1]], tools: [['screwdriver']], time: 4, desc: 'A wailing decoy to throw.' },
  { id: 'jammer', out: ['jammer', 1], needs: [['circuit', 2], ['wiring', 3], ['cell', 1], ['scrap', 2]], tools: [['screwdriver']], time: 12, desc: 'Robots near it cannot hear, and lose your trail.' },
  { id: 'wallkit', out: ['wallkit', 1], needs: [['plank', 3], ['nails', 4]], tools: [['hammer']], time: 6 },
  { id: 'barrelkit', out: ['barrelkit', 1], needs: [['plank', 4], ['nails', 4], ['tape', 1]], tools: [['hammer']], time: 8 },
  { id: 'cratekit', out: ['cratekit', 1], needs: [['plank', 3], ['nails', 2]], tools: [['hammer']], time: 5 },
  { id: 'fixweapon', out: null, needs: [['tape', 1]], time: 3, desc: 'Tape up your weapon: restores half its wear.', special: 'repair' },
];

// Robots of the Halcyon network.
// sight: tiles in daylight. hear: multiplier on noise radius. bash: damage per hit on doors and walls.
export const ROBOTS = {
  tender: {
    name: 'Tender', hp: 42, speed: 2.5, wander: 0.9, sight: 11, hear: 1.0, dmg: 9, wound: 0.32, cd: 1.15, reach: 0.95,
    bash: 9, opensDoors: true, desc: 'A Halcyon home assistant. Patient, strong, and it knows how door handles work.',
    drops: [['scrap', 1, 2], ['wiring', 0, 2], ['circuit', 0, 1, 0.35], ['cell', 0, 1, 0.22]], from: 1,
  },
  rover: {
    name: 'Rover', hp: 24, speed: 4.6, wander: 1.4, sight: 9, hear: 1.4, dmg: 6, wound: 0.55, cd: 0.8, reach: 0.85,
    bash: 4, desc: 'A security quadruped. Fast, sharp, and easy to break.',
    drops: [['scrap', 1, 2], ['wiring', 0, 1], ['cell', 0, 1, 0.3]], from: 2,
  },
  lamplighter: {
    name: 'Lamplighter', hp: 16, speed: 3.0, wander: 1.6, sight: 7, hear: 0.8, dmg: 0, wound: 0, cd: 1, reach: 0, flies: true,
    bash: 0, desc: 'A survey drone with a searchlight. It does not fight. It calls the others.',
    drops: [['circuit', 1, 1], ['wiring', 0, 2], ['cell', 0, 1, 0.5]], from: 1,
  },
  breaker: {
    name: 'Breaker', hp: 130, speed: 1.7, wander: 0.6, sight: 9, hear: 1.0, dmg: 24, wound: 0.5, cd: 1.7, reach: 1.15,
    bash: 40, desc: 'A demolition loader. Slow. Walls do not stop it for long.',
    drops: [['scrap', 3, 5], ['wiring', 1, 3], ['cell', 1, 1], ['circuit', 0, 2, 0.6]], from: 3,
  },
};

// Noise radii in tiles.
export const NOISE = {
  walk: 2.5, run: 7, sneak: 0, swing: 5, hit: 7, smashWindow: 14, smashFurniture: 9,
  hammer: 11, saw: 7, shotgun: 34, canLand: 9, noisemaker: 20, doorBash: 8, climb: 3, unscrew: 3,
};

export const DOOR_HP = 70;
export const WINDOW_HP = 18;
export const PLANK_HP = 90;
export const BWALL_HP = 320;
export const FENCE_HP = 60;
