import { Router } from 'express';
import AuthController from './auth.controller';
import { registerValidator, loginValidator } from './auth.validator';
// FIX: Menggunakan named import karena validator.middleware tidak memiliki default export
import { validate } from '../../../middlewares/validator.middleware';

// Membuat instance router baru
const authRouter = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Mendaftarkan pengguna baru
 * @access  Public
 */
authRouter.post(
  '/register',
  registerValidator, // 1. Jalankan aturan validasi untuk registrasi
  validate,          // 2. Middleware untuk menangani hasil validasi
  AuthController.register // 3. Jika valid, teruskan ke metode controller
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login pengguna dan dapatkan token
 * @access  Public
 */
authRouter.post(
  '/login',
  loginValidator, // 1. Jalankan aturan validasi untuk login
  validate,       // 2. Middleware untuk menangani hasil validasi
  AuthController.login // 3. Jika valid, teruskan ke metode controller
);

export default authRouter;

