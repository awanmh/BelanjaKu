import { Router } from 'express';
import PromotionController from './promotion.controller';
import { createPromotionValidator, updatePromotionValidator } from './promotion.validator';
import { validate } from '../../../middlewares/validator.middleware';
import { protect, authorize } from '../../../middlewares/auth.middleware';

// Membuat instance router baru
const promotionRouter = Router();

// --- Rute Publik ---
// Siapa saja bisa melihat promosi yang ada
promotionRouter.get('/', PromotionController.findAll);
promotionRouter.get('/:id', PromotionController.findById);

// --- Rute Terproteksi (Hanya untuk Penjual & Admin) ---
// Hanya penjual/admin yang bisa membuat, mengubah, dan menghapus promosi
promotionRouter.post(
  '/',
  protect,
  authorize('seller', 'admin'),
  createPromotionValidator,
  validate,
  PromotionController.create
);

promotionRouter.put(
  '/:id',
  protect,
  authorize('seller', 'admin'),
  updatePromotionValidator,
  validate,
  PromotionController.update
);

promotionRouter.delete(
  '/:id',
  protect,
  authorize('seller', 'admin'),
  PromotionController.delete
);

export default promotionRouter;
