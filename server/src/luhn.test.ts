import { describe, it, expect } from 'vitest';
import { isValidLuhn } from './luhn.js';

describe('isValidLuhn — checksum primitive', () => {
  it('accepts numbers that satisfy the Luhn checksum', () => {
    expect(isValidLuhn('4532015112830366')).toBe(true); // Visa
    expect(isValidLuhn('5425233430109903')).toBe(true); // Mastercard
    expect(isValidLuhn('374245455400126')).toBe(true); // Amex
    expect(isValidLuhn('6011514433546201')).toBe(true); // Discover
  });

  it('rejects numbers that fail the checksum', () => {
    expect(isValidLuhn('4532015112830367')).toBe(false);
    expect(isValidLuhn('1234567890123456')).toBe(false);
  });

  it('rejects an empty string', () => {
    expect(isValidLuhn('')).toBe(false);
  });

  it('treats all-zeros as checksum-valid — the all-zeros rule is enforced upstream', () => {
    expect(isValidLuhn('0000000000000000')).toBe(true);
  });
});
