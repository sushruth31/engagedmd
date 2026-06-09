import { describe, it, expect } from 'vitest';
import { isValidLuhn } from './luhn.js';

describe('isValidLuhn — checksum primitive (digits only)', () => {
  it.each([
    ['4532015112830366', 'Visa'],
    ['5425233430109903', 'Mastercard'],
    ['374245455400126', 'Amex (15 digits)'],
    ['6011514433546201', 'Discover'],
    ['4222222222222', '13-digit Visa'],
  ])('accepts %s (%s)', (digits) => {
    expect(isValidLuhn(digits)).toBe(true);
  });

  it.each([
    ['4532015112830367', 'fails checksum'],
    ['1234567890123456', 'sequential digits'],
  ])('rejects %s (%s)', (digits) => {
    expect(isValidLuhn(digits)).toBe(false);
  });

  it('rejects an empty string', () => {
    expect(isValidLuhn('')).toBe(false);
  });

  it('treats all-zeros as checksum-valid — rejected upstream by the validator', () => {
    expect(isValidLuhn('0000000000000000')).toBe(true);
  });
});
