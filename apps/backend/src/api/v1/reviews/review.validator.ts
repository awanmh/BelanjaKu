import { body } from 'express-validator';

/**
 * Aturan validasi untuk membuat ulasan baru.
 */
export const createReviewValidator = [
  body('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .isUUID()
    .withMessage('Product ID must be a valid UUID'),

  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),

  body('comment')
    .notEmpty()
    .withMessage('Comment is required')
    .isString()
    .withMessage('Comment must be a string')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Comment must be at least 10 characters long'),
];
