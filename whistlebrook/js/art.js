// Loads the Voxel Studio models in assets/ and plays their clips the way the editor does: each frame
// is a whole voxel grid, so playing a clip just swaps which mesh is shown.
import * as THREE from 'three';
import { readProject, meshGrid } from './voxels.js';

// The colours that shine at night (the glow and lamp swatches in tools/build-art.cjs).
const GLOW = ['#ffd75a', '#fff2b0'];

// One material for every voxel: vertex colours, plus an emissive boost on glowing voxels that the
// day-night cycle turns up after dark.
export const glowUniform = { value: 0.2 };
export function voxelMaterial() {
  const m = new THREE.MeshLambertMaterial({ vertexColors: true });
  m.onBeforeCompile = sh => {
    sh.uniforms.uGlow = glowUniform;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float glow;\nvarying float vGlowV;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvGlowV = glow;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uGlow;\nvarying float vGlowV;')
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += vColor.rgb * vGlowV * uGlow;');
  };
  return m;
}

function geometryOf(mesh) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(mesh.pos, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(mesh.nrm, 3));
  g.setAttribute('color', new THREE.BufferAttribute(mesh.col, 3));
  g.setAttribute('glow', new THREE.BufferAttribute(mesh.glow, 1));
  g.setIndex(new THREE.BufferAttribute(mesh.idx, 1));
  g.computeBoundingSphere();
  return g;
}
function gridKey(grid) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < grid.length; i++) { h ^= grid[i]; h = Math.imul(h, 16777619); }
  return h + ':' + grid.length;
}

export class Art {
  constructor() { this.models = new Map(); this.material = voxelMaterial(); }
  async load(names, base = 'assets/', onProgress) {
    let done = 0;
    await Promise.all(names.map(async name => {
      const res = await fetch(`${base}${name}.voxel.json`);
      if (!res.ok) throw new Error(`Could not load ${name}.voxel.json`);
      this.add(name, await res.json());
      if (onProgress) onProgress(++done / names.length);
    }));
  }
  add(name, data) {
    const doc = readProject(data);
    const glow = new Set(GLOW.map(h => doc.palette.findIndex(p => p && p.toLowerCase() === h)).filter(i => i > 0));
    const cache = new Map();
    const geo = grid => {
      const k = gridKey(grid);
      if (!cache.has(k)) cache.set(k, geometryOf(meshGrid(grid, doc.size, doc.palette, { glow })));
      return cache.get(k);
    };
    const model = { name, size: doc.size, base: geo(doc.model), clips: {} };
    for (const c of doc.clips) if (c.frames.length) model.clips[c.name] = { fps: c.fps, frames: c.frames.map(geo) };
    this.models.set(name, model);
  }
  has(name) { return this.models.has(name); }
  // A mesh that can play this model's clips.
  make(name) { return new Flip(this.models.get(name), this.material); }
}

// One placed model. loop(name) sets the clip that plays when nothing else does (null for the rest
// model); play(name) plays a clip once over it, then goes back.
export class Flip {
  constructor(model, material) {
    this.model = model;
    this.mesh = new THREE.Mesh(model.base, material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.base = null; this.once = null; this.t = 0; this.speed = 1;
  }
  hasClip(name) { return !!(name && this.model.clips[name]); }
  loop(name, speed = 1) {
    if (name && !this.model.clips[name]) name = null;
    this.speed = speed;
    if (name === this.base) return;
    this.base = name;
    if (!this.once) { this.t = 0; this.show(); }
  }
  play(name, onDone) {
    if (!this.model.clips[name]) return false;
    this.once = { name, onDone }; this.t = 0; this.show();
    return true;
  }
  update(dt) {
    this.t += dt * this.speed;
    if (this.once) {
      const c = this.model.clips[this.once.name];
      if (this.t >= c.frames.length / c.fps) {
        const done = this.once.onDone;
        this.once = null; this.t = 0;
        if (done) done();
      }
    }
    this.show();
  }
  show() {
    const name = this.once ? this.once.name : this.base;
    const c = name && this.model.clips[name];
    const g = c ? c.frames[Math.floor(this.t * c.fps) % c.frames.length] : this.model.base;
    if (this.mesh.geometry !== g) this.mesh.geometry = g;
  }
}
