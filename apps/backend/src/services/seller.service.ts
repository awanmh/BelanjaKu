import { StatusCodes } from 'http-status-codes';
import db from '../database/models';
import { SellerAttributes } from '../database/models/seller.model';
import HttpException from '../utils/http-exception.util';

const Seller = db.Seller;

// Tipe data untuk input pembuatan/pembaruan profil seller
export type UpsertSellerProfileInput = Pick<SellerAttributes, 'storeName' | 'storeAddress' | 'storePhoneNumber'>;

/**
 * Service untuk menangani logika bisnis terkait profil penjual.
 */
class SellerService {
  /**
   * Mengambil profil penjual berdasarkan ID pengguna.
   * @param userId ID pengguna yang profilnya akan dicari.
   * @returns Profil penjual.
   */
  public async getSellerProfile(userId: string): Promise<SellerAttributes> {
    const sellerProfile = await Seller.findOne({ where: { userId } });
    if (!sellerProfile) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Seller profile not found. Please create one.');
    }
    return sellerProfile.toJSON();
  }

  /**
   * Membuat atau memperbarui profil penjual (upsert).
   * @param userId ID pengguna yang profilnya akan diperbarui/dibuat.
   * @param profileData Data baru untuk profil.
   * @returns Profil penjual yang telah diperbarui/dibuat.
   */
  public async upsertSellerProfile(userId: string, profileData: UpsertSellerProfileInput): Promise<SellerAttributes> {
    // Cari profil yang sudah ada
    let sellerProfile = await Seller.findOne({ where: { userId } });

    if (sellerProfile) {
      // Jika ada, perbarui
      await sellerProfile.update(profileData);
    } else {
      // Jika tidak ada, buat baru
      sellerProfile = await Seller.create({
        userId,
        ...profileData,
      });
    }

    return sellerProfile.toJSON();
  }
}

export default new SellerService();