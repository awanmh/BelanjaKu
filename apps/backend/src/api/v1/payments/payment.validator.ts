import { body } from 'express-validator';
import { PaymentMethod } from '../../../database/models/payment.model';

const allowedMethods: PaymentMethod[] = ['cod', 'credit_card', 'e_wallet', 'qris', 'bank_transfer'];

/**
 * Aturan validasi untuk memulai proses pembayaran.
 */
export const initiatePaymentValidator = [
  body('orderId')
    .notEmpty()
    .withMessage('Order ID is required')
    .isUUID()
    .withMessage('Order ID must be a valid UUID'),

  body('method')
    .notEmpty()
    .withMessage('Payment method is required')
    .isIn(allowedMethods)
    .withMessage(`Invalid payment method. Must be one of: ${allowedMethods.join(', ')}`),
];
