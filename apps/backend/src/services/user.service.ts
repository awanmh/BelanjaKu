import { StatusCodes } from 'http-status-codes';
import db from '../database/models';
import { UserAttributes } from '../database/models/user.model';
import HttpException from '../utils/http-exception.util';
import APIFeatures from '../utils/apiFeatures.util';
import { ParsedQs } from 'qs';
import { Op } from 'sequelize';

// Mengambil model User dari objek db yang sudah diinisialisasi
const User = db.User as (new () => InstanceType<typeof db.User>) & typeof db.User;

// Tipe data untuk input pembaruan data pengguna oleh admin
export type UpdateUserInput = Partial<Pick<UserAttributes, 'fullName' | 'role' | 'isVerified'>>;

// Tipe data baru untuk respons paginasi
export interface PaginatedUserResult {
  rows: Omit<UserAttributes, 'password'>[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

/**
 * Service untuk menangani semua logika bisnis yang terkait dengan manajemen pengguna oleh admin.
 */
class UserService {
  /**
   * Mengambil daftar semua pengguna dengan fitur query (filter, sort, pagination).
   */
  public async getAllUsers(queryString: ParsedQs): Promise<PaginatedUserResult> {
    // 1. Buat query dasar
    const features = new APIFeatures(User, queryString)
      .filter()
      .sort()
      .limitFields(); // Hentikan chain sebelum .paginate()

    // 2. Dapatkan nilai limit dan offset secara terpisah
    const { limit, offset } = features.paginate();
    const page = Math.floor(offset / limit) + 1;

    // 3. Gunakan findAndCountAll untuk mendapatkan data DAN total hitungan
    const { rows, count } = await User.findAndCountAll({
      ...features.queryOptions, // Terapkan filter, sort, attributes
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    // 4. Kembalikan data dengan format paginasi baru
    return {
      rows: rows.map((user) => user.toJSON()),
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: page,
        limit,
      },
    };
  }

  /**
   * Mengambil satu pengguna berdasarkan ID (tanpa password).
   */
  public async getUserById(userId: string): Promise<Omit<UserAttributes, 'password'>> {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'User not found');
    }
    return user.toJSON();
  }

  /**
   * Memperbarui data pengguna berdasarkan ID.
   */
  public async updateUser(userId: string, userData: UpdateUserInput): Promise<Omit<UserAttributes, 'password'>> {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'User not found');
    }
    await user.update(userData);
    const updatedUser = await this.getUserById(userId);
    return updatedUser;
  }

  /**
   * Menghapus (soft delete) pengguna berdasarkan ID.
   */
  public async deleteUser(userId: string): Promise<void> {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'User not found');
    }
    await user.destroy();
  }

  /**
   * [DIPERBARUI] Mengambil daftar semua pengguna yang diarsipkan.
   */
  public async getArchivedUsers(queryString: ParsedQs): Promise<PaginatedUserResult> {
    const features = new APIFeatures(User, queryString)
      .filter()
      .sort()
      .limitFields();
    
    const { limit, offset } = features.paginate();
    const page = Math.floor(offset / limit) + 1;

    const whereClause = {
      ...features.queryOptions.where,
      deletedAt: { [Op.ne]: null },
    };

    // Gunakan findAndCountAll di sini juga
    const { rows, count } = await User.findAndCountAll({
      ...features.queryOptions,
      where: whereClause,
      limit,
      offset,
      paranoid: false,
    });

    const totalPages = Math.ceil(count / limit);

    return {
      rows: rows.map((user) => user.toJSON()),
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: page,
        limit,
      },
    };
  }

  /**
   * [DIPERBARUI] Memulihkan pengguna yang diarsipkan.
   */
  public async restoreUser(userId: string): Promise<Omit<UserAttributes, 'password'>> {
    const user = await User.findByPk(userId, { paranoid: false });
    if (!user) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Archived user not found');
    }
    if (user.deletedAt === null) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'User is not archived');
    }
    await user.restore();
    return user.toJSON();
  }
}

// Ekspor sebagai singleton instance
export default new UserService();