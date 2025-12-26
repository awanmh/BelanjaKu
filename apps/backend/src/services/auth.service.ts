import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import db from '../database/models';
import { UserAttributes } from '../database/models/user.model';
import HttpException from '../utils/http-exception.util';
import { StatusCodes } from 'http-status-codes';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.util';
import logger from '../utils/logger.util';
import { sendResetPasswordEmail } from '../utils/email.util';

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
   * Role ditentukan otomatis berdasarkan domain email.
   */
  public async register(userData: RegisterInput): Promise<Omit<UserAttributes, 'password'>> {
    const { email, password, fullName } = userData;

    // 1. Cek apakah user sudah ada
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new HttpException(StatusCodes.CONFLICT, 'Email already exists');
    }

    // 2. Tentukan role berdasarkan domain email
    let role: 'user' | 'seller' | 'admin' = 'user';

    if (email.includes('@admin.belanjaku.com')) {
      role = 'admin';
    } else if (email.includes('@seller.belanjaku.com')) {
      role = 'seller';
    }

    // 3. Buat user baru dengan role sesuai
    const newUser = await User.create({
      fullName,
      email,
      password,
      role: role,
      isVerified: true,
    });

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

    return {
      user: user.toJSON(),
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  /**
   * Mengirim email reset password jika user lupa kata sandi.
   */
  public async forgotPassword(email: string) {
    const user: any = await User.findOne({ where: { email } });

    if (!user) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'User with that email does not exist');
    }

    // 1. Generate Reset Token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // 2. Simpan token ke DB
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600 * 1000);
    await user.save();

    // 3. Kirim Email
    try {
      await sendResetPasswordEmail(user.email, resetToken);
    } catch (error) {
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      logger.error('Failed to send reset email', error);
      throw new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, 'Error sending email');
    }

    return { message: 'Password reset link sent to your email' };
  }
}

// Ekspor sebagai singleton instance
export default new AuthService();