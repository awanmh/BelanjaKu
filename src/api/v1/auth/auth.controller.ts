import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import AuthService from '../../../services/auth.service';
import { RegisterInput, LoginInput } from '../../../services/auth.service'; // Impor tipe dari service

/**
 * Controller untuk menangani request yang berhubungan dengan autentikasi.
 * Menggunakan pola try-catch untuk menangkap error dan meneruskannya ke middleware error.
 */
class AuthController {
  /**
   * Menangani permintaan registrasi pengguna baru.
   */
  public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Mengambil data dari body request dan memastikan tipenya sesuai
      const registerData: RegisterInput = req.body;

      // Memanggil service untuk mendaftarkan pengguna
      const newUser = await AuthService.register(registerData);

      // Mengirimkan respons sukses
      res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'User registered successfully',
        data: newUser,
      });
    } catch (error) {
      // Jika terjadi error, teruskan ke middleware error handler
      next(error);
    }
  }

  /**
   * Menangani permintaan login pengguna.
   */
  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Mengambil data dari body request dan memastikan tipenya sesuai
      const loginData: LoginInput = req.body;

      // Memanggil service untuk proses login
      const result = await AuthService.login(loginData);

      // Mengirimkan respons sukses bersama dengan token
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      // Jika terjadi error, teruskan ke middleware error handler
      next(error);
    }
  }
}

// Ekspor sebagai singleton instance
export default new AuthController();
