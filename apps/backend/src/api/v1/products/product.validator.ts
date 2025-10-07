import { body } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import HttpException from '../../../utils/http-exception.util';

// Aturan validasi untuk membuat produk baru
export const createProductValidator = [
  body('name')
    .notEmpty().withMessage('Product name is required.')
    .isString().withMessage('Product name must be a string.'),
  
  body('description')
    .notEmpty().withMessage('Description is required.')
    .isString().withMessage('Description must be a string.'),

  body('price')
    .notEmpty().withMessage('Price is required.')
    .isFloat({ gt: 0 }).withMessage('Price must be a positive number.'),

  body('stock')
    .notEmpty().withMessage('Stock is required.')
    .isInt({ gt: -1 }).withMessage('Stock must be a non-negative integer.'),

  body('imageUrl')
    .notEmpty().withMessage('Image URL is required.')
    .isURL().withMessage('Image URL must be a valid URL.'),
  
  body('categoryId')
    .notEmpty().withMessage('Category ID is required.')
    .isUUID().withMessage('Category ID must be a valid UUID.'),
];


// Aturan validasi untuk memperbarui produk (semua opsional)
export const updateProductValidator = [
  body('name')
    .optional()
    .isString().withMessage('Product name must be a string.'),
  
  body('description')
    .optional()
    .isString().withMessage('Description must be a string.'),

  body('price')
    .optional()
    .isFloat({ gt: 0 }).withMessage('Price must be a positive number.'),

  body('stock')
    .optional()
    .isInt({ gt: -1 }).withMessage('Stock must be a non-negative integer.'),

  body('imageUrl')
    .optional()
    .isURL().withMessage('Image URL must be a valid URL.'),
  
  body('categoryId')
    .optional()
    .isUUID().withMessage('Category ID must be a valid UUID.'),
];
