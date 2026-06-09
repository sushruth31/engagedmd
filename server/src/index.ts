import { buildApp } from './app.js';
import { config } from './config.js';

buildApp().listen(config.port, () => {
  process.stdout.write(`Credit Card Validator API listening on http://localhost:${config.port}\n`);
});
