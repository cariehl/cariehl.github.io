// Thoughts change mood for a while. stack is how many copies count at once.
export const THOUGHTS = [
  { id: 'ate_raw', text: 'Ate raw food', mood: -4, hours: 6, stack: 2 },
  { id: 'ate_cooked', text: 'Ate a cooked meal', mood: 3, hours: 6, stack: 1 },
  { id: 'ate_fine', text: 'Ate a hearty stew', mood: 6, hours: 8, stack: 1 },
  { id: 'ate_spoiled', text: 'Ate food that had turned', mood: -8, hours: 8, stack: 2 },
  { id: 'slept_ground', text: 'Slept on the bare ground', mood: -5, hours: 14, stack: 1 },
  { id: 'slept_bed', text: 'Slept in a proper bed', mood: 3, hours: 14, stack: 1 },
  { id: 'slept_cold', text: 'Shivered all night', mood: -7, hours: 14, stack: 1 },
  { id: 'slept_rain', text: 'Slept in the rain', mood: -6, hours: 14, stack: 1 },
  { id: 'slept_indoors', text: 'Slept under a roof', mood: 4, hours: 14, stack: 1 },
  { id: 'fireside', text: 'Warmed by the fire', mood: 3, hours: 3, stack: 1 },
  { id: 'saw_death', text: 'Saw someone die', mood: -18, hours: 96, stack: 2 },
  { id: 'friend_died', text: 'Lost a companion', mood: -30, hours: 240, stack: 3 },
  { id: 'wounded', text: 'Was hurt', mood: -6, hours: 24, stack: 3 },
  { id: 'treated', text: 'Had wounds tended', mood: 3, hours: 12, stack: 1 },
  { id: 'butchered', text: 'Butchered an animal', mood: -2, hours: 6, stack: 2, squeamish: -8 },
  { id: 'catharsis', text: 'Let it all out', mood: 15, hours: 36, stack: 1 },
  { id: 'killed_animal', text: 'Made a kill', mood: 2, hours: 8, stack: 2 },
  { id: 'vomited', text: 'Threw up', mood: -5, hours: 6, stack: 2 },
  { id: 'built_home', text: 'Built something lasting', mood: 4, hours: 24, stack: 2 },
  { id: 'new_arrival', text: 'Someone new joined us', mood: 5, hours: 48, stack: 1 },
  { id: 'harvest', text: 'Brought in a harvest', mood: 6, hours: 48, stack: 1 },
  { id: 'attacked', text: 'Was attacked by an animal', mood: -10, hours: 48, stack: 2 },
];

// Ongoing moods derived each hour from the settler's state.
export const STATE_MOODS = [
  { id: 'hungry', text: 'Hungry', test: (s) => s.hunger > 0.55 && s.hunger <= 0.85, mood: -5 },
  { id: 'ravenous', text: 'Ravenous', test: (s) => s.hunger > 0.85, mood: -12 },
  { id: 'starving', text: 'Starving', test: (s) => s.starving, mood: -25 },
  { id: 'thirsty', text: 'Thirsty', test: (s) => s.thirst > 0.5 && s.thirst <= 0.85, mood: -6 },
  { id: 'parched', text: 'Parched', test: (s) => s.thirst > 0.85, mood: -15 },
  { id: 'tired', text: 'Tired', test: (s) => s.sleepiness > 0.75 && s.sleepiness <= 0.9, mood: -4 },
  { id: 'exhausted', text: 'Exhausted', test: (s) => s.sleepiness > 0.9, mood: -10 },
  { id: 'cold', text: 'Cold', test: (s) => s.cold > 0.35 && s.cold <= 0.7, mood: -6 },
  { id: 'freezing', text: 'Freezing', test: (s) => s.cold > 0.7, mood: -15 },
  { id: 'hot', text: 'Too hot', test: (s) => s.hot > 0.5, mood: -5 },
  { id: 'soaked', text: 'Soaked through', test: (s) => s.wet > 0.6, mood: -4 },
  { id: 'pain', text: 'In pain', test: (s) => s.pain > 0.15 && s.pain <= 0.45, mood: -8 },
  { id: 'agony', text: 'In agony', test: (s) => s.pain > 0.45, mood: -20 },
  { id: 'sick', text: 'Feeling sick', test: (s) => s.sick, mood: -6 },
  { id: 'well_fed', text: 'Well fed', test: (s) => s.hunger < 0.15, mood: 3 },
  { id: 'comfortable', text: 'Comfortable', test: (s) => s.cold < 0.1 && s.hot < 0.1 && s.wet < 0.2, mood: 2 },
];

export const TRAITS = [
  { id: 'hardy', name: 'Hardy', desc: 'Shrugs off pain and illness.', mods: { pain: 0.7, immunity: 1.25 } },
  { id: 'frail', name: 'Frail', desc: 'Bleeds easily and heals slowly.', mods: { heal: 0.7, hp: 0.85 } },
  { id: 'optimist', name: 'Optimist', desc: 'Sees the good in things.', mods: { mood: 6 } },
  { id: 'pessimist', name: 'Pessimist', desc: 'Expects the worst.', mods: { mood: -6 } },
  { id: 'night_owl', name: 'Night owl', desc: 'Sleeps late and comes alive at night.', mods: { circadian: 5 } },
  { id: 'early_riser', name: 'Early riser', desc: 'Up before dawn.', mods: { circadian: -2 } },
  { id: 'big_appetite', name: 'Big appetite', desc: 'Always thinking about the next meal.', mods: { appetite: 1.25 } },
  { id: 'cold_tolerant', name: 'Cold tolerant', desc: 'Grew up somewhere colder.', mods: { cold: 0.25 } },
  { id: 'strong', name: 'Strong back', desc: 'Carries more and swings harder.', mods: { carry: 1.3, strength: 1.2 } },
  { id: 'squeamish', name: 'Squeamish', desc: 'Hates blood.', mods: { squeamish: 1 } },
  { id: 'quick_learner', name: 'Quick learner', desc: 'Picks up skills fast.', mods: { learn: 1.4 } },
  { id: 'nervous', name: 'Nervous', desc: 'Breaks under stress sooner.', mods: { stress: 1.4 } },
  { id: 'steady', name: 'Steady', desc: 'Hard to rattle.', mods: { stress: 0.7 } },
  { id: 'keen_eyed', name: 'Keen-eyed', desc: 'Sees game from far off.', mods: { sight: 1.3 } },
];

export const SKILLS = [
  { id: 'woodcutting', name: 'Woodcutting' }, { id: 'mining', name: 'Mining' }, { id: 'foraging', name: 'Foraging' },
  { id: 'hunting', name: 'Hunting' }, { id: 'butchery', name: 'Butchery' }, { id: 'cooking', name: 'Cooking' },
  { id: 'crafting', name: 'Crafting' }, { id: 'construction', name: 'Construction' }, { id: 'farming', name: 'Farming' },
  { id: 'medicine', name: 'Medicine' }, { id: 'melee', name: 'Fighting' }, { id: 'fishing', name: 'Fishing' },
];

// Labors are the work types the player prioritises per settler.
export const LABORS = [
  { id: 'doctor', name: 'Doctor', skill: 'medicine' },
  { id: 'firefight', name: 'Firefight' },
  { id: 'cook', name: 'Cook', skill: 'cooking' },
  { id: 'hunt', name: 'Hunt', skill: 'hunting' },
  { id: 'build', name: 'Build', skill: 'construction' },
  { id: 'farm', name: 'Farm', skill: 'farming' },
  { id: 'forage', name: 'Forage', skill: 'foraging' },
  { id: 'chop', name: 'Woodcut', skill: 'woodcutting' },
  { id: 'mine', name: 'Mine', skill: 'mining' },
  { id: 'craft', name: 'Craft', skill: 'crafting' },
  { id: 'fish', name: 'Fish', skill: 'fishing' },
  { id: 'haul', name: 'Haul' },
];
