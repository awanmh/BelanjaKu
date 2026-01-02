import { StatusCodes } from "http-status-codes";
import db from "../database/models";
import HttpException from "../utils/http-exception.util";

const Notification = db.Notification;

export type CreateNotificationInput = {
  userId: string;
  title: string;
  message: string;
  type: "ORDER" | "PROMO" | "SYSTEM" | "TRANSACTION";
  metadata?: any;
};

class NotificationService {
  /**
   * Create a new notification (usually called internally by other services)
   */
  public async createNotification(data: CreateNotificationInput) {
    await Notification.create(data);
  }

  /**
   * Get all notifications for a user
   */
  public async getUserNotifications(userId: string) {
    const notifications = await Notification.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });
    return notifications;
  }

  /**
   * Mark a notification as read
   */
  public async markAsRead(id: string, userId: string) {
    const notification = await Notification.findByPk(id);
    if (!notification) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Notification not found");
    }
    if (notification.userId !== userId) {
      throw new HttpException(StatusCodes.FORBIDDEN, "Access denied");
    }

    await notification.update({ isRead: true });
    return notification;
  }

  /**
   * Mark all notifications as read
   */
  public async markAllAsRead(userId: string) {
    await Notification.update(
      { isRead: true },
      {
        where: { userId, isRead: false },
      }
    );
  }
}

export default new NotificationService();
