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

/**
 * Fallback for requests that never complete (network down, timeout). When the
 * API does respond — even with a 4xx/5xx — its envelope supplies the message.
 */
export const MESSAGES = {
  UNAVAILABLE: 'Could not reach the validation service.',
} as const;
