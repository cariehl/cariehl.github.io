// Voxel Studio: the editor. Tabs, tools, the viewport, panels, timeline, undo, saving.
(function () {
'use strict';
const G = window.VXGrid, R = window.VXRig, V = window.VXRender;
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const STORE = 'voxel-studio:project';

const ICON = {
  add: '<svg viewBox="0 0 24 24"><path d="M12 3 4 7.5v9L12 21l8-4.5v-9z"/><path d="M12 9v6M9 12h6"/></svg>',
  erase: '<svg viewBox="0 0 24 24"><path d="m8 20-4-4L14 6l6 6-8 8H8zM20 20h-8M9 11l6 6"/></svg>',
  paint: '<svg viewBox="0 0 24 24"><path d="M18 3l3 3-8 8-3-3zM10 11c-3 0-5 2-5 5 0 2-1 3-2 4 4 0 9-1 9-6"/></svg>',
  fill: '<svg viewBox="0 0 24 24"><path d="m5 11 7-7 7 7-7 7zM5 11h14M20 15s2 2.4 2 3.6a2 2 0 0 1-4 0C18 17.4 20 15 20 15z"/></svg>',
  pick: '<svg viewBox="0 0 24 24"><path d="M14 4l6 6-2 2-6-6zM13 7l-8 8v4h4l8-8"/></svg>',
  mirror: '<svg viewBox="0 0 24 24"><path d="M12 3v18M9 7 4 17h5zM15 7l5 10h-5z"/></svg>',
  layer: '<svg viewBox="0 0 24 24"><path d="m12 4 9 5-9 5-9-5z"/><path d="m3 14 9 5 9-5" opacity=".5"/></svg>',
  bone: '<svg viewBox="0 0 24 24"><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2"/><path d="m7.5 16.5 3-6 6-3-3 6z"/></svg>',
  skin: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/><path d="M13 7.5h4.5V11M11 16.5H6.5V13"/></svg>',
  rotate: '<svg viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-3-6.2M20 4v5h-5"/></svg>',
  play: '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',
  pause: '<svg viewBox="0 0 24 24"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>',
};

// ---------- state ----------
const S = {
  doc: null, tab: 'model', tool: 'add', color: 20, mirror: false, layer: null, edges: true,
  clip: 0, frame: 0, onion: true, playing: false,
  bone: null, rigTool: 'bone', showSkin: true,
  action: 0, poseFrame: 0, clipboard: null,
  cam: { yaw: 0.65, pitch: 0.5, zoom: 18, target: [8, 6, 8], ortho: true },
  hover: null, ver: 0,
};

function loadDoc(doc, keepCam) {
  S.doc = doc;
  S.clip = 0; S.frame = 0; S.action = 0; S.poseFrame = 0; S.bone = doc.rig.bones[0] ? doc.rig.bones[0].id : null;
  S.layer = null; S.playing = false;
  if (S.color >= doc.palette.length) S.color = 1;
  undoStack.length = 0; redoStack.length = 0; fresh = new Set();
  if (!keepCam) frameCamera();
  changed(true);
}
function frameCamera() {
  const sz = S.doc.size;
  S.cam.target = [sz[0] / 2, sz[1] * 0.42, sz[2] / 2];
  const r = stageRect();
  S.cam.zoom = V.fitZoom(sz, r.width || 600, r.height || 400, 1.25);
}

// ---------- undo ----------
// Snapshots share grids with the live project; writable() copies a grid the first time it changes
// after a snapshot, so a snapshot never sees later edits.
const undoStack = [], redoStack = [];
let fresh = new Set(), lastKey = null, lastT = 0;
function uiState() { return { tab: S.tab, clip: S.clip, frame: S.frame, action: S.action, poseFrame: S.poseFrame, bone: S.bone }; }
function checkpoint(key) {
  const now = performance.now();
  if (key && key === lastKey && now - lastT < 900) { lastT = now; return; }
  undoStack.push({ doc: G.snapshot(S.doc), ui: uiState() });
  if (undoStack.length > 150) undoStack.shift();
  redoStack.length = 0;
  fresh = new Set();
  lastKey = key; lastT = now;
}
function writable(owner, key) {
  if (!fresh.has(owner[key])) { owner[key] = owner[key].slice(); fresh.add(owner[key]); }
  return owner[key];
}
function restore(from, to) {
  if (!from.length) return;
  to.push({ doc: G.snapshot(S.doc), ui: uiState() });
  const e = from.pop();
  S.doc = e.doc;
  Object.assign(S, e.ui);
  if (S.tab !== currentTab) setTab(S.tab, true);
  fresh = new Set(); lastKey = null;
  fixSelection();
  changed(true);
}
const undo = () => restore(undoStack, redoStack);
const redo = () => restore(redoStack, undoStack);
function fixSelection() {
  const d = S.doc;
  S.clip = clamp(S.clip, 0, Math.max(0, d.clips.length - 1));
  const c = d.clips[S.clip];
  S.frame = c ? clamp(S.frame, 0, c.frames.length - 1) : 0;
  S.action = clamp(S.action, 0, Math.max(0, d.actions.length - 1));
  const a = d.actions[S.action];
  S.poseFrame = a ? clamp(S.poseFrame, 0, a.length - 1) : 0;
  if (S.bone && !d.rig.bones.some(b => b.id === S.bone)) S.bone = d.rig.bones[0] ? d.rig.bones[0].id : null;
  if (S.color >= d.palette.length) S.color = d.palette.length - 1;
}

// ---------- change tracking ----------
let saveTimer = 0, thumbTimer = 0, panelDirty = false, drawQueued = false;
function changed(structural) {
  S.ver++;
  bakeCache = null;
  if (structural) panelDirty = true;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(save, 700);
  clearTimeout(thumbTimer);
  thumbTimer = setTimeout(refreshThumbs, 250);
  requestDraw();
}
function requestDraw() {
  if (drawQueued) return;
  drawQueued = true;
  requestAnimationFrame(() => {
    drawQueued = false;
    if (panelDirty) { panelDirty = false; renderChrome(); }
    draw();
  });
}
function save() {
  try { localStorage.setItem(STORE, JSON.stringify(G.serialize(S.doc))); } catch (e) { /* storage full or blocked */ }
}

// ---------- what the viewport shows ----------
let bakeCache = null;
function poseCtx() {
  if (!bakeCache || bakeCache.ver !== S.ver) bakeCache = { ver: S.ver, ctx: R.bakeContext(S.doc.model, S.doc.rig, S.doc.size), frames: new Map() };
  return bakeCache;
}
function action() { return S.doc.actions[S.action] || null; }
function clip() { return S.doc.clips[S.clip] || null; }
function currentPose() { const a = action(); return a ? R.sampleAction(a, S.poseFrame) : {}; }
function posedGrid(f) {
  const bc = poseCtx(), a = action();
  if (!a) return S.doc.model;
  const key = S.action + ':' + f;
  if (!bc.frames.has(key)) bc.frames.set(key, R.bake(bc.ctx, R.sampleAction(a, f)));
  return bc.frames.get(key);
}
function skinView() {
  const d = S.doc, out = new Uint8Array(d.model.length);
  for (let i = 0; i < out.length; i++) if (d.model[i]) out[i] = d.rig.skin[i] + 1;
  return { grid: out, palette: [null, '#5d6582'].concat(d.rig.bones.map(b => b.color)) };
}
// The grid the tools edit in the current tab, as { owner, key } so it can be made writable.
function editTarget() {
  if (S.tab === 'model') return { owner: S.doc, key: 'model' };
  if (S.tab === 'frames') { const c = clip(); return c ? { owner: c.frames, key: S.frame } : null; }
  return null;
}
function view() {
  const d = S.doc;
  if (S.tab === 'rig' && S.showSkin) {
    const sv = skinView();
    return { grid: sv.grid, palette: sv.palette };
  }
  if (S.tab === 'pose') return { grid: posedGrid(S.poseFrame), palette: d.palette };
  if (S.tab === 'frames') {
    const c = clip();
    if (!c) return { grid: G.makeGrid(d.size), palette: d.palette };
    const prev = S.onion && c.frames.length > 1 ? c.frames[(S.frame - 1 + c.frames.length) % c.frames.length] : null;
    return { grid: c.frames[S.frame], palette: d.palette, ghost: S.playing ? null : prev };
  }
  return { grid: d.model, palette: d.palette };
}
function bonesForView() {
  if (S.tab === 'rig') return S.doc.rig.bones.map(b => ({ id: b.id, head: b.head, tail: b.tail, color: b.color }));
  if (S.tab === 'pose') {
    const byId = new Map(S.doc.rig.bones.map(b => [b.id, b]));
    return R.posedBones(S.doc.rig.bones, currentPose()).map(p => ({ ...p, color: byId.get(p.id).color }));
  }
  return null;
}

// ---------- viewport ----------
const cv = $('#cv'), ctx = cv.getContext('2d');
let dpr = 1, lastCam = null;
function stageRect() { return $('#stage').getBoundingClientRect(); }
function resize() {
  const r = stageRect();
  dpr = Math.min(2, window.devicePixelRatio || 1);
  cv.width = Math.max(1, Math.round(r.width * dpr));
  cv.height = Math.max(1, Math.round(r.height * dpr));
  requestDraw();
}
function draw() {
  const r = stageRect();
  const W = r.width, H = r.height;
  if (!W || !H) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const v = view();
  let highlight = null;
  if (S.hover && !drag) {
    const h = S.hover;
    if (h.add) highlight = { cell: h.add, color: '#ffffff' };
    else if (h.cell) highlight = { cell: h.cell, color: S.tool === 'erase' && toolsTab() ? '#ff5d6c' : '#ffffff' };
  }
  lastCam = V.draw(ctx, W, H, {
    grid: v.grid, ghost: v.ghost, palette: v.palette, size: S.doc.size, cam: S.cam, edges: S.edges,
    maxY: S.layer, floorY: S.layer == null ? 0 : S.layer, highlight,
    bones: bonesForView(), selBone: S.bone,
  });
  if (boneDraft) {
    const h = V.project(lastCam, boneDraft.head), t = V.project(lastCam, boneDraft.tail);
    if (h && t) {
      ctx.strokeStyle = '#ffb84d'; ctx.lineWidth = 3; ctx.setLineDash([6, 4]);
      ctx.beginPath(); ctx.moveTo(h[0], h[1]); ctx.lineTo(t[0], t[1]); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = '#ffb84d'; ctx.beginPath(); ctx.arc(h[0], h[1], 5, 0, 7); ctx.fill();
    }
  }
  updateStatus();
}
function toolsTab() { return S.tab === 'model' || S.tab === 'frames'; }

function updateStatus() {
  const parts = [];
  const h = S.hover;
  if (h && h.cell && !h.floor) parts.push(`x ${h.cell[0]}  y ${h.cell[1]}  z ${h.cell[2]}`);
  else if (h && h.add) parts.push(`x ${h.add[0]}  y ${h.add[1]}  z ${h.add[2]}`);
  if (S.layer != null) parts.push(`layer ${S.layer}`);
  if (S.tab === 'frames' && clip()) parts.push(`frame ${S.frame + 1}/${clip().frames.length}`);
  if (S.tab === 'pose' && action()) parts.push(`frame ${S.poseFrame + 1}/${action().length}`);
  const hint = {
    model: 'drag: draw · right-drag or drag empty space: orbit · wheel: zoom',
    frames: 'drag: draw on this frame · faint voxels: previous frame',
    rig: S.rigTool === 'bone' ? 'drag across the model: new bone · drag a joint: move it' : 'drag over voxels: give them to the selected bone',
    pose: 'drag a bone: rotate it · shift-drag: move it · changes key this frame',
  }[S.tab];
  $('#status').textContent = parts.join('   ') + (parts.length ? '   ·   ' : '') + hint;
}

function screenPos(e) { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
function currentCam() { const r = stageRect(); return V.camera(S.cam, r.width, r.height); }
function pickAt(sx, sy, gridOverride) {
  const cb = currentCam();
  const { o, d } = V.ray(cb, sx, sy);
  const grid = gridOverride || view().grid, size = S.doc.size;
  const top = S.layer == null ? size[1] - 1 : S.layer;
  const hit = G.raycast(size, o, d, (x, y, z) => y <= top && grid[G.idx(size, x, y, z)] !== 0, S.layer == null ? 0 : S.layer);
  if (!hit) return null;
  const add = [hit.cell[0] + hit.normal[0], hit.cell[1] + hit.normal[1], hit.cell[2] + hit.normal[2]];
  hit.add = G.inside(size, add[0], add[1], add[2]) && add[1] <= top ? add : null;
  return hit;
}
function hoverInfo(sx, sy) {
  if (S.tab === 'pose' || (S.tab === 'rig' && S.rigTool === 'bone')) return null;
  const hit = pickAt(sx, sy);
  if (!hit) return null;
  if (toolsTab() && S.tool === 'add') return { add: hit.add, cell: hit.floor ? null : hit.cell, floor: hit.floor };
  if (hit.floor) return null;
  return { cell: hit.cell };
}
// Bones under the cursor: { id, part: 'head' | 'tail' | 'body' }.
function boneAt(sx, sy) {
  const bones = bonesForView();
  if (!bones || !lastCam) return null;
  let best = null, bd = 12;
  for (const b of bones) {
    const h = V.project(lastCam, b.head), t = V.project(lastCam, b.tail);
    if (!h || !t) continue;
    const dh = Math.hypot(sx - h[0], sy - h[1]), dt = Math.hypot(sx - t[0], sy - t[1]);
    if (dt < bd) { bd = dt; best = { id: b.id, part: 'tail' }; }
    if (dh < bd) { bd = dh; best = { id: b.id, part: 'head' }; }
  }
  if (best) return best;
  bd = 8;
  for (const b of bones) {
    const h = V.project(lastCam, b.head), t = V.project(lastCam, b.tail);
    if (!h || !t) continue;
    const dx = t[0] - h[0], dy = t[1] - h[1], l2 = dx * dx + dy * dy || 1;
    const u = clamp(((sx - h[0]) * dx + (sy - h[1]) * dy) / l2, 0, 1);
    const d = Math.hypot(sx - h[0] - dx * u, sy - h[1] - dy * u);
    if (d < bd) { bd = d; best = { id: b.id, part: 'body' }; }
  }
  return best;
}
// The point under the cursor on the plane through p that faces the camera.
function planePoint(sx, sy, p) {
  const cb = currentCam();
  const { o, d } = V.ray(cb, sx, sy);
  const n = cb.f;
  const den = d[0] * n[0] + d[1] * n[1] + d[2] * n[2];
  if (Math.abs(den) < 1e-6) return p.slice();
  const t = ((p[0] - o[0]) * n[0] + (p[1] - o[1]) * n[1] + (p[2] - o[2]) * n[2]) / den;
  return [o[0] + d[0] * t, o[1] + d[1] * t, o[2] + d[2] * t];
}
const snap = v => v.map(a => Math.round(a * 2) / 2);

// ---------- pointer input ----------
let drag = null, boneDraft = null, strokeN = 0;
const pointers = new Map();
cv.addEventListener('contextmenu', e => e.preventDefault());
cv.addEventListener('pointerdown', e => {
  cv.setPointerCapture(e.pointerId);
  pointers.set(e.pointerId, screenPos(e));
  if (pointers.size === 2) { endDrag(); startGesture(); return; }
  if (pointers.size > 2) return;
  const [sx, sy] = screenPos(e);
  if (e.button === 2 || e.button === 1 || (e.button === 0 && e.altKey)) {
    drag = { kind: e.button === 1 || e.shiftKey ? 'pan' : 'orbit', x: sx, y: sy };
    return;
  }
  if (e.button !== 0) return;
  if (S.playing) setPlaying(false);
  startTool(sx, sy, e);
});
cv.addEventListener('pointermove', e => {
  if (pointers.has(e.pointerId)) pointers.set(e.pointerId, screenPos(e));
  const [sx, sy] = screenPos(e);
  if (gesture && pointers.size >= 2) { moveGesture(); return; }
  if (!drag) {
    if (e.pointerType === 'mouse') { S.hover = hoverInfo(sx, sy); requestDraw(); }
    return;
  }
  moveDrag(sx, sy, e);
});
const up = e => {
  pointers.delete(e.pointerId);
  if (gesture) { if (pointers.size < 2) gesture = null; return; }
  if (drag) { const [sx, sy] = screenPos(e); finishDrag(sx, sy); }
};
cv.addEventListener('pointerup', up);
cv.addEventListener('pointercancel', up);
cv.addEventListener('pointerleave', () => { if (!drag) { S.hover = null; requestDraw(); } });
cv.addEventListener('wheel', e => {
  e.preventDefault();
  S.cam.zoom = clamp(S.cam.zoom * Math.exp(-e.deltaY * 0.0015), 2, 200);
  requestDraw();
}, { passive: false });

let gesture = null;
function gestureInfo() {
  const p = [...pointers.values()];
  return { cx: (p[0][0] + p[1][0]) / 2, cy: (p[0][1] + p[1][1]) / 2, d: Math.hypot(p[0][0] - p[1][0], p[0][1] - p[1][1]) || 1 };
}
function startGesture() { gesture = { ...gestureInfo(), zoom: S.cam.zoom }; }
function moveGesture() {
  const g = gestureInfo();
  S.cam.zoom = clamp(gesture.zoom * g.d / gesture.d, 2, 200);
  orbitBy(g.cx - gesture.cx, g.cy - gesture.cy);
  gesture.cx = g.cx; gesture.cy = g.cy;
  requestDraw();
}
function orbitBy(dx, dy) {
  S.cam.yaw -= dx * 0.008;
  S.cam.pitch = clamp(S.cam.pitch + dy * 0.008, -1.55, 1.55);
}
function panBy(dx, dy) {
  const cb = currentCam();
  const k = cb.ortho ? 1 / cb.scale : cb.dist / cb.focal;
  for (let a = 0; a < 3; a++) S.cam.target[a] += (-cb.r[a] * dx + cb.u[a] * dy) * k;
}

function startTool(sx, sy, e) {
  S.hover = null;
  if (toolsTab()) {
    const target = editTarget();
    if (!target) { drag = { kind: 'orbit', x: sx, y: sy }; return; }
    const hit = pickAt(sx, sy);
    if (!hit || (hit.floor && S.tool !== 'add')) { drag = { kind: 'orbit', x: sx, y: sy }; return; }
    if (S.tool === 'pick') {
      if (!hit.floor) { S.color = view().grid[G.idx(S.doc.size, ...hit.cell)]; renderTools(); renderPanel(); toast('Picked colour ' + S.color); }
      drag = { kind: 'none' };
      return;
    }
    checkpoint('stroke' + (++strokeN));
    writable(target.owner, target.key);
    drag = { kind: 'stroke', target, lock: null, painted: 0 };
    applyStroke(hit);
    if (S.tool === 'fill') drag = { kind: 'none' };
    changed(S.tool === 'fill');
    return;
  }
  if (S.tab === 'rig') {
    const hb = boneAt(sx, sy);
    if (hb) {
      selectBone(hb.id);
      if (hb.part !== 'body') { drag = { kind: 'joint', id: hb.id, part: hb.part, n: ++strokeN }; return; }
      if (S.rigTool === 'bone') { drag = { kind: 'none' }; return; }
    }
    if (S.rigTool === 'bone') {
      const hit = pickAt(sx, sy, S.doc.model);
      if (!hit || hit.floor) { drag = { kind: 'orbit', x: sx, y: sy }; return; }
      const head = snap(hit.mid);
      boneDraft = { head, tail: head.slice() };
      drag = { kind: 'bone' };
      return;
    }
    // Paint skin.
    const hit = pickAt(sx, sy, S.doc.model);
    if (!hit || hit.floor) { drag = { kind: 'orbit', x: sx, y: sy }; return; }
    checkpoint('skin' + (++strokeN));
    writable(S.doc.rig, 'skin');
    drag = { kind: 'skin' };
    paintSkin(hit);
    return;
  }
  if (S.tab === 'pose') {
    const hb = boneAt(sx, sy);
    if (!hb || !action()) { drag = { kind: 'orbit', x: sx, y: sy }; return; }
    selectBone(hb.id);
    const pb = R.posedBones(S.doc.rig.bones, currentPose()).find(b => b.id === hb.id);
    const h = V.project(currentCam(), pb.head);
    drag = { kind: e.shiftKey ? 'posemove' : 'poserot', id: hb.id, hx: h[0], hy: h[1], ang: Math.atan2(-(sy - h[1]), sx - h[0]), x: sx, y: sy, n: ++strokeN };
    return;
  }
  drag = { kind: 'orbit', x: sx, y: sy };
}
function moveDrag(sx, sy, e) {
  const d = drag;
  if (d.kind === 'orbit' || d.kind === 'pan') {
    if (d.kind === 'orbit' && !e.shiftKey) orbitBy(sx - d.x, sy - d.y); else panBy(sx - d.x, sy - d.y);
    d.x = sx; d.y = sy;
    requestDraw();
  } else if (d.kind === 'stroke') {
    const hit = pickAt(sx, sy);
    if (hit) { applyStroke(hit); changed(false); }
  } else if (d.kind === 'skin') {
    const hit = pickAt(sx, sy, S.doc.model);
    if (hit && !hit.floor) paintSkin(hit);
  } else if (d.kind === 'bone') {
    boneDraft.tail = boneEnd(sx, sy);
    requestDraw();
  } else if (d.kind === 'joint') {
    const b = S.doc.rig.bones.find(o => o.id === d.id);
    if (!b) return;
    checkpoint('joint' + d.n);
    const p = snap(planePoint(sx, sy, b[d.part]));
    const old = b[d.part].slice();
    b[d.part] = p;
    // Keep connected bones connected.
    for (const o of S.doc.rig.bones) {
      if (d.part === 'tail' && o.parent === b.id && Math.hypot(o.head[0] - old[0], o.head[1] - old[1], o.head[2] - old[2]) < 0.01) o.head = p.slice();
      if (d.part === 'head' && b.parent === o.id && Math.hypot(o.tail[0] - old[0], o.tail[1] - old[1], o.tail[2] - old[2]) < 0.01) o.tail = p.slice();
    }
    changed(false);
    renderPanel();
  } else if (d.kind === 'poserot') {
    const ang = Math.atan2(-(sy - d.hy), sx - d.hx);
    let delta = ang - d.ang;
    if (delta > Math.PI) delta -= 2 * Math.PI;
    if (delta < -Math.PI) delta += 2 * Math.PI;
    d.ang = ang;
    const cb = currentCam();
    editPose('drag' + d.n, pose => {
      const q = R.rotateWorld(S.doc.rig.bones, pose, d.id, [-cb.f[0], -cb.f[1], -cb.f[2]], delta);
      boneEntry(pose, d.id).q = q;
    });
  } else if (d.kind === 'posemove') {
    const cb = currentCam();
    const k = cb.ortho ? 1 / cb.scale : cb.dist / cb.focal;
    const dx = sx - d.x, dy = sy - d.y;
    d.x = sx; d.y = sy;
    const world = [0, 1, 2].map(a => (cb.r[a] * dx - cb.u[a] * dy) * k);
    editPose('drag' + d.n, pose => {
      const b = S.doc.rig.bones.find(o => o.id === d.id);
      const parW = b.parent != null ? R.solve(S.doc.rig.bones, pose).get(b.parent).W : R.QI();
      const local = R.qRot(R.qConj(parW), world);
      const ent = boneEntry(pose, d.id);
      ent.t = ent.t.map((v, a) => v + local[a]);
    });
  }
}
function finishDrag(sx, sy) {
  const d = drag;
  drag = null;
  if (d.kind === 'bone') {
    const head = boneDraft.head, tail = boneEnd(sx, sy);
    boneDraft = null;
    if (Math.hypot(tail[0] - head[0], tail[1] - head[1], tail[2] - head[2]) < 1) { toast('Drag farther to make a bone'); requestDraw(); return; }
    checkpoint();
    const parent = S.bone && S.doc.rig.bones.some(b => b.id === S.bone) ? S.bone : null;
    const b = R.addBone(S.doc.rig, head, tail, parent);
    S.bone = b.id;
    changed(true);
    toast(parent ? `Added ${b.name}, child of ${boneName(parent)}` : `Added ${b.name}`);
    return;
  }
  if (d.kind === 'stroke' || d.kind === 'skin' || d.kind === 'poserot' || d.kind === 'posemove' || d.kind === 'joint') changed(true);
  if (d.kind === 'orbit' || d.kind === 'pan') { lastThumbCam = null; clearTimeout(thumbTimer); thumbTimer = setTimeout(refreshThumbs, 200); }
}
// A second finger turns a one-finger edit into a camera gesture, so take the edit back.
function endDrag() {
  const k = drag && drag.kind;
  drag = null; boneDraft = null;
  if (k === 'stroke' || k === 'skin' || k === 'joint' || k === 'poserot' || k === 'posemove') { undo(); redoStack.pop(); renderChrome(); }
}

// Where a bone being drawn ends: inside the model if the cursor is over it, otherwise level with the head.
function boneEnd(sx, sy) {
  const hit = pickAt(sx, sy, S.doc.model);
  return snap(hit && !hit.floor ? hit.mid : planePoint(sx, sy, boneDraft.head));
}
function applyStroke(hit) {
  const d = drag, size = S.doc.size, grid = d.target.owner[d.target.key];
  const cells = [];
  if (S.tool === 'add') {
    if (!hit.add) return;
    const axis = hit.normal[0] ? 0 : hit.normal[1] ? 1 : 2;
    // Lock a drag to the plane it started on, so it spreads across a surface instead of piling up toward you.
    if (!d.lock) d.lock = { axis, n: hit.normal.join(), at: hit.add[axis] };
    else if (d.lock.n !== hit.normal.join() || d.lock.at !== hit.add[axis]) return;
    cells.push(hit.add);
  } else {
    if (hit.floor) return;
    cells.push(hit.cell);
  }
  if (S.mirror) for (const c of cells.slice()) cells.push([size[0] - 1 - c[0], c[1], c[2]]);
  for (const c of cells) {
    if (S.tool === 'add') G.set(grid, size, c[0], c[1], c[2], S.color);
    else if (S.tool === 'erase') G.set(grid, size, c[0], c[1], c[2], 0);
    else if (S.tool === 'paint') { if (G.get(grid, size, ...c)) G.set(grid, size, c[0], c[1], c[2], S.color); }
    else if (S.tool === 'fill') G.floodFill(grid, size, c[0], c[1], c[2], S.color);
  }
}
function paintSkin(hit) {
  const i = G.idx(S.doc.size, ...hit.cell);
  const k = S.bone ? S.doc.rig.bones.findIndex(b => b.id === S.bone) + 1 : 0;
  if (S.doc.rig.skin[i] === k) return;
  S.doc.rig.skin[i] = k;
  if (S.mirror) {
    const sz = S.doc.size, j = G.idx(sz, sz[0] - 1 - hit.cell[0], hit.cell[1], hit.cell[2]);
    if (S.doc.model[j]) S.doc.rig.skin[j] = k;
  }
  changed(false);
}
function boneEntry(pose, id) {
  if (!pose[id]) pose[id] = { q: R.QI(), t: [0, 0, 0] };
  return pose[id];
}
// Change the pose at the current frame, adding a key there if there isn't one.
function editPose(key, fn) {
  const a = action();
  if (!a) return;
  checkpoint(key);
  let k = a.keys.find(o => o.frame === S.poseFrame);
  if (!k) {
    k = { frame: S.poseFrame, pose: R.sampleAction(a, S.poseFrame) };
    a.keys.push(k);
    a.keys.sort((p, q) => p.frame - q.frame);
  }
  fn(k.pose);
  changed(false);
  renderPanel();
  renderTimeline();
}
function boneName(id) { const b = S.doc.rig.bones.find(o => o.id === id); return b ? b.name : 'Static'; }
function selectBone(id) { if (S.bone !== id) { S.bone = id; panelDirty = true; requestDraw(); } }

// ---------- tabs and chrome ----------
let currentTab = 'model';
function setTab(tab, quiet) {
  if (S.playing) setPlaying(false);
  S.tab = currentTab = tab;
  S.hover = null; boneDraft = null;
  if (!quiet) panelDirty = true;
  document.querySelectorAll('.tab').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
  renderChrome();
  // The timeline appearing or going changes the viewport size.
  resize();
}
function renderChrome() {
  $('#pname').value = S.doc.name;
  document.querySelectorAll('.tab').forEach(b => b.classList.toggle('on', b.dataset.tab === S.tab));
  $('#viewbar [data-view=persp]').classList.toggle('on', !S.cam.ortho);
  $('#viewbar [data-view=edges]').classList.toggle('on', S.edges);
  $('[data-act=undo]').disabled = !undoStack.length;
  $('[data-act=redo]').disabled = !redoStack.length;
  renderTools(); renderPanel(); renderTimeline();
}

function renderTools() {
  const t = $('#tools');
  let h = '';
  const btn = (id, label, key, on, act) => `<button class="tool${on ? ' on' : ''}" data-act="${act}" data-v="${id}" title="${label}${key ? ' (' + key + ')' : ''}" aria-label="${label}">${ICON[id]}${key ? '<small>' + key + '</small>' : ''}</button>`;
  if (toolsTab()) {
    h += btn('add', 'Add voxels', 'B', S.tool === 'add', 'tool');
    h += btn('erase', 'Erase', 'E', S.tool === 'erase', 'tool');
    h += btn('paint', 'Paint', 'P', S.tool === 'paint', 'tool');
    h += btn('fill', 'Fill a same-coloured region', 'F', S.tool === 'fill', 'tool');
    h += btn('pick', 'Pick a colour', 'I', S.tool === 'pick', 'tool');
    h += '<span class="tool-sep"></span>';
    h += btn('mirror', 'Mirror left and right', 'M', S.mirror, 'mirror');
    h += btn('layer', 'Edit one layer at a time', 'L', S.layer != null, 'layer');
    h += `<span class="cur-color" style="background:${S.doc.palette[S.color] || '#000'}" title="Current colour"></span>`;
  } else if (S.tab === 'rig') {
    h += btn('bone', 'Draw bones', 'B', S.rigTool === 'bone', 'rigtool');
    h += btn('skin', 'Paint voxels onto the selected bone', 'P', S.rigTool === 'skin', 'rigtool');
    h += '<span class="tool-sep"></span>';
    h += btn('mirror', 'Mirror skin painting', 'M', S.mirror, 'mirror');
  } else {
    h += btn('rotate', 'Drag bones to pose them', '', true, 'none');
  }
  t.innerHTML = h;
}

function sec(title, body, extra) { return `<div class="sec"><h3><span class="grow">${title}</span>${extra || ''}</h3>${body}</div>`; }
function renderPanel() {
  const p = $('#panel');
  const scroll = p.scrollTop;
  let h = '';
  if (S.tab === 'model') h = panelPalette() + panelModel();
  else if (S.tab === 'frames') h = panelClips() + panelPalette();
  else if (S.tab === 'rig') h = panelRig();
  else h = panelPose();
  p.innerHTML = h;
  p.scrollTop = scroll;
}
function panelPalette() {
  const d = S.doc;
  let sw = '';
  for (let i = 1; i < d.palette.length; i++) sw += `<button class="sw${i === S.color ? ' on' : ''}" style="background:${d.palette[i]}" data-act="color" data-v="${i}" title="Colour ${i}"></button>`;
  if (d.palette.length <= G.MAX_COLORS) sw += '<button class="sw add" data-act="addcolor" title="Add a colour">+</button>';
  return sec('Palette', `<div class="swatches">${sw}</div>
    <div class="row" style="margin-top:10px"><input type="color" data-field="palcolor" value="${d.palette[S.color]}" title="Change this colour everywhere it is used">
    <label>Colour ${S.color}</label><span style="flex:1"></span><button class="btn sm bad" data-act="delcolor">Remove</button></div>
    <p class="note">Changing a colour changes it on every voxel and every frame that uses it.</p>`);
}
function panelModel() {
  const d = S.doc;
  const n = G.count(d.model);
  const layer = S.layer == null ? '' : `<div class="row"><span class="lbl">Layer</span><input type="range" min="0" max="${d.size[1] - 1}" value="${S.layer}" data-field="layer"><b style="width:24px;text-align:right">${S.layer}</b></div>`;
  return sec('Model', `<p>${d.size.join(' × ')} grid, ${n} voxel${n === 1 ? '' : 's'}.</p>
    ${layer}
    <div class="row"><span class="lbl">Nudge</span>
      <button class="btn sm" data-act="nudge" data-v="-1,0,0">X−</button><button class="btn sm" data-act="nudge" data-v="1,0,0">X+</button>
      <button class="btn sm" data-act="nudge" data-v="0,-1,0">Y−</button><button class="btn sm" data-act="nudge" data-v="0,1,0">Y+</button>
      <button class="btn sm" data-act="nudge" data-v="0,0,-1">Z−</button><button class="btn sm" data-act="nudge" data-v="0,0,1">Z+</button></div>
    <div class="row"><button class="btn" data-act="flip">Flip left/right</button><button class="btn bad" data-act="clear">Clear</button></div>`);
}
function panelClips() {
  const d = S.doc, c = clip();
  if (!c) return sec('Animation clips', `<div class="empty"><p>A clip is a list of voxel frames you draw by hand, like pixel art. Each frame turns voxels on, off or to another colour.</p>
    <button class="btn pri" data-act="newclip" data-v="model">New clip from the model</button></div>
    <p class="note">You can also bake one from bones on the Pose tab.</p>`);
  const opts = d.clips.map((o, i) => `<option value="${i}"${i === S.clip ? ' selected' : ''}>${esc(o.name)} (${o.frames.length})</option>`).join('');
  const layer = S.layer == null ? '' : `<div class="row"><span class="lbl">Layer</span><input type="range" min="0" max="${d.size[1] - 1}" value="${S.layer}" data-field="layer"><b style="width:24px;text-align:right">${S.layer}</b></div>`;
  return sec('Animation clip', `<div class="row"><select data-field="clip">${opts}</select></div>
    <div class="row"><span class="lbl">Name</span><input type="text" data-field="clipname" value="${esc(c.name)}" maxlength="40"></div>
    <div class="row"><span class="lbl">Speed</span><input type="number" min="1" max="60" data-field="clipfps" value="${c.fps}"><label>frames per second</label></div>
    <div class="row"><label class="chk"><input type="checkbox" data-field="onion"${S.onion ? ' checked' : ''}>Show previous frame (onion skin)</label></div>
    ${layer}
    <div class="row"><button class="btn" data-act="newclip" data-v="model">New from model</button><button class="btn" data-act="newclip" data-v="empty">New empty</button></div>
    <div class="row"><button class="btn" data-act="dupclip">Duplicate</button><button class="btn" data-act="framefrommodel" title="Replace this frame with the model">Reset frame to model</button><button class="btn bad" data-act="delclip">Delete clip</button></div>`);
}
function panelRig() {
  const d = S.doc, rig = d.rig;
  const depth = b => { let n = 0, p = b.parent; const seen = new Set(); while (p != null && !seen.has(p)) { seen.add(p); n++; const pb = rig.bones.find(o => o.id === p); p = pb ? pb.parent : null; } return n; };
  const counts = new Array(rig.bones.length + 1).fill(0);
  for (let i = 0; i < d.model.length; i++) if (d.model[i]) counts[rig.skin[i]]++;
  let list = `<button class="bone${S.bone == null ? ' on' : ''}" data-act="bone" data-v=""><i style="background:#5d6582"></i><span>Static (never moves)</span><em>${counts[0]}</em></button>`;
  for (const b of R.boneOrder(rig.bones)) {
    const k = rig.bones.indexOf(b) + 1;
    list += `<button class="bone${S.bone === b.id ? ' on' : ''}" data-act="bone" data-v="${b.id}" style="padding-left:${8 + depth(b) * 14}px"><i style="background:${b.color}"></i><span>${esc(b.name)}</span><em>${counts[k]}</em></button>`;
  }
  let h = sec('Bones', `<div class="bones">${list}</div>
    ${rig.bones.length ? '' : '<p class="note">Pick the Bone tool and drag across the model to add a bone. Each new bone is a child of the selected one.</p>'}`,
    `<label class="chk" style="text-transform:none;letter-spacing:0;font-weight:400"><input type="checkbox" data-field="showskin"${S.showSkin ? ' checked' : ''}>Skin colours</label>`);
  const b = rig.bones.find(o => o.id === S.bone);
  if (b) {
    const parents = '<option value="">None (root)</option>' + rig.bones.filter(o => o.id !== b.id && !isDescendant(o.id, b.id)).map(o => `<option value="${o.id}"${o.id === b.parent ? ' selected' : ''}>${esc(o.name)}</option>`).join('');
    const vec = (f, v) => `<div class="vec">${v.map((x, a) => `<input type="number" step="0.5" data-field="${f}" data-a="${a}" value="${+x.toFixed(2)}">`).join('')}</div>`;
    h += sec('Selected bone', `<div class="row"><span class="lbl">Name</span><input type="text" data-field="bonename" value="${esc(b.name)}" maxlength="30"></div>
      <div class="row"><span class="lbl">Parent</span><select data-field="boneparent">${parents}</select></div>
      <div class="row"><span class="lbl">Head</span>${vec('head', b.head)}</div>
      <div class="row"><span class="lbl">Tail</span>${vec('tail', b.tail)}</div>
      <div class="row"><span class="lbl">Colour</span><input type="color" data-field="bonecolor" value="${b.color}"></div>
      <div class="row"><button class="btn" data-act="mirrorbone" title="Copy this bone and its voxels to the other side">Mirror to other side</button><button class="btn bad" data-act="delbone">Delete</button></div>
      <p class="note">The head is the pivot. Drag a joint in the view to move it.</p>`);
  }
  h += sec('Skin', `<p>Each voxel belongs to one bone, or to none. Auto skin gives every voxel to the nearest bone; fix the rest with the Paint tool.</p>
    <div class="row"><button class="btn pri" data-act="autoskin"${rig.bones.length ? '' : ' disabled'}>Auto skin</button><button class="btn" data-act="clearskin">Clear skin</button></div>`);
  return h;
}
function isDescendant(id, of) {
  const bones = S.doc.rig.bones;
  let p = bones.find(b => b.id === id), n = 0;
  while (p && p.parent != null && n++ < bones.length) { if (p.parent === of) return true; p = bones.find(b => b.id === p.parent); }
  return false;
}
function panelPose() {
  const d = S.doc;
  if (!d.rig.bones.length) return sec('Pose', `<div class="empty"><p>Add bones to the model on the Rig tab first.</p><button class="btn pri" data-act="tab" data-v="rig">Go to Rig</button></div>`);
  const a = action();
  if (!a) return sec('Actions', `<div class="empty"><p>An action is a bone animation: set a few key poses and the frames in between are filled in. Bake it to get voxel-art frames.</p><button class="btn pri" data-act="newaction">New action</button></div>`);
  const opts = d.actions.map((o, i) => `<option value="${i}"${i === S.action ? ' selected' : ''}>${esc(o.name)}</option>`).join('');
  let h = sec('Action', `<div class="row"><select data-field="action">${opts}</select><button class="btn sm" data-act="newaction">New</button><button class="btn sm" data-act="dupaction">Copy</button></div>
    <div class="row"><span class="lbl">Name</span><input type="text" data-field="actname" value="${esc(a.name)}" maxlength="40"></div>
    <div class="row"><span class="lbl">Frames</span><input type="number" min="1" max="240" data-field="actlen" value="${a.length}"><span class="lbl" style="width:auto">fps</span><input type="number" min="1" max="60" data-field="actfps" value="${a.fps}"></div>
    <div class="row"><label class="chk"><input type="checkbox" data-field="actloop"${a.loop ? ' checked' : ''}>Loop (the last frames blend back to the first key)</label></div>
    <div class="row"><button class="btn bad" data-act="delaction">Delete action</button></div>`);
  const b = d.rig.bones.find(o => o.id === S.bone);
  const k = a.keys.find(o => o.frame === S.poseFrame);
  if (b) {
    const pose = currentPose(), ent = pose[b.id] || { q: R.QI(), t: [0, 0, 0] };
    const e = R.qToEuler(ent.q);
    const rot = ['x', 'y', 'z'].map((ax, i) => `<div class="rot"><b class="${ax}">${ax.toUpperCase()}</b><input type="range" min="-180" max="180" step="1" value="${Math.round(e[i])}" data-field="rot" data-a="${i}"><input type="number" min="-180" max="180" step="1" value="${Math.round(e[i])}" data-field="rot" data-a="${i}"></div>`).join('');
    h += sec(`Pose: <span style="color:${b.color}">${esc(b.name)}</span>`, `${rot}
      <div class="row"><span class="lbl">Move</span><div class="vec">${ent.t.map((v, i) => `<input type="number" step="0.5" data-field="off" data-a="${i}" value="${+v.toFixed(2)}">`).join('')}</div></div>
      <div class="row"><button class="btn" data-act="resetbone">Reset bone</button><button class="btn" data-act="resetpose">Reset all</button></div>
      <p class="note">Frame ${S.poseFrame + 1} ${k ? 'is a key.' : 'is in between keys; changing anything adds a key here.'}</p>`);
  }
  h += sec('Keys', `<div class="row"><button class="btn" data-act="addkey"${k ? ' disabled' : ''}>Add key here</button><button class="btn bad" data-act="delkey"${k ? '' : ' disabled'}>Delete key</button></div>
    <div class="row"><button class="btn" data-act="copypose">Copy pose</button><button class="btn" data-act="pastepose"${S.clipboard ? '' : ' disabled'}>Paste pose</button><button class="btn" data-act="mirrorpose" title="Swap left and right bones and flip the pose">Mirror pose</button></div>`);
  h += sec('Bake to voxel frames', `<p>Renders every frame of this action into a clip of voxel frames. Edit them by hand on the Frames tab afterwards.</p>
    <div class="row"><button class="btn pri" data-act="bake">Bake “${esc(a.name)}”</button></div>`);
  return h;
}

// ---------- timeline ----------
function renderTimeline() {
  const t = $('#timeline');
  const before = t.innerHTML !== '';
  let h = '';
  if (S.tab === 'frames' && clip()) {
    const c = clip();
    h = `<button class="play" data-act="play" title="Play (Space)">${S.playing ? ICON.pause : ICON.play}</button>
      <div class="strip" id="strip">${c.frames.map((f, i) => `<button class="fr${i === S.frame ? ' on' : ''}" data-act="frame" data-v="${i}"><canvas width="144" height="144" data-thumb="${i}"></canvas><span>${i + 1}</span></button>`).join('')}</div>
      <div class="tl-ctl">
        <div class="row"><button class="btn sm" data-act="addframe" title="Copy this frame and insert it after">+ Copy</button><button class="btn sm" data-act="blankframe">+ Blank</button></div>
        <div class="row"><button class="btn sm" data-act="moveframe" data-v="-1" title="Move earlier">◀</button><button class="btn sm" data-act="moveframe" data-v="1" title="Move later">▶</button><button class="btn sm bad" data-act="delframe"${c.frames.length > 1 ? '' : ' disabled'}>Delete</button></div>
      </div>`;
  } else if (S.tab === 'pose' && action() && S.doc.rig.bones.length) {
    const a = action();
    const keys = new Set(a.keys.map(k => k.frame));
    h = `<button class="play" data-act="play" title="Play (Space)">${S.playing ? ICON.pause : ICON.play}</button>
      <div class="cells" id="strip">${Array.from({ length: a.length }, (_, i) => `<button class="cell${keys.has(i) ? ' key' : ''}${i === S.poseFrame ? ' on' : ''}" data-act="poseframe" data-v="${i}">${i + 1}</button>`).join('')}</div>`;
  }
  const strip = t.querySelector('#strip'), sl = strip ? strip.scrollLeft : 0;
  t.innerHTML = h;
  const ns = t.querySelector('#strip');
  if (ns) {
    ns.scrollLeft = sl;
    const on = ns.querySelector('.on');
    if (on) { const l = on.offsetLeft - ns.offsetLeft, r = l + on.offsetWidth; if (l < ns.scrollLeft || r > ns.scrollLeft + ns.clientWidth) ns.scrollLeft = l - 20; }
  }
  if ((h !== '') !== before) resize();
  lastThumbCam = null;
  refreshThumbs();
}
let thumbCache = new WeakMap(), lastThumbCam = null;
function refreshThumbs() {
  if (S.tab !== 'frames' || !clip()) return;
  const c = clip();
  const camKey = [S.cam.yaw.toFixed(3), S.cam.pitch.toFixed(3), S.doc.palette.join()].join('|');
  if (camKey !== lastThumbCam) { thumbCache = new WeakMap(); lastThumbCam = camKey; }
  document.querySelectorAll('canvas[data-thumb]').forEach(el => {
    const i = +el.dataset.thumb, g = c.frames[i];
    // Tools only change the current frame in place; anything else swaps in a new grid.
    if (!g || (thumbCache.get(el) === g && i !== S.frame)) return;
    const x = el.getContext('2d');
    const sz = S.doc.size;
    x.setTransform(1, 0, 0, 1, 0, 0);
    V.draw(x, el.width, el.height, {
      grid: g, palette: S.doc.palette, size: sz, edges: false, floor: false,
      cam: { yaw: S.cam.yaw, pitch: S.cam.pitch, ortho: true, zoom: V.fitZoom(sz, el.width, el.height, 1.0), target: [sz[0] / 2, sz[1] / 2, sz[2] / 2] },
    });
    thumbCache.set(el, g);
  });
}

// ---------- playback ----------
let playT = 0, playAcc = 0;
function setPlaying(on) {
  S.playing = on;
  playAcc = 0; playT = performance.now();
  renderTimeline();
  requestDraw();
  if (on) requestAnimationFrame(tick);
}
function tick(now) {
  if (!S.playing) return;
  const dt = (now - playT) / 1000;
  playT = now;
  const fps = S.tab === 'frames' ? (clip() || {}).fps : (action() || {}).fps;
  if (!fps) { setPlaying(false); return; }
  playAcc += dt;
  if (playAcc >= 1 / fps) {
    playAcc = playAcc % (1 / fps);
    if (S.tab === 'frames') S.frame = (S.frame + 1) % clip().frames.length;
    else S.poseFrame = (S.poseFrame + 1) % action().length;
    markTimeline();
    if (S.tab === 'pose') renderPanel();
    requestDraw();
  }
  requestAnimationFrame(tick);
}
// Move the highlight without rebuilding the strip (keeps thumbnails).
function markTimeline() {
  const cur = S.tab === 'frames' ? S.frame : S.poseFrame;
  document.querySelectorAll('#strip [data-v]').forEach(b => b.classList.toggle('on', +b.dataset.v === cur));
  const on = document.querySelector('#strip .on'), ns = $('#strip');
  if (on && ns) { const l = on.offsetLeft - ns.offsetLeft; if (l < ns.scrollLeft || l + on.offsetWidth > ns.scrollLeft + ns.clientWidth) ns.scrollLeft = l - 20; }
}

// ---------- actions ----------
const ACTS = {
  undo, redo,
  help: showHelp,
  new: showNew,
  open: () => $('#file').click(),
  save: downloadProject,
  export: showExport,
  tab: v => setTab(v),
  tool: v => { S.tool = v; renderTools(); requestDraw(); },
  rigtool: v => { S.rigTool = v; renderTools(); requestDraw(); },
  mirror: () => { S.mirror = !S.mirror; renderTools(); toast(S.mirror ? 'Mirror on: edits copy across the middle (x)' : 'Mirror off'); },
  layer: () => toggleLayer(),
  none: () => {},
  color: v => { S.color = +v; renderTools(); renderPanel(); },
  addcolor: () => {
    if (S.doc.palette.length > G.MAX_COLORS) return;
    checkpoint();
    S.doc.palette.push(S.doc.palette[S.color] || '#ffffff');
    S.color = S.doc.palette.length - 1;
    changed(true);
    toast('Added a colour. Change it with the picker below the palette.');
  },
  delcolor: () => {
    const d = S.doc, c = S.color;
    if (d.palette.length <= 2) return;
    const grids = [d.model].concat(...d.clips.map(k => k.frames));
    if (grids.some(g => g.includes(c))) { toast('That colour is in use. Paint over it first.'); return; }
    checkpoint();
    d.palette.splice(c, 1);
    // Everything above the removed colour moves down one.
    d.model = shiftColors(d.model, c);
    for (const k of d.clips) k.frames = k.frames.map(g => shiftColors(g, c));
    S.color = Math.max(1, c - 1);
    changed(true);
  },
  nudge: v => {
    const [dx, dy, dz] = v.split(',').map(Number);
    const t = editTarget();
    if (!t) return;
    checkpoint();
    t.owner[t.key] = G.shiftGrid(t.owner[t.key], S.doc.size, dx, dy, dz);
    if (S.tab === 'model') S.doc.rig.skin = G.shiftGrid(S.doc.rig.skin, S.doc.size, dx, dy, dz);
    changed(true);
  },
  flip: () => {
    const t = editTarget();
    if (!t) return;
    checkpoint();
    t.owner[t.key] = G.flipX(t.owner[t.key], S.doc.size);
    if (S.tab === 'model') S.doc.rig.skin = G.flipX(S.doc.rig.skin, S.doc.size);
    changed(true);
  },
  clear: () => {
    const t = editTarget();
    if (!t) return;
    checkpoint();
    t.owner[t.key] = G.makeGrid(S.doc.size);
    changed(true);
    toast('Cleared. Undo with Ctrl+Z.');
  },
  // clips
  newclip: v => {
    checkpoint();
    const d = S.doc;
    d.clips.push({ name: 'Clip ' + (d.clips.length + 1), fps: 8, frames: [v === 'empty' ? G.makeGrid(d.size) : d.model.slice()] });
    S.clip = d.clips.length - 1; S.frame = 0;
    changed(true);
  },
  dupclip: () => {
    const c = clip(); if (!c) return;
    checkpoint();
    S.doc.clips.splice(S.clip + 1, 0, { name: c.name + ' copy', fps: c.fps, frames: c.frames.slice() });
    S.clip++;
    changed(true);
  },
  delclip: () => {
    const c = clip(); if (!c) return;
    checkpoint();
    S.doc.clips.splice(S.clip, 1);
    fixSelection();
    changed(true);
    toast(`Deleted “${c.name}”. Undo with Ctrl+Z.`);
  },
  framefrommodel: () => { const c = clip(); if (!c) return; checkpoint(); c.frames[S.frame] = S.doc.model.slice(); changed(true); },
  frame: v => { S.frame = +v; if (S.playing) setPlaying(false); markTimeline(); requestDraw(); updateStatus(); },
  addframe: () => { const c = clip(); if (!c) return; checkpoint(); c.frames.splice(S.frame + 1, 0, c.frames[S.frame].slice()); S.frame++; changed(true); },
  blankframe: () => { const c = clip(); if (!c) return; checkpoint(); c.frames.splice(S.frame + 1, 0, G.makeGrid(S.doc.size)); S.frame++; changed(true); },
  delframe: () => { const c = clip(); if (!c || c.frames.length < 2) return; checkpoint(); c.frames.splice(S.frame, 1); S.frame = Math.min(S.frame, c.frames.length - 1); changed(true); },
  moveframe: v => {
    const c = clip(); if (!c) return;
    const j = S.frame + +v;
    if (j < 0 || j >= c.frames.length) return;
    checkpoint();
    const f = c.frames.splice(S.frame, 1)[0];
    c.frames.splice(j, 0, f);
    S.frame = j;
    changed(true);
  },
  play: () => setPlaying(!S.playing),
  // rig
  bone: v => { S.bone = v === '' ? null : +v; renderPanel(); requestDraw(); },
  autoskin: () => {
    checkpoint();
    writable(S.doc.rig, 'skin');
    const n = R.autoSkin(S.doc.rig, S.doc.model, S.doc.size);
    S.showSkin = true;
    changed(true);
    toast(`Gave ${n} voxels to their nearest bone`);
  },
  clearskin: () => { checkpoint(); S.doc.rig.skin = G.makeGrid(S.doc.size); changed(true); },
  mirrorbone: () => {
    if (!S.bone) return;
    checkpoint();
    writable(S.doc.rig, 'skin');
    const b = R.mirrorBone(S.doc.rig, S.doc.size, S.bone, S.doc.model);
    if (b) { S.bone = b.id; toast(`Added ${b.name}`); }
    changed(true);
  },
  delbone: () => {
    if (!S.bone) return;
    checkpoint();
    writable(S.doc.rig, 'skin');
    const id = S.bone, b = S.doc.rig.bones.find(o => o.id === id);
    R.removeBone(S.doc.rig, id);
    for (const a of S.doc.actions) for (const k of a.keys) delete k.pose[id];
    S.bone = b && b.parent != null ? b.parent : null;
    changed(true);
  },
  // pose
  poseframe: v => { S.poseFrame = +v; if (S.playing) setPlaying(false); markTimeline(); renderPanel(); requestDraw(); },
  newaction: () => {
    checkpoint();
    S.doc.actions.push({ name: 'Action ' + (S.doc.actions.length + 1), length: 8, fps: 8, loop: true, keys: [] });
    S.action = S.doc.actions.length - 1; S.poseFrame = 0;
    changed(true);
  },
  dupaction: () => {
    const a = action(); if (!a) return;
    checkpoint();
    S.doc.actions.splice(S.action + 1, 0, { ...G.snapshot(a), name: a.name + ' copy' });
    S.action++;
    changed(true);
  },
  delaction: () => {
    const a = action(); if (!a) return;
    checkpoint();
    S.doc.actions.splice(S.action, 1);
    fixSelection();
    changed(true);
    toast(`Deleted “${a.name}”. Undo with Ctrl+Z.`);
  },
  resetbone: () => { if (S.bone) editPose(null, p => { p[S.bone] = { q: R.QI(), t: [0, 0, 0] }; }); },
  resetpose: () => editPose(null, p => { for (const k of Object.keys(p)) delete p[k]; }),
  addkey: () => editPose(null, () => {}),
  delkey: () => {
    const a = action(); if (!a) return;
    const i = a.keys.findIndex(k => k.frame === S.poseFrame);
    if (i < 0) return;
    checkpoint();
    a.keys.splice(i, 1);
    changed(true);
  },
  copypose: () => { S.clipboard = R.clonePose(currentPose()); renderPanel(); toast('Pose copied'); },
  pastepose: () => { if (S.clipboard) editPose(null, p => { for (const k of Object.keys(p)) delete p[k]; Object.assign(p, R.clonePose(S.clipboard)); }); },
  mirrorpose: () => editPose(null, p => {
    const src = R.clonePose(p), bones = S.doc.rig.bones;
    for (const k of Object.keys(p)) delete p[k];
    for (const b of bones) {
      const twin = bones.find(o => o !== b && o.name === R.mirrorName(b.name)) || b;
      const e = src[twin.id];
      // Mirroring across x: x rotation stays, y and z rotations flip, x offset flips.
      if (e) p[b.id] = { q: [e.q[0], -e.q[1], -e.q[2], e.q[3]], t: [-e.t[0], e.t[1], e.t[2]] };
    }
  }),
  bake: () => {
    const a = action(); if (!a) return;
    const frames = R.bakeAction(S.doc.model, S.doc.rig, S.doc.size, a);
    checkpoint();
    let i = S.doc.clips.findIndex(c => c.name === a.name);
    if (i >= 0) S.doc.clips[i] = { name: a.name, fps: a.fps, frames };
    else { S.doc.clips.push({ name: a.name, fps: a.fps, frames }); i = S.doc.clips.length - 1; }
    S.clip = i; S.frame = 0;
    changed(true);
    toast(`Baked ${frames.length} frames into the clip “${a.name}”. Open Frames to touch them up.`, 'Open Frames', () => setTab('frames'));
  },
};
function shiftColors(g, c) {
  const o = g.slice();
  for (let i = 0; i < o.length; i++) if (o[i] > c) o[i]--;
  return o;
}
function toggleLayer() {
  if (S.layer == null) {
    // Start on the layer under the cursor, or the lowest layer.
    S.layer = S.hover && (S.hover.add || S.hover.cell) ? (S.hover.add || S.hover.cell)[1] : 0;
  } else S.layer = null;
  S.hover = null;
  renderTools(); renderPanel(); requestDraw();
  if (S.layer != null) toast('Layer mode: only layers up to this one show. [ and ] move between layers.');
}

document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]');
  if (!b || b.disabled) return;
  const f = ACTS[b.dataset.act];
  if (f) f(b.dataset.v);
});
document.querySelectorAll('.tab').forEach(b => b.addEventListener('click', () => setTab(b.dataset.tab)));
$('#viewbar').addEventListener('click', e => {
  const b = e.target.closest('[data-view]');
  if (!b) return;
  const v = b.dataset.view;
  const presets = { iso: [0.65, 0.5], front: [0, 0], side: [Math.PI / 2, 0], top: [0, 1.55] };
  if (presets[v]) { [S.cam.yaw, S.cam.pitch] = presets[v]; frameCamera(); }
  if (v === 'persp') S.cam.ortho = !S.cam.ortho;
  if (v === 'edges') S.edges = !S.edges;
  renderChrome();
  requestDraw();
  lastThumbCam = null; refreshThumbs();
});
$('#pname').addEventListener('change', e => { checkpoint(); S.doc.name = e.target.value.trim().slice(0, 60) || 'Untitled'; changed(false); });

// Form fields in the side panel.
function onField(e) {
  const el = e.target, f = el.dataset.field;
  if (!f) return;
  const d = S.doc, live = e.type === 'input';
  const b = d.rig.bones.find(o => o.id === S.bone);
  const a = action(), c = clip();
  const num = (lo, hi) => { const v = Number(el.value); return Number.isFinite(v) ? clamp(v, lo, hi) : null; };
  switch (f) {
    case 'palcolor':
      if (!G.isHex(el.value)) return;
      checkpoint('pal' + S.color);
      d.palette[S.color] = el.value.toLowerCase();
      changed(false);
      document.querySelector(`.sw[data-v="${S.color}"]`).style.background = el.value;
      $('.cur-color') && ($('.cur-color').style.background = el.value);
      if (!live) panelDirty = true;
      return;
    case 'layer': S.layer = +el.value; el.nextElementSibling.textContent = S.layer; requestDraw(); return;
    case 'clip': if (live) return; S.clip = +el.value; S.frame = 0; panelDirty = true; requestDraw(); return;
    case 'clipname': if (live || !c) return; checkpoint(); c.name = el.value.trim().slice(0, 40) || c.name; changed(true); return;
    case 'clipfps': { if (live || !c) return; const v = num(1, 60); if (v == null) return; checkpoint(); c.fps = Math.round(v); changed(true); return; }
    case 'onion': S.onion = el.checked; requestDraw(); return;
    case 'showskin': S.showSkin = el.checked; requestDraw(); return;
    case 'bonename': if (live || !b) return; checkpoint(); b.name = el.value.trim().slice(0, 30) || b.name; changed(true); return;
    case 'boneparent': if (!b) return; checkpoint(); b.parent = el.value === '' ? null : +el.value; changed(true); return;
    case 'bonecolor': if (!b || !G.isHex(el.value)) return; checkpoint('bc' + b.id); b.color = el.value; changed(!live); return;
    case 'head': case 'tail': {
      if (!b) return;
      const v = num(-64, 128); if (v == null) return;
      checkpoint(f + b.id + el.dataset.a);
      b[f] = b[f].slice(); b[f][+el.dataset.a] = v;
      changed(!live);
      return;
    }
    case 'action': if (live) return; S.action = +el.value; S.poseFrame = 0; panelDirty = true; requestDraw(); return;
    case 'actname': if (live || !a) return; checkpoint(); a.name = el.value.trim().slice(0, 40) || a.name; changed(true); return;
    case 'actlen': {
      if (live || !a) return;
      const v = num(1, 240); if (v == null) return;
      checkpoint();
      a.length = Math.round(v);
      a.keys = a.keys.filter(k => k.frame < a.length);
      S.poseFrame = Math.min(S.poseFrame, a.length - 1);
      changed(true);
      return;
    }
    case 'actfps': { if (live || !a) return; const v = num(1, 60); if (v == null) return; checkpoint(); a.fps = Math.round(v); changed(true); return; }
    case 'actloop': if (!a) return; checkpoint(); a.loop = el.checked; changed(true); return;
    case 'rot': {
      if (!b) return;
      const v = num(-180, 180); if (v == null) return;
      const ax = +el.dataset.a;
      editPose('rot' + b.id + ax, pose => {
        const ent = boneEntry(pose, b.id);
        const eu = R.qToEuler(ent.q);
        eu[ax] = v;
        ent.q = R.qFromEuler(eu);
      });
      return;
    }
    case 'off': {
      if (!b) return;
      const v = num(-64, 64); if (v == null) return;
      editPose('off' + b.id + el.dataset.a, pose => { const ent = boneEntry(pose, b.id); ent.t = ent.t.slice(); ent.t[+el.dataset.a] = v; });
      return;
    }
  }
}
// Rebuilding the panel while someone drags a slider would drop the drag, so live edits only redraw.
const panelEl = $('#panel');
panelEl.addEventListener('input', e => {
  if (e.target.dataset.field === 'rot') {
    const keep = renderPanel;
    renderPanel = syncRot;
    onField(e);
    renderPanel = keep;
    return;
  }
  if (e.target.type === 'range' || e.target.type === 'color') onField(e);
});
panelEl.addEventListener('change', e => { onField(e); if (panelDirty) requestDraw(); });
// While a rotation slider moves, only update its twin number box.
function syncRot() {
  const b = S.doc.rig.bones.find(o => o.id === S.bone);
  if (!b) return;
  const ent = currentPose()[b.id];
  if (!ent) return;
  const e = R.qToEuler(ent.q);
  document.querySelectorAll('[data-field=rot]').forEach(el => { if (el !== document.activeElement) el.value = Math.round(e[+el.dataset.a]); });
}

// ---------- keyboard ----------
document.addEventListener('keydown', e => {
  const typing = /^(INPUT|SELECT|TEXTAREA)$/.test(document.activeElement && document.activeElement.tagName) && document.activeElement.type !== 'range' && document.activeElement.type !== 'checkbox';
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { if (typing) return; e.preventDefault(); e.shiftKey ? redo() : undo(); return; }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') { if (typing) return; e.preventDefault(); redo(); return; }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); downloadProject(); return; }
  if (typing || e.ctrlKey || e.metaKey || e.altKey) return;
  if (!$('#modal').hidden) { if (e.key === 'Escape') closeModal(); return; }
  const k = e.key.toLowerCase();
  const tabs = { 1: 'model', 2: 'frames', 3: 'rig', 4: 'pose' };
  if (tabs[k]) { setTab(tabs[k]); return; }
  if (toolsTab()) {
    const tools = { b: 'add', e: 'erase', p: 'paint', f: 'fill', i: 'pick' };
    if (tools[k]) { ACTS.tool(tools[k]); return; }
    if (k === 'l') { toggleLayer(); return; }
    if ((k === '[' || k === ']') && S.layer != null) { S.layer = clamp(S.layer + (k === ']' ? 1 : -1), 0, S.doc.size[1] - 1); renderPanel(); requestDraw(); return; }
  }
  if (S.tab === 'rig') { if (k === 'b') return ACTS.rigtool('bone'); if (k === 'p') return ACTS.rigtool('skin'); }
  if (k === 'm' && S.tab !== 'pose') { ACTS.mirror(); return; }
  if (k === ' ' && (S.tab === 'frames' || S.tab === 'pose')) { e.preventDefault(); setPlaying(!S.playing); return; }
  if (k === ',' || k === '.') {
    const dir = k === '.' ? 1 : -1;
    if (S.tab === 'frames' && clip()) ACTS.frame((S.frame + dir + clip().frames.length) % clip().frames.length);
    if (S.tab === 'pose' && action()) ACTS.poseframe((S.poseFrame + dir + action().length) % action().length);
  }
});

// ---------- dialogs ----------
function modal(title, body, buttons) {
  const m = $('#modal');
  m.innerHTML = `<div class="dlg" role="dialog" aria-label="${esc(title)}"><h2>${esc(title)}</h2><div class="body">${body}</div><div class="foot">${buttons.map((b, i) => `<button class="btn${b.pri ? ' pri' : ''}" data-mb="${i}">${esc(b.label)}</button>`).join('')}</div></div>`;
  m.hidden = false;
  m.onclick = e => {
    if (e.target === m) { closeModal(); return; }
    const b = e.target.closest('[data-mb]');
    if (b) { const fn = buttons[+b.dataset.mb].fn; if (!fn || fn() !== false) closeModal(); }
  };
  return m;
}
function closeModal() { $('#modal').hidden = true; $('#modal').innerHTML = ''; }
function showHelp() {
  modal('Voxel Studio', `<p>Build a voxel model, then animate it like pixel art: every frame is a whole grid of voxels, so animation means switching voxels on, off and to other colours, never sliding parts around.</p>
    <p><b>Frames</b> lets you draw each frame by hand. <b>Rig</b> and <b>Pose</b> let you add bones, pose them on a few key frames, and bake the in-betweens into voxel frames you can touch up.</p>
    <dl class="keys">
      <dt><kbd>Drag</kbd></dt><dd>Use the current tool. Dragging empty space orbits.</dd>
      <dt><kbd>Right-drag</kbd> / <kbd>Alt</kbd>+drag</dt><dd>Orbit (add Shift to pan)</dd>
      <dt><kbd>Middle-drag</kbd></dt><dd>Pan</dd>
      <dt><kbd>Wheel</kbd> / pinch</dt><dd>Zoom. Two fingers also orbit.</dd>
      <dt><kbd>B</kbd> <kbd>E</kbd> <kbd>P</kbd> <kbd>F</kbd> <kbd>I</kbd></dt><dd>Add, erase, paint, fill, pick colour</dd>
      <dt><kbd>M</kbd></dt><dd>Mirror edits across the middle</dd>
      <dt><kbd>L</kbd>, <kbd>[</kbd> <kbd>]</kbd></dt><dd>Edit one layer at a time; move between layers</dd>
      <dt><kbd>1</kbd>–<kbd>4</kbd></dt><dd>Model, Frames, Rig, Pose</dd>
      <dt><kbd>Space</kbd>, <kbd>,</kbd> <kbd>.</kbd></dt><dd>Play, previous and next frame</dd>
      <dt><kbd>Ctrl+Z</kbd>, <kbd>Ctrl+Shift+Z</kbd></dt><dd>Undo, redo</dd>
      <dt><kbd>Ctrl+S</kbd></dt><dd>Save the project file</dd>
    </dl>
    <p>Your work is kept in this browser automatically. Save downloads a project file you can open again anywhere.</p>`, [{ label: 'Got it', pri: true }]);
}
function showNew() {
  modal('New project', `<p>Pick the size of the grid. Leave room around the model if you plan to pose it: limbs swing outward.</p>
    <div class="presets"><button class="btn sm" data-p="16,16,16">16³</button><button class="btn sm" data-p="24,32,16">24×32×16</button><button class="btn sm" data-p="32,32,32">32³</button><button class="btn sm" data-p="48,48,48">48³</button></div>
    <div class="row"><span class="lbl">Name</span><input type="text" id="nName" value="Untitled" maxlength="60"></div>
    <div class="row"><span class="lbl">Size</span><div class="vec"><input type="number" id="nX" min="1" max="${G.MAX_SIZE}" value="24" title="Width (x)"><input type="number" id="nY" min="1" max="${G.MAX_SIZE}" value="32" title="Height (y)"><input type="number" id="nZ" min="1" max="${G.MAX_SIZE}" value="16" title="Depth (z)"></div></div>
    <p class="note">Width × height × depth, up to ${G.MAX_SIZE} each. Your current project is replaced (save it first if you want to keep it).</p>`, [
    { label: 'Load the example', fn: () => { loadDoc(window.VXDemo.demoProject()); toast('Loaded the example adventurer'); } },
    { label: 'Cancel' },
    { label: 'Create', pri: true, fn: () => {
      const size = G.clampSize([$('#nX').value, $('#nY').value, $('#nZ').value]);
      loadDoc(G.newProject(size, $('#nName').value.trim() || 'Untitled'));
      setTab('model');
    } },
  ]);
  document.querySelectorAll('[data-p]').forEach(b => b.addEventListener('click', () => {
    const [x, y, z] = b.dataset.p.split(',');
    $('#nX').value = x; $('#nY').value = y; $('#nZ').value = z;
  }));
}
function fileName(ext) { return (S.doc.name || 'voxels').replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-').toLowerCase() + ext; }
function download(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}
function downloadProject() {
  download(new Blob([JSON.stringify(G.serialize(S.doc))], { type: 'application/json' }), fileName('.voxel.json'));
  toast('Saved ' + fileName('.voxel.json'));
}
$('#file').addEventListener('change', e => {
  const f = e.target.files[0];
  e.target.value = '';
  if (!f) return;
  f.text().then(txt => {
    try { loadDoc(G.deserialize(txt)); setTab('model'); toast('Opened ' + f.name); }
    catch (err) { toast('Could not open that file: ' + err.message); }
  });
});
function exportSources() {
  const d = S.doc, out = [{ id: 'model', label: 'Model (1 frame)', frames: () => [d.model] }];
  d.clips.forEach((c, i) => out.push({ id: 'clip' + i, label: `Clip: ${c.name} (${c.frames.length})`, frames: () => c.frames }));
  if (d.rig.bones.length) d.actions.forEach((a, i) => out.push({ id: 'act' + i, label: `Action, baked: ${a.name} (${a.length})`, frames: () => R.bakeAction(d.model, d.rig, d.size, a) }));
  return out;
}
let exportKind = 'png';
const exportTabs = () => `<div class="presets"><button class="btn sm${exportKind === 'png' ? ' pri' : ''}" data-xk="png">Sprite sheet (.png)</button><button class="btn sm${exportKind === 'glb' ? ' pri' : ''}" data-xk="glb">3D model (.glb)</button></div>`;
function bindExportTabs() {
  document.querySelectorAll('[data-xk]').forEach(b => b.addEventListener('click', () => { exportKind = b.dataset.xk; showExport(); }));
}
function showExport() {
  if (exportKind === 'glb') { showExportGLB(); return; }
  const src = exportSources();
  const def = S.tab === 'frames' && clip() ? 'clip' + S.clip : S.tab === 'pose' && action() ? 'act' + S.action : 'model';
  modal('Export', `${exportTabs()}<p>Renders frames from the current camera angle into one PNG, left to right, ready for a 2D game. To keep the voxels themselves, use Save.</p>
    <div class="row"><span class="lbl">Frames</span><select id="xSrc">${src.map(s => `<option value="${s.id}"${s.id === def ? ' selected' : ''}>${esc(s.label)}</option>`).join('')}</select></div>
    <div class="row"><span class="lbl">Cell</span><select id="xSize"><option value="64">64 px</option><option value="128" selected>128 px</option><option value="256">256 px</option><option value="512">512 px</option></select></div>
    <div class="row"><span class="lbl">Columns</span><input type="number" id="xCols" min="1" max="64" value="0" title="0 puts every frame in one row"><label>0 = one row</label></div>
    <div class="row"><label class="chk"><input type="checkbox" id="xEdges"${S.edges ? ' checked' : ''}>Voxel outlines</label><label class="chk"><input type="checkbox" id="xBg">Solid background</label></div>`, [
    { label: 'Cancel' },
    { label: 'Download PNG', pri: true, fn: () => {
      const s = src.find(o => o.id === $('#xSrc').value) || src[0];
      const frames = s.frames(), cell = +$('#xSize').value;
      let cols = Math.round(+$('#xCols').value) || frames.length;
      cols = clamp(cols, 1, frames.length);
      const rows = Math.ceil(frames.length / cols);
      const c = document.createElement('canvas');
      c.width = cell * cols; c.height = cell * rows;
      const x = c.getContext('2d');
      const sz = S.doc.size;
      const cam = { yaw: S.cam.yaw, pitch: S.cam.pitch, ortho: S.cam.ortho, zoom: V.fitZoom(sz, cell, cell, 1.02), target: [sz[0] / 2, sz[1] / 2, sz[2] / 2] };
      const bg = $('#xBg').checked ? '#14172a' : null, edges = $('#xEdges').checked;
      frames.forEach((g, i) => {
        x.save();
        x.translate((i % cols) * cell, Math.floor(i / cols) * cell);
        x.beginPath(); x.rect(0, 0, cell, cell); x.clip();
        if (bg) { x.fillStyle = bg; x.fillRect(0, 0, cell, cell); }
        V.draw(x, cell, cell, { grid: g, palette: S.doc.palette, size: sz, cam, edges, floor: false });
        x.restore();
      });
      c.toBlob(b => { download(b, fileName('-sheet.png')); toast(`Exported ${frames.length} frame${frames.length === 1 ? '' : 's'}`); });
    } },
  ]);
  bindExportTabs();
}
function showExportGLB() {
  const d = S.doc;
  const baked = d.rig.bones.length && d.actions.length;
  modal('Export', `${exportTabs()}<p>A glTF binary file for Blender, Unity, Godot, three.js and the like. Faces are merged and coloured with vertex colours. The model is centred on the origin, standing on the ground, facing +z.</p>
    <p>Each clip becomes an animation that shows one frame at a time: every frame is its own mesh, switched on and off with stepped scale keys, so the voxel-art look survives.</p>
    <div class="row"><span class="lbl">Include</span><select id="gInc">
      <option value="model">The model only</option>
      <option value="clips"${d.clips.length ? ' selected' : ' disabled'}>Model and clips (${d.clips.length})</option>
      ${baked ? `<option value="all">Model, clips and baked actions (${d.clips.length + d.actions.length})</option>` : ''}
    </select></div>
    <div class="row"><span class="lbl">Voxel</span><select id="gScale"><option value="0.0625">6.25 cm (16 per metre)</option><option value="0.1" selected>10 cm</option><option value="0.25">25 cm</option><option value="1">1 m</option></select></div>
    <div class="row"><label class="chk"><input type="checkbox" id="gUnlit">Flat colours, no lighting (KHR_materials_unlit)</label></div>`, [
    { label: 'Cancel' },
    { label: 'Download .glb', pri: true, fn: () => {
      const inc = $('#gInc').value;
      const tracks = [];
      if (inc !== 'model') for (const c of d.clips) tracks.push({ name: c.name, fps: c.fps, frames: c.frames });
      if (inc === 'all') {
        const names = new Set(tracks.map(t => t.name));
        for (const a of d.actions) tracks.push({ name: names.has(a.name) ? a.name + ' (baked)' : a.name, fps: a.fps, frames: R.bakeAction(d.model, d.rig, d.size, a) });
      }
      const bytes = window.VXGlb.exportGLB(d, tracks, { scale: +$('#gScale').value, unlit: $('#gUnlit').checked });
      download(new Blob([bytes], { type: 'model/gltf-binary' }), fileName('.glb'));
      toast(`Exported ${fileName('.glb')} (${Math.ceil(bytes.length / 1024)} KB, ${tracks.length} animation${tracks.length === 1 ? '' : 's'})`);
    } },
  ]);
  bindExportTabs();
}

let toastTimer = 0;
function toast(msg, actLabel, actFn) {
  const t = $('#toast');
  t.innerHTML = esc(msg) + (actLabel ? ` <button class="btn sm" style="margin-left:8px">${esc(actLabel)}</button>` : '');
  t.style.pointerEvents = actLabel ? 'auto' : 'none';
  if (actLabel) t.querySelector('button').onclick = () => { t.classList.remove('on'); actFn(); };
  t.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.classList.remove('on'); t.style.pointerEvents = 'none'; }, actLabel ? 5000 : 2600);
}

// ---------- start ----------
function start() {
  let doc = null;
  try { const s = localStorage.getItem(STORE); if (s) doc = G.deserialize(s); } catch (e) { doc = null; }
  const first = !doc;
  loadDoc(doc || window.VXDemo.demoProject());
  setTab('model');
  window.addEventListener('resize', resize);
  if (window.ResizeObserver) new ResizeObserver(resize).observe($('#stage'));
  resize();
  frameCamera();
  requestDraw();
  if (first) setTimeout(() => toast('This is an example to play with. New starts a blank grid; ? shows the controls.'), 400);
}
// For tests and the console.
window.__vs = { S, ACTS, setTab, undo, redo, pickAt, G, R, V, loadDoc };
start();
})();
