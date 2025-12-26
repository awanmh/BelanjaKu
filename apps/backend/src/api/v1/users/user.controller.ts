import { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import UserService, { UpdateUserInput } from '../../../services/user.service';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';

class UserController {
  /**
   * GET All Active Users
   */
  public async getAllUsers(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
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
   * GET Single User by ID
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
   * PUT Update User
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
   * DELETE User (Soft Delete)
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
   * GET All Archived Users
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
   * POST Restore User
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

export default new UserController();