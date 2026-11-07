// Illnesses. onsetH is the incubation time; durationH a mean length. Effects apply at full severity:
// waterLPerDay extra fluid loss, nausea blocks eating, kcalMult scales metabolism, fever raises the body's
// set point, caps are capacity multipliers, pain adds to pain.
export const CONDITIONS = [
  { id: 'food_poisoning', name: 'food poisoning', onsetH: [2, 8], durationH: [18, 48],
    effects: { waterLPerDay: 2.0, nausea: 0.9, kcalMult: 1.05, pain: 0.25, caps: { manipulation: 0.8, moving: 0.85 } },
    mood: -12 },
  { id: 'gut_infection', name: 'gut infection', onsetH: [24, 72], durationH: [72, 168],
    effects: { waterLPerDay: 2.5, nausea: 0.5, kcalMult: 1.1, fever: 0.8, pain: 0.2, caps: { manipulation: 0.85, moving: 0.85 } },
    mood: -14 },
  { id: 'mushroom_poisoning', name: 'mushroom poisoning', onsetH: [1, 6], durationH: [12, 36],
    effects: { waterLPerDay: 1.5, nausea: 1, pain: 0.35, organ: 0.35, caps: { consciousness: 0.75, moving: 0.7 } },
    mood: -18 },
  { id: 'chest_cold', name: 'chest cold', onsetH: [12, 48], durationH: [96, 192],
    effects: { kcalMult: 1.08, fever: 0.6, pain: 0.1, caps: { breathing: 0.85, moving: 0.92 } },
    mood: -6 },
  { id: 'pneumonia', name: 'pneumonia', onsetH: [12, 36], durationH: [168, 336],
    effects: { kcalMult: 1.25, fever: 1.6, pain: 0.3, organ: 0.12, caps: { breathing: 0.55, moving: 0.6, consciousness: 0.85 } },
    mood: -20 },
];
