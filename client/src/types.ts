/** Card networks the API can recognise. Mirrors the server's union for a type-safe seam. */
export type CardType = 'Visa' | 'Mastercard' | 'Amex' | 'Discover' | 'Unknown';

/** Shape of every /api/validate response. */
export interface ValidationResponse {
  valid: boolean;
  cardType?: CardType;
  error?: string;
}
