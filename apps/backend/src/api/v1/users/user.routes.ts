import { Router } from 'express';
import UserController from './user.controller';
import { updateUserValidator, updateProfileValidator, changePasswordValidator } from './user.validator';
import { validate } from '../../../middlewares/validator.middleware';
import { protect, authorize } from '../../../middlewares/auth.middleware';

const userRouter = Router();

// 🔐 Semua rute di bawah ini memerlukan autentikasi.
userRouter.use(protect);

/**
 * @route   PUT /api/v1/users/profile
 * @desc    Memperbarui profil pengguna (untuk user itu sendiri)
 * @access  Private (Semua Role)
 */
userRouter.put(
  '/profile',
  updateProfileValidator,
  validate,
  UserController.updateProfile
);

/**
 * @route   PUT /api/v1/users/change-password
 * @desc    Mengubah password pengguna
 * @access  Private (Semua Role)
 */
userRouter.put(
  '/change-password',
  changePasswordValidator,
  validate,
  UserController.changePassword
);

// 🔐 Rute di bawah ini memerlukan peran 'admin'.
userRouter.use(authorize('admin'));

/**
 * @route   GET /api/v1/users
 * @desc    Mendapatkan daftar semua pengguna aktif
 * @access  Private (Hanya Admin)
 */
userRouter.get('/', UserController.getAllUsers);

/**
 * @route   GET /api/v1/users/archived
 * @desc    [BARU] Mendapatkan daftar semua pengguna yang diarsipkan
 * @access  Private (Hanya Admin)
 */
userRouter.get('/archived', UserController.getArchivedUsers);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Mendapatkan detail satu pengguna
 * @access  Private (Hanya Admin)
 */
userRouter.get('/:id', UserController.getUserById);

/**
 * @route   POST /api/v1/users/:id/restore
 * @desc    [BARU] Memulihkan pengguna yang diarsipkan
 * @access  Private (Hanya Admin)
 */
userRouter.post('/:id/restore', UserController.restoreUser);

/**
 * @route   PUT /api/v1/users/:id
 * @desc    Memperbarui data pengguna
 * @access  Private (Hanya Admin)
 */
userRouter.put(
  '/:id',
  updateUserValidator, // 1. Jalankan aturan validasi
  validate,            // 2. Tangani hasil validasi
  UserController.updateUser // 3. Jika valid, teruskan ke controller
);

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Menghapus (soft delete) pengguna
 * @access  Private (Hanya Admin)
 */
userRouter.delete('/:id', UserController.deleteUser);

export default userRouter;
