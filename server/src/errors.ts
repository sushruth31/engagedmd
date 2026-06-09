import { ERROR_CODES } from './constants.js';
import type { ErrorCode } from '@ccv/shared';

/**
 * Application error carrying an HTTP status and a stable machine-readable code.
 * Thrown anywhere in the request path; the error middleware renders it as JSON.
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 400,
    public readonly code: ErrorCode = ERROR_CODES.VALIDATION,
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}
