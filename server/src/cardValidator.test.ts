import { describe, it, expect } from 'vitest';
import { CardValidator } from './cardValidator.js';

const validate = (n: string) => new CardValidator().validate(n);

describe('CardValidator.validate — valid inputs', () => {
  it.each([
    ['4532015112830366', 'Visa'],
    ['5425233430109903', 'Mastercard'],
    ['2223003122003222', 'Mastercard'], // 2-series (2221-2720)
    ['374245455400126', 'Amex'],
    ['6011514433546201', 'Discover'],
    ['4222222222222', 'Visa'], // 13-digit lower bound
  ] as const)('accepts %s as %s', (number, cardType) => {
    expect(validate(number)).toEqual({ valid: true, cardType });
  });

  it.each([
    '4532 0151 1283 0366',
    '4532-0151-1283-0366',
    '  4532015112830366  ',
  ])('sanitises then accepts %s', (number) => {
    expect(validate(number).valid).toBe(true);
  });
});

describe('CardValidator.validate — rejected inputs', () => {
  it.each([
    ['', 'empty'],
    ['abcdefg', 'non-numeric'],
    ['123456789012', 'too short (12)'],
    ['12345678901234567890', 'too long (20)'],
    ['0000000000000000', 'all zeros'],
    ['4532015112830367', 'fails Luhn'],
  ])('rejects %s (%s)', (number) => {
    expect(validate(number).valid).toBe(false);
  });

  it('returns a descriptive error for each failure', () => {
    expect(validate('abc').error).toMatch(/digits/);
    expect(validate('123').error).toMatch(/13-19/);
    expect(validate('0000000000000000').error).toMatch(/zero/);
    expect(validate('4532015112830367').error).toMatch(/Luhn/);
  });
});
