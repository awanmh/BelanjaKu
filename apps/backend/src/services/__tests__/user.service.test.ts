import UserService from '../user.service';
import db from '../../database/models';
import HttpException from '../../utils/http-exception.util';
import { StatusCodes } from 'http-status-codes';

// Mock dependensi eksternal
jest.mock('../../database/models', () => ({
  User: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    destroy: jest.fn(),
  },
}));

const mockUser = db.User as jest.Mocked<typeof db.User>;

describe('UserService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- Pengujian untuk Metode `getAllUsers` ---
  describe('getAllUsers', () => {
    it('should return a list of users', async () => {
      const mockUsers = [
        { toJSON: () => ({ id: '1', email: 'user1@test.com' }) },
        { toJSON: () => ({ id: '2', email: 'user2@test.com' }) },
      ];
      mockUser.findAll.mockResolvedValue(mockUsers as any);

      const result = await UserService.getAllUsers();

      expect(mockUser.findAll).toHaveBeenCalled();
      expect(result.length).toBe(2);
      expect(result[0].email).toBe('user1@test.com');
    });
  });

  // --- Pengujian untuk Metode `getUserById` ---
  describe('getUserById', () => {
    it('should return a single user if found', async () => {
      const mockUserData = { id: '1', email: 'user1@test.com' };
      const mockUserInstance = { toJSON: () => mockUserData };
      mockUser.findByPk.mockResolvedValue(mockUserInstance as any);

      const result = await UserService.getUserById('1');

      expect(mockUser.findByPk).toHaveBeenCalledWith('1', expect.any(Object));
      expect(result).toEqual(mockUserData);
    });

    it('should throw NOT_FOUND if user is not found', async () => {
      mockUser.findByPk.mockResolvedValue(null);

      await expect(UserService.getUserById('1')).rejects.toThrow(
        new HttpException(StatusCodes.NOT_FOUND, 'User not found')
      );
    });
  });

  // --- Pengujian untuk Metode `updateUser` ---
  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      // FIX: Gunakan 'as const' untuk memberitahu TypeScript tipe yang lebih spesifik
      const updateData = { role: 'seller' } as const;
      const mockUserInstance = {
        update: jest.fn(),
      };
      mockUser.findByPk.mockResolvedValue(mockUserInstance as any);
      // Mock panggilan kedua di dalam updateUser
      jest.spyOn(UserService, 'getUserById').mockResolvedValue({ id: '1', role: 'seller' } as any);

      const result = await UserService.updateUser('1', updateData);

      expect(mockUser.findByPk).toHaveBeenCalledWith('1');
      expect(mockUserInstance.update).toHaveBeenCalledWith(updateData);
      expect(result.role).toBe('seller');
    });

    it('should throw NOT_FOUND if user to update is not found', async () => {
      mockUser.findByPk.mockResolvedValue(null);
      await expect(UserService.updateUser('1', {})).rejects.toThrow(
        new HttpException(StatusCodes.NOT_FOUND, 'User not found')
      );
    });
  });

  // --- Pengujian untuk Metode `deleteUser` ---
  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      const mockUserInstance = {
        destroy: jest.fn(),
      };
      mockUser.findByPk.mockResolvedValue(mockUserInstance as any);

      await UserService.deleteUser('1');

      expect(mockUser.findByPk).toHaveBeenCalledWith('1');
      expect(mockUserInstance.destroy).toHaveBeenCalledTimes(1);
    });

    it('should throw NOT_FOUND if user to delete is not found', async () => {
      mockUser.findByPk.mockResolvedValue(null);
      await expect(UserService.deleteUser('1')).rejects.toThrow(
        new HttpException(StatusCodes.NOT_FOUND, 'User not found')
      );
    });
  });
});

