import type { ErrorRequestHandler } from 'express';
import { ValidationError } from './errors.js';

/**
 * Central error middleware. Renders known ValidationErrors and body-parser
 * failures (malformed JSON, oversized payloads) with their real status; hides
 * anything unexpected behind a generic 500. Every route inherits this for free.
 */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ValidationError) {
    res.status(err.statusCode).json({ valid: false, error: err.message, code: err.code });
    return;
  }

  const status = (err as { status?: number }).status;
  if (typeof status === 'number' && status >= 400 && status < 500) {
    res.status(status).json({ valid: false, error: 'Invalid request body.', code: 'BAD_REQUEST' });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({ valid: false, error: 'Internal server error.', code: 'INTERNAL_ERROR' });
};
