import type { ErrorCode } from '@ccv/shared';

/** API client configuration. Base URL is env-overridable for deployment. */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 5000,
  CONTENT_TYPE: 'application/json',
} as const;

/** Endpoints called by the client. */
export const ENDPOINTS = {
  VALIDATE: '/validate',
} as const;

/** UI configuration. */
export const UI = {
  DEBOUNCE_MS: 400,
  MAX_CARD_DIGITS: 19,
  DIGIT_GROUP_SIZE: 4,
} as const;

/** Client-owned error messages (the server owns validation copy). */
export const MESSAGES = {
  REQUEST_FAILED: 'Request failed.',
  UNAVAILABLE: 'Service unavailable. Please try again.',
  UNEXPECTED: 'An unexpected error occurred.',
  VALIDATION_FAILED: 'Validation failed.',
} as const;

/** Transport-failure codes surfaced from the interceptor. */
export const ERROR_CODES = {
  NETWORK: 'NETWORK_ERROR',
  UNKNOWN: 'UNKNOWN',
} as const satisfies Record<string, ErrorCode>;
