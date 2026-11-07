// Body plans. coverage is the chance a hit lands on the part. hp scales with body mass for animals.
// vital parts kill at 0 hp. caps lists which capacities depend on the part.
export const BODIES = [
  { id: 'humanoid', parts: [
    { id: 'head', name: 'head', coverage: 0.09, hp: 25, vital: true, caps: ['consciousness', 'sight'] },
    { id: 'torso', name: 'torso', coverage: 0.4, hp: 45, vital: true, caps: ['breathing'] },
    { id: 'lArm', name: 'left arm', coverage: 0.115, hp: 22, caps: ['manipulation'] },
    { id: 'rArm', name: 'right arm', coverage: 0.115, hp: 22, caps: ['manipulation'] },
    { id: 'lLeg', name: 'left leg', coverage: 0.14, hp: 30, caps: ['moving'] },
    { id: 'rLeg', name: 'right leg', coverage: 0.14, hp: 30, caps: ['moving'] },
  ] },
  { id: 'quadruped', parts: [
    { id: 'head', name: 'head', coverage: 0.12, hp: 20, vital: true, caps: ['consciousness', 'sight'] },
    { id: 'neck', name: 'neck', coverage: 0.08, hp: 15, vital: true, caps: ['breathing'] },
    { id: 'torso', name: 'body', coverage: 0.5, hp: 45, vital: true, caps: ['breathing'] },
    { id: 'fLegs', name: 'forelegs', coverage: 0.15, hp: 25, caps: ['moving'] },
    { id: 'hLegs', name: 'hind legs', coverage: 0.15, hp: 25, caps: ['moving'] },
  ] },
];

// Damage types: how much a point of damage bleeds (ml/min), how painful it is, and how likely an
// untreated wound is to become infected per day.
export const DAMAGE = {
  cut: { name: 'cut', bleed: 2.2, pain: 1, infect: 0.18, open: true },
  pierce: { name: 'puncture', bleed: 1.8, pain: 1.1, infect: 0.25, open: true },
  bite: { name: 'bite', bleed: 1.6, pain: 1.2, infect: 0.35, open: true },
  blunt: { name: 'bruise', bleed: 0.05, pain: 0.8, infect: 0, open: false, fracture: 0.35 },
  burn: { name: 'burn', bleed: 0, pain: 1.6, infect: 0.2, open: true },
  frostbite: { name: 'frostbite', bleed: 0, pain: 0.9, infect: 0.12, open: true },
  fracture: { name: 'fracture', bleed: 0.1, pain: 1.5, infect: 0, open: false, slowHeal: 4 },
  surgical: { name: 'incision', bleed: 1, pain: 0.5, infect: 0.1, open: true },
};
