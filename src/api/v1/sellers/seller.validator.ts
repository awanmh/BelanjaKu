import { body } from 'express-validator';

/**
 * Aturan validasi untuk membuat atau memperbarui profil penjual.
 */
export const upsertProfileValidator = [
  body('storeName')
    .notEmpty()
    .withMessage('Store name is required')
    .isString()
    .withMessage('Store name must be a string')
    .trim(),

  body('storeAddress')
    .optional()
    .isString()
    .withMessage('Store address must be a string')
    .trim(),

  body('storePhoneNumber')
    .optional()
    .isString()
    .withMessage('Store phone number must be a string')
    .trim()
    .isMobilePhone('id-ID')
    .withMessage('Please provide a valid Indonesian phone number'),
];
