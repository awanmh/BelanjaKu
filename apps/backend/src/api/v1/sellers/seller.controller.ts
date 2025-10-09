import { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import SellerService, { CreateSellerProfileInput } from '../../../services/seller.service';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import HttpException from '../../../utils/http-exception.util';

/**
 * Controller untuk menangani semua request yang berhubungan dengan profil penjual.
 */
class SellerController {
  /**
   * Menangani permintaan untuk membuat atau memperbarui profil penjual.
   */
  public async upsertProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new HttpException(StatusCodes.UNAUTHORIZED, 'Authentication required');
      }
      const userId = req.user.id;
      const data: CreateSellerProfileInput = req.body;

      const profile = await SellerService.upsertProfile(userId, data);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Seller profile saved successfully',
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Menangani permintaan untuk mendapatkan profil penjual yang sedang login.
   */
  public async getMyProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new HttpException(StatusCodes.UNAUTHORIZED, 'Authentication required');
      }
      const userId = req.user.id;
      const profile = await SellerService.getProfile(userId);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Seller profile retrieved successfully',
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Menangani permintaan untuk mendapatkan statistik dasbor penjual.
   */
  public async getDashboardStats(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new HttpException(StatusCodes.UNAUTHORIZED, 'Authentication required');
      }
      
      const sellerId = req.user.id;
      const stats = await SellerService.getDashboardStats(sellerId);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Dashboard statistics retrieved successfully',
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Menangani permintaan untuk mendapatkan produk dengan stok menipis.
   */
  public async getLowStockProducts(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new HttpException(StatusCodes.UNAUTHORIZED, 'Authentication required');
      }
      
      const sellerId = req.user.id;
      const products = await SellerService.getLowStockProducts(sellerId);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Low stock products retrieved successfully',
        data: products,
      });
    } catch (error) {
      next(error);
    }
  }
}

// Ekspor sebagai singleton instance
export default new SellerController();