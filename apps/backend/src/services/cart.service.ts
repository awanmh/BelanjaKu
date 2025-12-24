import { StatusCodes } from "http-status-codes";
import db from "../database/models";
import HttpException from "../utils/http-exception.util";

const Cart = db.Cart;
const CartItem = db.CartItem;
const Product = db.Product;

class CartService {
  /**
   * Ambil keranjang user beserta detail produk.
   * Jika belum ada, buat baru.
   */
  public async getUserCart(userId: string) {
    let cart = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          as: "items",
          attributes: ["id", "quantity", "productId"],
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "price", "imageUrl", "stock", "sellerId"],
            },
          ],
        },
      ],
      order: [[{ model: CartItem, as: "items" }, "createdAt", "DESC"]],
    });

    if (!cart) {
      cart = await Cart.create({ userId });
      return { ...cart.toJSON(), items: [], grandTotal: 0 };
    }

    // Hitung total belanja
    const items = (cart as any).items || [];
    const grandTotal = items.reduce(
      (sum: number, item: any) => sum + parseFloat(item.product.price) * item.quantity,
      0
    );

    return { ...cart.toJSON(), items, grandTotal };
  }

  /**
   * Tambahkan produk ke keranjang.
   */
  public async addToCart(userId: string, productId: string, quantity: number) {
    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) cart = await Cart.create({ userId });

    const product = await Product.findByPk(productId);
    if (!product) throw new HttpException(StatusCodes.NOT_FOUND, "Product not found");

    if (product.stock < quantity) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        `Insufficient stock. Only ${product.stock} items left.`
      );
    }

    const existingItem = await CartItem.findOne({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock) {
        throw new HttpException(
          StatusCodes.BAD_REQUEST,
          `Cannot add item. Total quantity (${newQuantity}) exceeds stock (${product.stock}).`
        );
      }
      await existingItem.update({ quantity: newQuantity });
    } else {
      await CartItem.create({ cartId: cart.id, productId, quantity });
    }

    return this.getUserCart(userId);
  }

  /**
   * Update quantity item.
   */
  public async updateItemQuantity(userId: string, cartItemId: string, quantity: number) {
    const item = await CartItem.findOne({
      where: { id: cartItemId },
      include: [{ model: Cart, as: "cart" }, { model: Product, as: "product" }],
    });

    if (!item || !item.cart || item.cart.userId !== userId) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Cart item not found or access denied");
    }

    if (!item.product) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Product missing");
    }

    if (quantity <= 0) {
      await item.destroy();
    } else {
      if (quantity > item.product.stock) {
        throw new HttpException(
          StatusCodes.BAD_REQUEST,
          `Insufficient stock. Only ${item.product.stock} available.`
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
    const item = await CartItem.findOne({
      where: { id: cartItemId },
      include: [{ model: Cart, as: "cart" }],
    });

    if (!item || !item.cart || item.cart.userId !== userId) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Cart item not found");
    }

    await item.destroy();
    return this.getUserCart(userId);
  }

  /**
   * Kosongkan keranjang.
   */
  public async clearCart(userId: string) {
    const cart = await Cart.findOne({ where: { userId } });
    if (cart) await CartItem.destroy({ where: { cartId: cart.id } });
    return { message: "Cart cleared successfully" };
  }
}

export default new CartService();