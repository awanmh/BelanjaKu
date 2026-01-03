// Mengimpor service yang akan diuji
import AuthService from '../auth.service';
import ApiError from '../../utils/api-error.util';
import { StatusCodes } from 'http-status-codes';
import db from '../../database/models';
import bcrypt from 'bcryptjs';

// Mock dependensi eksternal
jest.mock('../../database/models', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
  Seller: {
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
const mockSeller = db.Seller as jest.Mocked<typeof db.Seller>;

describe('AuthService', () => {
  // Bersihkan semua mock setelah setiap tes
  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- Pengujian untuk Metode `register` ---
  describe('register', () => {
    it('should register a new user successfully as regular user and not return the password', async () => {
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
      expect(mockUser.create).toHaveBeenCalledWith(expect.objectContaining({
        role: 'user'
      }));

      expect(result).toEqual(userWithoutPassword);
      expect(result).not.toHaveProperty('password');
      expect(mockSeller.create).not.toHaveBeenCalled();
    });

    it('should register a new user as seller if email domain is @seller.belanjaku.com', async () => {
      const userData = {
        fullName: 'Seller User',
        email: 'toko@seller.belanjaku.com',
        password: 'Password123',
      };

      mockUser.findOne.mockResolvedValue(null);

      const { password, ...userWithoutPassword } = userData;
      // Simulasi hook toJSON (pastikan role adalah seller)
      const userWithSellerRole = { ...userWithoutPassword, role: 'seller' };
      const createdUser = { ...userData, id: 'seller-uuid', toJSON: () => userWithSellerRole };
      mockUser.create.mockResolvedValue(createdUser as any);
      mockSeller.create.mockResolvedValue({} as any);

      const result = (await AuthService.register(userData)) as any;

      expect(mockUser.create).toHaveBeenCalledWith(expect.objectContaining({
        role: 'seller'
      }));
      expect(mockSeller.create).toHaveBeenCalledWith(expect.objectContaining({
        userId: 'seller-uuid',
        storeName: 'Toko Seller User'
      }));
      expect(result.role).toBe('seller');
    });

    it('should throw a CONFLICT error if email already exists', async () => {
      const userData = {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
      };
      mockUser.findOne.mockResolvedValue({} as any);

      await expect(AuthService.register(userData)).rejects.toThrow(
        new ApiError(StatusCodes.CONFLICT, 'Email already exists')
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
        new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid email or password')
      );
    });

    it('should throw an UNAUTHORIZED error for an incorrect password', async () => {
      // Simulasikan user ditemukan tapi password tidak cocok
      mockUser.findOne.mockResolvedValue(mockDbUser as any);
      mockDbUser.comparePassword.mockResolvedValue(false); // Set return value untuk mock metode

      await expect(AuthService.login(loginCredentials)).rejects.toThrow(
        new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid email or password')
      );
    });
  });
});

