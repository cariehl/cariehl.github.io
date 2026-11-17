// Focus mode: the table's rivers and seats make way for a big hand row and a panel with three
// tabs. Hands: how close you are to each hand on the card (American) or to ready and to each
// yaku (riichi). Tiles: how many of every tile you haven't seen yet. Table: each opponent's
// exposures and discards, and a log of what just happened.
// ui.js and american/table.js supply the mode-specific parts through `d`.

import { typeOf, counts, isYaochu, suitOf, doraOf } from './tiles.js';
import { shanten, shantenChiitoi } from './shanten.js';

const TABS = [['hands', 'Hands'], ['tiles', 'Tiles'], ['table', 'Table']];
const SUITS = ['Man', 'Pin', 'Sou'];
const HONOR_NAMES = ['East', 'South', 'West', 'North', 'White dragon', 'Green dragon', 'Red dragon'];

export function createFocus(d) {
  const { $, el, settings, ui } = d;
  let log = [];

  // ------------------------------------------------------------ the log

  function reset() { log = []; }
  function note(text) {
    log.push(text);
    if (log.length > 80) log.shift();
  }
  function amend(text) {
    if (log.length) log[log.length - 1] += text;
  }

  // ------------------------------------------------------------ rendering

  function render() {
    const box = $('#focus');
    const g = d.game();
    const on = !!settings.focus && !!g && !!g.h;
    box.hidden = !on;
    if (!on) return;
    const tab = TABS.some(([k]) => k === settings.focusTab) ? settings.focusTab : 'hands';
    const tabs = $('.fx-tabs', box);
    tabs.innerHTML = '';
    for (const [k, label] of TABS) {
      const b = el('button', k === tab ? 'on' : '', label === 'Hands' && g.mode !== 'american' ? 'Hand' : label);
      b.onclick = () => { settings.focusTab = k; d.saveSettings(); render(); $('.fx-body', box).scrollTop = 0; };
      tabs.appendChild(b);
    }
    renderLast($('.fx-last', box), g);
    const body = $('.fx-body', box);
    const keep = body.dataset.tab === tab ? body.scrollTop : 0;
    body.innerHTML = '';
    body.dataset.tab = tab;
    if (tab === 'hands') (g.mode === 'american' ? d.amHands : riichiHands)(body);
    else if (tab === 'tiles') tilesTab(body, d.info());
    else tableTab(body, d.info());
    body.scrollTop = keep;
  }

  // The last discard, big, with who threw it: the tile you'd be calling.
  function renderLast(box, g) {
    box.innerHTML = '';
    const s = ui.lastDiscard;
    const H = g.h;
    if (s === null || s === undefined || !H.players[s].discards.length) {
      box.appendChild(el('span', 'fx-wall', `${H.wall.length} in the wall`));
      return;
    }
    const x = H.players[s].discards[H.players[s].discards.length - 1];
    const info = d.info();
    box.appendChild(el('span', 'fx-from', `${ui.react ? '<b>Call?</b> ' : ''}${d.seats()[s].name} discarded<small>${H.wall.length} in the wall</small>`));
    box.appendChild(info.tile(x.id, { cls: 'fx-big' }));
  }

  // ------------------------------------------------------------ Tiles tab

  function tilesTab(box, info) {
    box.appendChild(el('div', 'fx-note', `Tiles you haven't seen yet (not in your hand, the discards or any exposure) · ${info.wall} in the wall`));
    const grid = el('div', 'fx-grid');
    for (const [name, types] of info.rows) {
      const row = el('div', 'fx-trow');
      row.appendChild(el('span', 'fx-rname', name));
      const tiles = el('div', 'fx-tcells');
      for (const t of types) {
        const n = info.unseen[t];
        const cell = el('span', 'fx-cell' + (n === 0 ? ' gone' : n === 1 ? ' last' : ''));
        cell.appendChild(info.typeTile(t));
        cell.appendChild(el('b', '', String(n)));
        tiles.appendChild(cell);
      }
      row.appendChild(tiles);
      grid.appendChild(row);
    }
    box.appendChild(grid);
  }

  // ------------------------------------------------------------ Table tab

  function tableTab(box, info) {
    const seats = d.seats();
    for (const s of [3, 2, 1]) {
      const st = seats[s];
      const row = el('div', 'fx-opp');
      row.appendChild(el('div', 'fx-who', `<span class="av" style="--c:${st.color}">${st.emoji}</span><span><b>${st.name}</b><small>${['', 'right', 'across', 'left'][s]} · ${info.seatLine(s)}</small></span>`));
      const ex = el('div', 'fx-exp');
      const melds = info.exposures(s);
      if (melds.length) melds.forEach((m) => ex.appendChild(m));
      else ex.appendChild(el('span', 'muted', 'No exposures'));
      row.appendChild(ex);
      const dis = el('div', 'tiles fx-dis');
      info.discards(s).forEach((x, i, all) => dis.appendChild(info.tile(x.id, { cls: (x.called ? 'called' : '') + (i === all.length - 1 && ui.lastDiscard === s ? ' last' : '') })));
      row.appendChild(dis);
      box.appendChild(row);
    }
    if (log.length) {
      box.appendChild(el('h3', 'fx-h', 'What happened'));
      const ul = el('ul', 'fx-log');
      for (const line of log.slice(-14).reverse()) ul.appendChild(el('li', '', line));
      box.appendChild(ul);
    }
  }

  // ------------------------------------------------------------ riichi: Hand tab

  function riichiHands(box) {
    const g = d.game(), H = g.h, p = H.players[0];
    const melds = p.melds.length;
    const pick = ui.selected ?? ui.hover;
    let hand = p.hand.slice();
    let picked = false;
    if (hand.length % 3 === 2 && pick !== null && pick !== undefined && hand.includes(pick)) { hand.splice(hand.indexOf(pick), 1); picked = true; }
    const c = counts(hand);
    const rem = d.visibleRemaining(0, p.hand);
    const s = shanten(c, melds);

    const head = el('div', 'fx-status');
    const word = s === -1 ? 'Complete hand' : s === 0 ? 'Ready' : `${s} tile${s === 1 ? '' : 's'} from ready`;
    head.innerHTML = `${picked ? '<b>After this discard:</b> ' : ''}<span class="fx-sh ${s <= 0 ? 'win' : s === 1 ? 'near' : ''}">${word}</span>`;
    box.appendChild(head);

    if (hand.length % 3 === 2 && s >= 0) {
      // your turn: rank the discards
      const opts = discardOptions(p, rem, melds);
      box.appendChild(el('h3', 'fx-h', 'Best discards <small>tap one to lift it</small>'));
      const list = el('div', 'fx-list');
      const top = opts[0];
      for (const o of opts.slice(0, 6)) {
        const r = el('button', 'fx-opt' + (o.s === top.s && o.n === top.n ? ' best' : '') + (ui.selected === o.id ? ' on' : ''));
        r.appendChild(d.typeTile(o.t));
        r.appendChild(el('span', 'fx-res', `${o.s === 0 ? 'ready' : `${o.s} from ready`}<small>${o.n} tile${o.n === 1 ? '' : 's'} help (${o.acc.length} kind${o.acc.length === 1 ? '' : 's'})</small>`));
        r.appendChild(accRow(o.acc, rem));
        r.onclick = () => { if (ui.turn && ui.turn.opts.discards.includes(o.id)) { ui.selected = o.id; d.render(); } };
        list.appendChild(r);
      }
      box.appendChild(list);
    } else if (s >= 0) {
      const acc = accepts(c, melds, rem, s);
      const n = acc.reduce((a, t) => a + rem[t], 0);
      box.appendChild(el('h3', 'fx-h', s === 0 ? `Waiting on <small>${n} left</small>` : `Tiles that help <small>${n} left, ${acc.length} kinds</small>`));
      box.appendChild(accRow(acc, rem, true));
    }

    box.appendChild(el('h3', 'fx-h', 'Yaku within reach <small>tiles to change, roughly</small>'));
    const list = el('div', 'fx-list');
    for (const y of yakuPaths(g, p, hand, s)) {
      const r = el('div', 'fx-yaku' + (y.d === null ? ' blocked' : ''));
      r.appendChild(el('span', 'fx-away' + (y.d === null ? ' no' : y.d === 0 ? ' win' : y.d <= 2 ? ' near' : y.d <= 4 ? ' mid' : ''), y.d === null ? '–' : y.d === 0 ? '✓' : `${y.d}<small>away</small>`));
      r.appendChild(el('span', 'fx-meta', `<b>${y.name}</b> <span class="v">${y.han}</span><small>${y.why}</small>`));
      list.appendChild(r);
    }
    box.appendChild(list);
    const dora = p.hand.concat(p.melds.flatMap((m) => m.tiles)).filter((id) => doraTypes(H).has(typeOf(id))).length + p.hand.concat(p.melds.flatMap((m) => m.tiles)).filter((id) => id === 16 || id === 52 || id === 88).length;
    box.appendChild(el('div', 'fx-note', `Dora in your hand: <b>${dora}</b> (red fives count). Dora add han only once the hand has a yaku.`));
  }

  const doraTypes = (H) => new Set(H.doraInd.slice(0, H.doraShown).map((id) => doraOf(typeOf(id))));

  // Tile types that lower the shanten of a 13-tile hand.
  function accepts(c, melds, rem, s) {
    const out = [];
    for (let t = 0; t < 34; t++) {
      if (!rem[t] || c[t] >= 4) continue;
      c[t]++;
      if (shanten(c, melds) < s) out.push(t);
      c[t]--;
    }
    return out;
  }

  function discardOptions(p, rem, melds) {
    const c = counts(p.hand);
    const allowed = ui.turn ? ui.turn.opts.discards : p.hand;
    const out = [];
    const done = new Set();
    for (const id of allowed) {
      const t = typeOf(id);
      if (done.has(t)) continue;
      done.add(t);
      c[t]--;
      const s = shanten(c, melds);
      const acc = accepts(c, melds, rem, s);
      out.push({ id, t, s, acc, n: acc.reduce((a, u) => a + rem[u], 0) });
      c[t]++;
    }
    return out.sort((a, b) => a.s - b.s || b.n - a.n || a.t - b.t);
  }

  function accRow(acc, rem, big = false) {
    const row = el('div', 'tiles fx-acc' + (big ? ' big' : ''));
    for (const t of acc) {
      const it = el('span', 'fx-ac');
      it.appendChild(d.typeTile(t));
      it.appendChild(el('small', '', `×${rem[t]}`));
      row.appendChild(it);
    }
    return row;
  }

  // Rough distance (tiles to change) to the yaku a hand can plan on. null: out of reach.
  function yakuPaths(g, p, hand, s) {
    const c = counts(hand);
    const meldTypes = p.melds.flatMap((m) => m.tiles.map(typeOf));
    const all = counts(hand.concat(p.melds.flatMap((m) => m.tiles)));
    const closed = p.melds.every((m) => m.kind === 'ankan');
    const ready = (x) => Math.max(0, x);
    const out = [];
    out.push(closed
      ? { name: 'Riichi', han: '1 han', d: ready(s), why: s <= 0 ? 'Ready: declare riichi on your turn' : 'Any closed hand once it is ready' }
      : { name: 'Riichi', han: '1 han', d: null, why: 'Only with a closed hand' });
    // all simples
    const yao = hand.filter((id) => isYaochu(typeOf(id))).length;
    const meldYao = meldTypes.some(isYaochu);
    out.push({ name: 'All Simples', han: '1 han', d: meldYao ? null : yao, why: meldYao ? 'A call holds a terminal or honor' : yao ? `Swap out ${yao} terminal and honor tile${yao === 1 ? '' : 's'}` : 'No terminals or honors' });
    // value honors
    const seatW = 27 + g.seatWind(0), roundW = 27 + g.roundWind;
    const vals = [...new Set([31, 32, 33, seatW, roundW])];
    for (const t of vals) {
      const n = all[t];
      if (n < 2) continue;
      const nm = HONOR_NAMES[t - 27] + (t === seatW && t === roundW ? ' (seat and round)' : t === seatW ? ' (seat wind)' : t === roundW ? ' (round wind)' : '');
      out.push({ name: nm, han: t === seatW && t === roundW ? '2 han' : '1 han', d: n >= 3 ? 0 : 1, why: n >= 3 ? 'You have the triplet' : 'You have a pair: one more makes it' });
    }
    // flushes
    let bestSuit = 0, bestOff = 99, bestOffFull = 99;
    for (let su = 0; su < 3; su++) {
      let off = 0, offFull = 0;
      for (let t = 0; t < 34; t++) {
        if (!all[t]) continue;
        const ts = suitOf(t);
        if (ts !== su && ts !== 3) off += all[t];
        if (ts !== su) offFull += all[t];
      }
      if (off < bestOff || (off === bestOff && offFull < bestOffFull)) { bestOff = off; bestOffFull = offFull; bestSuit = su; }
    }
    const meldOff = meldTypes.some((t) => suitOf(t) !== bestSuit && suitOf(t) !== 3);
    const meldOffFull = meldTypes.some((t) => suitOf(t) !== bestSuit);
    out.push({ name: `Half Flush (${SUITS[bestSuit]})`, han: closed ? '3 han' : '2 han', d: meldOff ? null : bestOff, why: bestOff ? `${bestOff} tile${bestOff === 1 ? '' : 's'} outside ${SUITS[bestSuit]} and honors` : 'One suit plus honors' });
    if (bestOffFull <= 6) out.push({ name: `Full Flush (${SUITS[bestSuit]})`, han: closed ? '6 han' : '5 han', d: meldOffFull ? null : bestOffFull, why: bestOffFull ? `${bestOffFull} tile${bestOffFull === 1 ? '' : 's'} outside ${SUITS[bestSuit]}` : `All ${SUITS[bestSuit]}` });
    // seven pairs
    if (!p.melds.length) {
      const sc = shantenChiitoi(c);
      let pairs = 0;
      for (let t = 0; t < 34; t++) if (c[t] >= 2) pairs++;
      out.push({ name: 'Seven Pairs', han: '2 han', d: ready(sc), why: `${pairs} pair${pairs === 1 ? '' : 's'} so far` });
    }
    // all triplets
    let trips = p.melds.filter((m) => m.kind !== 'chi').length, prs = 0;
    const openRun = p.melds.some((m) => m.kind === 'chi');
    for (let t = 0; t < 34; t++) { if (c[t] >= 3) trips++; else if (c[t] === 2) prs++; }
    // shanten toward four triplets and a pair
    const tt = 8 - 2 * trips - Math.min(prs, 5 - trips);
    if (trips + prs >= 3) out.push({ name: 'All Triplets', han: '2 han', d: openRun ? null : ready(tt), why: openRun ? 'You called a run' : `${trips} triplet${trips === 1 ? '' : 's'}, ${prs} pair${prs === 1 ? '' : 's'}` });
    return out.sort((a, b) => (a.d === null) - (b.d === null) || a.d - b.d);
  }

  return { render, reset, note, amend };
}
