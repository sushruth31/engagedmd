import { isValidLuhn } from './luhn.js';
import { getCardType } from './cardType.js';
import type { ValidationResponse } from './types.js';

/**
 * Validates credit card numbers: input sanitisation, structural rules
 * (digits-only, length, non-zero), and the Luhn checksum. Composes the pure
 * `isValidLuhn` and `getCardType` helpers behind one cohesive entry point.
 */
export class CardValidator {
  private static readonly MIN_LENGTH = 13;
  private static readonly MAX_LENGTH = 19;

  validate(cardNumber: string): ValidationResponse {
    const digits = this.sanitize(cardNumber);

    if (!/^\d+$/.test(digits)) {
      return this.invalid('Card number must contain only digits.');
    }
    if (digits.length < CardValidator.MIN_LENGTH || digits.length > CardValidator.MAX_LENGTH) {
      return this.invalid(`Card number must be ${CardValidator.MIN_LENGTH}-${CardValidator.MAX_LENGTH} digits.`);
    }
    if (/^0+$/.test(digits)) {
      return this.invalid('Card number cannot be all zeros.');
    }
    if (!isValidLuhn(digits)) {
      return this.invalid('Card number failed the Luhn checksum.');
    }
    return { valid: true, cardType: getCardType(digits) };
  }

  private sanitize(cardNumber: string): string {
    return cardNumber.replace(/[\s-]/g, '');
  }

  private invalid(error: string): ValidationResponse {
    return { valid: false, error };
  }
}
