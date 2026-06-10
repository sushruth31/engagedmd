import { describe, it, expect } from 'vitest';
import { isValidLuhn } from './luhn.js';

describe('isValidLuhn', () => {
  it('accepts numbers that satisfy the checksum', () => {
    expect(isValidLuhn('4532015112830366')).toBe(true);
    expect(isValidLuhn('374245455400126')).toBe(true);
    expect(isValidLuhn('6011514433546201')).toBe(true);
  });

  it('rejects numbers that fail the checksum', () => {
    expect(isValidLuhn('4532015112830367')).toBe(false);
    expect(isValidLuhn('1234567890123456')).toBe(false);
  });

  it('rejects empty input', () => {
    expect(isValidLuhn('')).toBe(false);
  });
});
