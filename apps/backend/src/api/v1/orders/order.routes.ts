import { Router } from 'express';
import OrderController from './order.controller';
import { createOrderValidator } from './order.validator';
import { validate } from '../../../middlewares/validator.middleware';
import { protect } from '../../../middlewares/auth.middleware';

// Membuat instance router baru
const orderRouter = Router();

// Semua rute di bawah ini memerlukan autentikasi, jadi kita gunakan middleware 'protect' di awal
orderRouter.use(protect);

/**
 * @route   POST /api/v1/orders
 * @desc    Membuat pesanan baru (checkout)
 * @access  Private (hanya untuk pengguna yang login)
 */
orderRouter.post(
  '/',
  createOrderValidator, // 1. Jalankan aturan validasi
  validate,             // 2. Tangani hasil validasi
  OrderController.createOrder // 3. Jika valid, teruskan ke controller
);

/**
 * @route   GET /api/v1/orders
 * @desc    Mendapatkan riwayat pesanan pengguna yang sedang login
 * @access  Private
 */
orderRouter.get('/', OrderController.getMyOrders);

/**
 * @route   GET /api/v1/orders/:id
 * @desc    Mendapatkan detail satu pesanan
 * @access  Private
 */
orderRouter.get('/:id', OrderController.getOrderById);

export default orderRouter;
