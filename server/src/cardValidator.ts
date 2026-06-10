import { isValidLuhn } from './luhn.js';
import { getCardType } from './cardType.js';
import { CARD_LENGTH, ERRORS } from './constants.js';
import type { ValidationResponse } from '@ccv/shared';

/**
 * Validates credit card numbers: input sanitisation, structural rules
 * (digits-only, length, non-zero), and the Luhn checksum. Composes the pure
 * `isValidLuhn` and `getCardType` helpers behind one cohesive entry point.
 */
export class CardValidator {
  validate(cardNumber: string): ValidationResponse {
    const digits = this.sanitize(cardNumber);

    // One or more characters, all digits.
    if (!/^\d+$/.test(digits)) {
      return this.invalid(ERRORS.DIGITS_ONLY);
    }
    if (digits.length < CARD_LENGTH.MIN || digits.length > CARD_LENGTH.MAX) {
      return this.invalid(ERRORS.LENGTH_RANGE);
    }
    // Every character is a zero.
    if (/^0+$/.test(digits)) {
      return this.invalid(ERRORS.ALL_ZEROS);
    }
    if (!isValidLuhn(digits)) {
      return this.invalid(ERRORS.LUHN_FAILED);
    }
    return { valid: true, cardType: getCardType(digits) };
  }

  private sanitize(cardNumber: string): string {
    // Remove spaces and dashes from common paste formats.
    return cardNumber.replace(/[\s-]/g, '');
  }

  private invalid(error: string): ValidationResponse {
    return { valid: false, error };
  }
}
