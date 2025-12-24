import { Router } from 'express';
import CartController from './cart.controller';
import { protect } from '../../../middlewares/auth.middleware';

const router = Router();

// Semua route cart memerlukan authentication
router.use(protect);

/**
 * @route   POST /api/v1/cart
 * @desc    Add product to cart
 * @access  Private
 */
router.post('/', CartController.addToCart.bind(CartController));

/**
 * @route   GET /api/v1/cart
 * @desc    Get user's cart with summary
 * @access  Private
 */
router.get('/', CartController.getCart.bind(CartController));

/**
 * @route   PATCH /api/v1/cart/:id
 * @desc    Update cart item quantity
 * @access  Private
 */
router.patch('/:id', CartController.updateCartItem.bind(CartController));

/**
 * @route   DELETE /api/v1/cart/:id
 * @desc    Remove item from cart
 * @access  Private
 */
router.delete('/:id', CartController.removeCartItem.bind(CartController));

/**
 * @route   DELETE /api/v1/cart
 * @desc    Clear all cart items
 * @access  Private
 */
router.delete('/', CartController.clearCart.bind(CartController));

export default router;
