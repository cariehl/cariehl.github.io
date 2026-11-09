// The three.js tabletop: ground, track, buildings, trains and townsfolk, kept in step with the World.
import * as THREE from 'three';
import { pieces, countEdges, edgesOf, DX, DZ, opp } from './track.js';
import { BUILDINGS } from './data.js';
import { glowUniform } from './art.js';

const RAIL_TOP = 3 / 16;
// Townsfolk are drawn a little smaller than the buildings' voxels, so they fit through the doors.
const FOLK_SCALE = 0.62;
const SKY_DAY = new THREE.Color('#bfe3f2'), SKY_NIGHT = new THREE.Color('#1d2747'), SKY_DUSK = new THREE.Color('#f2b38a');

export class View {
  constructor(canvas, art, world) {
    this.art = art;
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(30, 1, 0.1, 400);
    this.cam = { x: 12, z: 12, yaw: 0, yawTo: 0, pitch: 0.9, dist: 30 };

    this.hemi = new THREE.HemisphereLight('#ffffff', '#5a7a4a', 1.4);
    this.scene.add(this.hemi);
    this.sun = new THREE.DirectionalLight('#fff4dc', 2.2);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    this.sun.shadow.bias = -0.0005;
    this.sun.shadow.normalBias = 0.02;
    const sc = this.sun.shadow.camera;
    sc.left = -18; sc.right = 18; sc.top = 18; sc.bottom = -18; sc.near = 1; sc.far = 80;
    this.scene.add(this.sun, this.sun.target);

    this.layers = { track: new THREE.Group(), things: new THREE.Group(), folk: new THREE.Group(), ui: new THREE.Group() };
    for (const g of Object.values(this.layers)) this.scene.add(g);
    this.flips = new Set();       // every Flip that needs ticking
    this.bmap = new Map();        // building id -> Flip
    this.tmap = new Map();        // train id -> [Flip, Flip, Flip]
    this.pmap = new Map();        // person id -> Flip
    this.trackTiles = new Map();  // tile index -> { mask, sw, group }
    this.setWorld(world);
    this.makeCursor();
    this.resize();
  }

  setWorld(world) {
    this.world = world;
    for (const g of [this.layers.track, this.layers.things, this.layers.folk]) g.clear();
    this.flips.clear(); this.bmap.clear(); this.tmap.clear(); this.pmap.clear(); this.trackTiles.clear();
    if (this.ground) this.scene.remove(this.ground);
    this.ground = this.makeGround(world.size);
    this.scene.add(this.ground);
    this.cam.x = world.size / 2; this.cam.z = world.size / 2 + 1.5;
  }

  makeGround(N) {
    const g = new THREE.Group();
    // The baseboard: grass, one shade per tile so the grid reads without lines.
    const geo = new THREE.PlaneGeometry(N, N, N, N);
    geo.rotateX(-Math.PI / 2);
    geo.translate(N / 2, 0, N / 2);
    const plane = geo.toNonIndexed();
    const cols = [];
    const pos = plane.getAttribute('position');
    const a = new THREE.Color('#6cbf4f'), b = new THREE.Color('#67b84b');
    for (let i = 0; i < pos.count; i += 3) {
      const cx = (pos.getX(i) + pos.getX(i + 1) + pos.getX(i + 2)) / 3, cz = (pos.getZ(i) + pos.getZ(i + 1) + pos.getZ(i + 2)) / 3;
      const c = (Math.floor(cx) + Math.floor(cz)) % 2 ? a : b;
      for (let k = 0; k < 3; k++) cols.push(c.r, c.g, c.b);
    }
    plane.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
    const grass = new THREE.Mesh(plane, new THREE.MeshLambertMaterial({ vertexColors: true }));
    grass.receiveShadow = true;
    g.add(grass);
    // A wooden board edge and the table it sits on.
    const wood = new THREE.MeshLambertMaterial({ color: '#b07a48' });
    const edge = new THREE.Mesh(new THREE.BoxGeometry(N + 0.6, 0.5, N + 0.6), wood);
    edge.position.set(N / 2, -0.26, N / 2); edge.receiveShadow = true;
    g.add(edge);
    const table = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshLambertMaterial({ color: '#d9b98c' }));
    table.rotation.x = -Math.PI / 2; table.position.set(N / 2, -0.52, N / 2); table.receiveShadow = true;
    g.add(table);
    this.groundMesh = grass;
    return g;
  }

  makeCursor() {
    const geo = new THREE.PlaneGeometry(1, 1); geo.rotateX(-Math.PI / 2);
    this.cursor = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.35, depthWrite: false }));
    this.cursor.position.y = 0.01; this.cursor.visible = false; this.cursor.renderOrder = 2;
    this.scene.add(this.cursor);
    this.ghost = null; this.ghostKey = null;
  }
  // Show where the tool would act: a tile highlight, plus a see-through model for building tools.
  setCursor(tile, ok, model, rot) {
    if (!tile) { this.cursor.visible = false; if (this.ghost) this.ghost.mesh.visible = false; return; }
    this.cursor.visible = true;
    this.cursor.position.set(tile[0] + 0.5, 0.01, tile[1] + 0.5);
    this.cursor.material.color.set(ok ? '#ffffff' : '#ff5a4a');
    if (model !== this.ghostKey) {
      if (this.ghost) this.scene.remove(this.ghost.mesh);
      this.ghost = model ? this.art.make(model) : null;
      if (this.ghost) {
        this.ghost.mesh.material = this.ghost.mesh.material.clone();
        this.ghost.mesh.material.transparent = true; this.ghost.mesh.material.opacity = 0.6;
        this.ghost.mesh.castShadow = false;
        this.scene.add(this.ghost.mesh);
      }
      this.ghostKey = model;
    }
    if (this.ghost) {
      this.ghost.mesh.visible = true;
      this.ghost.mesh.position.set(tile[0] + 0.5, 0, tile[1] + 0.5);
      this.ghost.mesh.rotation.y = (rot || 0) * Math.PI / 2;
    }
  }

  resize() {
    const w = this.canvas.clientWidth || window.innerWidth, h = this.canvas.clientHeight || window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }
  // Ground tile under a screen point, or null.
  tileAt(clientX, clientY) {
    const p = this.groundPoint(clientX, clientY);
    if (!p) return null;
    const x = Math.floor(p.x), z = Math.floor(p.z);
    return this.world.inside(x, z) ? [x, z] : null;
  }
  groundPoint(clientX, clientY) {
    const r = this.canvas.getBoundingClientRect();
    const ndc = new THREE.Vector2(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
    const ray = new THREE.Raycaster(); ray.setFromCamera(ndc, this.camera);
    const hit = new THREE.Vector3();
    return ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), hit) ? hit : null;
  }
  // The thing under a screen point: { kind: 'person' | 'train' | 'building', id }.
  pick(clientX, clientY) {
    const r = this.canvas.getBoundingClientRect();
    const ndc = new THREE.Vector2(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
    const ray = new THREE.Raycaster(); ray.setFromCamera(ndc, this.camera);
    const meshes = [];
    for (const [id, f] of this.pmap) if (f.mesh.visible) meshes.push(Object.assign(f.mesh, { userData: { kind: 'person', id } }));
    for (const [id, fs] of this.tmap) for (const f of fs) meshes.push(Object.assign(f.mesh, { userData: { kind: 'train', id } }));
    for (const [id, f] of this.bmap) meshes.push(Object.assign(f.mesh, { userData: { kind: 'building', id } }));
    const hit = ray.intersectObjects(meshes, false)[0];
    return hit ? hit.object.userData : null;
  }
  screenOf(x, y, z) {
    const v = new THREE.Vector3(x, y, z).project(this.camera);
    const r = this.canvas.getBoundingClientRect();
    return { x: r.left + (v.x + 1) / 2 * r.width, y: r.top + (1 - v.y) / 2 * r.height, behind: v.z > 1 };
  }

  // ---------------------------------------------------------------- keeping up with the world
  syncTrack() {
    const w = this.world, N = w.size;
    for (let i = 0; i < N * N; i++) {
      const mask = w.track[i], sw = w.sw[i];
      const cur = this.trackTiles.get(i);
      if (cur && cur.mask === mask && cur.sw === sw) continue;
      if (cur) this.layers.track.remove(cur.group);
      if (!mask) { this.trackTiles.delete(i); continue; }
      const x = i % N, z = (i / N) | 0;
      const g = new THREE.Group();
      g.position.set(x + 0.5, 0, z + 0.5);
      for (const p of pieces(mask)) {
        const f = this.art.make(`track-${p.kind}`);
        f.mesh.rotation.y = p.rot * Math.PI / 2;
        f.mesh.castShadow = false;
        g.add(f.mesh);
      }
      if (countEdges(mask) === 3) g.add(this.switchFlag(mask, sw));
      this.layers.track.add(g);
      this.trackTiles.set(i, { mask, sw, group: g });
    }
  }
  // A little lever by a junction: green flag for straight on, orange for the turn.
  switchFlag(mask, sw) {
    const missing = [0, 1, 2, 3].find(e => !(mask & (1 << e)));
    const g = new THREE.Group();
    const post = new THREE.Mesh(new THREE.BoxGeometry(1 / 16, 6 / 16, 1 / 16), new THREE.MeshLambertMaterial({ color: '#3b3b44' }));
    post.position.y = 3 / 16;
    const flag = new THREE.Mesh(new THREE.BoxGeometry(3 / 16, 2 / 16, 1 / 32), new THREE.MeshLambertMaterial({ color: sw ? '#f08a3a' : '#4bc06a', emissive: sw ? '#5a2800' : '#0c3a18' }));
    flag.position.set(2 / 16, 5 / 16, 0);
    g.add(post, flag);
    // Stand it in the corner on the open side.
    const side = DX[missing] !== 0 ? [DX[missing] * 0.42, 0.42] : [0.42, DZ[missing] * 0.42];
    g.position.set(side[0], 0, side[1]);
    g.rotation.y = sw ? 0.6 : -0.6;
    return g;
  }
  add(f, layer) { this.layers[layer].add(f.mesh); this.flips.add(f); return f; }
  drop(f) { f.mesh.parent?.remove(f.mesh); this.flips.delete(f); }

  sync(dt) {
    const w = this.world;
    this.syncTrack();
    const night = w.night;
    // Buildings.
    for (const [id, f] of this.bmap) if (!w.buildings.has(id)) { this.drop(f); this.bmap.delete(id); }
    for (const b of w.buildings.values()) {
      let f = this.bmap.get(b.id);
      const def = BUILDINGS[b.type];
      if (!f) {
        f = this.add(this.art.make(def.model), 'things');
        f.mesh.position.set(b.x + 0.5, 0, b.z + 0.5);
        f.mesh.rotation.y = b.rot * Math.PI / 2;
        f.t = Math.random() * 3;
        f.pop = 0;
        this.bmap.set(b.id, f);
      }
      f.loop(night > 0.5 && def.night ? def.night : def.idle || null, b.type === 'windmill' && night > 0.5 ? 0.6 : 1);
      // A little bounce when it's placed.
      if (f.pop < 1) { f.pop = Math.min(1, f.pop + dt * 3); const s = 1 + Math.sin(f.pop * Math.PI) * 0.18; f.mesh.scale.set(s, 2 - s, s); }
    }
    // Trains.
    for (const [id, fs] of this.tmap) if (!w.trains.some(t => t.id === id)) { fs.forEach(f => this.drop(f)); this.tmap.delete(id); }
    for (const t of w.trains) {
      let fs = this.tmap.get(t.id);
      if (!fs) {
        fs = [this.add(this.art.make(`loco-${t.color}`), 'things'), this.add(this.art.make(`coach-${t.color}`), 'things'), this.add(this.art.make(`coach-${t.color}`), 'things')];
        this.tmap.set(t.id, fs);
      }
      fs.forEach((f, k) => {
        const p = w.vehiclePos(t, k);
        f.mesh.position.set(p.x, RAIL_TOP, p.z);
        // Ease round curves instead of snapping.
        const want = Math.atan2(p.dx, p.dz);
        let cur = f.mesh.rotation.y, d = want - cur;
        d = Math.atan2(Math.sin(d), Math.cos(d));
        f.mesh.rotation.y = Math.abs(d) > 1.2 ? want : cur + d * Math.min(1, dt * 14);
        if (k === 0) f.loop(t.speed > 0.05 ? 'Chuff' : 'Idle', 0.4 + t.speed / 1.7 * 0.8);
        else f.loop(night > 0.5 ? 'Lit' : null);
      });
    }
    // Townsfolk.
    for (const [id, f] of this.pmap) if (!w.people.some(p => p.id === id)) { this.drop(f); this.pmap.delete(id); }
    for (const p of w.people) {
      let f = this.pmap.get(p.id);
      const shown = p.state === 'walk' || p.state === 'wait';
      if (!f) {
        if (!shown) continue;
        f = this.add(this.art.make(`folk-${p.look}`), 'folk');
        f.mesh.scale.setScalar(FOLK_SCALE);
        this.pmap.set(p.id, f);
      }
      f.mesh.visible = shown;
      if (!shown) continue;
      f.mesh.position.set(p.x, 0.02, p.z);
      f.mesh.rotation.y = p.dir;
      if (p.anim) { f.play(p.anim); p.anim = null; }
      f.loop(p.state === 'walk' ? 'Walk' : null);
    }
    for (const f of this.flips) f.update(dt);
  }

  // ---------------------------------------------------------------- light and camera
  render(dt) {
    const w = this.world, c = this.cam;
    c.yaw += (c.yawTo - c.yaw) * Math.min(1, dt * 8);
    const cx = c.x + Math.sin(c.yaw) * Math.cos(c.pitch) * c.dist;
    const cz = c.z + Math.cos(c.yaw) * Math.cos(c.pitch) * c.dist;
    this.camera.position.set(cx, Math.sin(c.pitch) * c.dist, cz);
    this.camera.lookAt(c.x, 0, c.z);

    // The sun goes round once a day; at night a cool moon takes over.
    const night = w.night, t = w.dayFrac;
    const ang = (t - 0.25) * Math.PI * 2;
    const N = w.size;
    this.sun.position.set(N / 2 + Math.cos(ang) * 20, 10 + Math.max(0, Math.sin(ang)) * 22, N / 2 + 12);
    this.sun.target.position.set(N / 2, 0, N / 2);
    const dusk = Math.max(0, 1 - Math.abs(night - 0.5) * 2.5);
    this.sun.intensity = 2.2 * (1 - night) + 0.35 * night;
    this.sun.color.set('#fff4dc').lerp(new THREE.Color('#9fb3ff'), night).lerp(new THREE.Color('#ffb070'), dusk * 0.6);
    this.hemi.intensity = 1.4 * (1 - night) + 0.45 * night;
    const sky = SKY_DAY.clone().lerp(SKY_NIGHT, night).lerp(SKY_DUSK, dusk * 0.5);
    this.scene.background = sky;
    glowUniform.value = 0.15 + night * 1.6;
    this.renderer.render(this.scene, this.camera);
  }
}
