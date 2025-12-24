import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import PromotionService, { CreatePromotionInput, UpdatePromotionInput } from '../../../services/promotion.service';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import HttpException from '../../../utils/http-exception.util';

/**
 * Controller untuk menangani semua request yang berhubungan dengan promosi.
 */
class PromotionController {
  /**
   * Menangani permintaan untuk membuat promosi baru.
   */
  public async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new HttpException(StatusCodes.UNAUTHORIZED, 'Authentication required');
      }
      const sellerId = req.user.id;
      const data: CreatePromotionInput = req.body;

      const newPromotion = await PromotionService.create(data, sellerId);

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Promotion created successfully',
        data: newPromotion,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Menangani permintaan untuk mendapatkan semua promosi.
   */
  public async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Izinkan filter berdasarkan productId dari query string
      const productId = req.query.productId as string | undefined;
      const promotions = await PromotionService.findAll(productId);
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Promotions retrieved successfully',
        data: promotions,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Menangani permintaan untuk mendapatkan satu promosi berdasarkan ID.
   */
  public async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const promotion = await PromotionService.findById(id);
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Promotion retrieved successfully',
        data: promotion,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Menangani permintaan untuk memperbarui promosi.
   */
  public async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new HttpException(StatusCodes.UNAUTHORIZED, 'Authentication required');
      }
      const sellerId = req.user.id;
      const { id } = req.params;
      const data: UpdatePromotionInput = req.body;

      const updatedPromotion = await PromotionService.update(id, data, sellerId);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Promotion updated successfully',
        data: updatedPromotion,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Menangani permintaan untuk menghapus promosi.
   */
  public async delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new HttpException(StatusCodes.UNAUTHORIZED, 'Authentication required');
      }
      const sellerId = req.user.id;
      const { id } = req.params;

      await PromotionService.delete(id, sellerId);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Promotion deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

// Ekspor sebagai singleton instance
export default new PromotionController();