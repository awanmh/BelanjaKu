import Joi from 'joi';

export const addressSchema = Joi.object({
  recipientName: Joi.string().required().min(3).max(50),
  phoneNumber: Joi.string().required().pattern(/^[0-9+\-]{9,15}$/).messages({
    'string.pattern.base': 'Phone number must be valid (digits, +, -)'
  }),
  addressLine: Joi.string().required().min(5),
  city: Joi.string().required(),
  province: Joi.string().required(),
  postalCode: Joi.string().required().min(4).max(10),
  isPrimary: Joi.boolean().optional(),
});

export const updateAddressSchema = addressSchema.fork(
  ['recipientName', 'phoneNumber', 'addressLine', 'city', 'province', 'postalCode'],
  (schema) => schema.optional() // Semua field jadi optional saat update
<<<<<<< HEAD
);
=======
);
>>>>>>> frontend-role
