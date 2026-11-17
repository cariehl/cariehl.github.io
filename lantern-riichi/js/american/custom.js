// Your own cards. The game ships an original card (card.js); players who own a real yearly
// card can type its hands in here, one per line, and the game keeps them in this browser only.
// No DOM, so the parser runs under Node too.
//
// A card as text:
//
//   # My 2026 card                       <- the card's name (first line starting with #)
//   [2026]                               <- a section
//   FFFF 2026a 222b 222c | 25 | Any 3 suits
//   FF 2026a 2222b 6666c | 30 | C        <- C: concealed
//   11111a 2222b 33333c | 40 | shift 1 | Any 3 consecutive numbers
//   FFFF 2026a 222b 222c or FFFF 2026a 555b 555c | 25 | Kongs 2s or 5s
//   // a comment
//
// The hand itself uses the card notation documented in card.js (suit letters a b c, 0 Soap,
// D the dragon of the group's suit). After it, separated by |, in any order: the value (a
// number), C (concealed) or X (exposures allowed, the default), "shift N" (the numbers may all
// move up by steps of N; "any" is shift 1, "even" or "odd" shift 2), and anything else is the
// note shown under the hand. Without any |, a value and C or X may simply end the line:
//   FFFF 2026a 222b 222c 25 X

import { parseGroups, expandHand } from './hands.js';

const STORE = 'lantern-riichi.cards.v1';

// Is this token a group of the hand notation (as opposed to a value or a flag)?
const isGroup = (tok) => /^[0-9FESWNRGD]+[abc]?$/.test(tok) && !/^[1-9][0-9]*$/.test(tok);

function parseHandLine(line) {
  let parts = line.split('|').map((s) => s.trim());
  let text = parts.shift();
  const hand = { value: 25 };
  if (parts.length === 0) {
    // trailing value / C / X tokens without separators
    const toks = text.split(/\s+/);
    while (toks.length > 1 && !isGroup(toks[toks.length - 1]) && !/^or$/i.test(toks[toks.length - 1])) parts.unshift(toks.pop());
    text = toks.join(' ');
  }
  const notes = [];
  for (const p of parts) {
    if (!p) continue;
    let m;
    if (/^\d+$/.test(p)) hand.value = +p;
    else if (/^(c|concealed)$/i.test(p)) hand.concealed = true;
    else if (/^(x|exposed)$/i.test(p)) hand.concealed = false;
    else if ((m = /^shift\s*(\d)$/i.exec(p))) hand.shift = +m[1];
    else if (/^any$/i.test(p)) hand.shift = 1;
    else if (/^(even|odd)$/i.test(p)) hand.shift = 2;
    else notes.push(p);
  }
  if (!hand.concealed) delete hand.concealed;
  if (notes.length) hand.note = notes.join(' · ');
  hand.text = text.split(/\s+or\s+/i).map((alt) => alt.trim().split(/\s+/).join(' ')).join(' or ');
  if (hand.value < 1 || hand.value > 500) throw new Error(`value ${hand.value} is out of range`);
  // check every alternative reads and has 14 tiles
  for (const alt of hand.text.split(' or ')) {
    let groups;
    try { groups = parseGroups(alt); } catch {
      const bad = alt.split(' ').find((g) => !/^([0-9FESWNRGD]+)([abc]?)$/.test(g));
      throw new Error(`can't read "${bad}": use 1-9, 0, F, E S W N, R G D, then a suit letter a, b or c`);
    }
    for (const g of groups) {
      if (!g.suit && g.symbols.some((s) => /[1-9D]/.test(s))) throw new Error(`"${g.symbols.join('')}" needs a suit letter (a, b or c)`);
    }
    const n = groups.reduce((s, g) => s + g.symbols.length, 0);
    if (n !== 14) throw new Error(`"${alt}" has ${n} tiles; a hand needs 14`);
  }
  if (!expandHand(hand).length) throw new Error('no way to make this hand (do the numbers go past 9?)');
  return hand;
}

// Text -> { card, errors }. card is null when nothing usable was found.
export function parseCardText(src, id = 'custom') {
  const errors = [];
  let name = '';
  const sections = [];
  let sec = null;
  src.split(/\r?\n/).forEach((raw, i) => {
    const line = raw.trim();
    if (!line || line.startsWith('//')) return;
    if (line.startsWith('#')) { if (!name) name = line.replace(/^#+\s*/, '').trim(); return; }
    const sm = /^\[(.+)\]$/.exec(line);
    if (sm) { sec = { name: sm[1].trim(), hands: [] }; sections.push(sec); return; }
    try {
      const hand = parseHandLine(line);
      if (!sec) { sec = { name: 'Hands', hands: [] }; sections.push(sec); }
      sec.hands.push(hand);
    } catch (e) {
      errors.push({ line: i + 1, text: line, msg: e.message });
    }
  });
  const kept = sections.filter((s) => s.hands.length);
  if (!kept.length) return { card: null, errors };
  const year = +((/\b(19|20)\d\d\b/.exec(name) || [])[0] || new Date().getFullYear());
  return { card: { id, name: name || 'My card', year, sections: kept, custom: true, source: src }, errors };
}

// A card back to text (for "start from this card" and for checking the format round-trips).
export function cardToText(card) {
  const lines = [`# ${card.name}`];
  for (const s of card.sections) {
    lines.push('', `[${s.name}]`);
    for (const h of s.hands) {
      const f = [h.text, String(h.value)];
      if (h.concealed) f.push('C');
      if (h.shift) f.push(`shift ${h.shift}`);
      if (h.note) f.push(h.note);
      lines.push(f.join(' | '));
    }
  }
  return lines.join('\n') + '\n';
}

// ------------------------------------------------------------ storage (browser only)

export function loadCustomCards() {
  let list = [];
  try { list = JSON.parse(localStorage.getItem(STORE) || '[]'); } catch { list = []; }
  if (!Array.isArray(list)) return [];
  const out = [];
  for (const it of list) {
    if (!it || typeof it.source !== 'string' || typeof it.id !== 'string') continue;
    const { card } = parseCardText(it.source, it.id);
    if (card) out.push(card);
  }
  return out;
}

export function saveCustomCards(cards) {
  try { localStorage.setItem(STORE, JSON.stringify(cards.map((c) => ({ id: c.id, source: c.source })))); } catch { /* storage unavailable */ }
}

export const TEMPLATE = `# My card
// One hand per line: the hand | its value | C if concealed | a note.
// Suit letters a, b, c: same letter = same suit, different letters = different suits.
// 0 is Soap (White dragon), D is the dragon of that group's suit, F a flower.
// Write "or" between versions of a hand, "shift 1" for any consecutive numbers.

[2026]
FFFF 2026a 222b 222c | 25 | Any 3 suits
`;
