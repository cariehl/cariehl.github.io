// The county: tile grid, buildings and containers, and the seeded generator that builds it.
import { makeRng } from './rng.js';
import { FURNITURE, DOOR_HP, WINDOW_HP, BWALL_HP, FENCE_HP } from './data.js';

export const W = 112, H = 112;

// Ground
export const G = { GRASS: 0, ROAD: 1, WALK: 2, WOOD: 3, TILE: 4, CARPET: 5, CONCRETE: 6, DIRT: 7, LINE: 8, LOT: 9, FIELD: 10 };
// Structures
export const S = { NONE: 0, WALL: 1, DOOR: 2, WINDOW: 3, TREE: 4, FENCE: 5, BWALL: 6, FURN: 7, BUSH: 8 };

// Wall palettes per building style: [top, left face, right face]
export const WALL_STYLES = [
  ['#d9cfbd', '#b9ad98', '#a3977f'], // cream siding
  ['#b6c3c9', '#93a2aa', '#7f8e96'], // blue-grey siding
  ['#c9b08e', '#a68d6b', '#8f7758'], // tan
  ['#c48a72', '#a26b55', '#8b5a46'], // brick
  ['#aab59a', '#8b967b', '#778267'], // sage
  ['#9a9ea6', '#7d818a', '#6a6e77'], // store concrete
  ['#8c6a4e', '#6e523b', '#5d4431'], // barn / shed wood
];

const ROADS = [14, 38, 62, 86];
const TOWN0 = 12, TOWN1 = 88;

export const STORE_NAMES = {
  grocery: 'Fairway Grocery', hardware: 'Ridgeline Hardware', pharmacy: 'Marrow Creek Pharmacy',
  electronics: 'Volt & Byte', police: "Sheriff's Office", fire: 'Fire Station 2', gas: 'Gas-N-Go',
};

export function idx(x, y) { return y * W + x; }
export function inBounds(x, y) { return x >= 0 && y >= 0 && x < W && y < H; }

export function createWorld(seed) {
  const n = W * H;
  const w = {
    seed,
    ground: new Uint8Array(n),
    struct: new Uint8Array(n),
    open: new Uint8Array(n),   // door: 1 open. window: 0 shut, 1 open, 2 smashed
    barr: new Uint8Array(n),   // planks nailed over a door or window (0-3)
    bhp: new Int16Array(n),    // health of the outermost plank
    hp: new Int16Array(n),     // structure health (doors, windows, fences, built walls)
    style: new Uint8Array(n),  // wall palette
    room: new Int16Array(n),   // building id + 1, 0 outdoors
    explored: new Uint8Array(n),
    containers: new Map(),     // tile index -> { kind, table, items|null }
    buildings: [],
    exits: [],                 // road tiles at the map edge, where robots walk in
    start: null,
    version: 0,                // bumped when something that affects paths changes
  };
  generate(w, makeRng(seed));
  return w;
}

// ---------- queries ----------

// mode: 0 the player, 1 a walking robot, 2 a flying robot.
export const MOVE_PLAYER = 0, MOVE_WALK = 1, MOVE_FLY = 2;
export function blocksMove(w, x, y, mode = MOVE_PLAYER) {
  if (!inBounds(x, y)) return true;
  const i = idx(x, y), s = w.struct[i];
  switch (s) {
    case S.NONE: case S.BUSH: return false;
    case S.DOOR: return !(w.open[i] >= 1 && w.barr[i] === 0);
    case S.WINDOW: return mode === MOVE_PLAYER || !(w.open[i] >= 1 && w.barr[i] === 0);
    case S.TREE: case S.FENCE: case S.FURN: return mode !== MOVE_FLY;
    default: return true;
  }
}

export function blocksSight(w, x, y) {
  if (!inBounds(x, y)) return true;
  const i = idx(x, y), s = w.struct[i];
  if (s === S.WALL || s === S.BWALL || s === S.TREE) return true;
  if (s === S.DOOR) return w.open[i] !== 1 || w.barr[i] > 0;
  if (s === S.WINDOW) return w.barr[i] >= 1;
  return false;
}

// Something a robot can break through (and how long that takes, for pathing).
export function bashCost(w, x, y, robot) {
  const i = idx(x, y), s = w.struct[i];
  if (s === S.DOOR) {
    if (w.open[i] >= 1 && w.barr[i] === 0) return 0;
    if (w.barr[i] === 0 && robot.opensDoors) return 2;
    if (!robot.bash) return Infinity;
    return 3 + (w.hp[i] + w.barr[i] * 90) / robot.bash * 0.6;
  }
  if (s === S.WINDOW) {
    if (w.open[i] >= 1 && w.barr[i] === 0) return 2;
    if (!robot.bash) return Infinity;
    return 3 + (w.hp[i] + w.barr[i] * 90) / robot.bash * 0.6;
  }
  if (s === S.BWALL || s === S.FENCE) return robot.bash ? 4 + w.hp[i] / robot.bash * 0.6 : Infinity;
  return Infinity;
}

export function isIndoors(w, x, y) {
  return inBounds(x | 0, y | 0) && w.room[idx(x | 0, y | 0)] > 0;
}

export function buildingAt(w, x, y) {
  const r = inBounds(x | 0, y | 0) ? w.room[idx(x | 0, y | 0)] : 0;
  return r > 0 ? w.buildings[r - 1] : null;
}

export function addContainer(w, x, y, kind, table, items = null) {
  w.containers.set(idx(x, y), { kind, table: table || FURNITURE[kind]?.loot || 'none', items });
}

// ---------- generation ----------

function setGround(w, x, y, g) { if (inBounds(x, y)) w.ground[idx(x, y)] = g; }
function setStruct(w, x, y, s) { if (inBounds(x, y)) w.struct[idx(x, y)] = s; }
function free(w, x, y) { return inBounds(x, y) && w.struct[idx(x, y)] === S.NONE; }

function placeFurn(w, x, y, kind, table) {
  setStruct(w, x, y, S.FURN);
  addContainer(w, x, y, kind, table);
}

function generate(w, rng) {
  // Ground: grass everywhere, fields in some country quadrants.
  const fieldQuads = rng.shuffle([0, 1, 2, 3]).slice(0, 2);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const out = x < TOWN0 - 2 || y < TOWN0 - 2 || x > TOWN1 + 2 || y > TOWN1 + 2;
    const q = (x > W / 2 ? 1 : 0) + (y > H / 2 ? 2 : 0);
    if (out && fieldQuads.includes(q) && (x > 94 || y > 94) && x > 4 && y > 4 && x < W - 5 && y < H - 5) setGround(w, x, y, G.FIELD);
  }

  // Roads: a 4x4 grid in town, the two middle roads run out of the county both ways.
  for (const p of ROADS) {
    const long = p === ROADS[1] || p === ROADS[2];
    const a = long ? 0 : TOWN0, b = long ? W - 1 : TOWN1;
    for (let t = a; t <= b; t++) {
      for (let d = -2; d <= 2; d++) {
        const g = Math.abs(d) === 2 ? G.WALK : G.ROAD;
        // vertical road at x = p
        if (!(long && (t < TOWN0 - 2 || t > TOWN1 + 2) && Math.abs(d) === 2)) {
          paint(w, p + d, t, g);
          paint(w, t, p + d, g);
        } else {
          paint(w, p + d, t, G.DIRT);
          paint(w, t, p + d, G.DIRT);
        }
      }
      if (t % 4 < 2) { lineMark(w, p, t); lineMark(w, t, p); }
    }
  }
  for (const p of [ROADS[1], ROADS[2]]) {
    for (let d = -1; d <= 1; d++) {
      w.exits.push([p + d, 1], [p + d, H - 2], [1, p + d], [W - 2, p + d]);
    }
  }

  // Blocks between the roads.
  const blocks = [];
  for (let by = 0; by < 3; by++) for (let bx = 0; bx < 3; bx++) {
    blocks.push({ bx, by, x0: ROADS[bx] + 3, y0: ROADS[by] + 3, x1: ROADS[bx + 1] - 3, y1: ROADS[by + 1] - 3 });
  }
  const center = blocks[4];
  const others = rng.shuffle(blocks.filter(b => b !== center));
  const commercial = [center, others[0], others[1]];
  const park = others[2];
  const residential = others.slice(3);

  const storeTypes = rng.shuffle(['grocery', 'hardware', 'pharmacy', 'electronics', 'police', 'fire']);
  let si = 0;
  for (const b of commercial) {
    const midY = Math.floor((b.y0 + b.y1) / 2);
    makeStore(w, rng, b.x0 + 1, b.y0 + 1, b.x1 - 1, midY - 1, storeTypes[si++], 'n');
    makeStore(w, rng, b.x0 + 1, midY + 1, b.x1 - 1, b.y1 - 1, storeTypes[si++], 's');
    // alley between them
    for (let x = b.x0; x <= b.x1; x++) setGround(w, x, midY, G.LOT);
    if (rng.chance(0.8)) placeFurn(w, rng.int(b.x0 + 2, b.x1 - 2), midY, 'dumpster');
  }
  makePark(w, rng, park);
  for (const b of residential) makeResidentialBlock(w, rng, b);

  // Country: gas station and farmhouses along the long roads.
  const gx = ROADS[2] + 4, gy = TOWN1 + 6;
  for (let y = gy - 1; y <= gy + 9; y++) for (let x = gx - 1; x <= gx + 11; x++) setGround(w, x, y, G.LOT);
  makeStore(w, rng, gx + 1, gy + 3, gx + 10, gy + 9, 'gas', 'w');
  const farms = [
    [ROADS[1] - 16, 2, 'e'], [3, 66, 'n'], [97, ROADS[1] - 16, 's'],
  ];
  for (const [fx, fy, face] of rng.shuffle(farms).slice(0, 3)) makeFarm(w, rng, fx, fy, face);

  // Landmarks: the Care Depot on Route 9 south, Dot's radio station on 62 north.
  makeDepot(w, rng, 20, 92);
  makeStation(w, rng, ROADS[2] + 4, 4);

  // Wilds: trees and brush outside town, and a dense tree line at the county edge.
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = idx(x, y);
    if (w.struct[i] !== S.NONE || w.room[i]) continue;
    const g = w.ground[i];
    if (g === G.ROAD || g === G.WALK || g === G.LINE || g === G.LOT || g === G.DIRT || g === G.CONCRETE) continue;
    const edge = Math.min(x, y, W - 1 - x, H - 1 - y);
    const inTown = x >= TOWN0 && y >= TOWN0 && x <= TOWN1 && y <= TOWN1;
    if (edge <= 1) { w.struct[i] = S.TREE; continue; }
    if (g === G.FIELD) { if (rng.chance(0.01)) w.struct[i] = S.BUSH; continue; }
    if (inTown) continue;
    const r = rng.next();
    const dense = edge < 7 ? 0.32 : 0.14;
    if (r < dense) w.struct[i] = S.TREE;
    else if (r < dense + 0.06) w.struct[i] = S.BUSH;
  }
  // Parked and crashed cars on the roads.
  for (const p of ROADS) {
    for (let t = TOWN0; t <= TOWN1; t++) {
      if (rng.chance(0.07)) tryCar(w, rng, p + rng.pick([-1, 1]), t);
      if (rng.chance(0.07)) tryCar(w, rng, t, p + rng.pick([-1, 1]));
    }
  }
  for (const [x, y] of [[ROADS[1], 100], [ROADS[2], 6], [104, ROADS[2]], [5, ROADS[1]]]) {
    if (rng.chance(0.7)) tryCar(w, rng, x + rng.int(-1, 1), y + rng.int(-1, 1));
  }

  ensureReachable(w);

  // Health for everything breakable.
  for (let i = 0; i < W * H; i++) {
    const s = w.struct[i];
    if (s === S.DOOR) w.hp[i] = DOOR_HP;
    else if (s === S.WINDOW) w.hp[i] = WINDOW_HP;
    else if (s === S.BWALL) w.hp[i] = BWALL_HP;
    else if (s === S.FENCE) w.hp[i] = FENCE_HP;
  }

  // Start in a house.
  const houses = w.buildings.filter(b => b.type === 'house' && b.inX != null);
  const home = rng.pick(houses);
  w.start = { x: home.inX + 0.5, y: home.inY + 0.5, building: home.id };
}

// Every building entrance must connect to the roads: cut through trees and brush where not.
function ensureReachable(w) {
  const walk = s => s === S.NONE || s === S.BUSH || s === S.DOOR;
  const seen = new Uint8Array(W * H);
  const fill = (starts) => {
    const stack = starts.slice();
    while (stack.length) {
      const i = stack.pop();
      if (seen[i] || !walk(w.struct[i])) continue;
      seen[i] = 1;
      const x = i % W, y = (i / W) | 0;
      if (x > 0) stack.push(i - 1);
      if (x < W - 1) stack.push(i + 1);
      if (y > 0) stack.push(i - W);
      if (y < H - 1) stack.push(i + W);
    }
  };
  fill(w.exits.map(([x, y]) => idx(x, y)));
  for (const b of w.buildings) {
    const start = idx(b.inX, b.inY);
    if (seen[start]) continue;
    // breadth-first search that may pass through trees, back to anything reachable
    const prev = new Int32Array(W * H).fill(-2);
    const q = [start]; prev[start] = -1;
    let hit = -1;
    for (let k = 0; k < q.length && hit < 0; k++) {
      const i = q[k], x = i % W, y = (i / W) | 0;
      for (const j of [x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1, y > 0 ? i - W : -1, y < H - 1 ? i + W : -1]) {
        if (j < 0 || prev[j] !== -2) continue;
        const s = w.struct[j];
        if (!(walk(s) || s === S.TREE)) continue;
        if (w.room[j] && w.room[j] !== b.id + 1 && s !== S.DOOR) continue;
        prev[j] = i;
        if (seen[j]) { hit = j; break; }
        q.push(j);
      }
    }
    for (let i = hit; i >= 0; i = prev[i]) if (w.struct[i] === S.TREE) w.struct[i] = S.NONE;
    fill([start]);
  }
}

function paint(w, x, y, g) {
  if (!inBounds(x, y)) return;
  const cur = w.ground[idx(x, y)];
  if (cur === G.ROAD || cur === G.LINE) return; // crossings stay road
  w.ground[idx(x, y)] = g;
}
function lineMark(w, x, y) {
  if (!inBounds(x, y)) return;
  // only mark straight stretches, not intersections
  const i = idx(x, y);
  if (w.ground[i] !== G.ROAD) return;
  const nearCross = ROADS.some(p => Math.abs(x - p) <= 2) && ROADS.some(p => Math.abs(y - p) <= 2);
  if (!nearCross) w.ground[i] = G.LINE;
}

function tryCar(w, rng, x, y) {
  if (!inBounds(x, y) || !free(w, x, y)) return;
  const g = w.ground[idx(x, y)];
  if (g !== G.ROAD && g !== G.LINE && g !== G.LOT && g !== G.DIRT) return;
  // never fully block a road: keep the cross lane clear
  placeFurn(w, x, y, 'car');
  w.containers.get(idx(x, y)).color = rng.pick(['#5a7fa6', '#a64b45', '#d4cfc4', '#3e4a52', '#6b8f5e', '#c49a3a']);
}

function makePark(w, rng, b) {
  for (let y = b.y0; y <= b.y1; y++) for (let x = b.x0; x <= b.x1; x++) {
    const onPath = x === Math.floor((b.x0 + b.x1) / 2) || y === Math.floor((b.y0 + b.y1) / 2);
    if (onPath) { setGround(w, x, y, G.WALK); continue; }
    const r = rng.next();
    if (r < 0.12) setStruct(w, x, y, S.TREE);
    else if (r < 0.22) setStruct(w, x, y, S.BUSH);
  }
}

function makeResidentialBlock(w, rng, b) {
  const mx = Math.floor((b.x0 + b.x1) / 2), my = Math.floor((b.y0 + b.y1) / 2);
  const lots = [
    [b.x0, b.y0, mx - 1, my - 1, rng.pick(['n', 'w'])],
    [mx + 1, b.y0, b.x1, my - 1, rng.pick(['n', 'e'])],
    [b.x0, my + 1, mx - 1, b.y1, rng.pick(['s', 'w'])],
    [mx + 1, my + 1, b.x1, b.y1, rng.pick(['s', 'e'])],
  ];
  for (const [x0, y0, x1, y1, face] of lots) {
    const lw = x1 - x0 + 1, lh = y1 - y0 + 1;
    const hw = rng.int(6, Math.min(9, lw - 1)), hh = rng.int(6, Math.min(8, lh - 2));
    // house sits against the front of the lot (with a one-tile front yard)
    let hx, hy;
    if (face === 'n') { hx = x0 + rng.int(0, lw - hw); hy = y0 + 1; }
    else if (face === 's') { hx = x0 + rng.int(0, lw - hw); hy = y1 - hh; }
    else if (face === 'w') { hx = x0 + 1; hy = y0 + rng.int(0, lh - hh); }
    else { hx = x1 - hw; hy = y0 + rng.int(0, lh - hh); }
    const house = makeHouse(w, rng, hx, hy, hw, hh, face, rng.int(0, 4));
    // backyard: maybe a shed, trees, bushes
    if (rng.chance(0.4)) {
      for (let tries = 0; tries < 20; tries++) {
        const sx = rng.int(x0, x1 - 3), sy = rng.int(y0, y1 - 3);
        if (rectFree(w, sx - 1, sy - 1, sx + 3, sy + 3)) { makeShed(w, rng, sx, sy); break; }
      }
    }
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      if (!free(w, x, y) || w.room[idx(x, y)]) continue;
      if (nearBuilding(w, x, y)) {
        if (rng.chance(0.08)) setStruct(w, x, y, S.BUSH);
        continue;
      }
      const r = rng.next();
      if (r < 0.05) setStruct(w, x, y, S.TREE);
      else if (r < 0.09) setStruct(w, x, y, S.BUSH);
    }
    void house;
  }
}

function nearBuilding(w, x, y) {
  for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
    if (inBounds(x + dx, y + dy) && w.room[idx(x + dx, y + dy)]) return true;
  }
  return false;
}

function rectFree(w, x0, y0, x1, y1) {
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    if (!inBounds(x, y)) return false;
    const i = idx(x, y);
    if (w.struct[i] !== S.NONE || w.room[i]) return false;
    const g = w.ground[i];
    if (g === G.ROAD || g === G.WALK || g === G.LINE) return false;
  }
  return true;
}

function newBuilding(w, type, x, y, wd, ht, name) {
  const b = { id: w.buildings.length, type, x, y, w: wd, h: ht, name, inX: null, inY: null };
  w.buildings.push(b);
  return b;
}

// Outer walls and floor; returns the building.
function shell(w, b, floor, style) {
  for (let y = b.y; y < b.y + b.h; y++) for (let x = b.x; x < b.x + b.w; x++) {
    const i = idx(x, y);
    const edge = x === b.x || y === b.y || x === b.x + b.w - 1 || y === b.y + b.h - 1;
    w.ground[i] = floor;
    w.struct[i] = edge ? S.WALL : S.NONE;
    w.style[i] = style;
    w.room[i] = b.id + 1;
  }
}

// The door tile on a given face, and the inside tile behind it.
function doorOnFace(rng, b, face, at) {
  const pos = at ?? null;
  if (face === 'n') { const x = pos ?? rng.int(b.x + 1, b.x + b.w - 2); return [x, b.y, x, b.y + 1]; }
  if (face === 's') { const x = pos ?? rng.int(b.x + 1, b.x + b.w - 2); return [x, b.y + b.h - 1, x, b.y + b.h - 2]; }
  if (face === 'w') { const y = pos ?? rng.int(b.y + 1, b.y + b.h - 2); return [b.x, y, b.x + 1, y]; }
  const y = pos ?? rng.int(b.y + 1, b.y + b.h - 2); return [b.x + b.w - 1, y, b.x + b.w - 2, y];
}
const OPP = { n: 's', s: 'n', e: 'w', w: 'e' };

function makeHouse(w, rng, x, y, wd, ht, face, style) {
  const b = newBuilding(w, 'house', x, y, wd, ht, null);
  shell(w, b, G.WOOD, style);
  const ix0 = x + 1, iy0 = y + 1, ix1 = x + wd - 2, iy1 = y + ht - 2;
  const doors = [];
  // Interior split: rooms as rectangles of floor.
  const rooms = [];
  const iw = ix1 - ix0 + 1, ih = iy1 - iy0 + 1;
  const splitV = iw >= ih;
  if (splitV && iw >= 5) {
    const sx = ix0 + rng.int(2, iw - 3);
    for (let yy = iy0; yy <= iy1; yy++) setStruct(w, sx, yy, S.WALL), (w.style[idx(sx, yy)] = style);
    const dy = rng.int(iy0, iy1); setStruct(w, sx, dy, S.NONE); doors.push([sx, dy]);
    const left = [ix0, iy0, sx - 1, iy1], right = [sx + 1, iy0, ix1, iy1];
    const big = (sx - ix0) > (ix1 - sx) ? left : right;
    const small = big === left ? right : left;
    rooms.push(small);
    splitH(big);
  } else if (!splitV && ih >= 5) {
    const sy = iy0 + rng.int(2, ih - 3);
    for (let xx = ix0; xx <= ix1; xx++) setStruct(w, xx, sy, S.WALL), (w.style[idx(xx, sy)] = style);
    const dx = rng.int(ix0, ix1); setStruct(w, dx, sy, S.NONE); doors.push([dx, sy]);
    rooms.push([ix0, iy0, ix1, sy - 1]);
    rooms.push([ix0, sy + 1, ix1, iy1]);
  } else rooms.push([ix0, iy0, ix1, iy1]);

  function splitH(r) {
    const [a, b0, c, d] = r;
    const h = d - b0 + 1;
    if (h >= 5 && c - a >= 1) {
      const sy = b0 + rng.int(2, h - 3);
      for (let xx = a; xx <= c; xx++) setStruct(w, xx, sy, S.WALL), (w.style[idx(xx, sy)] = style);
      const dx = rng.int(a, c); setStruct(w, dx, sy, S.NONE); doors.push([dx, sy]);
      // if the wall lands on the row of the doorway into this half, keep the tile behind that doorway open
      for (const [ex, ey] of doors) if (ey === sy && (ex === a - 1 || ex === c + 1)) { const ox = ex === a - 1 ? a : c; setStruct(w, ox, sy, S.NONE); doors.push([ox, sy]); }
      rooms.push([a, b0, c, sy - 1], [a, sy + 1, c, d]);
    } else rooms.push(r);
  }

  // Exterior doors
  const [fdx, fdy, fix, fiy] = doorOnFace(rng, b, face);
  setStruct(w, fdx, fdy, S.DOOR);
  doors.push([fdx, fdy]);
  // make sure the tile behind the door is floor
  setStruct(w, fix, fiy, S.NONE);
  b.inX = fix; b.inY = fiy;
  // path to the street
  frontPath(w, fdx, fdy, face);
  if (rng.chance(0.45)) {
    const [bdx, bdy, bix, biy] = doorOnFace(rng, b, OPP[face]);
    setStruct(w, bdx, bdy, S.DOOR); setStruct(w, bix, biy, S.NONE); doors.push([bdx, bdy]);
  }
  windows(w, rng, b, 0.4);

  // Rooms: the one with the front door is the living room.
  const roomOf = (px, py) => rooms.findIndex(r => px >= r[0] && px <= r[2] && py >= r[1] && py <= r[3]);
  const living = Math.max(0, roomOf(fix, fiy));
  const order = rooms.map((r, i) => i).filter(i => i !== living)
    .sort((p, q) => area(rooms[p]) - area(rooms[q]));
  const kinds = {};
  kinds[living] = 'living';
  if (order.length === 0) kinds[living] = 'studio';
  else if (order.length === 1) { kinds[order[0]] = 'bedroom'; kinds[living] = 'livingkitchen'; }
  else if (order.length === 2) { kinds[order[0]] = 'bath'; kinds[order[1]] = 'bedroom'; kinds[living] = 'livingkitchen'; }
  else { kinds[order[0]] = 'bath'; kinds[order[1]] = 'kitchen'; kinds[order[2]] = 'bedroom'; }

  const sets = {
    living: ['sofa', 'tv', 'shelf', rng.chance(0.4) ? 'desk' : 'table', rng.chance(0.25) ? 'toolbox' : null],
    livingkitchen: ['counter', 'fridge', 'stove', 'sink', 'sofa', 'tv', rng.chance(0.3) ? 'toolbox' : 'shelf'],
    kitchen: ['counter', 'fridge', 'stove', 'sink', 'counter', rng.chance(0.5) ? 'microwave' : 'table', rng.chance(0.25) ? 'workbench' : null],
    bedroom: ['bed', 'wardrobe', 'dresser', rng.chance(0.4) ? 'desk' : null, rng.chance(0.3) ? 'computer' : null],
    bath: ['toilet', 'sink', 'medcab', rng.chance(0.5) ? 'tub' : null],
    studio: ['bed', 'counter', 'fridge', 'sink', 'sofa', 'medcab'],
  };
  for (let r = 0; r < rooms.length; r++) furnishRoom(w, rng, b, rooms[r], sets[kinds[r]].filter(Boolean), doors);
  return b;
}

function area(r) { return (r[2] - r[0] + 1) * (r[3] - r[1] + 1); }

function frontPath(w, dx, dy, face) {
  const [ox, oy] = { n: [0, -1], s: [0, 1], w: [-1, 0], e: [1, 0] }[face];
  let x = dx + ox, y = dy + oy;
  for (let k = 0; k < 6 && inBounds(x, y); k++) {
    const g = w.ground[idx(x, y)];
    if (g === G.WALK || g === G.ROAD || g === G.LINE) break;
    w.ground[idx(x, y)] = G.CONCRETE;
    x += ox; y += oy;
  }
}

function windows(w, rng, b, p) {
  const x1 = b.x + b.w - 1, y1 = b.y + b.h - 1;
  const consider = (x, y, ix, iy) => {
    const i = idx(x, y);
    if (w.struct[i] !== S.WALL) return;
    if (w.struct[idx(ix, iy)] !== S.NONE) return; // interior wall or furniture behind
    for (const [ax, ay] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const s = w.struct[idx(x + ax, y + ay)];
      if (s === S.DOOR || s === S.WINDOW) return;
    }
    if (rng.chance(p)) w.struct[i] = S.WINDOW;
  };
  for (let x = b.x + 1; x < x1; x++) { consider(x, b.y, x, b.y + 1); consider(x, y1, x, y1 - 1); }
  for (let y = b.y + 1; y < y1; y++) { consider(b.x, y, b.x + 1, y); consider(x1, y, x1 - 1, y); }
}

function furnishRoom(w, rng, b, r, list, doors) {
  const [x0, y0, x1, y1] = r;
  const nearDoor = (x, y) => doors.some(([dx, dy]) => Math.abs(dx - x) <= 1 && Math.abs(dy - y) <= 1);
  const cands = [];
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    if (!free(w, x, y) || nearDoor(x, y)) continue;
    const againstWall = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([ax, ay]) => {
      const s = w.struct[idx(x + ax, y + ay)];
      return s === S.WALL || s === S.WINDOW;
    });
    if (againstWall) cands.push([x, y]);
  }
  rng.shuffle(cands);
  for (const kind of list) {
    for (let c = 0; c < cands.length; c++) {
      const [x, y] = cands[c];
      if (!free(w, x, y)) continue;
      placeFurn(w, x, y, kind);
      if (houseConnected(w, b) && furnitureReachable(w, b)) { cands.splice(c, 1); break; }
      w.struct[idx(x, y)] = S.NONE; w.containers.delete(idx(x, y));
    }
  }
}

// Every piece of furniture has open floor beside it, so you can stand there and search it.
function furnitureReachable(w, b) {
  for (let y = b.y + 1; y < b.y + b.h - 1; y++) for (let x = b.x + 1; x < b.x + b.w - 1; x++) {
    if (w.struct[idx(x, y)] !== S.FURN) continue;
    if (![[1, 0], [-1, 0], [0, 1], [0, -1]].some(([ax, ay]) => w.struct[idx(x + ax, y + ay)] === S.NONE && w.room[idx(x + ax, y + ay)] === b.id + 1)) return false;
  }
  return true;
}

// Every open floor tile inside the building can be reached from its entrance.
function houseConnected(w, b) {
  const seen = new Set();
  const stack = [[b.inX, b.inY]];
  let total = 0;
  for (let y = b.y + 1; y < b.y + b.h - 1; y++) for (let x = b.x + 1; x < b.x + b.w - 1; x++) {
    if (w.struct[idx(x, y)] === S.NONE) total++;
  }
  while (stack.length) {
    const [x, y] = stack.pop();
    const i = idx(x, y);
    if (seen.has(i) || w.struct[i] !== S.NONE || w.room[i] !== b.id + 1) continue;
    seen.add(i);
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
  return seen.size === total;
}

function makeShed(w, rng, x, y) {
  const b = newBuilding(w, 'shed', x, y, 3, 3, 'Shed');
  shell(w, b, G.CONCRETE, 6);
  const face = rng.pick(['n', 's', 'e', 'w']);
  const [dx, dy] = doorOnFace(rng, b, face, face === 'n' || face === 's' ? x + 1 : y + 1);
  setStruct(w, dx, dy, S.DOOR);
  b.inX = x + 1; b.inY = y + 1;
  // one-tile shed: the loot sits in the walls' corner as a tool chest on the floor tile? Keep the floor free;
  // instead the far wall becomes a workbench niche.
  const [ox, oy] = { n: [0, 1], s: [0, -1], w: [1, 0], e: [-1, 0] }[face];
  const bx = x + 1 + ox, by = y + 1 + oy;
  setStruct(w, bx, by, S.FURN);
  addContainer(w, bx, by, rng.chance(0.5) ? 'workbench' : 'toolbox');
}

function makeStore(w, rng, x0, y0, x1, y1, type, face) {
  const b = newBuilding(w, 'store', x0, y0, x1 - x0 + 1, y1 - y0 + 1, STORE_NAMES[type]);
  b.store = type;
  const floor = type === 'police' || type === 'fire' ? G.CONCRETE : G.TILE;
  shell(w, b, floor, type === 'police' || type === 'fire' ? 3 : 5);
  // Double front door in the middle of the street face, and big windows.
  const horiz = face === 'n' || face === 's';
  const mid = horiz ? Math.floor((x0 + x1) / 2) : Math.floor((y0 + y1) / 2);
  const [d1x, d1y, i1x, i1y] = doorOnFace(rng, b, face, mid);
  const [d2x, d2y] = doorOnFace(rng, b, face, mid + 1);
  setStruct(w, d1x, d1y, S.DOOR); setStruct(w, d2x, d2y, S.DOOR);
  b.inX = i1x; b.inY = i1y;
  frontPath(w, d1x, d1y, face); frontPath(w, d2x, d2y, face);
  const [bdx, bdy] = doorOnFace(rng, b, OPP[face]);
  setStruct(w, bdx, bdy, S.DOOR);
  const doors = [[d1x, d1y], [d2x, d2y], [bdx, bdy]];
  // storefront windows
  const fx0 = horiz ? x0 + 1 : y0 + 1, fx1 = horiz ? x1 - 1 : y1 - 1;
  for (let t = fx0; t <= fx1; t++) {
    if (Math.abs(t - mid) <= 1 || t === mid + 2) continue;
    if ((t - fx0) % 3 === 2) continue;
    const [wx, wy] = horiz ? [t, face === 'n' ? y0 : y1] : [face === 'w' ? x0 : x1, t];
    setStruct(w, wx, wy, S.WINDOW);
  }
  windows(w, rng, b, 0.12);

  const table = 'store:' + type;
  const ix0 = x0 + 1, iy0 = y0 + 1, ix1 = x1 - 1, iy1 = y1 - 1;
  const nearDoor = (x, y) => doors.some(([dx, dy]) => Math.abs(dx - x) <= 1 && Math.abs(dy - y) <= 1);
  if (type === 'police' || type === 'fire') {
    // Offices: desks, lockers along the back wall, weapons locker.
    const back = face === 'n' ? iy1 : face === 's' ? iy0 : null;
    for (let x = ix0; x <= ix1; x++) for (let y = iy0; y <= iy1; y++) {
      if (!free(w, x, y) || nearDoor(x, y)) continue;
      const atBack = horiz ? y === back : x === (face === 'w' ? ix1 : ix0);
      if (atBack && (x + y) % 2 === 0) placeFurn(w, x, y, 'locker');
      else if (!atBack && (x % 3 === 0) && (y % 3 === 1) && free(w, x, y)) placeFurn(w, x, y, 'desk');
    }
    // one weapons locker (police) or gear (fire) in a corner
    const corner = [[ix0, iy0], [ix1, iy0], [ix0, iy1], [ix1, iy1]].find(([x, y]) => free(w, x, y) && !nearDoor(x, y));
    if (corner) placeFurn(w, corner[0], corner[1], type === 'police' ? 'gunrack' : 'locker');
    let shelves = 0;
    for (let x = ix0; x <= ix1 && shelves < 3; x++) for (let y = iy0; y <= iy1 && shelves < 3; y++) {
      const atWall = x === ix0 || x === ix1 || y === iy0 || y === iy1;
      if (atWall && free(w, x, y) && !nearDoor(x, y) && rng.chance(0.15)) { placeFurn(w, x, y, 'storeshelf', table); shelves++; }
    }
  } else {
    // Aisles of shelves parallel to the storefront.
    const front = face === 'n' ? iy0 : face === 's' ? iy1 : face === 'w' ? ix0 : ix1;
    if (horiz) {
      for (let y = iy0; y <= iy1; y++) {
        const fromFront = Math.abs(y - front);
        if (fromFront < 2 || fromFront % 2 === 1 || fromFront === Math.abs(iy1 - iy0)) continue;
        for (let x = ix0 + 1; x <= ix1 - 1; x++) {
          if (x === mid || x === mid + 1 || (x - ix0) % 6 === 0) continue;
          if (free(w, x, y)) placeFurn(w, x, y, 'storeshelf', table);
        }
      }
      const backY = face === 'n' ? iy1 : iy0;
      for (let x = ix0; x <= ix1; x++) {
        if (!free(w, x, backY) || nearDoor(x, backY)) continue;
        if ((type === 'grocery' || type === 'gas') && x % 2 === 0) placeFurn(w, x, backY, 'storefridge');
        else if (x % 3 === 0) placeFurn(w, x, backY, 'storeshelf', table);
      }
    } else {
      for (let x = ix0; x <= ix1; x++) {
        const fromFront = Math.abs(x - front);
        if (fromFront < 2 || fromFront % 2 === 1 || fromFront === Math.abs(ix1 - ix0)) continue;
        for (let y = iy0 + 1; y <= iy1 - 1; y++) {
          if (y === mid || y === mid + 1 || (y - iy0) % 6 === 0) continue;
          if (free(w, x, y)) placeFurn(w, x, y, 'storeshelf', table);
        }
      }
      const backX = face === 'w' ? ix1 : ix0;
      for (let y = iy0; y <= iy1; y++) {
        if (!free(w, backX, y) || nearDoor(backX, y)) continue;
        if ((type === 'grocery' || type === 'gas') && y % 2 === 0) placeFurn(w, backX, y, 'storefridge');
        else if (y % 3 === 0) placeFurn(w, backX, y, 'storeshelf', table);
      }
    }
    // checkout by the door
    const [rx, ry] = horiz ? [mid - 2, i1y] : [i1x, mid - 2];
    if (free(w, rx, ry)) placeFurn(w, rx, ry, 'register');
  }
  // Clean up anything that cut the store in two.
  for (let guard = 0; guard < 40 && !houseConnected(w, b); guard++) {
    // remove a random shelf until connected
    const keys = [...w.containers.keys()].filter(k => w.room[k] === b.id + 1 && w.struct[k] === S.FURN);
    const k = rng.pick(keys);
    w.struct[k] = S.NONE; w.containers.delete(k);
  }
  return b;
}

function makeFarm(w, rng, x, y, face) {
  // clear a yard
  for (let yy = y - 1; yy <= y + 14; yy++) for (let xx = x - 1; xx <= x + 13; xx++) {
    if (inBounds(xx, yy) && w.struct[idx(xx, yy)] === S.NONE) w.ground[idx(xx, yy)] = w.ground[idx(xx, yy)] === G.FIELD ? G.GRASS : w.ground[idx(xx, yy)];
  }
  const house = makeHouse(w, rng, x, y, 8, 7, face, rng.int(0, 4));
  // barn
  const bx = x + 1, by = face === 's' ? y - 7 : y + 9;
  if (rectFree(w, bx - 1, by - 1, bx + 5, by + 5)) {
    const b = newBuilding(w, 'barn', bx, by, 5, 5, 'Barn');
    shell(w, b, G.DIRT, 6);
    const [dx, dy, ix, iy] = doorOnFace(rng, b, face === 's' ? 's' : 'n', bx + 2);
    setStruct(w, dx, dy, S.DOOR);
    b.inX = ix; b.inY = iy;
    placeFurn(w, bx + 1, by + 3, 'workbench');
    placeFurn(w, bx + 3, by + 3, 'toolbox');
    if (!houseConnected(w, b)) { w.struct[idx(bx + 3, by + 3)] = S.NONE; w.containers.delete(idx(bx + 3, by + 3)); }
  }
  void house;
}

function yard(w, x0, y0, x1, y1, g) {
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    if (!inBounds(x, y) || w.room[idx(x, y)]) continue;
    const gg = w.ground[idx(x, y)];
    if (gg === G.ROAD || gg === G.LINE || gg === G.DIRT || gg === G.WALK) continue;
    w.ground[idx(x, y)] = g;
    if (w.struct[idx(x, y)] !== S.FURN) w.struct[idx(x, y)] = S.NONE;
  }
}

// The old logistics depot, where the Tenders take people: rows of cots under lights that
// never go off, and the node that runs it all in the middle of the floor.
function makeDepot(w, rng, x, y) {
  const wd = 15, ht = 13;
  yard(w, x - 2, y - 2, x + wd + 1, y + ht + 1, G.LOT);
  const b = newBuilding(w, 'depot', x, y, wd, ht, 'Care Depot');
  shell(w, b, G.CONCRETE, 3);
  const midY = y + Math.floor(ht / 2);
  const [dx, dy, ix, iy] = doorOnFace(rng, b, 'e', midY);
  setStruct(w, dx, dy, S.DOOR);
  b.inX = ix; b.inY = iy;
  frontPath(w, dx, dy, 'e');
  const [nx, ny] = doorOnFace(rng, b, 'n', x + 3);
  setStruct(w, nx, ny, S.DOOR);
  for (let t = x + 2; t < x + wd - 2; t += 3) { setStruct(w, t, y + ht - 1, S.WINDOW); }
  const ix0 = x + 1, iy0 = y + 1, ix1 = x + wd - 2, iy1 = y + ht - 2;
  // rows of cots either side of a central aisle
  for (let cx = ix0 + 1; cx <= ix1 - 2; cx += 2) {
    for (let cy = iy0; cy <= iy1; cy++) {
      if (Math.abs(cy - midY) <= 1) continue;
      if (cx === ix0 + 1 && cy === iy0) continue; // by the north door
      if (free(w, cx, cy)) placeFurn(w, cx, cy, 'cot');
    }
  }
  // property bins along the back wall, the node in the middle of the aisle
  for (const by of [midY - 1, midY + 1]) placeFurn(w, ix0, by, 'bin');
  placeFurn(w, ix1 - 1, iy0, 'bin');
  placeFurn(w, ix1 - 1, iy1, 'bin');
  b.node = [x + Math.floor(wd / 2), midY];
  placeFurn(w, b.node[0], b.node[1], 'node');
  w.depot = b.id;
  return b;
}

// KFDC: a cinder-block studio by the county radio mast. Dot's copper room is under it.
function makeStation(w, rng, x, y) {
  const wd = 8, ht = 7;
  yard(w, x - 2, y - 1, x + wd + 4, y + ht, G.LOT);
  const b = newBuilding(w, 'tower', x, y, wd, ht, 'KFDC Radio');
  shell(w, b, G.TILE, 5);
  const midY = y + 3;
  const [dx, dy, ix, iy] = doorOnFace(rng, b, 'w', midY);
  setStruct(w, dx, dy, S.DOOR);
  b.inX = ix; b.inY = iy;
  frontPath(w, dx, dy, 'w');
  setStruct(w, x + 3, y, S.WINDOW); setStruct(w, x + 3, y + ht - 1, S.WINDOW);
  const ix1 = x + wd - 2, iy0 = y + 1, iy1 = y + ht - 2;
  placeFurn(w, ix1, iy0, 'transmitter');
  placeFurn(w, ix1, iy0 + 1, 'computer');
  placeFurn(w, ix1 - 2, iy0, 'desk');
  placeFurn(w, x + 1, iy1, 'bed');
  placeFurn(w, x + 3, iy1, 'shelf');
  placeFurn(w, ix1, iy1, 'toolbox');
  // the jammer Theo built, still running by the door
  setStruct(w, x + 2, iy0, S.FURN);
  w.containers.set(idx(x + 2, iy0), { kind: 'jammer', table: 'none', items: [], charge: 100 });
  // the mast, out back
  const mx = x + wd + 2, my = midY;
  setStruct(w, mx, my, S.FURN);
  addContainer(w, mx, my, 'mast');
  w.mast = idx(mx, my);
  w.station = b.id;
  return b;
}
