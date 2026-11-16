// The hand card. American mahjong is played against a card of hands that changes every
// year; the official one is published (and sold) by the National Mah Jongg League and is
// copyrighted, so this is an original card written in the same style and categories.
// To play another card, add an object of the same shape to CARDS (or replace this one):
// nothing else in the game knows which hands exist.
//
// Writing a hand:
//   Groups are separated by spaces. A group of one repeated symbol is a set (a pair,
//   pung, kong, quint...); a group of mixed symbols is that many single tiles.
//   Symbols: 1-9 numbers, 0 Soap (the White dragon, used as zero), F flower,
//   E S W N winds, R red dragon, G green dragon, D the dragon of the group's suit
//   (Craks: Red, Bams: Green, Dots: Soap).
//   A group may end in a suit letter a, b or c. Different letters are different suits,
//   any suits you like: "FF 1111a 1111b 1111c" is a kong in each of the three suits.
//   value: what the hand pays. concealed: no exposures allowed (only the winning tile
//   may be called). shift: the numbers may all move up together by steps of this size,
//   staying within 1-9 (so "11a 222a 3333a 444a 55a" with shift 1 is any five
//   consecutive numbers). note: shown under the hand.

export const CARDS = [
  {
    id: 'lantern-2026',
    name: 'Lantern card 2026',
    year: 2026,
    sections: [
      {
        name: '2026',
        hands: [
          { text: 'FF 2026a 2222b 6666c', value: 25, note: 'Kongs of 2 and 6 in the other two suits' },
          { text: '222a 0000 222b 6666c', value: 25, note: 'Any three suits' },
          { text: 'FFFF 2026a 222b 222c', value: 25, note: 'Pungs of 2 in the other two suits' },
          { text: 'NEWS 2026a 222b 666b', value: 30, note: 'Pungs in a second suit' },
          { text: 'FF 2026a DDDDb DDDDc', value: 30, note: 'Kongs of the other two suits’ dragons' },
          { text: 'FF 2026a 2026b 2026c', value: 40, concealed: true, note: 'The year in all three suits' },
        ],
      },
      {
        name: '2468',
        hands: [
          { text: '222a 4444a 666a 8888a', value: 25, note: 'Any one suit' },
          { text: 'FF 2222a 44a 66b 8888b', value: 25, note: 'Any two suits' },
          { text: '22a 44a 666b 888b DDDDc', value: 25, note: 'Kong of the third suit’s dragon' },
          { text: 'FFFF 2468a 222b 888c', value: 30, note: 'Any three suits' },
          { text: '2468a 222b 444b 6666c', value: 30, note: 'Any three suits' },
        ],
      },
      {
        name: 'Any Like Numbers',
        hands: [
          { text: 'FF 1111a 1111b 1111c', value: 25, shift: 1, note: 'Any one number in all three suits' },
          { text: 'FF 111a DDDa 111b DDDb', value: 30, shift: 1, note: 'Any like numbers with their matching dragons' },
          { text: 'FFF 1111a 1111b DDDc', value: 25, shift: 1, note: 'Pung of the third suit’s dragon' },
        ],
      },
      {
        name: 'Quints',
        hands: [
          { text: '11111a 2222b 33333c', value: 40, shift: 1, note: 'Any three consecutive numbers' },
          { text: 'FFFFF 1111a 22222b', value: 40, shift: 1, note: 'Any two consecutive numbers' },
          { text: '11111a NNNN 11111b', value: 45, shift: 1, note: 'Any like numbers' },
        ],
      },
      {
        name: 'Consecutive Run',
        hands: [
          { text: '11a 222a 3333a 444a 55a', value: 25, shift: 1, note: 'Any five consecutive numbers in one suit' },
          { text: '111a 2222a 333b 4444b', value: 25, shift: 1, note: 'Any four consecutive numbers' },
          { text: 'FF 1111a 2222b 3333c', value: 25, shift: 1, note: 'Any three consecutive numbers' },
          { text: '11a 22a 333b 444b 5555c', value: 30, shift: 1, note: 'Any five consecutive numbers' },
          { text: 'FFF 123a 4444b 5555c', value: 30, shift: 1, note: 'Any five consecutive numbers' },
          { text: 'FFF 123a 456a 789a DDb', value: 40, concealed: true, note: 'A straight with another suit’s dragon' },
        ],
      },
      {
        name: '13579',
        hands: [
          { text: '11a 333a 5555a 777a 99a', value: 25, note: 'Any one suit' },
          { text: '11a 333a 55b 777b 9999c', value: 25, note: 'Any three suits' },
          { text: 'FFF 135a 7777b 9999c', value: 30, note: 'Any three suits' },
          { text: 'FF 13579a 111b 9999c', value: 35, concealed: true, note: 'Any three suits' },
        ],
      },
      {
        name: 'Winds – Dragons',
        hands: [
          { text: 'NNNN EEE WWW SSSS', value: 25 },
          { text: 'FF NNN EEE WWW SSS', value: 25 },
          { text: 'NN EE WWW SSS DDDDa', value: 25, note: 'Any dragon' },
          { text: 'FFF DDDa DDDDb DDDDc', value: 30, note: 'All three dragons' },
          { text: 'NNN SSS DDDDa DDDDb', value: 30, note: 'Any two dragons' },
          { text: 'FF EEEE 2026a WWWW', value: 30, note: 'The year in any suit' },
        ],
      },
      {
        name: '369',
        hands: [
          { text: '333a 666a 9999a DDDDa', value: 25, note: 'One suit with its dragon' },
          { text: 'FF 3333a 6666b 9999c', value: 25, note: 'Any three suits' },
          { text: '33a 66a 99a 3333b 6666b', value: 30, note: 'Any two suits' },
          { text: 'FFFFF 369a 369b 369c', value: 40, concealed: true, note: 'All three suits' },
        ],
      },
      {
        name: 'Singles and Pairs',
        hands: [
          { text: 'NN EE WW SS 11a 11b 11c', value: 50, concealed: true, shift: 1, note: 'Any like number in all three suits' },
          { text: 'FF 2026a 2026b 22c 66c', value: 50, concealed: true },
          { text: 'FF 11a 33a 55a 77a 99a DDa', value: 50, concealed: true, note: 'One suit with its dragon' },
          { text: 'FF 2468a 22b 44b 66b 88b', value: 50, concealed: true, note: 'Any two suits' },
          { text: '11a 22a 33a 44a 55a 66a 77a', value: 50, concealed: true, shift: 1, note: 'Any seven consecutive numbers in one suit' },
          { text: '336699a 336699b FF', value: 50, concealed: true, note: 'Any two suits' },
        ],
      },
    ],
  },
];

export const cardById = (id) => CARDS.find((c) => c.id === id) || CARDS[0];
