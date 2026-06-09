import express, { type ErrorRequestHandler } from 'express';
import cors from 'cors';
import { validateCardNumber } from './validate.js';

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/validate', (req, res) => {
  const { cardNumber } = (req.body ?? {}) as { cardNumber?: unknown };
  if (typeof cardNumber !== 'string') {
    res.status(400).json({ valid: false, error: 'Request body must include a "cardNumber" string.' });
    return;
  }
  res.json(validateCardNumber(cardNumber));
});

const errorHandler: ErrorRequestHandler = (_err, _req, res, _next) => {
  res.status(500).json({ valid: false, error: 'Internal server error.' });
};
app.use(errorHandler);

app.listen(PORT, () => {
  process.stdout.write(`Credit Card Validator API → http://localhost:${PORT}\n`);
});
