// Waybill: content and numbers. Items, the trail, markets, hunting, hired hands and the ledger notes.
// Plain data, no DOM. Loaded as a script in the page and with require() under Node.
(function (root) {
'use strict';

// Day 0 of the journey. Most Santa Fe caravans rolled out of western Missouri in May.
const START = Date.UTC(1844, 4, 14);
const START_MONEY = 1500;
const NOTE = 1200;            // what Elias owed Wendell, now yours to settle
const FOOD_PER_PERSON = 2.5;  // pounds of provisions (or the same in meat) a day
const WATER_PER_PERSON = 1;   // gallons a day on a dry stretch
const CASK_GAL = 10;
const WATER_LB = 8.3;         // a gallon of water

// kind: supply | goods (bought to sell in Santa Fe) | game (taken on the trail)
// w: pounds per unit. price: Independence price. food: pounds of rations one unit replaces.
// spoil: days before it is lost. fragile: can break on rough ground.
const ITEMS = {
  provisions: { name: 'Provisions', unit: 'lb', w: 1, price: 0.07, food: 1, kind: 'supply', note: 'Flour, side bacon, coffee, sugar and beans. Two and a half pounds feeds one person for a day.' },
  salt: { name: 'Salt', unit: 'lb', w: 1, price: 0.03, kind: 'supply', note: 'Salts down fresh meat so it keeps three weeks. A pound does ten pounds of meat.' },
  powder: { name: 'Powder and lead', unit: 'lb', w: 1, price: 0.45, kind: 'supply', note: 'A pound for each hunt, two for buffalo.' },
  medicine: { name: 'Medicine chest', unit: 'chest', w: 4, price: 5, kind: 'supply', note: 'Quinine, calomel, blue mass and laudanum. One chest sees a sick person through.' },
  cask: { name: 'Water cask', unit: 'cask', w: 12, price: 2, kind: 'supply', note: 'Holds ten gallons. Full, it weighs 95 pounds.' },
  axle: { name: 'Spare axletree', unit: 'axle', w: 40, price: 5, kind: 'supply', note: 'Hickory or oak. There is no timber for one past Council Grove.' },
  wheel: { name: 'Spare wheel', unit: 'wheel', w: 60, price: 12, kind: 'supply', note: 'A whole wheel, tyred and ready.' },
  grease: { name: 'Wheel grease', unit: 'bucket', w: 8, price: 1, kind: 'supply', note: 'Tar and tallow. A bucket keeps the hubs turning about a week. Dry hubs wear the wagon twice as fast.' },

  calico: { name: 'Calico prints', unit: 'bolt', w: 14, price: 4.5, kind: 'goods', note: 'Bright printed cotton from Lowell and Manchester. The staple of the trade.' },
  manta: { name: 'Domestic cottons', unit: 'bolt', w: 20, price: 3.2, kind: 'goods', note: 'Plain unbleached sheeting. Heavy, cheap, always wanted, never dear.' },
  hardware: { name: 'Hardware', unit: 'crate', w: 60, price: 14, kind: 'goods', note: 'Axes, hoes, knives, awls and kettles. Heavy, and nothing on the road can harm it.' },
  glass: { name: 'Looking glasses', unit: 'box', w: 12, price: 6, kind: 'goods', fragile: true, note: 'Mirrors in gilt frames. Dear in Santa Fe, and they break on rough ground.' },
  notions: { name: 'Needles and notions', unit: 'box', w: 6, price: 3.5, kind: 'goods', note: 'Needles, thread, buttons, ribbon, combs. Light and steady.' },
  silk: { name: 'Silk shawls', unit: 'bundle', w: 5, price: 16, kind: 'goods', note: 'Rich goods for the rich houses. Few buyers, and the customs house looks hard at silk.' },
  tobacco: { name: 'Tobacco twist', unit: 'bale', w: 20, price: 2.5, kind: 'goods', note: 'Sells modestly in Santa Fe, but on the plains it is the courtesy of every meeting.' },

  meat: { name: 'Fresh meat', unit: 'lb', w: 1, food: 1, spoil: 2, kind: 'game', becomes: ['jerky', 'Jerk it (half a day) to a third the weight, keeping seven weeks; or salt it'], note: 'Eat it in two days, jerk it, or salt it down.' },
  jerky: { name: 'Jerked meat', unit: 'lb', w: 1, food: 3, spoil: 50, kind: 'game', note: 'Sliced thin and dried on lines in the sun. Keeps for weeks; a pound is worth three of fresh.' },
  saltmeat: { name: 'Salt meat', unit: 'lb', w: 1, food: 1, spoil: 22, kind: 'game', note: 'Salted down in the wagon. Keeps three weeks.' },
  tongue: { name: 'Buffalo tongue', unit: 'tongue', w: 3, food: 3, spoil: 3, kind: 'game', becomes: ['tongue_s', 'Salt it (half a pound of salt) and it keeps'], note: 'The best eating on the plains. Salt it and it will sell in Santa Fe.' },
  tongue_s: { name: 'Salted tongue', unit: 'tongue', w: 2.5, kind: 'game', note: 'A delicacy that keeps. Sells in Santa Fe and at Bent\'s Fort.' },
  hide_g: { name: 'Green buffalo hide', unit: 'hide', w: 55, spoil: 4, kind: 'game', becomes: ['hide_d', 'Dry it in camp (half a day) and it weighs 28 lb and keeps'], note: 'Raw and heavy. Stake it out and dry it within four days or it rots.' },
  hide_d: { name: 'Dried buffalo hide', unit: 'hide', w: 28, kind: 'game', note: 'A summer hide, too thin for a robe, but good leather. Sells at the forts and in New Mexico.' },
  tallow: { name: 'Tallow', unit: 'lb', w: 1, kind: 'game', note: 'Six pounds stand in for a bucket of wheel grease. Sells a little in Santa Fe.' },
  wolf: { name: 'Wolf pelt', unit: 'pelt', w: 6, kind: 'game', note: 'Summer fur is thin, but traders at the forts will give something for it.' },
  ante: { name: 'Antelope hide', unit: 'hide', w: 4, kind: 'game', note: 'Light and soft. Worth a little anywhere.' },
  deer: { name: 'Deerskin', unit: 'skin', w: 7, kind: 'game', note: 'Buckskin is wanted everywhere for clothes and moccasins.' },
  bearhide: { name: 'Bear hide', unit: 'hide', w: 40, kind: 'game', note: 'A grizzly hide. Heavy, and worth having.' },
  bearoil: { name: 'Bear oil', unit: 'gallon', w: 8, kind: 'game', note: 'Rendered fat, prized for cooking and for hair. Sells well.' },
};

// Draft animals. pull: pounds one animal (or one yoke) can draw. drink: gallons each needs on a dry day,
// the least that keeps it going. min: fewest that can move a wagon at all.
const TEAMS = {
  mules: { name: 'Mules', one: 'mule', many: 'mules', price: 40, speed: 18, pull: 450, drink: 3, min: 4, max: 10, start: 6, note: 'Quick and hardy on poor grass. Dear, thirsty, and the first thing raiders take.' },
  oxen: { name: 'Oxen', one: 'yoke of oxen', many: 'yoke of oxen', price: 46, speed: 15, pull: 800, drink: 5, min: 2, max: 6, start: 4, note: 'Slow, cheap and strong. Few raiders want them, and in the worst case they can be eaten.' },
};

const WAGONS = {
  old: { name: "Elias's wagon", cap: 2600, cond: 68, price: 0, note: 'Two seasons on the road already. Sound enough, if you watch it.' },
  new: { name: 'New Murphy wagon', cap: 3200, cond: 100, price: 140, note: 'Built in St. Louis this winter, with wheels made for the plains. The price allows for Elias\'s old wagon in trade.' },
};

// Hired hands: take one, or go alone. wage is dollars a day, paid at the end.
const HANDS = {
  tomas: { name: 'Tomás Baca', wage: 1, skill: 'trade', blurb: 'A muleteer from San Miguel del Vado who came east with last year\'s caravan and wants to go home. Speaks Spanish and English, knows the customs men, and knows mules.', perks: ['Better prices in New Mexico', 'Can handle the customs house', 'Mules keep better condition'] },
  hiram: { name: 'Hiram Pruett', wage: 0.75, skill: 'hunt', blurb: 'A Clay County farmer\'s son who has made the trip twice as a teamster and once as a hunter for a caravan. A dead shot and a slow talker.', perks: ['Hunts succeed far more often', 'Wastes less powder', 'Reads weather'] },
  anton: { name: 'Anton Weisz', wage: 0.75, skill: 'repair', blurb: 'A wheelwright from the German streets of St. Louis, going west to see it. Has never fired a rifle and has never met a wheel he could not fix.', perks: ['Wagon wears more slowly', 'Repairs take less and do more', 'Can mend a break without a spare'] },
};

// ---------- the trail ----------
// region: tall | mixed | plains | dry | mountain | nm. Drives hunting, weather and who you meet.
// next: the node that follows, or a list where the trail forks.
const NODES = {
  indep: { name: 'Independence', sub: 'Missouri', region: 'tall', next: 'grove', x: 4, y: 30, market: 'indep', scene: 'town' },
  grove: { name: 'Council Grove', sub: 'Neosho River', region: 'tall', next: 'diamond', x: 20, y: 34, scene: 'grove' },
  diamond: { name: 'Diamond Spring', sub: '', region: 'mixed', next: 'ltark', x: 24, y: 36, scene: 'spring', water: true },
  ltark: { name: 'Little Arkansas', sub: 'crossing', region: 'mixed', next: 'rock', x: 31, y: 44, scene: 'creek', water: true },
  rock: { name: 'Pawnee Rock', sub: 'Big Bend of the Arkansas', region: 'plains', next: 'pfork', x: 37, y: 52, scene: 'rock', water: true },
  pfork: { name: 'Pawnee Fork', sub: 'crossing', region: 'plains', next: 'caches', x: 40, y: 55, scene: 'creek', water: true },
  caches: { name: 'The Caches', sub: 'Arkansas River', region: 'plains', next: ['lspring', 'bent'], x: 48, y: 58, scene: 'river', water: true },
  // the Cimarron Route
  lspring: { name: 'Lower Spring', sub: 'Cimarron River', region: 'dry', next: 'mspring', x: 55, y: 72, scene: 'spring', water: true },
  mspring: { name: 'Middle Spring', sub: 'Cimarron River', region: 'dry', next: 'uspring', x: 61, y: 74, scene: 'spring', water: true },
  uspring: { name: 'Upper Spring', sub: 'Cimarron River', region: 'dry', next: 'rabbit', x: 66, y: 72, scene: 'spring', water: true },
  rabbit: { name: 'Rabbit Ears', sub: 'two peaks', region: 'dry', next: 'mound', x: 74, y: 66, scene: 'ears' },
  mound: { name: 'Wagon Mound', sub: '', region: 'nm', next: 'junta', x: 82, y: 66, scene: 'mound' },
  // the Mountain Route
  bent: { name: "Bent's Fort", sub: 'Arkansas River', region: 'plains', next: 'purg', x: 62, y: 44, market: 'bent', scene: 'fort', water: true },
  purg: { name: 'The Purgatoire', sub: 'foot of Raton Pass', region: 'mountain', next: 'raton', x: 70, y: 52, scene: 'mountain', water: true },
  raton: { name: 'Raton Pass', sub: 'summit', region: 'mountain', next: 'junta', x: 74, y: 56, scene: 'pass', water: true },
  // together again
  junta: { name: 'La Junta', sub: 'the Mora and Sapello', region: 'nm', next: 'vegas', x: 86, y: 70, scene: 'creek', water: true },
  vegas: { name: 'Las Vegas', sub: 'New Mexico', region: 'nm', next: 'pecos', x: 88, y: 74, market: 'vegas', scene: 'village', water: true },
  pecos: { name: 'Pecos', sub: 'Glorieta Pass', region: 'nm', next: 'santafe', x: 91, y: 80, scene: 'ruin', water: true },
  santafe: { name: 'Santa Fe', sub: 'New Mexico', region: 'nm', next: null, x: 95, y: 82, market: 'santafe', scene: 'city', water: true },
};

// The ground between two nodes. mi: miles. water: chance each day of finding water for the stock.
// grass: 0 poor, 1 fair, 2 good. rough: 1 easy road, 2 rough, 3 brutal. slow: speed multiplier.
// danger: how often stock is run off at night (0 to 1).
const EDGES = {
  'indep>grove': { mi: 145, water: 0.95, grass: 2, rough: 1.3, danger: 0, note: 'Rolling tallgrass, creeks every few miles, and mud.' },
  'grove>diamond': { mi: 16, water: 0.9, grass: 2, rough: 1, danger: 0.1 },
  'diamond>ltark': { mi: 74, water: 0.8, grass: 2, rough: 1, danger: 0.15, note: 'The timber thins to creek lines and then to nothing.' },
  'ltark>rock': { mi: 45, water: 0.85, grass: 1, rough: 1, danger: 0.3 },
  'rock>pfork': { mi: 15, water: 1, grass: 1, rough: 1, danger: 0.3 },
  'pfork>caches': { mi: 85, water: 1, grass: 1, rough: 1, danger: 0.35, note: 'Up the Arkansas, sand hills to the south, water every day.' },
  'caches>lspring': { mi: 60, water: 0, grass: 0, rough: 1.4, slow: 0.85, danger: 0.4, dry: true, note: 'The Jornada: sixty miles of sand hills and short grass with no water at all.' },
  'lspring>mspring': { mi: 36, water: 0.35, grass: 1, rough: 1.2, danger: 0.6, dig: true, note: 'Up the Cimarron, which runs under its own sand more often than over it.' },
  'mspring>uspring': { mi: 34, water: 0.45, grass: 1, rough: 1.2, danger: 0.6, dig: true },
  'uspring>rabbit': { mi: 70, water: 0.5, grass: 1, rough: 1.2, danger: 0.45, note: 'High open plains toward the two peaks.' },
  'rabbit>mound': { mi: 85, water: 0.55, grass: 1, rough: 1.3, danger: 0.3 },
  'mound>junta': { mi: 25, water: 0.8, grass: 2, rough: 1.2, danger: 0.1 },
  'caches>bent': { mi: 140, water: 1, grass: 1, rough: 1, danger: 0.2, note: 'On up the Arkansas, past the cottonwoods, to the adobe fort.' },
  'bent>purg': { mi: 85, water: 0.55, grass: 1, rough: 1.4, danger: 0.15, note: 'Southwest across dry country to the canyon of the Purgatoire.' },
  'purg>raton': { mi: 24, water: 0.9, grass: 2, rough: 3, slow: 0.35, danger: 0.05, note: 'Raton Pass. Boulders, washouts and grades that have to be cleared by hand.' },
  'raton>junta': { mi: 108, water: 0.7, grass: 2, rough: 1.4, danger: 0.15, note: 'Down through broken country and across the Canadian.' },
  'junta>vegas': { mi: 22, water: 1, grass: 2, rough: 1.1, danger: 0 },
  'vegas>pecos': { mi: 42, water: 0.9, grass: 1, rough: 1.5, danger: 0, note: 'By San Miguel del Vado and across the Pecos.' },
  'pecos>santafe': { mi: 26, water: 0.8, grass: 1, rough: 1.6, danger: 0, note: 'Through Glorieta Pass and down to the city.' },
};

// ---------- markets ----------
// sells: what you can buy there and the price. buys: [price, depth]. Each unit you sell knocks the
// price down; after `depth` units it has fallen by half (never below 45% of the start).
const MARKETS = {
  indep: {
    name: 'Independence',
    sells: { provisions: 0.07, salt: 0.03, powder: 0.45, medicine: 5, cask: 2, axle: 5, wheel: 12, grease: 1, calico: 4.5, manta: 3.2, hardware: 14, glass: 6, notions: 3.5, silk: 16, tobacco: 2.5 },
    buys: {},
  },
  bent: {
    name: "Bent's Fort",
    sells: { provisions: 0.3, salt: 0.1, powder: 1.25, medicine: 12, cask: 5, axle: 12, wheel: 26, grease: 3 },
    buys: { hide_d: [2.5, 15], wolf: [1.5, 20], ante: [0.6, 20], deer: [1.25, 15], tongue_s: [0.6, 30], tallow: [0.1, 100], bearhide: [3, 3], bearoil: [2.5, 8],
      calico: [9, 20], manta: [5, 20], hardware: [22, 6], glass: [12, 6], notions: [6, 10], silk: [25, 4], tobacco: [4.5, 20] },
    animal: 65, repair: [25, 40],
  },
  vegas: {
    name: 'Las Vegas',
    sells: { provisions: 0.1, salt: 0.04, cask: 3, grease: 2 },
    buys: { hide_d: [1.25, 15], wolf: [0.8, 10], ante: [0.5, 15], deer: [1.25, 15], tongue_s: [0.6, 15], tallow: [0.1, 60], bearhide: [2, 2], bearoil: [2.5, 6], jerky: [0.12, 100],
      calico: [10, 25], manta: [6.5, 30], hardware: [26, 8], glass: [15, 8], notions: [7.5, 15], silk: [28, 4], tobacco: [5, 15] },
    animal: 30, repair: [8, 30],
  },
  santafe: {
    name: 'Santa Fe',
    sells: { provisions: 0.12 },
    buys: { calico: [12, 120], manta: [7.5, 140], hardware: [30, 40], glass: [19, 45], notions: [9, 80], silk: [38, 30], tobacco: [5.5, 60],
      hide_d: [1.75, 40], wolf: [1, 30], deer: [1.5, 30], ante: [0.5, 30], tongue_s: [0.8, 40], tallow: [0.12, 200], jerky: [0.15, 200], saltmeat: [0.08, 200],
      bearhide: [2.5, 5], bearoil: [3, 10], provisions: [0.09, 2000], powder: [0.8, 50], salt: [0.05, 200], cask: [2, 20], axle: [6, 4], wheel: [12, 4], grease: [1.5, 20], medicine: [6, 6] },
    animal: 28,
  },
};
const PRICE_FLOOR = 0.45;

// ---------- hunting ----------
// What a hunt can turn up in each region (weights), and what each animal yields.
const HUNT = {
  tall: { deer: 5, turkey: 3, none: 2 },
  mixed: { bison: 3, pronghorn: 3, deer: 1, wolf: 1, none: 2 },
  plains: { bison: 6, pronghorn: 2.5, wolf: 1, none: 1.5 },
  dry: { pronghorn: 4, bison: 2, wolf: 1, none: 3 },
  mountain: { deer: 4, bear: 1, turkey: 1, none: 4 },
  nm: { pronghorn: 2, deer: 2, none: 6 },
};
// Parts: id (an item), max units you could take, step for the slider, def: what is ticked to start.
const GAME = {
  bison: { name: 'buffalo', the: 'a young buffalo cow', powder: 2, parts: [
    { id: 'meat', label: 'Hump ribs, loin and boss', max: 320, step: 10, def: 40 },
    { id: 'tongue', label: 'Tongue', max: 1, step: 1, def: 1 },
    { id: 'hide_g', label: 'Hide', max: 1, step: 1, def: 0 },
    { id: 'tallow', label: 'Tallow', max: 30, step: 5, def: 0 },
  ] },
  wolf: { name: 'wolf', the: 'a big grey wolf', powder: 1, parts: [
    { id: 'wolf', label: 'Pelt', max: 1, step: 1, def: 1 },
    { id: 'meat', label: 'Meat (lean and stringy)', max: 30, step: 5, def: 0 },
  ] },
  pronghorn: { name: 'antelope', the: 'a pronghorn buck', powder: 1, parts: [
    { id: 'meat', label: 'Meat', max: 35, step: 5, def: 25 },
    { id: 'ante', label: 'Hide', max: 1, step: 1, def: 0 },
  ] },
  deer: { name: 'deer', the: 'a white-tailed deer', powder: 1, parts: [
    { id: 'meat', label: 'Venison', max: 60, step: 5, def: 30 },
    { id: 'deer', label: 'Skin', max: 1, step: 1, def: 1 },
  ] },
  turkey: { name: 'turkeys', the: 'two wild turkeys', powder: 1, parts: [
    { id: 'meat', label: 'Turkey', max: 24, step: 4, def: 24 },
  ] },
  bear: { name: 'bear', the: 'a grizzly bear', powder: 2, danger: true, parts: [
    { id: 'meat', label: 'Meat', max: 160, step: 10, def: 30 },
    { id: 'bearhide', label: 'Hide', max: 1, step: 1, def: 0 },
    { id: 'bearoil', label: 'Fat, rendered to oil', max: 5, step: 1, def: 2 },
  ] },
};

// ---------- the ledger ----------
// Notes collect in the ledger as you go. src 'elias' are Elias's own entries, 'field' are yours.
const NOTES = {
  // Elias's ledger: you have these from the start
  e_outfit: { src: 'elias', title: 'Outfitting', text: 'Independence, May 1842. Flour, bacon, coffee, sugar: two and a half pounds a man a day, and figure sixty days. Powder for hunting. Grease. A spare axle at least. Wendell says buy calicoes; Wendell sells calicoes.' },
  e_weight: { src: 'elias', title: 'On weight', text: 'Every pound in the wagon is a pound the mules pull eight hundred miles. Over the load and they wear down, and a worn team is slow, and slow is thirst. Light dear goods pay. Heavy cheap goods pay only if you have the beasts for them.' },
  e_jornada: { src: 'elias', title: 'The dry stretch', text: 'If you take the Cimarron road, fill every cask at the Arkansas. Sixty miles to the Lower Spring and not a drop between. The mules can go short. They cannot go without.' },
  e_meat: { src: 'elias', title: 'Meat', text: 'Fresh meat is gone in two days in this heat. Jerk it on lines along the wagon sheet, or salt it down. Take the tongue; the rest of the beast is mostly weight.' },
  e_customs: { src: 'elias', title: 'Santa Fe', text: 'The customs house lives on the trade and knows it. Have your manifest ready. Silk is looked at twice.' },
  // found on the trail
  f_grove: { src: 'field', title: 'Council Grove', text: 'A long belt of oak, walnut and hickory on the Neosho, and the last hardwood on the road. In 1825 commissioners met Osage chiefs here and signed for a road through their country. Caravans gather here, elect a captain, and cut timber for spare axles to sling under the wagon beds.' },
  f_diamond: { src: 'field', title: 'Diamond Spring', text: 'The "Diamond of the Plain": a clear spring that comes out of the ground a little past Council Grove. Everyone fills up here.' },
  f_chavez: { src: 'field', title: 'Chávez', text: 'In April 1843 a New Mexican trader, Antonio José Chávez, was coming east with a few men, furs and specie. A band of men claiming to ride for Texas caught him near here, robbed him and shot him. Some of them were hanged in St. Louis. That summer Santa Anna closed the northern customs houses to American traders. They opened again only this spring.' },
  f_rock: { src: 'field', title: 'Pawnee Rock', text: 'A sandstone bluff at the Big Bend of the Arkansas, cut all over with the names of people who passed. From the top you can see the whole river valley, which is why war parties used it, and why caravans are careful here.' },
  f_caches: { src: 'field', title: 'The Caches', text: 'In the winter of 1822 a trading party caught by snow on the Arkansas dug pits here and buried their goods, then went on to Taos for mules and came back for them in spring. The pits are still here. So is the choice: south across the Cimarron desert, or west up the river to Bent\'s Fort and the mountains.' },
  f_jornada: { src: 'field', title: 'The Jornada', text: 'Between the Arkansas and the Cimarron lies the dry stretch the Mexican traders call the jornada. Caravans cross it in two or three hard days, and travel by night when they can. Men have died of thirst within a few miles of the Lower Spring, having lost the trail in the sand hills.' },
  f_cimarron: { src: 'field', title: 'The Cimarron', text: 'A river that is sometimes there. In the dry months it sinks into its own bed, and a man with a spade can often find water two feet down where there is none on top.' },
  f_ears: { src: 'field', title: 'Rabbit Ears', text: 'Two rounded peaks that can be seen for days across the plain. Caravans steer by them, and nearby is McNees Crossing, where two young traders were killed in 1828.' },
  f_mound: { src: 'field', title: 'Wagon Mound', text: 'A butte shaped like a covered wagon with its team, the last great landmark before the settlements. From here it is grass, water and adobe all the way.' },
  f_bent: { src: 'field', title: "Bent's Fort", text: 'Adobe walls fourteen feet high around a square of rooms, storerooms and corrals, built by the Bent brothers and Ceran St. Vrain on the north bank of the Arkansas. Cheyenne, Arapaho, trappers, Mexican traders and caravans all trade here. Everything costs a great deal, because everything came eight hundred miles.' },
  f_raton: { src: 'field', title: 'Raton Pass', text: 'The mountain road into New Mexico. It is longer than the Cimarron road and very hard on wagons, but it has water and grass the whole way, and few raiders.' },
  f_junta: { src: 'field', title: 'La Junta', text: 'Where the Mora and the Sapello meet, and where the Cimarron road and the mountain road become one again. The first New Mexican herders and farms are near.' },
  f_vegas: { src: 'field', title: 'Las Vegas', text: 'A new town on the Gallinas, granted to settlers in 1835: an adobe plaza, fields along the river and sheep on the hills. The first New Mexican town on the road.' },
  f_pecos: { src: 'field', title: 'Pecos', text: 'The great pueblo and its mission church stand nearly empty. The last families of Pecos left in 1838 to live with their kin at Jemez. The road goes on through Glorieta Pass to Santa Fe.' },
  f_entry: { src: 'field', title: 'The entrance', text: 'Before Santa Fe the teamsters wash, shave, put on clean shirts and tie new crackers on their whips, so they can come down the street into the plaza in style. The whole town turns out: "¡Los americanos! ¡La entrada de la caravana!"' },
  f_cibolero: { src: 'field', title: 'Ciboleros', text: 'New Mexican buffalo hunters ride out onto the plains every autumn with lances, carretas and pack mules, and come home with dried meat for the winter. They know the plains as well as anyone.' },
  // the search for Elias
  c_rock: { src: 'field', title: 'A name on the rock', text: 'Cut into Pawnee Rock: E. MARSH 1842. Below it, newer and shallower: E.M. 43, and an arrow pointing west. Elias came back east in 1843, then. And went west again.' },
  c_grave: { src: 'field', title: 'A grave at Upper Spring', text: 'A board at Upper Spring: E. M——. For a long minute you could not read the rest. EZRA MOTT, OF BOONSLICK, 1843. Not him.' },
  c_bent: { src: 'field', title: 'The clerk at the fort', text: 'A clerk at Bent\'s Fort remembers Elias: in the fall of 1843 he came through with a light wagon of goods he had bought cheap from a party turned back by the closing of the ports. He was going south over the pass, not east. He asked whether a man could become a Mexican citizen.' },
  c_vegas: { src: 'field', title: 'A word in Las Vegas', text: 'At the plaza in Las Vegas a woman selling cheese heard your name and laughed: "Marsh? Elías? He has a store in Santa Fe, by the parroquia. He married one of the Ortega girls." She would not believe he had written no letters.' },
  c_tomas: { src: 'field', title: 'Tomás has heard', text: 'Tomás says there is an American in Santa Fe called Elías who keeps a small store near the parish church and has taken Mexican papers. He did not know the surname. He did not want to raise your hopes.' },
};

const API = { START, START_MONEY, NOTE, FOOD_PER_PERSON, WATER_PER_PERSON, CASK_GAL, WATER_LB, ITEMS, TEAMS, WAGONS, HANDS, NODES, EDGES, MARKETS, PRICE_FLOOR, HUNT, GAME, NOTES };
if (typeof module === 'object' && module.exports) module.exports = API;
else root.WBData = API;
})(typeof window !== 'undefined' ? window : globalThis);
