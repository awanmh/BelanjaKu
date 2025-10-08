import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { StatusCodes } from 'http-status-codes';

import { config as env } from './config/env.config';
import db from './database/models';
import HttpException from './utils/http-exception.util';
import { errorMiddleware as globalErrorHandler } from './middlewares/error.middleware';
import v1Router from './api/v1';
import logger from './utils/logger.util'; // 1. Impor logger

const app: Application = express();
const PORT = env.PORT;

// Middlewares
app.use(cors());
app.use(helmet());
// Gunakan logger untuk mencatat request HTTP
app.use(morgan('combined', { stream: { write: (message) => logger.http(message.trim()) } }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.get('/', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    message: 'Welcome to BelanjaKu E-commerce API',
    version: '1.0.0',
  });
});

app.use('/api/v1', v1Router);

// 404 Not Found Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new HttpException(StatusCodes.NOT_FOUND, 'Resource not found on this server'));
});

// Global Error Handler
app.use(globalErrorHandler);

const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    logger.info('Database connection has been established successfully.');

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();

export default app;