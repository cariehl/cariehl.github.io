// Waybill: the simulation. No DOM in here, so the tests can run it under Node.
// One call to travel() is one day on the trail: move, eat, drink, wear, and see what the night brings.
(function (root) {
'use strict';
const isNode = typeof module === 'object' && module.exports;
const D = isNode ? require('./data.js') : root.WBData;
const makeEvents = isNode ? require('./events.js') : root.WBEvents;
const { ITEMS, TEAMS, WAGONS, HANDS, NODES, EDGES, MARKETS, HUNT, GAME, NOTES } = D;

// ---------- random numbers (seeded, kept in the save) ----------
function rand(S) {
  let t = (S.rs = (S.rs + 0x6D2B79F5) >>> 0);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const chance = (S, p) => rand(S) < p;
const between = (S, a, b) => a + Math.floor(rand(S) * (b - a + 1));
function pickWeighted(S, table) {
  let tot = 0;
  for (const k in table) tot += table[k];
  let r = rand(S) * tot;
  for (const k in table) { r -= table[k]; if (r < 0) return k; }
  return Object.keys(table)[0];
}
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const round1 = v => Math.round(v * 10) / 10;

// ---------- new game ----------
function newGame(seed, name) {
  seed = (seed == null ? Math.floor(Math.random() * 2 ** 31) : seed) >>> 0;
  const S = {
    v: 1, seed, rs: seed, name: (name || 'Ruth').trim().slice(0, 20) || 'Ruth',
    phase: 'outfit', day: 0, half: 0, lost: 0, wet: true,
    money: D.START_MONEY, wages: 0,
    at: 'indep', to: null, legMi: 0, mi: 0, path: ['indep'],
    wagon: { kind: 'old', cap: WAGONS.old.cap, cond: WAGONS.old.cond },
    team: { kind: 'mules', n: 0, cond: 92 },
    hand: null,
    party: [{ id: 'you', name: '', hp: 100, sick: 0 }],
    inv: [], water: 0, grease: 0,
    pace: 'steady', watch: 'single', caravan: false,
    flags: {}, notes: ['e_outfit', 'e_weight', 'e_jornada', 'e_meat', 'e_customs'], newNotes: [],
    log: [], sold: {}, news: {}, pending: null, over: null,
    stats: { hunts: 0, kills: 0, spoiled: 0, broken: 0, lost: 0, duty: 0, revenue: 0, outfit: 0, gameSold: 0, dry: 0, days: 0 },
  };
  S.party[0].name = S.name;
  return S;
}

// ---------- inventory ----------
function count(S, id) { let n = 0; for (const b of S.inv) if (b.id === id) n += b.n; return round1(n); }
function add(S, id, n) {
  if (!(n > 0)) return;
  const it = ITEMS[id];
  if (it.spoil) {
    const b = S.inv.find(b => b.id === id && b.d === S.day);
    if (b) b.n = round1(b.n + n); else S.inv.push({ id, n: round1(n), d: S.day });
  } else {
    const b = S.inv.find(b => b.id === id);
    if (b) b.n = round1(b.n + n); else S.inv.push({ id, n: round1(n) });
  }
}
// Takes up to n, oldest first. Returns how much it took.
function take(S, id, n) {
  let got = 0;
  const bs = S.inv.filter(b => b.id === id).sort((a, b) => (a.d || 0) - (b.d || 0));
  for (const b of bs) {
    if (got >= n) break;
    const t = Math.min(b.n, n - got);
    b.n = round1(b.n - t); got += t;
  }
  S.inv = S.inv.filter(b => b.n > 0.04);
  return round1(got);
}
function casks(S) { return count(S, 'cask'); }
function waterCap(S) { return casks(S) * D.CASK_GAL; }
function weight(S) {
  let w = 0;
  for (const b of S.inv) w += b.n * ITEMS[b.id].w;
  return Math.round(w + S.water * D.WATER_LB);
}
function goodsWeight(S) { let w = 0; for (const b of S.inv) if (ITEMS[b.id].kind === 'goods') w += b.n * ITEMS[b.id].w; return w; }
function capacity(S) {
  const t = TEAMS[S.team.kind];
  return Math.min(S.wagon.cap, t.pull * S.team.n);
}
function people(S) { return S.party.filter(p => p.hp > 0); }
function hasHand(S, skill) { return !!(S.hand && HANDS[S.hand].skill === skill && S.party.find(p => p.id === S.hand && p.hp > 0)); }
function food(S) {
  let f = 0;
  for (const b of S.inv) if (ITEMS[b.id].food) f += b.n * ITEMS[b.id].food;
  return f;
}
function foodNeed(S) { return D.FOOD_PER_PERSON * people(S).length; }
function dryNeed(S) { return people(S).length * D.WATER_PER_PERSON + S.team.n * TEAMS[S.team.kind].drink; }

// ---------- where we are ----------
function node(S) { return NODES[S.at]; }
function edge(S) { return S.to ? EDGES[S.at + '>' + S.to] : null; }
function region(S) { return S.to && NODES[S.to].region !== node(S).region && S.legMi > edge(S).mi / 2 ? NODES[S.to].region : node(S).region; }
function nextChoices(S) { const n = node(S).next; return n == null ? [] : Array.isArray(n) ? n : [n]; }
function milesLeft(S) { return S.to ? Math.max(0, Math.round(edge(S).mi - S.legMi)) : 0; }
function dateOf(day) { return new Date(D.START + day * 86400000); }
function dateStr(day, long) {
  const d = dateOf(day);
  const M = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const W = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return (long ? W[d.getUTCDay()] + ', ' : '') + M[d.getUTCMonth()] + ' ' + d.getUTCDate() + (long ? ', 1844' : '');
}
function inCaravanRange(S) { return S.caravan; }

// ---------- speed ----------
const PACE = { easy: 0.75, steady: 1, hard: 1.25 };
function loadRatio(S) { return weight(S) / Math.max(1, capacity(S)); }
function speed(S) {
  const t = TEAMS[S.team.kind];
  if (S.team.n < t.min) return 0;
  const e = edge(S) || EDGES[S.at + '>' + nextChoices(S)[0]] || {};
  const r = loadRatio(S);
  const load = r <= 0.7 ? 1 : r <= 1 ? 1 - 0.1 * (r - 0.7) / 0.3 : Math.max(0, 0.9 - (r - 1) * 1.5);
  let v = t.speed * PACE[S.pace] * (0.55 + 0.45 * S.team.cond / 100) * load * (e.slow || 1);
  v *= 0.85 + 0.15 * S.wagon.cond / 100;
  if (S.watch === 'double') v *= 0.95;
  if (S.caravan) v = Math.min(v, 15 * (e.slow || 1));
  return round1(v);
}

// ---------- logging ----------
function log(S, text, kind) { S.log.push({ day: S.day, text, kind: kind || '' }); if (S.log.length > 400) S.log.splice(0, S.log.length - 400); }
function note(S, id) { if (!S.notes.includes(id)) { S.notes.push(id); S.newNotes.push(id); return true; } return false; }

// ---------- money and markets ----------
function marketAt(S) { return node(S).market && !S.to ? node(S).market : null; }
function inNM(S) { return node(S).region === 'nm'; }
function buyPrice(S, mk, id) {
  let p = MARKETS[mk].sells[id];
  if (p == null) return null;
  if (hasHand(S, 'trade') && mk !== 'indep') p *= 0.9;
  return p;
}
function sellPrice(S, mk, id, extra) {
  if (mk === 'indep') return S.phase === 'outfit' ? MARKETS.indep.sells[id] : null;
  const b = MARKETS[mk].buys[id];
  if (!b) return null;
  const sold = ((S.sold[mk] || {})[id] || 0) + (extra || 0);
  let p = b[0] * (mk === 'santafe' || mk === 'vegas' ? (S.news[id] || 1) : 1);
  if (hasHand(S, 'trade') && (mk === 'santafe' || mk === 'vegas')) p *= 1.08;
  return p * Math.max(D.PRICE_FLOOR, 1 - 0.5 * sold / b[1]);
}
function buy(S, mk, id, n) {
  n = n || 1;
  const p = buyPrice(S, mk, id);
  if (p == null) return 'Not sold here.';
  const cost = Math.round(p * n * 100) / 100;
  if (cost > S.money + 1e-9) return 'Not enough money.';
  S.money = Math.round((S.money - cost) * 100) / 100;
  if (S.phase === 'outfit') S.stats.outfit += cost;
  add(S, id, n);
  return '';
}
function sell(S, mk, id, n) {
  n = Math.min(n || 1, count(S, id));
  if (n <= 0) return 0;
  let got = 0;
  for (let i = 0; i < n; i++) {
    const p = sellPrice(S, mk, id);
    if (p == null) return 0;
    got += p;
    if (mk !== 'indep') { S.sold[mk] = S.sold[mk] || {}; S.sold[mk][id] = (S.sold[mk][id] || 0) + 1; }
  }
  take(S, id, n);
  got = Math.round(got * 100) / 100;
  S.money = Math.round((S.money + got) * 100) / 100;
  if (S.phase === 'outfit') S.stats.outfit -= got;
  else { S.stats.revenue += got; if (ITEMS[id].kind === 'game') S.stats.gameSold += got; }
  return got;
}
// value of n units if sold now, without selling
function quote(S, mk, id, n) { let v = 0; for (let i = 0; i < n; i++) { const p = sellPrice(S, mk, id, i); if (p == null) return null; v += p; } return v; }

// ---------- outfitting (full refunds until you roll out) ----------
function setTeam(S, kind, n) {
  if (S.phase !== 'outfit') return 'Too late.';
  const t = TEAMS[kind];
  n = clamp(n, 0, t.max);
  const refund = TEAMS[S.team.kind].price * S.team.n;
  const cost = t.price * n;
  if (cost - refund > S.money + 1e-9) return 'Not enough money.';
  S.money = Math.round((S.money + refund - cost) * 100) / 100;
  S.stats.outfit += cost - refund;
  S.team.kind = kind; S.team.n = n;
  return '';
}
function setWagon(S, kind) {
  if (S.phase !== 'outfit' || S.wagon.kind === kind) return '';
  const delta = WAGONS[kind].price - WAGONS[S.wagon.kind].price;
  if (delta > S.money + 1e-9) return 'Not enough money.';
  S.money = Math.round((S.money - delta) * 100) / 100;
  S.stats.outfit += delta;
  S.wagon = { kind, cap: WAGONS[kind].cap, cond: WAGONS[kind].cond };
  return '';
}
function hire(S, id) {
  if (S.phase !== 'outfit') return;
  S.party = S.party.filter(p => p.id === 'you');
  S.hand = id || null;
  if (id) S.party.push({ id, name: HANDS[id].name.split(' ')[0], hp: 100, sick: 0 });
}
// A sensible starting list, from Elias's ledger: supplies only, no trade goods.
function eliasList(S) {
  const want = { provisions: 360, powder: 10, salt: 15, medicine: 1, cask: 8, axle: 1, grease: 7 };
  if (S.team.n === 0) setTeam(S, 'mules', TEAMS.mules.start);
  for (const id in want) { const need = want[id] - count(S, id); if (need > 0) buy(S, 'indep', id, need); }
}
function rollOut(S) {
  if (S.phase !== 'outfit') return '';
  const t = TEAMS[S.team.kind];
  if (S.team.n < t.min) return `You need at least ${t.min} ${t.many} to move the wagon.`;
  if (speed({ ...S, to: 'grove' }) <= 0.5) return 'The team cannot move this load. Take something off.';
  S.phase = 'trail';
  S.water = waterCap(S);
  S.to = null;
  S.wet = true;
  if (count(S, 'grease') > 0) { take(S, 'grease', 1); S.grease = 7; }
  log(S, `Rolled out of Independence with ${S.team.n} ${S.team.n === 1 ? t.one : t.many}${S.hand ? ' and ' + HANDS[S.hand].name : ''}, bound for Santa Fe.`, 'big');
  depart(S, 'grove');
  return '';
}

// ---------- the trail ----------
function depart(S, to) {
  if (S.to || S.phase !== 'trail') return false;
  const ch = nextChoices(S);
  if (!ch.includes(to)) return false;
  S.to = to; S.legMi = 0;
  if (S.at === 'caches') {
    if (to === 'bent' && S.caravan && !S.flags.splitNote) { S.flags.splitNote = 1; log(S, 'Most of the caravan turns south for the Cimarron. You go on up the river with four wagons bound for Bent\'s Fort.'); }
    if (to === 'lspring') note(S, 'f_jornada');
  }
  return true;
}
function arrive(S) {
  S.at = S.to; S.to = null; S.legMi = 0;
  S.path.push(S.at);
  const n = node(S);
  log(S, `Reached ${n.name}${n.sub ? ', ' + n.sub : ''}.`, 'big');
  openEvent(S, 'arrive_' + S.at, true);
}

// Morning: what the day's road holds.
function newDay(S) {
  S.day++; S.stats.days++;
  S.half = Math.min(2, S.lost); S.lost = 0;
  const e = edge(S);
  S.wet = !S.to ? !!node(S).water || (S.at === 'indep' || S.at === 'grove') : chance(S, e.water);
  spoil(S);
}

function spoil(S) {
  const gone = {};
  S.inv = S.inv.filter(b => {
    const it = ITEMS[b.id];
    if (it.spoil && S.day - b.d >= it.spoil) { gone[b.id] = (gone[b.id] || 0) + b.n; return false; }
    return true;
  });
  for (const id in gone) {
    const it = ITEMS[id];
    S.stats.spoiled += gone[id] * it.w;
    log(S, `${round1(gone[id])} ${it.unit === 'lb' ? 'lb of ' + it.name.toLowerCase() : it.name.toLowerCase() + (gone[id] > 1 ? 's' : '')} spoiled and went over the side.`, 'bad');
  }
}

// One day: travel what's left of it, then evening and night.
function travel(S) {
  if (S.pending || S.over || S.phase !== 'trail') return { err: 'busy' };
  if (!S.to) {
    const ch = nextChoices(S);
    if (ch.length !== 1) return { err: 'choose' };
    depart(S, ch[0]);
  }
  if (S.team.n < TEAMS[S.team.kind].min) { S.pending = { type: 'event', id: 'stranded', ctx: {} }; startEvent(S); return { err: 'team' }; }
  const v = speed(S);
  if (v < 0.5) return { err: 'load' };
  const left = 2 - S.half;
  let mi = v * left / 2, arrived = false;
  if (left > 0) {
    const remain = edge(S).mi - S.legMi;
    if (mi >= remain - 0.05) { mi = remain; arrived = true; }
    S.legMi += mi; S.mi += mi;
    S.half = 2;
  }
  const rough = edge(S).rough;
  if (arrived) arrive(S);
  endDay(S, mi, rough);
  return { mi };
}

// Spend half a day in camp. Returns a line for the journal, or an error starting with '!'.
function camp(S, act) {
  if (S.pending || S.over || S.phase !== 'trail') return '!busy';
  if (S.half >= 2) return '!The day is spent. Travel on or make camp for the night.';
  const r = region(S);
  let msg = '';
  switch (act) {
    case 'hunt': {
      const gp = hasHand(S, 'hunt') ? 0.85 : 0.55;
      if (count(S, 'powder') < 1) return '!No powder.';
      const g = pickWeighted(S, HUNT[r]);
      S.stats.hunts++;
      if (g === 'none') { take(S, 'powder', hasHand(S, 'hunt') ? 0.5 : 1); msg = 'Hunted half the day and saw nothing worth a shot.'; break; }
      const G = GAME[g];
      const need = hasHand(S, 'hunt') ? Math.max(1, G.powder - 1) : G.powder;
      take(S, 'powder', Math.min(need, count(S, 'powder')));
      if (!chance(S, gp)) { msg = `Stalked ${G.the} for hours and missed.`; break; }
      if (G.danger && chance(S, hasHand(S, 'hunt') ? 0.15 : 0.35)) {
        const p = people(S)[S.hand && hasHand(S, 'hunt') ? 1 : 0];
        p.hp = Math.max(1, p.hp - between(S, 20, 40));
        msg = `The ${G.name} charged before it fell. ${p.id === 'you' ? 'You were' : p.name + ' was'} badly mauled. `;
      }
      S.stats.kills++;
      S.pending = { type: 'butcher', game: g, msg: msg + `Brought down ${G.the}.` };
      msg = '';
      break;
    }
    case 'jerk': {
      const m = count(S, 'meat');
      if (m < 1) return '!No fresh meat to jerk.';
      take(S, 'meat', m); add(S, 'jerky', round1(m / 3));
      msg = `Cut ${m} lb of meat into strips and dried it on lines: ${round1(m / 3)} lb of jerky.`;
      break;
    }
    case 'dry': {
      const h = count(S, 'hide_g');
      if (h < 1) return '!No green hides.';
      take(S, 'hide_g', h); add(S, 'hide_d', h);
      msg = `Staked out ${h} hide${h > 1 ? 's' : ''}, scraped and dried ${h > 1 ? 'them' : 'it'}.`;
      break;
    }
    case 'repair': {
      const cap = hasHand(S, 'repair') ? 100 : 88;
      if (S.wagon.cond >= cap) return '!The wagon is as sound as you can make it out here.';
      const up = hasHand(S, 'repair') ? 22 : 12;
      S.wagon.cond = Math.min(cap, S.wagon.cond + up);
      msg = 'Tightened tyres, wedged loose spokes and soaked the wheels in the creek.';
      if (!S.wet) msg = 'Tightened tyres and wedged loose spokes. (No creek to soak the wheels in.)';
      break;
    }
    case 'rest': {
      for (const p of people(S)) { p.hp = Math.min(100, p.hp + 4); if (p.sick && chance(S, 0.3)) { p.sick = 0; log(S, `${p.id === 'you' ? 'You are' : p.name + ' is'} over the fever.`, 'good'); } }
      S.team.cond = Math.min(100, S.team.cond + 3);
      msg = 'Rested in camp while the stock grazed.';
      break;
    }
    case 'dig': {
      if (S.wet) return '!There is water already.';
      if (!(edge(S) && edge(S).dig)) return '!No riverbed here to dig in.';
      if (chance(S, 0.6)) { S.wet = true; msg = 'Dug in the dry bed of the Cimarron. At two feet the sand turned dark, then wet, and water seeped in. Enough for the stock.'; note(S, 'f_cimarron'); }
      else msg = 'Dug three holes in the riverbed. Damp sand, and nothing more.';
      break;
    }
    case 'cut': {
      if (S.at !== 'grove' || S.to) return '!No timber here.';
      if ((S.flags.cut || 0) >= 2) return '!You have cut all the good timber you can find near camp.';
      S.flags.cut = (S.flags.cut || 0) + 1;
      add(S, 'axle', 1);
      msg = 'Felled a straight hickory and hewed a spare axletree from it.';
      break;
    }
    default: return '!?';
  }
  S.half++;
  if (S.caravan && S.half >= 2 && !S.flags.waitedFor) {
    S.caravan = false;
    log(S, 'The caravan would not wait a whole day. It rolled on without you.', 'bad');
  }
  if (msg) log(S, msg);
  return msg;
}

function saltDown(S) {
  const m = count(S, 'meat'), t = count(S, 'tongue');
  const need = Math.ceil(m / 10) + Math.ceil(t / 2);
  if (!m && !t) return '!Nothing fresh to salt.';
  if (count(S, 'salt') < need) return `!You need ${need} lb of salt for that.`;
  take(S, 'salt', need);
  take(S, 'meat', m); add(S, 'saltmeat', m);
  take(S, 'tongue', t); add(S, 'tongue_s', t);
  const msg = `Salted down ${[m ? m + ' lb of meat' : '', t ? t + ' tongue' + (t > 1 ? 's' : '') : ''].filter(Boolean).join(' and ')}.`;
  log(S, msg);
  return msg;
}
function fillCasks(S) {
  if (!S.wet) return '!No water here.';
  const cap = waterCap(S);
  if (S.water >= cap) return '!The casks are full.';
  S.water = cap;
  return '';
}
function setWater(S, gal) {
  gal = clamp(Math.round(gal), 0, waterCap(S));
  if (gal > S.water && !S.wet) return '!No water here.';
  S.water = gal;
  return '';
}
function drop(S, id, n) {
  if (S.phase !== 'trail' || S.pending && S.pending.type !== 'lighten') return 0;
  const got = take(S, id, n);
  if (id === 'cask') S.water = Math.min(S.water, waterCap(S));
  if (got > 0) { log(S, `Left ${got} ${ITEMS[id].unit === 'lb' ? 'lb of ' + ITEMS[id].name.toLowerCase() : ITEMS[id].name.toLowerCase()} beside the trail.`); S.stats.lost += got * (ITEMS[id].price || 0); }
  return got;
}
function setPace(S, p) { if (PACE[p]) S.pace = p; }
function setWatch(S, w) { if (w === 'single' || w === 'double') S.watch = w; }

function butcher(S, picks) {
  const P = S.pending;
  if (!P || P.type !== 'butcher') return;
  const G = GAME[P.game];
  const took = [];
  for (const part of G.parts) {
    const n = clamp(Math.round(+picks[part.id] || 0), 0, part.max);
    if (n > 0) { add(S, part.id, n); took.push(ITEMS[part.id].unit === 'lb' || ITEMS[part.id].unit === 'gallon' ? `${n} ${ITEMS[part.id].unit} of ${part.label.toLowerCase()}` : part.label.toLowerCase()); }
  }
  log(S, P.msg + (took.length ? ' Took ' + took.join(', ') + '.' : ' Left it where it fell.'), 'good');
  S.pending = null;
  if (P.then) openEvent(S, P.then);
}

// ---------- evening and night ----------
function endDay(S, mi, rough) {
  const t = TEAMS[S.team.kind];
  const ppl = people(S);
  const traveled = mi > 0;
  const e = edge(S) || {};
  const grass = S.to ? e.grass : 2;
  const atWater = S.wet || (!S.to && node(S).water);

  // food: freshest-to-spoil first
  let need = foodNeed(S);
  const order = S.inv.filter(b => ITEMS[b.id].food).sort((a, b) => ((a.d ?? 1e9) + (ITEMS[a.id].spoil || 1e9)) - ((b.d ?? 1e9) + (ITEMS[b.id].spoil || 1e9)));
  for (const b of order) {
    if (need <= 0) break;
    const f = ITEMS[b.id].food;
    const use = Math.min(b.n, need / f);
    b.n = round1(b.n - use); need -= use * f;
  }
  S.inv = S.inv.filter(b => b.n > 0.04);
  const hungry = need > 0.1 ? need / foodNeed(S) : 0;

  // water
  let thirst = 0;
  if (!atWater) {
    S.stats.dry++;
    const dn = dryNeed(S);
    const got = Math.min(S.water, dn);
    S.water = round1(S.water - got);
    thirst = dn > 0 ? 1 - got / dn : 0;
  }

  // the team
  let dc = traveled ? [-1, 0.5, 1.5][grass] : [1, 2, 3][grass];
  if (traveled) dc += { easy: 1.5, steady: 0, hard: -2.5 }[S.pace];
  const r = loadRatio(S);
  if (traveled && r > 1) dc -= (r - 1) * 15;
  dc -= thirst * 30;
  if (hasHand(S, 'trade') && S.team.kind === 'mules') dc += 0.7;
  if (traveled && rough > 2) dc -= 3;
  S.team.cond = clamp(S.team.cond + dc, 0, 100);
  if (S.team.cond < 22 && S.team.n > 0 && chance(S, (22 - S.team.cond) / 35)) {
    S.team.n--; S.stats.lost += t.price;
    log(S, `One of the ${t.many} gave out and could not be got up again. ${S.team.n} left.`, 'bad');
  }

  // people
  for (const p of ppl) {
    let d = hungry || thirst ? 0 : 1;
    d -= hungry * 12 + thirst * 16;
    if (p.sick) d -= 4;
    if (traveled && S.pace === 'hard') d -= 1;
    if (S.watch === 'double') d -= 0.7;
    if (!traveled) d += 1;
    p.hp = clamp(p.hp + d, 0, 100);
    if (p.sick && chance(S, traveled ? 0.08 : 0.2)) { p.sick = 0; log(S, `${p.id === 'you' ? 'You are' : p.name + ' is'} over the fever.`, 'good'); }
  }
  if (hungry > 0.05) log(S, hungry > 0.6 ? 'Nothing to eat tonight.' : 'Short rations tonight.', 'bad');
  if (thirst > 0.05) log(S, thirst > 0.6 ? 'No water for the stock tonight. They stood and bawled till dawn.' : 'The stock went short of water.', 'bad');
  for (const p of ppl) if (p.hp <= 0) {
    if (p.id === 'you') { S.over = { kind: 'dead' }; log(S, 'You died on the trail.', 'bad'); return; }
    log(S, `${HANDS[p.id].name} died in the night. You buried him beside the trail.`, 'bad');
  }

  // the wagon
  if (traveled) {
    if (S.grease <= 0) {
      if (count(S, 'grease') >= 1) { take(S, 'grease', 1); S.grease = 7; }
      else if (count(S, 'tallow') >= 6) { take(S, 'tallow', 6); S.grease = 7; log(S, 'Greased the hubs with tallow.'); }
    }
    const greased = S.grease > 0;
    if (greased) S.grease--;
    else if (!S.flags.dryHub) { S.flags.dryHub = 1; log(S, 'Out of wheel grease. The hubs are shrieking.', 'bad'); }
    let wear = 0.45 * rough * (greased ? 1 : 2.2) * (r > 1 ? 1 + (r - 1) * 2 : 1) * (S.pace === 'hard' ? 1.3 : 1) * (hasHand(S, 'repair') ? 0.7 : 1);
    S.wagon.cond = clamp(S.wagon.cond - wear, 0, 100);
    if (count(S, 'glass') > 0 && chance(S, Math.max(0, rough - 1) * 0.22 + (S.pace === 'hard' ? 0.04 : 0))) {
      const n = Math.min(count(S, 'glass'), 1 + Math.floor(rand(S) * Math.min(3, count(S, 'glass') / 8)));
      take(S, 'glass', n); S.stats.broken += n;
      log(S, `A jolt in the ruts. ${n} box${n > 1 ? 'es' : ''} of looking glasses broke.`, 'bad');
    }
    const pb = (0.004 + Math.max(0, 65 - S.wagon.cond) / 65 * 0.07) * rough;
    if (!S.pending && (S.wagon.cond <= 0 || chance(S, pb))) {
      const part = pickWeighted(S, { axle: 5, wheel: 3.5, tongue: 1.5 });
      S.pending = { type: 'event', id: 'breakdown', ctx: { part } };
    }
  }

  if (S.hand && S.party.find(p => p.id === S.hand && p.hp > 0)) S.wages = round1(S.wages + HANDS[S.hand].wage);

  // night
  if (!S.pending && !S.over) night(S);
  newDay(S);
  if (S.team.n < t.min && !S.pending && !S.over) S.pending = { type: 'event', id: 'stranded', ctx: {} };
  if (!S.pending && !S.over) dayEvent(S);
  if (S.pending && S.pending.type === 'event' && S.pending.text == null) startEvent(S);
}

function night(S) {
  const e = edge(S) || {};
  const d = S.to ? e.danger : (EDGES[S.at + '>' + nextChoices(S)[0]] || {}).danger || 0;
  let p = 0.05 * d * (S.watch === 'double' ? 0.35 : 1) * (S.caravan ? 0.45 : 1) * (S.team.kind === 'oxen' ? 0.5 : 1) * ((S.flags.wary || 0) > S.day ? 3 : 1);
  if (S.team.n > 0 && chance(S, p)) { S.pending = { type: 'event', id: 'raid', ctx: {} }; return; }
  const r = region(S);
  if (count(S, 'meat') >= 15 && (r === 'mixed' || r === 'plains' || r === 'dry') && chance(S, 0.16)) { S.pending = { type: 'event', id: 'wolves', ctx: {} }; return; }
}

function dayEvent(S) {
  const r = region(S);
  const p = S.to ? 0.22 : 0.06;
  if (!chance(S, p)) return;
  const pool = {};
  for (const ev of EVENTS) {
    if (ev.kind !== 'day') continue;
    if (ev.once && S.flags['ev_' + ev.id]) continue;
    if (ev.regions && !ev.regions.includes(r)) continue;
    if (ev.when && !ev.when(S, H)) continue;
    pool[ev.id] = ev.w || 1;
  }
  const ids = Object.keys(pool);
  if (!ids.length) return;
  S.pending = { type: 'event', id: pickWeighted(S, pool), ctx: {} };
}

// ---------- events ----------
function openEvent(S, id, quiet) {
  const ev = EVENT_BY_ID[id];
  if (!ev) { if (!quiet) console.warn('no event', id); return false; }
  if (ev.when && !ev.when(S, H)) return false;
  S.pending = { type: 'event', id, ctx: {} };
  startEvent(S);
  return true;
}
function startEvent(S) {
  const P = S.pending, ev = EVENT_BY_ID[P.id];
  if (ev.once) S.flags['ev_' + ev.id] = 1;
  if (ev.setup) ev.setup(S, H, P.ctx);
  P.title = typeof ev.title === 'function' ? ev.title(S, H, P.ctx) : ev.title;
  P.text = ev.text(S, H, P.ctx);
  P.scene = ev.scene || null;
  P.choices = ev.choices(S, H, P.ctx).filter(c => !c.hide).map(c => ({ label: c.label, hint: c.hint || '', off: c.off || '' }));
  P.result = null;
  if (!P.choices.length) P.choices = [{ label: 'Go on', hint: '', off: '' }];
}
function choose(S, i) {
  const P = S.pending;
  if (!P || P.type !== 'event' || P.result != null) return;
  const ev = EVENT_BY_ID[P.id];
  const list = ev.choices(S, H, P.ctx).filter(c => !c.hide);
  const c = list[i];
  if (!c && list.length) return;
  if (c && c.off) return;
  let res = c && c.do ? c.do(S, H, P.ctx) : '';
  if (typeof res === 'string' || res == null) res = { text: res || '' };
  if (res.text) log(S, res.text, res.kind || '');
  P.result = res.text || '';
  P.next = res.next || null;
  if (!P.result) return resolve(S);
}
function resolve(S) {
  const P = S.pending;
  if (!P) return;
  S.pending = null;
  const n = P.next;
  if (!n) return;
  if (n.butcher) S.pending = { type: 'butcher', game: n.butcher, msg: n.msg || '', then: n.then || null };
  else if (n.event) openEvent(S, n.event);
}

// ---------- the end ----------
function finish(S) {
  if (S.at !== 'santafe' || S.pending || S.over) return;
  openEvent(S, 'elias');
}
function settle(S, stay) {
  const wages = S.wages;
  const cash = S.money - wages;
  const net = Math.round(cash - D.NOTE);
  let grade;
  if (net >= 900) grade = 'A fortune';
  else if (net >= 450) grade = 'A good season';
  else if (net >= 150) grade = 'Something to show for it';
  else if (net >= 0) grade = 'Square with the world';
  else if (net >= -400) grade = 'Still in debt';
  else grade = 'Ruined';
  const goodsLeft = S.inv.filter(b => ITEMS[b.id].kind === 'goods').reduce((a, b) => a + b.n, 0);
  S.over = { kind: 'done', stay: !!stay, wages, cash: Math.round(cash), net, grade, goodsLeft, days: S.day, miles: Math.round(S.mi) };
}

// ---------- helpers handed to events ----------
const H = { rand, chance, between, pickWeighted, clamp, count, add, take, weight, capacity, people, hasHand, food, log, note, region, node, edge, dateStr, ITEMS, TEAMS, HANDS, NODES, D, quote, waterCap, loadRatio, goodsWeight, settle };
const EVENTS = makeEvents(H);
const EVENT_BY_ID = {};
for (const ev of EVENTS) EVENT_BY_ID[ev.id] = ev;

function summary(S) {
  const fn = foodNeed(S), dn = dryNeed(S);
  return {
    weight: weight(S), cap: capacity(S), wagonCap: S.wagon.cap, load: loadRatio(S),
    food: food(S), foodDays: fn ? food(S) / fn : 0,
    water: S.water, waterCap: waterCap(S), waterDays: dn ? S.water / dn : 0,
    speed: S.phase === 'trail' ? speed(S) : 0, milesLeft: milesLeft(S),
  };
}

const API = {
  newGame, rand, count, add, take, weight, capacity, goodsWeight, people, food, foodNeed, dryNeed, waterCap, casks, hasHand,
  node, edge, region, nextChoices, milesLeft, dateStr, speed, loadRatio, summary, log, note,
  marketAt, buyPrice, sellPrice, buy, sell, quote, setTeam, setWagon, hire, eliasList, rollOut,
  depart, travel, camp, saltDown, fillCasks, setWater, drop, setPace, setWatch, butcher,
  openEvent, choose, resolve, finish, settle, EVENTS, EVENT_BY_ID, H, PACE,
};
if (isNode) module.exports = API;
else root.WBCore = API;
})(typeof window !== 'undefined' ? window : globalThis);
