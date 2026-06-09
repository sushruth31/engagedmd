import { describe, it, expect } from 'vitest';
import { validateCardNumber } from './validate.js';

describe('validateCardNumber — full pipeline', () => {
  it('accepts valid numbers and detects the card type', () => {
    expect(validateCardNumber('4532015112830366')).toEqual({ valid: true, cardType: 'Visa' });
    expect(validateCardNumber('5425233430109903')).toEqual({ valid: true, cardType: 'Mastercard' });
    expect(validateCardNumber('374245455400126')).toEqual({ valid: true, cardType: 'Amex' });
    expect(validateCardNumber('6011514433546201')).toEqual({ valid: true, cardType: 'Discover' });
  });

  it('ignores spaces and dashes in the input', () => {
    expect(validateCardNumber('4532 0151 1283 0366').valid).toBe(true);
    expect(validateCardNumber('4532-0151-1283-0366').valid).toBe(true);
  });

  it('rejects non-numeric and empty input', () => {
    expect(validateCardNumber('abcdefg')).toMatchObject({ valid: false });
    expect(validateCardNumber('')).toMatchObject({ valid: false });
  });

  it('rejects out-of-range lengths', () => {
    expect(validateCardNumber('123')).toMatchObject({ valid: false });
    expect(validateCardNumber('12345678901234567890')).toMatchObject({ valid: false });
  });

  it('rejects all zeros', () => {
    expect(validateCardNumber('0000000000000000')).toMatchObject({
      valid: false,
      error: expect.stringContaining('zero'),
    });
  });

  it('rejects numbers that fail the Luhn checksum', () => {
    expect(validateCardNumber('4532015112830367')).toMatchObject({
      valid: false,
      error: expect.stringContaining('Luhn'),
    });
  });
});
