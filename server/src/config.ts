/**
 * Centralized configuration. Reads the environment once, with sensible
 * defaults, so deployment is a matter of env vars — not code changes.
 */
export const config = {
  port: Number(process.env.PORT) || 3001,
  cors: {
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  },
} as const;
