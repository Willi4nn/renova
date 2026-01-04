import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError.js';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  console.error(' [Server Error]:', err);

  return res.status(500).json({
    error: 'Internal Server Error',
  });
}
