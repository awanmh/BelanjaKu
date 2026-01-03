<<<<<<< HEAD
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
=======
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
>>>>>>> frontend-role
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Hitung total belanja
<<<<<<< HEAD
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

=======
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
>>>>>>> frontend-role
    return this.getUserCart(userId);
  }

  /**
<<<<<<< HEAD
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

=======
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
>>>>>>> frontend-role
    return this.getUserCart(userId);
  }

  /**
<<<<<<< HEAD
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
=======
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
>>>>>>> frontend-role
    return this.getUserCart(userId);
  }

  /**
<<<<<<< HEAD
   * Kosongkan keranjang.
   */
  public async clearCart(userId: string) {
    await Cart.destroy({ where: { userId } });
    return { message: "Cart cleared successfully" };
=======
   * Mengosongkan isi keranjang.
   */
  public async clearCart(userId: string) {
    await db.CartItem.destroy({
      where: { userId },
    });
    return true;
>>>>>>> frontend-role
  }
}

export default new CartService();
