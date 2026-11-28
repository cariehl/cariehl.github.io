// The American mahjong table in the page: agents for you and the bots, the table and hand,
// the hint strip, the card sheet, result sheets, history rows and the rules text.
// ui.js owns the screens and passes in what this needs (see createAmericanTable's argument).

import { amType, amCounts, amSort, isJoker, JOKER } from './tiles.js';
import { parseGroups, missing, exposuresFit, compileCard } from './hands.js';
import { amBotTurn, amBotReaction, amBotPass, amBotVote, amBotCourtesy, closestTargets } from './bots.js';
import { AM_RULES } from './game.js';
import { cardById } from './card.js';
import { loadRecord, saveRecord, noteHand, noteGame, backfill, summary } from './record.js';
import { loadHistory } from '../history.js';

const DIR_NAME = { 1: 'right', 2: 'across', 3: 'left' };
const SET_NAME = { 3: 'Pung', 4: 'Kong', 5: 'Quint', 6: 'Sextet' };
const WIND_LETTER = ['E', 'S', 'W', 'N'];
const WIND_WORD = ['East', 'South', 'West', 'North'];
const STAGE_NAME = { first: 'First Charleston', second: 'Second Charleston', courtesy: 'Courtesy pass' };
const exps = (p) => p.exposures.map((e) => ({ t: e.t, n: e.n }));

export function createAmericanTable(d) {
  const { $, el, btn, sleep, fmt, signed, tileEl, openSheet, callout, settings, ui } = d;
  const amTile = (id, opts = {}) => tileEl(id, { ...opts, am: true });
  const typeId = (t) => (t === 34 ? 136 : t === 35 ? 144 : t * 4 + 1);
  const typeTile = (t, opts) => amTile(typeId(t), opts);

  // ---------------------------------------------------------------- agents

  // Only offer the calls that could matter: you hold two of the tile, or the exposure fits
  // one of the hands you are closest to. (A pair of jokers could call almost anything.)
  function usefulCalls(g, seat, tile, calls) {
    const p = g.h.players[seat];
    const ex = exps(p), c = amCounts(p.hand), t = amType(tile);
    let best = 99;
    const ms = g.cc.targets.map((tg) => { const m = missing(tg, c, ex); if (m >= 0 && m < best) best = m; return m; });
    return calls.filter((call) => call.naturals >= 2 || g.cc.targets.some((tg, i) => ms[i] >= 0 && ms[i] <= best + 1 && exposuresFit(tg, ex.concat({ t, n: call.n }))));
  }

  const human = {
    decideCharleston(g, seat, { count, dir, stage }) {
      return new Promise((resolve) => {
        ui.pass = { count, dir, stage, sel: [], resolve: (ids) => { ui.pass = null; resolve(ids); d.render(); } };
        d.render();
      });
    },
    decideVote() {
      return new Promise((resolve) => { ui.vote = { resolve: (v) => { ui.vote = null; resolve(v); d.render(); } }; d.render(); });
    },
    decideCourtesy() {
      return new Promise((resolve) => { ui.courtesy = { resolve: (v) => { ui.courtesy = null; resolve(v); d.render(); } }; d.render(); });
    },
    decideTurn(g, seat, opts) {
      if (opts.canWin && settings.autoWin) return { type: 'mahjong' };
      return new Promise((resolve) => {
        ui.turn = { opts, resolve: (a) => { ui.turn = null; ui.selected = null; ui.swapPick = false; resolve(a); } };
        d.render();
      });
    },
    decideReaction(g, seat, tile, from, opts) {
      if (opts.mahjong && settings.autoWin) return { type: 'mahjong' };
      const calls = settings.noCalls ? [] : usefulCalls(g, seat, tile, opts.calls);
      if (!opts.mahjong && !calls.length) return { type: 'pass' };
      return new Promise((resolve) => {
        ui.react = { tile, from, opts: { ...opts, calls }, resolve: (a) => { ui.react = null; d.render(); resolve(a); } };
        d.render();
      });
    },
  };

  function botAgent(persona) {
    return {
      decideCharleston: (g, seat, o) => amBotPass(g, seat, o.count, persona),
      decideVote: (g, seat) => amBotVote(g, seat, persona),
      decideCourtesy: (g, seat) => amBotCourtesy(g, seat, persona),
      async decideTurn(g, seat, opts) {
        await sleep(d.speed());
        await d.waitUnpaused();
        return amBotTurn(g, seat, opts, persona);
      },
      decideReaction: (g, seat, tile, from, opts) => amBotReaction(g, seat, tile, from, opts, persona),
    };
  }
  const game = () => d.game();

  // your card over time (record.js), filled from saved games the first time
  let record = null;
  function getRecord() {
    if (!record) {
      record = loadRecord();
      if (backfill(record, loadHistory())) saveRecord(record);
    }
    return record;
  }

  // ---------------------------------------------------------------- events

  async function onEvent(type, ev, g) {
    switch (type) {
      case 'handStart':
        ui.reveal = false;
        ui.lastDiscard = null;
        ui.fresh = null;
        render();
        await callout(g.handName(), null, 1000);
        break;
      case 'charleston': {
        const from = (4 - ev.dir) % 4; // the seat whose tiles reach me
        ui.fresh = new Set(ev.passed[from]);
        render();
        if (ev.counts[0]) await sleep(350);
        break;
      }
      case 'vote':
        render();
        await callout(ev.second ? 'Second Charleston' : 'Charleston over', null, 800);
        break;
      case 'courtesy':
        if (ev.counts[0]) await callout(`Courtesy: ${ev.counts[0]} across`, null, 700);
        break;
      case 'playStart':
        render();
        break;
      case 'draw':
        ui.lastDiscard = null;
        render();
        break;
      case 'discard':
        ui.lastDiscard = ev.seat;
        ui.fresh = null;
        render(true);
        break;
      case 'call':
        ui.lastDiscard = null;
        render();
        await callout(SET_NAME[ev.exposure.n] || 'Call', ev.seat, 650);
        break;
      case 'swap':
        render();
        await callout('Joker swap', ev.seat, 650);
        break;
      case 'handEnd':
        ui.reveal = true;
        render();
        {
          const r = getRecord();
          const noted = noteHand(r, g.cardId, ev, undefined, `${g.seed}:${ev.handNo}`);
          if (ev.last) noteGame(r, g.cardId);
          saveRecord(r);
          if (ev.kind === 'mahjong') await callout('Mahjong!', ev.wins[0].seat, 900);
          else await sleep(600);
          await handSheet(ev, noted);
        }
        break;
    }
  }

  // ---------------------------------------------------------------- the table

  function exposureEl(e) {
    const box = el('div', 'meld');
    e.tiles.forEach((id) => box.appendChild(amTile(id, { side: id === e.called })));
    return box;
  }

  function turnSeat(H) {
    const s = H.players.findIndex((p) => p.hand.length + p.exposures.reduce((a, e) => a + e.n, 0) === 14);
    return s < 0 || H.phase !== 'play' ? null : s;
  }

  function render(fresh = false) {
    const g = game();
    if (!g || !g.h) return;
    const H = g.h, seats = d.seats();
    $('#roundName').textContent = `Hand ${g.handNo + 1}/${g.totalHands}`;
    $('#roundSub').textContent = H.charleston ? `${STAGE_NAME[H.charleston.stage]}` : H.phase === 'charleston' ? 'Charleston' : `${seats[g.dealer].name} dealt`;
    $('#wallLeft').textContent = H.wall.length;
    $('#centerRound').textContent = H.charleston ? `Pass ${DIR_NAME[H.charleston.dir]}` : H.phase === 'charleston' ? 'Charleston' : `Hand ${g.handNo + 1}`;
    $('#centerWall').textContent = H.charleston ? STAGE_NAME[H.charleston.stage] : `${H.wall.length} left`;
    $('.bar-dora small').textContent = g.card.name;
    const dr = $('#doraRow');
    dr.innerHTML = '';
    dr.appendChild(btn('Card', 'ghost small card-btn', () => cardSheet()));

    const ts = turnSeat(H);
    for (let s = 0; s < 4; s++) {
      const p = H.players[s];
      const layer = $(`.layer[data-rel="${s}"]`);
      const river = $('.river', layer);
      river.innerHTML = '';
      p.discards.forEach((x, i) => {
        const cls = (x.called ? 'called' : '') + (ui.lastDiscard === s && i === p.discards.length - 1 ? ' last' + (fresh ? ' fresh' : '') : '');
        river.appendChild(amTile(x.id, { cls }));
      });
      $('.stick', layer).classList.remove('on');
      const melds = $('.melds', layer);
      melds.innerHTML = '';
      for (const e of p.exposures.slice().reverse()) melds.appendChild(exposureEl(e));
      const w = g.seatWind(s);
      const info = $('.seatinfo', layer);
      info.innerHTML = `<span class="wind am${w === 0 ? ' dealer' : ''}">${WIND_LETTER[w]}</span><b>${signed(g.scores[s])}</b>`;
      info.classList.toggle('turn', ts === s);
      const plate = $(`.plate[data-rel="${s}"]`);
      if (plate) {
        const st = seats[s];
        plate.innerHTML = `<span class="av" style="--c:${st.color}">${st.emoji}</span><span class="who"><b>${st.name}</b><small>${WIND_WORD[w]}${w === 0 ? ' · dealer' : ''}${p.exposures.length ? ` · ${p.exposures.length} exposed` : ''}</small><small>${st.style}</small></span><span class="dir">${['', 'right', 'across', 'left'][s]}</span>`;
        plate.classList.toggle('turn', ts === s);
      }
    }
    renderHand();
    renderActions();
    renderHint();
    $('#dock').classList.toggle('acting', !!$('#actions').childElementCount);
    // the hint strip sits above the buttons, however many rows they wrap to
    $('#dock').style.setProperty('--actions-h', `${$('#actions').offsetHeight}px`);
    d.updateMatches();
    d.renderFocus();
  }

  function renderHand() {
    const H = game().h, p = H.players[0];
    const hand = $('#hand');
    hand.innerHTML = '';
    hand.classList.toggle('mine', !!(ui.turn || ui.pass));
    let ids = amSort(p.hand);
    let drawn = null;
    const ld = H.lastDraw;
    if (ui.turn && ld && ld.seat === 0 && p.hand.includes(ld.tile) && ui.turn.opts.drawn === ld.tile) {
      drawn = ld.tile;
      ids = ids.filter((x) => x !== drawn);
    }
    const allowed = ui.turn ? new Set(ui.turn.opts.discards) : ui.pass ? new Set(p.hand.filter((id) => !isJoker(id))) : null;
    // focus mode with a hand pinned: mark the tiles that hand has no use for
    const spare = spareTiles(p);
    if (ui.hover !== null && (!allowed || !allowed.has(ui.hover))) ui.hover = null;
    const add = (id, gap) => {
      const dim = allowed && !allowed.has(id);
      const sel = ui.pass ? ui.pass.sel.includes(id) : ui.selected === id;
      const hl = (ui.fresh && ui.fresh.has(id)) || (ui.react && amType(id) === amType(ui.react.tile));
      let sp = false;
      if (spare && spare[amType(id)] > 0) { spare[amType(id)]--; sp = true; }
      const e = amTile(id, { cls: (dim ? 'dim' : '') + (gap ? ' gap' : '') + (sel ? ' sel' : '') + (hl ? ' hl' : '') + (sp ? ' spare' : '') });
      e.onclick = () => onTileTap(id);
      e.onpointerenter = (ev) => { if (ev.pointerType === 'mouse' && ui.turn) { ui.hover = id; d.updateMatches(); renderHint(); d.renderFocus(); } };
      e.onpointerleave = () => { if (ui.hover === id) { ui.hover = null; d.updateMatches(); renderHint(); d.renderFocus(); } };
      hand.appendChild(e);
    };
    ids.forEach((id) => add(id, false));
    if (drawn !== null) add(drawn, true);
  }

  function onTileTap(id) {
    if (ui.pass) {
      if (isJoker(id)) return;
      const sel = ui.pass.sel;
      const i = sel.indexOf(id);
      if (i >= 0) sel.splice(i, 1);
      else { sel.push(id); if (sel.length > ui.pass.count) sel.shift(); }
      render();
      return;
    }
    const t = ui.turn;
    if (!t || !t.opts.discards.includes(id)) return;
    const style = d.discardStyle();
    if (style === 'one' || (style === 'two' && ui.selected === id)) { discard(id); return; }
    // two taps: lift, tap again; button: a tap lifts the tile (or drops it), Discard confirms
    ui.selected = style === 'button' && ui.selected === id ? null : id;
    render();
  }

  function discard(id) {
    const t = ui.turn;
    if (!t || !t.opts.discards.includes(id)) return;
    ui.hover = null;
    t.resolve({ type: 'discard', tile: id });
    render();
  }

  function setBtn(types, label, fn, cls = '') {
    const b = el('button', 'btn chi-opt ' + cls);
    if (label) b.appendChild(el('span', '', label + '&nbsp;'));
    for (const t of types) b.appendChild(typeTile(t));
    b.onclick = fn;
    return b;
  }

  function renderActions() {
    const box = $('#actions');
    box.innerHTML = '';
    const g = game();
    if (ui.pass) {
      const { count, dir, stage, sel } = ui.pass;
      box.appendChild(el('span', 'note', `Pick ${count} · pass ${DIR_NAME[dir]}`));
      box.appendChild(btn('Suggest', 'pass', () => {
        ui.pass.sel = amBotPass(g, 0, count, d.helperPersona());
        render();
      }));
      const b = btn(`Pass ${sel.length}/${count}`, '', () => ui.pass.resolve(sel.slice()));
      b.disabled = sel.length !== count;
      if (b.disabled) b.style.opacity = 0.5;
      box.appendChild(b);
      return;
    }
    if (ui.vote) {
      box.appendChild(el('span', 'note', 'Play the second Charleston?'));
      box.appendChild(btn('Keep passing', '', () => ui.vote.resolve(true)));
      box.appendChild(btn('Stop', 'pass', () => ui.vote.resolve(false)));
      return;
    }
    if (ui.courtesy) {
      box.appendChild(el('span', 'note', 'Courtesy pass across: how many tiles?'));
      for (const n of [0, 1, 2, 3]) box.appendChild(btn(String(n), 'num' + (n ? '' : ' pass'), () => ui.courtesy.resolve(n)));
      return;
    }
    if (ui.turn) {
      const o = ui.turn.opts;
      if (ui.swapPick) {
        for (const s of o.swaps) {
          const who = s.owner === 0 ? 'yours' : d.seats()[s.owner].name;
          box.appendChild(setBtn([s.t, 35], `${who}:`, () => ui.turn.resolve({ type: 'swap', owner: s.owner, idx: s.idx })));
        }
        box.appendChild(btn('Back', 'pass', () => { ui.swapPick = false; render(); }));
        return;
      }
      if (o.canWin) box.appendChild(btn('Mahjong!', 'ron', () => ui.turn.resolve({ type: 'mahjong' })));
      if (o.swaps.length) box.appendChild(btn('Swap for joker', '', () => {
        if (o.swaps.length === 1) ui.turn.resolve({ type: 'swap', owner: o.swaps[0].owner, idx: o.swaps[0].idx });
        else { ui.swapPick = true; render(); }
      }));
      if (d.discardStyle() === 'button') {
        const id = o.discards.includes(ui.selected) ? ui.selected : null;
        const b = id === null ? btn('Discard', 'discard-btn', () => {}) : setBtn([amType(id)], 'Discard', () => discard(id), 'discard-btn');
        b.disabled = id === null;
        if (b.disabled) b.style.opacity = 0.5;
        box.appendChild(b);
      }
      return;
    }
    if (ui.react) {
      const { opts, tile } = ui.react;
      const t = amType(tile);
      if (opts.mahjong) box.appendChild(btn('Mahjong!', 'ron', () => ui.react.resolve({ type: 'mahjong' })));
      for (const call of opts.calls) {
        const types = [...call.combo.map(amType), t];
        box.appendChild(setBtn(types, SET_NAME[call.n], () => ui.react.resolve({ type: 'call', n: call.n })));
      }
      box.appendChild(btn('Skip', 'pass', () => ui.react.resolve({ type: 'pass' })));
    }
  }

  // Which of your tiles a target uses: real tiles go to pairs and singles first, then sets;
  // jokers fill what's left of sets. fill[i] has one entry per tile of unit i: 'x' exposed,
  // 'n' a real tile you hold, 'j' a joker, null still missing. rest: counts left over.
  function assign(tg, c, exposures) {
    const rest = c ? c.slice() : null;
    const expLeft = exposures.map((e) => `${e.t}:${e.n}`);
    const fill = tg.units.map((u) => {
      const k = `${u.t}:${u.n}`;
      if (u.n >= 3 && expLeft.includes(k)) { expLeft.splice(expLeft.indexOf(k), 1); return new Array(u.n).fill('x'); }
      return new Array(u.n).fill(null);
    });
    if (rest) {
      for (const pass of [0, 1]) tg.units.forEach((u, i) => {
        if ((u.n >= 3) !== (pass === 1)) return;
        fill[i] = fill[i].map((f) => (f === null && rest[u.t] > 0 ? (rest[u.t]--, 'n') : f));
      });
      tg.units.forEach((u, i) => {
        if (u.n >= 3) fill[i] = fill[i].map((f) => (f === null && rest[JOKER] > 0 ? (rest[JOKER]--, 'j') : f));
      });
    }
    return { fill, rest };
  }

  // Your closest hand on the card, drawn as tiles: the ones you hold, jokers standing in,
  // and the ones still missing dimmed.
  function targetRow(tg, c, exposures, cls = 'tg-row') {
    const row = el('div', 'tiles ' + cls);
    const { fill } = assign(tg, c, exposures);
    let lastG = -1;
    tg.units.forEach((u, i) => {
      if (lastG >= 0 && u.g !== lastG) row.appendChild(el('span', 'tg-gap'));
      lastG = u.g;
      for (const f of fill[i]) {
        if (f === 'j') row.appendChild(typeTile(JOKER));
        else row.appendChild(typeTile(u.t, { cls: c && f === null ? 'dim missing' : f === 'x' ? 'exposed' : '' }));
      }
    });
    return row;
  }

  function renderHint() {
    const box = $('#waits');
    box.innerHTML = '';
    box.hidden = true;
    box.classList.remove('am-hint');
    const g = game();
    if (!settings.showWaits || !g || !g.h || ui.reveal || settings.focus) return;
    const p = g.h.players[0];
    let hand = p.hand.slice();
    const pick = ui.pass ? null : ui.selected ?? ui.hover;
    if (pick !== null && pick !== undefined && hand.includes(pick)) hand.splice(hand.indexOf(pick), 1);
    if (ui.pass) hand = hand.filter((id) => !ui.pass.sel.includes(id));
    const c = amCounts(hand);
    const ex = exps(p);
    const [best] = closestTargets(g.cc, c, ex, 1);
    if (!best) {
      box.appendChild(el('span', 'furiten', 'Your exposures fit no hand on the card'));
      box.hidden = false;
      return;
    }
    box.classList.add('am-hint');
    const need = best.m;
    const full = hand.length + ex.reduce((s, e) => s + e.n, 0) === 14;
    box.appendChild(el('span', '', `${pick !== null && pick !== undefined ? 'After this discard: ' : ''}${need === 0 && full ? 'Mahjong!' : `${need} away`} · ${best.tg.hand.section}`));
    box.appendChild(targetRow(best.tg, c, ex));
    box.hidden = false;
  }


  // ---------------------------------------------------------------- focus mode

  // The tiles you're judging: your hand, less the tile you've lifted to discard or picked to pass.
  function judgedHand(p) {
    let hand = p.hand.slice();
    const pick = ui.pass ? null : ui.selected ?? ui.hover;
    const picked = pick !== null && pick !== undefined && hand.includes(pick);
    if (picked) hand.splice(hand.indexOf(pick), 1);
    if (ui.pass) hand = hand.filter((id) => !ui.pass.sel.includes(id));
    return { hand, picked: picked || !!(ui.pass && ui.pass.sel.length) };
  }

  function pinnedBest(p) {
    const g = game();
    if (ui.amPin === null || ui.amPin === undefined || !g || !g.h) return null;
    const c = amCounts(p.hand), ex = exps(p);
    return closestTargets(g.cc, c, ex, 0).find((x) => x.tg.hand.index === ui.amPin) || null;
  }

  // Counts of tile types the pinned hand doesn't use, or null.
  function spareTiles(p) {
    if (!settings.focus || ui.reveal) return null;
    const b = pinnedBest(p);
    if (!b) return null;
    return assign(b.tg, amCounts(p.hand), exps(p)).rest;
  }

  // The Hands tab: every hand on the card, closest first, drawn in the suits you're nearest to.
  // Tap one to pin it: it stays on top and the tiles it doesn't use are marked in your hand.
  function focusHands(box) {
    const g = game();
    const p = g.h.players[0];
    const { hand, picked } = judgedHand(p);
    const c = amCounts(hand), ex = exps(p);
    const full = hand.length + ex.reduce((s, e) => s + e.n, 0) === 14;
    const list = closestTargets(g.cc, c, ex, 0);
    const blocked = g.cc.hands.filter((h) => !list.some((x) => x.tg.hand === h));
    const sum = summary(getRecord(), g.cc);
    const head = el('div', 'fx-note');
    head.innerHTML = `${picked ? (ui.pass ? '<b>After this pass</b> · ' : '<b>After this discard</b> · ') : ''}${list.length} hands possible${blocked.length ? `, ${blocked.length} blocked by your exposures` : ''} · <span class="muted">tap a hand to pin it</span>`;
    box.appendChild(head);
    const pin = list.find((x) => x.tg.hand.index === ui.amPin);
    if (ui.amPin !== null && ui.amPin !== undefined && !pin) ui.amPin = null;
    const order = pin ? [pin, ...list.filter((x) => x !== pin)] : list;
    for (const x of order) box.appendChild(focusRow(x.tg.hand, x, c, ex, full, sum));
    for (const h of blocked) box.appendChild(focusRow(h, null, c, ex, full, sum));
  }

  function focusRow(hand, best, c, ex, full, sum) {
    const pinned = best && ui.amPin === hand.index;
    const row = el('button', 'fx-hand' + (pinned ? ' pinned' : '') + (best ? '' : ' blocked'));
    const m = best ? best.m : null;
    const away = el('span', 'fx-away' + (m === null ? ' no' : m === 0 && full ? ' win' : m <= 2 ? ' near' : m <= 5 ? ' mid' : ''));
    away.innerHTML = m === null ? '–' : m === 0 && full ? '✓' : `${m}<small>away</small>`;
    row.appendChild(away);
    const tg = best ? best.tg : game().cc.targets.find((x) => x.hand === hand);
    row.appendChild(targetRow(tg, best ? c : null, best ? ex : [], 'tg-row fx-tiles'));
    const mine = sum.hands[hand.text];
    const meta = el('span', 'fx-meta');
    meta.innerHTML = `${pinned ? '<span class="pin">📌</span>' : ''}<b>${hand.section}</b> <span class="v">${hand.concealed ? 'C' : 'X'} ${hand.value}</span>${mine && mine.wins ? ` <span class="made-tag">✓${mine.wins}</span>` : ''}${hand.note ? `<small>${hand.note}</small>` : ''}${best ? '' : '<small class="neg">Your exposures don’t fit</small>'}`;
    row.appendChild(meta);
    if (best) row.onclick = () => { ui.amPin = pinned ? null : hand.index; render(); };
    return row;
  }

  // Tile groups for the Tiles tab: each suit with its dragon, then winds, flowers and jokers.
  const TILE_ROWS = [
    ['Craks', [0, 1, 2, 3, 4, 5, 6, 7, 8, 33]],
    ['Bams', [18, 19, 20, 21, 22, 23, 24, 25, 26, 32]],
    ['Dots', [9, 10, 11, 12, 13, 14, 15, 16, 17, 31]],
    ['Winds', [27, 28, 29, 30]],
    ['Others', [34, 35]],
  ];
  // How many of each type you can't see: 4 of most, 8 flowers, 8 jokers, less your hand,
  // every discard and every exposed tile.
  function unseen() {
    const H = game().h;
    const left = new Array(36).fill(4);
    left[34] = 8; left[35] = 8;
    const p0 = H.players[0];
    for (const id of p0.hand) left[amType(id)]--;
    for (const p of H.players) {
      for (const x of p.discards) if (!x.called) left[amType(x.id)]--;
      for (const e of p.exposures) for (const id of e.tiles) left[amType(id)]--;
    }
    return left.map((x) => Math.max(0, x));
  }

  function focusInfo() {
    const g = game();
    return {
      rows: TILE_ROWS,
      unseen: unseen(),
      wall: g.h.wall.length,
      typeTile,
      tile: amTile,
      exposures: (s) => g.h.players[s].exposures.map(exposureEl),
      discards: (s) => g.h.players[s].discards,
      seatLine: (s) => {
        const p = g.h.players[s], w = g.seatWind(s);
        return `${WIND_WORD[w]}${w === 0 ? ' · dealer' : ''} · ${signed(g.scores[s])}${p.exposures.length ? ` · ${p.exposures.length} exposed` : ''}`;
      },
    };
  }

  // ---------------------------------------------------------------- the card

  function handText(hand) {
    const span = el('span', 'card-text');
    hand.text.split(/\s+or\s+/i).forEach((alt, i) => {
      if (i) span.appendChild(el('span', 'or', 'or'));
      for (const grp of parseGroups(alt)) span.appendChild(el('span', grp.suit ? `s${grp.suit}` : 'sn', grp.symbols.join('')));
    });
    return span;
  }

  function cardSheet(cardId) {
    const g = game();
    const card = g && g.h ? g.card : cardById(cardId || settings.amCard);
    const cc = compileCard(card);
    let pause = null;
    if (g && g.h && d.pauseFor) pause = d.pauseFor();
    return openSheet((box, done) => {
      box.appendChild(el('h2', '', card.name));
      const sum = summary(getRecord(), cc);
      box.appendChild(progressEl(sum));
      box.appendChild(el('p', 'sub', 'Colours mark suits, not particular ones: two groups in the same colour share a suit, different colours are different suits. 0 is the Soap (White dragon); D is the dragon of that group’s suit (Craks Red, Bams Green, Dots Soap). X: you may expose sets. C: concealed. Jokers fill sets of three or more, never pairs or singles.'));
      let c = null, ex = [];
      let best = new Map();
      if (g && g.h) {
        const p = g.h.players[0];
        c = amCounts(p.hand);
        ex = exps(p);
        for (const x of closestTargets(cc, c, ex, 0)) best.set(x.tg.hand.index, x);
      }
      let section = '';
      for (const hand of cc.hands) {
        if (hand.section !== section) { section = hand.section; box.appendChild(el('h3', 'shop-h', section)); }
        const row = el('div', 'card-hand');
        const top = el('div', 'card-top');
        top.appendChild(handText(hand));
        const b = best.get(hand.index);
        const mine = sum.hands[hand.text];
        if (mine && mine.wins) row.classList.add('made');
        top.appendChild(el('span', 'card-val', `${mine && mine.wins ? `<span class="made-tag" title="Made ${mine.wins}×, best ${mine.best}${mine.jokerless ? `, ${mine.jokerless} jokerless` : ''}">✓ ${mine.wins}×</span> ` : ''}` + `${b ? `<em class="${b.m <= 3 ? 'pos' : ''}">${b.m} away</em> · ` : g && g.h ? '<em class="neg">blocked</em> · ' : ''}${hand.concealed ? 'C' : 'X'} ${hand.value}`));
        row.appendChild(top);
        if (hand.note) row.appendChild(el('small', '', hand.note));
        const tg = b ? b.tg : cc.targets.find((x) => x.hand === hand);
        row.appendChild(targetRow(tg, b ? c : null, b ? ex : [], 'tg-row card-tiles'));
        box.appendChild(row);
      }
      const btns = el('div', 'sheet-btns');
      btns.appendChild(btn('Close', 'big', () => { done(); if (pause) pause(); }));
      box.appendChild(btns);
    });
  }

  // Made hands out of the whole card, with a bar per section.
  function progressEl(sum) {
    const box = el('div', 'card-progress');
    box.appendChild(el('p', 'sub', sum.made
      ? `You’ve made <b>${sum.made} of ${sum.total}</b> hands on this card (${sum.wins} win${sum.wins === 1 ? '' : 's'} in ${sum.played} hand${sum.played === 1 ? '' : 's'} played). Made hands are in gold.`
      : `You haven’t made a hand on this card yet${sum.played ? ` (${sum.played} hands played)` : ''}. Hands you make turn gold here.`));
    const grid = el('div', 'sec-grid');
    for (const s of sum.sections) {
      const it = el('div', 'sec' + (s.made === s.total ? ' full' : ''));
      it.appendChild(el('span', 'nm', s.name));
      it.appendChild(el('span', 'ct', `${s.made}/${s.total}`));
      const bar = el('span', 'bar');
      bar.appendChild(el('i')).style.width = `${(100 * s.made) / s.total}%`;
      it.appendChild(bar);
      grid.appendChild(it);
    }
    box.appendChild(grid);
    return box;
  }

  // For the history page: your progress on the current card, with a button to open it.
  function cardProgressEl() {
    const card = cardById(settings.amCard);
    const box = el('div', 'game-row card-progress-row');
    box.appendChild(el('div', 'card-top', `<b>${card.name}</b>`));
    box.appendChild(progressEl(summary(getRecord(), compileCard(card))));
    const b = btn('Open your card', 'ghost small', () => cardSheet(card.id));
    box.appendChild(b);
    return box;
  }

  // ---------------------------------------------------------------- result sheets

  function winHandRow(w, cls = 'res-hand') {
    const row = el('div', cls);
    for (const id of amSort(w.hand)) row.appendChild(amTile(id));
    if (w.tile !== null && w.tile !== undefined) { row.appendChild(el('span', 'gap')); row.appendChild(amTile(w.tile, { cls: 'hl' })); }
    for (const e of w.exposures || []) row.appendChild(exposureEl(e));
    return row;
  }

  function handSheet(rec, noted) {
    const seats = d.seats();
    const names = seats.map((s) => s.name);
    return openSheet((card, done) => {
      if (rec.kind === 'mahjong') {
        const w = rec.wins[0];
        card.appendChild(el('h2', '', `${names[w.seat]} ${w.seat === 0 ? 'win' : 'wins'}: Mahjong!`));
        card.appendChild(el('p', 'sub', `Hand ${rec.handNo + 1} · ${w.from === null ? 'self-picked' : `on ${names[w.from]}’s discard`}`));
        const head = el('div', 'card-top');
        head.appendChild(handText({ text: w.altText || w.handText }));
        head.appendChild(el('span', 'card-val', `${w.section} · ${w.concealed ? 'C' : 'X'} ${w.base}`));
        card.appendChild(head);
        card.appendChild(winHandRow(w));
        if (noted) card.appendChild(el('p', 'sub card-note', noted.firstTime ? `★ First time you’ve made this hand. It’s marked on your card.` : `You’ve made this hand ${noted.entry.wins} times.`));
        const ul = el('ul', 'yaku');
        ul.appendChild(el('li', '', `<span>Hand value</span><span>${w.base}</span>`));
        if (w.jokerless) ul.appendChild(el('li', '', '<span>Jokerless</span><span>×2</span>'));
        ul.appendChild(el('li', '', w.from === null ? `<span>Self-picked: everyone pays double</span><span>3 × ${2 * w.value}</span>` : `<span>${names[w.from]} ${w.from === 0 ? 'pay' : 'pays'} double, the others once</span><span>${2 * w.value} + ${w.value} + ${w.value}</span>`));
        card.appendChild(ul);
        card.appendChild(el('div', 'total', `<span>${names[w.seat]} ${w.seat === 0 ? 'collect' : 'collects'}</span><span>${fmt(w.points)}</span>`));
      } else {
        card.appendChild(el('h2', '', 'Wall game'));
        card.appendChild(el('p', 'sub', 'The wall ran out before anyone made Mahjong. Nobody pays.'));
      }
      card.appendChild(d.deltasEl(rec.deltas, rec.scores));
      const btns = el('div', 'sheet-btns');
      btns.appendChild(btn(rec.last ? 'See results' : 'Next hand', 'big', () => done()));
      card.appendChild(btns);
    });
  }

  // one hand in a saved game's detail
  function historyItem(h, names) {
    const li = el('li');
    let title = 'Wall game', right = '';
    const w = h.wins && h.wins[0];
    if (w) {
      title = w.from === null ? `${names[w.seat]} self-picked` : `${names[w.seat]} on ${names[w.from]}’s discard`;
      right = fmt(w.points);
    }
    const my = h.deltas[0];
    li.appendChild(el('div', 'hl-head', `<span><b>Hand ${h.handNo + 1}</b> · ${title}</span><span>${right ? right + ' · ' : ''}<span class="${my > 0 ? 'pos' : my < 0 ? 'neg' : ''}">you ${signed(my)}</span></span>`));
    if (w) {
      li.appendChild(el('div', 'yk', `${w.section}: ${w.handText} · ${w.base}${w.jokerless ? ' · jokerless ×2' : ''}`));
      li.appendChild(winHandRow(w));
    }
    return li;
  }

  // ---------------------------------------------------------------- rules

  function rulesHtml(personas) {
    const card = cardById(settings.amCard);
    return `
    <h2>American mahjong</h2>
    <p>Four players, 152 tiles: the three suits (Craks, Bams and Dots) 1-9, four winds, three dragons, eight flowers and eight jokers, four of each tile otherwise. The White dragon is called <b>Soap</b> and doubles as the zero in year hands like 2026. You play to make one of the hands on the card, exactly as written. A short game is ${AM_RULES.hands.east} hands (everyone deals once), a long game ${AM_RULES.hands.south}.</p>
    <h2>The card</h2>
    <p>The real card changes every year and belongs to the National Mah Jongg League, which sells it; its hands are copyrighted, so this table plays the <b>${card.name}</b>, an original card in the same style and categories: the year (2026), 2468, any like numbers, quints, consecutive runs, 13579, winds and dragons, 369, and singles and pairs. Tap <b>Card</b> during a game to see every hand and how far you are from it.</p>
    <p>Colours mark suits: groups in one colour share a suit, different colours are different suits, and you choose which. D is the dragon that goes with a group's suit (Craks Red, Bams Green, Dots Soap). X hands may have exposures; C hands are concealed, so you may only call the tile that wins.</p>
    <h2>The Charleston</h2>
    <p>Before play everyone passes three tiles right, then across, then left. Then, if all four agree, a second Charleston passes left, across and right. Last comes an optional courtesy pass of up to three tiles with the player across (you pass as many as the smaller offer). Jokers are never passed. (Blind passing isn't played here.)</p>
    <h2>Play</h2>
    <ul>
      <li>East starts with 14 tiles and discards first; play goes to the right. Draw, then discard.</li>
      <li>Any player may call a discard to <b>expose</b> a pung (3), kong (4), quint (5) or sextet (6) of the same tile, using jokers for any of them. The caller then discards. Pairs and singles can only be called to win. The player next in turn gets a contested tile; Mahjong beats an exposure.</li>
      <li>Jokers stand in for any tile of a set of three or more, never a pair or a single. A discarded joker is dead.</li>
      <li>On your turn you may swap a real tile from your hand for a joker in anyone's exposure, if the joker stands for that tile.</li>
      <li>You're asked about calls when you hold two of the tile, or the exposure fits one of the hands you're closest to. Mahjong is always offered.</li>
      <li>If the wall runs out, it's a wall game and nobody pays.</li>
    </ul>
    <h2>Paying</h2>
    <p>The hand's value from the card. Win on a discard: the discarder pays double, the other two pay the value. Self-picked: all three pay double. A hand with no jokers in it doubles again (jokerless), except singles-and-pairs hands, which can't use jokers anyway. Final points for coins and history are your score ÷ ${AM_RULES.pointsPer}.</p>
    <h2>The bots</h2>
    <table class="yaku-table">${personas.map((p) => `<tr><td>${p.emoji} <b>${p.name}</b> · ${p.style}<small>${p.amBlurb}</small></td><td></td></tr>`).join('')}</table>`;
  }

  return { human, botAgent, onEvent, render, cardSheet, cardProgressEl, historyItem, winHandRow, rulesHtml, handText, focusHands, focusInfo };
}
