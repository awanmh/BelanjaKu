import { body } from 'express-validator';

/**
 * Aturan validasi untuk membuat atau memperbarui kategori.
 * - 'name' harus ada, tidak boleh kosong, dan merupakan string.
 */
export const categoryValidator = [
  body('name')
    .notEmpty()
    .withMessage('Category name is required')
    .isString()
    .withMessage('Category name must be a string')
    .trim()
    .escape(),
];
