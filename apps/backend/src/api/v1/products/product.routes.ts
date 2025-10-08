import { Router } from 'express';
import ProductController from './product.controller';
import { createProductValidator, updateProductValidator } from './product.validator';
import { validate } from '../../../middlewares/validator.middleware';
import { protect, authorize } from '../../../middlewares/auth.middleware';
import upload from '../../../middlewares/upload.middleware'; // 1. Impor middleware upload

// Membuat instance router baru
const productRouter = Router();

// Rute Publik
productRouter.get('/', ProductController.getAllProducts);
productRouter.get('/:id', ProductController.getProductById);

// Rute Terproteksi (hanya untuk seller dan admin)
productRouter.post(
  '/',
  protect,
  authorize('seller', 'admin'),
  upload.single('productImage'), // 2. Tambahkan middleware di sini
  createProductValidator,
  validate,
  ProductController.createProduct
);

productRouter.put(
  '/:id',
  protect,
  authorize('seller', 'admin'),
  upload.single('productImage'), // 2. Tambahkan middleware di sini juga
  updateProductValidator,
  validate,
  ProductController.updateProduct
);

productRouter.delete(
  '/:id',
  protect,
  authorize('seller', 'admin'),
  ProductController.deleteProduct
);

export default productRouter;
