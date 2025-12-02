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

      mockUser.findOne.mockResolvedValue(null);

      const { password, ...userWithoutPassword } = userData;
      // Simulasi hook toJSON
      const createdUser = { ...userData, id: 'some-uuid', toJSON: () => userWithoutPassword };
      mockUser.create.mockResolvedValue(createdUser as any);

      const result = await AuthService.register(userData);

      expect(mockUser.findOne).toHaveBeenCalledWith({ where: { email: userData.email } });
      expect(mockUser.create).toHaveBeenCalledWith(expect.any(Object));
      
      expect(result).toEqual(userWithoutPassword);
      expect(result).not.toHaveProperty('password');
    });

    it('should throw a CONFLICT error if email already exists', async () => {
      const userData = {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
      };
      mockUser.findOne.mockResolvedValue({} as any);

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
    // FIX: Tambahkan mock untuk metode comparePassword
    const mockDbUser = {
      id: 'some-uuid',
      email: 'test@example.com',
      password: 'hashedPassword',
      role: 'user',
      toJSON: () => ({ id: 'some-uuid', email: 'test@example.com', role: 'user' }),
      comparePassword: jest.fn(), // Tambahkan mock metode
    };

    it('should login a user and return tokens successfully', async () => {
      // Simulasikan user ditemukan dan password cocok
      mockUser.findOne.mockResolvedValue(mockDbUser as any);
      mockDbUser.comparePassword.mockResolvedValue(true); // Set return value untuk mock metode

      const result = await AuthService.login(loginCredentials);

      expect(mockUser.findOne).toHaveBeenCalledWith({ where: { email: loginCredentials.email } });
      expect(mockDbUser.comparePassword).toHaveBeenCalledWith(loginCredentials.password);
      expect(result.user).toEqual({ id: 'some-uuid', email: 'test@example.com', role: 'user' });
      expect(result.tokens.accessToken).toBe('mockAccessToken');
    });

    it('should throw an UNAUTHORIZED error for a non-existent user', async () => {
      mockUser.findOne.mockResolvedValue(null);

      await expect(AuthService.login(loginCredentials)).rejects.toThrow(
        new HttpException(StatusCodes.UNAUTHORIZED, 'Invalid email or password')
      );
    });

    it('should throw an UNAUTHORIZED error for an incorrect password', async () => {
      // Simulasikan user ditemukan tapi password tidak cocok
      mockUser.findOne.mockResolvedValue(mockDbUser as any);
      mockDbUser.comparePassword.mockResolvedValue(false); // Set return value untuk mock metode

      await expect(AuthService.login(loginCredentials)).rejects.toThrow(
        new HttpException(StatusCodes.UNAUTHORIZED, 'Invalid email or password')
      );
    });
  });
});

