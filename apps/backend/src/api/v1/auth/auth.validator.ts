import { body } from 'express-validator';

/**
 * Rangkaian aturan validasi untuk endpoint registrasi pengguna.
 */
export const registerValidator = [
  body('fullName')
    .notEmpty()
    .withMessage('Full name is required')
    .isString()
    .withMessage('Full name must be a string')
    .trim(),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

/**
 * Rangkaian aturan validasi untuk endpoint login pengguna.
 */
export const loginValidator = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password').notEmpty().withMessage('Password is required'),
];
