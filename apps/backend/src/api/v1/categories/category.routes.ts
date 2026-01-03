import { Router } from 'express';
import CategoryController from './category.controller';
import { categoryValidator } from './category.validator';
import { validate } from '../../../middlewares/validator.middleware';
import { protect, authorize } from '../../../middlewares/auth.middleware';

// Membuat instance router baru
const categoryRouter = Router();

// Rute Publik (siapa saja bisa melihat)
categoryRouter.get('/', CategoryController.getAllCategories);
categoryRouter.get('/:id', CategoryController.getCategoryById);

// Rute Terproteksi (hanya untuk admin)
categoryRouter.post(
  '/',
  protect, // 1. Pastikan pengguna sudah login
  authorize('admin'), // 2. Pastikan pengguna adalah admin
  categoryValidator, // 3. Jalankan aturan validasi
  validate, // 4. Middleware untuk menangani hasil validasi
  CategoryController.createCategory // 5. Jika valid, teruskan ke controller
);

categoryRouter.put(
  '/:id',
  protect,
  authorize('admin'),
  categoryValidator,
  validate,
  CategoryController.updateCategory
);

categoryRouter.delete(
  '/:id',
  protect,
  authorize('admin'),
  CategoryController.deleteCategory
);

export default categoryRouter;
    
