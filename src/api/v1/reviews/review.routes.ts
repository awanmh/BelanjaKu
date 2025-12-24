import { Router } from 'express';
import ReviewController from './review.controller';
import { createReviewValidator } from './review.validator';
import { validate } from '../../../middlewares/validator.middleware';
import { protect } from '../../../middlewares/auth.middleware';

// Membuat instance router baru
const reviewRouter = Router();

/**
 * @route   GET /api/v1/reviews/product/:productId
 * @desc    Mendapatkan semua ulasan untuk produk tertentu
 * @access  Public
 */
reviewRouter.get('/product/:productId', ReviewController.getReviewsByProduct);

/**
 * @route   POST /api/v1/reviews
 * @desc    Membuat ulasan baru untuk sebuah produk
 * @access  Private (hanya untuk pengguna yang login)
 */
reviewRouter.post(
  '/',
  protect, // 1. Pastikan pengguna sudah login
  createReviewValidator, // 2. Jalankan aturan validasi
  validate, // 3. Tangani hasil validasi
  ReviewController.createReview // 4. Jika valid, teruskan ke controller
);

export default reviewRouter;
