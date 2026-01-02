import { Router } from 'express';
import CartController from './cart.controller';
import { protect } from '../../../middlewares/auth.middleware';
// 1. UBAH IMPORT DI SINI:
import { validateJoi } from '../../../middlewares/validator.middleware'; 
import { addToCartSchema, updateCartItemSchema } from './cart.validator';

const router = Router();

router.use(protect);

router.get('/', CartController.getMyCart);

// 2. GUNAKAN 'validateJoi' DI SINI:
router.post(
  '/', 
  validateJoi(addToCartSchema), // <-- Ganti 'validate' jadi 'validateJoi'
  CartController.addToCart
);

router.patch(
  '/items/:itemId', 
  validateJoi(updateCartItemSchema), // <-- Ganti 'validate' jadi 'validateJoi'
  CartController.updateItemQuantity
);

router.delete('/items/:itemId', CartController.removeItem);
router.delete('/', CartController.clearCart);

export default router;