// Voxel Studio: the starter project, a small adventurer with a rig, a walk and a wave, and a blink
// drawn frame by frame. Built in code so it always matches the current file format.
(function (root) {
'use strict';
const node = typeof module === 'object' && module.exports;
const G = node ? require('./grid.js') : root.VXGrid;
const R = node ? require('./rig.js') : root.VXRig;

// Palette indices (see DEFAULT_PALETTE in grid.js).
const C = { eye: 1, pants: 2, boot: 6, hair: 7, belt: 26, buckle: 9, shirt: 20, shirtDark: 19, skin: 28, cheek: 14, mouth: 11 };

function demoProject() {
  const size = [20, 24, 12];
  const doc = G.newProject(size, 'Adventurer');
  const m = doc.model, skin = doc.rig.skin;
  const box = (x0, x1, y0, y1, z0, z1, col, bone) => {
    for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++) for (let x = x0; x <= x1; x++) {
      const i = G.idx(size, x, y, z);
      m[i] = typeof col === 'function' ? col(x, y, z) : col;
      skin[i] = bone;
    }
  };
  // Bone slots, in the order they are added below (skin values are slot + 1).
  const HIPS = 1, SPINE = 2, HEAD = 3, ARM_L = 4, ARM_R = 5, LEG_L = 6, LEG_R = 7;

  // Legs, with boots.
  for (const [x0, b] of [[6, LEG_L], [11, LEG_R]]) box(x0, x0 + 2, 0, 7, 4, 7, (x, y, z) => (y <= 1 ? C.boot : y === 2 && z === 7 ? C.boot : C.pants), b);
  // Hips and belt.
  box(5, 14, 8, 9, 3, 8, (x, y, z) => (y === 9 ? C.belt : C.pants), HIPS);
  m[G.idx(size, 9, 9, 8)] = C.buckle; m[G.idx(size, 10, 9, 8)] = C.buckle;
  // Chest.
  box(5, 14, 10, 15, 3, 8, (x, y, z) => (z === 8 && (x === 9 || x === 10) && y >= 11 ? C.shirtDark : C.shirt), SPINE);
  // Arms: sleeve on top, bare forearm, hand.
  for (const [x0, b] of [[2, ARM_L], [15, ARM_R]]) box(x0, x0 + 2, 8, 15, 4, 7, (x, y) => (y >= 12 ? C.shirt : C.skin), b);
  // Head: face, hair on top and at the back, eyes, cheeks and a mouth on the front (z = 9).
  box(6, 13, 16, 22, 2, 9, (x, y, z) => {
    if (y >= 21 || z <= 3 || (y >= 20 && (x === 6 || x === 13))) return C.hair;
    if (y === 20 && z === 9 && x >= 7 && x <= 12) return C.hair;
    return C.skin;
  }, HEAD);
  for (const x of [7, 8, 11, 12]) for (const y of [18, 19]) m[G.idx(size, x, y, 9)] = C.eye;
  m[G.idx(size, 7, 17, 9)] = C.cheek; m[G.idx(size, 12, 17, 9)] = C.cheek;
  for (const x of [9, 10]) m[G.idx(size, x, 17, 9)] = C.mouth;

  const rig = doc.rig;
  const hips = R.addBone(rig, [10, 8, 6], [10, 10, 6], null, 'Hips');
  const spine = R.addBone(rig, [10, 10, 6], [10, 16, 6], hips.id, 'Spine');
  const head = R.addBone(rig, [10, 16, 6], [10, 22, 6], spine.id, 'Head');
  const armL = R.addBone(rig, [3.5, 15, 6], [3.5, 8.5, 6], spine.id, 'Arm L');
  const armR = R.addBone(rig, [16.5, 15, 6], [16.5, 8.5, 6], spine.id, 'Arm R');
  const legL = R.addBone(rig, [7.5, 8, 6], [7.5, 0.5, 6], hips.id, 'Leg L');
  const legR = R.addBone(rig, [12.5, 8, 6], [12.5, 0.5, 6], hips.id, 'Leg R');

  const rot = e => R.qFromEuler(e);
  const pose = parts => {
    const p = {};
    for (const [b, e, t] of parts) p[b.id] = { q: rot(e), t: t || [0, 0, 0] };
    return p;
  };
  // Walk: legs swing about X, arms swing the other way, a one-voxel bob on the passing frames.
  const stride = s => pose([
    [legL, [-28 * s, 0, 0]], [legR, [28 * s, 0, 0]],
    [armL, [26 * s, 0, 0]], [armR, [-26 * s, 0, 0]],
    [head, [0, 4 * s, 0]],
  ]);
  const pass = pose([[hips, [0, 0, 0], [0, 1, 0]]]);
  doc.actions.push({
    name: 'Walk', length: 8, fps: 8, loop: true,
    keys: [{ frame: 0, pose: stride(1) }, { frame: 2, pose: pass }, { frame: 4, pose: stride(-1) }, { frame: 6, pose: R.clonePose(pass) }],
  });
  // Wave: right arm up and out, rocking back and forth.
  const up = a => pose([[armR, [0, 0, 150 + a]], [head, [0, 0, -6]], [spine, [0, 0, 4]]]);
  doc.actions.push({
    name: 'Wave', length: 8, fps: 8, loop: true,
    keys: [{ frame: 0, pose: up(-20) }, { frame: 4, pose: up(20) }],
  });

  // A blink drawn by hand: copy the model and close the eyes on two frames.
  const open = m.slice();
  const shut = m.slice(), half = m.slice();
  for (const x of [7, 8, 11, 12]) {
    shut[G.idx(size, x, 19, 9)] = C.skin; shut[G.idx(size, x, 18, 9)] = C.eye;
    half[G.idx(size, x, 19, 9)] = C.skin;
  }
  doc.clips.push({ name: 'Blink', fps: 8, frames: [open, open.slice(), open.slice(), open.slice(), half, shut, half.slice(), open.slice()] });
  // And the walk, baked from the bones, ready to touch up by hand.
  doc.clips.push({ name: 'Walk', fps: 8, frames: R.bakeAction(m, rig, size, doc.actions[0]) });
  return doc;
}

if (node) module.exports = { demoProject };
else root.VXDemo = { demoProject };
})(typeof window !== 'undefined' ? window : globalThis);
