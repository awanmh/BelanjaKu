import { Router } from 'express';
import PaymentController from './payment.controller';
import { protect } from '../../../middlewares/auth.middleware';
import { initiatePaymentValidator } from './payment.validator';
import { validate } from '../../../middlewares/validator.middleware';

const paymentRouter = Router();

/**
 * @route   POST /api/v1/payments
 * @desc    Memulai proses pembayaran untuk sebuah pesanan
 * @access  Private
 */
paymentRouter.post(
  '/',
  protect,
  initiatePaymentValidator, // Terapkan aturan validasi di sini
  validate,                 // Jalankan middleware untuk menangani hasil validasi
  PaymentController.initiatePayment
);

/**
 * @route   POST /api/v1/payments/webhook
 * @desc    Menerima notifikasi status pembayaran dari payment gateway
 * @access  Public (tapi harus diamankan dengan signature validation)
 */
paymentRouter.post('/webhook', PaymentController.handleWebhook);

export default paymentRouter;

