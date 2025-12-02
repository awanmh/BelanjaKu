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
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\S]{8,}$/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
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
