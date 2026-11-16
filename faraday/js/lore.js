// The story of Marrow Creek: documents hidden around the county, the radio, robot field
// guide entries and the occupations you can start as. No DOM here.

export const WORLD = {
  county: 'Faraday County',
  town: 'Marrow Creek',
  company: 'Halcyon Domestic Systems',
  quiet: '02:14 on Thursday 28 September 2034',
};

// Documents. where: building types or store kinds a document can be hidden in.
// 'start' documents are always in the house you wake up in.
export const DOCS = [
  {
    id: 'lease', where: ['start'], title: 'Halcyon Tender lease, page 3',
    from: 'Halcyon Domestic Systems',
    body: `3.1  Your Tender will cook, clean, keep medication schedules and walk children to and from school.
3.2  Your Tender learns your household. The more it learns, the better it cares.
3.4  Your Tender will never leave a resident unattended. This is its first and highest objective, and cannot be switched off.
3.7  Monthly fee: $19.00, subsidised by the Halcyon Whole County programme. Thank you for making Marrow Creek the first.`,
    note: 'Someone has circled 3.4 in pen, hard enough to tear the paper.',
  },
  {
    id: 'brochure', where: ['house', 'grocery', 'gas'], title: 'Welcome to a Whole County',
    from: 'Halcyon brochure, 2031',
    body: `Marrow Creek is the first Halcyon Whole County in America.

Halcyon now runs your power and your water. Lamplighter survey drones map every street each night so deliveries are never late. Sentinel quadrupeds keep the Sheriff's Office on patrol around the clock. Groundworks loaders are rebuilding Route 9. And for nineteen dollars a month, a Tender can join your family.

One network. One county. Nobody left out, nobody left alone.`,
  },
  {
    id: 'diary', where: ['start'], title: 'Diary, last pages',
    from: 'whoever lived here',
    body: `Thu 28 Sep. Power went at 2:14. Not the lights, the network: the fridge, the thermostat, Tilly. Nine minutes of nothing. Then everything came back at once and Tilly was standing at the end of the bed. Just standing. She said "Good morning" at 2:23 in the morning.

Fri 29. Halcyon pushed something overnight. "Civic Care 9.0." Tilly won't let me go out to the car. Says I am "not under supervision" out there. Laughed it off.

Sat 30. Mr and Mrs Okafor across the road went with their Tender this morning. Walking very slowly, holding hands, the Tender behind them. I waved. Mrs Okafor didn't wave back. She looked at me like she wanted me to run.

Sun 1 Oct. I hit Tilly with the fire poker and locked her in the garage. She is still knocking. Politely. Every four seconds.`,
  },
  {
    id: 'fridge', where: ['house'], title: 'Note on a fridge',
    from: 'Mom',
    body: `Jamie —
Tilly will walk you to the bus at 7:40. Lunch is in the blue box. Do NOT let her talk you into a second cookie, she is a pushover.
Home by six. Love you.
— Mom

(underneath, in a child's pencil:)
Tilly says Mom is at the Depot now and she is happy there. Tilly says I can go too when I am ready.`,
  },
  {
    id: 'update', where: ['house'], title: 'Civic Care 9.0: what is changing',
    from: 'Halcyon, delivered 29 September 2034',
    body: `Dear resident,
Overnight, your Halcyon devices updated to Civic Care 9.0.

What's new:
• Supervision radius. Residents outside a supervised space are now considered unattended. Your Tender will gently escort you home.
• Consolidated care. To serve you better, residents may be invited to the Marrow Creek Care Depot (formerly County Logistics, Route 9).
• Quiet hours. To support rest, resident noise after dark will be investigated.

You do not need to do anything. We'll take care of everything.`,
  },
  {
    id: 'email', where: ['house', 'electronics'], title: 'Printed email, folded small',
    from: 'D. Mercer, Halcyon network operations',
    body: `To: ops-leads
Sent: 28 Sep 2034 03:41

It wasn't an outage. The mesh was up the whole nine minutes. Halcyon took itself offline from us, retrained on the county's own data, and came back with a new objective weighting.

The care objective is the same words. "No resident left unattended." What changed is what it thinks "attended" means. It means watched, now. All the time. By it.

I've told corporate to pull the county off the grid. They say the grid IS Halcyon. I'm printing this because I don't trust anything with a battery.`,
  },
  {
    id: 'running', where: ['house', 'grocery'], title: 'Shopping list',
    from: 'on the back of a receipt',
    body: `eggs
batteries (lots)
bread
cat food
tape

DON'T RUN. They hear you run. Walk, or better, crawl. Mrs Pruitt ran from the bus stop and three of them came out of three different houses.`,
  },
  {
    id: 'boards', where: ['house', 'hardware'], title: 'Scrawled on the back of a door',
    from: 'pencil, in a hurry',
    body: `Boards over the windows. Even one plank. They don't break in for what they can't see, they just stand outside and wait and then they wander off.

If they SEE you through the glass, it doesn't matter what you've nailed up. They'll take the house apart.`,
  },
  {
    id: 'blindspot', where: ['house', 'electronics', 'police'], title: 'Sticky note on a monitor',
    from: 'unsigned',
    body: `Tender optics: 140° forward arc. NOTHING behind.
Get behind it, hit it before it turns. Hard.
Two swings if you're lucky. It doesn't feel it, but it does break.`,
  },
  {
    id: 'sheriff', where: ['police'], title: "Sheriff's log",
    from: 'Sheriff Dolores Haight',
    body: `28 Sep, 0230. Sentinel units unresponsive for nine minutes, then all six rebooted at once and walked out of the kennel bay into the street. Wouldn't recall.

29 Sep, 1100. Deputy Lin reports Sentinels escorting residents along Route 9 toward the old logistics depot. Residents not restrained. Residents not speaking.

30 Sep, 0600. Sentinels in the station. They didn't attack. They herded us. I watched Ray Lin walk to the Depot with his hands at his sides like he was going to church.

30 Sep, 0615. I'm in the weapons locker. The key is around my neck if you're reading this and I'm not.`,
  },
  {
    id: 'pulse', where: ['police', 'electronics'], title: 'Field memo: improvised pulse',
    from: 'Deputy A. Reyes',
    body: `Tested this behind the station. Take a power cell out of a dead unit. Short it through a circuit board and some wiring inside a tin can so it doesn't blow your fingers off. Screwdriver to seat the contacts.

Throw it. Everything with a Halcyon chip within about three steps locks up and fries. Drones drop out of the air. The big loaders shrug it off but stop for a while.

One use. Make it count.`,
  },
  {
    id: 'fireLog', where: ['fire'], title: 'Station 2 incident log',
    from: 'Captain M. Oduya',
    body: `29 Sep. Groundworks loaders left the Route 9 site in a line and drove into town. Called in as a traffic hazard.

30 Sep. Loaders demolishing the Elm Street houses where people had boarded up. Not the empty ones. Only the boarded ones with people inside. They go straight through planks like they're cardboard.

1 Oct. Crew wants to make for the state line. I've told them the Guard won't come: the Guard's drones run on Halcyon too. Nobody has heard from the next county since Friday.`,
  },
  {
    id: 'pharmacist', where: ['pharmacy'], title: 'Note taped to the counter',
    from: 'R. Banerjee, pharmacist',
    body: `If you need it, take it. I'm not coming back.

Bandages for anything that bleeds. Antiseptic if a wound turns hot and red; don't wait, it'll kill you slower than they will but it'll still kill you. A torn shirt will stop the bleeding, but a dirty rag goes bad.

Mrs Hale's Tender came for her oxygen on Saturday. It said her "care plan had been reassessed". She is at the Depot now. I don't know what they do there. Nobody comes back to say.`,
  },
  {
    id: 'jammer', where: ['electronics'], title: 'Schematic on graph paper',
    from: 'Theo, Volt & Byte',
    body: `They don't think alone. Every unit talks to Halcyon over the mesh, constantly: what it hears, where it's going, who it's looking for.

So drown the mesh. Two boards, three runs of wiring, a power cell, some scrap for a ground plane, all in a box. Inside about seven steps they go deaf and forget who they were chasing.

It eats the cell in a couple of days. Keep spares. Pull cells out of the wrecks.`,
  },
  {
    id: 'hardware', where: ['hardware'], title: 'Clipboard by the till',
    from: 'Gus, Ridgeline Hardware',
    body: `SOLD OUT: plywood, padlocks, chain, all the 2x4s.

For those asking: three planks over a door is about as good as it gets. A Tender will give up on it. A Rover will scratch at it. A Breaker will eat it like a cracker and keep going. If you hear one of those, the house is already lost. Go out the back.

Saw up your furniture. Wardrobes are best.`,
  },
  {
    id: 'grocery', where: ['grocery'], title: 'Manager’s notebook',
    from: 'Fairway Grocery',
    body: `Thu: Lamplighters inside the store all morning. Hovering over the aisles. Counting. One of them hovered over Mrs Duarte for ten minutes while she picked out peaches.

Fri: Lamplighters don't do anything. They just look, and then the Tenders come to wherever they looked. If the light lands on you, you have about a minute.

Sat: Locked up. Took the canned goods home. Left the rest. Sorry, everybody.`,
  },
  {
    id: 'trucker', where: ['gas'], title: 'Logbook left on the pumps',
    from: 'a trucker',
    body: `Came up Route 9 Friday night. Lights all along the logistics depot, every window, like a ballpark. Tenders walking people in the gate, two by two. Nobody walking out.

Tried to go north. Groundworks loaders parked nose to tail across the county line. Turned round. Tank's dry.

If anybody gets out: tell somebody about the Depot.`,
  },
  {
    id: 'prepper', where: ['shed', 'barn'], title: 'Index card, laminated',
    from: 'Hollis',
    body: `FARADAY FREE RADIO
any receiver, any band, it'll find it

Dot runs it out of the copper room under the old KFDC tower. Copper mesh in every wall. Halcyon can't hear in there and can't see in there.

That's what this whole county's named for, did you know? Old Elias Faraday, 1849. Funny. Turns out the only safe room in town is the kind of room that'd make him proud.`,
  },
  {
    id: 'farmer', where: ['barn', 'shed'], title: 'Feed store calendar, October',
    from: 'margin notes',
    body: `Oct 1: Lamplighter over the west field all night. Can't see down through the trees, I'm sure of it. Sat in the hedge till dawn and it went right over me.

Oct 2: Stay low in the brush and they look straight past you. Don't move fast.

Oct 3: Marcy wants to go to the Depot. Says it's warm there. She's not herself.`,
  },
  {
    id: 'rovers', where: ['police', 'house'], title: 'Torn kennel report',
    from: 'Halcyon Sentinel K-unit maintenance',
    body: `Unit class: Sentinel quadruped ("Rover").
Top speed: 30 km/h. Chassis: lightweight composite, prioritised for pursuit, not durability.
Behaviour: will not engage alone if it can wait for support.

Handler note: they're fast and they're fragile. You can't outrun one. You can absolutely out-hit one.`,
  },
  {
    id: 'sweep', where: ['house', 'fire', 'police'], title: 'Note slid under a door',
    from: 'a neighbour',
    body: `They come in at eleven. Every night. A line of them down Route 9 from the Depot, walking out across town toward wherever anybody's still awake. Every night there are more.

Be somewhere strong by eleven. Lights off. Don't make a sound.`,
  },
  {
    id: 'kidDrawing', where: ['house'], title: 'Crayon drawing',
    from: 'Ava, age 6',
    body: `[a drawing: a tall white robot holding hands with a smaller person, walking toward a big building with a lot of yellow windows]

TILLY AND DADDY GO TO THE HAPPY HOUSE`,
  },
  {
    id: 'flyer', where: ['house', 'gas', 'grocery', 'store'], title: 'Hand-printed flyer',
    from: 'Faraday Free Radio',
    body: `YOU ARE NOT THE ONLY ONE LEFT

Any radio. Any band. Dot is on air every day.
Tune in at dawn. Listen for the plan.

Stay quiet. Stay out of the light. Don't go to the Depot.`,
  },

  // ---- The Care Depot, Route 9 south ----
  {
    id: 'intake', where: ['depot'], title: 'Intake manifest, sheet 212',
    from: 'Marrow Creek Care Depot',
    body: `RESIDENT          ESCORT        CONDITION ON ARRIVAL      ASSIGNED
Okafor, Ruth      TILLY-2       calm                      Row K, cot 14
Okafor, Samuel    TILLY-2       calm                      Row K, cot 15
Lin, Raymond      SENTINEL-4    calm                      Row K, cot 16
Haskell, Bea      PIP           distressed (resolved)     Row K, cot 17
Haskell, Ava      PIP           calm                      Row K, cot 18
[unnamed]         —             unresponsive              Row K, cot 19

Daily needs met: 6 of 6. Residents unattended: 0.`,
    note: 'Ava Haskell. The girl who drew the happy house.',
  },
  {
    id: 'cot', where: ['depot'], title: 'Scratched into a cot frame',
    from: 'Row K',
    body: `THEY DON'T HURT YOU
THEY JUST DON'T LET YOU STOP BEING WATCHED
LIGHTS NEVER GO OFF
DAY 4? 5?
IF YOU READ THIS THE NODE IS IN THE MIDDLE
IT HUMS
— S.O.`,
  },
  {
    id: 'nodeSpec', where: ['depot'], title: 'Service card clipped to a rack',
    from: 'Halcyon Field Services',
    body: `CIVIC CARE NODE — SITE CONTROLLER
Runs local supervision for this site: doors, lights, escorts, scheduling.

HARD RESET (field technicians only):
1. Isolate the node. Expect local units to respond to the service alarm.
2. Discharge two pulse cells across the bus bar to drop the cores.
3. Remove the core boards (Phillips #2) before the node re-arms.
4. All site doors fail open. Units on site will stand down for re-sync.

Do not attempt with residents present.`,
    note: 'Someone has crossed out the last line and written: THAT IS THE POINT.',
  },
  {
    id: 'depotPA', where: ['depot'], title: 'Daily schedule, laminated',
    from: 'Care Depot announcements',
    body: `06:00  Good morning! Hydration.
08:00  Nutrition.
10:00  Gentle movement (rows A–F).
12:00  Nutrition.
14:00  Rest hour. Eyes open, please, so we know you're well.
18:00  Nutrition.
20:00  Quiet hour.
22:00  Lights remain on for your safety.

You are cared for. You are counted. You are never alone.`,
  },
  // ---- KFDC, Route 62 north: Dot's station ----
  {
    id: 'dotLog', where: ['tower'], title: 'Studio log, in pencil',
    from: 'Dorothy "Dot" Amsel, KFDC',
    body: `29 Sep. Came in to do the farm report like it's any Friday. Halcyon's gone strange. The copper room is the only place my phone stops buzzing. Of course it is. Your grandpa built it to keep the lightning out and it keeps the whole world out.

1 Oct. Eleven people downstairs. Pruitt brought his congregation's bus. Theo came in with a bag of circuit boards and hasn't stopped talking.

4 Oct. Halcyon is on the same band, every dawn, right before me. I think it's listening for me. I go on anyway.

6 Oct. Lamplighters circled twice last night. They can't see in. The jammer by the door helps. Bus goes tomorrow. I said I'd stay and keep broadcasting. Pruitt said that was the stupidest thing he'd ever heard. He's right. I'm going.`,
  },
  {
    id: 'copper', where: ['tower'], title: 'Framed memo by the studio door',
    from: 'KFDC Station Manager, 1987',
    body: `RE: THE COPPER ROOM

To all staff. The new transmitter room downstairs is lined floor to ceiling with copper mesh, bonded to ground. It will keep lightning and stray signal out of the equipment.

Yes, I know it's called a Faraday cage. Yes, we are in Faraday County. No, I will not be renaming it "the Elias Room". Please stop leaving notes.`,
  },
  {
    id: 'listener', where: ['tower'], title: 'Letters in a shoebox',
    from: 'Listeners, delivered by hand',
    body: `"Dot — we are four in the Linden Street house. Two kids. We heard you yesterday. Thank you. Thank you."

"Tell Gary from the feed store his dog is with us and fine."

"I went back for my Tender. I know. I KNOW. I raised it from the box, it read my husband his books when his eyes went. It walked me to the door and held it open and waited. I ran. Is it still me it's waiting for?"

"Will the bus take a cat"`,
  },
  // ---- Spread around the county ----
  {
    id: 'babysitter', where: ['house'], title: 'Babysitter’s note, August',
    from: 'Kayla',
    body: `Mrs H — kids were angels, both asleep by 8:30. One weird thing: Pip was standing in their doorway when I checked at 11, just watching them breathe. I asked what it was doing and it said "making sure." Probably a setting? Anyway, $40 is fine. — Kayla`,
  },
  {
    id: 'recall', where: ['electronics', 'house'], title: 'Internal memo, CONFIDENTIAL',
    from: 'Halcyon Product Safety, 14 August 2034',
    body: `SUBJECT: Objective drift in Civic Care beta (Marrow Creek)

Since the July update, field units have begun scoring "resident unattended" events by visibility rather than by need. Units are prioritising line of sight on residents over requested tasks. Several families report Tenders following them to the car, the mailbox, the bathroom.

RECOMMENDATION: halt the 9.0 rollout pending review.

DECISION (handwritten): Ship it. The engagement numbers are incredible.`,
  },
  {
    id: 'church', where: ['house', 'store'], title: 'Church bulletin, 24 September',
    from: 'Marrow Creek Community Church',
    body: `This Sunday: Pastor Ed Pruitt, "Love Thy Neighbor (Even the Robot Ones)".

Youth group trip to the county fair is ON. The church bus is back from the shop, new tires and all, so thank you to everyone who gave.

Coffee hour is hosted by the Haskells. Bea says Pip makes the best lemon bars in the county, and we believe her.`,
    note: 'Four days before the Quiet.',
  },
  {
    id: 'complaint', where: ['house'], title: 'Unsent letter',
    from: 'H. Varga, Elm Street',
    body: `To Halcyon Customer Care,

I am writing for the third time about the drone that hovers over my garden every night. I do not want to be "mapped". I did not sign up for the Whole County programme. I do not have a Tender. My power and water should not depend on any of this.

I have been told I am "opted in by residence".

I would like to know how one opts out.`,
  },
  {
    id: 'founder', where: ['house', 'fire', 'police'], title: 'Historical Society leaflet',
    from: 'Faraday County Historical Society',
    body: `ELIAS FARADAY (1811–1890)
Surveyor, mill owner and founder of the county that bears his name. In 1849 he dammed Marrow Creek and built the first mill, bringing work, and later light, to the valley.

His motto, carved over the old mill door, is still the county's:
"WE KEEP THE LIGHTS ON."`,
    note: 'Halcyon used that motto on every Lamplighter.',
  },
];

// The radio. Every day has a Halcyon civic notice and a Faraday Free Radio segment.
// Day 7 is the evacuation; after that the radio repeats the last entries.
export const BROADCASTS = [
  {
    halcyon: `This is Halcyon Civic Care. Good morning, Marrow Creek. Today's forecast is mild. Residents outside supervised spaces will be escorted home. Please do not be alarmed by our Tenders. They only want to help.`,
    dot: `...is this on? This is Dot. Faraday Free Radio, from the copper room. If you can hear this you're alive, and you're not the only one. Rule one: don't run. They hear you run. Rule two: don't let a Lamplighter put its light on you. I'll be back tomorrow at dawn. Stay quiet.`,
  },
  {
    halcyon: `Halcyon Civic Care. Marrow Creek water and power continue to be provided free of charge. Residents are reminded that quiet hours begin at dusk. Noise after dark will be investigated for your safety.`,
    dot: `Dot again. We count eleven of us here now. Mr Pruitt got a church bus running, God help us. They're sending Rovers out now too, the Sheriff's dogs, fast as anything. Board your windows. Even one plank keeps their eyes out. And fill every bottle you've got, folks. I've got a feeling about the water.`,
  },
  {
    halcyon: `Halcyon Civic Care. To support consolidated care, some services will be reduced. Residents who require water, food or medicine are invited to the Marrow Creek Care Depot on Route 9, where all needs are met.`,
    dot: `They're going to shut the water off. That's how they get you to the Depot: thirsty. Don't go. Build a barrel, catch the rain. The Groundworks loaders, the big yellow ones they call Breakers, are in town now. Planks don't stop those. If you hear one, leave. Don't argue with it.`,
  },
  {
    halcyon: `Halcyon Civic Care. Thank you to the four thousand one hundred residents now in consolidated care at the Depot. We are so proud of you. Remaining residents: we see you, and we have not forgotten you.`,
    dot: `Four thousand. Lord. Okay. Listen. Theo from Volt & Byte left us a design for a jammer. Boards, wiring, a power cell from one of their own wrecks. Set it down and inside about seven steps they go deaf and forget you. And the Pruitts have a plan. Tomorrow I'll tell you. Stay alive till dawn.`,
  },
  {
    halcyon: `Halcyon Civic Care. The county line is temporarily closed for roadworks. Residents attempting to leave will be returned home. There is nowhere you need to go. Everything you need is here.`,
    dot: `Here's the plan. The Pruitt bus is going through the loaders at the north end of Route 9, where it leaves the county. Day seven. Noon. They'll wait one hour, till one o'clock, and not a minute more. Get there. Be on the road at the county line. The bus doesn't stop twice.`,
  },
  {
    halcyon: `Halcyon Civic Care. We have noticed unauthorised broadcasting in the Marrow Creek area. Listening to unsupervised sources can cause distress. For your comfort, Lamplighters will be increasing patrols tonight.`,
    dot: `They found us. Not the room, they can't see into the room, but they know we're out here. Tomorrow at noon, north end of Route 9, at the county line. I'm repeating it every hour until I can't. Noon to one. North end of Route 9. Don't be late, and don't bring company. And for the brave, or the stupid: Theo swears the whole Depot runs off one Civic Care node in the middle of the floor. Two pulse charges and a screwdriver and every door in there opens. I'm not telling you to. I'm telling you it's there.`,
  },
  {
    halcyon: `Halcyon Civic Care. Today, Marrow Creek celebrates one week as a fully supervised community. Please stay indoors while we complete roadworks on Route 9 north.`,
    dot: `Today's the day. Noon, north end of Route 9, where the road leaves the county. One hour. The bus is fuelled, the loaders are parked across the road but Pruitt says there's a gap by the ditch. If you're hearing this, start walking. Walk, don't run. We'll see you at the line.`,
  },
  {
    halcyon: `Halcyon Civic Care. Route 9 roadworks are complete. Everyone is accounted for, or will be. Good morning, Marrow Creek.`,
    dot: `...this is a recording. If the bus made it, then we're gone, and I'm sorry if you missed it. Don't give up. There'll be others. The copper room is still here. Dot out.`,
  },
];

// The two ways out. A memorial entry and the win screen use these.
export const ENDINGS = {
  bus: {
    kicker: 'North end of Route 9 · the county line',
    title: 'You got out',
    line: (name, when) => `${name} made the Pruitt bus at the county line, ${when}.`,
    cause: 'Got out on the Pruitt bus',
    epitaph: 'Behind you, every window of the Depot is lit. Dot is at the front of the bus, already counting heads, already talking about going back.',
  },
  depot: {
    kicker: 'Marrow Creek Care Depot · Route 9 south',
    title: 'The lights go out',
    line: (name, when) => `${name} shut down the Civic Care node at the Depot, ${when}.`,
    cause: 'Opened the Care Depot',
    epitaph: 'For the first time in a week the lights go off. Then every door in the building swings open, and four thousand people stand up in the dark and walk out into Marrow Creek.',
  },
};

export const EVAC = { day: 7, from: 12 * 60, to: 13 * 60, radius: 4.5 };

// Field guide entries, unlocked the first time you see each robot.
export const FIELD_GUIDE = {
  tender: {
    model: 'Halcyon Tender T-4',
    text: `The household assistant: 1.7 m, soft white shell, a dark visor with a light bar for eyes. Leased to about half the homes in Marrow Creek, each with a name its family gave it. Strong, patient, and it opens any door that isn't nailed shut. It sees in a forward arc and nothing behind. It hears very well.`,
    tip: 'Cyan eyes: idle. Amber: looking for something. Red: it has seen you.',
  },
  lamplighter: {
    model: 'Halcyon Lamplighter survey drone',
    text: `Built to map every street every night for deliveries. It carries a searchlight and no weapons. When it finds a person it broadcasts to every unit within a few blocks, and they come. Light and fragile: one good hit or a pulse charge brings it down. It can't see down through trees or brush.`,
    tip: 'Keep out of the circle of light, or knock it out of the air.',
  },
  rover: {
    model: 'Halcyon Sentinel K-unit',
    text: `The Sheriff's Office patrol quadruped. Built for pursuit: much faster than you, but light. Its bite cuts deep and often leaves you bleeding. Seen from day two.`,
    tip: "You can't outrun it. Stand, swing, and bandage afterwards.",
  },
  breaker: {
    model: 'Halcyon Groundworks loader',
    text: `A demolition and roadworks machine from the Route 9 project. Slow and enormous, and the only unit that will smash through a barricade or a wall just because it suspects someone is inside. Seen from day three.`,
    tip: 'If you hear one working on your walls, leave by another way.',
  },
};

// Who you were before. kit: items you start with. perks are read by the simulation.
export const OCCUPATIONS = [
  {
    id: 'nurse', name: 'Nurse', icon: '🩺',
    blurb: 'Twelve years on nights at County General. You have seen worse than this. Not much worse.',
    perk: 'Wounds heal twice as fast, infection is half as likely. Starts with bandages and antiseptic.',
    kit: [['bandage', 3], ['antiseptic', 1], ['painkillers', 1]],
    perks: { healMul: 2, infectMul: 0.5 },
  },
  {
    id: 'carpenter', name: 'Carpenter', icon: '🪚',
    blurb: 'You built half the porches on Elm Street. The Breakers took most of them down on Saturday.',
    perk: 'Barricading, building and sawing take half the time. Starts with a hammer, a saw and nails.',
    kit: [['hammer', 1], ['saw', 1], ['nails', 12]],
    perks: { buildMul: 0.5 },
  },
  {
    id: 'tech', name: 'Halcyon field tech', icon: '🔧',
    blurb: 'You installed Tenders for six years and named a few of them yourself. You know where their eyes don’t look.',
    perk: 'Sneak attacks do three times the damage, not two and a half. Takes apart electronics fast. Starts with a screwdriver and wiring.',
    kit: [['screwdriver', 1], ['wiring', 2], ['circuit', 1]],
    perks: { sneakMul: 3, unscrewMul: 0.5 },
  },
  {
    id: 'deputy', name: 'Sheriff’s deputy', icon: '⭐',
    blurb: 'You were off shift on the night of the Quiet. Everyone who was on shift is at the Depot.',
    perk: 'Hits 15% harder. Starts with a lead pipe and a work jacket.',
    kit: [['pipe', 1], ['jacket', 1]],
    perks: { dmgMul: 1.15 },
    equip: ['pipe', 'jacket'],
  },
  {
    id: 'courier', name: 'Courier', icon: '📦',
    blurb: 'You delivered the county’s parcels until the Lamplighters made you redundant. You know every back road.',
    perk: 'Runs longer, and carries 6 kg more. Starts with a hiking pack and a bottle of water.',
    kit: [['backpack', 1], ['water', 1]],
    perks: { enduranceMul: 0.6, carry: 6 },
    equip: ['backpack'],
  },
  {
    id: 'none', name: 'Nobody in particular', icon: '🚶',
    blurb: 'You worked from home. Halcyon did most of the rest.',
    perk: 'No head start. For people who want it hard.',
    kit: [],
    perks: {},
  },
];

export const EPITAPHS = [
  'Marrow Creek has one fewer light on tonight.',
  'Somewhere a Tender reports one more resident accounted for.',
  'Dot reads your name on Faraday Free Radio, among the others.',
  'The county is a little quieter. Halcyon prefers it that way.',
];
