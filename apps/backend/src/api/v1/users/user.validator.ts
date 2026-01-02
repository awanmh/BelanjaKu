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

/**
 * [BARU] Aturan validasi untuk memperbarui profil oleh pengguna itu sendiri.
 */
export const updateProfileValidator = [
  body('fullName')
    .optional()
    .isString()
    .withMessage('Full name must be a string')
    .trim()
    .notEmpty()
    .withMessage('Full name cannot be empty'),

  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
];

/**
 * [BARU] Aturan validasi untuk mengubah password.
 */
export const changePasswordValidator = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),

  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long'),
];
