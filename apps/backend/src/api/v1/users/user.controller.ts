import { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import UserService, { UpdateUserInput } from '../../../services/user.service';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';

/**
 * Controller untuk menangani semua request yang berhubungan dengan manajemen pengguna oleh admin.
 */
class UserController {
  /**
   * Menangani permintaan untuk mendapatkan semua pengguna.
   */
  public async getAllUsers(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await UserService.getAllUsers();
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
   * Menangani permintaan untuk menghapus pengguna.
   */
  public async deleteUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await UserService.deleteUser(id);
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

// Ekspor sebagai singleton instance
export default new UserController();
