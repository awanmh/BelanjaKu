import { body } from 'express-validator';

/**
 * Aturan validasi untuk membuat promosi baru.
 */
export const createPromotionValidator = [
  body('productId')
    .notEmpty().withMessage('Product ID is required')
    .isUUID().withMessage('Product ID must be a valid UUID'),

  body('code')
    .optional({ nullable: true })
    .isString().withMessage('Code must be a string')
    .trim(),

  body('discountPercentage')
    .notEmpty().withMessage('Discount percentage is required')
    .isFloat({ min: 0.01, max: 100.00 }).withMessage('Discount must be between 0.01 and 100'),

  body('startDate')
    .notEmpty().withMessage('Start date is required')
    .isISO8601().toDate().withMessage('Start date must be a valid date'),

  body('endDate')
    .notEmpty().withMessage('End date is required')
    .isISO8601().toDate().withMessage('End date must be a valid date')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after the start date');
      }
      return true;
    }),
];

/**
 * Aturan validasi untuk memperbarui promosi.
 * Semua field bersifat opsional.
 */
export const updatePromotionValidator = [
    body('productId').optional().isUUID().withMessage('Product ID must be a valid UUID'),
    body('code').optional({ nullable: true }).isString().trim(),
    body('discountPercentage').optional().isFloat({ min: 0.01, max: 100.00 }).withMessage('Discount must be between 0.01 and 100'),
    body('startDate').optional().isISO8601().toDate(),
    body('endDate').optional().isISO8601().toDate(),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean value'),
];
