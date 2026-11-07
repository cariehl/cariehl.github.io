// Waybill: the page. Outfitting, the trail panel, markets, event sheets, saving and the main loop.
(function () {
'use strict';
const D = window.WBData, C = window.WBCore;
const { ITEMS, TEAMS, WAGONS, HANDS, NODES, EDGES, MARKETS, GAME, NOTES } = D;
const SAVE = 'waybill.v1';
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const money = (v, cents) => '$' + ((cents || Math.abs(v - Math.round(v)) > 0.004) && Math.abs(v) < 100 ? v.toFixed(2) : Math.round(v).toLocaleString('en-US'));
const lb = v => Math.round(v).toLocaleString('en-US') + ' lb';
const plural = (n, one, many) => n === 1 ? one : (many || one + 's');

let S = null, tab = 'trail', view = null, scene = null, autoRun = null, prologue = false, menu = false, howto = false;

// ---------- save ----------
function save() { try { localStorage.setItem(SAVE, JSON.stringify(S)); } catch (e) { /* private mode */ } }
function load() { try { const s = JSON.parse(localStorage.getItem(SAVE)); return s && s.v === 1 ? s : null; } catch (e) { return null; } }
function clearSave() { try { localStorage.removeItem(SAVE); } catch (e) { /* ignore */ } }

function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('on');
  clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('on'), 2600);
}

// ---------- title ----------
function showTitle() {
  $('#title').hidden = false; $('#app').hidden = true; $('#ov').hidden = true;
  const s = load();
  $('#contBtn').hidden = !s || !!s.over;
  if (s && !s.over) $('#nameIn').value = s.name;
}
$('#newBtn').onclick = () => {
  const s = load();
  if (s && !s.over && !confirm('Start a new journey? Your current one will be lost.')) return;
  S = C.newGame(null, $('#nameIn').value);
  prologue = true; tab = 'trail'; view = null;
  save(); start();
};
$('#contBtn').onclick = () => { S = load(); if (!S) return; prologue = false; start(); };

function start() {
  $('#title').hidden = true; $('#app').hidden = false;
  if (!scene) scene = WBScene.live($('#cv'));
  render();
}

// ---------- rendering ----------
function sceneOpts() {
  const n = C.node(S);
  const P = S.pending;
  const region = C.region(S);
  let landmark = !S.to ? n.scene : null;
  if (S.to && C.milesLeft(S) < 12) landmark = NODES[S.to].scene;
  let sc = P && P.type === 'event' ? P.scene : null;
  const time = sc === 'night' ? 'night' : sc === 'camp' ? 'dusk' : 'day';
  return { region, landmark, scene: sc, time, team: { kind: S.team.kind, n: S.team.n } };
}

function render() {
  if (!S) return;
  // header
  $('#date').textContent = C.dateStr(S.day);
  $('#dayN').textContent = S.phase === 'outfit' ? 'Outfitting' : 'Day ' + (S.day + 1);
  const n = C.node(S);
  if (S.to) { $('#place').textContent = 'To ' + NODES[S.to].name; $('#placeSub').textContent = `${C.milesLeft(S)} miles on · ${Math.round(S.mi)} from Independence`; }
  else { $('#place').textContent = n.name; $('#placeSub').textContent = n.sub || (S.phase === 'outfit' ? 'Missouri' : ''); }
  $('#money').textContent = money(S.money);
  scene.set(sceneOpts());
  $('#stageLabel').textContent = S.phase === 'outfit' ? 'Independence, Missouri · May 1844' : S.to ? `${Math.round(S.legMi)} of ${EDGES[S.at + '>' + S.to].mi} miles to ${NODES[S.to].name}` : n.name;
  renderGauges();
  document.querySelectorAll('.tab').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
  document.querySelector('.tab[data-tab="ledger"] .dot').hidden = !S.newNotes.length;
  const P = $('#panel');
  const html = tab === 'trail' ? (S.phase === 'outfit' ? outfitHTML() : view === 'market' ? marketHTML() : trailHTML())
    : tab === 'wagon' ? wagonHTML() : tab === 'party' ? partyHTML() : tab === 'map' ? mapHTML() : ledgerHTML();
  P.innerHTML = html;
  if (window.innerWidth > 820) $('#mapWrap').innerHTML = mapHTML(true);
  if (tab === 'ledger' && S.newNotes.length) { setTimeout(() => { S.newNotes = []; save(); document.querySelector('.tab[data-tab="ledger"] .dot').hidden = true; }, 1500); }
  renderOverlay();
}

function bar(frac, warnAt, badAt, invert) {
  frac = Math.max(0, Math.min(1, frac));
  let cls = '';
  if (invert) { if (frac > badAt) cls = 'bad'; else if (frac > warnAt) cls = 'warn'; }
  else { if (frac < badAt) cls = 'bad'; else if (frac < warnAt) cls = 'warn'; }
  return `<div class="bar"><i class="${cls}" style="width:${(frac * 100).toFixed(1)}%"></i></div>`;
}
function renderGauges() {
  const sm = C.summary(S);
  const outfit = S.phase === 'outfit';
  const w = outfit ? sm.weight + sm.waterCap * D.WATER_LB : sm.weight;
  const cap = sm.cap || 1;
  const t = TEAMS[S.team.kind];
  const ppl = C.people(S);
  const hp = ppl.length ? ppl.reduce((a, p) => a + p.hp, 0) / ppl.length : 0;
  const fd = sm.foodDays, wd = sm.waterDays;
  const loadFrac = Math.min(1.5, w / cap) / 1.5;
  $('#gauges').innerHTML = `
    <div class="g wide"><div class="gl"><span>Load ${outfit ? '(casks full)' : ''}</span><b>${lb(w)} / ${lb(cap)}</b></div>
      <div class="bar load"><i class="${w > cap ? 'bad' : w > cap * 0.9 ? 'warn' : ''}" style="width:${(loadFrac * 100).toFixed(1)}%"></i><em style="left:${(100 / 1.5).toFixed(1)}%"></em></div></div>
    <div class="g"><div class="gl"><span>${S.team.n} ${plural(S.team.n, t.one, t.many)}</span><b>${Math.round(S.team.cond)}%</b></div>${bar(S.team.cond / 100, 0.55, 0.3)}</div>
    <div class="g"><div class="gl"><span>Wagon</span><b>${Math.round(S.wagon.cond)}%</b></div>${bar(S.wagon.cond / 100, 0.5, 0.25)}</div>
    <div class="g"><div class="gl"><span>Food</span><b>${fd >= 99 ? '99+' : fd.toFixed(fd < 10 ? 1 : 0)} days</b></div>${bar(fd / 30, 0.25, 0.1)}</div>
    <div class="g"><div class="gl"><span>Water ${outfit ? '' : S.wet ? '· here' : '· none here'}</span><b>${outfit ? sm.waterCap : Math.round(sm.water)} gal</b></div>${bar(sm.waterCap ? (outfit ? 1 : sm.water / sm.waterCap) : 0, 0.4, 0.15)}</div>
    <div class="g wide"><div class="gl"><span>Health${ppl.some(p => p.sick) ? ' · fever' : ''}</span><b>${ppl.map(p => p.name.split(' ')[0] + ' ' + Math.round(p.hp)).join(' · ')}</b></div>${bar(hp / 100, 0.6, 0.3)}</div>`;
}

// ---------- outfitting ----------
function qtyCtl(act, id, n, steps) {
  return `<td class="ctl">${steps.map(s => `<button class="mini" data-act="${act}:${id}:${-s}" ${n < 1 ? 'disabled' : ''}>−${s > 1 ? s : ''}</button>`).join('')}<span class="qty">${n}</span>${steps.map(s => `<button class="mini" data-act="${act}:${id}:${s}">+${s > 1 ? s : ''}</button>`).reverse().join('')}</td>`;
}
const STEP = { provisions: 50, salt: 5, powder: 5, medicine: 1, cask: 1, axle: 1, wheel: 1, grease: 1 };
function outfitHTML() {
  const t = TEAMS[S.team.kind];
  let h = `<h2>Outfitting at Independence</h2><p class="sub">Wendell's store, the wagon yards and the mule pens are all on the square. Buy what you need for about sixty days on the road, then fill the wagon with goods to sell in Santa Fe. Until you roll out, anything can go back for what you paid.</p>`;
  h += `<h3>Draft animals</h3><div class="choicecards">${Object.entries(TEAMS).map(([k, v]) => `<button class="ccard ${S.team.kind === k ? 'on' : ''}" data-act="teamkind:${k}"><span class="price">${money(v.price)} ${k === 'oxen' ? 'a yoke' : 'each'}</span><b>${v.name}</b><p>${v.note}</p><p>Pulls ${v.pull} lb ${k === 'oxen' ? 'a yoke' : 'each'} · ${v.speed} mi a day · drinks ${v.drink} gal on a dry day</p></button>`).join('')}</div>
    <table class="ledger"><tr><td><span class="nm">${t.name}</span><small>At least ${t.min}. With ${S.team.n} they can pull ${lb(t.pull * S.team.n)}; the wagon holds ${lb(S.wagon.cap)}.</small></td>${qtyCtl('team', S.team.kind, S.team.n, [1])}</tr></table>`;
  h += `<h3>The wagon</h3><div class="choicecards">${Object.entries(WAGONS).map(([k, v]) => `<button class="ccard ${S.wagon.kind === k ? 'on' : ''}" data-act="wagon:${k}"><span class="price">${v.price ? money(v.price) : 'yours'}</span><b>${v.name}</b><p>${v.note}</p><p>Holds ${lb(v.cap)} · condition ${v.cond}%</p></button>`).join('')}</div>`;
  h += `<h3>A hired hand</h3><p class="sub">Wages are paid in Santa Fe, for every day on the road.</p><div class="choicecards"><button class="ccard ${!S.hand ? 'on' : ''}" data-act="hire:"><b>Go alone</b><p>One mouth to feed and nobody to pay. Nobody to help, either.</p></button>${Object.entries(HANDS).map(([k, v]) => `<button class="ccard ${S.hand === k ? 'on' : ''}" data-act="hire:${k}"><span class="price">${money(v.wage, true)}/day</span><b>${v.name}</b><p>${v.blurb}</p><ul>${v.perks.map(p => `<li>${p}</li>`).join('')}</ul></button>`).join('')}</div>`;
  h += `<h3>Supplies</h3><table class="ledger"><tr><th>Item</th><th class="n">Price</th><th class="n">Weight</th><th class="n">Have</th></tr>`;
  for (const id of ['provisions', 'salt', 'powder', 'medicine', 'cask', 'axle', 'wheel', 'grease']) {
    const it = ITEMS[id];
    h += `<tr><td><span class="nm">${it.name}</span><small>${it.note}</small></td><td class="n">${money(it.price, true)}<small>/${it.unit}</small></td><td class="n">${it.w} lb</td>${qtyCtl('buy', id, C.count(S, id), STEP[id] > 1 ? [STEP[id]] : [1])}</tr>`;
  }
  h += `</table><h3>Trade goods</h3><p class="sub">What a unit usually fetches in Santa Fe is Elias's figure from 1842; the more of one thing you sell, the less it brings.</p><table class="ledger"><tr><th>Goods</th><th class="n">Cost</th><th class="n">Santa Fe</th><th class="n">Have</th></tr>`;
  for (const id of ['calico', 'manta', 'hardware', 'glass', 'notions', 'silk', 'tobacco']) {
    const it = ITEMS[id];
    h += `<tr><td><span class="nm">${it.name}</span><small>${it.w} lb a ${it.unit}. ${it.note}</small></td><td class="n">${money(it.price, true)}</td><td class="n">~${money(MARKETS.santafe.buys[id][0], true)}</td>${qtyCtl('buy', id, C.count(S, id), [10, 1])}</tr>`;
  }
  h += `</table>`;
  const sm = C.summary(S);
  const w = sm.weight + sm.waterCap * D.WATER_LB;
  h += `<div class="sticky"><div class="sum"><b>${money(S.money)}</b> left · <b>${lb(w)}</b> of ${lb(sm.cap)} ${w > sm.cap ? '<span style="color:var(--red)">· overloaded</span>' : ''}<br>Food for ${sm.foodDays.toFixed(0)} days · ${sm.waterCap} gal of casks</div>
    <button class="btn" data-act="elias">Elias's list</button><button class="btn primary" data-act="rollout">Roll out</button></div>`;
  return h;
}

// ---------- the trail ----------
function warnings() {
  const out = [];
  const sm = C.summary(S);
  if (sm.load > 1) out.push(`The wagon is over what the team can pull (${lb(sm.weight)} of ${lb(sm.cap)}). They will slow and wear down every day. Leave something behind on the Wagon tab.`);
  if (sm.foodDays < 4) out.push(`Food for ${sm.foodDays.toFixed(1)} days. Hunt, or buy provisions.`);
  const e = C.edge(S);
  const nextE = !S.to ? EDGES[S.at + '>' + C.nextChoices(S)[0]] : e;
  if (nextE && nextE.dry && sm.waterDays < 3.5) out.push(`The stretch ahead has no water. Your casks hold ${Math.round(sm.water)} gal, about ${sm.waterDays.toFixed(1)} dry days for the party and team.`);
  else if (!S.wet && sm.waterDays < 1.5 && e && e.water < 0.6) out.push(`Water is low: ${Math.round(sm.water)} gal, about ${sm.waterDays.toFixed(1)} dry days.`);
  if (S.team.cond < 35) out.push('The team is worn out. Ease the pace, lighten the load, or rest.');
  if (S.wagon.cond < 30) out.push('The wagon is in poor shape. Repair it before something breaks.');
  if (S.grease <= 0 && C.count(S, 'grease') < 1 && C.count(S, 'tallow') < 6) out.push('No wheel grease. The wagon wears twice as fast. (Six pounds of tallow will do.)');
  for (const b of S.inv) { const it = ITEMS[b.id]; if (it.spoil && it.spoil - (S.day - b.d) <= 1 && b.n > 0) { out.push(`${it.name} goes bad by tomorrow: eat it, salt it, jerk it${b.id === 'hide_g' ? ', dry it' : ''} or lose it.`); break; } }
  return out;
}
function trailHTML() {
  const sm = C.summary(S);
  const n = C.node(S);
  let h = '';
  if (S.over) return '<p class="sub">The journey is over.</p>';
  const ch = !S.to ? C.nextChoices(S) : [];
  if (S.to) {
    const e = C.edge(S);
    const days = sm.speed > 0 ? Math.ceil(C.milesLeft(S) / sm.speed) : '—';
    h += `<h2>Toward ${NODES[S.to].name}</h2><p class="sub">${C.milesLeft(S)} miles on, about ${days} ${plural(days, 'day')} at ${sm.speed.toFixed(1)} miles a day. ${e.note || ''}</p>`;
  } else if (S.at === 'santafe') {
    h += `<h2>Santa Fe</h2><p class="sub">The end of the road. Sell what you carried, then settle up.</p>`;
  } else {
    h += `<h2>${n.name}</h2><p class="sub">${ch.length > 1 ? 'The road forks here.' : `Next: ${NODES[ch[0]].name}, ${EDGES[S.at + '>' + ch[0]].mi} miles. ${EDGES[S.at + '>' + ch[0]].note || ''}`}</p>`;
  }
  for (const w of warnings()) h += `<div class="warnline">${esc(w)}</div>`;
  const half = 2 - S.half;
  if (S.at === 'santafe' && !S.to) {
    h += `<div class="row"><button class="btn primary big" data-act="market">The plaza market</button><button class="btn big" data-act="finish">Settle up and end the journey<small>${C.goodsWeight(S) ? 'You still have goods to sell.' : 'Find Elias.'}</small></button></div>`;
  } else if (ch.length > 1) {
    h += `<div class="row">${ch.map(id => `<button class="btn big" data-act="depart:${id}">${id === 'lspring' ? 'The Cimarron road' : 'The Mountain road'}<small>${EDGES[S.at + '>' + id].note}</small></button>`).join('')}</div>`;
  } else {
    const dest = S.to || ch[0];
    h += `<div class="row"><button class="btn primary big" data-act="travel">${half === 2 ? 'Travel on' : half === 1 ? 'Travel the afternoon' : 'Camp for the night'}<small>${half ? `About ${(sm.speed * half / 2).toFixed(0)} miles` : 'The day is spent'}</small></button>
      <button class="btn big" data-act="auto">Travel to ${NODES[dest].name}<small>Day after day until something happens</small></button></div>`;
  }
  if (C.marketAt(S) && S.at !== 'santafe') h += `<div class="row"><button class="btn" data-act="market">Trade at ${MARKETS[C.marketAt(S)].name}</button></div>`;

  if (S.at !== 'santafe' || S.to) {
    h += `<h3>Make camp · ${half === 2 ? 'a whole day' : half === 1 ? 'half a day' : 'no daylight'} left</h3><div class="acts">`;
    const a = (act, label, hint, ok) => `<button class="btn ${ok && half ? '' : 'off'}" data-act="camp:${act}" ${ok && half ? '' : 'disabled'}>${label}<small>${hint}</small></button>`;
    const hunter = C.hasHand(S, 'hunt');
    h += a('hunt', 'Hunt', `${hunter ? 'Hiram is a dead shot' : '1–2 lb of powder'} · ${C.count(S, 'powder')} lb`, C.count(S, 'powder') >= 1);
    h += a('rest', 'Rest', 'People and stock recover', true);
    h += a('repair', 'Repair the wagon', `Now ${Math.round(S.wagon.cond)}%`, S.wagon.cond < (C.hasHand(S, 'repair') ? 100 : 88));
    if (C.count(S, 'meat')) h += a('jerk', 'Jerk the meat', `${C.count(S, 'meat')} lb becomes ${Math.round(C.count(S, 'meat') / 3)} lb that keeps`, true);
    if (C.count(S, 'hide_g')) h += a('dry', 'Dry the hides', `${C.count(S, 'hide_g')} green, 55 lb each`, true);
    if (S.to && C.edge(S).dig && !S.wet) h += a('dig', 'Dig for water', 'In the dry riverbed', true);
    if (S.at === 'grove' && !S.to) h += a('cut', 'Cut a spare axle', `Free · ${2 - (S.flags.cut || 0)} good trees left`, (S.flags.cut || 0) < 2);
    h += `</div><div class="row">`;
    const meat = C.count(S, 'meat') + C.count(S, 'tongue');
    if (meat) h += `<button class="btn" data-act="salt">Salt down the fresh meat<small>${Math.ceil(C.count(S, 'meat') / 10) + Math.ceil(C.count(S, 'tongue') / 2)} lb of salt · you have ${C.count(S, 'salt')}</small></button>`;
    if (S.wet && S.water < sm.waterCap) h += `<button class="btn" data-act="fill">Fill the casks<small>${Math.round(S.water)} of ${sm.waterCap} gal</small></button>`;
    h += `</div>`;
    h += `<h3>On the road</h3>
      <div class="setting"><label>Pace<small>${{ easy: 'Slower; the team recovers.', steady: 'A fair day\'s march.', hard: 'Faster; wears the team, the people and the wagon.' }[S.pace]}</small></label><div class="seg">${['easy', 'steady', 'hard'].map(p => `<button class="${S.pace === p ? 'on' : ''}" data-act="pace:${p}">${p}</button>`).join('')}</div></div>
      <div class="setting"><label>Night watch<small>${S.watch === 'double' ? 'Two on guard. Raiders rarely get the stock, but everyone is tired.' : 'One on guard, turn and turn about.'}</small></label><div class="seg">${['single', 'double'].map(p => `<button class="${S.watch === p ? 'on' : ''}" data-act="watch:${p}">${p}</button>`).join('')}</div></div>`;
    if (S.caravan) h += `<div class="setting"><label>Travelling with the caravan<small>Safer at night, but no faster than 15 miles a day.</small></label><button class="btn" data-act="leave">Go on alone</button></div>`;
  }
  h += `<h3>Journal</h3>${journalHTML(30)}`;
  return h;
}
function journalHTML(max) {
  const items = S.log.slice(-max).reverse();
  let h = '<div class="journal">', day = null;
  for (const l of items) {
    if (l.day !== day) { if (day !== null) h += '</div>'; day = l.day; h += `<div class="jday"><b>${C.dateStr(l.day, true)}</b>`; }
    h += `<p class="${l.kind}">${esc(l.text)}</p>`;
  }
  if (day !== null) h += '</div>';
  return h + '</div>';
}

// ---------- markets ----------
function marketHTML() {
  const mk = C.marketAt(S);
  if (!mk) { view = null; return trailHTML(); }
  const M = MARKETS[mk];
  let h = `<div class="row"><button class="btn" data-act="closemarket">← Back to the trail</button></div><h2>${M.name}</h2>`;
  h += mk === 'santafe' ? `<p class="sub">Merchants crowd round the wagon on the plaza. Each sale of the same thing brings a little less than the one before.</p>` : `<p class="sub">Prices here are what you would expect this far from anywhere.</p>`;
  const sellable = S.inv.map(b => b.id).filter((id, i, a) => a.indexOf(id) === i && C.sellPrice(S, mk, id) != null);
  h += `<h3>Sell</h3>`;
  if (!sellable.length) h += `<p class="sub">Nothing you carry is wanted here.</p>`;
  else {
    h += `<table class="ledger"><tr><th>Goods</th><th class="n">Each</th><th class="n">All</th><th></th></tr>`;
    for (const id of sellable) {
      const it = ITEMS[id], n = C.count(S, id), whole = Math.floor(n);
      if (whole < 1) continue;
      const p = C.sellPrice(S, mk, id), all = C.quote(S, mk, id, whole);
      h += `<tr><td><span class="nm">${it.name}</span><small>${whole} ${it.unit === 'lb' || it.unit === 'gallon' ? it.unit : plural(whole, it.unit)}${D.MARKETS[mk].buys[id] && mk === 'santafe' && S.news[id] ? (S.news[id] > 1 ? ' · in demand' : ' · glutted') : ''}</small></td><td class="n">${money(p, true)}</td><td class="n">${money(all)}</td>
        <td class="ctl"><button class="mini" data-act="sell:${id}:1">Sell 1</button>${whole >= 10 ? `<button class="mini" data-act="sell:${id}:10">10</button>` : ''}<button class="mini" data-act="sell:${id}:${whole}">All</button></td></tr>`;
    }
    h += `</table>`;
  }
  const buyable = Object.keys(M.sells);
  if (buyable.length || M.animal) {
    h += `<h3>Buy</h3><table class="ledger"><tr><th>Item</th><th class="n">Price</th><th class="n">Have</th><th></th></tr>`;
    for (const id of buyable) {
      const it = ITEMS[id], p = C.buyPrice(S, mk, id), st = STEP[id] || 1;
      h += `<tr><td><span class="nm">${it.name}</span><small>${it.w} lb a ${it.unit}</small></td><td class="n">${money(p, true)}</td><td class="n">${C.count(S, id)}</td><td class="ctl"><button class="mini" data-act="mbuy:${id}:${st}">+${st}</button></td></tr>`;
    }
    if (M.animal) {
      const t = TEAMS[S.team.kind];
      h += `<tr><td><span class="nm">${t.one[0].toUpperCase() + t.one.slice(1)}</span><small>Fresh animals lift the whole team</small></td><td class="n">${money(M.animal)}</td><td class="n">${S.team.n}</td><td class="ctl"><button class="mini" data-act="animal" ${S.team.n >= t.max ? 'disabled' : ''}>+1</button></td></tr>`;
    }
    h += `</table>`;
  }
  if (M.repair) h += `<h3>The blacksmith</h3><div class="row"><button class="btn" data-act="smith" ${S.wagon.cond >= 99 ? 'disabled' : ''}>Have the wagon put right<small>${money(M.repair[0])} · +${M.repair[1]}% (now ${Math.round(S.wagon.cond)}%)</small></button></div>`;
  return h;
}

// ---------- wagon, party, map, ledger ----------
function wagonHTML() {
  const sm = C.summary(S);
  const trail = S.phase === 'trail' && !S.over;
  let h = `<h2>The wagon</h2><p class="sub">${WAGONS[S.wagon.kind].name}, ${Math.round(S.wagon.cond)}% sound. Carrying ${lb(sm.weight)}; the team can pull ${lb(sm.cap)}.${trail ? ' Anything you leave beside the trail is gone for good.' : ''}</p>`;
  const groups = [['supply', 'Supplies'], ['goods', 'Trade goods'], ['game', 'From the land']];
  for (const [k, title] of groups) {
    const rows = S.inv.filter(b => ITEMS[b.id].kind === k).sort((a, b) => Object.keys(ITEMS).indexOf(a.id) - Object.keys(ITEMS).indexOf(b.id) || (a.d || 0) - (b.d || 0));
    if (!rows.length) continue;
    h += `<h3>${title}</h3><table class="ledger"><tr><th>Item</th><th class="n">Qty</th><th class="n">Weight</th>${trail ? '<th></th>' : ''}</tr>`;
    for (const b of rows) {
      const it = ITEMS[b.id];
      const keeps = it.spoil ? it.spoil - (S.day - b.d) : null;
      const q = Math.round(b.n * 10) / 10;
      h += `<tr><td><span class="nm">${it.name}</span><small>${keeps != null ? `Keeps ${keeps} more ${plural(keeps, 'day')}. ` : ''}${it.note}</small></td><td class="n">${q} ${it.unit === 'lb' || it.unit === 'gallon' ? it.unit : ''}</td><td class="n">${lb(b.n * it.w)}</td>`;
      if (trail) { const step = it.unit === 'lb' ? (b.n >= 50 ? 25 : 5) : 1; h += `<td class="ctl"><button class="mini" data-act="drop:${b.id}:${Math.min(step, q)}" title="Leave ${step} behind">−${step > 1 ? step : ''}</button><button class="mini" data-act="drop:${b.id}:${q}">Leave all</button></td>`; }
      h += `</tr>`;
    }
    h += `</table>`;
  }
  if (sm.waterCap) {
    h += `<h3>Water</h3><table class="ledger"><tr><td><span class="nm">Water</span><small>${Math.round(S.water)} of ${sm.waterCap} gallons, ${lb(S.water * D.WATER_LB)}. A dry day costs ${C.dryNeed(S)} gal for the party and team.${trail ? (S.wet ? ' There is water here.' : ' No water here to refill.') : ''}</small></td><td class="n">${Math.round(S.water)} gal</td><td class="n">${lb(S.water * D.WATER_LB)}</td>${trail ? `<td class="ctl"><button class="mini" data-act="pour:20" ${S.water < 1 ? 'disabled' : ''}>Pour out 20</button>${S.wet ? `<button class="mini" data-act="fill">Fill</button>` : ''}</td>` : ''}</tr></table>`;
  }
  return h;
}
function partyHTML() {
  const t = TEAMS[S.team.kind];
  let h = `<h2>The party</h2>`;
  for (const p of S.party) {
    const H = HANDS[p.id];
    h += `<div class="person ${p.hp <= 0 ? 'dead' : ''}"><div class="pic">${p.name[0]}</div><div class="pd"><b>${p.id === 'you' ? esc(p.name) + ' Marsh' : H.name}</b> ${p.hp <= 0 ? '· buried on the trail' : p.sick ? '· down with fever' : ''}<div class="gl" style="display:flex;justify-content:space-between;font-size:13px;color:var(--ink2)"><span>${p.id === 'you' ? 'Elias\'s family, come to settle his affairs' : H.perks.join(' · ')}</span><span>${Math.round(p.hp)}%</span></div>${bar(p.hp / 100, 0.6, 0.3)}</div></div>`;
  }
  if (S.hand) h += `<p class="sub">Wages owed: ${money(S.wages, true)}, at ${money(HANDS[S.hand].wage, true)} a day.</p>`;
  h += `<h3>The team</h3><p>${S.team.n} ${plural(S.team.n, t.one, t.many)}, in ${Math.round(S.team.cond)}% condition. ${t.note}</p><p class="sub">They pull ${t.pull} lb ${S.team.kind === 'oxen' ? 'a yoke' : 'each'}, so ${lb(t.pull * S.team.n)} in all, and need ${t.drink} gal each on a dry day. Below ${t.min} the wagon cannot move.</p>`;
  h += `<h3>The road so far</h3><table class="ledger">
    <tr><td>Days on the road</td><td class="n">${S.stats.days}</td></tr><tr><td>Miles from Independence</td><td class="n">${Math.round(S.mi)}</td></tr>
    <tr><td>Dry camps</td><td class="n">${S.stats.dry}</td></tr><tr><td>Hunts, and kills</td><td class="n">${S.stats.hunts} / ${S.stats.kills}</td></tr>
    <tr><td>Spoiled and thrown out</td><td class="n">${lb(S.stats.spoiled)}</td></tr><tr><td>Looking glasses broken</td><td class="n">${S.stats.broken}</td></tr>
    <tr><td>Sold so far</td><td class="n">${money(S.stats.revenue)}</td></tr><tr><td>Caravan</td><td class="n">${S.caravan ? 'with it' : 'alone'}</td></tr></table>`;
  return h;
}
function mapHTML(compact) {
  const X = x => (100 - x) * 6, Y = y => (y - 22) * 5.2;
  const done = new Set();
  for (let i = 1; i < S.path.length; i++) done.add(S.path[i - 1] + '>' + S.path[i]);
  let s = `<svg viewBox="0 0 600 360" role="img" aria-label="Map of the trail">`;
  s += `<rect width="600" height="360" fill="#e6d8b9"/>`;
  // rivers (drawn freehand)
  s += `<path d="M 600 92 C 520 110, 470 150, 400 158 S 310 180, 260 190 S 160 150, 90 120" fill="none" stroke="#7aa0b5" stroke-width="3" opacity=".7"/>`;
  s += `<text x="300" y="172" font-size="13" fill="#4e7187" font-style="italic">Arkansas River</text>`;
  s += `<path d="M 300 205 C 270 255, 240 250, 200 262" fill="none" stroke="#7aa0b5" stroke-width="2" stroke-dasharray="5 4" opacity=".7"/>`;
  s += `<text x="232" y="282" font-size="12" fill="#4e7187" font-style="italic">Cimarron</text>`;
  s += `<path d="M 30 70 L 70 150 L 40 230 L 70 330" fill="none" stroke="#8a7660" stroke-width="10" stroke-linecap="round" opacity=".18"/>`;
  s += `<text x="16" y="100" font-size="12" fill="#8a7660" font-style="italic" transform="rotate(-70 16 100)">Rocky Mountains</text>`;
  for (const k in EDGES) {
    const [a, b] = k.split('>'), A = NODES[a], B = NODES[b];
    const on = done.has(k), cur = S.at === a && S.to === b;
    s += `<line x1="${X(A.x)}" y1="${Y(A.y)}" x2="${X(B.x)}" y2="${Y(B.y)}" stroke="${on || cur ? '#8c2f1d' : '#8a7660'}" stroke-width="${on || cur ? 3 : 1.5}" ${on || cur ? '' : 'stroke-dasharray="4 4"'}/>`;
    if (cur) { const f = S.legMi / EDGES[k].mi; s += `<circle cx="${X(A.x + (B.x - A.x) * f)}" cy="${Y(A.y + (B.y - A.y) * f)}" r="7" fill="#2b2118" stroke="#efe4cc" stroke-width="2"/>`; }
  }
  for (const id in NODES) {
    const n = NODES[id], here = S.at === id && !S.to, seen = S.path.includes(id);
    s += `<circle cx="${X(n.x)}" cy="${Y(n.y)}" r="${here ? 7 : 4}" fill="${here ? '#2b2118' : seen ? '#8c2f1d' : '#efe4cc'}" stroke="#2b2118" stroke-width="1.5"/>`;
    const right = n.x < 50;
    const big = ['indep', 'grove', 'caches', 'bent', 'santafe', 'vegas', 'raton', 'rock', 'lspring', 'mound'].includes(id);
    if (!compact || big || here || (S.to === id)) s += `<text x="${X(n.x) + (right ? -9 : 9)}" y="${Y(n.y) + (id === 'diamond' || id === 'pfork' || id === 'mspring' ? 14 : -6)}" font-size="${big ? 14 : 12}" fill="#2b2118" text-anchor="${right ? 'end' : 'start'}">${n.name}</text>`;
  }
  s += `<text x="590" y="350" font-size="12" text-anchor="end" fill="#8a7660">MISSOURI →</text><text x="12" y="350" font-size="12" fill="#8a7660">← NEW MEXICO</text>`;
  s += `<g transform="translate(570 270)"><text font-size="13" text-anchor="middle" fill="#5a4836">N</text><line x1="0" y1="4" x2="0" y2="24" stroke="#5a4836"/></g>`;
  s += `</svg>`;
  return `<div class="map">${compact ? '' : `<h2>The road to Santa Fe</h2><p class="sub">${Math.round(S.mi)} miles behind you.</p>`}${s}</div>`;
}
function ledgerHTML() {
  let h = `<h2>Elias's ledger</h2><p class="sub">His entries, and the notes you have added in the back pages.</p>`;
  const ids = [...S.notes].reverse();
  const field = ids.filter(id => NOTES[id].src === 'field'), elias = ids.filter(id => NOTES[id].src === 'elias').reverse();
  if (field.length) h += `<h3>Your notes</h3>` + field.map(id => `<div class="note ${id.startsWith('c_') ? 'clue' : ''} ${S.newNotes.includes(id) ? 'new' : ''}"><h4>${NOTES[id].title}</h4><p>${esc(NOTES[id].text)}</p></div>`).join('');
  h += `<h3>In Elias's hand</h3>` + elias.map(id => `<div class="note elias"><h4>${NOTES[id].title}</h4><p>${esc(NOTES[id].text)}</p></div>`).join('');
  return h;
}

// ---------- overlay: events, butchering, prologue, endings ----------
function renderOverlay() {
  const ov = $('#ov'), sh = $('#sheet');
  let html = '';
  if (menu) html = menuHTML();
  else if (howto) html = howtoHTML();
  else if (prologue) html = prologueHTML();
  else if (S.over && !(S.pending)) html = endHTML();
  else if (S.pending && S.pending.type === 'event') html = eventHTML();
  else if (S.pending && S.pending.type === 'butcher') html = butcherHTML();
  if (!html) { ov.hidden = true; sh.innerHTML = ''; return; }
  const key = html.length + ':' + (S.pending && S.pending.id) + ':' + (S.pending && S.pending.result != null);
  if (!ov.hidden && sh.dataset.key === key && !sh.querySelector('input')) return;
  ov.hidden = false; sh.innerHTML = html; sh.dataset.key = key; sh.scrollTop = 0;
  const vig = sh.querySelector('canvas.vig');
  if (vig) requestAnimationFrame(() => WBScene.paint(vig, JSON.parse(vig.dataset.o)));
  if (S.pending && S.pending.type === 'butcher') wireButcher();
}
function vigHTML(o) { return `<canvas class="vig" data-o='${esc(JSON.stringify(o))}'></canvas>`; }
function paras(t) { return t.split('\n\n').map(p => `<p>${esc(p)}</p>`).join(''); }
function eventHTML() {
  const P = S.pending;
  const o = sceneOpts();
  const node = NODES[P.id.startsWith('arrive_') ? P.id.slice(7) : ''] ;
  const vo = { ...o, scene: P.scene, landmark: node ? node.scene : (P.scene && ['grove', 'spring', 'creek', 'river', 'rock', 'ears', 'mound', 'fort', 'mountain', 'pass', 'village', 'ruin', 'city'].includes(P.scene) ? P.scene : o.landmark), region: node ? node.region : o.region, time: P.scene === 'night' ? 'night' : P.scene === 'camp' ? 'dusk' : 'day', t: S.day * 97 };
  let h = vigHTML(vo) + `<div class="inner"><h2>${esc(P.title)}</h2><p class="when">${C.dateStr(S.day, true)}</p><div class="story">${paras(P.text)}</div>`;
  if (P.result != null) {
    h += `<div class="story result">${paras(P.result)}</div><div class="choices"><button class="btn primary" data-act="resolve">Go on</button></div>`;
  } else {
    h += `<div class="choices">${P.choices.map((c, i) => `<button class="btn ${c.off ? 'off' : ''}" data-act="choose:${i}" ${c.off ? 'disabled' : ''}>${esc(c.label)}${c.hint ? `<small>${esc(c.hint)}${c.off === 'money' ? ' Not enough money.' : c.off === 'powder' ? ' Not enough powder.' : ''}</small>` : ''}</button>`).join('')}</div>`;
  }
  return h + '</div>';
}
function butcherHTML() {
  const P = S.pending, G = GAME[P.game];
  const o = { ...sceneOpts(), scene: null, t: S.day * 97 };
  let h = vigHTML(o) + `<div class="inner"><h2>What to take</h2><p class="when">${esc(P.msg)}</p><div class="story"><p>You can carry away as much of ${G.the} as you like, so long as the wagon can bear it and you can use it before it spoils.</p></div><div class="parts">`;
  for (const p of G.parts) {
    const it = ITEMS[p.id];
    const sells = id => ['bent', 'vegas', 'santafe'].filter(m => MARKETS[m].buys[id]).map(m => `${MARKETS[m].name} ${money(MARKETS[m].buys[id][0], true)}`).join(', ');
    const where = sells(p.id);
    const bec = it.becomes;
    const later = bec ? `${bec[1]}${sells(bec[0]) ? `, and sells at ${sells(bec[0])}${ITEMS[bec[0]].unit === 'lb' ? ' a pound' : ''}` : ''}.` : '';
    const info = `${it.w} lb a${it.unit === 'lb' ? ' pound' : ' ' + it.unit}. ${it.spoil ? `Spoils in ${it.spoil} days. ` : 'Keeps. '}${it.food ? (it.unit === 'lb' ? `${(D.FOOD_PER_PERSON / it.food).toFixed(1)} lb feeds one person a day. ` : `One feeds a person for ${(it.food / D.FOOD_PER_PERSON).toFixed(1)} days. `) : ''}${where ? 'Sells at ' + where + '. ' : ''}${later}${!where && !later ? 'Not worth much to any trader.' : ''}`;
    if (p.max === 1) h += `<label class="part"><span class="pn">${p.label}</span><input type="checkbox" data-part="${p.id}" ${p.def ? 'checked' : ''}><span class="pi">${info}</span></label>`;
    else h += `<div class="part"><span class="pn">${p.label}</span><b class="pv" data-for="${p.id}">${p.def} ${it.unit}</b><input type="range" min="0" max="${p.max}" step="${p.step}" value="${p.def}" data-part="${p.id}"><span class="pi">${info}</span></div>`;
  }
  h += `</div><p class="loadline" id="bload"></p><div class="choices"><button class="btn primary" data-act="pack">Load it on the wagon</button><button class="btn" data-act="leavecarcass">Take nothing</button></div></div>`;
  return h;
}
function butcherPicks() {
  const picks = {};
  $('#sheet').querySelectorAll('[data-part]').forEach(el => { picks[el.dataset.part] = el.type === 'checkbox' ? (el.checked ? 1 : 0) : +el.value; });
  return picks;
}
function wireButcher() {
  const upd = () => {
    const picks = butcherPicks();
    let add = 0;
    for (const id in picks) add += picks[id] * ITEMS[id].w;
    $('#sheet').querySelectorAll('.pv').forEach(el => { const id = el.dataset.for; el.textContent = `${picks[id]} ${ITEMS[id].unit}`; });
    const w = C.weight(S) + add, cap = C.capacity(S);
    const fd = (C.food(S) + (picks.meat || 0) + (picks.tongue || 0) * 3) / C.foodNeed(S);
    $('#bload').innerHTML = `Adds <b>${lb(add)}</b>. Wagon: <b style="color:${w > cap ? 'var(--red)' : 'inherit'}">${lb(w)} of ${lb(cap)}</b>. Fresh meat feeds the party ${(C.foodNeed(S)).toFixed(1)} lb a day.`;
    void fd;
  };
  $('#sheet').querySelectorAll('[data-part]').forEach(el => el.addEventListener('input', upd));
  upd();
}
function prologueHTML() {
  return vigHTML({ region: 'tall', landmark: 'town', team: { kind: 'mules', n: 6 }, scene: null, time: 'dusk', t: 0 }) + `<div class="inner"><h2>Santa Fe, September 1842</h2><p class="when">The last letter</p>
    <div class="letter">Dear ${esc(S.name)},

Sold the last of the calicoes today at a good figure and have a little silver put by. The traders go home next week but I am stopping the winter. There is a chance here I cannot explain in a letter. Tell Wendell his money is safe.

The ledger is in the wagon. If anything should go wrong, it will tell you what I know of the road.

Your loving brother,
Elias</div>
    <div class="story"><p>That was the last you heard. A year later a teamster brought the wagon and the ledger to your door in St. Louis, and said Elias had stayed behind in New Mexico. Then the merchant Wendell sent his note: $1,200, now due from the family.</p><p>This May the Mexican ports are open again. You have taken the steamboat up the Missouri to Independence, with Elias's wagon, his ledger and $1,500, to carry a load to Santa Fe, pay what he owes, and find out what became of him.</p></div>
    <div class="choices"><button class="btn primary" data-act="prologue">To Wendell's store</button></div></div>`;
}
function endHTML() {
  const o = S.over;
  if (o.kind === 'dead' || o.kind === 'stranded') {
    return vigHTML({ region: C.region(S), scene: o.kind === 'dead' ? 'night' : 'broken', time: o.kind === 'dead' ? 'night' : 'dusk', team: { kind: S.team.kind, n: 0 }, t: 0 }) + `<div class="inner"><h2>${o.kind === 'dead' ? 'The end of the road' : 'Turned back'}</h2><p class="when">${C.dateStr(S.day, true)} · ${Math.round(S.mi)} miles from Independence</p><div class="story">${o.kind === 'dead'
      ? `<p>You were buried beside the trail ${C.node(S).name === 'Independence' ? 'near Independence' : 'near ' + C.node(S).name}, under a board with your name cut into it. Some traveller next year will stop and read it, and wonder who you were.</p><p>Elias's ledger went on to Santa Fe in another trader's wagon. Perhaps it found him.</p>`
      : `<p>You left the wagon on the prairie and went home with what you could carry. Wendell's note is still unpaid, and what became of Elias is still a question.</p>`}</div>
      <div class="choices"><button class="btn primary" data-act="again">Begin again</button></div></div>`;
  }
  const other = o.cash - (D.START_MONEY - S.stats.outfit + S.stats.revenue - S.stats.duty - o.wages);
  const stayTxt = o.stay
    ? (o.net >= 0 ? 'You stayed. The store by the parroquia grew a second room, then a second wagon, and every spring you went out to meet the caravans. When American soldiers marched into the plaza two summers later, in August 1846, you and Elias were behind the counter, and the town you had come to was already becoming another country.' : 'You stayed, and worked off what you still owed alongside Elias, measuring calico in the store by the parroquia. It was two years before you were square. By then, in August 1846, American soldiers were marching into the plaza, and the town you had come to was becoming another country.')
    : (o.net >= 0 ? 'You rode home with the autumn caravan, silver sewn into the lining of your coat, and put Wendell\'s note in his hand yourself. Elias\'s letters started coming that winter: two a year, with every caravan, for the rest of your lives.' : 'You rode home with the autumn caravan and gave Wendell what you had. It was not all of it, and he made sure everyone in Independence knew it. But Elias\'s letters started coming that winter, and the second one had money in it.');
  return vigHTML({ region: 'nm', landmark: 'city', team: { kind: S.team.kind, n: S.team.n }, scene: null, time: 'dusk', t: 0 }) + `<div class="inner"><h2>${o.stay ? 'Santa Fe' : 'Home'}</h2><p class="when">${o.days} days · ${o.miles} miles</p>
    <div class="grade">${o.grade}</div>
    <div class="endgrid"><span>Started with</span><span>${money(D.START_MONEY)}</span>
      <span>Outfitting at Independence</span><span>−${money(S.stats.outfit)}</span>
      <span>Sold on the road and in Santa Fe</span><span>+${money(S.stats.revenue)}</span>
      <span>Customs duty</span><span>−${money(S.stats.duty)}</span>
      <span>Wages</span><span>−${money(o.wages)}</span>${Math.abs(other) >= 1 ? `<span>Spent and paid out on the road</span><span>−${money(-other)}</span>` : ''}
      <span class="tot">In hand</span><span class="tot">${money(o.cash)}</span>
      <span>Wendell's note</span><span>−${money(D.NOTE)}</span>
      <span class="tot">${o.net >= 0 ? 'Ahead' : 'Short'}</span><span class="tot">${money(Math.abs(o.net))}</span></div>
    <div class="story"><p>${stayTxt}</p></div>
    <p class="sub">${S.stats.dry} dry camps · ${S.stats.kills} animals taken · ${lb(S.stats.spoiled)} spoiled · ${S.stats.broken} looking glasses broken${o.goodsLeft ? ` · ${Math.round(o.goodsLeft)} units of goods unsold` : ''}</p>
    <div class="choices"><button class="btn primary" data-act="again">Begin again</button></div></div>`;
}
function menuHTML() {
  return `<div class="inner" style="padding-top:20px"><h2>Waybill</h2><div class="choices">
    <button class="btn" data-act="howto">How to play</button>
    <button class="btn" data-act="totitle">Back to the title</button>
    <button class="btn red" data-act="restart">Abandon this journey and start again</button>
    <button class="btn primary" data-act="closemenu">Back to the trail</button></div></div>`;
}
function howtoHTML() {
  return `<div class="inner" style="padding-top:20px"><h2>How to play</h2><div class="story">
    <p><b>The goal.</b> Get your brother's wagon from Independence to Santa Fe, sell your goods, pay Wendell's $1,200 note, and find out what happened to Elias.</p>
    <p><b>Outfitting.</b> Buy a team, supplies for about sixty days, and goods to sell. Everything has a weight. The team can pull only so much, and full water casks are heavy.</p>
    <p><b>Each day</b> you can travel, or spend half a day at a time in camp: hunting, resting, repairing, jerking meat or drying hides. Everyone eats every day. On days with no water the party and team drink from the casks.</p>
    <p><b>Small decisions.</b> What to take from a kill. When to salt or jerk meat before it spoils. How full to fill the casks before a dry stretch. What to leave behind when the team gives out. Which road to take at the Caches.</p>
    <p><b>Santa Fe.</b> Pass the customs house, then sell on the plaza. Each sale of the same thing brings a little less, so a mixed load sells better than one kind of goods.</p>
    <p>The ledger keeps Elias's advice and the notes you gather. Everything in it is drawn from the real Santa Fe trade of the 1840s; the people are invented.</p></div>
    <div class="choices"><button class="btn primary" data-act="closehowto">Close</button></div></div>`;
}

// ---------- actions ----------
function stopAuto() { if (autoRun) { clearTimeout(autoRun); autoRun = null; } }
function travelOne() {
  const before = S.at;
  const r = C.travel(S);
  if (r.err === 'load') toast('The team cannot move this load. Leave something behind.');
  else if (r.err === 'choose') toast('Choose a road first.');
  else if (!r.err) scene.roll(r.mi > 0 ? 900 : 0);
  save(); render();
  return { r, arrived: S.at !== before };
}
function autoTravel() {
  stopAuto();
  let n = 0;
  const step = () => {
    autoRun = null;
    if (S.pending || S.over || S.phase !== 'trail') return;
    const startWarn = warnings().length;
    const { r, arrived } = travelOne();
    n++;
    if (r.err || arrived || S.pending || S.over || !S.to || n > 40) return;
    if (warnings().length > startWarn) { toast('Stopped: something needs your attention.'); return; }
    autoRun = setTimeout(step, 700);
  };
  step();
}

document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]');
  if (!b || b.disabled) return;
  const [act, a1, a2] = b.dataset.act.split(':');
  if (act !== 'auto') stopAuto();
  let err = '';
  switch (act) {
    case 'teamkind': err = C.setTeam(S, a1, S.team.kind === a1 ? S.team.n : TEAMS[a1].start); break;
    case 'team': err = C.setTeam(S, S.team.kind, S.team.n + (+a2)); break;
    case 'wagon': err = C.setWagon(S, a1); break;
    case 'hire': C.hire(S, a1 || null); break;
    case 'buy': {
      const n = +a2;
      if (n > 0) err = C.buy(S, 'indep', a1, n);
      else C.sell(S, 'indep', a1, Math.min(-n, C.count(S, a1)));
      break;
    }
    case 'elias': C.eliasList(S); toast('Bought the supplies on Elias\'s list.'); break;
    case 'rollout': {
      const sm = C.summary(S);
      const w = sm.weight + sm.waterCap * D.WATER_LB;
      if (!C.goodsWeight(S) && !confirm('You have no trade goods to sell in Santa Fe. Roll out anyway?')) return;
      if (w > sm.cap && !confirm('The wagon is overloaded for your team. They will wear down fast. Roll out anyway?')) return;
      if (C.foodNeed(S) && sm.foodDays < 30 && !confirm(`You have food for only ${sm.foodDays.toFixed(0)} days, and the road takes about sixty. Roll out anyway?`)) return;
      err = C.rollOut(S); if (!err) { tab = 'trail'; scene.roll(1200); }
      break;
    }
    case 'travel': travelOne(); return;
    case 'auto': autoTravel(); return;
    case 'depart': C.depart(S, a1); if (a1 === 'lspring') { C.fillCasks(S); } break;
    case 'camp': { const m = C.camp(S, a1); if (m.startsWith('!')) err = m.slice(1); break; }
    case 'salt': { const m = C.saltDown(S); if (m.startsWith('!')) err = m.slice(1); break; }
    case 'fill': { const m = C.fillCasks(S); if (m) err = m.slice(1); break; }
    case 'pour': C.setWater(S, S.water - (+a1)); break;
    case 'drop': C.drop(S, a1, +a2); break;
    case 'pace': C.setPace(S, a1); break;
    case 'watch': C.setWatch(S, a1); break;
    case 'leave': S.caravan = false; C.log(S, 'Left the caravan to go on alone.'); break;
    case 'market': view = 'market'; tab = 'trail'; break;
    case 'closemarket': view = null; break;
    case 'sell': { const got = C.sell(S, C.marketAt(S), a1, +a2); if (got) toast(`Sold for ${money(got, true)}.`); break; }
    case 'mbuy': err = C.buy(S, C.marketAt(S), a1, +a2); break;
    case 'animal': {
      const M = MARKETS[C.marketAt(S)];
      const p = M.animal * (C.hasHand(S, 'trade') ? 0.9 : 1);
      if (S.money < p) err = 'Not enough money.';
      else { S.money -= p; S.team.cond = (S.team.cond * S.team.n + 90) / (S.team.n + 1); S.team.n++; }
      break;
    }
    case 'smith': {
      const M = MARKETS[C.marketAt(S)];
      if (S.money < M.repair[0]) err = 'Not enough money.';
      else { S.money -= M.repair[0]; S.wagon.cond = Math.min(100, S.wagon.cond + M.repair[1]); toast('The smith reset the tyres and replaced two spokes.'); }
      break;
    }
    case 'finish':
      if (C.goodsWeight(S) && !confirm('You still have goods to sell. End the journey anyway?')) return;
      view = null; C.finish(S); break;
    case 'choose': C.choose(S, +a1); break;
    case 'resolve': C.resolve(S); break;
    case 'pack': C.butcher(S, butcherPicks()); break;
    case 'leavecarcass': C.butcher(S, {}); break;
    case 'prologue': prologue = false; break;
    case 'again': clearSave(); S = null; showTitle(); return;
    case 'closemenu': menu = false; break;
    case 'howto': menu = false; howto = true; break;
    case 'closehowto': howto = false; break;
    case 'totitle': menu = false; save(); showTitle(); return;
    case 'restart': if (!confirm('Abandon this journey?')) return; menu = false; clearSave(); S = null; showTitle(); return;
    default: return;
  }
  if (err) toast(err);
  save(); render();
});
document.querySelectorAll('.tab').forEach(b => b.addEventListener('click', () => { tab = b.dataset.tab; if (tab !== 'trail') view = view; render(); $('#panel').scrollTop = 0; }));
$('#menuBtn').onclick = () => { menu = true; render(); };
window.addEventListener('resize', () => { if (S && window.innerWidth > 820) $('#mapWrap').innerHTML = mapHTML(true); });

// test hook
window.__wb = { get S() { return S; }, C, D, render };
showTitle();
})();
