import { StatusCodes } from "http-status-codes";
import db from "../database/models";
import HttpException from "../utils/http-exception.util";

const Cart = db.Cart;
const Product = db.Product;
const User = db.User;

class CartService {
  /**
   * Ambil keranjang user beserta detail produk.
   * Jika belum ada, buat baru.
   */
  public async getUserCart(userId: string) {
    const cartItems = await Cart.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "price", "imageUrl", "stock", "sellerId"],
          include: [
            {
              model: User,
              as: "seller",
              attributes: ["fullName"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Hitung total belanja
    const grandTotal = cartItems.reduce(
      (sum: number, item: any) =>
        sum + parseFloat(item.product.price) * item.quantity,
      0
    );

    return { items: cartItems.map((item) => item.toJSON()), grandTotal };
  }

  /**
   * Tambahkan produk ke keranjang.
   */
  public async addToCart(userId: string, productId: string, quantity: number) {
    const product = await Product.findByPk(productId);
    if (!product)
      throw new HttpException(StatusCodes.NOT_FOUND, "Product not found");

    if (product.stock < quantity) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        `Insufficient stock. Only ${product.stock} items left.`
      );
    }

    // Cek apakah item dengan product yang sama sudah ada di cart
    const existingCartItem = await Cart.findOne({
      where: {
        userId,
        productId,
      },
    });

    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + quantity;
      if (newQuantity > product.stock) {
        throw new HttpException(
          StatusCodes.BAD_REQUEST,
          `Cannot add item. Total quantity (${newQuantity}) exceeds stock (${product.stock}).`
        );
      }
      await existingCartItem.update({ quantity: newQuantity });
    } else {
      await Cart.create({ userId, productId, quantity, size: "default" });
    }

    return this.getUserCart(userId);
  }

  /**
   * Update quantity item.
   */
  public async updateItemQuantity(
    userId: string,
    cartItemId: string,
    quantity: number
  ) {
    const item = await Cart.findOne({
      where: { id: cartItemId, userId },
      include: [{ model: Product, as: "product" }],
    });

    if (!item) {
      throw new HttpException(
        StatusCodes.NOT_FOUND,
        "Cart item not found or access denied"
      );
    }

    const product = (item as any).product;
    if (!product) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Product missing");
    }

    if (quantity <= 0) {
      await item.destroy();
    } else {
      if (quantity > product.stock) {
        throw new HttpException(
          StatusCodes.BAD_REQUEST,
          `Insufficient stock. Only ${product.stock} available.`
        );
      }
      await item.update({ quantity });
    }

    return this.getUserCart(userId);
  }

  /**
   * Hapus item dari keranjang.
   */
  public async removeItem(userId: string, cartItemId: string) {
    const item = await Cart.findOne({
      where: { id: cartItemId, userId },
    });

    if (!item) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Cart item not found");
    }

    await item.destroy();
    return this.getUserCart(userId);
  }

  /**
   * Kosongkan keranjang.
   */
  public async clearCart(userId: string) {
    await Cart.destroy({ where: { userId } });
    return { message: "Cart cleared successfully" };
  }
}

export default new CartService();
