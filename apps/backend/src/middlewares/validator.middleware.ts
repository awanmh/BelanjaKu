import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError, FieldValidationError } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

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

