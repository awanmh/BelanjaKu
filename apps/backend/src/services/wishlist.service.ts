<<<<<<< HEAD
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
=======
import { StatusCodes } from "http-status-codes";
import db from "../database/models";
import ApiError from "../utils/api-error.util";

const Wishlist = db.Wishlist;
const Product = db.Product;
const ProductImage = db.ProductImage;

class WishlistService {
  /**
   * Add a product to the user's wishlist
   */
  public async addToWishlist(userId: string, productId: string) {
    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");
    }

    // Check if already in wishlist
    const existingInterest = await Wishlist.findOne({
      where: { userId, productId },
    });

    if (existingInterest) {
      return existingInterest.toJSON();
    }

    const newWishlist = await Wishlist.create({ userId, productId });
    return newWishlist.toJSON();
  }

  /**
   * Get all wishlist items for a user
   */
  public async getWishlist(userId: string) {
    const wishlist = await Wishlist.findAll({
>>>>>>> frontend-role
      where: { userId },
      include: [
        {
          model: Product,
<<<<<<< HEAD
          as: 'product',
          include: [
            {
              model: User,
              as: 'seller',
              attributes: ['id', 'fullName'],
=======
          as: "product",
          include: [
            {
              model: ProductImage,
              as: "images",
              where: { isPrimary: true },
              required: false,
              limit: 1,
>>>>>>> frontend-role
            },
          ],
        },
      ],
<<<<<<< HEAD
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
=======
      order: [["createdAt", "DESC"]],
    });
    return wishlist;
  }

  /**
   * Remove a product from wishlist
   */
  public async removeFromWishlist(userId: string, productId: string) {
    const deletedCount = await Wishlist.destroy({
      where: { userId, productId },
    });

    if (deletedCount === 0) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Product not found in wishlist"
      );
    }
    return true;
>>>>>>> frontend-role
  }
}

export default new WishlistService();
