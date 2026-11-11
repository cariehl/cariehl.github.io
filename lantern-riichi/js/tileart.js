// Tile faces drawn as SVG (60 x 80 face), cached as data URLs.

const INK = '#1d2433', RED = '#c0392b', GREEN = '#1f7a4d', BLUE = '#1f4e8c';
const FONT = `'Hiragino Mincho ProN','Yu Mincho','Noto Serif CJK JP','Noto Serif JP','Songti SC','SimSun','WenQuanYi Zen Hei',serif`;
const NUMS = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];

function circle(x, y, r, color) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>` +
    `<circle cx="${x}" cy="${y}" r="${r * 0.68}" fill="#fbf7ee"/>` +
    `<circle cx="${x}" cy="${y}" r="${r * 0.5}" fill="none" stroke="${color}" stroke-width="${r * 0.12}" stroke-dasharray="${r * 0.25} ${r * 0.18}"/>` +
    `<circle cx="${x}" cy="${y}" r="${r * 0.22}" fill="${color}"/>`;
}

const PIN = {
  1: [[30, 40, 21, RED]],
  2: [[30, 21, 12, GREEN], [30, 59, 12, BLUE]],
  3: [[15, 16, 10, BLUE], [30, 40, 10, RED], [45, 64, 10, GREEN]],
  4: [[17, 22, 11, BLUE], [43, 22, 11, GREEN], [17, 58, 11, GREEN], [43, 58, 11, BLUE]],
  5: [[16, 18, 10, BLUE], [44, 18, 10, GREEN], [30, 40, 10, RED], [16, 62, 10, GREEN], [44, 62, 10, BLUE]],
  6: [[18, 15, 9, GREEN], [42, 15, 9, GREEN], [18, 43, 9, RED], [42, 43, 9, RED], [18, 66, 9, RED], [42, 66, 9, RED]],
  7: [[13, 12, 7.5, GREEN], [30, 20, 7.5, GREEN], [47, 28, 7.5, GREEN], [18, 48, 8, RED], [42, 48, 8, RED], [18, 67, 8, RED], [42, 67, 8, RED]],
  8: [[18, 11, 7.6, BLUE], [42, 11, 7.6, BLUE], [18, 30.5, 7.6, BLUE], [42, 30.5, 7.6, BLUE], [18, 50, 7.6, BLUE], [42, 50, 7.6, BLUE], [18, 69.5, 7.6, BLUE], [42, 69.5, 7.6, BLUE]],
  9: [[13, 15, 7.6, BLUE], [30, 15, 7.6, BLUE], [47, 15, 7.6, BLUE], [13, 40, 7.6, RED], [30, 40, 7.6, RED], [47, 40, 7.6, RED], [13, 65, 7.6, GREEN], [30, 65, 7.6, GREEN], [47, 65, 7.6, GREEN]],
};

function stick(x, y, color, h = 22, w = 7) {
  const x0 = x - w / 2, y0 = y - h / 2;
  return `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="${w / 2}" fill="${color}"/>` +
    `<rect x="${x0 - 0.8}" y="${y - 1.2}" width="${w + 1.6}" height="2.4" rx="1" fill="${color}"/>` +
    `<line x1="${x}" y1="${y0 + 3}" x2="${x}" y2="${y0 + h - 3}" stroke="#fbf7ee" stroke-width="1.2" opacity=".55"/>`;
}

const SOU = {
  2: [[30, 21, GREEN], [30, 59, BLUE]],
  3: [[30, 21, BLUE], [18, 59, GREEN], [42, 59, GREEN]],
  4: [[18, 21, BLUE], [42, 21, GREEN], [18, 59, GREEN], [42, 59, BLUE]],
  5: [[16, 19, GREEN], [44, 19, BLUE], [30, 40, RED], [16, 61, BLUE], [44, 61, GREEN]],
  6: [[14, 21, GREEN], [30, 21, GREEN], [46, 21, GREEN], [14, 59, BLUE], [30, 59, BLUE], [46, 59, BLUE]],
  7: [[30, 13, RED], [14, 40, GREEN], [30, 40, GREEN], [46, 40, GREEN], [14, 66, BLUE], [30, 66, BLUE], [46, 66, BLUE]],
  8: [[10, 21, GREEN], [23, 21, GREEN], [37, 21, GREEN], [50, 21, GREEN], [10, 59, BLUE], [23, 59, BLUE], [37, 59, BLUE], [50, 59, BLUE]],
  9: [[14, 14, GREEN], [30, 14, RED], [46, 14, BLUE], [14, 40, GREEN], [30, 40, RED], [46, 40, BLUE], [14, 66, GREEN], [30, 66, RED], [46, 66, BLUE]],
};

function souOne() {
  // a sparrow perched on a bamboo stalk
  return `<rect x="27" y="10" width="6" height="62" rx="3" fill="${GREEN}"/>` +
    `<rect x="25.5" y="30" width="9" height="2.6" rx="1" fill="${GREEN}"/><rect x="25.5" y="52" width="9" height="2.6" rx="1" fill="${GREEN}"/>` +
    `<path d="M33 31 q12 -8 18 -20 q-4 14 -16 22z" fill="${GREEN}"/>` +
    `<ellipse cx="21" cy="40" rx="10" ry="7.5" fill="${RED}"/><circle cx="14" cy="34" r="5.5" fill="${RED}"/>` +
    `<path d="M9 34 l-5 1.5 l5 1.5z" fill="#d79a1e"/><circle cx="13" cy="33" r="1.3" fill="#fbf7ee"/>` +
    `<path d="M28 42 l9 6 l-10 0z" fill="${BLUE}"/><path d="M17 41 q5 5 10 0" fill="none" stroke="#fbf7ee" stroke-width="1.4"/>`;
}

function face(t, red) {
  let body = '';
  if (t < 9) {
    const n = t + 1;
    body = `<text x="30" y="35" font-size="27" text-anchor="middle" font-family="${FONT}" font-weight="700" fill="${red ? RED : INK}">${NUMS[n - 1]}</text>` +
      `<text x="30" y="70" font-size="29" text-anchor="middle" font-family="${FONT}" font-weight="700" fill="${RED}">萬</text>`;
  } else if (t < 18) {
    const n = t - 8;
    body = PIN[n].map(([x, y, r, col]) => circle(x, y, r, red ? RED : col)).join('');
  } else if (t < 27) {
    const n = t - 17;
    body = n === 1 ? souOne() : SOU[n].map(([x, y, col]) => stick(x, y, red ? RED : col)).join('');
  } else if (t < 31) {
    body = `<text x="30" y="55" font-size="40" text-anchor="middle" font-family="${FONT}" font-weight="700" fill="${INK}">${'東南西北'[t - 27]}</text>`;
  } else if (t === 31) {
    body = `<rect x="11" y="13" width="38" height="54" rx="3" fill="none" stroke="${BLUE}" stroke-width="3.2"/><rect x="16" y="18" width="28" height="44" rx="2" fill="none" stroke="${BLUE}" stroke-width="1.2"/>`;
  } else {
    const col = t === 32 ? GREEN : RED;
    body = `<text x="30" y="56" font-size="42" text-anchor="middle" font-family="${FONT}" font-weight="700" fill="${col}">${t === 32 ? '發' : '中'}</text>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 80">${body}</svg>`;
}

// "Clear" style: the suit symbol in the top-left, a big black number (or letter) in the bottom-right;
// red fives get a red number.
const NUM_FONT = `system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif`;
function clearFace(t, red) {
  let suit = '', mark = '', markColor = INK, size = 41;
  if (t < 27) {
    const s = Math.floor(t / 9), n = (t % 9) + 1;
    mark = String(n);
    markColor = red ? RED : INK;
    if (s === 0) suit = `<text x="3" y="37" font-size="36" font-family="${FONT}" font-weight="700" fill="${red ? RED : INK}">萬</text>`;
    else if (s === 1) suit = circle(21, 21, 17, red ? RED : BLUE);
    else suit = stick(12, 22, red ? RED : GREEN, 36, 9) + stick(27, 22, red ? RED : GREEN, 36, 9);
  } else if (t < 31) {
    suit = `<text x="3" y="36" font-size="34" font-family="${FONT}" font-weight="700" fill="${INK}">${'東南西北'[t - 27]}</text>`;
    mark = 'ESWN'[t - 27];
  } else if (t === 31) {
    suit = `<rect x="5" y="5" width="28" height="34" rx="2" fill="none" stroke="${BLUE}" stroke-width="3.4"/>`;
    mark = 'Wh'; size = 30;
  } else {
    const col = t === 32 ? GREEN : RED;
    suit = `<text x="3" y="36" font-size="34" font-family="${FONT}" font-weight="700" fill="${col}">${t === 32 ? '發' : '中'}</text>`;
    mark = t === 32 ? 'G' : 'R';
  }
  const num = `<text x="57" y="77" font-size="${size}" text-anchor="end" font-family="${NUM_FONT}" font-weight="800" fill="${markColor}">${mark}</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 80">${suit}${num}</svg>`;
}

let style = 'classic';
export function setTileStyle(s) { style = s === 'clear' ? 'clear' : 'classic'; }

const cache = new Map();
export function faceUrl(t, red = false) {
  const key = `${style}${t * 2 + (red ? 1 : 0)}`;
  let u = cache.get(key);
  if (!u) {
    u = `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(style === 'clear' ? clearFace(t, red) : face(t, red))}")`;
    cache.set(key, u);
  }
  return u;
}
