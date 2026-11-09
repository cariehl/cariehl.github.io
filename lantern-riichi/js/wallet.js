// The economy: a coin wallet kept in localStorage, table stakes, bank loans and cosmetics.
// No DOM here, so the rules can be tested under Node.

export const START_COINS = 10000;

// Payout = buy-in + final points × rate, never below zero. Final points sum to zero
// across the table, so on average the bots neither gain nor lose.
export const STAKES = [
  { id: 'free', name: 'Friendly', buyIn: 0, rate: 0, blurb: 'No coins at stake' },
  { id: 'low', name: 'Low stakes', buyIn: 500, rate: 10, blurb: '500 buy-in · 10 per point' },
  { id: 'mid', name: 'Mid stakes', buyIn: 2000, rate: 40, blurb: '2,000 buy-in · 40 per point' },
  { id: 'high', name: 'High stakes', buyIn: 8000, rate: 160, blurb: '8,000 buy-in · 160 per point' },
];
export const stakeById = (id) => STAKES.find((s) => s.id === id) || STAKES[1];

export const LOAN = { amount: 5000, interest: 0.1, maxDebt: 22000, autoRepay: 0.5 };

// Cosmetics. `vars` are CSS custom properties set on the page; avatars change your emoji.
export const COSMETICS = [
  { id: 'back-ember', kind: 'back', name: 'Ember backs', price: 0, vars: { '--back': '#b8432e', '--back-2': '#8f2f1f' } },
  { id: 'back-jade', kind: 'back', name: 'Jade backs', price: 1500, vars: { '--back': '#2f8a6d', '--back-2': '#1c5c48' } },
  { id: 'back-indigo', kind: 'back', name: 'Indigo backs', price: 1500, vars: { '--back': '#3d4f9a', '--back-2': '#273370' } },
  { id: 'back-plum', kind: 'back', name: 'Plum backs', price: 3000, vars: { '--back': '#7d3c7a', '--back-2': '#552553' } },
  { id: 'back-gold', kind: 'back', name: 'Gilded backs', price: 12000, vars: { '--back': '#d9a63a', '--back-2': '#9c6d16' } },
  { id: 'felt-pine', kind: 'felt', name: 'Pine felt', price: 0, vars: { '--felt': '#1d3a33', '--felt-2': '#17302a' } },
  { id: 'felt-wine', kind: 'felt', name: 'Wine felt', price: 2500, vars: { '--felt': '#4a1f29', '--felt-2': '#33141c' } },
  { id: 'felt-sea', kind: 'felt', name: 'Night sea felt', price: 2500, vars: { '--felt': '#1b3150', '--felt-2': '#132338' } },
  { id: 'felt-ink', kind: 'felt', name: 'Ink felt', price: 4000, vars: { '--felt': '#2a2a2e', '--felt-2': '#1b1b1f' } },
  { id: 'felt-lantern', kind: 'felt', name: 'Lantern glow felt', price: 15000, vars: { '--felt': '#5a3a17', '--felt-2': '#3a250e' } },
  { id: 'face-ivory', kind: 'face', name: 'Ivory faces', price: 0, vars: { '--tile': '#f8f2e3', '--tile-edge': '#d6c8a8' } },
  { id: 'face-bamboo', kind: 'face', name: 'Bamboo faces', price: 3500, vars: { '--tile': '#f3e7c2', '--tile-edge': '#b8984f' } },
  { id: 'face-frost', kind: 'face', name: 'Frost faces', price: 3500, vars: { '--tile': '#eef4f7', '--tile-edge': '#a9c0cc' } },
  { id: 'face-rose', kind: 'face', name: 'Rose quartz faces', price: 9000, vars: { '--tile': '#f9e8e6', '--tile-edge': '#d4a6a0' } },
  { id: 'av-smile', kind: 'avatar', name: 'Smile', price: 0, emoji: '🙂', color: '#5d7f74' },
  { id: 'av-cat', kind: 'avatar', name: 'Cat', price: 1000, emoji: '🐱', color: '#c98b3f' },
  { id: 'av-frog', kind: 'avatar', name: 'Frog', price: 1000, emoji: '🐸', color: '#4f8f3a' },
  { id: 'av-panda', kind: 'avatar', name: 'Panda', price: 2500, emoji: '🐼', color: '#56606a' },
  { id: 'av-tiger', kind: 'avatar', name: 'Tiger', price: 5000, emoji: '🐯', color: '#d07a26' },
  { id: 'av-dragon', kind: 'avatar', name: 'Dragon', price: 20000, emoji: '🐲', color: '#2e8a5c' },
];
export const KINDS = [['back', 'Tile backs'], ['felt', 'Table felt'], ['face', 'Tile faces'], ['avatar', 'Your avatar']];
export const cosmeticById = (id) => COSMETICS.find((c) => c.id === id);

export function newWallet() {
  return {
    coins: START_COINS,
    debt: 0,
    loans: 0,
    bankruptcies: 0,
    owned: COSMETICS.filter((c) => c.price === 0).map((c) => c.id),
    equipped: { back: 'back-ember', felt: 'felt-pine', face: 'face-ivory', avatar: 'av-smile' },
    earned: 0, // net coins from games, for the history page
  };
}

export function canAfford(w, stake) {
  return w.coins >= stake.buyIn;
}

export function payBuyIn(w, stake) {
  if (!canAfford(w, stake)) return false;
  w.coins -= stake.buyIn;
  return true;
}

// Settle a finished game. Returns what happened, for the result sheet and history.
export function settleGame(w, stake, points) {
  const payout = Math.max(0, Math.round(stake.buyIn + points * stake.rate));
  const profit = payout - stake.buyIn;
  let repaid = 0;
  if (profit > 0 && w.debt > 0) repaid = Math.min(w.debt, Math.floor(profit * LOAN.autoRepay));
  w.coins += payout - repaid;
  w.debt -= repaid;
  w.earned += profit;
  return { stake: stake.id, buyIn: stake.buyIn, payout, profit, repaid };
}

export function canBorrow(w) {
  return w.debt + Math.round(LOAN.amount * (1 + LOAN.interest)) <= LOAN.maxDebt;
}

export function borrow(w) {
  if (!canBorrow(w)) return false;
  w.coins += LOAN.amount;
  w.debt += Math.round(LOAN.amount * (1 + LOAN.interest));
  w.loans++;
  return true;
}

export function repay(w, amount) {
  const a = Math.max(0, Math.min(amount, w.debt, w.coins));
  w.coins -= a;
  w.debt -= a;
  return a;
}

// Last resort when you can't afford any table and the bank won't lend: start over.
export function declareBankruptcy(w) {
  w.coins = Math.round(START_COINS / 2);
  w.debt = 0;
  w.bankruptcies++;
}

export function isBroke(w) {
  const cheapest = Math.min(...STAKES.filter((s) => s.buyIn > 0).map((s) => s.buyIn));
  return w.coins < cheapest && !canBorrow(w);
}

export function buy(w, id) {
  const c = cosmeticById(id);
  if (!c || w.owned.includes(id) || w.coins < c.price) return false;
  w.coins -= c.price;
  w.owned.push(id);
  w.equipped[c.kind] = id;
  return true;
}

export function equip(w, id) {
  const c = cosmeticById(id);
  if (!c || !w.owned.includes(id)) return false;
  w.equipped[c.kind] = id;
  return true;
}
