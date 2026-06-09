import type { ErrorRequestHandler } from 'express';

/**
 * Central error middleware. Maps body-parser failures (malformed JSON,
 * oversized payloads) to their 4xx status and hides internal faults behind a
 * generic 500. Every route inherits this — add one, it's already covered.
 */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const status = (err as { status?: number }).status ?? 500;
  const clientError = status >= 400 && status < 500;
  res.status(clientError ? status : 500).json({
    valid: false,
    error: clientError ? 'Invalid request body.' : 'Internal server error.',
  });
};
