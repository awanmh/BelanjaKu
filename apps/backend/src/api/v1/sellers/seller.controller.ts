import { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import SellerService, { UpsertSellerProfileInput } from '../../../services/seller.service';
import HttpException from '../../../utils/http-exception.util';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';

/**
 * Controller untuk menangani request yang berhubungan dengan profil penjual.
 */
class SellerController {
  /**
   * Menangani permintaan untuk mendapatkan profil penjual yang sedang login.
   */
  public async getMyProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new HttpException(StatusCodes.UNAUTHORIZED, 'Authentication required');
      }
      const sellerProfile = await SellerService.getSellerProfile(req.user.id);
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Seller profile retrieved successfully',
        data: sellerProfile,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Menangani permintaan untuk membuat atau memperbarui profil penjual.
   */
  public async upsertMyProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new HttpException(StatusCodes.UNAUTHORIZED, 'Authentication required');
      }
      const profileData: UpsertSellerProfileInput = req.body;
      const updatedProfile = await SellerService.upsertSellerProfile(req.user.id, profileData);
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Seller profile updated successfully',
        data: updatedProfile,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new SellerController();
