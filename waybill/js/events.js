// Waybill: everything that can happen on the road. Each event has a text and a few choices.
// kind: 'day' events are drawn at random each morning (filtered by region and `when`);
// 'arrive_<node>' events run when you reach a place; the rest are opened by the simulation.
// A choice's do() changes the state and returns the journal line, or { text, next } to chain on
// to another event ({ event: id }) or to the butchering screen ({ butcher: game }).
(function (root) {
'use strict';
function makeEvents(H) {
const { count, add, take, chance, between, rand, note, hasHand, people, ITEMS, TEAMS, HANDS, D } = H;

// Spend half-days. Events are answered in the morning, so this comes out of today.
function spend(S, halves) {
  const room = 2 - S.half;
  const now = Math.min(room, halves);
  S.half += now;
  S.lost += halves - now;
}
const you = S => S.party[0];
const hand = S => S.hand ? S.party.find(p => p.id === S.hand && p.hp > 0) : null;
const handName = S => (hand(S) || {}).name || '';
const animal = (S, n) => n === 1 ? TEAMS[S.team.kind].one : TEAMS[S.team.kind].many;
const cloth = S => count(S, 'calico') + count(S, 'manta') + count(S, 'notions');
function spoilCloth(S, frac) {
  const lost = [];
  for (const id of ['calico', 'manta', 'notions', 'silk']) {
    const n = Math.round(count(S, id) * frac);
    if (n > 0) { take(S, id, n); lost.push(`${n} ${ITEMS[id].unit}${n > 1 ? 's' : ''} of ${ITEMS[id].name.toLowerCase()}`); S.stats.lost += n * ITEMS[id].price; }
  }
  return lost.length ? lost.join(', ') : '';
}
function sickOne(S) {
  const ok = people(S).filter(p => !p.sick);
  if (!ok.length) return null;
  return ok[Math.floor(rand(S) * ok.length)];
}
const who = p => p.id === 'you' ? 'You' : p.name;
// New animals are fresh, so they lift the team's average condition.
function addAnimals(S, k, cond) {
  const n = S.team.n;
  S.team.cond = (S.team.cond * n + (cond || 90) * k) / (n + k);
  S.team.n = n + k;
}

const E = [];

// ===================================================================== mechanical
E.push({
  id: 'breakdown', title: 'Broken down', scene: 'broken',
  text(S, H, c) {
    const what = { axle: 'With a crack like a rifle shot the rear axletree splits, and the wagon settles onto its hounds in the ruts.', wheel: 'A wheel goes into a hole hidden in the grass. Three spokes snap and the felloe splits; the tyre rolls off on its own.', tongue: 'The tongue snaps where it joins the hounds, and the team walks on a few steps without the wagon.' }[c.part];
    return what + ' Nothing goes further until it is fixed.';
  },
  choices(S, H, c) {
    const spare = c.part === 'wheel' ? 'wheel' : 'axle';
    const have = count(S, spare);
    return [
      { label: `Fit the spare ${c.part === 'wheel' ? 'wheel' : 'axletree'}`, hint: have ? `Uses 1 of ${have}. Half a day.` : `You have no spare ${spare === 'wheel' ? 'wheel' : 'axletree'}.`, off: have ? '' : 'none',
        do(S) { take(S, spare, 1); spend(S, 1); S.wagon.cond = Math.min(100, S.wagon.cond + 8); return `Jacked up the wagon and fitted the spare ${c.part === 'wheel' ? 'wheel' : (c.part === 'tongue' ? 'timber as a new tongue' : 'axletree')}. Lost half a day.`; } },
      { label: `Let ${handName(S)} mend it`, hide: !hasHand(S, 'repair'), hint: 'He swears he can splice it. Half a day.',
        do(S) { spend(S, 1); S.wagon.cond = Math.max(5, S.wagon.cond - 4); return 'Anton spliced and lashed and pinned it with rawhide and green wood, muttering in German, and pronounced it good for Santa Fe. Lost half a day.'; } },
      { label: 'Buy a spare from another wagon', hide: !S.caravan, hint: '$15 to a trader in the caravan. Half a day.', off: S.money >= 15 ? '' : 'money',
        do(S) { S.money -= 15; spend(S, 1); return 'Another trader sold you his spare for fifteen dollars and helped fit it. Lost half a day.'; } },
      { label: 'Patch it together as best you can', hint: 'A full day, and the wagon is weaker after.',
        do(S) { spend(S, 2); S.wagon.cond = Math.max(5, S.wagon.cond - 15); return 'Spent the day binding the break with rawhide and chain. It holds, more or less.'; } },
    ];
  },
});

E.push({
  id: 'stranded', title: 'Stranded', scene: 'broken',
  setup(S, H, c) {
    const t = TEAMS[S.team.kind];
    c.need = t.min - S.team.n;
    c.price = Math.round(t.price * 2);
  },
  text(S, H, c) {
    return `You no longer have enough ${animal(S, 2)} to move the wagon. You need ${c.need} more. You wait beside the trail, and on the second day dust rises behind you: a small party of traders, coming on.`;
  },
  choices(S, H, c) {
    const cost = c.need * c.price;
    return [
      { label: `Buy ${c.need} ${animal(S, c.need)} from them`, hint: `$${cost}, twice what they cost in Missouri. Two days lost.`, off: S.money >= cost ? '' : 'money',
        do(S) { S.money -= cost; addAnimals(S, c.need); spend(S, 4); return `Paid $${cost} for ${c.need} ${animal(S, c.need)}. Robbery, but it is that or walk.`; } },
      { label: 'Trade them goods for the animals', hint: 'Half your trade goods, by value. Two days lost.', off: H.goodsWeight(S) > 0 ? '' : 'none',
        do(S) { for (const id of ['calico', 'manta', 'hardware', 'glass', 'notions', 'silk', 'tobacco']) take(S, id, Math.ceil(count(S, id) / 2)); addAnimals(S, c.need); spend(S, 4); return `Gave up half the cargo for ${c.need} ${animal(S, c.need)}.`; } },
      { label: 'Abandon the wagon', hint: 'Ride home with them. The journey ends here.',
        do(S) { S.over = { kind: 'stranded' }; return 'You left the wagon on the prairie and rode back east with the traders.'; } },
    ];
  },
});

E.push({
  id: 'raid', title: 'Hoofbeats in the dark', scene: 'night',
  setup(S, H, c) {
    const dbl = S.watch === 'double';
    c.lost = Math.min(S.team.n, dbl ? between(S, 0, 1) : between(S, 1, S.team.kind === 'oxen' ? 1 : 2));
    S.team.n -= c.lost;
    S.stats.lost += c.lost * TEAMS[S.team.kind].price;
    S.flags.wary = S.day + 5;
  },
  text(S, H, c) {
    if (!c.lost) return 'In the small hours the guard shouts. Riders came in low along the creek to stampede the stock, but the double watch had the animals close-herded and fired over their heads. The riders wheeled off into the dark. Nothing lost.';
    return `In the small hours a rush of hooves and yelling: riders swept through the herd and were gone before anyone found a rifle. ${c.lost} ${animal(S, c.lost)} went with them. ${S.team.n} left. At dawn the trail of the stolen stock is plain in the grass, heading south.`;
  },
  choices(S, H, c) {
    if (!c.lost) return [{ label: 'Go on', do: () => '' }];
    const odds = 0.35 + (hasHand(S, 'hunt') ? 0.2 : 0) + (hasHand(S, 'trade') ? 0.1 : 0);
    return [
      { label: 'Follow the trail', hint: `Lose the day. Maybe ${Math.round(odds * 100)}% you get them back.`,
        do(S) { spend(S, 2); if (chance(S, odds)) { S.team.n += c.lost; return `Followed the trail all day and found the stolen ${animal(S, c.lost)} grazing in a draw, dropped by riders who had moved faster without them.`; } return 'Followed the trail all day until it vanished on hard ground. Came back with nothing.'; } },
      { label: 'Let them go', hint: 'Keep moving.', do: () => 'Let them go. The rest of the team is worth more than the day.' },
    ];
  },
});

E.push({
  id: 'wolves', title: 'Wolves', scene: 'night',
  text(S) {
    return `After dark the wolves that trail the buffalo herds come in close. You hear them circling just past the firelight, then a scuffle at the wagon: they are after the ${count(S, 'meat')} lb of fresh meat hanging from the bows.`;
  },
  choices(S) {
    const odds = hasHand(S, 'hunt') ? 0.85 : 0.6;
    return [
      { label: 'Take the rifle and shoot one', hint: `1 lb of powder. About ${Math.round(odds * 100)}% to hit in this light.`, off: count(S, 'powder') >= 1 ? '' : 'powder',
        do(S) {
          take(S, 'powder', 1);
          if (chance(S, odds)) { const m = Math.round(count(S, 'meat') * 0.15); take(S, 'meat', m); return { text: `One shot, and a big grey wolf dropped at the edge of the light. The rest scattered${m ? `, but not before they tore down ${m} lb of meat` : ''}.`, next: { butcher: 'wolf', msg: 'Skinned the wolf by firelight.' } }; }
          const m = Math.round(count(S, 'meat') / 2); take(S, 'meat', m); return `Fired at a shadow and hit nothing. The wolves ran off with ${m} lb of meat.`;
        } },
      { label: 'Drive them off with firebrands', hint: 'They will get some of it.',
        do(S) { const m = Math.round(count(S, 'meat') * 0.4); take(S, 'meat', m); return `Waved burning sticks and shouted until they went. They got ${m} lb of meat.`; } },
      { label: 'Let them have it', hint: 'Lose the fresh meat. Keep your powder and your sleep.',
        do(S) { const m = count(S, 'meat'); take(S, 'meat', m); return `Lay listening to them quarrel over ${m} lb of meat.`; } },
    ];
  },
});

// ===================================================================== places
E.push({
  id: 'arrive_grove', title: 'Council Grove', scene: 'grove',
  setup(S) { note(S, 'f_grove'); },
  text(S) {
    return 'A mile-wide belt of oak, walnut and hickory along the Neosho, the first real shade since Missouri and the last timber of the trip. Thirty-odd wagons are already camped under the trees. Tonight the traders will meet and elect a captain, and those who join will travel together to Santa Fe, standing guard in turns.\n\nElias\'s ledger, in his cramped hand: "Cut two axles here. Hickory if you can find it."';
  },
  choices(S) {
    return [
      { label: 'Join the caravan', hint: 'Safer at night and help with breakdowns, but you go at the caravan\'s pace (no faster than 15 miles a day) and it will not wait for you a whole day.',
        do(S) { S.caravan = true; return 'Put your name down with the caravan. A Missouri trader with a booming voice was elected captain.'; } },
      { label: 'Travel on your own', hint: 'Go at your own pace and stop when you like. Nobody else watches your stock.',
        do: () => 'Thanked them and kept to yourself. You will go faster alone, and alone is how you will be.' },
    ];
  },
});
E.push({
  id: 'arrive_diamond', title: 'Diamond Spring', scene: 'spring',
  setup(S) { note(S, 'f_diamond'); },
  text: () => 'Cold, clear water wells up out of the grass and runs off in a little stream. Every wagon stops here. Past this point the creeks grow further apart, and the trees thin to lines along their banks.',
  choices: () => [{ label: 'Drink, fill the casks, go on', do(S) { S.water = H.waterCap(S); return 'Filled every cask at Diamond Spring.'; } }],
});
E.push({
  id: 'arrive_ltark', title: 'Little Arkansas', scene: 'creek',
  setup(S) { note(S, 'f_chavez'); },
  text(S) {
    let t = 'Steep banks and a muddy crossing. A few days back, at a creek the teamsters now call by a dead man\'s name, the captain pointed out where a New Mexican trader named Chávez was robbed and murdered last spring by men calling themselves Texans. It is part of why the ports were closed all last year.';
    if (hasHand(S, 'trade')) t += '\n\nTomás crossed himself when you passed it and said nothing for the rest of the day.';
    return t;
  },
  choices: () => [{ label: 'Cross and go on', do: () => '' }],
});
E.push({
  id: 'arrive_rock', title: 'Pawnee Rock', scene: 'rock',
  setup(S) { note(S, 'f_rock'); note(S, 'c_rock'); },
  text(S) {
    let t = 'A red sandstone bluff rising out of the plain at the Big Bend of the Arkansas, its face cut all over with names and dates. You climb it looking for one in particular, and you find it: E. MARSH 1842.\n\nAnd below it, shallower and newer: E.M. 43, with an arrow pointing west.\n\nElias came back this way, then, after the letters stopped. And went west again.';
    if (hasHand(S, 'hunt')) t += '\n\nHiram looks at the carving a long time. "Your brother didn\'t strike me as a man who gives up on a place," he says.';
    return t;
  },
  choices: () => [
    { label: 'Cut your own name under his', hint: 'Half a day.', do(S) { spend(S, 1); return `Cut ${S.name.toUpperCase()} 1844 into the rock under your brother's name.`; } },
    { label: 'Go on', do: () => '' },
  ],
});
E.push({
  id: 'arrive_pfork', title: 'Pawnee Fork', scene: 'creek',
  setup(S, H, c) { c.flood = chance(S, 0.5); },
  text(S, H, c) {
    return c.flood
      ? 'Rain upstream. The Fork is running bank-full, brown and fast, carrying whole trees. The banks are steep and slick. Some of the wagons ahead are waiting; one has gone over and is being cut loose.'
      : 'The Fork is low and the crossing is easy: a short steep pitch down, a gravel bottom, and a pull up the far side.';
  },
  choices(S, H, c) {
    if (!c.flood) return [{ label: 'Cross', do: () => 'Crossed Pawnee Fork without trouble.' }];
    return [
      { label: 'Ford it now', hint: 'Risk soaking the cloth or losing an animal.',
        do(S) {
          const r = rand(S);
          if (r < 0.35) { const lost = spoilCloth(S, 0.2); return `Water came over the wagon bed midstream. Everything rode out on the far side, but ${lost || 'the provisions'} came out soaked and ruined.`; }
          if (r < 0.5 && S.team.n > 0) { S.team.n--; return `The current knocked one of the ${animal(S, 2)} off its feet and it drowned in the harness. You got the wagon over without it.`; }
          return 'Whipped the team in and they plunged across, the water to their shoulders. Made it.';
        } },
      { label: 'Wait for the water to drop', hint: 'Lose a day.', do(S) { spend(S, 2); return 'Waited a day on the bank. By the next morning the Fork had dropped two feet and you crossed easily.'; } },
      { label: 'Raise the wagon bed and float the goods', hint: 'Half a day. Safe.', do(S) { spend(S, 1); return 'Blocked the wagon bed up on the bolsters and walked the team across slowly. Wet to the waist, but the goods stayed dry.'; } },
    ];
  },
});
E.push({
  id: 'arrive_caches', title: 'The Caches', scene: 'river',
  setup(S) { note(S, 'f_caches'); },
  text(S) {
    return 'Old pits in the ground beside the Arkansas, where a trading party snowed in back in \'22 buried their goods. This is where the road divides.\n\nThe Cimarron road turns south across the river: about 400 miles to Santa Fe, but it begins with the Jornada, 60 miles with no water at all, and then runs up a river that is mostly sand, through Comanche and Kiowa country.\n\nThe Mountain road follows the Arkansas west 140 miles to Bent\'s Fort, then climbs over Raton Pass: about 445 miles, water and grass all the way, few raiders, but the pass is brutal on wagons and stock.';
  },
  choices(S) {
    const cap = H.waterCap(S);
    return [
      { label: 'Take the Cimarron road', hint: `Shorter and dry. You carry ${S.water}/${cap} gallons, and the team needs about ${people(S).length + S.team.n * TEAMS[S.team.kind].drink} a dry day. Fill your casks first.`,
        do(S) { S.water = cap; S.to = 'lspring'; S.legMi = 0; note(S, 'f_jornada'); return 'Filled every cask from the Arkansas and turned south onto the Cimarron road.'; } },
      { label: 'Take the Mountain road', hint: 'Longer and wet, by Bent\'s Fort and Raton Pass.',
        do(S) { S.to = 'bent'; S.legMi = 0; if (S.caravan) return 'Most of the caravan turns south for the Cimarron. You go on up the river with four wagons bound for Bent\'s Fort.'; return 'Kept on up the Arkansas, toward the mountains.'; } },
      { label: 'Decide in the morning', do: () => '' },
    ];
  },
});
E.push({
  id: 'arrive_lspring', title: 'Lower Spring', scene: 'spring',
  text(S) {
    return S.stats.dry >= 3
      ? 'A green hollow in the sand hills, and in it, water. The mules smell it a mile off and nothing will hold them. You let them run. The Jornada is behind you.'
      : 'Water seeping up in a green hollow of the sand hills: the Lower Spring of the Cimarron. The Jornada is behind you.';
  },
  choices: () => [{ label: 'Rest and fill the casks', do(S) { S.water = H.waterCap(S); return 'Filled the casks at Lower Spring.'; } }],
});
E.push({ id: 'arrive_mspring', title: 'Middle Spring', scene: 'spring', text: () => 'A good spring a little off the riverbed, with grass around it. Pronghorn watch you from the ridges.', choices: () => [{ label: 'Fill the casks and go on', do(S) { S.water = H.waterCap(S); return ''; } }] });
E.push({
  id: 'arrive_uspring', title: 'Upper Spring', scene: 'spring',
  setup(S) { note(S, 'c_grave'); },
  text: () => 'A spring in a rocky ravine, the last sure water on the Cimarron. Near it stands a weathered board over a mound of stones, and on the board, cut with a knife: E. M——.\n\nYou stand there a long minute before you can make yourself read the rest.\n\nEZRA MOTT. OF BOONSLICK. 1843.\n\nNot him.',
  choices: () => [{ label: 'Fill the casks and go on', do(S) { S.water = H.waterCap(S); return 'Filled the casks at Upper Spring.'; } }],
});
E.push({ id: 'arrive_rabbit', title: 'Rabbit Ears', scene: 'ears', setup(S) { note(S, 'f_ears'); }, text: () => 'The two round peaks you have been steering by for days are close now, purple in the evening. The grass is better here, and the country is beginning to rise toward the mountains you cannot yet see.', choices: () => [{ label: 'Go on', do: () => '' }] });
E.push({ id: 'arrive_mound', title: 'Wagon Mound', scene: 'mound', setup(S) { note(S, 'f_mound'); }, text: () => 'A butte shaped exactly like a covered wagon drawn by a team, standing alone on the plain. Beyond it, for the first time, the mountains: a dark blue wall to the west. The teamsters are singing tonight.', choices: () => [{ label: 'Go on', do: () => '' }] });
E.push({
  id: 'arrive_bent', title: "Bent's Fort", scene: 'fort',
  setup(S) { note(S, 'f_bent'); note(S, 'c_bent'); },
  text: () => 'Adobe walls fourteen feet high, round towers at the corners, a flag over the gate. Inside: a square of storerooms and shops, a blacksmith, a billiard table carried all the way from St. Louis, Cheyenne women trading at the counter and trappers asleep in the shade.\n\nThe clerk squints at your brother\'s ledger. "Marsh. Fall of \'43. Came through with a light wagon of goods he\'d bought off a party turned back when the ports shut. Wasn\'t going east, I can tell you that. Asked me if a man could turn Mexican, and how."\n\nThe fort buys hides, pelts and tongues, and sells everything at mountain prices.',
  choices: () => [{ label: 'Go in', do: () => '' }],
});
E.push({ id: 'arrive_purg', title: 'The Purgatoire', scene: 'mountain', text: () => 'Cottonwoods and clear water in a canyon under the mountains. Ahead the road climbs into Raton Pass: rocks to be levered aside, washouts to be filled, and grades so steep the wagons will be hauled up with doubled teams. Look to your wheels before you start.', choices: () => [{ label: 'Make ready', do: () => '' }] });
E.push({
  id: 'arrive_raton', title: 'Raton Pass', scene: 'pass',
  setup(S) { note(S, 'f_raton'); },
  text: () => 'The summit. Pines, cold wind, and New Mexico laid out below to the south, all mesas and distance. Now the wagon has to go down the other side, which is steeper than the way up.',
  choices: () => [
    { label: 'Chain the wheels and lower it slowly', hint: 'Half a day. Safe.', do(S) { spend(S, 1); return 'Chained the rear wheels and let the wagon down on ropes snubbed round the pines. Slow and safe.'; } },
    { label: 'Rough-lock and drive down', hint: 'Faster, hard on the wagon.', do(S) { S.wagon.cond = Math.max(5, S.wagon.cond - between(S, 8, 20)); if (count(S, 'glass')) { const n = Math.min(count(S, 'glass'), between(S, 1, 4)); take(S, 'glass', n); S.stats.broken += n; return `Skidded down with the wheels locked. The wagon took a beating and ${n} box${n > 1 ? 'es' : ''} of looking glasses broke.`; } return 'Skidded down with the wheels locked. The wagon took a beating.'; } },
  ],
});
E.push({ id: 'arrive_junta', title: 'La Junta', scene: 'creek', setup(S) { note(S, 'f_junta'); }, text: () => 'Two little rivers meet in a green valley, and the Cimarron road and the mountain road meet with them. A shepherd boy with a flock of churro sheep stares at the wagon. Adobe houses on the hillside. You are in New Mexico.', choices: () => [{ label: 'Go on', do: () => '' }] });
E.push({
  id: 'arrive_vegas', title: 'Las Vegas', scene: 'village',
  setup(S) { note(S, 'f_vegas'); note(S, 'c_vegas'); },
  text: () => 'A new adobe village around a dusty plaza on the Gallinas. The whole town comes out to look at the wagon. A woman selling goat cheese hears your name and laughs.\n\n"Marsh? Elías? He has a store in Santa Fe, by the parroquia. He married one of the Ortega girls." She does not believe he never wrote.\n\nThe plaza merchants will buy a little, and sell provisions and mules cheap.',
  choices: () => [{ label: 'Into the plaza', do: () => '' }],
});
E.push({
  id: 'arrive_pecos', title: 'Pecos', scene: 'ruin',
  setup(S) { note(S, 'f_pecos'); },
  text(S) {
    let t = 'On a long ridge stand the walls of the great pueblo and its mission church, nearly empty. The last families of Pecos left six years ago to live with their kin at Jemez. Wind in the empty rooms. Beyond lies Glorieta Pass, and beyond that, Santa Fe.';
    if (hasHand(S, 'trade')) { t += '\n\nAt San Miguel del Vado, the day before, Tomás\'s mother ran out into the road and would not let go of him. He will go on with you to Santa Fe to finish what he promised, then come home.'; note(S, 'c_tomas'); }
    return t;
  },
  choices: () => [{ label: 'On to Santa Fe', do: () => '' }],
});
E.push({
  id: 'arrive_santafe', title: 'Santa Fe', scene: 'city',
  setup(S) { note(S, 'f_entry'); },
  text: () => 'From the last hill: a low brown town of flat-roofed adobe in a broad valley, the mountains behind it, the twin towers of the parish church, and smoke from a thousand piñon fires.\n\nYou wash in the creek, put on your one clean shirt, and tie a new cracker on the whip. "¡Los americanos!" Children run alongside. Women come to the doorways. You drive into the plaza with the whip popping like pistol shots, and the customs guards are waiting by the Palace of the Governors.',
  choices: () => [{ label: 'Draw up at the customs house', do: () => ({ text: '', next: { event: 'customs' } }) }],
});
E.push({
  id: 'customs', title: 'The customs house', scene: 'city',
  setup(S, H, c) {
    let v = 0, hid = 0;
    for (const b of S.inv) { const it = ITEMS[b.id]; if (it.kind === 'goods') { const p = D.MARKETS.santafe.buys[b.id][0]; v += p * b.n; if (b.id === 'silk' || b.id === 'glass') hid += p * b.n; } }
    c.v = Math.round(v); c.hid = Math.round(hid);
    c.full = Math.max(10, Math.round(v * 0.12));
  },
  text(S, H, c) {
    if (c.v <= 0) return 'The inspector walks round the wagon, looks inside, and laughs. Nothing to tax. He waves you through.';
    return `An inspector with a ledger of his own goes through the wagon bale by bale. Your goods would fetch about $${c.v} on the plaza, and the duty, he says, comes to twelve dollars in the hundred: $${c.full}.\n\nEveryone knows how it is done here. Everyone also knows what happens when it is done badly.`;
  },
  choices(S, H, c) {
    if (c.v <= 0) return [{ label: 'Into the plaza', do: () => '' }];
    const pay = (S, amt, txt) => { S.money -= amt; S.stats.duty += amt; return txt; };
    return [
      { label: 'Declare everything and pay', hint: `$${c.full}.`, off: S.money >= c.full ? '' : 'money', do: S => pay(S, c.full, `Paid $${c.full} in duty, every cent of it.`) },
      { label: 'Let Tomás handle it', hide: !hasHand(S, 'trade'), hint: `He knows the clerk. About $${Math.round(c.v * 0.08)}.`, off: S.money >= c.v * 0.08 ? '' : 'money',
        do: S => pay(S, Math.round(c.v * 0.08), `Tomás talked with the clerk for an hour about cousins in San Miguel. The duty came to $${Math.round(c.v * 0.08)}.`) },
      { label: 'Offer the inspector a "gratification"', hint: `$30 in his hand, and he may assess low. Or he may be honest.`, off: S.money >= 30 + c.v * 0.07 ? '' : 'money',
        do(S) {
          if (chance(S, 0.75)) return pay(S, 30 + Math.round(c.v * 0.07), `The coins disappeared. The inspector found your goods worth much less than you had thought. $${30 + Math.round(c.v * 0.07)} all told.`);
          return pay(S, 30 + Math.round(c.v * 0.18), `He was an honest man, and offended. He kept the thirty dollars as a fine and assessed every bale at the top rate: $${30 + Math.round(c.v * 0.18)}.`);
        } },
      { label: 'Hide the silk and looking glasses under the floorboards', hide: c.hid <= 0, hint: `Pay only on the rest ($${Math.round((c.v - c.hid) * 0.12)}). If they search, you lose what you hid.`, off: S.money >= (c.v - c.hid) * 0.12 + 50 ? '' : 'money',
        do(S) {
          if (chance(S, 0.7)) return pay(S, Math.max(10, Math.round((c.v - c.hid) * 0.12)), `The inspector never thought to look under the floor. You paid $${Math.max(10, Math.round((c.v - c.hid) * 0.12))} on the rest.`);
          const s = count(S, 'silk'), g = count(S, 'glass'); take(S, 'silk', s); take(S, 'glass', g);
          S.stats.lost += s * 16 + g * 6;
          return pay(S, Math.max(10, Math.round((c.v - c.hid) * 0.12)) + 50, `A guard stamped on the wagon floor and it rang hollow. They took every shawl and looking glass, fined you fifty dollars, and charged the duty on the rest besides.`);
        } },
    ];
  },
});
E.push({
  id: 'elias', title: 'The store by the parroquia', scene: 'city',
  text(S) {
    const knew = S.notes.includes('c_vegas') || S.notes.includes('c_tomas');
    let t = knew
      ? 'You find it the way the woman in Las Vegas said: a narrow store in a row of adobe on the street beside the parish church, a sign painted in two languages. You stand in the doorway with the ledger in your hand.'
      : 'You ask after him everywhere, and in the end it is a boy selling piñon nuts who takes you by the hand to a narrow store beside the parish church, with a sign painted in two languages.';
    t += `\n\nElias is behind the counter, thinner and browner, measuring calico for a woman with a baby. He looks up, and the scissors stop.\n\nLater, over chocolate in the back room, it comes out. When the ports were closed to Americans last summer he had a wagon of goods and no way to sell them, and a note to Wendell he could not pay. So he took Mexican papers, which let him trade, and married Luz Ortega, who had been lending him her father's storeroom, and he did not write, because he could not think how to put it all in a letter that would not shame everyone.\n\n"And you brought my wagon all the way," he says. "And ${S.money - S.wages >= D.NOTE ? 'paid' : 'tried to pay'} my note."`;
    const net = Math.round(S.money - S.wages - D.NOTE);
    t += net >= 0
      ? `\n\nYou have sold what you carried. After the note and wages, the trip has left you $${net} ahead.`
      : `\n\nYou have sold what you carried. Even so, after wages you are $${-net} short of the note.`;
    t += `\n\nElias says there is room in the store for a partner who knows the road.`;
    return t;
  },
  choices(S) {
    return [
      { label: 'Stay in Santa Fe and go in with Elias', do(S) { H.settle(S, true); return ''; } },
      { label: 'Settle up and go home with the autumn caravan', do(S) { H.settle(S, false); return ''; } },
    ];
  },
});

// ===================================================================== random days
E.push({
  id: 'mired', kind: 'day', regions: ['tall', 'mixed'], w: 2, title: 'Mired', scene: 'mud',
  text: () => 'Last night\'s rain turned a swale into a black slough. The wagon goes in to the hubs and the team stops, heaving, unable to move it.',
  choices(S) {
    return [
      { label: 'Double up and whip them through', hint: 'Hard on the team, and on the wagon.', do(S) { S.team.cond = Math.max(0, S.team.cond - 8); S.wagon.cond = Math.max(5, S.wagon.cond - 5); spend(S, 1); return 'Every animal in the traces and everyone on the wheels, and the wagon came out with a sucking sound. Lost half a day.'; } },
      { label: 'Unload, pull it out, carry the load over', hint: 'A full day. No harm done.', do(S) { spend(S, 2); return 'Carried the whole load across the slough on your backs, pulled out the empty wagon, and loaded it again. A long, filthy day.'; } },
      { label: 'Cut brush and lay a corduroy road', hint: 'Half a day. The team is spared.', do(S) { spend(S, 1); S.wagon.cond = Math.max(5, S.wagon.cond - 2); return 'Cut willows and laid them across the mud. The wagon rolled out on them.'; } },
    ];
  },
});
E.push({
  id: 'kaw', kind: 'day', regions: ['tall'], once: true, title: 'Kaw travellers', scene: 'plain',
  text: () => 'A Kaw family on horseback, with pack horses and a travois, falls in beside you for a mile. The man speaks a little English and a little French. They have green corn, moccasins and a deer hide, and they are looking for tobacco and cloth.',
  choices(S) {
    return [
      { label: 'Trade a bale of tobacco for corn and a deerskin', hide: count(S, 'tobacco') < 1, hint: '1 bale of tobacco for 30 lb of food and a skin.', do(S) { take(S, 'tobacco', 1); add(S, 'provisions', 30); add(S, 'deer', 1); return 'Traded a bale of tobacco for green corn and a fine deerskin.'; } },
      { label: 'Trade two bolts of calico for corn and moccasins', hide: count(S, 'calico') < 2, hint: '2 bolts for 40 lb of food.', do(S) { take(S, 'calico', 2); add(S, 'provisions', 40); return 'Traded two bolts of calico for corn, dried squash and two pairs of moccasins.'; } },
      { label: 'Share coffee with them and go on', do: () => 'Shared coffee at the noon halt. The man drew you a map of the creeks ahead in the dirt with a stick.' },
    ];
  },
});
E.push({
  id: 'turnback', kind: 'day', regions: ['tall', 'mixed'], once: true, title: 'Turning back', scene: 'plain',
  text: () => 'A young clerk from Ohio sits on his wagon tongue with his head in his hands. His partner is down with fever and he has had enough; he is going home. He will sell what he has rather than haul it back: water casks, provisions, a spare wheel.',
  choices(S) {
    return [
      { label: 'Buy his 3 casks', hint: '$3 for all three (36 lb empty).', off: S.money >= 3 ? '' : 'money', do(S) { S.money -= 3; add(S, 'cask', 3); return 'Bought three water casks for three dollars.'; } },
      { label: 'Buy 100 lb of his provisions', hint: '$4.', off: S.money >= 4 ? '' : 'money', do(S) { S.money -= 4; add(S, 'provisions', 100); return 'Bought a hundred pounds of flour and bacon for four dollars.'; } },
      { label: 'Buy his spare wheel', hint: '$6 (60 lb).', off: S.money >= 6 ? '' : 'money', do(S) { S.money -= 6; add(S, 'wheel', 1); return 'Bought his spare wheel for six dollars.'; } },
      { label: 'Wish him well', do: () => 'Wished him a safe road home.' },
    ];
  },
});
E.push({
  id: 'storm', kind: 'day', w: 1.5, regions: ['tall', 'mixed', 'plains', 'dry'], title: 'Hailstorm', scene: 'storm',
  text: () => 'The sky in the west goes green-black. Then the wind, then rain in sheets, then hail the size of musket balls drumming on the wagon sheet. You can feel it tearing.',
  choices(S) {
    return [
      { label: 'Halt, face the team away, and cover the goods', hint: 'Half a day. The cloth stays dry.', do(S) { spend(S, 1); return 'Turned the team\'s tails to the storm and spread every blanket over the bales. The sheet is torn but the goods are dry.'; } },
      { label: 'Keep moving', hint: cloth(S) ? 'Some of the cloth may be ruined.' : 'Nothing much to spoil.', do(S) { if (cloth(S) && chance(S, 0.6)) { const l = spoilCloth(S, 0.12); return `Hail ripped the wagon sheet and the rain got in. ${l ? 'Lost ' + l + ', soaked and stained.' : ''}`; } return 'Drove on through it, drenched. The goods came through.'; } },
    ];
  },
});
E.push({
  id: 'herd', kind: 'day', w: 2.5, regions: ['mixed', 'plains', 'dry'], title: 'Buffalo', scene: 'herd',
  text: () => 'The plain ahead is moving. Buffalo, thousands of them, a dark sea of backs grazing slowly across the trail from horizon to horizon. The ground smells of them.',
  choices(S) {
    const odds = hasHand(S, 'hunt') ? 0.9 : 0.65;
    return [
      { label: 'Ride out and run a cow', hint: `2 lb of powder. About ${Math.round(odds * 100)}% to bring one down.`, off: count(S, 'powder') >= 2 ? '' : 'powder',
        do(S) { take(S, 'powder', 2); spend(S, 1); S.stats.hunts++; if (chance(S, odds)) { S.stats.kills++; return { text: '', next: { butcher: 'bison', msg: 'Rode alongside a fat young cow in the dust and dropped her with one ball behind the shoulder.' } }; } return 'Rode into the herd, fired twice, and came back with nothing but dust in your teeth.'; } },
      { label: 'Wait for the herd to pass', hint: 'Half a day.', do(S) { spend(S, 1); return 'Sat on the wagon and watched them go by for half a day.'; } },
      { label: 'Push on through them', hint: 'Risky if they spook.', do(S) { if (chance(S, 0.3)) { S.wagon.cond = Math.max(5, S.wagon.cond - 12); S.team.cond = Math.max(0, S.team.cond - 8); return 'Something spooked them and the herd ran, right past the wagon. The team bolted. When it was over the wagon was battered and the team blown.'; } return 'Eased the wagon through a gap in the herd. They barely lifted their heads.'; } },
    ];
  },
});
E.push({
  id: 'fire', kind: 'day', once: true, regions: ['mixed', 'plains'], title: 'Prairie fire', scene: 'fire',
  text: () => 'Smoke on the horizon in the afternoon, then a glow along the whole line of the south. The wind is behind it, and it is coming fast through the dry grass.',
  choices(S) {
    return [
      { label: 'Set a backfire and wait on the burned ground', hint: 'Half a day. Safe.', do(S) { spend(S, 1); return 'Set a backfire downwind and moved the wagon onto the black ground behind it. The main fire went past on either side with a noise like a train of wagons.'; } },
      { label: 'Run for the river', hint: 'Hard on the team; it may catch you.', do(S) { S.team.cond = Math.max(0, S.team.cond - 10); if (chance(S, 0.3)) { S.wagon.cond = Math.max(5, S.wagon.cond - 15); const l = spoilCloth(S, 0.15); return `Ran for it. The fire caught the tail of the wagon; you beat it out with blankets. ${l ? 'Lost ' + l + '.' : ''}`; } return 'Whipped the team to a gallop and reached the river bottom with the fire a quarter mile behind.'; } },
    ];
  },
});
E.push({
  id: 'snake', kind: 'day', regions: ['mixed', 'plains', 'dry', 'nm'], title: 'Rattlesnake', scene: 'plain',
  setup(S, H, c) { const ppl = people(S); c.p = ppl[Math.floor(rand(S) * ppl.length)].id; },
  text(S, H, c) { const p = S.party.find(q => q.id === c.p); return `Gathering buffalo chips for the fire, ${p.id === 'you' ? 'you put your hand' : p.name + ' put his hand'} down beside a rattlesnake. It struck before anyone heard it.`; },
  choices(S, H, c) {
    const p = S.party.find(q => q.id === c.p);
    return [
      { label: 'Cut the bite and draw the poison, then rest', hint: 'Half a day.', do(S) { spend(S, 1); p.hp = Math.max(5, p.hp - between(S, 8, 18)); return `Cut and drew the wound and wrapped it. ${who(p)} ${p.id === 'you' ? 'are' : 'is'} sick and swollen, but alive.`; } },
      { label: 'Use the medicine chest', hide: count(S, 'medicine') < 1, hint: 'Laudanum and a poultice. No time lost.', do(S) { take(S, 'medicine', 1); p.hp = Math.max(5, p.hp - 5); return 'Laudanum for the pain and a poultice on the wound. The swelling went down by evening.'; } },
      { label: 'Keep going', hint: 'It may go badly.', do(S) { p.hp = Math.max(1, p.hp - between(S, 15, 35)); return `Kept moving. By night ${who(p).toLowerCase() === 'you' ? 'your' : p.name + '\'s'} arm was black to the elbow.`; } },
    ];
  },
});
E.push({
  id: 'fever', kind: 'day', regions: ['plains', 'mixed', 'nm', 'mountain'], title: 'Fever', scene: 'camp',
  when: S => people(S).some(p => !p.sick),
  setup(S, H, c) { const p = sickOne(S); c.p = p.id; p.sick = 1; },
  text(S, H, c) { const p = S.party.find(q => q.id === c.p); return `The river bottoms are thick with mosquitoes. ${p.id === 'you' ? 'You wake' : p.name + ' wakes'} shaking with chills, then burning: the ague.`; },
  choices(S, H, c) {
    const p = S.party.find(q => q.id === c.p);
    return [
      { label: 'Dose with quinine from the medicine chest', hide: count(S, 'medicine') < 1, hint: '1 chest.', do(S) { take(S, 'medicine', 1); p.sick = 0; return 'Bitter quinine, three times a day. The fever broke by evening.'; } },
      { label: 'Rest a day', hint: 'A good chance it passes.', do(S) { spend(S, 2); p.hp = Math.min(100, p.hp + 3); if (chance(S, 0.55)) { p.sick = 0; return 'Lay up a day in the shade of the wagon. The fever broke in the night.'; } return 'Lay up a day. The fever is still there.'; } },
      { label: 'Press on', hint: 'Sickness wears a person down every day until it breaks.', do: () => 'Made a bed in the wagon and kept moving.' },
    ];
  },
});
E.push({
  id: 'returning', kind: 'day', once: true, regions: ['plains', 'mixed'], when: S => S.path.includes('rock'), title: 'Wagons coming east', scene: 'plain',
  setup(S, H, c) {
    const news = [
      { id: 'manta', m: 0.75, t: 'Santa Fe is full of domestics; a big caravan from Chihuahua dumped a load of them in the spring.' },
      { id: 'calico', m: 0.8, t: 'calicoes are a drug on the market in Santa Fe this year; everyone brought them.' },
      { id: 'hardware', m: 1.3, t: 'there is not an axe or a hoe to be had in New Mexico, and the farmers are desperate.' },
      { id: 'glass', m: 1.25, t: 'the rich families in Santa Fe are mad for looking glasses this season.' },
      { id: 'silk', m: 1.3, t: 'there is a wedding season in Santa Fe and silk is selling for whatever you ask.' },
      { id: 'notions', m: 1.2, t: 'needles and thread are short all over New Mexico.' },
    ];
    c.n = news[Math.floor(rand(S) * news.length)];
    S.news[c.n.id] = c.n.m;
  },
  text: (S, H, c) => `A line of dusty wagons coming the other way: traders going home to Missouri with silver, mules and wool. Their captain trades news for coffee. Prices, he says: ${c.n.t}\n\nThey will sell provisions and buy buffalo tongues for the St. Louis market.`,
  choices(S) {
    const t = count(S, 'tongue') + count(S, 'tongue_s');
    return [
      { label: 'Buy 100 lb of provisions', hint: '$9.', off: S.money >= 9 ? '' : 'money', do(S) { S.money -= 9; add(S, 'provisions', 100); return 'Bought a hundred pounds of provisions from the eastbound traders.'; } },
      { label: `Sell them your ${t} tongue${t > 1 ? 's' : ''}`, hide: !t, hint: '$0.60 each.', do(S) { const n = take(S, 'tongue', count(S, 'tongue')) + take(S, 'tongue_s', count(S, 'tongue_s')); S.money += n * 0.6; S.stats.revenue += n * 0.6; S.stats.gameSold += n * 0.6; return `Sold ${n} tongue${n > 1 ? 's' : ''} for $${(n * 0.6).toFixed(2)}.`; } },
      { label: 'Give them a letter for home and go on', do: () => 'Gave the captain a letter for home. It will be in St. Louis in a month.' },
    ];
  },
});
E.push({
  id: 'stray', kind: 'day', w: 0.8, title: 'Strayed', scene: 'plain',
  when: S => S.team.n > TEAMS[S.team.kind].min,
  text: S => `At dawn one of the ${animal(S, 2)} is gone, its picket pin pulled. The tracks wander off toward the river.`,
  choices(S) {
    return [
      { label: 'Go after it', hint: 'Half a day. Likely you find it.', do(S) { spend(S, 1); if (chance(S, 0.75)) return `Found the ${animal(S, 1)} two miles off in a patch of good grass and led it back.`; S.team.n--; return 'Followed the tracks until they crossed hard ground and vanished. Gave it up.'; } },
      { label: 'Leave it', hint: `One fewer ${animal(S, 1)}.`, do(S) { S.team.n--; S.stats.lost += TEAMS[S.team.kind].price; return `Left the ${animal(S, 1)} to the prairie.`; } },
    ];
  },
});
E.push({
  id: 'mirage', kind: 'day', once: true, regions: ['dry'], when: S => S.to === 'lspring', title: 'A lake', scene: 'mirage',
  text: () => 'Noon on the Jornada. Off to the west, a mile or two from the trail, a broad blue lake shimmers with trees along its edge. The team sees it too, and pulls toward it.',
  choices: () => [
    { label: 'Turn toward the water', hint: '', do(S) { spend(S, 1); S.team.cond = Math.max(0, S.team.cond - 5); note(S, 'f_jornada'); return 'Drove two hours toward it. It moved away as you came, and then it was gone, and there was only sand and the heat. The mirage of the plains. Lost half a day finding the trail again.'; } },
    { label: 'Hold the course', hint: '', do: S => { note(S, 'f_jornada'); return 'Held to the trail. An hour later the lake simply was not there.'; } },
  ],
});
E.push({
  id: 'comanche', kind: 'day', once: true, regions: ['dry'], w: 3, title: 'Riders', scene: 'riders',
  text(S) {
    let t = 'Forty riders come over a rise and spread out across the trail ahead: Comanche, by their dress, with some Kiowa among them. Men, women and boys, a big herd of horses, lodgepoles dragging. A hunting camp on the move. Two men ride forward. One calls out in Spanish.';
    if (hasHand(S, 'trade')) t += '\n\n"They want to trade," Tomás says. "And they want to see what we are."';
    if (S.caravan) t += '\n\nThe captain rides forward to meet them.';
    return t;
  },
  choices(S) {
    return [
      { label: 'Halt, ride out, and offer tobacco', hint: count(S, 'tobacco') ? '2 bales of tobacco.' : 'You have no tobacco; you will have to offer cloth.', do(S) {
        if (count(S, 'tobacco') >= 2) take(S, 'tobacco', 2); else take(S, 'calico', Math.min(3, count(S, 'calico')));
        return { text: 'Sat on the grass with them and smoked. Their leader examined the wagon with great interest and then made an offer.', next: { event: 'comanche_trade' } }; } },
      { label: 'Keep the wagon moving and do not stop', hint: 'They may not take it kindly.', do(S) { S.flags.wary = S.day + 8; return 'Kept the team moving. The riders kept pace on a ridge for an hour, watching, then turned away. You do not think that was the end of it.'; } },
    ];
  },
});
E.push({
  id: 'comanche_trade', title: 'Trading', scene: 'riders',
  text: S => `They have horses and mules to spare, and they want cloth, knives, mirrors. Their leader points at your ${animal(S, 2)} and then at their herd, and holds up two fingers.`,
  choices(S) {
    return [
      { label: `Two ${animal(S, 2)} for 10 bolts of calico`, hide: count(S, 'calico') < 10, do(S) { take(S, 'calico', 10); addAnimals(S, 2); return `Traded ten bolts of calico for two ${S.team.kind === 'mules' ? 'Mexican mules, branded and fresh' : 'animals'}.`; } },
      { label: `Two ${animal(S, 2)} for 2 crates of hardware`, hide: count(S, 'hardware') < 2, do(S) { take(S, 'hardware', 2); addAnimals(S, 2); return 'Traded two crates of knives and kettles for two fresh animals.'; } },
      { label: `Two ${animal(S, 2)} for 4 boxes of looking glasses`, hide: count(S, 'glass') < 4, do(S) { take(S, 'glass', 4); addAnimals(S, 2); return 'The looking glasses went from hand to hand with great laughter. Two fresh animals for four boxes.'; } },
      { label: 'Trade nothing, and part friends', do: () => 'Thanked them and parted on good terms.' },
    ];
  },
});
E.push({
  id: 'cibolero', kind: 'day', once: true, regions: ['dry', 'nm'], title: 'Ciboleros', scene: 'riders',
  setup(S) { note(S, 'f_cibolero'); },
  text: () => 'A train of creaking two-wheeled carts and pack mules: New Mexican buffalo hunters out of the river villages, with lances and old muskets, going out early for meat. Their leader is delighted to see Americans and wants powder above all things.',
  choices(S) {
    return [
      { label: 'Trade 4 lb of powder for 40 lb of carne seca', hide: count(S, 'powder') < 4, hint: 'Dried meat that keeps.', do(S) { take(S, 'powder', 4); add(S, 'jerky', 40); return 'Traded four pounds of powder for forty pounds of their dried buffalo meat.'; } },
      { label: 'Ask about the road ahead', do(S) { S.team.cond = Math.min(100, S.team.cond + 4); return 'He told you where the good grass was for two days ahead, and he was right.'; } },
    ];
  },
});
E.push({
  id: 'wreck', kind: 'day', once: true, regions: ['plains', 'dry', 'mountain'], title: 'An abandoned wagon', scene: 'broken',
  text: () => 'A wagon stands by itself off the trail, its tongue broken and its sheet in rags. No sign of its people; whoever owned it took the team and what they could carry and went on. There is still some salvage: a sound axletree, two water casks, a bucket of grease, and a few bolts of mildewed domestics.',
  choices: () => [
    { label: 'Take the axletree', hint: '40 lb.', do(S) { add(S, 'axle', 1); return 'Took the axletree.'; } },
    { label: 'Take the casks and grease', hint: '32 lb.', do(S) { add(S, 'cask', 2); add(S, 'grease', 1); return 'Took the two casks and the grease.'; } },
    { label: 'Take everything useful', hint: '72 lb and half a day to strip it.', do(S) { add(S, 'axle', 1); add(S, 'cask', 2); add(S, 'grease', 1); spend(S, 1); return 'Stripped the wreck of everything useful.'; } },
    { label: 'Leave it', do: () => 'Left it standing.' },
  ],
});
E.push({
  id: 'lame', kind: 'day', w: 0.8, title: 'Lame', scene: 'plain',
  text: S => `One of the ${animal(S, 2)} is limping badly: a stone bruise, or worse.`,
  choices(S) {
    const fixer = hasHand(S, 'trade') || hasHand(S, 'repair');
    return [
      { label: fixer ? `Let ${handName(S)} see to it` : 'Rest the team half a day', hint: fixer ? 'No time lost.' : 'Half a day.', do(S) { if (!fixer) spend(S, 1); return fixer ? `${handName(S)} cut out the stone and packed the hoof. It walked sound by noon.` : 'Rested half a day. The limp eased.'; } },
      { label: 'Drive on', hint: 'The team suffers.', do(S) { S.team.cond = Math.max(0, S.team.cond - 8); return 'Drove on. The whole team slowed to its pace.'; } },
    ];
  },
});
E.push({
  id: 'bear', kind: 'day', once: true, regions: ['mountain'], title: 'Grizzly', scene: 'mountain',
  text: () => 'At first light a grizzly is in camp, nose deep in the provision box. It lifts its head and looks at you without much interest.',
  choices(S) {
    return [
      { label: 'Shoot it', hint: '2 lb of powder. Dangerous.', off: count(S, 'powder') >= 2 ? '' : 'powder', do(S) {
        take(S, 'powder', 2);
        const odds = hasHand(S, 'hunt') ? 0.85 : 0.55;
        if (chance(S, odds)) return { text: '', next: { butcher: 'bear', msg: 'Two balls and it went down with a roar you will hear for the rest of your life.' } };
        const p = you(S); p.hp = Math.max(5, p.hp - between(S, 15, 35)); take(S, 'provisions', 40); return 'Missed. The bear knocked you flat in passing and went off with a side of bacon. You are bruised and cut, but alive.'; } },
      { label: 'Bang pots and shout', hint: 'It may leave. It may not.', do(S) { const n = take(S, 'provisions', between(S, 15, 50)); return `It took its time leaving, and took ${n} lb of provisions with it.`; } },
    ];
  },
});
E.push({
  id: 'dust', kind: 'day', w: 0.7, regions: ['dry', 'plains'], title: 'Dust', scene: 'storm',
  text: () => 'A wall of brown dust comes across the plain and swallows the wagon. You cannot see the team\'s ears.',
  choices: () => [
    { label: 'Halt and wait it out', hint: 'Half a day.', do(S) { spend(S, 1); return 'Huddled behind the wagon with wet rags over your faces until it passed.'; } },
    { label: 'Go on by compass', hint: 'You may wander.', do(S) { if (chance(S, 0.4)) { S.legMi = Math.max(0, S.legMi - 10); return 'When the dust cleared you were miles off the trail. Lost ten miles finding it again.'; } return 'Steered by compass and the feel of the ruts, and came out of it on the trail.'; } },
  ],
});
// people
E.push({
  id: 'hiram_story', kind: 'day', once: true, when: S => hasHand(S, 'hunt') && S.mi > 150, title: 'Hiram', scene: 'camp',
  text: () => 'Hiram talks more at night than in the day. He tells you about his first trip out, as a boy of sixteen, when the caravan ran out of meat on the Cimarron and lived a week on mule. "You learn to take the tongue and the hump and leave the rest," he says. "The rest of a buffalo is just weight with hair on it."',
  choices: () => [{ label: 'Go on', do: () => '' }],
});
E.push({
  id: 'anton_story', kind: 'day', once: true, when: S => hasHand(S, 'repair') && S.mi > 150, title: 'Anton', scene: 'camp',
  text: () => 'Anton is soaking the wheels in the creek again. Dry air shrinks the wood inside the iron tyres, he explains, and then the spokes rattle loose and the wheel falls apart. "In Baden the air is wet. Here the air wants to drink your wagon."',
  choices: () => [{ label: 'Go on', do(S) { S.wagon.cond = Math.min(100, S.wagon.cond + 3); return ''; } }],
});
E.push({
  id: 'tomas_story', kind: 'day', once: true, when: S => hasHand(S, 'trade') && S.mi > 300, title: 'Tomás', scene: 'camp',
  setup(S) { note(S, 'c_tomas'); },
  text: () => 'By the fire Tomás finally asks what your brother looked like. When you tell him he is quiet for a while. "There is an American in Santa Fe called Elías," he says at last. "He keeps a small store by the parroquia. He has taken Mexican papers. I do not know his other name. I did not want to say, in case it is not him."',
  choices: () => [{ label: 'Go on', do: () => '' }],
});
E.push({
  id: 'ledger1', kind: 'day', once: true, when: S => S.mi > 90, title: 'By the fire', scene: 'camp',
  text: () => 'By firelight you read Elias\'s ledger again. Columns of figures, prices of calico and mules, and here and there a line that is not business. "June 3. Saw the plains on fire at night, a red line forty miles long. Wished you could see it." You did not know he had been thinking of you out here.',
  choices: () => [{ label: 'Go on', do: () => '' }],
});
E.push({
  id: 'ledger2', kind: 'day', once: true, when: S => S.mi > 380, title: 'The last page', scene: 'camp',
  text: () => 'The last entries in the ledger are from Santa Fe, autumn 1842. A list of goods sold. A note: "L. O. lent the storeroom, would take no rent." Then a column of figures that does not add up, worked over and over, and the amount of Wendell\'s note underlined three times.',
  choices: () => [{ label: 'Go on', do: () => '' }],
});
E.push({
  id: 'stars', kind: 'day', once: true, regions: ['plains', 'dry'], title: 'Night', scene: 'night',
  text: () => 'No moon. The sky is so thick with stars that the ground seems lighter than it should be. The mules crop grass in the dark. Somewhere a long way off, wolves. You lie awake a long time.',
  choices: () => [{ label: 'Go on', do(S) { for (const p of people(S)) p.hp = Math.min(100, p.hp + 2); return ''; } }],
});
E.push({
  id: 'dogtown', kind: 'day', once: true, regions: ['plains', 'mixed'], title: 'Prairie dogs', scene: 'plain',
  text: () => 'For half a day the trail runs through a prairie dog town, miles across: thousands of little mounds, each with a sentry sitting up on top, all of them barking at you. A burrowing owl watches from a hole. Hard ground for wheels and hooves.',
  choices: () => [
    { label: 'Go slow and pick a way through', hint: 'Half a day.', do(S) { spend(S, 1); return 'Went through at a walk, someone at the team\'s heads.'; } },
    { label: 'Drive straight through', hint: 'A wheel or a leg may go in a hole.', do(S) { if (chance(S, 0.35)) { S.wagon.cond = Math.max(5, S.wagon.cond - 10); return 'A wheel dropped into a burrow and the wagon slewed and nearly went over. Something cracked.'; } return 'Bounced through without harm.'; } },
  ],
});

return E;
}
if (typeof module === 'object' && module.exports) module.exports = makeEvents;
else root.WBEvents = makeEvents;
})(typeof window !== 'undefined' ? window : globalThis);
