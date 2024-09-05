import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { NODE_ENV } from '../constants/env';
import AppError from '../utils/AppError';
import HttpStatusCode from '../constants/httpStatusCode';

const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ZodError) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      message: 'Validation Error',
      errors: err.errors,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      errorCode: err.errorCode,
    });
  }

  return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
    message: err.message,
    stack: NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

export default errorHandler;
