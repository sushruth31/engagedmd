import express, { type Express } from 'express';
import cors from 'cors';
import { validateRouter } from './validateRoute.js';
import { errorHandler } from './errorHandler.js';

/**
 * Builds and configures the Express app. Kept separate from the network
 * bootstrap (index.ts) so tests can exercise it without binding a port, and so
 * new routers or middleware drop in here without touching startup.
 */
export const buildApp = (): Express => {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '1kb' }));

  app.get('/health', (_req, res) => { res.json({ status: 'ok' }); });
  app.use('/api', validateRouter);

  app.use(errorHandler);
  return app;
};
