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
      where: { userId },
      include: [
        {
          model: Product,
          as: "product",
          include: [
            {
              model: ProductImage,
              as: "images",
              where: { isPrimary: true },
              required: false,
              limit: 1,
            },
          ],
        },
      ],
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
  }
}

export default new WishlistService();
