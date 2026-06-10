import { describe, it, expect } from 'vitest';
import { formatCardNumber } from './format';

describe('formatCardNumber', () => {
  it('groups digits into blocks of four and caps the length', () => {
    expect(formatCardNumber('4532015112830366')).toBe('4532 0151 1283 0366');
    expect(formatCardNumber('4'.repeat(25))).toBe('4444 4444 4444 4444 444');
  });

  it('strips non-digit characters', () => {
    expect(formatCardNumber('4532-0151')).toBe('4532 0151');
    expect(formatCardNumber('abc')).toBe('');
  });
});
