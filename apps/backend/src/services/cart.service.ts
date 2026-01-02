import db from "../database/models";
import ApiError from "../utils/api-error.util";
import { StatusCodes } from "http-status-codes";

class CartService {
  /**
   * Mendapatkan keranjang milik user.
   */
  public async getUserCart(userId: string) {
    const cartItems = await db.CartItem.findAll({
      where: { userId },
      include: [
        {
          model: db.Product,
          as: "product",
          attributes: ["id", "name", "price", "stock", "imageUrl"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Hitung total belanja
    let grandTotal = 0;
    const items = cartItems.map((item: any) => {
      const subtotal = parseFloat(item.product.price) * item.quantity;
      grandTotal += subtotal;
      return {
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        productImage: item.product.imageUrl,
        price: parseFloat(item.product.price),
        quantity: item.quantity,
        stockAvailable: item.product.stock,
        subtotal: subtotal,
      };
    });

    return { items, grandTotal };
  }

  /**
   * Menambahkan produk ke keranjang.
   */
  public async addToCart(userId: string, productId: string, quantity: number) {
    const product = await db.Product.findByPk(productId);
    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");
    }

    // Cek apakah item sudah ada di keranjang user
    const existingItem = await db.CartItem.findOne({
      where: { userId, productId },
    });

    let newQuantity = quantity;
    if (existingItem) {
      newQuantity += existingItem.quantity;
    }

    // Cek stok produk
    if (newQuantity > product.stock) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `Insufficient stock. Only ${product.stock} left.`
      );
    }

    if (existingItem) {
      // Update quantity jika sudah ada
      existingItem.quantity = newQuantity;
      await existingItem.save();
    } else {
      // Buat baru jika belum ada
      await db.CartItem.create({
        userId,
        productId,
        quantity,
      });
    }

    // Kembalikan keranjang terbaru
    return this.getUserCart(userId);
  }

  /**
   * Mengupdate kuantitas item di keranjang.
   */
  public async updateItemQuantity(userId: string, cartItemId: string, quantity: number) {
    const cartItem = await db.CartItem.findOne({
      where: { id: cartItemId, userId },
      include: [{ model: db.Product, as: "product" }],
    });

    if (!cartItem) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Item not found in cart");
    }

    // Validasi stok
    if (quantity > cartItem.product.stock) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `Insufficient stock. Max available: ${cartItem.product.stock}`
      );
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    // Kembalikan keranjang terbaru
    return this.getUserCart(userId);
  }

  /**
   * Menghapus item dari keranjang.
   */
  public async removeItem(userId: string, cartItemId: string) {
    const result = await db.CartItem.destroy({
      where: { id: cartItemId, userId },
    });

    if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Item not found in cart");
    }

    // Kembalikan keranjang terbaru
    return this.getUserCart(userId);
  }

  /**
   * Mengosongkan isi keranjang.
   */
  public async clearCart(userId: string) {
    await db.CartItem.destroy({
      where: { userId },
    });
    return true;
  }
}

export default new CartService();
