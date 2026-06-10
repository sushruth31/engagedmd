import { describe, it, expect } from 'vitest';
import { CardValidator } from './cardValidator.js';

const validate = (n: string) => new CardValidator().validate(n);

describe('CardValidator', () => {
  it('accepts valid numbers and detects the network', () => {
    expect(validate('4532015112830366')).toEqual({ valid: true, cardType: 'Visa' });
    expect(validate('5425233430109903')).toEqual({ valid: true, cardType: 'Mastercard' });
    expect(validate('2223003122003222')).toEqual({ valid: true, cardType: 'Mastercard' }); // 2-series
    expect(validate('374245455400126')).toEqual({ valid: true, cardType: 'Amex' });
    expect(validate('6011514433546201')).toEqual({ valid: true, cardType: 'Discover' });
  });

  it('ignores spaces and dashes', () => {
    expect(validate('4532 0151 1283 0366').valid).toBe(true);
    expect(validate('4532-0151-1283-0366').valid).toBe(true);
  });

  it('rejects non-numeric, out-of-range, all-zero, and Luhn-failing numbers', () => {
    expect(validate('abc').valid).toBe(false);
    expect(validate('123').valid).toBe(false);
    expect(validate('12345678901234567890').valid).toBe(false);
    expect(validate('0000000000000000').valid).toBe(false);
    expect(validate('4532015112830367').valid).toBe(false);
  });

  it('explains why a number is rejected', () => {
    expect(validate('abc').error).toMatch(/digits/); // names the digits rule
    expect(validate('123').error).toMatch(/13-19/); // names the length range
    expect(validate('4532015112830367').error).toMatch(/Luhn/); // names the Luhn rule
  });
});
