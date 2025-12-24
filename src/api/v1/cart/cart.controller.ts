import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import CartService, { AddToCartInput, UpdateCartInput } from '../../../services/cart.service';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: 'user' | 'seller' | 'admin';
  };
}

/**
 * Controller untuk menangani semua request yang berhubungan dengan cart.
 */
class CartController {
  /**
   * Menambahkan produk ke cart
   * POST /api/v1/cart
   */
  public async addToCart(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const cartData: AddToCartInput = req.body;

      // Validasi input
      if (!cartData.productId || !cartData.size) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Product ID and size are required',
        });
        return;
      }

      const cartItem = await CartService.addToCart(userId, cartData);

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Product added to cart successfully',
        data: cartItem,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mendapatkan semua item di cart
   * GET /api/v1/cart
   */
  public async getCart(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const summary = await CartService.getCartSummary(userId);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Cart retrieved successfully',
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update quantity item di cart
   * PATCH /api/v1/cart/:id
   */
  public async updateCartItem(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id: cartId } = req.params;
      const updateData: UpdateCartInput = req.body;

      if (!updateData.quantity || updateData.quantity < 1) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Quantity must be at least 1',
        });
        return;
      }

      const updatedItem = await CartService.updateCartItem(cartId, userId, updateData);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Cart item updated successfully',
        data: updatedItem,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Hapus item dari cart
   * DELETE /api/v1/cart/:id
   */
  public async removeCartItem(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id: cartId } = req.params;

      await CartService.removeCartItem(cartId, userId);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Cart item removed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Clear semua item di cart
   * DELETE /api/v1/cart
   */
  public async clearCart(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      await CartService.clearCart(userId);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Cart cleared successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CartController();
