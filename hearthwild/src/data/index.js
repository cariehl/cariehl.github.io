// Builds the registry from every data module and checks cross-references, so a typo in content fails at
// startup with a clear message rather than deep inside a system.
import { Registry } from '../sim/core/registry.js';
import { MATERIALS } from './materials.js';
import { TERRAIN } from './terrain.js';
import { FLORA } from './flora.js';
import { FAUNA } from './fauna.js';
import { ITEMS } from './items.js';
import { RECIPES } from './recipes.js';
import { STRUCTURES, ZONES } from './structures.js';
import { BODIES } from './bodies.js';
import { CONDITIONS } from './conditions.js';
import { THOUGHTS, TRAITS, SKILLS, LABORS } from './mind.js';

export function buildRegistry() {
  const R = new Registry()
    .add('material', MATERIALS).add('terrain', TERRAIN).add('flora', FLORA).add('fauna', FAUNA)
    .add('item', ITEMS).add('recipe', RECIPES).add('structure', STRUCTURES).add('zone', ZONES)
    .add('body', BODIES).add('condition', CONDITIONS).add('thought', THOUGHTS).add('trait', TRAITS)
    .add('skill', SKILLS).add('labor', LABORS);
  validate(R);
  return R;
}

function validate(R) {
  const errs = [];
  const need = (kind, id, where) => { if (id && !R.has(kind, id)) errs.push(`${where}: unknown ${kind} "${id}"`); };
  const needCost = (c, where) => { if (c.item) need('item', c.item, where); else if (!c.tag || !R.tagged('item', c.tag).length) errs.push(`${where}: tag "${c.tag}" matches no item`); };
  for (const f of R.all('flora')) {
    if (f.yield) need('item', f.yield.item, `flora ${f.id}`);
    if (f.chop) { need('item', f.chop.item, `flora ${f.id} chop`); need('material', f.chop.mat, `flora ${f.id} chop`); }
    if (f.seed) need('item', f.seed, `flora ${f.id} seed`);
    for (const s of f.habitat?.soils || []) need('terrain', s, `flora ${f.id} habitat`);
  }
  for (const i of R.all('item')) {
    if (i.plants) need('flora', i.plants, `item ${i.id}`);
    if (i.risk) need('condition', i.risk.cond, `item ${i.id}`);
  }
  for (const r of R.all('recipe')) {
    for (const c of r.in) needCost(c, `recipe ${r.id}`);
    for (const o of r.out) need('item', o.item, `recipe ${r.id}`);
    need('skill', r.skill, `recipe ${r.id}`);
    if (r.station && !R.all('structure').some(s => s.station === r.station)) errs.push(`recipe ${r.id}: no structure provides station ${r.station}`);
  }
  for (const s of R.all('structure')) for (const c of s.cost) needCost(c, `structure ${s.id}`);
  for (const a of R.all('fauna')) { need('body', a.body, `fauna ${a.id}`); for (const p of a.prey || []) need('fauna', p, `fauna ${a.id} prey`); }
  for (const l of R.all('labor')) need('skill', l.skill, `labor ${l.id}`);
  if (errs.length) throw new Error('Content errors:\n' + errs.join('\n'));
}
