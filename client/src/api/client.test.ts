import { describe, it, expect } from 'vitest';
import { toApiError, ApiError } from './client';

describe('toApiError', () => {
  it('maps an HTTP error response to status, message, and code', () => {
    const err = toApiError({
      response: { status: 422, data: { error: 'Bad card', code: 'BAD_REQUEST' } },
    });
    expect(err).toBeInstanceOf(ApiError);
    expect(err.status).toBe(422);
    expect(err.message).toBe('Bad card');
    expect(err.code).toBe('BAD_REQUEST');
  });

  it('maps a no-response failure to a network error', () => {
    const err = toApiError({ request: {} });
    expect(err.code).toBe('NETWORK_ERROR');
  });
});
