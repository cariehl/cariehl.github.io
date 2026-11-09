// Tiles. A tile is an id 0..135; its type is id >> 2 (0..33):
//   0-8 man 1-9, 9-17 pin 1-9, 18-26 sou 1-9, 27-30 winds E S W N, 31-33 dragons white green red.
// The first copy of each five (ids 16, 52, 88) is the red five.

export const WIND_NAMES = ['East', 'South', 'West', 'North'];
export const WIND_KANJI = ['東', '南', '西', '北'];
export const RED_IDS = [16, 52, 88];

export const typeOf = (id) => id >> 2;
export const isRed = (id) => id === 16 || id === 52 || id === 88;
export const suitOf = (t) => (t < 27 ? Math.floor(t / 9) : 3);
export const numOf = (t) => (t < 27 ? (t % 9) + 1 : 0);
export const isHonor = (t) => t >= 27;
export const isWind = (t) => t >= 27 && t <= 30;
export const isDragon = (t) => t >= 31;
export const isTerminal = (t) => t < 27 && (t % 9 === 0 || t % 9 === 8);
export const isYaochu = (t) => t >= 27 || t % 9 === 0 || t % 9 === 8;
export const isSimple = (t) => !isYaochu(t);
export const YAOCHU = [0, 8, 9, 17, 18, 26, 27, 28, 29, 30, 31, 32, 33];

export function doraOf(indicator) {
  if (indicator < 27) return Math.floor(indicator / 9) * 9 + ((indicator % 9) + 1) % 9;
  if (indicator <= 30) return 27 + ((indicator - 27 + 1) % 4);
  return 31 + ((indicator - 31 + 1) % 3);
}

export function counts(ids) {
  const c = new Array(34).fill(0);
  for (const id of ids) c[id >> 2]++;
  return c;
}

const SUIT_LETTER = ['m', 'p', 's'];
const HONOR_SHORT = ['E', 'S', 'W', 'N', 'Wh', 'G', 'R'];
export function tileName(t) {
  return t < 27 ? `${numOf(t)}${SUIT_LETTER[suitOf(t)]}` : HONOR_SHORT[t - 27];
}
const HONOR_LONG = ['East wind', 'South wind', 'West wind', 'North wind', 'White dragon', 'Green dragon', 'Red dragon'];
const SUIT_LONG = ['Characters', 'Circles', 'Bamboo'];
export function tileLongName(t) {
  return t < 27 ? `${numOf(t)} ${SUIT_LONG[suitOf(t)]}` : HONOR_LONG[t - 27];
}

export function sortIds(ids) {
  return ids.slice().sort((a, b) => a - b);
}

// Notation for tests: "123m406p77z" (0 = red five, z: 1-7 = E S W N Wh G R).
// Returns ids, taking unused copies so the same string can describe a whole hand.
export function parseTiles(str, used = new Set()) {
  const out = [];
  let digits = [];
  for (const ch of str.replace(/\s+/g, '')) {
    if (/[0-9]/.test(ch)) { digits.push(+ch); continue; }
    const base = { m: 0, p: 9, s: 18, z: 27 }[ch];
    if (base === undefined) throw new Error(`bad tile notation ${str}`);
    for (const d of digits) {
      const t = ch === 'z' ? base + d - 1 : base + (d === 0 ? 4 : d - 1);
      let id = -1;
      if (d === 0) id = t * 4;
      else for (let k = t * 4 + (ch !== 'z' && d === 5 ? 1 : 0); k < t * 4 + 4; k++) if (!used.has(k)) { id = k; break; }
      if (id < 0 || used.has(id)) throw new Error(`too many ${d}${ch} in ${str}`);
      used.add(id);
      out.push(id);
    }
    digits = [];
  }
  return out;
}
