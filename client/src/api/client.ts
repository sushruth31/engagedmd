import axios, { type AxiosInstance } from 'axios';
import { API_CONFIG, ERROR_CODES, MESSAGES } from '../constants';
import type { ErrorCode } from '@ccv/shared';

/**
 * Normalised API failure. The interceptor converts every transport/HTTP error
 * into this shape, so the UI renders a message without parsing axios internals.
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly code?: ErrorCode,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** Minimal slice of an axios error — keeps `toApiError` pure and easy to test. */
type RawError = {
  response?: { status: number; data?: { error?: string; code?: ErrorCode } };
  request?: unknown;
};

/** Maps a raw axios error to an ApiError. Pure — unit-tested directly. */
export const toApiError = (error: RawError): ApiError => {
  if (error.response) {
    const { status, data } = error.response;
    return new ApiError(data?.error || MESSAGES.REQUEST_FAILED, status, data?.code);
  }
  if (error.request) {
    return new ApiError(MESSAGES.UNAVAILABLE, 0, ERROR_CODES.NETWORK);
  }
  return new ApiError(MESSAGES.UNEXPECTED, 0, ERROR_CODES.UNKNOWN);
};

/**
 * Base HTTP client. Owns one configured axios instance whose response
 * interceptor unwraps `data` and normalizes failures to an ApiError. Domain
 * services extend this and call the protected verbs, so every request inherits
 * the same transport handling.
 */
export class ApiClient {
  private readonly http: AxiosInstance;

  constructor(baseURL = API_CONFIG.BASE_URL) {
    this.http = axios.create({
      baseURL,
      headers: { 'Content-Type': API_CONFIG.CONTENT_TYPE },
      timeout: API_CONFIG.TIMEOUT,
    });
    this.http.interceptors.response.use(
      (response) => response.data,
      (error: unknown) => Promise.reject(toApiError(error as RawError)),
    );
  }

  protected post<T>(url: string, data?: unknown): Promise<T> {
    return this.http.post<T, T>(url, data);
  }
}
