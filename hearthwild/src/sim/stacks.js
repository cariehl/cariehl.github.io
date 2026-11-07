// Item stacks: the unit of inventory. { item, qty, mat?, fresh?, nut?, q? }.
// nut (per unit) is only present on meals, whose nutrition comes from their ingredients.
export function makeStack(defs, item, qty = 1, extra = {}) {
  const d = defs.must('item', item);
  const s = { item, qty };
  if (d.shelf) s.fresh = 1;
  if (d.hasMat && !extra.mat) s.mat = defaultMat(item);
  return Object.assign(s, extra);
}
const defaultMat = (item) => ({ log: 'pine', stone: 'granite', hide: 'hide', pelt: 'fur', leather: 'hide' }[item]);

export const stackKg = (defs, s) => defs.must('item', s.item).kg * s.qty;
export const invKg = (defs, inv) => inv.reduce((a, s) => a + stackKg(defs, s), 0);

export function sameKind(a, b) { return a.item === b.item && (a.mat || '') === (b.mat || '') && !a.nut === !b.nut; }

// Merge b into a (same kind). Freshness and meal nutrition become quantity-weighted averages.
export function mergeInto(a, b) {
  const n = a.qty + b.qty;
  if (a.fresh !== undefined) a.fresh = ((a.fresh ?? 1) * a.qty + (b.fresh ?? 1) * b.qty) / n;
  if (a.nut && b.nut) for (const k of Object.keys(a.nut)) a.nut[k] = (a.nut[k] * a.qty + b.nut[k] * b.qty) / n;
  if (a.q !== undefined || b.q !== undefined) a.q = ((a.q ?? 1) * a.qty + (b.q ?? 1) * b.qty) / n;
  a.qty = n;
  return a;
}

export function split(s, n) {
  n = Math.min(n, s.qty);
  const c = { ...s, qty: n }; if (s.nut) c.nut = { ...s.nut };
  s.qty -= n;
  return c;
}

export function addToInv(inv, s) {
  const m = inv.find(x => sameKind(x, s));
  if (m) mergeInto(m, s); else inv.push(s);
}

export function takeFromInv(inv, pred, n) {
  const out = [];
  for (let k = 0; k < inv.length && n > 0; k++) {
    const s = inv[k]; if (!pred(s)) continue;
    const c = split(s, n); n -= c.qty; out.push(c);
    if (s.qty <= 0) { inv.splice(k, 1); k--; }
  }
  return out;
}

export const countInv = (inv, pred) => inv.reduce((a, s) => a + (pred(s) ? s.qty : 0), 0);

// Nutrition of one unit: { kcal, p, f, c, w } in kcal and grams, plus digestibility.
export function unitNutrition(defs, s) {
  const d = defs.must('item', s.item);
  if (s.nut) return { ...s.nut, digest: d.digest ?? 0.95 };
  if (d.water) return { kcal: 0, p: 0, f: 0, c: 0, w: d.water * 1000, digest: 1 };
  if (!d.nut) return null;
  const g = d.kg * 1000 / 100;
  return { kcal: d.nut.kcal * g, p: d.nut.p * g, f: d.nut.f * g, c: d.nut.c * g, w: d.nut.w * g, digest: d.digest ?? 0.95 };
}

export function matches(defs, s, spec) {
  if (spec.item) return s.item === spec.item;
  return (defs.must('item', s.item).tags || []).includes(spec.tag);
}

export function describe(defs, s) {
  const d = defs.must('item', s.item);
  const mat = s.mat && d.hasMat ? defs.get('material', s.mat)?.name + ' ' : '';
  const name = s.qty === 1 ? d.name : (d.plural || d.name + 's');
  return `${s.qty} ${mat}${name}`;
}
