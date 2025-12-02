import { body } from 'express-validator';

/**
 * Aturan validasi untuk memperbarui data pengguna oleh admin.
 * Semua field bersifat opsional karena ini adalah operasi PATCH/PUT.
 */
export const updateUserValidator = [
  body('fullName')
    .optional()
    .isString()
    .withMessage('Full name must be a string')
    .trim()
    .notEmpty()
    .withMessage('Full name cannot be empty'),

  body('role')
    .optional()
    .isIn(['user', 'seller', 'admin'])
    .withMessage('Invalid role specified. Must be one of: user, seller, admin'),

  body('isVerified')
    .optional()
    .isBoolean()
    .withMessage('isVerified must be a boolean value (true or false)'),
];
