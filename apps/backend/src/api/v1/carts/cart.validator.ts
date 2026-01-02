import Joi from 'joi';

export const addToCartSchema = Joi.object({
  productId: Joi.string().uuid().required().messages({
    'string.base': 'Product ID must be a string',
    'string.uuid': 'Product ID must be a valid UUID',
    'any.required': 'Product ID is required',
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    'number.base': 'Quantity must be a number',
    'number.min': 'Quantity must be at least 1',
    'any.required': 'Quantity is required',
  }),
});

export const updateCartItemSchema = Joi.object({
  quantity: Joi.number().integer().min(0).required().messages({
    'number.base': 'Quantity must be a number',
    'number.min': 'Quantity cannot be negative',
    'any.required': 'Quantity is required',
  }),
});