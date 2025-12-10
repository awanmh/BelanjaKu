import { StatusCodes } from 'http-status-codes';
import db from '../database/models';
import { WishlistAttributes } from '../database/models/wishlist.model';
import HttpException from '../utils/http-exception.util';

const Wishlist = db.Wishlist;
const Product = db.Product;
const User = db.User;

/**
 * Service untuk menangani semua logika bisnis wishlist
 */
class WishlistService {
  /**
   * Tambah produk ke wishlist
   */
  public async addToWishlist(userId: string, productId: string): Promise<WishlistAttributes> {
    // Validasi produk exists
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Product not found');
    }

    // Cek apakah sudah ada di wishlist
    const existing = await Wishlist.findOne({
      where: { userId, productId },
    });

    if (existing) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Product already in wishlist');
    }

    // Tambahkan ke wishlist
    const wishlistItem = await Wishlist.create({
      userId,
      productId,
    });

    return wishlistItem.toJSON();
  }

  /**
   * Get semua wishlist items user
   */
  public async getWishlist(userId: string): Promise<any[]> {
    const wishlistItems = await Wishlist.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: 'product',
          include: [
            {
              model: User,
              as: 'seller',
              attributes: ['id', 'fullName'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return wishlistItems.map((item) => item.toJSON());
  }

  /**
   * Hapus produk dari wishlist
   */
  public async removeFromWishlist(wishlistId: string, userId: string): Promise<void> {
    const wishlistItem = await Wishlist.findOne({
      where: { id: wishlistId, userId },
    });

    if (!wishlistItem) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Wishlist item not found');
    }

    await wishlistItem.destroy();
  }

  /**
   * Clear semua wishlist
   */
  public async clearWishlist(userId: string): Promise<void> {
    await Wishlist.destroy({
      where: { userId },
    });
  }
}

export default new WishlistService();
