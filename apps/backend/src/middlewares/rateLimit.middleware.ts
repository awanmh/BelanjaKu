import rateLimit from 'express-rate-limit';
import { StatusCodes } from 'http-status-codes';

/**
 * Middleware untuk membatasi permintaan ke endpoint sensitif seperti login dan register.
 * Ini membantu mencegah serangan brute-force.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Jendela waktu: 15 menit
  max: 10, // Maksimal 10 permintaan dari satu IP selama jendela waktu di atas
  standardHeaders: true, // Kirim header 'RateLimit-*'
  legacyHeaders: false, // Nonaktifkan header 'X-RateLimit-*'
  message: {
    status: 'error',
    statusCode: StatusCodes.TOO_MANY_REQUESTS,
    message: 'Too many login attempts from this IP, please try again after 15 minutes',
  },
});
