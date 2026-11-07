// Pointy-top hex math in axial coordinates (q, r). The world stores hexes in "odd-r" offset rows; these
// helpers convert between the two and project to the plane.
export const DIRS = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]]; // E, NE, NW, W, SW, SE
export const SQRT3 = Math.sqrt(3);

export const offsetToAxial = (col, row) => [col - ((row - (row & 1)) >> 1), row];
export const axialToOffset = (q, r) => [q + ((r - (r & 1)) >> 1), r];

export function distance(aq, ar, bq, br) {
  const dq = aq - bq, dr = ar - br;
  return (Math.abs(dq) + Math.abs(dr) + Math.abs(dq + dr)) / 2;
}

export function toPlane(q, r, size = 1) { return [size * SQRT3 * (q + r / 2), size * 1.5 * r]; }

export function round(fq, fr) {
  const fs = -fq - fr;
  let q = Math.round(fq), r = Math.round(fr), s = Math.round(fs);
  const dq = Math.abs(q - fq), dr = Math.abs(r - fr), ds = Math.abs(s - fs);
  if (dq > dr && dq > ds) q = -r - s; else if (dr > ds) r = -q - s;
  return [q, r];
}

export function fromPlane(x, y, size = 1) {
  const q = (SQRT3 / 3 * x - y / 3) / size, r = (2 / 3 * y) / size;
  return round(q, r);
}

// All axial coordinates within radius n of (q, r), inclusive.
export function spiral(q, r, n) {
  const out = [];
  for (let dq = -n; dq <= n; dq++) {
    const lo = Math.max(-n, -dq - n), hi = Math.min(n, -dq + n);
    for (let dr = lo; dr <= hi; dr++) out.push([q + dq, r + dr]);
  }
  return out;
}

// Hexes on the straight line between two hexes (inclusive).
export function line(aq, ar, bq, br) {
  const n = distance(aq, ar, bq, br), out = [];
  for (let k = 0; k <= n; k++) {
    const t = n === 0 ? 0 : k / n;
    out.push(round(aq + (bq - aq) * t + 1e-6, ar + (br - ar) * t + 1e-6));
  }
  return out;
}
