import { Router } from 'express';
import ProductController from './product.controller';
import { createProductValidator, updateProductValidator } from './product.validator';
import { validate } from '../../../middlewares/validator.middleware';
import { protect, authorize } from '../../../middlewares/auth.middleware';

const productRouter = Router();

// Rute Publik (tidak memerlukan autentikasi)
productRouter.get('/', ProductController.getAllProducts);
productRouter.get('/:id', ProductController.getProductById);

// Rute Terproteksi (memerlukan autentikasi dan otorisasi)
productRouter.post(
  '/',
  protect, // 1. Pastikan pengguna sudah login
  authorize('seller', 'admin'), // 2. Pastikan peran adalah 'seller' atau 'admin'
  createProductValidator, // 3. Jalankan aturan validasi
  validate, // 4. Proses hasil validasi
  ProductController.createProduct // 5. Jalankan controller
);

productRouter.put(
  '/:id',
  protect,
  authorize('seller', 'admin'),
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
