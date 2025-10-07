import { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import ReviewService, { CreateReviewInput } from '../../../services/review.service';
import HttpException from '../../../utils/http-exception.util';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';

/**
 * Controller untuk menangani semua request yang berhubungan dengan ulasan produk.
 */
class ReviewController {
  /**
   * Menangani permintaan untuk membuat ulasan baru.
   */
  public async createReview(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // Pastikan pengguna sudah terautentikasi dan memiliki ID
      if (!req.user) {
        throw new HttpException(StatusCodes.UNAUTHORIZED, 'Authentication is required to post a review');
      }

      const userId = req.user.id;
      const reviewData: CreateReviewInput = req.body;

      const newReview = await ReviewService.createReview(reviewData, userId);

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Review submitted successfully',
        data: newReview,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Menangani permintaan untuk mendapatkan semua ulasan untuk produk tertentu.
   */
  public async getReviewsByProduct(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { productId } = req.params;
      const reviews = await ReviewService.getReviewsByProduct(productId);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Reviews retrieved successfully',
        data: reviews,
      });
    } catch (error) {
      next(error);
    }
  }
}

// Ekspor sebagai singleton instance
export default new ReviewController();
