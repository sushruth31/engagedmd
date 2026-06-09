import axios, { type AxiosError, type AxiosInstance } from 'axios';
import type { ValidationResponse } from './types';

/** Shape of a transport failure we care about — a minimal slice of AxiosError. */
type TransportError = { response?: { status: number }; code?: string };

/** Maps any transport/HTTP failure to a single user-facing message. */
export const toApiError = (error: TransportError): Error => {
  if (error.response) return new Error(`Validation service error (${error.response.status}).`);
  if (error.code === 'ECONNABORTED') return new Error('Request timed out. Please try again.');
  return new Error('Could not reach the validation service.');
};

/**
 * Typed API client. A single response interceptor centralises error handling,
 * so every method added here inherits consistent failure behaviour.
 */
export class ApiClient {
  private readonly http: AxiosInstance;

  constructor(baseURL = '/api') {
    this.http = axios.create({ baseURL, timeout: 5000 });
    this.http.interceptors.response.use(
      (res) => res,
      (error: AxiosError) => Promise.reject(toApiError(error)),
    );
  }

  async validateCard(cardNumber: string): Promise<ValidationResponse> {
    const { data } = await this.http.post<ValidationResponse>('/validate', { cardNumber });
    return data;
  }
}

export const api = new ApiClient();
