import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthenticatedRequest } from "../../../middlewares/auth.middleware";
import NotificationService from "../../../services/notification.service";
import ApiError from "../../../utils/api-error.util";

class NotificationController {
  public async getNotifications(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user)
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          "Authentication required"
        );

      const notifications = await NotificationService.getUserNotifications(
        req.user.id
      );
      res.status(StatusCodes.OK).json({
        success: true,
        data: notifications,
      });
    } catch (error) {
      next(error);
    }
  }

  public async markAsRead(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user)
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          "Authentication required"
        );
      const { id } = req.params;

      const result = await NotificationService.markAsRead(id, req.user.id);
      res.status(StatusCodes.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public async markAllAsRead(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user)
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          "Authentication required"
        );

      await NotificationService.markAllAsRead(req.user.id);
      res.status(StatusCodes.OK).json({
        success: true,
        message: "All notifications marked as read",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new NotificationController();
