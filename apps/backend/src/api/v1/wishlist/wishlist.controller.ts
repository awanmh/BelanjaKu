import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import WishlistService from '../../../services/wishlist.service';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: 'user' | 'seller' | 'admin';
  };
}

/**
 * Controller untuk menangani semua request wishlist
 */
class WishlistController {
  /**
   * Tambah produk ke wishlist
   * POST /api/v1/wishlist
   */
  public async addToWishlist(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { productId } = req.body;

      if (!productId) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Product ID is required',
        });
        return;
      }

      const wishlistItem = await WishlistService.addToWishlist(userId, productId);

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Product added to wishlist successfully',
        data: wishlistItem,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get wishlist user
   * GET /api/v1/wishlist
   */
  public async getWishlist(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const wishlistItems = await WishlistService.getWishlist(userId);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Wishlist retrieved successfully',
        data: wishlistItems,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Hapus item dari wishlist
   * DELETE /api/v1/wishlist/:id
   */
  public async removeFromWishlist(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id: wishlistId } = req.params;

      await WishlistService.removeFromWishlist(wishlistId, userId);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Product removed from wishlist successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Clear semua wishlist
   * DELETE /api/v1/wishlist
   */
  public async clearWishlist(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      await WishlistService.clearWishlist(userId);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Wishlist cleared successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new WishlistController();
