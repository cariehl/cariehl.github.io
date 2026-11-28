// American mahjong tiles: 152 of them. Ids 0..135 are the usual suited tiles,
// winds and dragons (type = id >> 2, as in ../tiles.js); 136..143 are the eight
// flowers and 144..151 the eight jokers.
//
// Types 0..33 follow ../tiles.js: 0-8 Craks 1-9, 9-17 Dots 1-9, 18-26 Bams 1-9,
// 27-30 winds E S W N, 31 White dragon (Soap, also the zero in year hands),
// 32 Green dragon, 33 Red dragon. Type 34 is a flower, 35 a joker.
//
// Each suit has its own dragon: Craks go with Red, Bams with Green, Dots with Soap.

export const FLOWER = 34;
export const JOKER = 35;
export const NTYPES = 36;
export const TILE_COUNT = 152;

export const SUIT_NAMES = ['Craks', 'Dots', 'Bams'];
export const SUIT_DRAGON = [33, 31, 32]; // Craks: Red, Dots: Soap, Bams: Green
export const WIND_LETTERS = 'ESWN';

export const amType = (id) => (id < 136 ? id >> 2 : id < 144 ? FLOWER : JOKER);
export const isJoker = (id) => id >= 144;

export function amCounts(ids) {
  const c = new Array(NTYPES).fill(0);
  for (const id of ids) c[amType(id)]++;
  return c;
}

const SUIT_SHORT = ['C', 'D', 'B'];
export function amTileName(t) {
  if (t < 27) return `${(t % 9) + 1}${SUIT_SHORT[Math.floor(t / 9)]}`;
  if (t < 31) return 'ESWN'[t - 27];
  return ['0', 'G', 'R', 'F', 'J'][t - 31];
}

const LONG = ['East', 'South', 'West', 'North', 'Soap (White dragon)', 'Green dragon', 'Red dragon', 'Flower', 'Joker'];
export function amTileLongName(t) {
  if (t < 27) return `${(t % 9) + 1} ${SUIT_NAMES[Math.floor(t / 9)].replace(/s$/, '')}`;
  return LONG[t - 27];
}

// Sort order in a hand: flowers, then suits, winds, dragons, and jokers last.
const sortKey = (id) => (amType(id) === FLOWER ? -1 : amType(id));
export function amSort(ids) {
  return ids.slice().sort((a, b) => sortKey(a) - sortKey(b) || a - b);
}

// Test notation: like ../tiles.js ("123m 5p 77z") plus f (flowers) and j (jokers): "2f3j".
// Takes unused copies so one string can describe a whole hand.
export function amParse(str, used = new Set()) {
  const out = [];
  let digits = [];
  const take = (lo, hi) => {
    for (let k = lo; k < hi; k++) if (!used.has(k)) { used.add(k); out.push(k); return; }
    throw new Error(`too many tiles in ${str}`);
  };
  for (const ch of str.replace(/\s+/g, '')) {
    if (/[0-9]/.test(ch)) { digits.push(+ch); continue; }
    if (ch === 'f' || ch === 'j') {
      const n = digits.length ? digits.reduce((a, d) => a * 10 + d, 0) : 1;
      for (let i = 0; i < n; i++) ch === 'f' ? take(136, 144) : take(144, 152);
      digits = [];
      continue;
    }
    const base = { m: 0, p: 9, s: 18, z: 27 }[ch];
    if (base === undefined) throw new Error(`bad tile notation ${str}`);
    for (const d of digits) {
      const t = base + d - 1;
      take(t * 4, t * 4 + 4);
    }
    digits = [];
  }
  return out;
}
