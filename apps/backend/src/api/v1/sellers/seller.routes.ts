import { Router } from 'express';
import SellerController from './seller.controller';
import { upsertProfileValidator } from './seller.validator';
import { validate } from '../../../middlewares/validator.middleware';
import { protect, authorize } from '../../../middlewares/auth.middleware';

const sellerRouter = Router();

// Semua rute di bawah ini memerlukan autentikasi dan peran 'seller'
sellerRouter.use(protect, authorize('seller'));

/**
 * @route   GET /api/v1/sellers/me
 * @desc    Mendapatkan profil toko penjual yang sedang login
 * @access  Private (Hanya Seller)
 */
sellerRouter.get('/me', SellerController.getMyProfile);

/**
 * @route   PUT /api/v1/sellers/me
 * @desc    Membuat atau memperbarui profil toko penjual
 * @access  Private (Hanya Seller)
 */
sellerRouter.put(
  '/me',
  upsertProfileValidator,
  validate,
  SellerController.upsertMyProfile
);

export default sellerRouter;
