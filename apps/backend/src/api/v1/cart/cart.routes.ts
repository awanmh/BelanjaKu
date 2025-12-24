// backend/src/api/v1/cart/cart.routes.ts
import { Router } from 'express';
import * as cartController from './cart.controller';
import * as cartValidator from './cart.validator';
import { protect } from '../../../middlewares/auth.middleware'; // Sesuaikan path middleware auth Anda
import { validate } from '../../../middlewares/validator.middleware'; // Middleware untuk handle error validation

const router = Router();

// Semua route di bawah ini butuh login
router.use(protect);

router.get('/', cartController.getMyCart);

router.post(
    '/',
    cartValidator.addToCartValidator,
    validate,
    cartController.addItem
);

router.patch(
    '/:id',
    cartValidator.updateCartValidator,
    validate,
    cartController.updateItem
);

router.delete('/:id', cartController.removeItem);
router.delete('/', cartController.clearAll);

export default router;