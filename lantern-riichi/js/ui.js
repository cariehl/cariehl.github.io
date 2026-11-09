// The page: menu, table, result sheets, history and rules.

import { typeOf, isRed, counts, WIND_KANJI, WIND_NAMES, doraOf, tileLongName, tileName } from './tiles.js';
import { faceUrl } from './tileart.js';
import { waitsOf, shanten } from './shanten.js';
import { Game, roundName, RULES } from './game.js';
import { PERSONAS, personaById, botTurn, botReaction } from './bots.js';
import { loadHistory, addGame, makeRecord, stats, deleteGame, clearHistory } from './history.js';
import * as W from './wallet.js';

const $ = (s, r = document) => r.querySelector(s);
const el = (tag, cls, html) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fmt = (n) => n.toLocaleString('en-US');
const signed = (n) => (n > 0 ? `+${fmt(n)}` : n < 0 ? `−${fmt(-n)}` : '0');

// ---------------------------------------------------------------- settings & saves

const SETTINGS_KEY = 'lantern-riichi.settings.v1';
const SAVE_KEY = 'lantern-riichi.save.v1';
const settings = Object.assign(
  { opponents: ['mashi', 'fuku', 'kame'], length: 'south', stake: 'low', autoWin: false, noCalls: false, showWaits: true, tileLabels: false, speed: 'normal', tapMode: 'auto' },
  readJSON(SETTINGS_KEY) || {},
);
function readJSON(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } }
function writeJSON(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } }
function saveSettings() { writeJSON(SETTINGS_KEY, settings); }
const SPEED = { slow: 900, normal: 520, fast: 220 };

// ---------------------------------------------------------------- wallet & looks

const WALLET_KEY = 'lantern-riichi.wallet.v1';
const wallet = Object.assign(W.newWallet(), readJSON(WALLET_KEY) || {});
function saveWallet() { writeJSON(WALLET_KEY, wallet); }
const coins = (n) => `🪙 ${fmt(n)}`;

function applyLooks() {
  const root = document.documentElement;
  for (const kind of ['back', 'felt', 'face']) {
    const c = W.cosmeticById(wallet.equipped[kind]);
    if (c) for (const [k, v] of Object.entries(c.vars)) root.style.setProperty(k, v);
  }
  document.body.classList.toggle('labels', !!settings.tileLabels);
}
function myAvatar() {
  return W.cosmeticById(wallet.equipped.avatar) || W.cosmeticById('av-smile');
}

// ---------------------------------------------------------------- tiles

function tileEl(id, { back = false, side = false, cls = '' } = {}) {
  const e = el('div', 'tile' + (back ? ' back' : '') + (side ? ' side' : '') + (cls ? ' ' + cls : ''));
  if (!back && id !== null && id !== undefined) {
    const f = el('i');
    f.style.backgroundImage = faceUrl(typeOf(id), isRed(id));
    e.appendChild(f);
    e.dataset.id = id;
    e.title = tileLongName(typeOf(id)) + (isRed(id) ? ' (red)' : '');
    const t = typeOf(id);
    const lbl = el('b', 'lbl s' + (t < 27 ? Math.floor(t / 9) : 3), t < 27 ? `${t % 9 + 1}<small>${'mps'[Math.floor(t / 9)]}</small>` : tileName(t));
    e.appendChild(lbl);
  }
  return e;
}
const typeTile = (t, opts) => tileEl(t * 4 + 1, opts);

// rel: 0 = taken from me (closed), 1 = from the player to the right, 2 = across, 3 = left
function meldEl(m) {
  const box = el('div', 'meld');
  const tiles = m.tiles.slice().sort((a, b) => a - b);
  if (m.kind === 'ankan') {
    tiles.forEach((id, i) => box.appendChild(tileEl(id, { back: i === 0 || i === 3 })));
    return box;
  }
  let rest = tiles.filter((id) => id !== m.called && id !== m.added);
  const called = m.called ?? tiles[0];
  const sidePos = m.rel === 3 ? 0 : m.rel === 2 ? 1 : 2; // left, middle, right
  const order = rest.slice();
  if (m.kind === 'minkan') order.splice(m.rel === 2 ? 1 : sidePos === 2 ? 3 : 0, 0, called);
  else order.splice(Math.min(sidePos, order.length), 0, called);
  for (const id of order) {
    if (id === called) {
      if (m.kind === 'kakan') {
        const st = el('div', 'stack');
        st.appendChild(tileEl(m.added, { side: true }));
        st.appendChild(tileEl(called, { side: true }));
        box.appendChild(st);
      } else box.appendChild(tileEl(id, { side: true }));
    } else box.appendChild(tileEl(id));
  }
  return box;
}

// ---------------------------------------------------------------- state

let game = null;
let seats = null; // [{ name, emoji, color, persona, style }]
const ui = { turn: null, react: null, selected: null, riichiMode: false, reveal: false, kanPick: false };
let pointerKind = 'mouse';
addEventListener('pointerdown', (e) => { pointerKind = e.pointerType || 'mouse'; }, true);

function show(id) {
  for (const s of document.querySelectorAll('.screen')) s.hidden = s.id !== id;
  window.scrollTo(0, 0);
}

// ---------------------------------------------------------------- menu

function renderMenu() {
  const grid = $('#personaGrid');
  grid.innerHTML = '';
  for (const p of PERSONAS) {
    const b = el('button', 'persona' + (settings.opponents.includes(p.id) ? ' on' : ''));
    b.innerHTML = `<span class="av" style="--c:${p.color}">${p.emoji}</span><b>${p.name}</b><span class="style">${p.style}</span><p>${p.blurb}</p>`;
    b.onclick = () => {
      const o = settings.opponents;
      if (o.includes(p.id)) settings.opponents = o.filter((x) => x !== p.id);
      else { o.push(p.id); if (o.length > 3) o.shift(); }
      saveSettings();
      renderMenu();
    };
    grid.appendChild(b);
  }
  $('#pickCount').textContent = `${settings.opponents.length} of 3`;
  $('#startBtn').disabled = settings.opponents.length !== 3;
  $('#startBtn').style.opacity = settings.opponents.length === 3 ? 1 : 0.5;
  for (const b of document.querySelectorAll('#lengthSeg button')) b.classList.toggle('on', b.dataset.v === settings.length);
  $('#continueBtn').hidden = !readJSON(SAVE_KEY);
  const stakeBox = $('#stakeSeg');
  stakeBox.innerHTML = '';
  for (const st of W.STAKES) {
    const b = el('button', st.id === settings.stake ? 'on' : '', `${st.name}<small>${st.blurb}</small>`);
    if (!W.canAfford(wallet, st)) b.classList.add('short');
    b.onclick = () => { settings.stake = st.id; saveSettings(); renderMenu(); };
    stakeBox.appendChild(b);
  }
  const stake = W.stakeById(settings.stake);
  const ok = settings.opponents.length === 3 && W.canAfford(wallet, stake);
  $('#startBtn').disabled = !ok;
  $('#startBtn').style.opacity = ok ? 1 : 0.5;
  $('#startBtn').textContent = stake.buyIn ? `Sit down · buy in ${fmt(stake.buyIn)}` : 'Sit down';
  $('#walletCoins').textContent = coins(wallet.coins);
  $('#walletDebt').textContent = wallet.debt ? `Owes the bank ${fmt(wallet.debt)}` : 'No debt';
  $('#walletDebt').classList.toggle('neg', wallet.debt > 0);
  $('#shortNote').hidden = W.canAfford(wallet, stake);
  $('#shortNote').textContent = W.canBorrow(wallet) ? `You need ${fmt(stake.buyIn - wallet.coins)} more for this table. Visit the bank for a loan, or pick a smaller table.` : 'The bank won\'t lend you more. Pick a smaller table, play a friendly game, or visit the bank.';
  const av = myAvatar();
  $('#walletAv').textContent = av.emoji;
  $('#walletAv').style.setProperty('--c', av.color);
}

$('#randomBtn').onclick = () => {
  const ids = PERSONAS.map((p) => p.id).sort(() => Math.random() - 0.5);
  settings.opponents = ids.slice(0, 3);
  saveSettings();
  renderMenu();
};
for (const b of document.querySelectorAll('#lengthSeg button')) b.onclick = () => { settings.length = b.dataset.v; saveSettings(); renderMenu(); };
$('#startBtn').onclick = () => { if (settings.opponents.length === 3) startGame(null); };
$('#continueBtn').onclick = () => { const s = readJSON(SAVE_KEY); if (s) startGame(s); };
$('#historyBtn').onclick = () => { renderHistory(); show('history'); };
$('#historyBack').onclick = () => { renderMenu(); show('menu'); };
$('#rulesBtn').onclick = () => { renderRules(); show('rules'); };
$('#rulesBack').onclick = () => show('menu');
$('#bankBtn').onclick = () => bankSheet();
$('#shopBtn').onclick = () => shopSheet();
$('#settingsBtn').onclick = () => settingsSheet(false);

function bankSheet() {
  return openSheet((card, done) => {
    const draw = () => {
      card.innerHTML = '';
      card.appendChild(el('h2', '', 'The bank'));
      card.appendChild(el('p', 'sub', `Loans come in ${fmt(W.LOAN.amount)} coins, and you pay back ${Math.round(W.LOAN.interest * 100)}% more. Half of any winnings go to the bank while you owe it. You can owe up to ${fmt(W.LOAN.maxDebt)}.`));
      const grid = el('div', 'stat-grid');
      grid.appendChild(el('div', 'stat', `<b>${fmt(wallet.coins)}</b><small>coins</small>`));
      grid.appendChild(el('div', 'stat', `<b class="${wallet.debt ? 'neg' : ''}">${fmt(wallet.debt)}</b><small>owed</small>`));
      card.appendChild(grid);
      const btns = el('div', 'sheet-btns');
      const b1 = btn(`Borrow ${fmt(W.LOAN.amount)}`, '', () => { W.borrow(wallet); saveWallet(); draw(); });
      b1.disabled = !W.canBorrow(wallet);
      if (b1.disabled) b1.style.opacity = 0.5;
      btns.appendChild(b1);
      const amt = Math.min(wallet.debt, wallet.coins);
      const b2 = btn(amt ? `Repay ${fmt(amt)}` : 'Repay', 'ghost', () => { W.repay(wallet, amt); saveWallet(); draw(); });
      b2.disabled = !amt;
      if (!amt) b2.style.opacity = 0.5;
      btns.appendChild(b2);
      card.appendChild(btns);
      if (W.isBroke(wallet)) {
        card.appendChild(el('p', 'sub', `You can't afford any table and the bank won't lend more. Declaring bankruptcy clears your debt and starts you again on ${fmt(Math.round(W.START_COINS / 2))} coins. Your cosmetics stay.`));
        const b3 = btn('Declare bankruptcy', 'danger', () => { W.declareBankruptcy(wallet); saveWallet(); draw(); });
        card.appendChild(b3);
      }
      const close = el('div', 'sheet-btns');
      close.appendChild(btn('Done', 'big', () => { done(); renderMenu(); }));
      card.appendChild(close);
    };
    draw();
  });
}

function shopSheet() {
  return openSheet((card, done) => {
    const draw = () => {
      const scroll = card.scrollTop;
      card.innerHTML = '';
      card.appendChild(el('h2', '', 'Shop'));
      card.appendChild(el('p', 'sub', `You have ${coins(wallet.coins)}. Buying something puts it on straight away. Tap anything you own to use it.`));
      for (const [kind, label] of W.KINDS) {
        card.appendChild(el('h3', 'shop-h', label));
        const grid = el('div', 'shop-grid');
        for (const c of W.COSMETICS.filter((x) => x.kind === kind)) {
          const owned = wallet.owned.includes(c.id);
          const on = wallet.equipped[kind] === c.id;
          const b = el('button', 'shop-item' + (on ? ' on' : '') + (!owned && wallet.coins < c.price ? ' short' : ''));
          b.appendChild(previewEl(c));
          b.appendChild(el('span', 'nm', c.name));
          b.appendChild(el('span', 'pr', on ? 'In use' : owned ? 'Owned' : coins(c.price)));
          b.onclick = () => {
            if (owned) W.equip(wallet, c.id);
            else if (wallet.coins >= c.price && confirm(`Buy ${c.name} for ${fmt(c.price)} coins?`)) W.buy(wallet, c.id);
            else return;
            saveWallet();
            applyLooks();
            draw();
          };
          grid.appendChild(b);
        }
        card.appendChild(grid);
      }
      const close = el('div', 'sheet-btns');
      close.appendChild(btn('Done', 'big', () => { done(); renderMenu(); }));
      card.appendChild(close);
      card.scrollTop = scroll;
    };
    draw();
  });
}

function previewEl(c) {
  const box = el('span', 'pv');
  if (c.kind === 'avatar') {
    const a = el('span', 'av', c.emoji);
    a.style.setProperty('--c', c.color);
    box.appendChild(a);
    return box;
  }
  if (c.kind === 'felt') {
    box.classList.add('felt');
    box.style.background = `radial-gradient(circle at 50% 40%, ${c.vars['--felt']}, ${c.vars['--felt-2']})`;
    return box;
  }
  const t = c.kind === 'back' ? tileEl(null, { back: true }) : tileEl(32 * 4 + 1);
  for (const [k, v] of Object.entries(c.vars)) t.style.setProperty(k, v);
  box.appendChild(t);
  return box;
}

// ---------------------------------------------------------------- agents

const human = {
  decideTurn(g, seat, opts) {
    const p = g.h.players[seat];
    if (opts.canTsumo && settings.autoWin) return { type: 'tsumo' };
    if (p.riichi && !opts.canTsumo && !opts.ankan.length) return sleep(380).then(() => ({ type: 'discard', tile: opts.drawn }));
    return new Promise((resolve) => {
      ui.turn = { opts, resolve: (a) => { ui.turn = null; ui.selected = null; ui.riichiMode = false; ui.kanPick = false; resolve(a); } };
      render();
    });
  },
  decideReaction(g, seat, tile, from, opts) {
    if (opts.ron && settings.autoWin) return { type: 'ron' };
    if (!opts.ron && settings.noCalls) return { type: 'pass' };
    return new Promise((resolve) => {
      ui.react = { tile, from, opts, resolve: (a) => { ui.react = null; render(); resolve(a); } };
      render();
    });
  },
};

// the pause menu holds the bots until it closes
let pauseGate = null;
const waitUnpaused = () => pauseGate?.promise;

function botAgent(persona) {
  return {
    async decideTurn(g, seat, opts) {
      await sleep(SPEED[settings.speed] || 520);
      await waitUnpaused();
      return botTurn(g, seat, opts, persona);
    },
    decideReaction(g, seat, tile, from, opts) {
      return botReaction(g, seat, tile, from, opts, persona);
    },
  };
}

// ---------------------------------------------------------------- game flow

async function startGame(save) {
  const opp = save ? save.opponents : settings.opponents.slice();
  const personas = opp.map(personaById);
  const stake = W.stakeById(save ? save.stake || 'free' : settings.stake);
  if (!save) {
    if (!W.payBuyIn(wallet, stake)) { renderMenu(); return; }
    saveWallet();
  }
  const av = myAvatar();
  seats = [{ name: 'You', emoji: av.emoji, color: av.color, persona: null, style: 'You' }].concat(
    personas.map((p) => ({ name: p.name, emoji: p.emoji, color: p.color, persona: p.id, style: p.style })),
  );
  const agents = [human, ...personas.map(botAgent)];
  game = new Game({ agents, length: save ? save.state.length : settings.length, seed: (Math.random() * 2 ** 31) | 0, hooks: { event: onEvent }, resume: save ? save.state : null });
  game.opponents = opp;
  game.stake = stake;
  Object.assign(ui, { turn: null, react: null, selected: null, riichiMode: false, reveal: false });
  show('game');
  const g = game;
  try {
    await g.run();
  } catch (e) {
    if (e && e.message === 'quit') return;
    console.error(e);
    alert('Something went wrong: ' + e.message);
  }
}

class Quit extends Error { constructor() { super('quit'); } }

async function onEvent(type, d, g) {
  if (g !== game) throw new Quit(); // the player left this game
  await waitUnpaused();
  if (g !== game) throw new Quit();
  switch (type) {
    case 'handStart':
      ui.reveal = false;
      ui.lastDiscard = null;
      writeJSON(SAVE_KEY, { state: g.handStartSnapshot, opponents: g.opponents, stake: g.stake.id });
      render();
      await callout(`${roundName(g.round)}${g.honba ? ` · ${g.honba} honba` : ''}`, null, 1000);
      break;
    case 'draw':
      ui.lastDiscard = null; // the discard can no longer be called
      render();
      break;
    case 'discard':
      ui.lastDiscard = d.seat;
      render(true);
      if (d.riichi) await callout('Riichi', d.seat, 750);
      break;
    case 'call':
      ui.lastDiscard = null;
      render();
      await callout({ pon: 'Pon', chi: 'Chi', minkan: 'Kan' }[d.type], d.seat, 650);
      break;
    case 'kan':
      render();
      await callout('Kan', d.seat, 650);
      break;
    case 'riichi':
    case 'dora':
      render();
      break;
    case 'handEnd':
      ui.reveal = true;
      render();
      if (d.kind === 'ron' || d.kind === 'tsumo') {
        for (const w of d.wins) await callout(d.kind === 'ron' ? 'Ron' : 'Tsumo', w.seat, 800);
      } else await sleep(600);
      await handSheet(d, g);
      break;
    case 'gameEnd':
      try { localStorage.removeItem(SAVE_KEY); } catch { /* ignore */ }
      {
        const me = d.final.find((f) => f.seat === 0);
        const money = W.settleGame(wallet, g.stake, me.points);
        saveWallet();
        const rec = makeRecord(g, seats);
        rec.money = money;
        addGame(rec);
        await endSheet(d, g, money);
      }
      break;
  }
  if (g !== game) throw new Quit();
}

async function callout(text, seat, ms) {
  const c = $('#callout');
  c.className = seat === null || seat === undefined ? '' : `at-${seat}`;
  c.textContent = text;
  c.hidden = false;
  c.style.animation = 'none';
  void c.offsetWidth;
  c.style.animation = '';
  await sleep(ms);
  c.hidden = true;
}

// ---------------------------------------------------------------- table rendering

function render(fresh = false) {
  if (!game || !game.h) return;
  const g = game, H = g.h;
  $('#roundName').textContent = roundName(g.round);
  $('#roundSub').textContent = `${g.honba} honba · ${g.sticks} riichi`;
  $('#wallLeft').textContent = H.wall.length;
  $('#centerRound').textContent = roundName(g.round);
  $('#centerWall').textContent = `${H.wall.length} left`;
  const dr = $('#doraRow');
  dr.innerHTML = '';
  for (let i = 0; i < 5; i++) dr.appendChild(i < H.doraShown ? tileEl(H.doraInd[i]) : tileEl(null, { back: true }));

  const turnSeat = currentTurnSeat();
  for (let s = 0; s < 4; s++) {
    const p = H.players[s];
    const layer = $(`.layer[data-rel="${s}"]`);
    const river = $('.river', layer);
    river.innerHTML = '';
    p.discards.forEach((d, i) => {
      const side = i === p.riichiIndex;
      const cls = (d.called ? 'called' : '') + (ui.lastDiscard === s && i === p.discards.length - 1 ? ' last' + (fresh ? ' fresh' : '') : '');
      river.appendChild(tileEl(d.id, { side, cls }));
    });
    $('.stick', layer).classList.toggle('on', p.riichi);
    const melds = $('.melds', layer);
    melds.innerHTML = '';
    for (const m of p.melds.slice().reverse()) melds.appendChild(meldEl(m));
    const info = $('.seatinfo', layer);
    const wind = g.seatWind(s);
    info.innerHTML = `<span class="wind${wind === 0 ? ' dealer' : ''}">${WIND_KANJI[wind]}</span><b>${fmt(g.scores[s])}</b>`;
    info.classList.toggle('turn', turnSeat === s);
    const plate = $(`.plate[data-rel="${s}"]`);
    if (plate) {
      const st = seats[s];
      plate.innerHTML = `<span class="av" style="--c:${st.color}">${st.emoji}</span><span class="who"><b>${st.name}${p.riichi ? '<span class="riichi-tag">Riichi</span>' : ''}</b><small>${WIND_NAMES[wind]}${wind === 0 ? ' · dealer' : ''}</small><small>${st.style}</small></span><span class="dir">${['', 'right', 'across', 'left'][s]}</span>`;
      plate.classList.toggle('turn', turnSeat === s);
    }
  }
  renderHand();
  renderActions();
  renderWaits();
  $('#dock').classList.toggle('acting', !!$('#actions').childElementCount);
  updateMatches();
}

// Highlight tiles on the table (discards and open melds) that match the tile picked in hand.
function updateMatches() {
  const pick = ui.selected ?? ui.hover;
  const t = pick === null || pick === undefined ? -1 : typeOf(pick);
  for (const e of document.querySelectorAll('#table .tile[data-id]')) e.classList.toggle('match', typeOf(+e.dataset.id) === t);
}

function currentTurnSeat() {
  const s = game.h.players.findIndex((p) => p.hand.length % 3 === 2);
  return s < 0 ? null : s;
}

function renderHand() {
  const H = game.h, p = H.players[0];
  const hand = $('#hand');
  hand.innerHTML = '';
  hand.classList.toggle('mine', !!ui.turn);
  const t = ui.turn;
  let ids = p.hand.slice().sort((a, b) => a - b);
  let drawn = null;
  if (t && t.opts.drawn !== null && p.hand.includes(t.opts.drawn)) {
    drawn = t.opts.drawn;
    ids = ids.filter((x) => x !== drawn);
  }
  const allowed = t ? new Set(ui.riichiMode ? t.opts.riichi : t.opts.discards) : null;
  const add = (id, gap) => {
    const dim = t && !allowed.has(id);
    const e = tileEl(id, { cls: (dim ? 'dim' : '') + (gap ? ' gap' : '') + (ui.selected === id ? ' sel' : '') + (ui.react && typeOf(id) === typeOf(ui.react.tile) ? ' hl' : '') });
    e.onclick = () => onTileTap(id);
    e.onpointerenter = (ev) => { if (ev.pointerType === 'mouse') { ui.hover = id; updateMatches(); } };
    e.onpointerleave = () => { if (ui.hover === id) { ui.hover = null; updateMatches(); } };
    hand.appendChild(e);
  };
  ids.forEach((id) => add(id, false));
  if (drawn !== null) add(drawn, true);
}

function onTileTap(id) {
  const t = ui.turn;
  if (!t) return;
  const allowed = ui.riichiMode ? t.opts.riichi : t.opts.discards;
  if (!allowed.includes(id)) return;
  const oneTap = settings.tapMode === 'one' || (settings.tapMode === 'auto' && pointerKind === 'mouse');
  if (oneTap || ui.selected === id) {
    t.resolve({ type: 'discard', tile: id, riichi: ui.riichiMode });
    render();
    return;
  }
  ui.selected = id;
  render();
}

function btn(label, cls, fn) {
  const b = el('button', 'btn ' + (cls || ''), label);
  b.onclick = fn;
  return b;
}

function renderActions() {
  const box = $('#actions');
  box.innerHTML = '';
  if (ui.turn) {
    const o = ui.turn.opts;
    if (ui.kanPick) {
      for (const t of o.ankan) box.appendChild(chiLikeBtn([t, t, t, t], () => ui.turn.resolve({ type: 'ankan', t })));
      for (const t of o.kakan) box.appendChild(chiLikeBtn([t, t, t, t], () => ui.turn.resolve({ type: 'kakan', t })));
      box.appendChild(btn('Back', 'pass', () => { ui.kanPick = false; render(); }));
      return;
    }
    if (o.canTsumo) box.appendChild(btn('Tsumo', 'ron', () => ui.turn.resolve({ type: 'tsumo' })));
    if (o.riichi.length && !ui.riichiMode) box.appendChild(btn('Riichi', '', () => { ui.riichiMode = true; ui.selected = null; render(); }));
    if (ui.riichiMode) {
      box.appendChild(el('span', 'note', 'Pick the tile to discard for riichi'));
      box.appendChild(btn('Cancel', 'pass', () => { ui.riichiMode = false; render(); }));
    }
    const kans = o.ankan.length + o.kakan.length;
    if (kans && !ui.riichiMode) box.appendChild(btn('Kan', '', () => {
      if (kans === 1) ui.turn.resolve(o.ankan.length ? { type: 'ankan', t: o.ankan[0] } : { type: 'kakan', t: o.kakan[0] });
      else { ui.kanPick = true; render(); }
    }));
    if (o.kyuushu) box.appendChild(btn('Abort (9 terminals)', 'pass', () => ui.turn.resolve({ type: 'kyuushu' })));
    if (game.h.players[0].riichi && (o.canTsumo || o.ankan.length)) box.appendChild(btn('Discard', 'pass', () => ui.turn.resolve({ type: 'discard', tile: o.drawn })));
  } else if (ui.react) {
    const { opts, tile } = ui.react;
    const t = typeOf(tile);
    if (opts.ron) box.appendChild(btn('Ron', 'ron', () => ui.react.resolve({ type: 'ron' })));
    if (opts.minkan) box.appendChild(btn('Kan', '', () => ui.react.resolve({ type: 'minkan' })));
    if (opts.pon) box.appendChild(btn('Pon', '', () => ui.react.resolve({ type: 'pon' })));
    for (const combo of opts.chi) {
      const types = [...combo.map(typeOf), t].sort((a, b) => a - b);
      box.appendChild(chiLikeBtn(types, () => ui.react.resolve({ type: 'chi', combo }), 'Chi'));
    }
    box.appendChild(btn('Skip', 'pass', () => ui.react.resolve({ type: 'pass' })));
  }
}

function chiLikeBtn(types, fn, label = '') {
  const b = el('button', 'btn chi-opt');
  if (label) b.appendChild(el('span', '', label + '&nbsp;'));
  for (const t of types) b.appendChild(typeTile(t));
  b.onclick = fn;
  return b;
}

function renderWaits() {
  const box = $('#waits');
  box.innerHTML = '';
  box.hidden = true;
  if (!settings.showWaits || !game || !game.h) return;
  const H = game.h, p = H.players[0];
  let hand = p.hand.slice();
  let label = 'Waiting on';
  if (hand.length % 3 === 2) {
    if (ui.selected === null || !ui.turn) return;
    hand.splice(hand.indexOf(ui.selected), 1);
    label = 'Discard this to wait on';
  }
  const c = counts(hand);
  if (shanten(c, p.melds.length) !== 0) return;
  const waits = waitsOf(c, p.melds.length);
  if (!waits.length) return;
  const rem = visibleRemaining(0, hand);
  box.appendChild(el('span', '', label));
  for (const w of waits) {
    const it = el('span', 'w');
    it.appendChild(typeTile(w));
    it.appendChild(el('span', 'n', `×${rem[w]}`));
    box.appendChild(it);
  }
  const furiten = p.discards.some((d) => waits.includes(typeOf(d.id))) || (hand.length === p.hand.length && (p.furitenTemp || p.furitenRiichi));
  if (furiten) box.appendChild(el('span', 'furiten', 'Furiten: no ron'));
  box.hidden = false;
}

function visibleRemaining(seat, hand) {
  const H = game.h;
  const rem = new Array(34).fill(4);
  for (const id of hand) rem[typeOf(id)]--;
  for (const p of H.players) {
    for (const d of p.discards) if (!d.called) rem[typeOf(d.id)]--;
    for (const m of p.melds) for (const id of m.tiles) rem[typeOf(id)]--;
  }
  for (const id of H.doraInd.slice(0, H.doraShown)) rem[typeOf(id)]--;
  return rem.map((x) => Math.max(0, x));
}

// ---------------------------------------------------------------- sheets

function openSheet(build) {
  return new Promise((resolve) => {
    const card = $('#sheetCard');
    card.innerHTML = '';
    card.scrollTop = 0;
    build(card, (v) => { $('#sheet').hidden = true; resolve(v); });
    $('#sheet').hidden = false;
  });
}

function handRow(hand, melds, winTile) {
  const row = el('div', 'res-hand');
  for (const id of hand.slice().sort((a, b) => a - b)) row.appendChild(tileEl(id));
  if (winTile !== undefined && winTile !== null) { row.appendChild(el('span', 'gap')); row.appendChild(tileEl(winTile, { cls: 'hl' })); }
  for (const m of melds || []) row.appendChild(meldEl(m));
  return row;
}

function tilesRow(ids) {
  const r = el('div', 'tiles');
  for (const id of ids) r.appendChild(tileEl(id));
  return r;
}

function winTitle(w, kind, names) {
  const verb = w.seat === 0 ? 'win' : 'wins';
  if (kind === 'tsumo') return `${names[w.seat]} ${verb} by tsumo`;
  return `${names[w.seat]} ${verb} by ron from ${names[w.from]}`;
}

function deltasEl(d, scoresAfter) {
  const box = el('div', 'deltas');
  const order = [0, 1, 2, 3].sort((a, b) => scoresAfter[b] - scoresAfter[a]);
  for (const s of order) {
    const st = seats[s];
    box.appendChild(el('span', 'av', st.emoji)).style.setProperty('--c', st.color);
    box.appendChild(el('span', '', st.name));
    box.appendChild(el('span', 'num', fmt(scoresAfter[s])));
    box.appendChild(el('span', 'num ' + (d[s] > 0 ? 'pos' : d[s] < 0 ? 'neg' : ''), signed(d[s])));
  }
  return box;
}

function winBlock(w, rec, names) {
  const b = el('div', 'win-block');
  b.appendChild(el('h2', '', winTitle(w, rec.kind, names)));
  const pointsText = w.limit || `${w.han} han ${w.fu} fu`;
  b.appendChild(el('p', 'sub', `${roundName(rec.round)}${rec.honba ? `, ${rec.honba} honba` : ''} · ${pointsText}${w.pao !== null && w.pao !== undefined ? ` · ${names[w.pao]} ${w.pao === 0 ? "are" : "is"} liable` : ''}`));
  b.appendChild(handRow(w.hand, w.melds, w.tile));
  const dora = el('div', 'res-dora');
  const d1 = el('div', '', '<small>Dora indicators</small>');
  d1.appendChild(tilesRow(rec.dora || []));
  dora.appendChild(d1);
  if (w.riichi && w.ura && w.ura.length) {
    const d2 = el('div', '', '<small>Ura indicators</small>');
    d2.appendChild(tilesRow(w.ura));
    dora.appendChild(d2);
  }
  b.appendChild(dora);
  const ul = el('ul', 'yaku');
  for (const y of w.yaku) ul.appendChild(el('li', '', `<span>${y.name}</span><span>${typeof y.han === 'number' ? y.han + ' han' : y.han}</span>`));
  b.appendChild(ul);
  b.appendChild(el('div', 'total', `<span>${w.yakuman ? w.limit : `${w.han} han · ${w.fu} fu`}${!w.yakuman && w.limit ? ` <small>${w.limit}</small>` : ''}</span><span>${fmt(w.points)}</span>`));
  return b;
}

function handSheet(rec, g) {
  const names = seats.map((s) => s.name);
  return openSheet((card, done) => {
    if (rec.kind === 'ron' || rec.kind === 'tsumo') {
      for (const w of rec.wins) card.appendChild(winBlock(w, rec, names));
    } else if (rec.kind === 'draw') {
      card.appendChild(el('h2', '', rec.nagashi.length ? 'Nagashi mangan' : 'Exhaustive draw'));
      const ready = rec.tenpai.map((s) => names[s]);
      card.appendChild(el('p', 'sub', rec.nagashi.length ? `${rec.nagashi.map((s) => names[s]).join(' and ')} discarded only terminals and honors.` : ready.length ? `Ready: ${ready.join(', ')}` : 'Nobody was ready.'));
      for (const h of rec.hands) {
        card.appendChild(el('div', 'sub', `${names[h.seat]} — waiting on ${h.waits.map((t) => tileLongName(t)).join(', ')}`));
        card.appendChild(handRow(h.hand, h.melds));
      }
    } else {
      card.appendChild(el('h2', '', 'Abortive draw'));
      card.appendChild(el('p', 'sub', rec.reason));
    }
    card.appendChild(deltasEl(rec.deltas, rec.scores));
    const btns = el('div', 'sheet-btns');
    btns.appendChild(btn(rec.last ? 'See results' : 'Next hand', 'big', () => done()));
    card.appendChild(btns);
  });
}

function endSheet(res, g, money) {
  return openSheet((card, done) => {
    const me = res.final.find((f) => f.seat === 0);
    card.appendChild(el('h2', '', ['First place!', 'Second place', 'Third place', 'Fourth place'][me.place - 1]));
    card.appendChild(el('p', 'sub', `${g.length === 'east' ? 'East round' : 'Half game'} · ${res.log.length} hands · saved to your history`));
    card.appendChild(standingsTable(res.final, seats));
    if (money && money.buyIn) {
      const m = el('div', 'money');
      m.innerHTML = `<div><small>Buy-in</small><b>${fmt(money.buyIn)}</b></div><div><small>Payout</small><b>${fmt(money.payout)}</b></div><div><small>Profit</small><b class="${money.profit > 0 ? 'pos' : money.profit < 0 ? 'neg' : ''}">${signed(money.profit)}</b></div><div><small>Wallet</small><b>${fmt(wallet.coins)}</b></div>`;
      card.appendChild(m);
      if (money.repaid) card.appendChild(el('p', 'sub', `${fmt(money.repaid)} went to the bank. You still owe ${fmt(wallet.debt)}.`));
      else if (wallet.debt) card.appendChild(el('p', 'sub', `You owe the bank ${fmt(wallet.debt)}.`));
    }
    const btns = el('div', 'sheet-btns');
    btns.appendChild(btn('History', 'ghost', () => { done(); game = null; renderHistory(); show('history'); }));
    btns.appendChild(btn('Play again', 'big', () => { done(); game = null; renderMenu(); show('menu'); }));
    card.appendChild(btns);
  });
}

function standingsTable(final, seatList) {
  const t = el('table', 'standings');
  for (const f of final.slice().sort((a, b) => a.place - b.place)) {
    const st = seatList[f.seat] || { name: '?', emoji: '?', color: '#555' };
    const tr = el('tr', f.seat === 0 ? 'me' : '');
    tr.innerHTML = `<td class="place">${f.place}</td><td><span class="av" style="--c:${st.color};width:28px;height:28px;font-size:16px;display:inline-grid;vertical-align:middle;margin-right:8px">${st.emoji}</span>${st.name}</td><td class="num">${fmt(f.score)}</td><td class="num ${f.points >= 0 ? 'pos' : 'neg'}">${f.points > 0 ? '+' : ''}${f.points.toFixed(1)}</td>`;
    t.appendChild(tr);
  }
  return t;
}

function settingToggles(card) {
  const tog = (key, label, hint) => {
    const row = el('label', 'toggle', `<span>${label}<small>${hint}</small></span>`);
    const input = el('input');
    input.type = 'checkbox';
    input.checked = !!settings[key];
    input.onchange = () => { settings[key] = input.checked; saveSettings(); applyLooks(); if (game) render(); };
    row.appendChild(input);
    card.appendChild(row);
  };
  tog('tileLabels', 'Corner labels', 'Show the number and suit (5m, 3p, 7s) or honor (E, S, W, N, Wh, G, R) in the corner of each tile');
  tog('showWaits', 'Show waits', 'Show which tiles finish a ready hand, and warn on furiten');
  tog('autoWin', 'Auto-win', 'Declare ron and tsumo for you');
  tog('noCalls', 'No calls', 'Skip pon, chi and kan prompts');
  const sel = (key, label, hint, options) => {
    const row = el('label', 'toggle', `<span>${label}<small>${hint}</small></span>`);
    const s = el('select');
    for (const [v, t] of options) { const o = el('option', '', t); o.value = v; s.appendChild(o); }
    s.value = settings[key];
    s.onchange = () => { settings[key] = s.value; saveSettings(); };
    row.appendChild(s);
    card.appendChild(row);
  };
  sel('speed', 'Bot speed', 'How long the bots think', [['slow', 'Slow'], ['normal', 'Normal'], ['fast', 'Fast']]);
  sel('tapMode', 'Discarding', 'Tap once, or tap to lift then tap again', [['auto', 'Auto (mouse: once)'], ['one', 'One tap'], ['two', 'Two taps']]);
}

function settingsSheet() {
  return openSheet((card, done) => {
    card.appendChild(el('h2', '', 'Settings'));
    settingToggles(card);
    const btns = el('div', 'sheet-btns');
    btns.appendChild(btn('Done', 'big', () => done()));
    card.appendChild(btns);
  });
}

// pause menu
$('#pauseBtn').onclick = () => {
  if (!$('#sheet').hidden) return;
  let release;
  pauseGate = { promise: new Promise((r) => { release = r; }) };
  const unpause = () => { pauseGate = null; release(); };
  openSheet((card, done0) => {
    const done = () => { done0(); unpause(); };
    card.appendChild(el('h2', '', 'Paused'));
    card.appendChild(el('p', 'sub', `${roundName(game.round)} · leaving keeps the game (and its buy-in); it restarts from the beginning of this hand.`));
    settingToggles(card);
    const btns = el('div', 'sheet-btns');
    btns.appendChild(btn('Leave table', 'danger', () => { done(); game = null; renderMenu(); show('menu'); }));
    btns.appendChild(btn('Resume', '', () => done()));
    card.appendChild(btns);
  });
};

// ---------------------------------------------------------------- history page

function renderHistory() {
  const body = $('#historyBody');
  body.innerHTML = '';
  const list = loadHistory();
  if (!list.length) {
    body.appendChild(el('p', 'empty', 'No finished games yet. They show up here when a game ends.'));
    return;
  }
  const s = stats(list);
  const avg = s.games ? (s.place.reduce((a, n, i) => a + n * (i + 1), 0) / s.games).toFixed(2) : '-';
  const pct = (a, b) => (b ? `${((100 * a) / b).toFixed(1)}%` : '-');
  const grid = el('div', 'stat-grid');
  const stat = (v, label) => grid.appendChild(el('div', 'stat', `<b>${v}</b><small>${label}</small>`));
  stat(s.games, 'games');
  stat(avg, 'average place');
  stat(pct(s.place[0], s.games), 'first place');
  stat(`${s.points >= 0 ? '+' : ''}${s.points.toFixed(1)}`, 'total points (uma)');
  stat(signed(s.coins), 'coins won');
  stat(pct(s.wins, s.hands), 'hands won');
  stat(pct(s.dealIns, s.hands), 'dealt in');
  stat(pct(s.riichi, s.hands), 'riichi');
  stat(pct(s.open, s.hands), 'opened hand');
  stat(s.wins ? fmt(Math.round(s.winPoints / s.wins)) : '-', 'average win');
  body.appendChild(grid);
  const places = el('div', 'places');
  s.place.forEach((n) => { const sp = el('span'); sp.style.flex = n; places.appendChild(sp); });
  body.appendChild(el('small', '', `Places: ${s.place.map((n, i) => `${['1st', '2nd', '3rd', '4th'][i]} ${n}`).join(' · ')}`)).style.color = 'var(--muted)';
  body.appendChild(places);
  if (s.best) {
    body.appendChild(el('h2', '', 'Best hand'));
    const b = el('div', 'game-row');
    b.style.padding = '10px 12px';
    b.appendChild(el('div', '', `<b>${s.best.yakuman ? s.best.limit : `${s.best.han} han ${s.best.fu} fu${s.best.limit ? ' · ' + s.best.limit : ''}`}</b> · ${fmt(s.best.points)} <span class="meta">· ${new Date(s.best.date).toLocaleDateString()}</span>`));
    b.appendChild(el('div', 'meta', s.best.yaku.map((y) => y.name).join(', ')));
    b.appendChild(handRow(s.best.hand, s.best.melds, s.best.tile));
    body.appendChild(b);
  }
  const vs = Object.entries(s.vs);
  if (vs.length) {
    body.appendChild(el('h2', '', 'Against each bot'));
    const t = el('table', 'standings');
    for (const [id, v] of vs) {
      const p = personaById(id);
      const tr = el('tr');
      tr.innerHTML = `<td><span class="av" style="--c:${p.color};width:28px;height:28px;font-size:16px;display:inline-grid;vertical-align:middle;margin-right:8px">${p.emoji}</span><b>${p.name}</b><br><small style="color:var(--muted)">${p.style} · ${v.games} game${v.games === 1 ? '' : 's'} · its average place ${(v.theirPlace / v.games).toFixed(2)}</small></td><td class="num">you finished ahead<br><b>${pct(v.beat, v.games)}</b></td>`;
      t.appendChild(tr);
    }
    body.appendChild(t);
  }
  body.appendChild(el('h2', '', 'Games'));
  for (const g of list) body.appendChild(gameRow(g));
  const clear = btn('Clear history', 'danger', () => {
    if (confirm('Delete every saved game?')) { clearHistory(); renderHistory(); }
  });
  clear.style.marginTop = '20px';
  body.appendChild(clear);
}

function gameRow(g) {
  const row = el('div', 'game-row');
  const me = g.final.find((f) => f.seat === 0);
  const head = el('button');
  const opp = g.seats.slice(1).map((st) => `<span class="av" style="--c:${st.color}" title="${st.name}">${st.emoji}</span>`).join('');
  head.innerHTML = `<span class="place">${me.place}</span><span><b>${g.length === 'east' ? 'East round' : 'Half game'}</b> <span class="meta">${new Date(g.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span><span class="opp">${opp}</span></span><span class="pts"><b>${fmt(me.score)}</b><br><span class="${me.points >= 0 ? 'pos' : 'neg'}">${me.points > 0 ? '+' : ''}${me.points.toFixed(1)}</span>${g.money && g.money.buyIn ? `<br><span class="meta ${g.money.profit >= 0 ? 'pos' : 'neg'}">🪙 ${signed(g.money.profit)}</span>` : ''}</span>`;
  const detail = el('div', 'game-detail');
  detail.hidden = true;
  head.onclick = () => {
    detail.hidden = !detail.hidden;
    if (!detail.hidden && !detail.childElementCount) buildDetail(detail, g);
  };
  row.appendChild(head);
  row.appendChild(detail);
  return row;
}

function buildDetail(box, g) {
  box.appendChild(standingsTable(g.final, g.seats));
  const names = g.seats.map((s) => s.name);
  const ul = el('ul', 'hand-log');
  for (const h of g.hands || []) {
    const li = el('li');
    let title = '', right = '';
    if (h.kind === 'ron' || h.kind === 'tsumo') {
      title = h.wins.map((w) => (h.kind === 'tsumo' ? `${names[w.seat]} tsumo` : `${names[w.seat]} ron off ${names[w.from]}`)).join(' & ');
      right = h.wins.map((w) => fmt(w.points)).join(' / ');
    } else if (h.kind === 'draw') {
      title = h.nagashi && h.nagashi.length ? 'Nagashi mangan' : `Draw · ready: ${h.tenpai.length ? h.tenpai.map((s) => names[s]).join(', ') : 'nobody'}`;
    } else title = `Abortive draw · ${h.reason}`;
    const myDelta = h.deltas[0];
    li.appendChild(el('div', 'hl-head', `<span><b>${roundName(h.round)}${h.honba ? `-${h.honba}` : ''}</b> · ${title}</span><span>${right ? right + ' · ' : ''}<span class="${myDelta > 0 ? 'pos' : myDelta < 0 ? 'neg' : ''}">you ${signed(myDelta)}</span></span>`));
    for (const w of h.wins || []) {
      li.appendChild(el('div', 'yk', `${w.yakuman ? w.limit : `${w.han} han ${w.fu} fu${w.limit ? ' ' + w.limit : ''}`}: ${w.yaku.map((y) => (typeof y.han === 'number' && y.han > 1 ? `${y.name} ${y.han}` : y.name)).join(', ')}`));
      li.appendChild(handRow(w.hand, w.melds, w.tile));
    }
    ul.appendChild(li);
  }
  box.appendChild(ul);
  const del = btn('Delete this game', 'danger small', () => { deleteGame(g.id); renderHistory(); });
  del.style.marginTop = '8px';
  box.appendChild(del);
}

// ---------------------------------------------------------------- rules page

const YAKU_LIST = [
  ['Riichi', '1', 'Declare with a closed ready hand; costs 1000 points.'],
  ['Ippatsu', '1', 'Win within one go-round of riichi, before any call.'],
  ['Fully Concealed Hand', '1', 'Win by tsumo with a closed hand.'],
  ['Pinfu', '1', 'Closed; four runs, a non-scoring pair, a two-sided wait.'],
  ['Pure Double Sequence', '1', 'Closed; two identical runs.'],
  ['All Simples', '1', 'Only 2-8 number tiles. Open is fine.'],
  ['Dragon / Seat Wind / Round Wind', '1 each', 'A triplet of a dragon, your seat wind, or the round wind.'],
  ['Under the Sea / River', '1', 'Win on the last tile drawn, or the last discard.'],
  ['After a Kan', '1', 'Win on the replacement tile after a kan.'],
  ['Robbing a Kan', '1', 'Ron on a tile someone adds to a pon.'],
  ['Double Riichi', '2', 'Riichi on your very first discard, before any call.'],
  ['Seven Pairs', '2', 'Seven different pairs. Always 25 fu.'],
  ['Mixed Triple Sequence', '2 (1 open)', 'The same run in all three suits.'],
  ['Pure Straight', '2 (1 open)', '1-9 in one suit.'],
  ['Half Outside Hand', '2 (1 open)', 'Every set and the pair have a terminal or honor.'],
  ['All Triplets', '2', 'Four triplets.'],
  ['Three Concealed Triplets', '2', ''],
  ['Triple Triplets', '2', 'The same number triplet in all three suits.'],
  ['Three Kans', '2', ''],
  ['Little Three Dragons', '2', 'Two dragon triplets and a dragon pair.'],
  ['All Terminals and Honors', '2', ''],
  ['Half Flush', '3 (2 open)', 'One suit plus honors.'],
  ['Terminals in All Sets', '3 (2 open)', 'Every set and the pair have a 1 or 9; no honors.'],
  ['Twice Pure Double Sequence', '3', 'Closed; two pairs of identical runs.'],
  ['Full Flush', '6 (5 open)', 'One suit only.'],
  ['Yakuman', '13+', 'Thirteen Orphans, Four Concealed Triplets, Big Three Dragons, Little/Big Four Winds, All Honors, All Green, All Terminals, Nine Gates, Four Kans, Blessing of Heaven/Earth. Double yakuman for the 13-sided Thirteen Orphans, single-wait Four Concealed Triplets, Pure Nine Gates and Big Four Winds.'],
];

function renderRules() {
  const body = $('#rulesBody');
  body.classList.add('rules-body');
  body.innerHTML = `
  <h2>The table</h2>
  <p>Four players, 136 tiles with three red fives. Everyone starts on ${fmt(RULES.startPoints)}. A <b>half game</b> plays the East and South rounds; an <b>East round</b> game plays East only. If nobody has ${fmt(RULES.returnPoints)} when the last round ends, play continues into the next wind until someone does. The game also ends when anyone drops below zero, and the dealer stops the game in the final hand by winning or being ready while in first place.</p>
  <p>Final points: (score − 30,000) ÷ 1000, plus uma +15 / +5 / −5 / −15, plus 20 to first place. Leftover riichi sticks go to first place.</p>
  <h2>Coins</h2>
  <p>You start with 10,000 coins. Every table but the friendly one has a buy-in, and pays out the buy-in plus your final points times the table's rate, never less than zero. Out of coins? The bank lends 5,000 at a time (you owe 5,500), up to 22,000 owed, and takes half of your winnings until it's paid back. Spend coins in the shop on tile backs, table felt, tile faces and avatars.</p>
  <h2>Your turn</h2>
  <p>Draw, then discard. Tap a tile to lift it and tap again to throw it (one click with a mouse). A complete hand is four sets (runs or triplets) and a pair, and it needs at least one yaku; dora only add to a hand that has one.</p>
  <h2>Rules in play</h2>
  <ul>
    <li>Open tanyao (All Simples) counts. Red fives and kan dora are on; ura dora for riichi.</li>
    <li>No swap-calling: after a chi or pon you can't discard the same tile, or the other end of the run you called.</li>
    <li>Furiten: no ron if any of your waits is in your own discards, or you passed a winning tile since your last discard (for the rest of the hand once in riichi). Tsumo is always allowed.</li>
    <li>Double ron is allowed; a triple ron is an abortive draw. Honba and riichi sticks go to the winner closest to the discarder's right.</li>
    <li>Abortive draws: nine different terminals and honors on your first draw, four of the same wind discarded first, four riichi, four kans by different players.</li>
    <li>Exhaustive draw: 3000 points move from the hands that aren't ready to those that are. Nagashi mangan pays as a mangan tsumo.</li>
    <li>Liability (pao) for feeding the last dragon of Big Three Dragons or the last wind of Big Four Winds.</li>
    <li>13 han is counted yakuman; no kiriage mangan (4 han 30 fu = 7,700).</li>
  </ul>
  <h2>Yaku</h2>
  <table class="yaku-table">${YAKU_LIST.map(([n, h, d]) => `<tr><td>${n}${d ? `<small>${d}</small>` : ''}</td><td>${h}</td></tr>`).join('')}</table>
  <h2>The bots</h2>
  <table class="yaku-table">${PERSONAS.map((p) => `<tr><td>${p.emoji} <b>${p.name}</b> · ${p.style}<small>${p.blurb}</small></td><td></td></tr>`).join('')}</table>`;
}

// ---------------------------------------------------------------- boot

applyLooks();
renderMenu();
show('menu');
void doraOf;
