import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import CartService from '../../../services/cart.service';
import ApiError from '../../../utils/api-error.util';

// Interface untuk memperluas objek Request Express dengan properti 'user'
// Ini sama dengan yang ada di product.controller.ts
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: 'user' | 'seller' | 'admin';
  };
}

/**
 * Controller untuk menangani semua request yang berhubungan dengan Shopping Cart (Keranjang).
 */
class CartController {
  /**
   * Mendapatkan keranjang milik user yang sedang login.
   * Method: GET /api/v1/carts
   */
  public async getMyCart(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // Kita asumsikan middleware 'protect' sudah dijalankan sebelumnya,
      // sehingga req.user pasti ada.
      const userId = req.user!.id;
      
      const cart = await CartService.getUserCart(userId);
      
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Cart retrieved successfully',
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Menambahkan item ke keranjang.
   * Method: POST /api/v1/carts
   * Body: { productId: string, quantity: number }
   */
  public async addToCart(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { productId, quantity } = req.body;

      // Validasi sederhana jika tidak ter-cover oleh validator middleware
      if (!productId || !quantity) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Product ID and quantity are required');
      }

      const cart = await CartService.addToCart(userId, productId, quantity);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Item added to cart successfully',
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mengupdate jumlah item tertentu di dalam keranjang.
   * Method: PATCH /api/v1/carts/items/:itemId
   * Body: { quantity: number }
   */
  public async updateItemQuantity(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { itemId } = req.params; // ID dari CartItem, bukan Product ID
      const { quantity } = req.body;

      if (quantity === undefined) {
         throw new ApiError(StatusCodes.BAD_REQUEST, 'Quantity is required');
      }

      const cart = await CartService.updateItemQuantity(userId, itemId, quantity);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Cart item updated successfully',
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Menghapus satu item spesifik dari keranjang.
   * Method: DELETE /api/v1/carts/items/:itemId
   */
  public async removeItem(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { itemId } = req.params;

      const cart = await CartService.removeItem(userId, itemId);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Item removed from cart successfully',
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mengosongkan seluruh isi keranjang.
   * Method: DELETE /api/v1/carts
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
