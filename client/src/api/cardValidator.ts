import { ApiClient } from './client';
import { ENDPOINTS } from '../constants';
import type { ValidationResponse } from '@ccv/shared';

/**
 * Card-validation API. Extends the base client to inherit its configured axios
 * instance and centralized error handling; each endpoint is one method.
 */
export class CardValidatorApi extends ApiClient {
  validate(cardNumber: string): Promise<ValidationResponse> {
    return this.post(ENDPOINTS.VALIDATE, { cardNumber });
  }
}

export const cardValidatorApi = new CardValidatorApi();
