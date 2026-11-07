// Alerts: conditions that need the player's attention now. Recomputed a few times a second by the UI.
export function computeAlerts(sim) {
  const out = [];
  for (const e of sim.ents.of('settler')) {
    if (!e.body.alive) continue;
    const n = e.name.split(' ')[0], p = e.phys, b = e.body;
    if (!b.conscious) out.push({ level: 3, text: `${n} is unconscious`, id: e.id });
    if (b.bleedRate > 2) out.push({ level: 3, text: `${n} is bleeding (${b.bleedRate.toFixed(0)} ml/min)`, id: e.id });
    if (p.core < 35) out.push({ level: 3, text: `${n} is hypothermic (${p.core.toFixed(1)} °C)`, id: e.id });
    else if (p.cold > 0.6) out.push({ level: 2, text: `${n} is freezing`, id: e.id });
    if (p.core > 39.5) out.push({ level: 3, text: `${n} has a high fever (${p.core.toFixed(1)} °C)`, id: e.id });
    if (p.dehydPct > 5) out.push({ level: 3, text: `${n} is badly dehydrated`, id: e.id });
    if (p.starving) out.push({ level: 3, text: `${n} is starving`, id: e.id });
    if (b.wounds.some(w => w.inf > 0.5)) out.push({ level: 2, text: `${n} has an infected wound`, id: e.id });
    if (b.conds.some(c => c.sev > 0.3)) out.push({ level: 1, text: `${n} is ill`, id: e.id });
    if (e.mind.stress > 80 && !e.mind.breakdown) out.push({ level: 2, text: `${n} is close to breaking`, id: e.id });
    if (e.mind.breakdown) out.push({ level: 2, text: `${n} is having a breakdown`, id: e.id });
  }
  for (const a of sim.ents.of('animal')) if (a.body.alive && (a.animal.state === 'attack' || a.animal.state === 'hunt' || a.animal.state === 'charge') && sim.ents.get(a.animal.target)?.kind === 'settler')
    out.push({ level: 3, text: `A ${sim.defs.must('fauna', a.species).name} is attacking!`, id: a.id });
  if (sim.fires.size) out.push({ level: 3, text: `Wildfire: ${sim.fires.size} hex${sim.fires.size > 1 ? 'es' : ''} burning`, i: [...sim.fires][0] });
  return out.sort((a, b) => b.level - a.level);
}
