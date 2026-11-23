// The page: menu, table, result sheets, history and rules.

import { typeOf, isRed, counts, WIND_KANJI, WIND_NAMES, doraOf, tileLongName, tileName } from './tiles.js';
import { faceUrl, setTileStyle } from './tileart.js';
import { waitsOf, shanten } from './shanten.js';
import { scoreWin } from './score.js';
import { Game, roundName, RULES } from './game.js';
import { PERSONAS, personaById, botTurn, botReaction } from './bots.js';
import { loadHistory, addGame, makeRecord, stats, deleteGame, clearHistory, modeOf } from './history.js';
import * as W from './wallet.js';
import { amType, amTileName, amTileLongName } from './american/tiles.js';
import { AmericanGame } from './american/game.js';
import { createAmericanTable } from './american/table.js';
import { createFocus, LAYOUTS } from './focus.js';
import { setCustomCards, allCards, cardById } from './american/card.js';
import { loadCustomCards, saveCustomCards, parseCardText, cardToText, TEMPLATE } from './american/custom.js';

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
  { mode: 'riichi', amCard: 'lantern-2026', opponents: ['mashi', 'fuku', 'kame'], length: 'south', stake: 'low', autoWin: false, noCalls: false, showWaits: true, tileStyle: 'classic', redTint: true, doraTint: true, speed: 'normal', tapMode: 'auto', focus: false, focusTab: 'hands', focusLayout: 'list' },
  readJSON(SETTINGS_KEY) || {},
);
function readJSON(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } }
function writeJSON(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } }
// older saves kept corner labels as their own switch
if (settings.tileLabels && settings.tileStyle !== 'clear') settings.tileStyle = 'labels';
delete settings.tileLabels;
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
  document.body.classList.toggle('labels', settings.tileStyle === 'labels');
  document.body.classList.toggle('red-tint', !!settings.redTint);
  document.body.classList.toggle('dora-tint', !!settings.doraTint);
  document.body.classList.toggle('focus', !!settings.focus);
  setTileStyle(settings.tileStyle);
}
function myAvatar() {
  return W.cosmeticById(wallet.equipped.avatar) || W.cosmeticById('av-smile');
}

// ---------------------------------------------------------------- tiles

// Dora tile types of the hand on the table, for the gold shading.
let doraTypes = new Set();

// Ids 136+ are American flowers and jokers; `am` also turns off red fives and dora shading.
const tType = (id) => (id >= 136 ? amType(id) : typeOf(id));
function tileEl(id, { back = false, side = false, cls = '', dora = true, am = false } = {}) {
  const face = !back && id !== null && id !== undefined;
  const red = face && !am && isRed(id);
  const isDora = face && !am && dora && doraTypes.has(typeOf(id));
  const e = el('div', 'tile' + (back ? ' back' : '') + (side ? ' side' : '') + (red ? ' red' : '') + (isDora ? ' dora' : '') + (cls ? ' ' + cls : ''));
  if (face) {
    const t = tType(id);
    const f = el('i');
    f.style.backgroundImage = faceUrl(t, red);
    e.appendChild(f);
    e.dataset.id = id;
    e.title = am ? amTileLongName(t) : tileLongName(t) + (red ? ' (red)' : '');
    const sfx = am ? 'cdb' : 'mps';
    const lbl = el('b', 'lbl s' + (t < 27 ? Math.floor(t / 9) : 3), t < 27 ? `${t % 9 + 1}<i class="sfx">${sfx[Math.floor(t / 9)]}</i>` : am ? amTileName(t) : tileName(t));
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
const ui = { turn: null, react: null, selected: null, hover: null, riichiMode: false, reveal: false, kanPick: false };
let pointerKind = 'mouse';
addEventListener('pointerdown', (e) => { pointerKind = e.pointerType || 'mouse'; }, true);

function show(id) {
  for (const s of document.querySelectorAll('.screen')) s.hidden = s.id !== id;
  window.scrollTo(0, 0);
}

// ---------------------------------------------------------------- menu

const isAm = () => settings.mode === 'american';

function renderMenu() {
  const am = isAm();
  for (const b of document.querySelectorAll('#modeSeg button')) b.classList.toggle('on', b.dataset.v === settings.mode);
  const amCard = cardById(settings.amCard);
  $('#amSub').textContent = `${amCard.name}, jokers, Charleston`;
  $('#lede').textContent = am
    ? `American mahjong against ${amCard.custom ? 'your card' : 'the 2026 card'}: Charleston, jokers and exposures. Pick three opponents; each one plays its own way.`
    : 'Four-player riichi mahjong at a late-night table. Pick three opponents; each one plays its own way.';
  const lens = am ? [['Short game', '4 hands'], ['Long game', '8 hands']] : [['East round', '4+ hands'], ['Half game', 'East + South']];
  document.querySelectorAll('#lengthSeg button').forEach((b, i) => { $('.len-name', b).textContent = lens[i][0]; $('.len-sub', b).textContent = lens[i][1]; });
  $('#rulesBtn').textContent = am ? 'Rules' : 'Rules & yaku';
  $('#cardBtn').hidden = !am;
  const grid = $('#personaGrid');
  grid.innerHTML = '';
  for (const p of PERSONAS) {
    const b = el('button', 'persona' + (settings.opponents.includes(p.id) ? ' on' : ''));
    b.innerHTML = `<span class="av" style="--c:${p.color}">${p.emoji}</span><b>${p.name}</b><span class="style">${p.style}</span><p>${am ? p.amBlurb : p.blurb}</p>`;
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
for (const b of document.querySelectorAll('#modeSeg button')) b.onclick = () => { settings.mode = b.dataset.v; saveSettings(); renderMenu(); };
$('#cardBtn').onclick = () => cardsSheet();
$('#focusBtn').onclick = () => setFocus(!settings.focus);

// ---------------------------------------------------------------- cards

// Cards you typed in live in this browser only (js/american/custom.js).
let customCards = loadCustomCards();
setCustomCards(customCards);
function storeCustomCards() { saveCustomCards(customCards); setCustomCards(customCards); }

function cardsSheet() {
  return openSheet((box, done) => {
    box.appendChild(el('h2', '', 'Cards'));
    box.appendChild(el('p', 'sub', 'Pick the card American games are played against. The official card is published each year by the National Mah Jongg League, which sells it and holds its copyright, so it isn’t included here. If you have this year’s or last year’s card, add it below by typing its hands: it stays in this browser and nowhere else.'));
    for (const card of allCards()) {
      const row = el('div', 'card-pick' + (card.id === settings.amCard ? ' on' : ''));
      const n = card.sections.reduce((a, sec) => a + sec.hands.length, 0);
      const pick = el('button', 'cp-main', `<span class="cp-dot"></span><span><b>${esc(card.name)}</b><small>${n} hands · ${card.custom ? 'yours, saved in this browser' : 'original, built in'}</small></span>`);
      pick.onclick = () => { settings.amCard = card.id; saveSettings(); renderMenu(); done(); cardsSheet(); };
      row.appendChild(pick);
      const acts = el('div', 'cp-acts');
      acts.appendChild(btn('View', 'ghost small', () => { done(); AM.cardSheet(card.id); }));
      if (card.custom) {
        acts.appendChild(btn('Edit', 'ghost small', () => { done(); cardEditor(card); }));
        acts.appendChild(btn('Delete', 'danger small', () => {
          if (!confirm(`Delete “${card.name}”? Your record of hands made on it is kept.`)) return;
          customCards = customCards.filter((c) => c.id !== card.id);
          storeCustomCards();
          if (settings.amCard === card.id) { settings.amCard = 'lantern-2026'; saveSettings(); }
          renderMenu(); done(); cardsSheet();
        }));
      }
      row.appendChild(acts);
      box.appendChild(row);
    }
    const btns = el('div', 'sheet-btns');
    btns.appendChild(btn('Add your card', 'ghost', () => { done(); cardEditor(null); }));
    btns.appendChild(btn('Done', 'big', () => done()));
    box.appendChild(btns);
  });
}

const esc = (t) => String(t).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]);

// Type or paste a card, or load a .txt file; the hands are checked as you type.
function cardEditor(card) {
  return openSheet((box, done) => {
    box.appendChild(el('h2', '', card ? `Edit ${esc(card.name)}` : 'Add your card'));
    box.appendChild(el('p', 'sub', 'One hand per line, in the card’s own order. Write each group with a suit letter: groups with the same letter share a suit, different letters are different suits (any suits you like), just like the card’s colours. <b>0</b> is Soap (White dragon), <b>D</b> the dragon of the group’s suit, <b>F</b> a flower, <b>N E W S</b> winds. After the hand, separated by <b>|</b>: its value, <b>C</b> if concealed, <b>shift 1</b> for “any consecutive numbers” (<b>shift 2</b> for any even or odd), and a note. Write <b>or</b> between versions of one hand. <b>[Name]</b> starts a section, <b>#</b> names the card.'));
    box.appendChild(el('pre', 'cp-example', esc('# My 2026 card\n[2026]\nFFFF 2026a 222b 222c or FFFF 2026a 555b 555c | 25 | Kongs 2s or 5s\n[Quints]\n11111a 2222b 33333c | 40 | shift 1 | Any 3 consec. nos.\n[Singles and Pairs]\nFF 2026a 2026b 22c 66c | 50 | C')));
    const ta = el('textarea', 'cp-text');
    ta.spellcheck = false;
    ta.value = card ? card.source : TEMPLATE;
    box.appendChild(ta);
    const status = el('div', 'cp-status');
    box.appendChild(status);
    let parsed = null;
    const check = () => {
      parsed = parseCardText(ta.value, card ? card.id : `custom-${Date.now().toString(36)}`);
      const n = parsed.card ? parsed.card.sections.reduce((a, sec) => a + sec.hands.length, 0) : 0;
      status.innerHTML = `<b class="${n ? 'pos' : 'neg'}">${n} hand${n === 1 ? '' : 's'} read</b>${parsed.card ? ` in ${parsed.card.sections.length} section${parsed.card.sections.length === 1 ? '' : 's'}, card “${esc(parsed.card.name)}”` : ''}` +
        (parsed.errors.length ? `<ul class="cp-errs">${parsed.errors.slice(0, 8).map((e) => `<li>Line ${e.line}: ${esc(e.msg)}</li>`).join('')}${parsed.errors.length > 8 ? `<li>…and ${parsed.errors.length - 8} more</li>` : ''}</ul>` : '');
      save.disabled = !n;
      save.style.opacity = n ? 1 : 0.5;
    };
    ta.oninput = check;
    const file = el('input');
    file.type = 'file';
    file.accept = '.txt,text/plain';
    file.hidden = true;
    file.onchange = async () => { const f = file.files[0]; if (f) { ta.value = await f.text(); check(); } };
    box.appendChild(file);
    const btns = el('div', 'sheet-btns');
    btns.appendChild(btn('Load a .txt file', 'ghost', () => file.click()));
    btns.appendChild(btn('Copy the Lantern card as a start', 'ghost', () => { if (ta.value.trim() && !confirm('Replace what you have typed?')) return; ta.value = cardToText(cardById('lantern-2026')); check(); }));
    btns.appendChild(btn('Cancel', 'pass', () => { done(); cardsSheet(); }));
    const save = btn('Save card', 'big', () => {
      if (!parsed || !parsed.card) return;
      if (parsed.errors.length && !confirm(`${parsed.errors.length} line${parsed.errors.length === 1 ? '' : 's'} couldn’t be read and will be left out. Save anyway?`)) return;
      const i = customCards.findIndex((c) => c.id === parsed.card.id);
      if (i >= 0) customCards[i] = parsed.card; else customCards.push(parsed.card);
      storeCustomCards();
      settings.amCard = parsed.card.id;
      saveSettings();
      renderMenu();
      done();
      cardsSheet();
    });
    btns.appendChild(save);
    box.appendChild(btns);
    check();
  });
}
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

// The American table (js/american/table.js), given what it needs from this page.
const AM = createAmericanTable({
  $, el, btn, sleep, fmt, signed, tileEl, openSheet, callout, settings, ui,
  game: () => game,
  seats: () => seats,
  speed: () => SPEED[settings.speed] || 520,
  waitUnpaused: () => waitUnpaused(),
  oneTap: () => settings.tapMode === 'one' || (settings.tapMode === 'auto' && pointerKind === 'mouse'),
  render: () => render(),
  renderFocus: () => FOCUS.render(),
  updateMatches: () => updateMatches(),
  deltasEl: (dl, sc) => deltasEl(dl, sc),
  helperPersona: () => personaById('kuma'),
  // hold the bots while a sheet (the card) is open over the table; returns the release
  pauseFor: () => {
    if (pauseGate) return null;
    let release;
    pauseGate = { promise: new Promise((r) => { release = r; }) };
    return () => { pauseGate = null; release(); };
  },
});

// Focus mode (js/focus.js): a big hand and a panel in place of the table.
const FOCUS = createFocus({
  $, el, settings, ui, saveSettings, typeTile,
  game: () => game,
  seats: () => seats,
  render: () => render(),
  visibleRemaining: (s, h) => visibleRemaining(s, h),
  amHands: (box) => AM.focusHands(box),
  info: () => (game.mode === 'american' ? AM.focusInfo() : riichiFocusInfo()),
});

function riichiFocusInfo() {
  const g = game, H = g.h;
  return {
    rows: [['Man', [0, 1, 2, 3, 4, 5, 6, 7, 8]], ['Pin', [9, 10, 11, 12, 13, 14, 15, 16, 17]], ['Sou', [18, 19, 20, 21, 22, 23, 24, 25, 26]], ['Honors', [27, 28, 29, 30, 31, 32, 33]]],
    unseen: visibleRemaining(0, H.players[0].hand),
    wall: H.wall.length,
    typeTile,
    tile: tileEl,
    exposures: (s) => H.players[s].melds.map(meldEl),
    discards: (s) => H.players[s].discards,
    seatLine: (s) => {
      const p = H.players[s], w = g.seatWind(s);
      return `${p.riichi ? '<span class="riichi-tag">Riichi</span>' : ''}${WIND_NAMES[w]}${w === 0 ? ' · dealer' : ''} · ${fmt(g.scores[s])}`;
    },
  };
}

function setFocus(on) {
  settings.focus = on;
  saveSettings();
  applyLooks();
  if (game) render();
}

// One line in focus mode's log for each thing that happens at the table.
let lastCaller = null;
function logEvent(type, d, g) {
  const names = seats.map((s) => s.name);
  const am = g.mode === 'american';
  const tn = (id) => (am ? amTileLongName(amType(id)) : tileLongName(typeOf(id)));
  const tt = (t) => (am ? amTileLongName(t) : tileLongName(t));
  const say = (x) => { FOCUS.note(x); };
  switch (type) {
    case 'handStart': FOCUS.reset(); lastCaller = null; say(am ? g.handName() : roundName(g.round)); break;
    case 'charleston': say(`Charleston: everyone passed ${{ 1: 'right', 2: 'across', 3: 'left' }[d.dir]}`); break;
    case 'courtesy': say(`Courtesy pass: ${d.counts[0]} across`); break;
    case 'discard':
      // "Rin called 5 Bam from Kuma (pung), discarded Flower" reads as one move
      if (lastCaller === d.seat) FOCUS.amend(`, discarded ${tn(d.tile)}`);
      else say(`${names[d.seat]} discarded ${tn(d.tile)}${d.riichi ? ' and declared riichi' : ''}`);
      lastCaller = null;
      break;
    case 'call': {
      lastCaller = d.seat;
      const what = am ? { 3: 'pung', 4: 'kong', 5: 'quint', 6: 'sextet' }[d.exposure.n] : { pon: 'pon', chi: 'chi', minkan: 'kan' }[d.type];
      const t = am ? d.exposure.t : typeOf(d.meld.called ?? d.meld.tiles[0]);
      say(`${names[d.seat]} called ${tt(t)} from ${names[d.from]} (${what})`);
      break;
    }
    case 'swap': say(`${names[d.seat]} swapped for a joker in ${d.owner === d.seat ? 'their own' : `${names[d.owner]}’s`} exposure`); break;
    case 'kan': say(`${names[d.seat]} declared a kan`); break;
    case 'handEnd': say(d.kind === 'mahjong' ? `${names[d.wins[0].seat]}: Mahjong!` : d.kind === 'ron' || d.kind === 'tsumo' ? `${d.wins.map((w) => names[w.seat]).join(' and ')}: ${d.kind}` : 'Draw'); break;
  }
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
  const american = save ? save.state.mode === 'american' : isAm();
  const length = save ? save.state.length : settings.length;
  const seed = (Math.random() * 2 ** 31) | 0;
  const resume = save ? save.state : null;
  if (american) {
    const agents = [AM.human, ...personas.map(AM.botAgent)];
    game = new AmericanGame({ agents, length, seed, hooks: { event: onEvent }, resume, cardId: settings.amCard });
  } else {
    const agents = [human, ...personas.map(botAgent)];
    game = new Game({ agents, length, seed, hooks: { event: onEvent }, resume });
  }
  game.opponents = opp;
  game.stake = stake;
  Object.assign(ui, { turn: null, react: null, selected: null, riichiMode: false, reveal: false, pass: null, vote: null, courtesy: null, swapPick: false, fresh: null, amPin: null, lastDiscard: null });
  FOCUS.reset();
  document.body.classList.toggle('american', american);
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
  logEvent(type, d, g);
  if (g.mode === 'american') {
    if (type === 'handStart') writeJSON(SAVE_KEY, { state: g.handStartSnapshot, opponents: g.opponents, stake: g.stake.id });
    if (type === 'gameEnd') await finishGame(d, g);
    else await AM.onEvent(type, d, g);
    if (g !== game) throw new Quit();
    return;
  }
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
      await finishGame(d, g);
      break;
  }
  if (g !== game) throw new Quit();
}

async function finishGame(d, g) {
  try { localStorage.removeItem(SAVE_KEY); } catch { /* ignore */ }
  const me = d.final.find((f) => f.seat === 0);
  const money = W.settleGame(wallet, g.stake, me.points);
  saveWallet();
  const rec = makeRecord(g, seats);
  rec.money = money;
  addGame(rec);
  await endSheet(d, g, money);
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
  if (game.mode === 'american') return AM.render(fresh);
  const g = game, H = g.h;
  $('.bar-dora small').textContent = 'Dora';
  $('#roundName').textContent = roundName(g.round);
  $('#roundSub').textContent = `${g.honba} honba · ${g.sticks} riichi`;
  $('#wallLeft').textContent = H.wall.length;
  $('#centerRound').textContent = roundName(g.round);
  $('#centerWall').textContent = `${H.wall.length} left`;
  const dr = $('#doraRow');
  dr.innerHTML = '';
  doraTypes = new Set(H.doraInd.slice(0, H.doraShown).map((id) => doraOf(typeOf(id))));
  for (let i = 0; i < 5; i++) dr.appendChild(i < H.doraShown ? tileEl(H.doraInd[i], { dora: false }) : tileEl(null, { back: true }));

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
      plate.innerHTML = `<span class="av" style="--c:${st.color}">${st.emoji}</span><span class="who"><b>${st.name}</b><small>${p.riichi ? '<span class="riichi-tag">Riichi</span>' : ''}${WIND_NAMES[wind]}${wind === 0 ? ' · dealer' : ''}</small><small>${st.style}</small></span><span class="dir">${['', 'right', 'across', 'left'][s]}</span>`;
      plate.classList.toggle('turn', turnSeat === s);
    }
  }
  renderHand();
  renderActions();
  renderWaits();
  $('#dock').classList.toggle('acting', !!$('#actions').childElementCount);
  updateMatches();
  FOCUS.render();
}

// Highlight tiles on the table (discards and open melds) that match the tile picked in hand.
function updateMatches() {
  const pick = ui.selected ?? ui.hover;
  const t = pick === null || pick === undefined ? -1 : tType(pick);
  for (const e of document.querySelectorAll('#table .tile[data-id]')) e.classList.toggle('match', tType(+e.dataset.id) === t);
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
  // the freshly drawn tile sits apart on the right, also while riichi discards it automatically
  const ld = H.lastDraw;
  if (p.hand.length % 3 === 2 && ld && ld.seat === 0 && p.hand.includes(ld.tile)) {
    drawn = ld.tile;
    ids = ids.filter((x) => x !== drawn);
  }
  const allowed = t ? new Set(ui.riichiMode ? t.opts.riichi : t.opts.discards) : null;
  const ready = t && settings.showWaits && !p.riichi ? readyDiscards(p) : null;
  if (ui.hover !== null && (!t || !allowed.has(ui.hover))) ui.hover = null;
  const add = (id, gap) => {
    const dim = t && !allowed.has(id);
    const r = !dim && ready ? ready.get(typeOf(id)) : undefined;
    const e = tileEl(id, { cls: (dim ? 'dim' : '') + (gap ? ' gap' : '') + (ui.selected === id ? ' sel' : '') + (r !== undefined ? ' ready' + (r ? ' noyaku' : '') : '') + (ui.react && typeOf(id) === typeOf(ui.react.tile) ? ' hl' : '') });
    e.onclick = () => onTileTap(id);
    // mouse: hovering previews the waits and matching table tiles, since one click discards
    e.onpointerenter = (ev) => { if (ev.pointerType === 'mouse') { ui.hover = id; updateMatches(); renderWaits(); FOCUS.render(); } };
    e.onpointerleave = () => { if (ui.hover === id) { ui.hover = null; updateMatches(); renderWaits(); FOCUS.render(); } };
    hand.appendChild(e);
  };
  ids.forEach((id) => add(id, false));
  if (drawn !== null) add(drawn, true);
}

// Tile types in a 14-tile hand whose discard leaves the hand ready (tenpai),
// mapped to true when that ready hand could never win for lack of a yaku.
function readyDiscards(p) {
  const out = new Map();
  if (p.hand.length % 3 !== 2) return out;
  const c = counts(p.hand);
  for (let t = 0; t < 34; t++) {
    if (!c[t]) continue;
    c[t]--;
    if (shanten(c, p.melds.length) === 0) {
      const rest = p.hand.slice();
      rest.splice(rest.findIndex((id) => typeOf(id) === t), 1);
      const y = waitYaku(rest, p);
      out.set(t, !y.closed && !y.riichi && y.waits.every((w) => !y.any.has(w)));
    }
    c[t]++;
  }
  return out;
}

// For a ready 13-tile hand: which waits win with a yaku by ron, and by ron or tsumo.
// Situational yaku (last tile, after a kan) are left out, since they can't be planned on.
function waitYaku(hand, p) {
  const waits = waitsOf(counts(hand), p.melds.length);
  const closed = p.melds.every((m) => m.kind === 'ankan');
  const ron = new Set(), any = new Set();
  const flags = game.winFlags(0, {});
  for (const w of waits) {
    const tile = w * 4 + 3; // never a red five, so the yaku check ignores red dora
    if (p.riichi || scoreWin({ hand: hand.concat(tile), winTile: tile, tsumo: false, ...flags })) { ron.add(w); any.add(w); }
    else if (scoreWin({ hand: hand.concat(tile), winTile: tile, tsumo: true, ...flags })) any.add(w);
  }
  return { waits, closed, riichi: p.riichi, ron, any };
}

function onTileTap(id) {
  const t = ui.turn;
  if (!t) return;
  const allowed = ui.riichiMode ? t.opts.riichi : t.opts.discards;
  if (!allowed.includes(id)) return;
  const oneTap = settings.tapMode === 'one' || (settings.tapMode === 'auto' && pointerKind === 'mouse');
  if (oneTap || ui.selected === id) {
    ui.hover = null;
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
    const pick = ui.selected ?? ui.hover;
    if (pick === null || !ui.turn || !hand.includes(pick)) return;
    hand.splice(hand.indexOf(pick), 1);
    label = 'Discard this to wait on';
  }
  const c = counts(hand);
  if (shanten(c, p.melds.length) !== 0) return;
  const waits = waitsOf(c, p.melds.length);
  if (!waits.length) return;
  const rem = visibleRemaining(0, hand);
  const y = waitYaku(hand, p);
  box.appendChild(el('span', '', label));
  for (const w of waits) {
    const it = el('span', 'w' + (y.any.has(w) ? '' : ' noyaku'));
    it.appendChild(typeTile(w));
    it.appendChild(el('span', 'n', `×${rem[w]}`));
    box.appendChild(it);
  }
  const furiten = p.discards.some((d) => waits.includes(typeOf(d.id))) || (hand.length === p.hand.length && (p.furitenTemp || p.furitenRiichi));
  if (furiten) box.appendChild(el('span', 'furiten', 'Furiten: no ron'));
  const noRon = waits.filter((w) => !y.ron.has(w)).length;
  if (noRon && !y.riichi) {
    let msg;
    if (y.closed) msg = noRon === waits.length ? 'No yaku: riichi, or win by tsumo' : 'Some waits have no yaku for ron: riichi to be safe';
    else if (waits.every((w) => !y.any.has(w))) msg = "No yaku: this hand can't win";
    else msg = noRon === waits.length && y.any.size ? 'No yaku for ron: tsumo only' : 'No yaku on the crossed-out waits';
    box.appendChild(el('span', 'furiten', msg));
  }
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

function tilesRow(ids, opts) {
  const r = el('div', 'tiles');
  for (const id of ids) r.appendChild(tileEl(id, opts));
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
  d1.appendChild(tilesRow(rec.dora || [], { dora: false }));
  dora.appendChild(d1);
  if (w.riichi && w.ura && w.ura.length) {
    const d2 = el('div', '', '<small>Ura indicators</small>');
    d2.appendChild(tilesRow(w.ura, { dora: false }));
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
    card.appendChild(el('p', 'sub', `${lengthName(g.mode, g.length)} · ${res.log.length} hands · saved to your history`));
    card.appendChild(standingsTable(res.final, seats, g.mode === 'american'));
    if (money && money.buyIn) {
      const m = el('div', 'money');
      m.innerHTML = `<div><small>Buy-in</small><b>${fmt(money.buyIn)}</b></div><div><small>Payout</small><b>${fmt(money.payout)}</b></div><div><small>Profit</small><b class="${money.profit > 0 ? 'pos' : money.profit < 0 ? 'neg' : ''}">${signed(money.profit)}</b></div><div><small>Wallet</small><b>${fmt(wallet.coins)}</b></div>`;
      card.appendChild(m);
      if (money.repaid) card.appendChild(el('p', 'sub', `${fmt(money.repaid)} went to the bank. You still owe ${fmt(wallet.debt)}.`));
      else if (wallet.debt) card.appendChild(el('p', 'sub', `You owe the bank ${fmt(wallet.debt)}.`));
    }
    const btns = el('div', 'sheet-btns');
    btns.appendChild(btn('History', 'ghost', () => { done(); game = null; renderHistory(); show('history'); }));
    btns.appendChild(btn('Main menu', 'ghost', () => { done(); game = null; renderMenu(); show('menu'); }));
    btns.appendChild(btn('Play again', 'big', () => {
      done();
      game = null;
      // same opponents, length and table, if the wallet covers the buy-in
      settings.opponents = g.opponents.slice();
      settings.length = g.length;
      settings.mode = g.mode === 'american' ? 'american' : 'riichi';
      settings.stake = g.stake.id;
      saveSettings();
      if (W.canAfford(wallet, g.stake)) startGame(null);
      else { renderMenu(); show('menu'); }
    }));
    card.appendChild(btns);
  });
}

function lengthName(mode, length) {
  if (mode === 'american') return `American · ${length === 'east' ? 'short' : 'long'} game`;
  return length === 'east' ? 'East round' : 'Half game';
}

function standingsTable(final, seatList, am = false) {
  const t = el('table', 'standings');
  for (const f of final.slice().sort((a, b) => a.place - b.place)) {
    const st = seatList[f.seat] || { name: '?', emoji: '?', color: '#555' };
    const tr = el('tr', f.seat === 0 ? 'me' : '');
    tr.innerHTML = `<td class="place">${f.place}</td><td><span class="av" style="--c:${st.color};width:28px;height:28px;font-size:16px;display:inline-grid;vertical-align:middle;margin-right:8px">${st.emoji}</span>${st.name}</td><td class="num">${am ? signed(f.score) : fmt(f.score)}</td><td class="num ${f.points >= 0 ? 'pos' : 'neg'}">${f.points > 0 ? '+' : ''}${f.points.toFixed(1)}</td>`;
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
  tog('focus', 'Focus mode', 'A big hand and a panel of hands you are close to, tiles left and the table log, in place of the table (also the ◎ button at the table)');
  tog('showWaits', 'Show waits', 'Show which tiles finish a ready hand, mark discards that leave you ready, and warn on furiten');
  tog('autoWin', 'Auto-win', 'Declare ron and tsumo for you');
  tog('noCalls', 'No calls', 'Skip pon, chi and kan prompts');
  tog('redTint', 'Red five shading', 'Give red fives a red-tinted tile');
  tog('doraTint', 'Dora shading', 'Give dora tiles a gold tint (gold and red stripes on a red five that is also dora)');
  const sel = (key, label, hint, options) => {
    const row = el('label', 'toggle', `<span>${label}<small>${hint}</small></span>`);
    const s = el('select');
    for (const [v, t] of options) { const o = el('option', '', t); o.value = v; s.appendChild(o); }
    s.value = settings[key];
    s.onchange = () => { settings[key] = s.value; saveSettings(); applyLooks(); if (game) render(); };
    row.appendChild(s);
    card.appendChild(row);
  };
  styleRow(card);
  sel('speed', 'Bot speed', 'How long the bots think', [['slow', 'Slow'], ['normal', 'Normal'], ['fast', 'Fast']]);
  sel('tapMode', 'Discarding', 'Tap once, or tap to lift then tap again', [['auto', 'Auto (mouse: once)'], ['one', 'One tap'], ['two', 'Two taps']]);
  sel('focusLayout', 'Riichi focus layout', 'How focus mode shows your riichi hand: List (advice in words), Table (stats and one discard table), Dashboard (stats, discards, yaku and opponents side by side) or Matrix (every tile in a grid)', LAYOUTS);
}

// Tile style picker: each choice shows a few tiles drawn in that style.
function styleRow(card) {
  const row = el('div', 'toggle style-row', '<span>Tile style</span>');
  const opts = el('div', 'style-opts');
  const choices = [['classic', 'Classic'], ['labels', 'Corner labels'], ['clear', 'Clear']];
  for (const [v, name] of choices) {
    const b = el('button', 'style-opt' + (settings.tileStyle === v ? ' on' : ''));
    b.type = 'button';
    const tiles = el('div', 'style-tiles');
    for (const id of [5, 16, 61, 121]) {
      const e = tileEl(id, { cls: v === 'labels' ? 'show-lbl' : 'no-lbl' });
      e.firstChild.style.backgroundImage = faceUrl(typeOf(id), isRed(id), v === 'clear' ? 'clear' : 'classic');
      e.removeAttribute('data-id');
      tiles.appendChild(e);
    }
    b.appendChild(tiles);
    b.appendChild(el('small', '', name));
    b.onclick = () => {
      settings.tileStyle = v; saveSettings(); applyLooks(); if (game) render();
      for (const o of opts.children) o.classList.toggle('on', o === b);
    };
    opts.appendChild(b);
  }
  row.appendChild(opts);
  card.appendChild(row);
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
    card.appendChild(el('p', 'sub', `${game.mode === 'american' ? game.handName() : roundName(game.round)} · leaving keeps the game (and its buy-in); it restarts from the beginning of this hand.`));
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
  const all = loadHistory();
  const am = isAm();
  const seg = el('div', 'seg hist-mode');
  for (const [v, label] of [['riichi', 'Riichi'], ['american', 'American']]) {
    const n = all.filter((g) => modeOf(g) === v).length;
    const b = el('button', settings.mode === v ? 'on' : '', `${label}<small>${n} game${n === 1 ? '' : 's'}</small>`);
    b.onclick = () => { settings.mode = v; saveSettings(); renderHistory(); };
    seg.appendChild(b);
  }
  body.appendChild(seg);
  const list = all.filter((g) => modeOf(g) === settings.mode);
  if (!list.length) {
    body.appendChild(el('p', 'empty', `No finished ${am ? 'American' : 'riichi'} games yet. They show up here when a game ends.`));
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
  stat(`${s.points >= 0 ? '+' : ''}${s.points.toFixed(1)}`, am ? 'total points' : 'total points (uma)');
  stat(signed(s.coins), 'coins won');
  stat(pct(s.wins, s.hands), 'hands won');
  stat(pct(s.dealIns, s.hands), am ? 'threw the winning tile' : 'dealt in');
  if (am) stat(s.wins ? pct(s.jokerless || 0, s.wins) : '-', 'wins jokerless');
  else stat(pct(s.riichi, s.hands), 'riichi');
  stat(pct(s.open, s.hands), am ? 'exposed' : 'opened hand');
  stat(s.wins ? fmt(Math.round(s.winPoints / s.wins)) : '-', 'average win');
  body.appendChild(grid);
  if (am) {
    body.appendChild(el('h2', '', 'Your card'));
    body.appendChild(AM.cardProgressEl());
  }
  const places = el('div', 'places');
  s.place.forEach((n) => { const sp = el('span'); sp.style.flex = n; places.appendChild(sp); });
  body.appendChild(el('small', '', `Places: ${s.place.map((n, i) => `${['1st', '2nd', '3rd', '4th'][i]} ${n}`).join(' · ')}`)).style.color = 'var(--muted)';
  body.appendChild(places);
  if (s.best && am) {
    body.appendChild(el('h2', '', 'Best hand'));
    const b = el('div', 'game-row');
    b.style.padding = '10px 12px';
    b.appendChild(el('div', '', `<b>${s.best.section}</b> · ${fmt(s.best.points)}${s.best.jokerless ? ' · jokerless' : ''} <span class="meta">· ${new Date(s.best.date).toLocaleDateString()}</span>`));
    b.appendChild(el('div', 'meta', s.best.handText));
    b.appendChild(AM.winHandRow(s.best));
    body.appendChild(b);
  } else if (s.best) {
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
  head.innerHTML = `<span class="place">${me.place}</span><span><b>${lengthName(g.mode, g.length)}</b> <span class="meta">${new Date(g.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span><span class="opp">${opp}</span></span><span class="pts"><b>${fmt(me.score)}</b><br><span class="${me.points >= 0 ? 'pos' : 'neg'}">${me.points > 0 ? '+' : ''}${me.points.toFixed(1)}</span>${g.money && g.money.buyIn ? `<br><span class="meta ${g.money.profit >= 0 ? 'pos' : 'neg'}">🪙 ${signed(g.money.profit)}</span>` : ''}</span>`;
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
  box.appendChild(standingsTable(g.final, g.seats, g.mode === 'american'));
  const names = g.seats.map((s) => s.name);
  const ul = el('ul', 'hand-log');
  for (const h of g.hands || []) {
    if (g.mode === 'american') { ul.appendChild(AM.historyItem(h, names)); continue; }
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
  $('#rulesTitle').textContent = isAm() ? 'American rules' : 'Rules & yaku';
  if (isAm()) {
    body.innerHTML = AM.rulesHtml(PERSONAS);
    const b = btn('See the card', 'ghost', () => AM.cardSheet());
    b.style.marginTop = '16px';
    body.insertBefore(b, body.children[4]);
    return;
  }
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
