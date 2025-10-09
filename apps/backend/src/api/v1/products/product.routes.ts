import { Router } from 'express';
import ProductController from './product.controller';
import { createProductValidator, updateProductValidator } from './product.validator';
import { validate } from '../../../middlewares/validator.middleware';
import { protect, authorize } from '../../../middlewares/auth.middleware';
import upload from '../../../middlewares/upload.middleware';

// Membuat instance router baru
const productRouter = Router();

// --- Rute Khusus Penjual (Seller) ---
/**
 * @route   GET /api/v1/products/my-products
 * @desc    Mendapatkan semua produk milik penjual yang sedang login
 * @access  Private (Hanya Seller & Admin)
 */
productRouter.get(
  '/my-products',
  protect,
  authorize('seller', 'admin'),
  ProductController.getMyProducts
);

// --- Rute Publik ---
productRouter.get('/', ProductController.getAllProducts);
productRouter.get('/:id', ProductController.getProductById);

// --- Rute Terproteksi (CRUD Produk) ---
productRouter.post(
  '/',
  protect,
  authorize('seller', 'admin'),
  upload.single('productImage'),
  createProductValidator,
  validate,
  ProductController.createProduct
);

productRouter.put(
  '/:id',
  protect,
  authorize('seller', 'admin'),
  upload.single('productImage'),
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