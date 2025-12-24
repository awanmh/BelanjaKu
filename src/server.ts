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
import logger from './utils/logger.util';

const app: Application = express();
const PORT = env.PORT;

// Middlewares
app.use(cors());
app.use(helmet());
if (env.NODE_ENV !== 'test') {
  app.use(morgan('combined', { stream: { write: (message) => logger.http(message.trim()) } }));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sediakan folder 'uploads' secara statis agar bisa diakses
app.use('/uploads', express.static('uploads'));

// API Routes
app.get('/', (req, res) => {
  res.status(StatusCodes.OK).json({
    message: 'Welcome to BelanjaKu E-commerce API',
    version: '1.0.0',
  });
});
app.use('/api/v1', v1Router);

app.use((req, res, next) => {
  next(new HttpException(StatusCodes.NOT_FOUND, 'Resource not found on this server'));
});

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

// Hanya mulai server jika file ini tidak sedang diimpor oleh Jest
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;