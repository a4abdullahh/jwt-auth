import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { NODE_ENV } from '../constants/env';
import { HTTP_STATUS } from '../constants/httpStatusCodes';

const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode =
    res.statusCode === HTTP_STATUS.OK
      ? HTTP_STATUS.INTERNAL_SERVER_ERROR
      : res.statusCode;
  res.status(statusCode);

  res.json({
    message: err.message,
    stack: NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

export default errorHandler;
