import { StatusCodes } from "http-status-codes";
import NotificationService from "../notification.service";
import db from "../../database/models";
import ApiError from "../../utils/api-error.util";

// Mock dependencies
jest.mock("../../database/models", () => {
  return {
    __esModule: true,
    default: {
      Notification: {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
        update: jest.fn(),
      },
    },
  };
});

describe("NotificationService", () => {
  const mockUserId = "user-123";

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createNotification", () => {
    it("should create a notification successfully", async () => {
      const data = {
        userId: mockUserId,
        title: "Test",
        message: "Hello app",
        type: "SYSTEM" as const,
      };

      (db.Notification.create as jest.Mock).mockResolvedValue(data);

      await NotificationService.createNotification(data);

      expect(db.Notification.create).toHaveBeenCalledWith(data);
    });
  });

  describe("getUserNotifications", () => {
    it("should return notifications list", async () => {
      const mockRows = [{ id: "1", title: "Test" }];
      (db.Notification.findAll as jest.Mock).mockResolvedValue(mockRows);

      const result = await NotificationService.getUserNotifications(mockUserId);

      expect(db.Notification.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: mockUserId },
        })
      );
      expect(result).toHaveLength(1);
    });
  });

  describe("markAsRead", () => {
    it("should mark notification as read", async () => {
      const mockNotif = {
        id: "1",
        userId: mockUserId,
        isRead: false,
        update: jest.fn(),
        toJSON: () => ({ id: "1", isRead: true }),
      };

      (db.Notification.findByPk as jest.Mock).mockResolvedValue(mockNotif);

      await NotificationService.markAsRead("1", mockUserId);

      expect(mockNotif.update).toHaveBeenCalledWith({ isRead: true });
    });

    it("should throw NOT_FOUND if notification missing", async () => {
      (db.Notification.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(
        NotificationService.markAsRead("1", mockUserId)
      ).rejects.toThrow(
        new ApiError(StatusCodes.NOT_FOUND, "Notification not found")
      );
    });
  });
});
