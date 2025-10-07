import { body } from 'express-validator';

/**
 * Aturan validasi untuk membuat pesanan baru.
 */
export const createOrderValidator = [
  // Validasi alamat pengiriman
  body('shippingAddress')
    .notEmpty()
    .withMessage('Shipping address is required')
    .isString()
    .withMessage('Shipping address must be a string'),

  // Validasi array items
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),

  // Validasi setiap objek di dalam array items
  body('items.*.productId')
    .notEmpty()
    .withMessage('Product ID is required for each item')
    .isUUID()
    .withMessage('Product ID must be a valid UUID'),

  body('items.*.quantity')
    .notEmpty()
    .withMessage('Quantity is required for each item')
    .isInt({ min: 1 })
    .withMessage('Quantity must be an integer greater than 0'),
];
