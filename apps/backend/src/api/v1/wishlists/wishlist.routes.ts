import { Router } from "express";
import WishlistController from "./wishlist.controller";
import { protect } from "../../../middlewares/auth.middleware";

const router = Router();

router.use(protect); // All wishlist routes require auth

router.get("/", WishlistController.getWishlist);
router.post("/", WishlistController.addToWishlist);
router.delete("/:id", WishlistController.removeFromWishlist); // :id is productId

export default router;
