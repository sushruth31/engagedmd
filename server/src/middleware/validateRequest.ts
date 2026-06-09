import type { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../errors.js';
import { ERRORS } from '../constants.js';

/**
 * Guards request shape before the controller runs, so handlers can assume a
 * clean string. Express 5 forwards thrown errors to the error middleware.
 */
export const validateCardRequest = (req: Request, _res: Response, next: NextFunction): void => {
  const { cardNumber } = req.body as { cardNumber?: unknown };

  if (typeof cardNumber !== 'string') {
    throw new ValidationError(ERRORS.CARD_REQUIRED);
  }
  // Strip spaces and dashes, then reject if nothing is left.
  if (cardNumber.replace(/[\s-]/g, '').length === 0) {
    throw new ValidationError(ERRORS.CARD_EMPTY);
  }
  next();
};
