import { Router } from 'express';
import WishlistController from './wishlist.controller';
import { protect } from '../../../middlewares/auth.middleware';

const router = Router();

// Semua route wishlist memerlukan authentication
router.use(protect);

/**
 * @route   POST /api/v1/wishlist
 * @desc    Add product to wishlist
 * @access  Private
 */
router.post('/', WishlistController.addToWishlist.bind(WishlistController));

/**
 * @route   GET /api/v1/wishlist
 * @desc    Get user's wishlist
 * @access  Private
 */
router.get('/', WishlistController.getWishlist.bind(WishlistController));

/**
 * @route   DELETE /api/v1/wishlist/:id
 * @desc    Remove item from wishlist
 * @access  Private
 */
router.delete('/:id', WishlistController.removeFromWishlist.bind(WishlistController));

/**
 * @route   DELETE /api/v1/wishlist
 * @desc    Clear all wishlist items
 * @access  Private
 */
router.delete('/', WishlistController.clearWishlist.bind(WishlistController));

export default router;
