/**
 * Shared API contract — the single source of truth for both client and server.
 * Both import these as type-only, so any contract change is a compile error on
 * both sides rather than a runtime surprise.
 */

export type CardType = 'Visa' | 'Mastercard' | 'Amex' | 'Discover' | 'Unknown';

/** Machine-readable error codes returned by the API. */
export type ErrorCode = 'VALIDATION_ERROR' | 'BAD_REQUEST' | 'INTERNAL_ERROR';

export interface ValidationResponse {
  valid: boolean;
  cardType?: CardType;
  error?: string;
  code?: ErrorCode;
}
