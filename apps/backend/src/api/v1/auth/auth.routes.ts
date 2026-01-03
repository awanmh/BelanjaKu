import { Router } from 'express';
import AuthController from './auth.controller';
import { registerValidator, loginValidator } from './auth.validator';
import { validate } from '../../../middlewares/validator.middleware';
import { authLimiter } from '../../../middlewares/rateLimit.middleware'; // 1. Impor rate limiter

// Membuat instance router baru
const authRouter = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Mendaftarkan pengguna baru
 * @access  Public
 */
authRouter.post(
  '/register',
  authLimiter, // 2. Terapkan rate limiter di sini
  registerValidator,
  validate,
  AuthController.register
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login pengguna dan dapatkan token
 * @access  Public
 */
authRouter.post(
  '/login',
  authLimiter, // 2. Terapkan rate limiter di sini juga
  loginValidator,
  validate,
  AuthController.login
);

export default authRouter;
