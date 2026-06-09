import { apiClient } from './client';
import type { ValidationResponse } from '@ccv/shared';

/**
 * Card-validation API methods. Thin wrappers — business logic lives on the
 * server. Adding endpoints (tokenize, BIN lookup, batch) is a one-liner here.
 */
export const cardValidatorApi = {
  validate: (cardNumber: string): Promise<ValidationResponse> =>
    apiClient.post('/validate', { cardNumber }),
};
