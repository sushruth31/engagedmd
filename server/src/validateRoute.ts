import { Router } from 'express';
import { CardValidator } from './cardValidator.js';

const validator = new CardValidator();

/** Card-validation routes. Mounted at /api by the app factory. */
export const validateRouter = Router();

validateRouter.post('/validate', (req, res) => {
  const { cardNumber } = (req.body ?? {}) as { cardNumber?: unknown };
  if (typeof cardNumber !== 'string') {
    res.status(400).json({ valid: false, error: 'Request body must include a "cardNumber" string.' });
    return;
  }
  // 200: the request itself succeeded; card validity is reported in the body.
  res.json(validator.validate(cardNumber));
});
