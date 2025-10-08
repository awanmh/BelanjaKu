import { Router } from 'express';
import ShippingOptionController from './shipping.controller';
import { createShippingValidator, updateShippingValidator } from './shipping.validator';
import { validate } from '../../../middlewares/validator.middleware';
import { protect, authorize } from '../../../middlewares/auth.middleware';

// Membuat instance router baru
const shippingRouter = Router();

// --- Rute Publik ---
// Siapa saja bisa melihat opsi pengiriman yang tersedia
shippingRouter.get('/', ShippingOptionController.findAll);
shippingRouter.get('/:id', ShippingOptionController.findById);

// --- Rute Khusus Admin ---
// Hanya admin yang bisa membuat, mengubah, dan menghapus opsi pengiriman
shippingRouter.post(
  '/',
  protect,
  authorize('admin'),
  createShippingValidator,
  validate,
  ShippingOptionController.create
);

shippingRouter.put(
  '/:id',
  protect,
  authorize('admin'),
  updateShippingValidator,
  validate,
  ShippingOptionController.update
);

shippingRouter.delete(
  '/:id',
  protect,
  authorize('admin'),
  ShippingOptionController.delete
);

export default shippingRouter;
