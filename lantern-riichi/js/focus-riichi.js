// Riichi focus mode: the numbers behind your hand (shanten, tiles that help, danger, yaku in
// reach) and three ways to lay them out on one screen, picked in Settings (Riichi focus layout)
// alongside focus.js's original list:
//   table   one discard table under a strip of stats (keeps the Tiles and Table tabs)
//   dash    a three-column dashboard: stats and scores | discards | yaku and threats
//   matrix  every tile type in a 4×9 grid, coloured by what it does for you, with stats beside
// ui.js passes `d` (the same helpers focus.js gets).

import { typeOf, counts, isYaochu, suitOf, doraOf, isRed } from './tiles.js';
import { shanten, shantenRegular, shantenChiitoi, shantenKokushi } from './shanten.js';
import { dangerReport } from './bots.js';

const SUITS = ['Man', 'Pin', 'Sou'];
const HONOR_NAMES = ['East', 'South', 'West', 'North', 'White', 'Green', 'Red'];
const WIND = ['E', 'S', 'W', 'N'];

// ------------------------------------------------------------ the numbers

export function analyze(g, d, ui) {
  const H = g.h, p = H.players[0];
  const melds = p.melds.length;
  const full = p.hand.length % 3 === 2;
  const rem = d.visibleRemaining(0, p.hand);
  const c = counts(p.hand);
  const { danger, threats } = dangerReport(g, 0);
  const anyThreat = threats.some((x) => x > 0);
  const accepts = (cc, s) => {
    const out = [];
    for (let t = 0; t < 34; t++) {
      if (!rem[t] || cc[t] >= 4) continue;
      cc[t]++;
      if (shanten(cc, melds) < s) out.push(t);
      cc[t]--;
    }
    return out;
  };
  const sum = (acc) => acc.reduce((a, t) => a + rem[t], 0);
  let discards = [], s, acc;
  if (full) {
    const allowed = ui.turn ? ui.turn.opts.discards : p.hand;
    const done = new Set();
    for (const id of allowed) {
      const t = typeOf(id);
      if (done.has(t)) continue;
      done.add(t);
      c[t]--;
      const sh = shanten(c, melds);
      const a = sh >= 0 ? accepts(c, sh) : [];
      discards.push({ id, t, s: sh, acc: a, n: sum(a), danger: danger[t] });
      c[t]++;
    }
    discards.sort((a, b) => a.s - b.s || b.n - a.n || a.danger - b.danger || a.t - b.t);
    s = discards.length ? discards[0].s : shanten(c, melds);
    acc = discards.length ? discards[0].acc : [];
  } else {
    s = shanten(c, melds);
    acc = s >= 0 ? accepts(c, s) : [];
  }
  const doraT = new Set(H.doraInd.slice(0, H.doraShown).map((id) => doraOf(typeOf(id))));
  const mine = p.hand.concat(p.melds.flatMap((m) => m.tiles));
  const dora = mine.filter((id) => doraT.has(typeOf(id))).length + mine.filter(isRed).length;
  return {
    g, p, full, rem, c, s, acc, accN: sum(acc), discards, danger, threats, anyThreat, dora, doraT,
    std: shantenRegular(c, melds),
    pairs: melds ? null : shantenChiitoi(c),
    orphans: melds ? null : shantenKokushi(c),
    yaku: yakuPaths(g, p, p.hand, s),
    wall: H.wall.length,
  };
}

// Rough distance (tiles to change) to the yaku a hand can plan on. d null: out of reach.
export function yakuPaths(g, p, hand, s) {
  const c = counts(hand);
  const meldTypes = p.melds.flatMap((m) => m.tiles.map(typeOf));
  const all = counts(hand.concat(p.melds.flatMap((m) => m.tiles)));
  const closed = p.melds.every((m) => m.kind === 'ankan');
  const ready = (x) => Math.max(0, x);
  const out = [];
  out.push(closed
    ? { name: 'Riichi', short: 'Riichi', han: 1, d: ready(s), why: s <= 0 ? 'Ready: declare riichi on your turn' : 'Any closed hand once it is ready' }
    : { name: 'Riichi', short: 'Riichi', han: 1, d: null, why: 'Only with a closed hand' });
  const yao = hand.filter((id) => isYaochu(typeOf(id))).length;
  const meldYao = meldTypes.some(isYaochu);
  out.push({ name: 'All Simples', short: 'Tanyao', han: 1, d: meldYao ? null : yao, why: meldYao ? 'A call holds a terminal or honor' : yao ? `Swap out ${yao} terminal and honor tile${yao === 1 ? '' : 's'}` : 'No terminals or honors', count: `${yao} 1/9/honor` });
  const seatW = 27 + g.seatWind(0), roundW = 27 + g.roundWind;
  for (const t of [...new Set([31, 32, 33, seatW, roundW])]) {
    const n = all[t];
    if (n < 2) continue;
    const both = t === seatW && t === roundW;
    const nm = HONOR_NAMES[t - 27] + (t >= 31 ? ' dragon' : '') + (both ? ' (seat+round)' : t === seatW ? ' (seat)' : t === roundW ? ' (round)' : '');
    out.push({ name: nm, short: HONOR_NAMES[t - 27], han: both ? 2 : 1, d: n >= 3 ? 0 : 1, why: n >= 3 ? 'You have the triplet' : 'You have a pair: one more makes it', count: `${n} held` });
  }
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
  out.push({ name: `Half Flush (${SUITS[bestSuit]})`, short: `Honitsu ${SUITS[bestSuit][0].toLowerCase()}`, han: closed ? 3 : 2, d: meldOff ? null : bestOff, why: bestOff ? `${bestOff} tile${bestOff === 1 ? '' : 's'} outside ${SUITS[bestSuit]} and honors` : 'One suit plus honors', count: `${bestOff} off-suit` });
  if (bestOffFull <= 6) out.push({ name: `Full Flush (${SUITS[bestSuit]})`, short: `Chinitsu ${SUITS[bestSuit][0].toLowerCase()}`, han: closed ? 6 : 5, d: meldOffFull ? null : bestOffFull, why: bestOffFull ? `${bestOffFull} tile${bestOffFull === 1 ? '' : 's'} outside ${SUITS[bestSuit]}` : `All ${SUITS[bestSuit]}`, count: `${bestOffFull} off-suit` });
  if (!p.melds.length) {
    const sc = shantenChiitoi(c);
    let pairs = 0;
    for (let t = 0; t < 34; t++) if (c[t] >= 2) pairs++;
    out.push({ name: 'Seven Pairs', short: 'Chiitoi', han: 2, d: ready(sc), why: `${pairs} pair${pairs === 1 ? '' : 's'} so far`, count: `${pairs} pairs` });
  }
  let trips = p.melds.filter((m) => m.kind !== 'chi').length, prs = 0;
  const openRun = p.melds.some((m) => m.kind === 'chi');
  for (let t = 0; t < 34; t++) { if (c[t] >= 3) trips++; else if (c[t] === 2) prs++; }
  const tt = 8 - 2 * trips - Math.min(prs, 5 - trips);
  if (trips + prs >= 3) out.push({ name: 'All Triplets', short: 'Toitoi', han: 2, d: openRun ? null : ready(tt), why: openRun ? 'You called a run' : `${trips} triplet${trips === 1 ? '' : 's'}, ${prs} pair${prs === 1 ? '' : 's'}`, count: `${trips}T ${prs}P` });
  return out.sort((a, b) => (a.d === null) - (b.d === null) || a.d - b.d);
}

// ------------------------------------------------------------ shared pieces

export function createRiichiLayouts(d) {
  const { el, ui } = d;
  const shWord = (s) => (s === -1 ? 'Win' : s === 0 ? 'Ready' : String(s));
  const pct = (x) => Math.min(99, Math.round(x * 100));
  const awayCell = (v) => `<td class="lx-away ${v === null ? 'no' : v === 0 ? 'win' : v <= 2 ? 'near' : v <= 4 ? 'mid' : ''}">${v === null ? '–' : v === 0 ? '✓' : v}</td>`;

  function dangerCell(a, x) {
    const td = el('td', 'lx-dg');
    if (!a.anyThreat) { td.textContent = '–'; td.classList.add('muted'); return td; }
    const v = pct(x);
    td.innerHTML = v === 0 ? '<span class="safe">safe</span>' : `<span class="bar"><i style="width:${v}%;background:${v >= 60 ? 'var(--bad)' : v >= 30 ? 'var(--accent)' : 'var(--good)'}"></i></span><span class="n">${v}</span>`;
    return td;
  }

  function tileCell(t, cls = '') {
    const td = el('td', 'lx-tile ' + cls);
    td.appendChild(d.typeTile(t));
    return td;
  }

  function accTiles(a, list, max = 12) {
    const box = el('span', 'lx-acc');
    for (const t of list.slice(0, max)) {
      const it = el('span', 'lx-ac');
      it.appendChild(d.typeTile(t));
      it.appendChild(el('small', '', String(a.rem[t])));
      box.appendChild(it);
    }
    if (list.length > max) box.appendChild(el('small', 'muted', `+${list.length - max}`));
    return box;
  }

  const lift = (o) => () => { if (ui.turn && ui.turn.opts.discards.includes(o.id)) { ui.selected = o.id; d.render(); } };

  function discardTable(a, { cols = ['after', 'tiles', 'kinds', 'danger', 'acc'], max = 99 } = {}) {
    const t = el('table', 'lx-tbl lx-disc');
    const names = { after: 'After', tiles: 'Tiles', kinds: 'Kinds', danger: 'Danger', acc: 'Takes' };
    t.appendChild(el('thead', '', `<tr><th>Cut</th>${cols.map((c) => `<th class="c-${c}">${names[c]}</th>`).join('')}</tr>`));
    const tb = el('tbody');
    const top = a.discards[0];
    for (const o of a.discards.slice(0, max)) {
      const tr = el('tr', (o.s === top.s && o.n === top.n ? 'best' : '') + (ui.selected === o.id ? ' on' : ''));
      tr.appendChild(tileCell(o.t));
      for (const c of cols) {
        if (c === 'after') tr.appendChild(el('td', `num sh${o.s <= 0 ? ' win' : ''}`, shWord(o.s)));
        if (c === 'tiles') tr.appendChild(el('td', 'num strong', String(o.n)));
        if (c === 'kinds') tr.appendChild(el('td', 'num', String(o.acc.length)));
        if (c === 'danger') tr.appendChild(dangerCell(a, o.danger));
        if (c === 'acc') { const td = el('td', 'lx-acc-td'); td.appendChild(accTiles(a, o.acc)); tr.appendChild(td); }
      }
      tr.onclick = lift(o);
      tb.appendChild(tr);
    }
    t.appendChild(tb);
    return t;
  }

  function yakuTable(a, { why = true } = {}) {
    const t = el('table', 'lx-tbl lx-yaku');
    t.appendChild(el('thead', '', `<tr><th>Yaku</th><th class="num">Han</th><th class="num">Away</th>${why ? '<th>Now</th>' : ''}</tr>`));
    const tb = el('tbody');
    for (const y of a.yaku) {
      const tr = el('tr', y.d === null ? 'blocked' : '');
      tr.innerHTML = `<td>${why ? y.name : y.short}</td><td class="num">${y.han}</td>${awayCell(y.d)}${why ? `<td class="muted">${y.count || (y.d === null ? y.why : '')}</td>` : ''}`;
      tb.appendChild(tr);
    }
    t.appendChild(tb);
    return t;
  }

  function stat(label, value, sub = '', cls = '') {
    return el('div', 'lx-stat ' + cls, `<small>${label}</small><b>${value}</b>${sub ? `<span>${sub}</span>` : ''}`);
  }

  const shSub = (a) => `std ${shWord(a.std)}${a.pairs !== null ? ` · 7p ${shWord(a.pairs)} · 13o ${shWord(a.orphans)}` : ''}`;
  const threatNames = (a) => a.threats.map((x, s) => ({ x, s })).filter((o) => o.x > 0).map((o) => {
    const q = a.g.h.players[o.s];
    return `${d.seats()[o.s].name}${q.riichi ? ' (R)' : ` (${q.melds.filter((m) => m.kind !== 'ankan').length} calls)`}`;
  });

  function doraStat(a) {
    const box = stat('Dora', String(a.dora), '', 'lx-dora');
    const row = el('span', 'tiles');
    for (const t of a.doraT) row.appendChild(d.typeTile(t));
    box.appendChild(row);
    return box;
  }

  // ------------------------------------------------------------ A: table

  function table(box) {
    const a = analyze(d.game(), d, ui);
    const g = a.g;
    const strip = el('div', 'lx-strip');
    strip.appendChild(stat(a.full ? 'Shanten after best cut' : 'Shanten', shWord(a.s), shSub(a), a.s <= 0 ? 'win' : a.s === 1 ? 'near' : ''));
    strip.appendChild(stat(a.s === 0 && !a.full ? 'Waits' : 'Tiles that help', String(a.accN), `${a.acc.length} kinds`));
    strip.appendChild(stat('Wall', String(a.wall), `${Math.ceil(a.wall / 4)} draws each`));
    strip.appendChild(doraStat(a));
    strip.appendChild(stat('Wind', `${WIND[g.seatWind(0)]}/${WIND[g.roundWind]}`, 'seat/round'));
    const th = threatNames(a);
    strip.appendChild(stat('Threats', th.length ? String(th.length) : '0', th.join(', ') || 'nobody yet', th.length ? 'bad' : ''));
    box.appendChild(strip);
    if (a.full && a.discards.length) box.appendChild(discardTable(a));
    else if (a.s >= 0) {
      const t = el('table', 'lx-tbl');
      t.appendChild(el('thead', '', `<tr><th>${a.s === 0 ? 'Waits' : 'Tiles that help'}</th><th class="num">Left</th></tr>`));
      const tb = el('tbody');
      const tr = el('tr');
      const td = el('td', 'lx-acc-td');
      td.appendChild(accTiles(a, a.acc, 34));
      tr.appendChild(td);
      tr.appendChild(el('td', 'num strong', String(a.accN)));
      tb.appendChild(tr);
      t.appendChild(tb);
      box.appendChild(t);
    }
    box.appendChild(yakuTable(a));
  }

  // ------------------------------------------------------------ B: dashboard

  function dash(box) {
    const a = analyze(d.game(), d, ui);
    const g = a.g, H = g.h, seats = d.seats();
    const grid = el('div', 'lx-dash');

    const c1 = el('section', 'lx-col');
    c1.appendChild(el('h4', '', 'Hand'));
    const kv = el('table', 'lx-tbl lx-kv');
    const rows = [
      ['Shanten', `<b class="${a.s <= 0 ? 'pos' : ''}">${shWord(a.s)}</b>`],
      ['Std / 7p / 13o', `${shWord(a.std)} / ${a.pairs ?? '–'} / ${a.orphans ?? '–'}`],
      [a.s === 0 && !a.full ? 'Waits' : 'Tiles that help', `<b>${a.accN}</b> <span class="muted">(${a.acc.length} kinds)</span>`],
      ['Dora held', `<b>${a.dora}</b>`],
      ['Wall', `${a.wall} <span class="muted">(${Math.ceil(a.wall / 4)} draws)</span>`],
      ['Seat / round', `${WIND[g.seatWind(0)]} / ${WIND[g.roundWind]}`],
    ];
    kv.innerHTML = `<tbody>${rows.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('')}</tbody>`;
    c1.appendChild(kv);
    c1.appendChild(el('h4', '', 'Scores'));
    const sc = el('table', 'lx-tbl lx-scores');
    const order = [0, 1, 2, 3].sort((x, y) => g.scores[y] - g.scores[x]);
    sc.innerHTML = `<tbody>${order.map((s, i) => `<tr class="${s === 0 ? 'me' : ''}"><td>${i + 1}</td><td>${seats[s].emoji} ${seats[s].name}${H.players[s].riichi ? ' <span class="riichi-tag">R</span>' : ''}</td><td class="num">${g.scores[s].toLocaleString('en-US')}</td><td class="num muted">${s === 0 ? '' : (g.scores[s] - g.scores[0] > 0 ? '+' : '') + (g.scores[s] - g.scores[0]).toLocaleString('en-US')}</td></tr>`).join('')}</tbody>`;
    c1.appendChild(sc);
    grid.appendChild(c1);

    const c2 = el('section', 'lx-col');
    if (a.full && a.discards.length) {
      c2.appendChild(el('h4', '', 'Discards'));
      c2.appendChild(discardTable(a, { cols: ['after', 'tiles', 'kinds', 'danger'], max: 9 }));
    } else {
      c2.appendChild(el('h4', '', a.s === 0 ? 'Waits' : 'Tiles that help'));
      const t = el('table', 'lx-tbl');
      t.appendChild(el('thead', '', '<tr><th>Tile</th><th class="num">Left</th><th class="c-danger">Danger</th></tr>'));
      const tb = el('tbody');
      for (const x of a.acc) {
        const tr = el('tr');
        tr.appendChild(tileCell(x));
        tr.appendChild(el('td', 'num strong', String(a.rem[x])));
        tr.appendChild(dangerCell(a, a.danger[x]));
        tb.appendChild(tr);
      }
      t.appendChild(tb);
      c2.appendChild(t);
    }
    grid.appendChild(c2);

    const c3 = el('section', 'lx-col');
    c3.appendChild(el('h4', '', 'Yaku'));
    c3.appendChild(yakuTable(a, { why: false }));
    c3.appendChild(el('h4', '', 'Opponents'));
    const op = el('table', 'lx-tbl lx-opp');
    op.appendChild(el('thead', '', '<tr><th>Who</th><th class="num">Calls</th><th class="num">Disc.</th><th class="num">Threat</th></tr>'));
    const ob = el('tbody');
    for (const s of [1, 2, 3]) {
      const q = H.players[s];
      const tr = el('tr', a.threats[s] >= 1 ? 'hot' : '');
      tr.innerHTML = `<td>${seats[s].emoji} ${seats[s].name}${q.riichi ? ' <span class="riichi-tag">R</span>' : ''}</td><td class="num">${q.melds.filter((m) => m.kind !== 'ankan').length}</td><td class="num">${q.discards.length}</td><td class="num ${a.threats[s] >= 0.7 ? 'neg' : a.threats[s] > 0 ? 'warn' : 'muted'}">${a.threats[s] ? pct(a.threats[s]) : '–'}</td>`;
      ob.appendChild(tr);
    }
    op.appendChild(ob);
    c3.appendChild(op);
    grid.appendChild(c3);
    box.appendChild(grid);
  }

  // ------------------------------------------------------------ C: matrix

  function matrix(box) {
    const a = analyze(d.game(), d, ui);
    const wrap = el('div', 'lx-matrix');
    const disc = new Map(a.discards.map((o, i) => [o.t, { ...o, rank: i }]));
    const top = a.discards[0];
    const accSet = new Set(a.acc);
    const grid = el('div', 'lx-mgrid');
    const rows = [['m', 0, 9], ['p', 9, 9], ['s', 18, 9], ['z', 27, 7]];
    for (const [nm, start, n] of rows) {
      const row = el('div', 'lx-mrow');
      row.appendChild(el('span', 'lx-mname', { m: 'Man', p: 'Pin', s: 'Sou', z: 'Hon' }[nm]));
      for (let t = start; t < start + n; t++) {
        const held = a.c[t];
        const o = disc.get(t);
        const isBest = o && top && o.s === top.s && o.n === top.n;
        const cell = el('button', 'lx-mc' + (held ? ' held' : '') + (accSet.has(t) ? ' helps' : '') + (isBest ? ' best' : '') + (a.rem[t] === 0 ? ' gone' : ''));
        if (a.anyThreat && a.danger[t] > 0) cell.style.setProperty('--dg', Math.min(1, a.danger[t]).toFixed(2));
        else if (a.anyThreat) cell.classList.add('safe');
        cell.appendChild(d.typeTile(t));
        const nums = el('span', 'lx-nums');
        nums.appendChild(el('span', 'lx-held', held ? `×${held}` : ''));
        nums.appendChild(el('span', 'lx-cut', o ? (o.s > (top ? top.s : 0) ? '↑' : String(o.n)) : ''));
        nums.appendChild(el('span', 'lx-left', String(a.rem[t])));
        cell.appendChild(nums);
        if (o) cell.onclick = lift(o);
        row.appendChild(cell);
      }
      grid.appendChild(row);
    }
    wrap.appendChild(grid);
    const side = el('div', 'lx-mside');
    const st = el('div', 'lx-strip small');
    st.appendChild(stat('Shanten', shWord(a.s), shSub(a), a.s <= 0 ? 'win' : a.s === 1 ? 'near' : ''));
    st.appendChild(stat(a.s === 0 && !a.full ? 'Waits' : 'Help', String(a.accN), `${a.acc.length} kinds`));
    st.appendChild(doraStat(a));
    st.appendChild(stat('Wall', String(a.wall)));
    side.appendChild(st);
    side.appendChild(yakuTable(a, { why: false }));
    wrap.appendChild(side);
    box.appendChild(wrap);
    box.appendChild(el('div', 'lx-legend', '<span><i class="k held"></i>in hand ×n</span><span><i class="k helps"></i>would help</span><span><i class="k best"></i>best cut</span><span>Right of each tile: <b class="hd">×n</b> held · <b>12</b> tiles that help if you cut it (↑ goes backwards) · <b class="lft">3</b> unseen</span>' + (a.anyThreat ? '<span><i class="k dg"></i>dangerous</span>' : '')));
  }

  return { table, dash, matrix };
}
