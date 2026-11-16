// Your card over time: which hands on each card you have made, kept in localStorage apart
// from the game history (which may drop old hand details when storage fills). Keyed by card id,
// then by the hand's text, so editing a card's order or values keeps the record.

const KEY = 'lantern-riichi.amcard.v1';

export function loadRecord() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || 'null');
    return v && typeof v === 'object' ? v : {};
  } catch {
    return {};
  }
}

export function saveRecord(rec) {
  try { localStorage.setItem(KEY, JSON.stringify(rec)); } catch { /* storage unavailable */ }
}

const cardEntry = (rec, cardId) => (rec[cardId] ||= { hands: {}, played: 0, games: 0 });

// One finished hand. Counts it as played, and as a made hand if seat 0 won. `key` (game seed
// and hand number) stops a hand replayed after leaving the table from counting twice.
export function noteHand(rec, cardId, handRecord, date = new Date().toISOString(), key = null) {
  const c = cardEntry(rec, cardId);
  if (key) {
    c.seen ||= [];
    if (c.seen.includes(key)) return null;
    c.seen.push(key);
    if (c.seen.length > 40) c.seen.shift();
  }
  c.played++;
  const w = handRecord.wins && handRecord.wins.find((x) => x.seat === 0);
  if (!w) return null;
  const h = (c.hands[w.handText] ||= { wins: 0, selfPicks: 0, jokerless: 0, best: 0, first: date, last: date });
  const firstTime = h.wins === 0;
  h.wins++;
  if (w.from === null) h.selfPicks++;
  if (w.jokerless) h.jokerless++;
  h.best = Math.max(h.best, w.points);
  h.last = date;
  return { firstTime, entry: h };
}

export function noteGame(rec, cardId) {
  cardEntry(rec, cardId).games++;
}

// Fill the record from saved games the first time it is used (games played before it existed).
export function backfill(rec, history) {
  if (rec._backfilled) return false;
  for (const g of history.slice().reverse()) {
    if (g.mode !== 'american') continue;
    const cardId = g.cardId || 'lantern-2026';
    noteGame(rec, cardId);
    for (const h of g.hands || []) noteHand(rec, cardId, h, g.date);
  }
  rec._backfilled = true;
  return true;
}

// How far along a card you are: made hands out of all, overall and by section.
export function summary(rec, compiled) {
  const c = rec[compiled.card.id] || { hands: {}, played: 0, games: 0 };
  const sections = [];
  let made = 0, wins = 0;
  for (const hand of compiled.hands) {
    let s = sections.find((x) => x.name === hand.section);
    if (!s) sections.push((s = { name: hand.section, made: 0, total: 0 }));
    s.total++;
    const h = c.hands[hand.text];
    if (h && h.wins) { s.made++; made++; wins += h.wins; }
  }
  return { made, total: compiled.hands.length, wins, played: c.played, games: c.games, sections, hands: c.hands };
}
