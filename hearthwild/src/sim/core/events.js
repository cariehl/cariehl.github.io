// A tiny synchronous event bus. Systems emit facts ("wound", "died", "built"); the gameplay layer and the
// UI subscribe. '*' receives everything.
export class Events {
  constructor() { this.h = new Map(); }
  on(type, fn) { if (!this.h.has(type)) this.h.set(type, new Set()); this.h.get(type).add(fn); return () => this.off(type, fn); }
  off(type, fn) { this.h.get(type)?.delete(fn); }
  emit(type, data = {}) {
    const a = this.h.get(type); if (a) for (const fn of a) fn(data, type);
    const b = this.h.get('*'); if (b) for (const fn of b) fn(data, type);
  }
}
