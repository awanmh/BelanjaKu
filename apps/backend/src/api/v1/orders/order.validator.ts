import { body } from 'express-validator';

/**
 * Aturan validasi untuk membuat pesanan baru (checkout).
 */
export const createOrderValidator = [
  body('shippingAddress')
    .notEmpty()
    .withMessage('Shipping address is required')
    .isString()
    .withMessage('Shipping address must be a string')
    .trim(),

  body('items')
    .isArray({ min: 1 })
    .withMessage('Cart items must be an array and cannot be empty'),

  // Validasi setiap objek di dalam array 'items'
  body('items.*.productId')
    .notEmpty()
    .withMessage('Product ID is required for each item')
    .isUUID()
    .withMessage('Product ID must be a valid UUID'),

  body('items.*.quantity')
    .notEmpty()
    .withMessage('Quantity is required for each item')
    .isInt({ gt: 0 })
    .withMessage('Quantity must be a positive integer'),

  // Tambahkan validasi untuk promotionCode yang opsional
  body('promotionCode')
    .optional()
    .isString()
    .withMessage('Promotion code must be a string')
    .trim(),
];
