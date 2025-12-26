import { Router } from "express";
import NotificationController from "./notification.controller";
import { protect } from "../../../middlewares/auth.middleware";

const router = Router();

router.use(protect);

router.get("/", NotificationController.getNotifications);
router.patch("/:id/read", NotificationController.markAsRead);
router.patch("/read-all", NotificationController.markAllAsRead);

export default router;
