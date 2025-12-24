import { body } from 'express-validator';

/**
 * Aturan validasi untuk membuat opsi pengiriman baru.
 */
export const createShippingValidator = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be a string')
    .trim(),

  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isString()
    .withMessage('Description must be a string')
    .trim(),

  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ gt: 0 })
    .withMessage('Price must be a positive number'),

  body('estimatedDays')
    .notEmpty()
    .withMessage('Estimated days are required')
    .isInt({ gt: 0 })
    .withMessage('Estimated days must be a positive integer'),
];

/**
 * Aturan validasi untuk memperbarui opsi pengiriman.
 * Semua field bersifat opsional.
 */
export const updateShippingValidator = [
    body('name')
        .optional()
        .isString()
        .withMessage('Name must be a string')
        .trim(),

    body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string')
        .trim(),

    body('price')
        .optional()
        .isFloat({ gt: 0 })
        .withMessage('Price must be a positive number'),
    
    body('estimatedDays')
        .optional()
        .isInt({ gt: 0 })
        .withMessage('Estimated days must be a positive integer'),
    
    body('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean value'),
];