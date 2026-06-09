import { describe, it, expect } from 'vitest';
import { CardValidator } from './cardValidator.js';

const validator = new CardValidator();

describe('CardValidator.validate — full pipeline', () => {
  it('accepts valid numbers and detects the card type', () => {
    expect(validator.validate('4532015112830366')).toEqual({ valid: true, cardType: 'Visa' });
    expect(validator.validate('5425233430109903')).toEqual({ valid: true, cardType: 'Mastercard' });
    expect(validator.validate('374245455400126')).toEqual({ valid: true, cardType: 'Amex' });
    expect(validator.validate('6011514433546201')).toEqual({ valid: true, cardType: 'Discover' });
  });

  it('ignores spaces and dashes in the input', () => {
    expect(validator.validate('4532 0151 1283 0366').valid).toBe(true);
    expect(validator.validate('4532-0151-1283-0366').valid).toBe(true);
  });

  it('accepts a 13-digit number (lower length boundary)', () => {
    expect(validator.validate('4222222222222')).toEqual({ valid: true, cardType: 'Visa' });
  });

  it('rejects non-numeric and empty input', () => {
    expect(validator.validate('abcdefg')).toMatchObject({ valid: false });
    expect(validator.validate('')).toMatchObject({ valid: false });
  });

  it('rejects out-of-range lengths (12 and 20 digits)', () => {
    expect(validator.validate('123456789012')).toMatchObject({ valid: false });
    expect(validator.validate('12345678901234567890')).toMatchObject({ valid: false });
  });

  it('rejects all zeros', () => {
    expect(validator.validate('0000000000000000')).toMatchObject({
      valid: false,
      error: expect.stringContaining('zero'),
    });
  });

  it('rejects numbers that fail the Luhn checksum', () => {
    expect(validator.validate('4532015112830367')).toMatchObject({
      valid: false,
      error: expect.stringContaining('Luhn'),
    });
  });
});
