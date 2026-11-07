// DOM panels: colonist cards, the inspector (every simulation number is visible), and drawers for work
// priorities, crafting bills, the chronicle and goals. Panels never write simulation state; they call
// sim.command().
import { describe, unitNutrition, stackKg, invKg } from '../sim/stacks.js';
import { massOf, bmrKcalDay, GLYCOGEN_MAX, clothing } from '../sim/systems/physiology.js';
import { airTemp, feltTemp, windExposure, lightAt, outdoorTemp } from '../sim/systems/environment.js';
import { carryCapacity } from '../sim/systems/actions.js';
import { DAMAGE } from '../data/bodies.js';
import { GOALS } from '../game/goals.js';
import { stations, billActive } from '../sim/systems/crafting.js';
import { DESIG } from '../sim/world/world.js';
import { colonyFoodKcal } from '../sim/systems/items.js';

const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const f1 = (v) => (Math.round(v * 10) / 10).toFixed(1), f0 = (v) => Math.round(v).toString(), pct = (v) => Math.round(v * 100) + '%';
const kv = (rows) => `<table class="kv">${rows.filter(Boolean).map(([k, v]) => `<tr><td>${k}</td><td class="v">${v}</td></tr>`).join('')}</table>`;
const bar = (label, v, color, text) => `<div class="bar"><i style="width:${Math.max(0, Math.min(1, v)) * 100}%;background:${color}"></i><span>${label} ${text ?? pct(v)}</span></div>`;
const needColor = (v) => v > 0.75 ? '#c0503a' : v > 0.45 ? '#c08a3a' : '#6a9a4a';
const partName = (p) => ({ head: 'head', torso: 'torso', lArm: 'left arm', rArm: 'right arm', lLeg: 'left leg', rLeg: 'right leg', neck: 'neck', fLegs: 'forelegs', hLegs: 'hind legs' }[p] || p);

// Rewriting a panel's HTML while the mouse button is down on it swallows the click (the pressed element
// is replaced before the button comes up), so skip the write then, and skip it when nothing changed.
export function setHTML(el, html) {
  if (el._html === html) return;
  if (setHTML.pressed && el.contains(setHTML.pressed)) return;
  el.innerHTML = html; el._html = html;
}

export class Panels {
  constructor(ui) { this.ui = ui; this.tab = 'needs'; this.drawer = null; }
  get sim() { return this.ui.game.sim; }

  // ---------- colonist cards
  colonists(el) {
    const s = this.sim, sel = this.ui.renderer.selected;
    const list = [...s.ents.of('settler')];
    setHTML(el, list.map(e => {
      const p = e.phys, b = e.body;
      const bars = [[p.hunger, 'Hunger'], [p.thirst, 'Thirst'], [p.sleepiness, 'Tired'], [Math.max(p.cold, p.hot), 'Temp'], [1 - (b.blood / b.bloodMax - 0.5) * 2 + b.pain * 0.5, 'Health'], [e.mind.stress / 100, 'Stress']];
      return `<div class="card ${sel === e ? 'sel' : ''}" data-id="${e.id}">
        <div class="nm"><span class="dot" style="background:${e.color}"></span>${esc(e.name)}</div>
        <div class="task">${esc(e.agent.task)}</div>
        <div class="bars">${bars.map(([v, t]) => `<div class="mbar" title="${t}"><i style="width:${Math.max(0.06, Math.min(1, v)) * 100}%;background:${needColor(v)}"></i></div>`).join('')}</div>
      </div>`;
    }).join('') + (s.dead?.length ? `<div class="card muted" style="cursor:default">Lost: ${s.dead.map(d => esc(d.name.split(' ')[0])).join(', ')}</div>` : ''));
  }

  // ---------- inspector
  inspector(el) {
    const sel = this.ui.renderer.selected, s = this.sim;
    if (!sel) { el.hidden = true; return; }
    el.hidden = false;
    let html = '';
    if (sel.kind === 'tile') html = this.tileHtml(sel.i);
    else if (sel.dead || !s.ents.get(sel.id)) { this.ui.select(null); return; }
    else if (sel.kind === 'settler') html = this.settlerHtml(sel);
    else if (sel.kind === 'animal') html = this.animalHtml(sel);
    else if (sel.kind === 'building') html = this.buildingHtml(sel) + this.tileHtml(sel.i, true);
    else html = this.tileHtml(sel.i);
    // avoid thrashing focus inside selects
    if (el.contains(document.activeElement) && document.activeElement.tagName === 'SELECT') return;
    setHTML(el, html);
  }

  settlerHtml(e) {
    const s = this.sim, p = e.phys, b = e.body, m = e.mind;
    const tabs = ['needs', 'body', 'health', 'mind', 'skills', 'gear', 'work'];
    let h = `<h2><span class="dot" style="width:12px;height:12px;border-radius:50%;background:${e.color}"></span>${esc(e.name)}<button class="x" data-act="close">×</button></h2>
      <div class="sub">${e.role ? esc(e.role) + ' · ' : ''}${e.sex === 'm' ? 'man' : 'woman'}, ${e.age} · ${e.traits.map(t => esc(s.defs.must('trait', t).name)).join(', ') || 'no traits'}</div>
      <div class="sub">${esc(e.agent.task)}${e.agent.order ? ' <button class="btn small" data-act="orderClear">clear order</button>' : ''}</div>
      <div class="tabs">${tabs.map(t => `<button data-tab="${t}" class="${this.tab === t ? 'on' : ''}">${t[0].toUpperCase() + t.slice(1)}</button>`).join('')}</div>`;
    const mass = massOf(e);
    if (this.tab === 'needs') {
      h += bar('Hunger', p.hunger, needColor(p.hunger)) + bar('Thirst', p.thirst, needColor(p.thirst)) + bar('Sleepiness', p.sleepiness, needColor(p.sleepiness))
        + bar('Cold', p.cold, '#5a8ac0') + bar('Heat', p.hot, '#c06a3a') + bar('Wet', p.wet, '#5aa0c0');
      h += `<div class="sect">Sleep</div>` + kv([['Sleep pressure', f1(p.S * 100) + '%'], ['Circadian drive', pct(p.circadian || 0)], p.asleep ? ['Sleep quality', pct(p.sleepQuality || 0)] : null,
        ['Bed', p.bedId ? 'claimed' : 'none']]);
      h += `<div class="muted" style="margin-top:8px">Body: how food, water and heat are flowing. Health: injuries, illness and what they can still do.</div>`;
    } else if (this.tab === 'body') {
      h += `<div class="muted">Physiology: where their energy, water and warmth come from and go.</div>`;
      h += `<div class="sect">Build</div>` + kv([['Height', `${f0(p.heightCm)} cm`], ['Body mass', `${f1(mass)} kg · BMI ${f1(mass / (p.heightCm / 100) ** 2)}`]]);
      h += `<div class="sect">Energy</div>` + kv([
        ['Stomach', `${f0(p.stomach.g)} g · ${f0(p.stomach.kcal)} kcal`], ['Glycogen', `${f0(p.glycogen)} / ${GLYCOGEN_MAX} kcal`],
        ['Body fat', `${f1(p.fat)} kg (${pct(p.fat / mass)})`], ['Lean mass', `${f1(p.lean)} kg (${pct(p.lean / p.leanStart)} of start)`],
        ['Basal rate', `${f0(bmrKcalDay(e))} kcal/day`],
        ['Activity', `${esc(e.agent.activity)} · ${f1(p.met)} MET`], ['Burned today', `${f0(p.kcalToday)} kcal`], ['Protein reserve', `${f0(p.protein)} g`],
        p.starving ? ['Status', '<span class="neg">STARVING</span>'] : null,
      ]);
      h += `<div class="sect">Water</div>` + kv([['Deficit', `${f1(Math.max(0, p.waterDef))} L (${f1(p.dehydPct || 0)}% of body mass)`], ['Sweating', `${f1(p.sweatLh)} L/h`]]);
      h += `<div class="sect">Heat balance</div>` + kv([
        ['Core temperature', `${p.core.toFixed(2)} °C`], ['Felt temperature', `${f1(p.feltC ?? 0)} °C`], ['Insulation', `${f1(p.clo ?? 0)} clo`],
        ['Wind at body', `${f1(p.windAtBody ?? 0)} m/s`], ['Heat made', `${f0(p.heatW)} W${p.shiverW > 5 ? ` (shivering ${f0(p.shiverW)} W)` : ''}`], ['Heat lost', `${f0(p.lossW)} W`],
      ]);
    } else if (this.tab === 'health') {
      const caps = b.caps;
      h += `<div class="muted">Injuries and illness, and what they leave the person able to do.</div>`;
      h += `<div class="sect">Capacities</div>` + Object.entries(caps).map(([k, v]) => bar(k[0].toUpperCase() + k.slice(1), v, v > 0.8 ? '#6a9a4a' : v > 0.5 ? '#c08a3a' : '#c0503a')).join('');
      h += `<div class="sect">Blood and pain</div>` + kv([['Blood', `${f0(b.blood)} / ${f0(b.bloodMax)} ml (${pct(b.blood / b.bloodMax)})`], ['Bleeding', `${f1(b.bleedRate || 0)} ml/min`],
        ['Pain', pct(b.pain)], ['Organ damage', pct(b.organ)], ['Conscious', b.conscious ? 'yes' : '<span class="neg">no</span>']]);
      h += `<div class="sect">Body parts</div>` + kv(Object.entries(b.parts).map(([k, v]) => [partName(k), `${f1(Math.max(0, v.hp))} / ${v.max}`]));
      h += `<div class="sect">Wounds</div>` + (b.wounds.length ? `<ul class="list">${b.wounds.map(w => `<li><span>${esc(DAMAGE[w.type].name)} on ${partName(w.part)}${w.source ? ` <span class="muted">(${esc(w.source)})</span>` : ''}</span><span>${f1(w.sev)} hp${w.bleed > 0.05 ? ` · <span class="neg">${f1(w.bleed)} ml/min</span>` : ''}${w.inf > 0 ? ` · <span class="neg">infection ${pct(w.inf)}</span>` : ''}${w.treated ? ' · <span class="pos">dressed</span>' : ''}</span></li>`).join('')}</ul>` : '<div class="muted">None</div>');
      h += `<div class="sect">Illness</div>` + (b.conds.length ? `<ul class="list">${b.conds.map(c => `<li><span>${esc(s.defs.must('condition', c.id).name)}</span><span>${c.sev > 0 ? 'severity ' + pct(c.sev) : 'incubating'} · ${f0(c.t)} h</span></li>`).join('')}</ul>` : '<div class="muted">None</div>');
    } else if (this.tab === 'mind') {
      h += bar('Stress', m.stress / 100, m.stress > 70 ? '#c0503a' : '#a07a3a', f0(m.stress));
      h += kv([['Mood', `<span class="${m.mood >= 0 ? 'pos' : 'neg'}">${m.mood > 0 ? '+' : ''}${f0(m.mood)}</span>`], m.breakdown ? ['Breakdown', esc(m.breakdown.type)] : null]);
      h += `<div class="sect">Feelings</div><ul class="list">${[...m.states, ...m.thoughts.map(t => ({ ...t, text: s.defs.must('thought', t.id).text }))].map(t => `<li><span>${esc(t.text)}</span><span class="${t.mood >= 0 ? 'pos' : 'neg'}">${t.mood > 0 ? '+' : ''}${t.mood}</span></li>`).join('') || '<li class="muted">Nothing in particular</li>'}</ul>`;
      h += `<div class="sect">Traits</div><ul class="list">${e.traits.map(t => { const d = s.defs.must('trait', t); return `<li><span>${esc(d.name)}</span><span class="muted">${esc(d.desc)}</span></li>`; }).join('')}</ul>`;
      if (e.backstory) h += `<div class="sect">Before</div><div class="muted">${esc(e.backstory)}</div>`;
    } else if (this.tab === 'skills') {
      h += Object.entries(e.skills).sort((a, b) => b[1].lvl - a[1].lvl).map(([k, v]) => { const next = 400 * (v.lvl + 1) ** 2, cur = 400 * v.lvl ** 2; return bar(s.defs.must('skill', k).name, (v.xp - cur) / (next - cur), '#7a6a3a', `${v.lvl}`); }).join('');
    } else if (this.tab === 'gear') {
      const cl = clothing(s, e);
      h += `<div class="sect">Worn (${f1(cl.clo)} clo)</div><ul class="list">${Object.entries(e.equip).map(([slot, st]) => `<li><span class="muted">${slot}</span><span>${st ? esc(s.defs.must('item', st.item).name) : '—'}</span></li>`).join('')}</ul>`;
      const kg = invKg(s.defs, e.inv);
      h += `<div class="sect">Carrying ${f1(kg)} / ${f1(carryCapacity(s, e))} kg</div><ul class="list">${e.inv.map(st => { const d = s.defs.must('item', st.item); return `<li><span>${esc(describe(s.defs, st))}${st.fresh !== undefined ? ` <span class="muted">${pct(Math.max(0, st.fresh))} fresh</span>` : ''}</span><span>${d.wear ? `<button class="btn small" data-act="wear" data-item="${st.item}">wear</button> ` : ''}${f1(stackKg(s.defs, st))} kg</span></li>`; }).join('') || '<li class="muted">Nothing</li>'}</ul>`;
    } else if (this.tab === 'work') {
      h += `<div class="muted">1 is highest priority, 0 means never.</div><table class="kv">${s.defs.all('labor').map(l => { const v = e.agent.prio[l.id] ?? 2; return `<tr><td>${esc(l.name)}${l.skill ? ` <span class="muted">(${e.skills[l.skill].lvl})</span>` : ''}</td><td><button class="pr p${v}" data-act="prio" data-labor="${l.id}" data-id="${e.id}">${v || '–'}</button></td></tr>`; }).join('')}</table>`;
    }
    h += `<div class="row muted" style="margin-top:8px;font-size:12px">Right-click a hex to send ${esc(e.name.split(' ')[0])} there.</div>`;
    return h;
  }

  animalHtml(a) {
    const s = this.sim, d = s.defs.must('fauna', a.species), b = a.body;
    return `<h2>${esc(d.name)}<button class="x" data-act="close">×</button></h2>
      <div class="sub">${a.sex === 'm' ? 'male' : 'female'} · ${f0(a.massKg)} kg · ${esc(a.animal.state)}</div>
      <div class="row"><button class="btn ${a.hunt ? 'on' : ''}" data-act="hunt">${a.hunt ? 'Marked for hunting' : 'Hunt this animal'}</button></div>
      ${bar('Hunger', Math.min(1, a.animal.hunger), needColor(a.animal.hunger))}
      ${kv([['Blood', `${f0(b.blood)} / ${f0(b.bloodMax)} ml`], ['Bleeding', `${f1(b.bleedRate || 0)} ml/min`], ['Moving', pct(b.caps.moving)], ['Diet', d.diet], ['Flight distance', `${d.flight} hexes`], ['Top speed', `${d.run} m/s`]])}
      <div class="sect">Wounds</div>${b.wounds.length ? `<ul class="list">${b.wounds.map(w => `<li><span>${DAMAGE[w.type].name} on ${partName(w.part)}</span><span>${f1(w.sev)} hp</span></li>`).join('')}</ul>` : '<div class="muted">None</div>'}`;
  }

  buildingHtml(bd) {
    const s = this.sim, d = s.defs.must('structure', bd.def);
    let h = `<h2>${esc(d.name)}<button class="x" data-act="close">×</button></h2>`;
    if (d.fire) h += kv([['Fire', bd.lit ? '<span class="pos">burning</span>' : 'out'], ['Fuel', `${f1(bd.fuel)} / ${d.fire.maxKg} kg (~${f1(bd.fuel / d.fire.burnKgH)} h)`], ['Heat output', `${d.fire.heatKW} kW at full`]])
      + `<div class="row"><button class="btn ${bd.keepLit !== false ? 'on' : ''}" data-act="keepLit">${bd.keepLit !== false ? 'Keeping it lit' : 'Let it burn out'}</button></div>`;
    if (d.bed) { const owner = [...s.ents.of('settler')].find(e => e.phys.bedId === bd.id); h += kv([['Owner', owner ? esc(owner.name) : 'nobody'], ['Comfort', pct(d.bed.quality)], ['Insulation', `${d.bed.clo} clo`]]); }
    if (d.station) h += `<div class="row"><button class="btn" data-act="drawer" data-drawer="craft">Bills for ${esc(d.station.replace('_', ' '))}s…</button></div>`;
    if (d.shelter) h += kv([['Keeps off rain', pct(d.shelter.rain)], ['Blocks wind', pct(d.shelter.wind)]]);
    return h;
  }

  tileHtml(i, embedded = false) {
    const s = this.sim, w = s.world, defs = s.defs;
    const t = defs.at('terrain', w.terrain[i]);
    let h = embedded ? '<div class="sect">Hex</div>' : `<h2>${esc(t.name[0].toUpperCase() + t.name.slice(1))}<button class="x" data-act="close">×</button></h2>`;
    if (!w.seen[i]) return h + '<div class="muted">Unexplored.</div>';
    const f = w.flora[i] ? defs.at('flora', w.flora[i]) : null;
    const room = w.room[i] ? s.rooms.get(w.room[i]) : null;
    h += kv([
      ['Elevation', `${f1(w.elev[i])} m`],
      w.water[i] > 0.05 ? ['Water', `${f1(w.water[i])} m deep${w.ice[i] > 0.005 ? `, ice ${f0(w.ice[i] * 100)} cm` : ''}`] : ['Soil moisture', pct(w.moist[i])],
      w.snow[i] > 0.005 ? ['Snow', `${f0(w.snow[i] * 100)} cm`] : null,
      ['Air', `${f1(airTemp(s, i))} °C${s.heat.get(i) ? ` (+${f1(s.heat.get(i))} from fire)` : ''}`],
      ['Wind exposure', pct(windExposure(s, i))], ['Light', pct(lightAt(s, i))],
      t.fertility ? ['Fertility', pct(t.fertility)] : null,
      t.tags.includes('mineable') ? ['Bedrock', defs.at('material', w.bedrock[i]).name] : null,
      room ? ['Room', `${room.tiles.length} hexes · ${f1(room.temp)} °C · loses ${f0(room.UA)} W/K · heat ${f0(room.heatW)} W`] : null,
      w.roof[i] && !room ? ['Roof', 'yes (not enclosed)'] : null,
      w.struct[i] ? ['Structure', `${defs.at('structure', w.struct[i]).name} (${f0(w.structHp[i])} hp)`] : null,
      w.fire[i] > 0 ? ['Fire', `<span class="neg">burning ${pct(w.fire[i])}</span>`] : null,
    ]);
    if (f) {
      h += `<div class="sect">${esc(f.name)}</div>` + kv([
        (f.crop || f.form === 'tree' || f.form === 'conifer') ? ['Growth', pct(w.growth[i])] : null,
        f.yield ? ['Yield', `${f1(w.yield[i])} ${esc(defs.must('item', f.yield.item).plural || f.yield.item)}`] : null,
        f.forage ? ['Forage left', pct(w.forage[i])] : null,
        f.chop ? ['Timber', `${Math.round((f.chop.logs || 0) * w.growth[i])} logs`] : null,
      ]);
    }
    const desig = Object.entries(DESIG).filter(([k, v]) => w.desig[i] & v).map(([k]) => k);
    if (desig.length) h += kv([['Orders', desig.join(', ')]]);
    const zone = w.zone[i] ? s.zones.get(w.zone[i]) : null;
    if (zone) h += this.zoneHtml(zone);
    const ents = [...s.ents.at(i)];
    const items = ents.filter(e => e.kind === 'item');
    if (items.length) h += `<div class="sect">Items</div><ul class="list">${items.map(it => `<li><span>${esc(describe(defs, it.stack))}${it.stack.fresh !== undefined ? ` <span class="muted">${pct(Math.max(0, it.stack.fresh))} fresh</span>` : ''}${it.reserved ? ' <span class="muted">(reserved)</span>' : ''}</span><button class="btn small ${it.forbidden ? 'on' : ''}" data-act="forbid" data-id="${it.id}">${it.forbidden ? 'forbidden' : 'forbid'}</button></li>`).join('')}</ul>`;
    const others = ents.filter(e => e.kind === 'corpse' || e.kind === 'blueprint' || (e.kind === 'building' && !embedded) || e.kind === 'animal' || e.kind === 'settler');
    if (others.length) h += `<div class="sect">Here</div><ul class="list">${others.map(e => `<li><span>${esc(entName(s, e))}</span>${['animal', 'settler', 'building'].includes(e.kind) ? `<button class="btn small" data-act="pick" data-id="${e.id}">select</button>` : e.kind === 'blueprint' ? `<span class="muted">${this.bpProgress(e)}</span>` : ''}</li>`).join('')}</ul>`;
    return h;
  }

  bpProgress(bp) {
    const m = this.sim.construction.missing(this.sim, bp);
    return m.length ? 'needs ' + m.map(x => `${x.qty} ${x.spec.item || x.spec.tag}`).join(', ') : 'ready to build';
  }

  zoneHtml(z) {
    const s = this.sim;
    if (z.type === 'farm') {
      const crops = s.defs.all('flora').filter(f => f.crop);
      return `<div class="sect">${esc(z.name)}</div><div class="row">Crop <select data-act="crop" data-id="${z.id}">${crops.map(c => `<option value="${c.id}" ${z.crop === c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select> <span class="muted">${z.tiles.size} hexes</span></div>`;
    }
    const cats = ['food', 'materials', 'tools', 'clothing', 'medical', 'seeds'];
    return `<div class="sect">${esc(z.name)}</div><div class="row">${cats.map(c => `<button class="btn small ${z.allow.includes(c) ? 'on' : ''}" data-act="allow" data-id="${z.id}" data-cat="${c}">${c}</button>`).join('')}</div>`;
  }

  // ---------- drawers
  drawerHtml(kind) {
    const s = this.sim;
    if (kind === 'work') {
      const settlers = [...s.ents.of('settler')].filter(e => e.body.alive), labors = s.defs.all('labor');
      return `<h3>Work priorities</h3><div class="muted" style="margin-bottom:6px">Click to cycle 1 (first) → 4 (last) → off. Numbers in brackets are skill levels.</div>
      <table class="grid"><tr><th></th>${labors.map(l => `<th>${esc(l.name)}</th>`).join('')}</tr>
      ${settlers.map(e => `<tr><td>${esc(e.name)}</td>${labors.map(l => { const v = e.agent.prio[l.id] ?? 2; return `<td><button class="pr p${v}" data-act="prio" data-id="${e.id}" data-labor="${l.id}" title="${l.skill ? 'skill ' + e.skills[l.skill].lvl : ''}">${v || '–'}</button></td>`; }).join('')}</tr>`).join('')}</table>`;
    }
    if (kind === 'craft') {
      const groups = {};
      for (const r of s.defs.all('recipe')) (groups[r.station || 'hand'] ||= []).push(r);
      const have = (st) => st === 'hand' || stations(s, st).length > 0;
      let h = `<h3>Crafting and cooking</h3><div class="muted" style="margin-bottom:6px">Bills are standing orders. A settler with the Craft or Cook labor gathers the ingredients and does the work at the right station.</div>`;
      if (s.bills.length) h += `<div class="sect">Bills</div><ul class="list">${s.bills.map(b => { const r = s.defs.must('recipe', b.recipe); return `<li><span>${esc(r.name)} <span class="muted">${b.mode === 'count' ? `${b.done}/${b.n}` : b.mode === 'until' ? `until ${b.n} in stock` : 'forever'}${!billActive(s, b) && !b.paused ? ' · done' : ''}</span></span><span><button class="btn small" data-act="billPause" data-id="${b.id}">${b.paused ? 'resume' : 'pause'}</button> <button class="btn small" data-act="billRemove" data-id="${b.id}">remove</button></span></li>`; }).join('')}</ul>`;
      for (const [st, list] of Object.entries(groups)) {
        h += `<div class="sect">${st === 'hand' ? 'By hand' : st.replace('_', ' ')}${have(st) ? '' : ' <span class="muted">(build one first)</span>'}</div><div class="opts">${list.map(r => `<button data-act="bill" data-recipe="${r.id}" title="${esc(recipeText(s, r))}">${esc(r.name)}<small>${esc(recipeText(s, r))}</small></button>`).join('')}</div>`;
      }
      h += `<div class="row muted" style="margin-top:6px">Click adds a bill for 1; shift-click for 5; ctrl-click keeps it going until 10 are in stock.</div>`;
      return h;
    }
    if (kind === 'chronicle') {
      const c = s.gameState.chronicle || [];
      return `<h3>Chronicle</h3><ul class="list chron">${c.slice().reverse().map(x => `<li><small>${esc(x.when)}</small>${esc(x.text)}</li>`).join('') || '<li class="muted">Nothing yet.</li>'}</ul>`;
    }
    if (kind === 'goals') {
      const g = s.gameState.goals || {};
      const kcal = colonyFoodKcal(s), people = [...s.ents.of('settler')].filter(e => e.body.alive).length;
      return `<h3>Milestones</h3>${GOALS.map(x => `<div class="goal"><span class="ck">${g[x.id] ? '✔' : '○'}</span><span>${esc(x.text)}<small>${esc(x.hint)}</small></span></div>`).join('')}
        <div class="sect">Stores</div>${kv([['Food', `${f0(kcal)} kcal ≈ ${f1(kcal / Math.max(1, people) / 2500)} days for ${people}`]])}`;
    }
    return '';
  }
}

function recipeText(s, r) {
  const ins = r.in.map(c => `${c.qty} ${c.item ? (s.defs.must('item', c.item).plural || s.defs.must('item', c.item).name) : 'any ' + c.tag}`).join(', ') || 'water';
  const outs = r.out.map(o => `${o.qty} ${s.defs.must('item', o.item).name}`).join(', ');
  return `${ins} → ${outs} · ${Math.round(r.work / 60)} min`;
}

export function entName(s, e) {
  if (e.kind === 'settler') return e.name;
  if (e.kind === 'animal') return s.defs.must('fauna', e.species).name;
  if (e.kind === 'building') return s.defs.must('structure', e.def).name;
  if (e.kind === 'blueprint') return 'Plan: ' + s.defs.must('structure', e.def).name;
  if (e.kind === 'corpse') return e.human ? `Body of ${e.name}` : `${s.defs.must('fauna', e.species).name} carcass${(e.fresh ?? 1) < 0 ? ' (rotting)' : ''}`;
  if (e.kind === 'item') return describe(s.defs, e.stack);
  return e.kind;
}
