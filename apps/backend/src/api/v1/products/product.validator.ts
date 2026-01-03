import { body } from 'express-validator';

/**
 * Aturan validasi untuk membuat produk baru.
 */
export const createProductValidator = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string')
    .trim(),
  
  body('description')
    .notEmpty().withMessage('Description is required')
    .isString().withMessage('Description must be a string')
    .trim(),

  body('price')
    .notEmpty().withMessage('Price is required')
    .toFloat() // FIX: Konversi ke angka sebelum validasi
    .isFloat({ gt: 0 }).withMessage('Price must be a positive number'),

  body('stock')
    .notEmpty().withMessage('Stock is required')
    .toInt() // FIX: Konversi ke angka sebelum validasi
    .isInt({ gt: 0 }).withMessage('Stock must be a positive integer'),

  body('categoryId')
    .notEmpty().withMessage('Category ID is required')
    .isUUID().withMessage('Category ID must be a valid UUID'),
];

/**
 * Aturan validasi untuk memperbarui produk.
 * Semua field bersifat opsional.
 */
export const updateProductValidator = [
    body('name')
        .optional()
        .isString().withMessage('Name must be a string')
        .trim(),
    
    body('description')
        .optional()
        .isString().withMessage('Description must be a string')
        .trim(),
        
    body('price')
        .optional()
        .toFloat() // FIX: Konversi ke angka sebelum validasi
        .isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    
    body('stock')
        .optional()
        .toInt() // FIX: Konversi ke angka sebelum validasi
        .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'), // Boleh 0 saat update
    
    body('categoryId')
        .optional()
        .isUUID().withMessage('Category ID must be a valid UUID'),
];
