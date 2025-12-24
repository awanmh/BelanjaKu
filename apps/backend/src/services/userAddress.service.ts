import { StatusCodes } from 'http-status-codes';
import db from '../database/models';
import HttpException from '../utils/http-exception.util';

const UserAddress = db.UserAddress;

export interface CreateAddressInput {
  recipientName: string;
  phoneNumber: string;
  addressLine: string;
  city: string;
  province: string;
  postalCode: string;
  isPrimary?: boolean;
}

class UserAddressService {
  /**
   * Membuat alamat baru.
   * Logic: Jika ini alamat pertama, otomatis jadi Primary.
   * Jika user set isPrimary=true, alamat lain di-unset.
   */
  public async createAddress(userId: string, data: CreateAddressInput) {
    // 1. Cek apakah user sudah punya alamat
    const count = await UserAddress.count({ where: { userId } });

    // Jika belum punya alamat, paksa jadi Primary
    if (count === 0) {
      data.isPrimary = true;
    }

    // 2. Jika isPrimary = true, ubah alamat lain jadi false
    if (data.isPrimary) {
      await UserAddress.update(
        { isPrimary: false },
        { where: { userId, isPrimary: true } }
      );
    }

    // 3. Buat alamat baru
    const address = await UserAddress.create({ ...data, userId });
    return address.toJSON();
  }

  /**
   * Mengambil semua alamat user.
   * Diurutkan: Primary paling atas, sisanya berdasarkan tanggal dibuat.
   */
  public async getUserAddresses(userId: string) {
    const addresses = await UserAddress.findAll({
      where: { userId },
      order: [
        ['isPrimary', 'DESC'], // true (1) akan di atas false (0)
        ['createdAt', 'DESC'],
      ],
    });
    return addresses;
  }

  /**
   * Mengambil satu alamat spesifik.
   */
  public async getAddressById(userId: string, addressId: string) {
    const address = await UserAddress.findOne({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Address not found');
    }

    return address;
  }

  /**
   * Update alamat.
   */
  public async updateAddress(userId: string, addressId: string, data: Partial<CreateAddressInput>) {
    const address = await this.getAddressById(userId, addressId);

    // Jika user ingin menjadikan alamat ini Primary
    if (data.isPrimary && !address.isPrimary) {
      await UserAddress.update(
        { isPrimary: false },
        { where: { userId, isPrimary: true } }
      );
    }

    await address.update(data);
    return address.toJSON();
  }

  /**
   * Hapus alamat.
   * Logic: User tidak boleh menghapus Primary Address jika masih punya alamat lain
   * (Kecuali dia hapus satu-satunya alamat, itu boleh).
   */
  public async deleteAddress(userId: string, addressId: string) {
    const address = await this.getAddressById(userId, addressId);

    // Cek jumlah alamat total
    const count = await UserAddress.count({ where: { userId } });

    // Jika ini Primary dan user punya alamat lain, tolak penghapusan
    // User harus set Primary ke alamat lain dulu baru boleh hapus ini.
    if (address.isPrimary && count > 1) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST, 
        'Cannot delete primary address. Please set another address as primary first.'
      );
    }

    await address.destroy();
  }
}

export default new UserAddressService();