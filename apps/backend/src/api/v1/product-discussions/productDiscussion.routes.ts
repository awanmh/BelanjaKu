import { Router } from "express";
import ProductDiscussionController from "./productDiscussion.controller";
import { protect } from "../../../middlewares/auth.middleware";

const router = Router();

// Public route to view discussions
router.get("/product/:productId", ProductDiscussionController.getByProduct);

// Protected routes
router.post("/", protect, ProductDiscussionController.create);
router.delete("/:id", protect, ProductDiscussionController.delete);

export default router;
