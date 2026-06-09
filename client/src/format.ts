import { UI } from './constants';

// Matches every group of N digits so a space can be inserted after each block.
const GROUP_PATTERN = new RegExp(`(.{${UI.DIGIT_GROUP_SIZE}})`, 'g');

/** Groups a card number into blocks of four digits for display while typing. */
export const formatCardNumber = (value: string): string => {
  // Strip non-digits, then cap at the maximum card length.
  const digits = value.replace(/\D/g, '').slice(0, UI.MAX_CARD_DIGITS);
  return digits.replace(GROUP_PATTERN, '$1 ').trim();
};
