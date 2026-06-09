import { buildApp } from './app.js';

const PORT = Number(process.env.PORT) || 3001;

buildApp().listen(PORT, () => {
  process.stdout.write(`Credit Card Validator API listening on http://localhost:${PORT}\n`);
});
