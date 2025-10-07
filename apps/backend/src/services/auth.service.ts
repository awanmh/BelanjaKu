import bcrypt from 'bcryptjs';
import db from '../database/models';
import { UserAttributes } from '../database/models/user.model';
import HttpException from '../utils/http-exception.util';
import { StatusCodes } from 'http-status-codes';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.util';

const User = db.User;

// FIX: Tambahkan keyword 'export' agar tipe ini bisa diimpor oleh file lain
export type RegisterInput = Pick<UserAttributes, 'email' | 'password' | 'fullName'>;

// FIX: Tambahkan keyword 'export' agar tipe ini bisa diimpor oleh file lain
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

    const { password: _, ...userWithoutPassword } = newUser.toJSON();
    return userWithoutPassword;
  }

  /**
   * Melakukan proses login pengguna dan mengembalikan token jika berhasil.
   */
  public async login(credentials: LoginInput) {
    const { email, password } = credentials;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new HttpException(StatusCodes.UNAUTHORIZED, 'Invalid email or password');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new HttpException(StatusCodes.UNAUTHORIZED, 'Invalid email or password');
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    const { password: __, ...userWithoutPassword } = user.toJSON();

    return {
      user: userWithoutPassword,
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }
}

export default new AuthService();

