import { StatusCodes } from 'http-status-codes';
import { ParsedQs } from 'qs';
import { Op } from 'sequelize';
import db from '../database/models'; // Sesuaikan path jika berbeda
import { UserAttributes } from '../database/models/user.model';
import HttpException from '../utils/http-exception.util';
import APIFeatures from '../utils/apiFeatures.util';

// Inisialisasi Model User
const User = db.User as (new () => InstanceType<typeof db.User>) & typeof db.User;

// Tipe untuk input update
export type UpdateUserInput = Partial<Pick<UserAttributes, 'fullName' | 'role' | 'isVerified'>>;

// Interface untuk hasil paginasi
export interface PaginatedUserResult {
  rows: Omit<UserAttributes, 'password'>[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

class UserService {
  /**
   * Mengambil daftar semua pengguna aktif (belum dihapus).
   */
  public async getAllUsers(queryString: ParsedQs): Promise<PaginatedUserResult> {
    const features = new APIFeatures(queryString)
      .filter()
      .sort()
      .limitFields();

    const { limit, offset } = features.paginate();
    const page = Math.floor(offset / limit) + 1;

    // Default behavior Sequelize: paranoid=true (hanya ambil yang deletedAt = null)
    const { rows, count } = await User.findAndCountAll({
      ...features.queryOptions,
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    return {
      rows: rows.map((user: any) => user.toJSON()),
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: page,
        limit,
      },
    };
  }

  /**
   * Mengambil detail satu pengguna berdasarkan ID.
   */
  public async getUserById(userId: string): Promise<Omit<UserAttributes, 'password'>> {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'User not found');
    }
    return user.toJSON();
  }

  /**
   * Memperbarui data pengguna.
   */
  public async updateUser(userId: string, userData: UpdateUserInput): Promise<Omit<UserAttributes, 'password'>> {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'User not found');
    }

    await user.update(userData);
    
    // Refresh data untuk memastikan return value terbaru
    const updatedUser = await user.reload();
    return updatedUser.toJSON();
  }

  /**
   * Soft delete pengguna (mengisi kolom deletedAt).
   */
  public async deleteUser(userId: string): Promise<void> {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'User not found');
    }
    await user.destroy();
  }

  /**
   * Mengambil daftar pengguna yang diarsipkan (Soft Deleted).
   */
  public async getArchivedUsers(queryString: ParsedQs): Promise<PaginatedUserResult> {
    const features = new APIFeatures(queryString)
      .filter()
      .sort()
      .limitFields();

    const { limit, offset } = features.paginate();
    const page = Math.floor(offset / limit) + 1;

    // Filter khusus: deletedAt TIDAK null
    const whereClause = {
      ...features.queryOptions.where,
      deletedAt: { [Op.ne]: null },
    };

    const { rows, count } = await User.findAndCountAll({
      ...features.queryOptions,
      where: whereClause,
      limit,
      offset,
      paranoid: false, // Penting: izinkan membaca baris yang sudah dihapus
    });

    const totalPages = Math.ceil(count / limit);

    return {
      rows: rows.map((user: any) => user.toJSON()),
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: page,
        limit,
      },
    };
  }

  /**
   * Memulihkan pengguna yang sudah dihapus (Restore).
   */
  public async restoreUser(userId: string): Promise<Omit<UserAttributes, 'password'>> {
    // Cari user termasuk yang sudah dihapus
    const user = await User.findByPk(userId, { paranoid: false });

    if (!user) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Archived user not found');
    }

    if (user.deletedAt === null) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'User is currently active (not archived)');
    }

    await user.restore();
    return user.toJSON();
  }
}

export default new UserService();