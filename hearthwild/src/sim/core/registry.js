// The registry holds every content definition by kind and id. Definitions are plain objects from
// src/data. Each kind also gets a numeric index (for typed-array tile fields) and a tag lookup.
export class Registry {
  constructor() { this.kinds = new Map(); }
  add(kind, defs) {
    const k = { list: [], byId: new Map(), byTag: new Map() };
    this.kinds.set(kind, k);
    for (const d of defs) {
      if (!d.id) throw new Error(`${kind} definition without id`);
      if (k.byId.has(d.id)) throw new Error(`duplicate ${kind} id ${d.id}`);
      d.kind = kind; d.index = k.list.length + (kind === 'flora' || kind === 'structure' || kind === 'zone' ? 1 : 0);
      k.list.push(d); k.byId.set(d.id, d);
      for (const t of d.tags || []) { if (!k.byTag.has(t)) k.byTag.set(t, []); k.byTag.get(t).push(d); }
    }
    return this;
  }
  get(kind, id) { return this.kinds.get(kind)?.byId.get(id); }
  must(kind, id) { const d = this.get(kind, id); if (!d) throw new Error(`unknown ${kind} "${id}"`); return d; }
  all(kind) { return this.kinds.get(kind)?.list || []; }
  tagged(kind, tag) { return this.kinds.get(kind)?.byTag.get(tag) || []; }
  // Kinds whose index 0 means "none" store defs from index 1.
  at(kind, index) {
    const k = this.kinds.get(kind); if (!k) return undefined;
    const off = (kind === 'flora' || kind === 'structure' || kind === 'zone') ? 1 : 0;
    return k.list[index - off];
  }
  has(kind, id) { return !!this.get(kind, id); }
}
