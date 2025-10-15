import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import HttpException from '../utils/http-exception.util';
import { config } from '../config/env.config';
import db from '../database/models';

const User = db.User;

// Interface untuk payload di dalam token
interface TokenPayload {
  id: string;
  email: string;
  role: 'user' | 'seller' | 'admin';
}

// Memperluas tipe Request dari Express untuk menyertakan properti 'user'
// Ini akan digunakan oleh controller yang memerlukan data user dari token
export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

/**
 * Middleware untuk melindungi rute. Memverifikasi token JWT dari header Authorization.
 */
export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Ambil token dari header (Format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // 2. Verifikasi token menggunakan secret key
      const decoded = jwt.verify(token, config.JWT_SECRET) as TokenPayload;
      
      // 3. Cari pengguna di database berdasarkan ID dari token
      const currentUser = await User.findByPk(decoded.id);

      if (!currentUser) {
        return next(new HttpException(StatusCodes.UNAUTHORIZED, 'User belonging to this token no longer exists.'));
      }

      // 4. Tempelkan data pengguna (payload) ke objek request agar bisa diakses oleh controller selanjutnya
      req.user = decoded;

      next(); // Lanjutkan ke middleware atau controller berikutnya
    } catch (error) {
      next(new HttpException(StatusCodes.UNAUTHORIZED, 'Not authorized, token failed'));
    }
  }

  if (!token) {
    return next(new HttpException(StatusCodes.UNAUTHORIZED, 'Not authorized, no token provided'));
  }
};

/**
 * Middleware untuk memberikan otorisasi berdasarkan peran (role).
 * @param roles Array dari peran yang diizinkan untuk mengakses rute.
 */
export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new HttpException(
          StatusCodes.FORBIDDEN,
          `User role '${req.user?.role}' is not authorized to access this route`
        )
      );
    }
    next();
  };
};
