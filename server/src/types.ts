/** Card networks the API can recognise from a number's prefix. */
export type CardType = 'Visa' | 'Mastercard' | 'Amex' | 'Discover' | 'Unknown';

/** Shape of every POST /api/validate response. */
export interface ValidationResponse {
  valid: boolean;
  cardType?: CardType;
  error?: string;
}
