// backend/src/api/v1/cart/cart.validator.ts
import { check, param } from 'express-validator';

export const addToCartValidator = [
    check('productId')
        .notEmpty().withMessage('Product ID is required')
        .isUUID().withMessage('Invalid Product ID format'),
    check('quantity')
        .notEmpty().withMessage('Quantity is required')
        .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];

export const updateCartValidator = [
    param('id')
        .isUUID().withMessage('Invalid Cart Item ID'),
    check('quantity')
        .notEmpty().withMessage('Quantity is required')
        .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];