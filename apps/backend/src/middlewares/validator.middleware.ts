import { Request, Response, NextFunction } from 'express';
import { validationResult, FieldValidationError } from 'express-validator';
import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import HttpException from '../utils/http-exception.util';

/**
 * ==========================================
 * 1. VALIDATOR UNTUK EXPRESS-VALIDATOR (LEGACY)
 * Digunakan oleh Auth, Products, dll.
 * ==========================================
 */
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // FIX: Filter array untuk hanya memproses error yang memiliki field 'path' (FieldValidationError)
    const extractedErrors = errors
      .array()
      .filter((err): err is FieldValidationError => err.type === 'field')
      .map((err: FieldValidationError) => ({ [err.path]: err.msg }));
    
    // Jika tidak ada error yang relevan setelah filter (kasus jarang terjadi), kirim respons umum
    if (extractedErrors.length === 0) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        errors: [{ general: 'Invalid input' }]
      });
    }

    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      errors: extractedErrors
    });
  }
  next();
};

/**
 * ==========================================
 * 2. VALIDATOR UNTUK JOI (NEW FEATURE)
 * Digunakan oleh Cart, Shipping, Payment, dll.
 * ==========================================
 */
export const validateJoi = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Validasi req.body dengan opsi abortEarly: false agar menampilkan semua error
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      // Ambil pesan error dan gabungkan
      const errorMessage = error.details
        .map((details) => details.message.replace(/"/g, ''))
        .join(', ');
        
      // Lempar ke Error Handler
      return next(new HttpException(StatusCodes.BAD_REQUEST, errorMessage));
    }

    next();
  };
};