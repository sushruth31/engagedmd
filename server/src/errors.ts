/**
 * Application error carrying an HTTP status and a stable machine-readable code.
 * Thrown anywhere in the request path; the error middleware renders it as JSON.
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 400,
    public readonly code = 'VALIDATION_ERROR',
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}
