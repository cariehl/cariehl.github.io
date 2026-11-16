// Symmetric-enough recursive shadowcasting over the tile grid.
import { W, H, blocksSight } from './world.js';

// Calls mark(x, y) for every tile visible from (ox, oy) within radius r.
export function computeFov(w, ox, oy, r, mark) {
  mark(ox, oy);
  for (let oct = 0; oct < 8; oct++) cast(w, ox, oy, r, 1, 1.0, 0.0, MULT[0][oct], MULT[1][oct], MULT[2][oct], MULT[3][oct], mark);
}

const MULT = [
  [1, 0, 0, -1, -1, 0, 0, 1],
  [0, 1, -1, 0, 0, -1, 1, 0],
  [0, 1, 1, 0, 0, -1, -1, 0],
  [1, 0, 0, 1, -1, 0, 0, -1],
];

function cast(w, cx, cy, radius, row, start, end, xx, xy, yx, yy, mark) {
  if (start < end) return;
  const r2 = radius * radius;
  let newStart = 0;
  for (let j = row; j <= radius; j++) {
    let dx = -j - 1;
    const dy = -j;
    let blocked = false;
    while (dx <= 0) {
      dx++;
      const X = cx + dx * xx + dy * xy;
      const Y = cy + dx * yx + dy * yy;
      const lSlope = (dx - 0.5) / (dy + 0.5);
      const rSlope = (dx + 0.5) / (dy - 0.5);
      if (start < rSlope) continue;
      if (end > lSlope) break;
      const inside = X >= 0 && Y >= 0 && X < W && Y < H;
      if (inside && dx * dx + dy * dy <= r2) mark(X, Y);
      const opaque = blocksSight(w, X, Y);
      if (blocked) {
        if (opaque) { newStart = rSlope; continue; }
        blocked = false; start = newStart;
      } else if (opaque && j < radius) {
        blocked = true;
        cast(w, cx, cy, radius, j + 1, start, lSlope, xx, xy, yx, yy, mark);
        newStart = rSlope;
      }
    }
    if (blocked) break;
  }
}

// Line of sight between two points in tile space (centres), ignoring the end tiles.
export function lineOfSight(w, x0, y0, x1, y1) {
  const dx = x1 - x0, dy = y1 - y0;
  const steps = Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) * 2);
  const sx = Math.floor(x0), sy = Math.floor(y0), ex = Math.floor(x1), ey = Math.floor(y1);
  for (let k = 1; k < steps; k++) {
    const t = k / steps;
    const x = Math.floor(x0 + dx * t), y = Math.floor(y0 + dy * t);
    if ((x === sx && y === sy) || (x === ex && y === ey)) continue;
    if (blocksSight(w, x, y)) return false;
  }
  return true;
}
