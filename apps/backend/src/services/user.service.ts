import { StatusCodes } from 'http-status-codes';
import db from '../database/models';
import { UserAttributes } from '../database/models/user.model';
import HttpException from '../utils/http-exception.util';

// Mengambil model User dari objek db yang sudah diinisialisasi
const User = db.User;

// Tipe data untuk input pembaruan data pengguna oleh admin
// Kita buat Partial karena admin mungkin hanya ingin mengubah beberapa data saja
export type UpdateUserInput = Partial<Pick<UserAttributes, 'fullName' | 'role' | 'isVerified'>>;

/**
 * Service untuk menangani semua logika bisnis yang terkait dengan manajemen pengguna oleh admin.
 */
class UserService {
  /**
   * Mengambil daftar semua pengguna dari database (tanpa password).
   * @returns Array berisi semua pengguna.
   */
  public async getAllUsers(): Promise<Omit<UserAttributes, 'password'>[]> {
    const users = await User.findAll({
      // Secara eksplisit memilih atribut untuk dikecualikan (password)
      attributes: { exclude: ['password'] },
    });
    return users.map((user) => user.toJSON());
  }

  /**
   * Mengambil satu pengguna berdasarkan ID (tanpa password).
   * @param userId ID pengguna yang akan dicari.
   * @returns Objek pengguna.
   */
  public async getUserById(userId: string): Promise<Omit<UserAttributes, 'password'>> {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'User not found');
    }

    return user.toJSON();
  }

  /**
   * Memperbarui data pengguna berdasarkan ID.
   * @param userId ID pengguna yang akan diperbarui.
   * @param userData Data baru untuk pengguna.
   * @returns Pengguna yang sudah diperbarui.
   */
  public async updateUser(userId: string, userData: UpdateUserInput): Promise<Omit<UserAttributes, 'password'>> {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'User not found');
    }

    await user.update(userData);

    // Ambil kembali data terbaru untuk memastikan password tidak ikut terkirim
    const updatedUser = await this.getUserById(userId);
    return updatedUser;
  }

  /**
   * Menghapus pengguna berdasarkan ID.
   * @param userId ID pengguna yang akan dihapus.
   */
  public async deleteUser(userId: string): Promise<void> {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'User not found');
    }

    await user.destroy();
  }
}

// Ekspor sebagai singleton instance
export default new UserService();
