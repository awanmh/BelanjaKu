import { StatusCodes } from 'http-status-codes';
import db from '../database/models';
import { CartAttributes } from '../database/models/cart.model';
import HttpException from '../utils/http-exception.util';

const Cart = db.Cart;
const Product = db.Product;
const User = db.User;

export interface AddToCartInput {
  productId: string;
  size: string;
  quantity?: number;
}

export interface UpdateCartInput {
  quantity: number;
}

/**
 * Service untuk menangani semua logika bisnis yang terkait dengan cart.
 */
class CartService {
  /**
   * Menambahkan produk ke cart atau update quantity jika sudah ada
   */
  public async addToCart(userId: string, cartData: AddToCartInput): Promise<CartAttributes> {
    const { productId, size, quantity = 1 } = cartData;

    // Validasi produk exists
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Product not found');
    }

    // Validasi stock
    if (product.stock < quantity) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Insufficient stock');
    }

    // Cek apakah item dengan product + size yang sama sudah ada di cart
    const existingCartItem = await Cart.findOne({
      where: {
        userId,
        productId,
        size,
      },
    });

    if (existingCartItem) {
      // Update quantity
      const newQuantity = existingCartItem.quantity + quantity;
      
      if (product.stock < newQuantity) {
        throw new HttpException(StatusCodes.BAD_REQUEST, 'Insufficient stock');
      }

      await existingCartItem.update({ quantity: newQuantity });
      return existingCartItem.toJSON();
    } else {
      // Create new cart item
      const newCartItem = await Cart.create({
        userId,
        productId,
        size,
        quantity,
      });
      return newCartItem.toJSON();
    }
  }

  /**
   * Mendapatkan semua item di cart user
   */
  public async getCartItems(userId: string): Promise<any[]> {
    const cartItems = await Cart.findAll({
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

    return cartItems.map((item) => item.toJSON());
  }

  /**
   * Update quantity item di cart
   */
  public async updateCartItem(
    cartId: string,
    userId: string,
    updateData: UpdateCartInput
  ): Promise<CartAttributes> {
    const cartItem = await Cart.findOne({
      where: { id: cartId, userId },
      include: [{ model: Product, as: 'product' }],
    });

    if (!cartItem) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Cart item not found');
    }

    const product = (cartItem as any).product;
    if (product.stock < updateData.quantity) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Insufficient stock');
    }

    await cartItem.update({ quantity: updateData.quantity });
    return cartItem.toJSON();
  }

  /**
   * Hapus item dari cart
   */
  public async removeCartItem(cartId: string, userId: string): Promise<void> {
    const cartItem = await Cart.findOne({
      where: { id: cartId, userId },
    });

    if (!cartItem) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Cart item not found');
    }

    await cartItem.destroy();
  }

  /**
   * Clear semua item di cart user
   */
  public async clearCart(userId: string): Promise<void> {
    await Cart.destroy({
      where: { userId },
    });
  }

  /**
   * Get cart summary (total items, total price)
   */
  public async getCartSummary(userId: string): Promise<{
    totalItems: number;
    totalPrice: number;
    items: any[];
  }> {
    const cartItems = await this.getCartItems(userId);

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );

    return {
      totalItems,
      totalPrice,
      items: cartItems,
    };
  }
}

export default new CartService();
