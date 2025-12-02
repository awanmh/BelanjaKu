import bcrypt from 'bcryptjs';
import db from '../database/models';
import { UserAttributes } from '../database/models/user.model';
import HttpException from '../utils/http-exception.util';
import { StatusCodes } from 'http-status-codes';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.util';
import logger from '../utils/logger.util';

const User = db.User;

// Tipe data spesifik untuk input registrasi
export type RegisterInput = Pick<UserAttributes, 'email' | 'password' | 'fullName'>;

// Tipe data spesifik untuk input login
export type LoginInput = Pick<UserAttributes, 'email' | 'password'>;

/**
 * Service untuk menangani semua logika bisnis yang terkait dengan autentikasi.
 */
class AuthService {
  /**
   * Mendaftarkan pengguna baru ke dalam sistem.
   */
  public async register(userData: RegisterInput): Promise<Omit<UserAttributes, 'password'>> {
    const { email, password, fullName } = userData;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new HttpException(StatusCodes.CONFLICT, 'Email already exists');
    }

    const newUser = await User.create({
      fullName,
      email,
      password,
      role: 'user',
      isVerified: false,
    });

    // REFACTOR: Kita tidak perlu lagi menghapus password secara manual.
    // Hook toJSON di model User akan menanganinya secara otomatis.
    return newUser.toJSON();
  }

  /**
   * Melakukan proses login pengguna dan mengembalikan token jika berhasil.
   */
  public async login(credentials: LoginInput) {
    const { email, password } = credentials;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      logger.warn(`Login attempt failed for email: ${email}. User not found.`);
      throw new HttpException(StatusCodes.UNAUTHORIZED, 'Invalid email or password');
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      logger.warn(`Login attempt failed for user: ${email}. Incorrect password.`);
      throw new HttpException(StatusCodes.UNAUTHORIZED, 'Invalid email or password');
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // REFACTOR: Kita tidak perlu lagi menghapus password.
    // Hook toJSON akan menanganinya secara otomatis.
    return {
      user: user.toJSON(),
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }
}

// Ekspor sebagai singleton instance
export default new AuthService();