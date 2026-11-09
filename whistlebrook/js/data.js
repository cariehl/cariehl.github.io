// Everything you can build, the townsfolk's names and sayings, and the town's milestones.

export const MAP = 24;          // tiles on a side
export const DAY = 240;         // seconds of game time in a day
export const START_COINS = 300;

// kind: home (people live there), place (people visit), station, deco.
// model: the Voxel Studio file in assets/. idle and night: clips that loop by day and by night.
// poke: the clip that plays when you click it. walk: people can walk across it.
export const BUILDINGS = {
  house:      { name: 'House', model: 'house', cost: 40, kind: 'home', residents: 2, idle: 'Idle', night: 'Night', poke: 'Hello', tip: 'Two townsfolk live here.' },
  cottage:    { name: 'Cottage', model: 'cottage', cost: 55, kind: 'home', residents: 3, idle: 'Idle', night: 'Night', poke: 'Hello', tip: 'A thatched cottage for three.' },
  bakery:     { name: 'Bakery', model: 'bakery', cost: 80, kind: 'place', label: 'the bakery', idle: 'Idle', night: 'Night', poke: 'Hello', tip: 'Everyone wants a warm loaf.' },
  toyshop:    { name: 'Toy Shop', model: 'toy-shop', cost: 90, kind: 'place', label: 'the toy shop', idle: 'Idle', night: 'Night', poke: 'Hello', tip: 'Spinning pinwheel included.' },
  park:       { name: 'Park', model: 'park', cost: 60, kind: 'place', label: 'the park', idle: 'Idle', night: 'Night', walk: true, tip: 'A fountain and flower beds. Folk can stroll through.' },
  windmill:   { name: 'Windmill', model: 'windmill', cost: 120, kind: 'place', label: 'the mill', idle: 'Turn', night: 'Night', poke: 'Hello', tip: 'Folk go to work here.' },
  station:    { name: 'Station', model: 'station', cost: 100, kind: 'station', night: 'Night', poke: 'Hello', walk: true, tip: 'Put it next to the track. Trains stop beside it.' },
  watertower: { name: 'Water Tower', model: 'water-tower', cost: 50, kind: 'deco', poke: 'Hello', tip: 'Every railway needs one.' },
  lamp:       { name: 'Lamp Post', model: 'lamp', cost: 10, kind: 'deco', night: 'Night', walk: true, tip: 'Lights up at night.' },
  tree:       { name: 'Oak', model: 'tree', cost: 5, kind: 'deco', poke: 'Hello', tip: 'Something lives in it.' },
  pine:       { name: 'Pine', model: 'pine', cost: 5, kind: 'deco', poke: 'Hello', tip: 'Evergreen.' },
};

export const TRACK_COST = 2;
export const TRAIN_COST = 150;
export const TRAIN_COLORS = ['red', 'blue', 'green'];
export const FOLK_LOOKS = ['mabel', 'otis', 'wren', 'basil', 'poppy', 'hamish'];

export const ALL_MODELS = [
  'track-straight', 'track-curve', 'track-end',
  ...TRAIN_COLORS.flatMap(c => [`loco-${c}`, `coach-${c}`]),
  ...new Set(Object.values(BUILDINGS).map(b => b.model)),
  ...FOLK_LOOKS.map(f => `folk-${f}`),
];

export const FIRST_NAMES = ['Mabel', 'Otis', 'Wren', 'Basil', 'Poppy', 'Hamish', 'Ada', 'Clem', 'Tilly', 'Rufus', 'Nell', 'Percy', 'Ivy', 'Bram', 'Hattie', 'Wilf',
  'Dot', 'Ezra', 'Maud', 'Fen', 'Lottie', 'Arlo', 'Edie', 'Gus', 'Pip', 'Rosa', 'Teddy', 'Bea', 'Milo', 'Opal', 'Sid', 'Juno'];
export const LAST_NAMES = ['Tuttle', 'Pennywhistle', 'Barrow', 'Crumb', 'Hollins', 'Muddle', 'Thistle', 'Copper', 'Ashby', 'Wicket', 'Bramble', 'Puddle',
  'Fernsby', 'Larkin', 'Dimble', 'Hobb', 'Quill', 'Sprocket', 'Gable', 'Merriweather'];
export const STREETS = ['Brook Lane', 'Whistle Row', 'Mill Road', 'Cinder Path', 'Pudding Street', 'Signal Hill', 'Clover Close', 'Bell Yard'];

export const SAY = {
  hello: ['Hello there!', 'Lovely day!', 'Oh! You startled me.', 'Mind the trains!', 'Have you tried the bread?', 'Toot toot!', 'Nice hat. Oh, it\'s mine.', 'What a town!'],
  night: ['Past my bedtime!', 'Look at the stars.', 'Shh, the town is sleeping.'],
  noRoute: ['How do I get there?', 'We need a station!', 'Too far to walk...'],
  longWalk: ['What a long walk!', 'My poor feet.'],
  fare: ['Two stops, please!', 'Smooth ride!', 'Here at last!', 'Wheee!', 'Lovely train!'],
  waiting: ['When is the train?', 'Is it late?', 'I can hear it coming...'],
};

// Milestones, checked as you play. test(stats) => true when reached. reward: coins.
export const MILESTONES = [
  { id: 'track', title: 'First steps', text: 'Lay 12 pieces of track.', reward: 30, test: s => s.trackLaid >= 12 },
  { id: 'station', title: 'All aboard', text: 'Build a station next to the track.', reward: 40, test: s => s.stations >= 1 },
  { id: 'train', title: 'Toot toot', text: 'Put a train on the track.', reward: 40, test: s => s.trains >= 1 },
  { id: 'rider', title: 'First fare', text: 'Carry a passenger between two stations.', reward: 50, test: s => s.riders >= 1 },
  { id: 'homes', title: 'Neighbours', text: 'Have 6 houses or cottages.', reward: 60, test: s => s.homes >= 6 },
  { id: 'switch', title: 'Points', text: 'Throw a switch on a junction.', reward: 30, test: s => s.switches >= 1 },
  { id: 'mill', title: 'Grist', text: 'Build a windmill.', reward: 50, test: s => s.mills >= 1 },
  { id: 'riders25', title: 'Busy line', text: 'Carry 25 passengers.', reward: 100, test: s => s.riders >= 25 },
  { id: 'pop', title: 'Village', text: 'Reach 30 townsfolk.', reward: 120, test: s => s.population >= 30 },
  { id: 'trains2', title: 'Timetable', text: 'Run 3 trains at once.', reward: 120, test: s => s.trains >= 3 },
  { id: 'lamps', title: 'Evening glow', text: 'Light the town with 8 lamp posts.', reward: 60, test: s => s.lamps >= 8 },
  { id: 'riders100', title: 'Whistlebrook Junction', text: 'Carry 100 passengers.', reward: 300, test: s => s.riders >= 100 },
];
