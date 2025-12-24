import { Router } from 'express';
import SellerController from './seller.controller';
import { upsertProfileValidator } from './seller.validator';
import { validate } from '../../../middlewares/validator.middleware';
import { protect, authorize } from '../../../middlewares/auth.middleware';

// Membuat instance router baru
const sellerRouter = Router();

// 🔐 Semua rute di bawah ini memerlukan autentikasi dan peran 'seller' atau 'admin'.
sellerRouter.use(protect);
sellerRouter.use(authorize('seller', 'admin'));

/**
 * @route   GET /api/v1/sellers/dashboard/stats
 * @desc    Mendapatkan statistik dasbor untuk penjual yang sedang login
 * @access  Private (Hanya Seller & Admin)
 */
sellerRouter.get('/dashboard/stats', SellerController.getDashboardStats);

/**
 * @route   GET /api/v1/sellers/dashboard/low-stock
 * @desc    Mendapatkan produk dengan stok menipis
 * @access  Private (Hanya Seller & Admin)
 */
sellerRouter.get('/dashboard/low-stock', SellerController.getLowStockProducts);

/**
 * @route   GET /api/v1/sellers/profile/me
 * @desc    Mendapatkan profil penjual yang sedang login
 * @access  Private (Hanya Seller & Admin)
 */
sellerRouter.get('/profile/me', SellerController.getMyProfile);

/**
 * @route   POST /api/v1/sellers/profile
 * @desc    Membuat atau memperbarui profil penjual
 * @access  Private (Hanya Seller & Admin)
 */
sellerRouter.post(
  '/profile',
  upsertProfileValidator, // 1. Jalankan aturan validasi
  validate,               // 2. Tangani hasil validasi
  SellerController.upsertProfile // 3. Jika valid, teruskan ke controller
);

export default sellerRouter;