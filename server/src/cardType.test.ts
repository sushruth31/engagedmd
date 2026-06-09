import { describe, it, expect } from 'vitest';
import { getCardType } from './cardType.js';

describe('getCardType — network detection', () => {
  it('detects each network from its prefix', () => {
    expect(getCardType('4111111111111111')).toBe('Visa');
    expect(getCardType('5425233430109903')).toBe('Mastercard'); // 51-55 range
    expect(getCardType('2223003122003222')).toBe('Mastercard'); // 2-series (2221-2720)
    expect(getCardType('374245455400126')).toBe('Amex');
    expect(getCardType('6011514433546201')).toBe('Discover');
    expect(getCardType('6500000000000000')).toBe('Discover'); // 65 prefix
  });

  it('returns Unknown for unrecognised prefixes', () => {
    expect(getCardType('9999999999999999')).toBe('Unknown');
  });
});
