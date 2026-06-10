/**
 * Validates a string of digits using the Luhn checksum algorithm.
 *
 * Walking right-to-left, every second digit is doubled; a doubled value
 * above 9 has 9 subtracted. The number passes when the total is a multiple
 * of 10.
 *
 * Pure and dependency-free. Expects digits only — sanitisation and the
 * length / all-zeros business rules live upstream in `cardValidator.ts`.
 */
export const isValidLuhn = (digits: string): boolean => {
  if (!digits) return false;

  let sum = 0;
  let double = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let value = Number(digits[i]);
    if (double) {
      value *= 2;
      if (value > 9) value -= 9;
    }
    sum += value;
    double = !double;
  }

  return sum % 10 === 0;
};
