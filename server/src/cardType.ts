import type { CardType } from './types.js';

/**
 * Detects the card network from a digits-only number by its leading digits,
 * following the standard major-industry-identifier prefixes (including the
 * Mastercard 2-series range introduced in 2017).
 */
export const getCardType = (digits: string): CardType => {
  const prefix2 = Number(digits.slice(0, 2));
  const prefix4 = Number(digits.slice(0, 4));

  if (digits.startsWith('4')) return 'Visa';
  if ((prefix2 >= 51 && prefix2 <= 55) || (prefix4 >= 2221 && prefix4 <= 2720)) return 'Mastercard';
  if (prefix2 === 34 || prefix2 === 37) return 'Amex';
  if (digits.startsWith('6011') || prefix2 === 65) return 'Discover';
  return 'Unknown';
};
