// Mengimpor service yang akan diuji
import AuthService from '../auth.service';
import HttpException from '../../utils/http-exception.util';
import { StatusCodes } from 'http-status-codes';
import db from '../../database/models';
import bcrypt from 'bcryptjs';

// Mock dependensi eksternal
jest.mock('../../database/models', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('bcryptjs');
jest.mock('../../utils/jwt.util', () => ({
  generateAccessToken: jest.fn(() => 'mockAccessToken'),
  generateRefreshToken: jest.fn(() => 'mockRefreshToken'),
}));

// Cast mock untuk tipe yang benar
const mockUser = db.User as jest.Mocked<typeof db.User>;

describe('AuthService', () => {
  // Bersihkan semua mock setelah setiap tes
  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- Pengujian untuk Metode `register` ---
  describe('register', () => {
    it('should register a new user successfully and not return the password', async () => {
      const userData = {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
      };

      // Simulasikan bahwa email belum ada
      mockUser.findOne.mockResolvedValue(null);

      // Simulasikan bahwa user berhasil dibuat
      const { password, ...userWithoutPassword } = userData; // Objek tanpa password untuk perbandingan
      const createdUser = { ...userData, id: 'some-uuid', toJSON: () => userWithoutPassword };
      mockUser.create.mockResolvedValue(createdUser as any);

      const result = await AuthService.register(userData);

      expect(mockUser.findOne).toHaveBeenCalledWith({ where: { email: userData.email } });
      expect(mockUser.create).toHaveBeenCalledWith(expect.any(Object));
      
      // FIX: Bandingkan hasil dengan objek yang tidak memiliki password
      expect(result).toEqual(userWithoutPassword);
      // Pastikan hasilnya tidak mengandung properti password
      expect(result).not.toHaveProperty('password');
    });

    it('should throw a CONFLICT error if email already exists', async () => {
      const userData = {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
      };

      // Simulasikan bahwa email sudah ada
      mockUser.findOne.mockResolvedValue({} as any);

      // Harapkan service untuk melempar error
      await expect(AuthService.register(userData)).rejects.toThrow(
        new HttpException(StatusCodes.CONFLICT, 'Email already exists')
      );
    });
  });

  // --- Pengujian untuk Metode `login` ---
  describe('login', () => {
    const loginCredentials = {
      email: 'test@example.com',
      password: 'Password123',
    };
    const mockDbUser = {
      id: 'some-uuid',
      email: 'test@example.com',
      password: 'hashedPassword', // Password yang sudah di-hash
      role: 'user',
      toJSON: () => ({ id: 'some-uuid', email: 'test@example.com', role: 'user' }),
    };

    it('should login a user and return tokens successfully', async () => {
      // Simulasikan user ditemukan dan password cocok
      mockUser.findOne.mockResolvedValue(mockDbUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await AuthService.login(loginCredentials);

      expect(mockUser.findOne).toHaveBeenCalledWith({ where: { email: loginCredentials.email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginCredentials.password, mockDbUser.password);
      expect(result.user).toEqual({ id: 'some-uuid', email: 'test@example.com', role: 'user' });
      expect(result.tokens.accessToken).toBe('mockAccessToken');
    });

    it('should throw an UNAUTHORIZED error for a non-existent user', async () => {
      // Simulasikan user tidak ditemukan
      mockUser.findOne.mockResolvedValue(null);

      await expect(AuthService.login(loginCredentials)).rejects.toThrow(
        new HttpException(StatusCodes.UNAUTHORIZED, 'Invalid email or password')
      );
    });

    it('should throw an UNAUTHORIZED error for an incorrect password', async () => {
      // Simulasikan user ditemukan tapi password tidak cocok
      mockUser.findOne.mockResolvedValue(mockDbUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(AuthService.login(loginCredentials)).rejects.toThrow(
        new HttpException(StatusCodes.UNAUTHORIZED, 'Invalid email or password')
      );
    });
  });
});