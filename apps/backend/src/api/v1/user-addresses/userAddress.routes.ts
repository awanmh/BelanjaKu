import { Router } from 'express';
import UserAddressController from './userAddress.controller';
import { protect } from '../../../middlewares/auth.middleware';
import { validateJoi } from '../../../middlewares/validator.middleware';
import { addressSchema, updateAddressSchema } from './userAddress.validator';

const router = Router();

router.use(protect);

router.get('/', UserAddressController.getAll);
router.get('/:id', UserAddressController.getOne);

router.post(
  '/', 
  validateJoi(addressSchema), 
  UserAddressController.create
);

router.patch(
  '/:id', 
  validateJoi(updateAddressSchema), 
  UserAddressController.update
);

router.delete('/:id', UserAddressController.delete);

export default router;