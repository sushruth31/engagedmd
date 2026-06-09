import { Router } from 'express';
import { validateCardRequest } from './middleware/validateRequest.js';
import { CardValidator } from './cardValidator.js';

const validator = new CardValidator();

/** Card-validation routes. Mounted at /api by the app factory. */
export const validateRouter = Router();

validateRouter.post('/validate', validateCardRequest, (req, res) => {
  const { cardNumber } = req.body as { cardNumber: string };
  // 200: the request itself succeeded; card validity is reported in the body.
  res.json(validator.validate(cardNumber));
});
