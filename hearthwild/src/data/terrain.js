// Surface types. move multiplies the time to cross a hex; fertility scales plant growth; drain is how
// quickly soil moisture falls.
export const TERRAIN = [
  { id: 'loam', name: 'loam', move: 1.0, fertility: 1.0, drain: 1.0, color: [92, 112, 58], tags: ['soil', 'diggable'] },
  { id: 'clay', name: 'clay soil', move: 1.1, fertility: 0.75, drain: 0.6, color: [118, 104, 66], tags: ['soil', 'diggable', 'clay'] },
  { id: 'sand', name: 'sand', move: 1.3, fertility: 0.3, drain: 1.8, color: [186, 170, 122], tags: ['soil', 'diggable'] },
  { id: 'gravel', name: 'gravel', move: 1.15, fertility: 0.15, drain: 2.0, color: [140, 134, 120], tags: ['soil'] },
  { id: 'peat', name: 'marsh', move: 1.9, fertility: 0.6, drain: 0.3, color: [74, 84, 54], tags: ['soil', 'wet'] },
  { id: 'scree', name: 'scree', move: 1.8, fertility: 0.05, drain: 2.2, color: [128, 124, 118], tags: ['stony'] },
  { id: 'rock', name: 'rock outcrop', move: Infinity, fertility: 0, drain: 3, color: [112, 110, 108], tags: ['rock', 'mineable'] },
  { id: 'tilled', name: 'tilled soil', move: 1.2, fertility: 1.25, drain: 1.1, color: [98, 74, 50], tags: ['soil', 'diggable', 'tilled'] },
  { id: 'floor', name: 'packed earth floor', move: 0.9, fertility: 0, drain: 1.5, color: [120, 100, 76], tags: ['floor'] },
  { id: 'quarried', name: 'quarried rock', move: 1.1, fertility: 0, drain: 3, color: [126, 122, 116], tags: ['stony'] },
  { id: 'ash', name: 'burnt ground', move: 1.0, fertility: 1.1, drain: 1.2, color: [64, 60, 54], tags: ['soil', 'diggable'] },
];
