import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import HttpException from '../utils/http-exception.util';
import logger from '../utils/logger.util'; // 1. Impor logger

export const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = error.message || 'Something went wrong on the server.';

  // 2. Gunakan logger untuk mencatat detail error
  logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
  
  res.status(status).json({
    status: 'error',
    statusCode: status,
    message: message,
  });
};