import { NextFunction, Request, Response } from 'express';
import { logger } from '../logger';

export function globalErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  logger.error(`Global Error Handler triggered, reason: ${JSON.stringify(err)}`);

  if (res.headersSent) {
    logger.error(
      `Response was already being written, delegating to built-in Express error handler`
    );
    return next(err);
  }

  res.status(500).json({
    status: 'error',
    message: 'Global Error Handler triggered, check logs',
    err,
  });
}
