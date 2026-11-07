// Combat: hit chance from skill, target size, motion and range; hit location by part coverage; damage by
// weapon type reduced by armour on the part; animals react by fleeing or fighting back.
import { clamp } from '../core/units.js';
import { wound, hitPart } from './health.js';
import { learn, traitMod, addThought } from './mind.js';

function armorOn(sim, e, part) {
  if (!e.equip) return 0;
  let a = 0;
  for (const s of Object.values(e.equip)) { if (!s) continue; const w = sim.defs.must('item', s.item).wear; if (w?.armor && w.cover.includes(part)) a = Math.max(a, w.armor); }
  return a;
}

export function attack(sim, att, tgt, wpn, dist = 1) {
  const rng = sim.rng;
  const skill = att.kind === 'settler' ? (att.skills[wpn.thrown && dist > 1 ? 'hunting' : 'melee']?.lvl ?? 0) : 8;
  const size = tgt.kind === 'animal' ? sim.defs.must('fauna', tgt.species).size : 1;
  const moving = tgt.mv && tgt.mv.k < tgt.mv.path.length ? 1 : 0;
  const manip = att.body.caps.manipulation ?? 1;
  const p = clamp((0.45 + skill * 0.025 + (size - 1) * 0.25 - moving * 0.15 - (dist - 1) * 0.12) * (0.4 + 0.6 * manip) * (0.5 + 0.5 * (att.body.caps.sight ?? 1)), 0.05, 0.95);
  const hit = rng.chance(p);
  if (att.kind === 'settler') learn(sim, att, wpn.thrown && dist > 1 ? 'hunting' : 'melee', 40);
  sim.events.emit('attack', { att: att.id, tgt: tgt.id, hit });
  if (hit) {
    tgt.lastHitBy = att.kind;
    const part = hitPart(sim, tgt);
    const str = att.kind === 'settler' ? traitMod(sim, att, 'strength', 1) * (0.6 + 0.4 * manip) : Math.pow(att.massKg / 50, 0.25);
    let dmg = wpn.dmg * rng.range(0.6, 1.35) * str * (1 - armorOn(sim, tgt, part));
    wound(sim, tgt, part, wpn.type, dmg, att.kind === 'settler' ? att.name : sim.defs.must('fauna', att.species).name);
    if (tgt.kind === 'settler' && att.kind === 'animal') addThought(sim, tgt, 'attacked');
  }
  // the target reacts
  if (tgt.kind === 'animal' && tgt.body.alive) sim.animals.provoked(sim, tgt, att);
  if (tgt.kind === 'settler' && tgt.body.alive && tgt.phys.asleep) { tgt.phys.asleep = false; sim.ai.interrupt(sim, tgt); }
  if (!tgt.body.alive && att.kind === 'settler') addThought(sim, att, 'killed_animal');
  return hit;
}

export const combatApi = { attack };
