import axios, { type AxiosInstance } from 'axios';

/**
 * Normalised API failure. The interceptor converts every transport/HTTP error
 * into this shape, so the UI renders a message without parsing axios internals.
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** Minimal slice of an axios error — keeps `toApiError` pure and easy to test. */
type RawError = {
  response?: { status: number; data?: { error?: string; code?: string } };
  request?: unknown;
};

/** Maps a raw axios error to an ApiError. Pure — unit-tested directly. */
export const toApiError = (error: RawError): ApiError => {
  if (error.response) {
    const { status, data } = error.response;
    return new ApiError(data?.error || 'Request failed.', status, data?.code);
  }
  if (error.request) {
    return new ApiError('Service unavailable. Please try again.', 0, 'NETWORK_ERROR');
  }
  return new ApiError('An unexpected error occurred.', 0, 'UNKNOWN');
};

/**
 * Centralized API client over one axios instance. The response interceptor
 * unwraps `data` and normalizes every failure to an ApiError, so each method
 * added here inherits consistent behaviour with zero per-call boilerplate.
 */
export class ApiClient {
  private readonly http: AxiosInstance;

  constructor(baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api') {
    this.http = axios.create({
      baseURL,
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000,
    });
    this.http.interceptors.response.use(
      (response) => response.data,
      (error: unknown) => Promise.reject(toApiError(error as RawError)),
    );
  }

  post<T>(url: string, data?: unknown): Promise<T> {
    return this.http.post<T, T>(url, data);
  }

  get<T>(url: string): Promise<T> {
    return this.http.get<T, T>(url);
  }
}

export const apiClient = new ApiClient();
