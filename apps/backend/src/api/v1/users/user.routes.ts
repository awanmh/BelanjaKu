import { Router } from 'express';
import UserController from './user.controller';
import { updateUserValidator } from './user.validator'; // Pastikan file validator ini ada
import { validate } from '../../../middlewares/validator.middleware';
import { protect, authorize } from '../../../middlewares/auth.middleware';

const userRouter = Router();

// ==============================================================================
// GLOBAL MIDDLEWARE
// Semua rute di bawah ini memerlukan Login (protect) dan Role Admin (authorize)
// ==============================================================================
userRouter.use(protect);
userRouter.use(authorize('admin'));

/**
 * @route   GET /api/v1/users
 * @desc    Mendapatkan daftar semua pengguna aktif
 */
userRouter.get('/', UserController.getAllUsers);

/**
 * @route   GET /api/v1/users/archived
 * @desc    Mendapatkan daftar pengguna yang dihapus (soft delete)
 * @note    Harus diletakkan SEBELUM route /:id agar "archived" tidak dianggap sebagai ID
 */
userRouter.get('/archived', UserController.getArchivedUsers);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Mendapatkan detail satu pengguna
 */
userRouter.get('/:id', UserController.getUserById);

/**
 * @route   POST /api/v1/users/:id/restore
 * @desc    Mengembalikan pengguna yang sudah dihapus
 */
userRouter.post('/:id/restore', UserController.restoreUser);

/**
 * @route   PUT /api/v1/users/:id
 * @desc    Memperbarui data pengguna
 */
userRouter.put(
  '/:id',
  updateUserValidator, // Validasi input body
  validate,            // Cek error validasi
  UserController.updateUser
);

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Menghapus pengguna (Soft Delete)
 */
userRouter.delete('/:id', UserController.deleteUser);

export default userRouter;