import express, { type Express } from 'express';
import cors from 'cors';
import { config } from './config.js';
import { ROUTES, HEALTH_RESPONSE, BODY_LIMIT } from './constants.js';
import { validateRouter } from './validateRoute.js';
import { errorHandler } from './errorHandler.js';

/**
 * Builds and configures the Express app. Separate from the network bootstrap
 * (index.ts) so tests exercise it without binding a port, and so new routers
 * or middleware drop in here without touching startup.
 */
export const buildApp = (): Express => {
  const app = express();

  app.use(cors({ origin: config.cors.origin }));
  app.use(express.json({ limit: BODY_LIMIT }));

  app.get(ROUTES.HEALTH, (_req, res) => {
    res.json(HEALTH_RESPONSE);
  });
  app.use(ROUTES.API_PREFIX, validateRouter);

  app.use(errorHandler);
  return app;
};
