import { isValidLuhn } from './luhn.js';
import { getCardType } from './cardType.js';
import type { ValidationResponse } from './types.js';

const MIN_LENGTH = 13;
const MAX_LENGTH = 19;

/** Strips spaces and dashes so pasted or grouped numbers validate cleanly. */
const sanitize = (cardNumber: string): string => cardNumber.replace(/[\s-]/g, '');

/**
 * Full validation pipeline: sanitise → format / length / all-zeros rules →
 * Luhn checksum → card-type detection. Returns a human-readable error for the
 * first rule that fails.
 */
export const validateCardNumber = (cardNumber: string): ValidationResponse => {
  const digits = sanitize(cardNumber);

  if (!/^\d+$/.test(digits)) {
    return { valid: false, error: 'Card number must contain only digits.' };
  }
  if (digits.length < MIN_LENGTH || digits.length > MAX_LENGTH) {
    return { valid: false, error: `Card number must be ${MIN_LENGTH}-${MAX_LENGTH} digits.` };
  }
  if (/^0+$/.test(digits)) {
    return { valid: false, error: 'Card number cannot be all zeros.' };
  }
  if (!isValidLuhn(digits)) {
    return { valid: false, error: 'Card number failed the Luhn checksum.' };
  }

  return { valid: true, cardType: getCardType(digits) };
};
