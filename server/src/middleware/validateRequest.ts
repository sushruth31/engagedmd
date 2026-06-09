import type { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../errors.js';

/**
 * Guards request shape before the controller runs, so handlers can assume a
 * clean string. Express 5 forwards thrown errors to the error middleware.
 */
export const validateCardRequest = (req: Request, _res: Response, next: NextFunction): void => {
  const { cardNumber } = req.body as { cardNumber?: unknown };

  if (typeof cardNumber !== 'string') {
    throw new ValidationError('Card number is required and must be a string.');
  }
  if (cardNumber.replace(/[\s-]/g, '').length === 0) {
    throw new ValidationError('Card number cannot be empty.');
  }
  next();
};
