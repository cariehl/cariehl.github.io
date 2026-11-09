// The town: track, buildings, trains and townsfolk. No DOM and no three.js, so it runs under Node.
// The view reads the state and drains world.events (sounds, animations, speech) every frame.
import { DX, DZ, opp, edgesOf, countEdges, makeSeg, reverseSeg, segPoint, chooseExit } from './track.js';
import { MAP, DAY, START_COINS, BUILDINGS, TRACK_COST, TRAIN_COST, TRAIN_COLORS, FOLK_LOOKS, FIRST_NAMES, LAST_NAMES, STREETS, SAY, MILESTONES } from './data.js';

const VEHICLES = 3;        // a locomotive and two coaches
const GAP = 1.1;           // tiles between vehicle centres
const TRAIN_LEN = GAP * (VEHICLES - 1);
const MAX_SPEED = 1.7;     // tiles per second
const STOP_TIME = 3;       // seconds at a platform
const CAPACITY = 8;
const WALK_SPEED = 1;
const WALK_NEAR = 5;       // trips this short are always walked
const STATION_REACH = 6;   // how far folk will walk to or from a station
const WALK_FAR = 22;       // trips longer than this aren't walked at all
const MAX_OUT = 60;        // townsfolk out and about at once

export function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

export class World {
  constructor(opts = {}) {
    this.size = opts.size || MAP;
    const n = this.size * this.size;
    this.track = new Uint8Array(n);     // edge bitmask per tile
    this.sw = new Uint8Array(n);        // switch state per tile
    this.occ = new Int32Array(n).fill(-1); // building id per tile
    this.buildings = new Map();
    this.trains = [];
    this.people = [];
    this.nextId = 1;
    this.coins = opts.coins ?? START_COINS;
    this.time = opts.time ?? DAY * 0.3; // seconds since the first midnight
    this.stats = { trackLaid: 0, riders: 0, switches: 0, fares: 0 };
    this.done = new Set();
    this.events = [];
    this.rand = rng(opts.seed || 1);
    this.comp = null;    // rail network component per tile, rebuilt when the track changes
    this.sandbox = !!opts.sandbox;
  }

  // ------------------------------------------------------------ basics
  inside(x, z) { return x >= 0 && z >= 0 && x < this.size && z < this.size; }
  i(x, z) { return z * this.size + x; }
  emit(type, data) { this.events.push(Object.assign({ type }, data)); }
  pick(list) { return list[Math.floor(this.rand() * list.length)]; }
  spend(n) {
    if (this.sandbox) return true;
    if (this.coins < n) { this.emit('broke', { need: n }); return false; }
    this.coins -= n;
    return true;
  }
  get dayFrac() { return (this.time / DAY) % 1; }
  get day() { return Math.floor(this.time / DAY) + 1; }
  // 0 by day, 1 at night, easing at dusk and dawn.
  get night() {
    const t = this.dayFrac;
    const ramp = (a, b) => Math.max(0, Math.min(1, (t - a) / (b - a)));
    return t < 0.25 ? 1 - ramp(0.2, 0.25) : ramp(0.75, 0.82);
  }
  buildingAt(x, z) { return this.inside(x, z) ? this.buildings.get(this.occ[this.i(x, z)]) : undefined; }

  // ------------------------------------------------------------ track
  canTrack(x, z) { return this.inside(x, z) && this.occ[this.i(x, z)] < 0; }
  // Join two neighbouring tiles with track. Returns true if anything changed.
  connect(ax, az, bx, bz) {
    const e = [0, 1, 2, 3].find(k => ax + DX[k] === bx && az + DZ[k] === bz);
    if (e === undefined || !this.canTrack(ax, az) || !this.canTrack(bx, bz)) return false;
    const ia = this.i(ax, az), ib = this.i(bx, bz);
    if ((this.track[ia] & (1 << e)) && (this.track[ib] & (1 << opp(e)))) return false;
    // Three ways into a tile at most, or a full four-way crossing.
    const na = this.track[ia] | (1 << e), nb = this.track[ib] | (1 << opp(e));
    const ok = m => countEdges(m) <= 3 || m === 15;
    if (!ok(na) || !ok(nb)) return false;
    if (!this.spend(TRACK_COST)) return false;
    this.track[ia] = na; this.track[ib] = nb;
    this.stats.trackLaid++;
    this.comp = null;
    this.emit('track', { x: bx, z: bz });
    return true;
  }
  removeTrack(x, z) {
    const i = this.i(x, z);
    if (!this.track[i]) return false;
    for (const e of edgesOf(this.track[i])) {
      const nx = x + DX[e], nz = z + DZ[e];
      if (this.inside(nx, nz)) this.track[this.i(nx, nz)] &= ~(1 << opp(e));
    }
    this.track[i] = 0; this.sw[i] = 0;
    this.comp = null;
    // Trains with any part on this tile come off the rails.
    for (const t of [...this.trains]) if (t.path.some(s => s.x === x && s.z === z)) this.removeTrain(t);
    return true;
  }
  isJunction(x, z) { const m = this.track[this.i(x, z)]; return countEdges(m) === 3; }
  toggleSwitch(x, z) {
    if (!this.inside(x, z) || !this.isJunction(x, z)) return false;
    this.sw[this.i(x, z)] ^= 1;
    this.stats.switches++;
    this.emit('switch', { x, z });
    return true;
  }
  // Connected pieces of rail, so folk only plan rides between stations on the same network.
  components() {
    if (this.comp) return this.comp;
    const comp = new Int32Array(this.track.length).fill(-1);
    let c = 0;
    for (let i = 0; i < comp.length; i++) {
      if (!this.track[i] || comp[i] >= 0) continue;
      const stack = [i]; comp[i] = c;
      while (stack.length) {
        const j = stack.pop(), x = j % this.size, z = (j / this.size) | 0;
        for (const e of edgesOf(this.track[j])) {
          const nx = x + DX[e], nz = z + DZ[e];
          if (!this.inside(nx, nz)) continue;
          const k = this.i(nx, nz);
          if (comp[k] < 0 && (this.track[k] & (1 << opp(e)))) { comp[k] = c; stack.push(k); }
        }
      }
      c++;
    }
    return (this.comp = comp);
  }

  // ------------------------------------------------------------ buildings
  canPlace(type, x, z) {
    if (!BUILDINGS[type] || !this.inside(x, z)) return false;
    const i = this.i(x, z);
    if (this.occ[i] >= 0 || this.track[i]) return false;
    if (type === 'station') return this.stopTilesAt(x, z).length > 0;
    return true;
  }
  stopTilesAt(x, z) {
    const out = [];
    for (let e = 0; e < 4; e++) {
      const nx = x + DX[e], nz = z + DZ[e];
      if (this.inside(nx, nz) && this.track[this.i(nx, nz)]) out.push({ x: nx, z: nz, e });
    }
    return out;
  }
  place(type, x, z, rot = 0, free = false) {
    if (!this.canPlace(type, x, z)) return null;
    const def = BUILDINGS[type];
    if (!free && !this.spend(def.cost)) return null;
    // A station turns its platform to the track.
    if (type === 'station') rot = [2, 1, 0, 3][this.stopTilesAt(x, z)[0].e];
    const b = { id: this.nextId++, type, x, z, rot: rot & 3, residents: [], street: `${1 + Math.floor(this.rand() * 40)} ${this.pick(STREETS)}` };
    this.buildings.set(b.id, b);
    this.occ[this.i(x, z)] = b.id;
    if (def.kind === 'home') for (let k = 0; k < def.residents; k++) this.addPerson(b);
    this.emit('place', { id: b.id, x, z, building: type });
    return b;
  }
  remove(x, z) {
    if (!this.inside(x, z)) return false;
    const b = this.buildingAt(x, z);
    if (b) {
      const def = BUILDINGS[b.type];
      this.buildings.delete(b.id);
      this.occ[this.i(x, z)] = -1;
      if (!this.sandbox) this.coins += Math.floor(def.cost / 2);
      // The residents move away; anyone heading there goes home.
      for (const p of [...this.people]) {
        if (p.home === b.id) this.removePerson(p);
        else if (p.dest === b.id || p.fromStation === b.id || p.toStation === b.id) this.goHome(p);
      }
      this.emit('remove', { x, z, id: b.id });
      return true;
    }
    if (this.removeTrack(x, z)) { if (!this.sandbox) this.coins += 1; this.emit('remove', { x, z }); return true; }
    return false;
  }
  stations() { return [...this.buildings.values()].filter(b => b.type === 'station'); }
  stationAtStop(x, z) {
    for (let e = 0; e < 4; e++) {
      const b = this.buildingAt(x + DX[e], z + DZ[e]);
      if (b && b.type === 'station') return b;
    }
    return null;
  }

  // ------------------------------------------------------------ trains
  // Puts a train with its locomotive in the middle of tile (x, z), coaches trailing back along the track.
  addTrain(x, z, color, free = false) {
    if (!this.inside(x, z)) return null;
    const mask = this.track[this.i(x, z)];
    const es = edgesOf(mask);
    if (es.length < 2) { this.emit('nope', { why: 'Put trains on a piece of track that goes somewhere.' }); return null; }
    for (const t of this.trains) if (t.path.some(s => s.x === x && s.z === z)) { this.emit('nope', { why: 'There is already a train there.' }); return null; }
    // Head toward b, and walk back from a far enough to fit the coaches.
    const a = es[0], b = chooseExit(mask, a, this.sw[this.i(x, z)]);
    const path = [makeSeg(x, z, a, b)];
    let len = 0, cx = x, cz = z, entry = a;
    while (len < TRAIN_LEN + 0.6) {
      const px = cx + DX[entry], pz = cz + DZ[entry];
      if (!this.inside(px, pz)) break;
      const pm = this.track[this.i(px, pz)];
      if (!(pm & (1 << opp(entry)))) break;
      const back = edgesOf(pm).filter(e => e !== opp(entry));
      if (!back.length) break;
      const from = back.includes(entry) ? entry : back[0];
      const seg = makeSeg(px, pz, from, opp(entry));
      path.unshift(seg); len += seg.len;
      cx = px; cz = pz; entry = from;
    }
    if (len < TRAIN_LEN) { this.emit('nope', { why: 'Not enough track behind that spot for the coaches.' }); return null; }
    if (!free && !this.spend(TRAIN_COST)) return null;
    const t = {
      id: this.nextId++, color: color || TRAIN_COLORS[this.trains.length % TRAIN_COLORS.length],
      path, head: path[path.length - 1].len / 2, speed: 0, state: 'run', timer: 0, reversed: false,
      riders: [], stoppedAt: null, wait: 0, odo: 0,
    };
    this.trains.push(t);
    this.emit('train', { id: t.id });
    return t;
  }
  removeTrain(t) {
    this.trains = this.trains.filter(o => o !== t);
    // Riders hop off where they are and walk home.
    for (const p of t.riders) {
      const pos = this.vehiclePos(t, 0);
      p.x = pos.x; p.z = pos.z; p.state = 'walk'; p.train = null;
      this.goHome(p);
    }
    t.riders = [];
    this.emit('derail', { id: t.id });
  }
  // Position of vehicle k (0 is the locomotive), and the way it faces.
  vehiclePos(t, k) {
    const back = (t.reversed ? VEHICLES - 1 - k : k) * GAP;
    let i = t.path.length - 1, s = t.head - back;
    while (s < 0 && i > 0) { i--; s += t.path[i].len; }
    const p = segPoint(t.path[i], Math.max(0, s));
    if (t.reversed) { p.dx = -p.dx; p.dz = -p.dz; }
    return p;
  }
  headPos(t) { const s = t.path[t.path.length - 1]; return segPoint(s, t.head); }
  // Turn the train round at a dead end: the last coach leads and the engine pushes.
  reverse(t) {
    const total = t.path.reduce((a, s) => a + s.len, 0);
    const headAt = total - t.path[t.path.length - 1].len + t.head;
    const tailAt = headAt - TRAIN_LEN;
    const rev = t.path.map(reverseSeg).reverse();
    let u = total - tailAt, acc = 0, i = 0;
    while (i < rev.length - 1 && acc + rev[i].len < u) { acc += rev[i].len; i++; }
    t.path = rev.slice(0, i + 1);
    t.head = Math.min(rev[i].len, u - acc);
    t.reversed = !t.reversed;
    t.stoppedAt = null;
    this.emit('reverse', { id: t.id });
  }
  nextSeg(t) {
    const last = t.path[t.path.length - 1];
    if (last.b < 0) return null;
    const nx = last.x + DX[last.b], nz = last.z + DZ[last.b];
    if (!this.inside(nx, nz)) return null;
    const mask = this.track[this.i(nx, nz)], entry = opp(last.b);
    if (!(mask & (1 << entry))) return null;
    return makeSeg(nx, nz, entry, chooseExit(mask, entry, this.sw[this.i(nx, nz)]));
  }
  blocked(t) {
    const h = this.headPos(t);
    const fx = h.x + h.dx * 0.7, fz = h.z + h.dz * 0.7;
    for (const o of this.trains) {
      if (o === t) continue;
      for (let k = 0; k < VEHICLES; k++) {
        const p = this.vehiclePos(o, k);
        if (Math.hypot(p.x - fx, p.z - fz) < 0.75) return true;
      }
    }
    return false;
  }
  updateTrain(t, dt) {
    if (t.state === 'stop') {
      t.timer -= dt;
      if (t.timer <= 0) { t.state = 'run'; this.emit('depart', { id: t.id }); }
      return;
    }
    if (this.blocked(t)) {
      t.speed = 0; t.wait += dt;
      if (t.wait > 4) { t.wait = 0; this.reverse(t); }
      return;
    }
    t.wait = 0;
    t.speed = Math.min(MAX_SPEED, t.speed + dt * 1.2);
    let move = t.speed * dt;
    while (move > 0) {
      const seg = t.path[t.path.length - 1];
      // Stop at the middle of a tile beside a station.
      const mid = seg.len / 2;
      if (seg.a >= 0 && seg.b >= 0 && t.head < mid && t.head + move >= mid && t.stoppedAt !== seg) {
        const st = this.stationAtStop(seg.x, seg.z);
        if (st) {
          t.odo += mid - t.head; t.head = mid; t.stoppedAt = seg;
          this.arrive(t, st);
          return;
        }
      }
      const room = seg.len - t.head;
      if (move < room) { t.head += move; t.odo += move; break; }
      move -= room; t.odo += room;
      const next = this.nextSeg(t);
      if (!next) { t.head = seg.len; t.speed = 0; this.reverse(t); t.state = 'stop'; t.timer = 0.8; break; }
      t.path.push(next);
      t.head = 0;
      // Keep only as much track behind as the coaches need.
      let behind = 0;
      for (let i = t.path.length - 2; i >= 0; i--) {
        behind += t.path[i].len;
        if (behind > TRAIN_LEN + 1) { t.path.splice(0, i); break; }
      }
    }
  }
  arrive(t, st) {
    t.state = 'stop'; t.timer = STOP_TIME; t.speed = 0;
    this.emit('arrive', { id: t.id, station: st.id });
    // Off first.
    for (const p of [...t.riders]) {
      p.rideStops++;
      if (p.toStation === st.id || p.rideStops > 14) {
        t.riders.splice(t.riders.indexOf(p), 1);
        p.train = null;
        p.x = st.x + 0.5 + (this.rand() - 0.5) * 0.5; p.z = st.z + 0.5 + (this.rand() - 0.5) * 0.5;
        if (p.toStation === st.id) {
          const from = this.buildings.get(p.fromStation) || st;
          const fare = 4 + Math.round((Math.abs(from.x - st.x) + Math.abs(from.z - st.z)) / 2);
          if (!this.sandbox) this.coins += fare;
          this.stats.riders++; this.stats.fares += fare;
          this.emit('fare', { person: p.id, fare, x: p.x, z: p.z });
          this.say(p, this.pick(SAY.fare), 2.5);
          p.anim = 'Cheer';
        }
        p.fromStation = p.toStation = null;
        this.walkTo(p, p.dest);
      }
    }
    // Then on.
    for (const p of this.people) {
      if (t.riders.length >= CAPACITY) break;
      if (p.state === 'wait' && p.fromStation === st.id) {
        p.state = 'ride'; p.train = t.id; p.rideStops = 0;
        t.riders.push(p);
        this.emit('board', { person: p.id, train: t.id });
      }
    }
  }

  // ------------------------------------------------------------ townsfolk
  addPerson(home) {
    const p = {
      id: this.nextId++, name: `${this.pick(FIRST_NAMES)} ${this.pick(LAST_NAMES)}`, look: this.pick(FOLK_LOOKS),
      home: home.id, state: 'home', timer: 3 + this.rand() * 12, x: home.x + 0.5, z: home.z + 0.5,
      dir: 0, path: [], dest: null, fromStation: null, toStation: null, train: null, rideStops: 0,
      say: null, sayT: 0, anim: null, offset: [(this.rand() - 0.5) * 0.4, (this.rand() - 0.5) * 0.4], trips: 0,
    };
    home.residents.push(p.id);
    this.people.push(p);
    return p;
  }
  removePerson(p) {
    this.people = this.people.filter(o => o !== p);
    for (const t of this.trains) t.riders = t.riders.filter(o => o !== p);
    const h = this.buildings.get(p.home);
    if (h) h.residents = h.residents.filter(id => id !== p.id);
  }
  say(p, text, t = 3) { p.say = text; p.sayT = t; this.emit('say', { person: p.id, text }); }
  walkable(x, z) {
    if (!this.inside(x, z)) return false;
    const b = this.buildingAt(x, z);
    return !b || !!BUILDINGS[b.type].walk;
  }
  // Breadth-first path over tiles, from (sx, sz) to the tile of building `to`. Returns tiles or null.
  findPath(sx, sz, tx, tz, limit = 60) {
    const N = this.size, start = this.i(sx, sz), goal = this.i(tx, tz);
    if (start === goal) return [];
    const prev = new Int32Array(N * N).fill(-1);
    const dist = new Int16Array(N * N).fill(-1);
    const q = [start]; dist[start] = 0;
    for (let h = 0; h < q.length; h++) {
      const j = q[h];
      if (dist[j] >= limit) continue;
      const x = j % N, z = (j / N) | 0;
      for (let e = 0; e < 4; e++) {
        const nx = x + DX[e], nz = z + DZ[e];
        if (!this.inside(nx, nz)) continue;
        const k = this.i(nx, nz);
        if (dist[k] >= 0) continue;
        if (k !== goal && !this.walkable(nx, nz)) continue;
        dist[k] = dist[j] + 1; prev[k] = j;
        if (k === goal) {
          const out = [];
          for (let c = goal; c !== start; c = prev[c]) out.push([c % N, (c / N) | 0]);
          return out.reverse();
        }
        q.push(k);
      }
    }
    return null;
  }
  tileOf(p) { return [Math.max(0, Math.min(this.size - 1, Math.floor(p.x))), Math.max(0, Math.min(this.size - 1, Math.floor(p.z)))]; }
  walkTo(p, id) {
    const b = this.buildings.get(id);
    if (!b) { this.goHome(p); return false; }
    const [sx, sz] = this.tileOf(p);
    const path = this.findPath(sx, sz, b.x, b.z, 80);
    if (!path) return false;
    p.path = path; p.target = id; p.state = 'walk';
    return true;
  }
  goHome(p) {
    p.dest = p.home; p.fromStation = p.toStation = null; p.train = null;
    if (!this.buildings.get(p.home)) { this.removePerson(p); return; }
    if (!this.planTrip(p, p.home)) { const h = this.buildings.get(p.home); p.x = h.x + 0.5; p.z = h.z + 0.5; this.enter(p, h); }
  }
  // Decide how to get from where p is to building `id`: walk, or walk to a station and ride.
  planTrip(p, id) {
    const b = this.buildings.get(id);
    if (!b) return false;
    p.dest = id;
    const [sx, sz] = this.tileOf(p);
    const walk = this.findPath(sx, sz, b.x, b.z, 80);
    if (walk && walk.length <= WALK_NEAR) { p.path = walk; p.target = id; p.state = 'walk'; return true; }
    // Nearest station on foot from here, and nearest to the destination, on the same rails.
    const comp = this.components();
    const near = (x, z) => this.stations().map(s => {
      const path = this.findPath(x, z, s.x, s.z, STATION_REACH);
      return path && path.length <= STATION_REACH ? { s, path, d: path.length } : null;
    }).filter(Boolean).sort((a, c) => a.d - c.d);
    const nets = s => new Set(this.stopTilesAt(s.x, s.z).map(t => comp[this.i(t.x, t.z)]));
    const froms = near(sx, sz), tos = near(b.x, b.z);
    for (const f of froms) for (const t of tos) {
      if (f.s === t.s) continue;
      const nf = nets(f.s);
      if (![...nets(t.s)].some(c => nf.has(c))) continue;
      // Only ride if it beats walking.
      if (walk && walk.length <= f.d + t.d + 2) break;
      p.fromStation = f.s.id; p.toStation = t.s.id;
      p.path = f.path; p.target = f.s.id; p.state = 'walk';
      return true;
    }
    if (walk && walk.length <= WALK_FAR) {
      p.path = walk; p.target = id; p.state = 'walk';
      if (walk.length > 12) this.say(p, this.pick(SAY.longWalk));
      return true;
    }
    return false;
  }
  enter(p, b) {
    p.path = []; p.state = b.id === p.home ? 'home' : 'visit';
    p.timer = p.state === 'home' ? 12 + this.rand() * 30 : 5 + this.rand() * 7;
    p.x = b.x + 0.5; p.z = b.z + 0.5;
    if (p.state === 'visit') this.emit('visit', { person: p.id, building: b.id });
  }
  destinations() { return [...this.buildings.values()].filter(b => BUILDINGS[b.type].kind === 'place'); }
  updatePerson(p, dt) {
    if (p.sayT > 0) { p.sayT -= dt; if (p.sayT <= 0) p.say = null; }
    if (p.state === 'home') {
      p.timer -= dt * (this.night > 0.5 ? 0.25 : 1);
      if (p.timer > 0) return;
      const out = this.people.filter(o => o.state !== 'home' && o.state !== 'visit').length;
      const places = this.destinations();
      const homes = [...this.buildings.values()].filter(b => BUILDINGS[b.type].kind === 'home' && b.id !== p.home);
      const choices = places.length ? (this.rand() < 0.75 || !homes.length ? places : homes) : homes;
      if (out >= MAX_OUT || !choices.length) { p.timer = 10; return; }
      const dest = this.pick(choices);
      const home = this.buildings.get(p.home);
      p.x = home.x + 0.5; p.z = home.z + 0.5;
      if (!this.planTrip(p, dest.id)) {
        p.timer = 20 + this.rand() * 20;
        p.state = 'home';
        home.unhappy = (home.unhappy || 0) + 1;
        this.emit('noRoute', { building: home.id, person: p.id, text: this.pick(SAY.noRoute) });
        return;
      }
      home.unhappy = 0;
      p.trips++;
      this.emit('leave', { person: p.id, building: home.id });
      return;
    }
    if (p.state === 'visit') {
      p.timer -= dt;
      if (p.timer <= 0) { this.goHome(p); if (p.state === 'walk') this.emit('leave', { person: p.id }); }
      return;
    }
    if (p.state === 'wait') {
      p.timer += dt;
      if (p.timer > 50) {
        // Gave up on the train.
        this.say(p, 'I\'ll walk!');
        p.fromStation = p.toStation = null;
        const dest = this.buildings.get(p.dest);
        if (!dest || !this.walkTo(p, p.dest)) this.goHome(p);
      } else if (!p.say && this.rand() < dt * 0.02) this.say(p, this.pick(SAY.waiting));
      return;
    }
    if (p.state === 'ride') return;
    if (p.state === 'walk') {
      if (!p.path.length) { this.arriveAt(p); return; }
      const [tx, tz] = p.path[0];
      const last = p.path.length === 1;
      const gx = tx + 0.5 + (last ? 0 : p.offset[0]), gz = tz + 0.5 + (last ? 0 : p.offset[1]);
      const dx = gx - p.x, dz = gz - p.z, d = Math.hypot(dx, dz);
      const step = WALK_SPEED * dt;
      if (d > 0.001) p.dir = Math.atan2(dx, dz);
      if (d <= step) {
        p.x = gx; p.z = gz; p.path.shift();
        // The way ahead got built over: find another.
        if (p.path.length > 1 && !this.walkable(p.path[0][0], p.path[0][1])) {
          if (!this.walkTo(p, p.target)) this.goHome(p);
        }
      } else { p.x += dx / d * step; p.z += dz / d * step; }
    }
  }
  arriveAt(p) {
    const b = this.buildings.get(p.target);
    if (!b) { this.goHome(p); return; }
    if (b.type === 'station' && p.fromStation === b.id) {
      p.state = 'wait'; p.timer = 0;
      const n = this.people.filter(o => o.state === 'wait' && o.fromStation === b.id).length;
      const a = n * 2.4;
      p.x = b.x + 0.5 + Math.cos(a) * 0.28; p.z = b.z + 0.5 + Math.sin(a) * 0.28;
      p.dir = [Math.PI, Math.PI / 2, 0, -Math.PI / 2][b.rot] + Math.PI;
      return;
    }
    this.enter(p, b);
  }

  // ------------------------------------------------------------ the clock
  statsNow() {
    const bs = [...this.buildings.values()];
    return Object.assign({}, this.stats, {
      trains: this.trains.length,
      stations: bs.filter(b => b.type === 'station').length,
      homes: bs.filter(b => BUILDINGS[b.type].kind === 'home').length,
      mills: bs.filter(b => b.type === 'windmill').length,
      lamps: bs.filter(b => b.type === 'lamp').length,
      population: this.people.length,
    });
  }
  checkMilestones() {
    const s = this.statsNow();
    for (const m of MILESTONES) {
      if (this.done.has(m.id) || !m.test(s)) continue;
      this.done.add(m.id);
      if (!this.sandbox) this.coins += m.reward;
      this.emit('milestone', { id: m.id, title: m.title, reward: m.reward });
    }
  }
  update(dt) {
    const wasNight = this.night > 0.5;
    this.time += dt;
    if ((this.night > 0.5) !== wasNight) this.emit(wasNight ? 'dawn' : 'dusk', {});
    for (const t of this.trains) this.updateTrain(t, dt);
    for (const p of [...this.people]) this.updatePerson(p, dt);
    this.msT = (this.msT || 0) + dt;
    if (this.msT > 0.5) { this.msT = 0; this.checkMilestones(); }
  }

  // ------------------------------------------------------------ saving
  serialize() {
    return {
      v: 1, size: this.size, coins: this.coins, time: Math.round(this.time), sandbox: this.sandbox,
      stats: this.stats, done: [...this.done],
      track: Array.from(this.track), sw: Array.from(this.sw),
      buildings: [...this.buildings.values()].map(b => [b.type, b.x, b.z, b.rot, b.residents.length]),
      trains: this.trains.map(t => { const s = t.path[t.path.length - 1]; return [s.x, s.z, t.color]; }),
    };
  }
  static load(data) {
    const w = new World({ size: data.size, coins: data.coins, time: data.time, sandbox: data.sandbox, seed: (data.time | 0) + 7 });
    const n = w.size * w.size;
    if (Array.isArray(data.track) && data.track.length === n) {
      for (let i = 0; i < n; i++) { w.track[i] = data.track[i] & 15; w.sw[i] = (data.sw && data.sw[i]) & 1; }
    }
    Object.assign(w.stats, data.stats || {});
    for (const id of data.done || []) w.done.add(id);
    for (const [type, x, z, rot] of data.buildings || []) {
      if (BUILDINGS[type] && w.inside(x, z) && !w.track[w.i(x, z)]) w.place(type, x, z, rot, true);
    }
    for (const [x, z, color] of data.trains || []) w.addTrain(x, z, TRAIN_COLORS.includes(color) ? color : undefined, true);
    w.events = [];
    return w;
  }
}

// The town you start with: a loop of track between two stations, a few homes on one side and
// the bakery and park on the other, so the first train has someone to carry.
export function starterTown(seed = 1) {
  const w = new World({ seed, coins: START_COINS });
  const loop = (x0, z0, x1, z1) => {
    for (let x = x0; x < x1; x++) { w.connect(x, z0, x + 1, z0); w.connect(x, z1, x + 1, z1); }
    for (let z = z0; z < z1; z++) { w.connect(x0, z, x0, z + 1); w.connect(x1, z, x1, z + 1); }
  };
  w.sandbox = true;
  loop(5, 8, 18, 15);
  w.place('station', 7, 7, 0, true);
  w.place('station', 16, 16, 0, true);
  for (const [t, x, z, r] of [
    ['house', 4, 4, 0], ['cottage', 6, 4, 0], ['house', 8, 4, 0], ['house', 3, 6, 1], ['lamp', 6, 6, 0], ['lamp', 9, 6, 0],
    ['bakery', 14, 18, 0], ['park', 18, 18, 0], ['toyshop', 12, 18, 0], ['lamp', 15, 17, 0],
    ['watertower', 19, 11, 3], ['tree', 2, 2, 0], ['pine', 3, 2, 0], ['tree', 11, 3, 0], ['pine', 21, 4, 0], ['tree', 20, 5, 0],
    ['pine', 2, 20, 0], ['tree', 4, 21, 0], ['tree', 9, 11, 0], ['pine', 13, 12, 0], ['tree', 11, 11, 0], ['park', 10, 12, 0],
    ['tree', 21, 21, 0], ['pine', 22, 19, 0], ['tree', 1, 12, 0],
  ]) w.place(t, x, z, r, true);
  w.addTrain(11, 8, 'red', true);
  w.sandbox = false;
  w.stats.trackLaid = 0;
  // The starter railway already has a station and a train; those milestones come with it.
  w.done = new Set(['station', 'train']);
  w.events = [];
  return w;
}
