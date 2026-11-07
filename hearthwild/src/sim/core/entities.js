// Entity store. Entities are plain serializable objects { id, kind, i, ...components } where i is the hex
// index. A spatial index maps hexes to the entities standing on them.
export class Entities {
  constructor() { this.nextId = 1; this.map = new Map(); this.byTile = new Map(); this.byKind = new Map(); }
  add(e) {
    if (!e.id) e.id = this.nextId++; else this.nextId = Math.max(this.nextId, e.id + 1);
    this.map.set(e.id, e);
    if (!this.byKind.has(e.kind)) this.byKind.set(e.kind, new Set());
    this.byKind.get(e.kind).add(e);
    if (e.i >= 0) this._link(e, e.i);
    return e;
  }
  remove(e) {
    if (typeof e === 'number') e = this.map.get(e);
    if (!e || !this.map.has(e.id)) return;
    this.map.delete(e.id); this.byKind.get(e.kind)?.delete(e);
    if (e.i >= 0) this._unlink(e, e.i);
    e.dead = true;
  }
  get(id) { return this.map.get(id); }
  move(e, i) { if (e.i === i) return; if (e.i >= 0) this._unlink(e, e.i); e.i = i; if (i >= 0) this._link(e, i); }
  at(i) { return this.byTile.get(i) || EMPTY; }
  of(kind) { return this.byKind.get(kind) || EMPTY; }
  count(kind) { return this.byKind.get(kind)?.size || 0; }
  _link(e, i) { let s = this.byTile.get(i); if (!s) this.byTile.set(i, s = new Set()); s.add(e); }
  _unlink(e, i) { const s = this.byTile.get(i); if (s) { s.delete(e); if (!s.size) this.byTile.delete(i); } }
  toJSON() { return { nextId: this.nextId, list: [...this.map.values()] }; }
  static fromJSON(o) { const E = new Entities(); for (const e of o.list) E.add(e); E.nextId = o.nextId; return E; }
}
const EMPTY = new Set();
