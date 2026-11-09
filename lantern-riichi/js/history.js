// Game history, kept in this browser's localStorage.

const KEY = 'lantern-riichi.history.v1';
const MAX = 200;

export function loadHistory() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

function saveHistory(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
  } catch {
    // full: drop hand details from the oldest games and try again
    const slim = list.slice(0, MAX).map((g, i) => (i > 20 ? { ...g, hands: [] } : g));
    try { localStorage.setItem(KEY, JSON.stringify(slim)); } catch { /* give up */ }
  }
}

export function addGame(record) {
  const list = loadHistory();
  list.unshift(record);
  saveHistory(list);
}

export function deleteGame(id) {
  saveHistory(loadHistory().filter((g) => g.id !== id));
}

export function clearHistory() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}

// Build the stored record from a finished game. seats[0] is the human.
export function makeRecord(game, seats) {
  const r = game.result;
  return {
    id: `${Date.now().toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`,
    date: new Date().toISOString(),
    length: game.length,
    seats,
    firstDealer: r.firstDealer,
    final: r.final,
    hands: r.log,
  };
}

export function stats(list) {
  const s = { games: list.length, coins: 0, place: [0, 0, 0, 0], points: 0, hands: 0, wins: 0, dealIns: 0, riichi: 0, open: 0, winPoints: 0, best: null, vs: {} };
  for (const g of list) {
    const me = g.final.find((f) => f.seat === 0);
    if (!me) continue;
    s.place[me.place - 1]++;
    s.points += me.points;
    if (g.money) s.coins += g.money.profit;
    for (const h of g.hands || []) {
      s.hands++;
      if (h.riichi && h.riichi.includes(0)) s.riichi++;
      if (h.open && h.open.includes(0)) s.open++;
      for (const w of h.wins || []) {
        if (w.seat === 0) {
          s.wins++;
          s.winPoints += w.points;
          if (!s.best || w.han > s.best.han || (w.yakuman && !s.best.yakuman)) s.best = { ...w, date: g.date };
        }
        if (w.from === 0) s.dealIns++;
      }
    }
    for (const f of g.final) {
      if (f.seat === 0) continue;
      const seat = g.seats[f.seat];
      if (!seat || !seat.persona) continue;
      const v = (s.vs[seat.persona] ||= { games: 0, theirPlace: 0, beat: 0 });
      v.games++;
      v.theirPlace += f.place;
      if (me.place < f.place) v.beat++;
    }
  }
  return s;
}
