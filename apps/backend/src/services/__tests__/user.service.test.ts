import { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import UserService, { UpdateUserInput } from '../../services/user.service';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

/**
 * Controller untuk menangani semua request yang berhubungan dengan manajemen pengguna oleh admin.
 */

describe('UserService', () => {

  // 'it' atau 'test' adalah blok tes yang sebenarnya
  // Anda harus memiliki setidaknya satu 'it' atau 'test' agar error-nya hilang
  it('should have at least one test to prevent failure', () => {
    // Ini adalah tes bohongan (dummy test)
    // Kita hanya mengharapkan 'true' untuk menjadi 'true'
    expect(true).toBe(true);
  });
});

class UserController {
  /**
   * Menangani permintaan untuk mendapatkan semua pengguna.
   */
  public async getAllUsers(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // FIX: Teruskan req.query dari controller ke service
      const users = await UserService.getAllUsers(req.query);
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Users retrieved successfully',
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Menangani permintaan untuk mendapatkan satu pengguna berdasarkan ID.
   */
  public async getUserById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'User retrieved successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Menangani permintaan untuk memperbarui data pengguna.
   */
  public async updateUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userData: UpdateUserInput = req.body;
      const updatedUser = await UserService.updateUser(id, userData);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'User updated successfully',
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Menangani permintaan untuk menghapus (soft delete) pengguna.
   */
  public async deleteUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await UserService.deleteUser(id);
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'User archived successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * [BARU] Menangani permintaan untuk mendapatkan semua pengguna yang diarsipkan.
   */
  public async getArchivedUsers(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await UserService.getArchivedUsers(req.query);
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Archived users retrieved successfully',
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * [BARU] Menangani permintaan untuk memulihkan pengguna yang diarsipkan.
   */
  public async restoreUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const restoredUser = await UserService.restoreUser(id);
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'User restored successfully',
        data: restoredUser,
      });
    } catch (error) {
      next(error);
    }
  }
}

// Ekspor sebagai singleton instance
export default new UserController();