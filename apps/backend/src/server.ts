import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { StatusCodes } from "http-status-codes";
import { config as env } from "./config/env.config";
import db from "./database/models";
import HttpException from "./utils/http-exception.util";
import { errorMiddleware as globalErrorHandler } from "./middlewares/error.middleware";
import v1Router from "./api/v1";
import logger from "./utils/logger.util";

import rateLimit from "express-rate-limit"; // Security Requirement
import { createServer } from "http"; // Required for Socket.io
import socketGateway from "./gateways/socket.gateway";

const app: Application = express();
const httpServer = createServer(app); // Create HTTP server
const PORT = env.PORT;

// Middlewares
app.use(cors());
app.use(helmet());

// Rate Limiting: Max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use(limiter);

if (env.NODE_ENV !== "test") {
  app.use(
    morgan("combined", {
      stream: { write: (message) => logger.http(message.trim()) },
    })
  );
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sediakan folder 'uploads' secara statis agar bisa diakses
app.use("/uploads", express.static("uploads"));

// API Routes
app.get("/", (req, res) => {
  res.status(StatusCodes.OK).json({
    message: "Welcome to BelanjaKu E-commerce API",
    version: "1.0.0",
  });
});
app.use("/api/v1", v1Router);

app.use((req, res, next) => {
  next(
    new HttpException(
      StatusCodes.NOT_FOUND,
      "Resource not found on this server"
    )
  );
});

app.use(globalErrorHandler);

const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    logger.info("Database connection has been established successfully.");

    // Initialize Socket Gateway with the HTTP server
    socketGateway.init(httpServer);

    // Listen using httpServer instead of app
    httpServer.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`Socket.io is ready`);
    });
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

// Hanya mulai server jika file ini tidak sedang diimpor oleh Jest
if (process.env.NODE_ENV !== "test") {
  startServer();
}

export default app;
