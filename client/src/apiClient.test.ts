import { describe, it, expect } from 'vitest';
import { toApiError } from './apiClient';

describe('toApiError — interceptor error mapping', () => {
  it('maps an HTTP error response to its status', () => {
    expect(toApiError({ response: { status: 500 } }).message).toContain('500');
  });

  it('maps a timeout to a friendly message', () => {
    expect(toApiError({ code: 'ECONNABORTED' }).message).toContain('timed out');
  });

  it('maps a network failure to a reachability message', () => {
    expect(toApiError({}).message).toContain('reach');
  });
});
