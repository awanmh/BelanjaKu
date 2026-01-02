import { Request, Response, NextFunction } from 'express'; // FIX: Tambahkan 'Request' di sini
import { StatusCodes } from 'http-status-codes';
import ReviewService, { CreateReviewInput } from '../../../services/review.service';
import ApiError from '../../../utils/api-error.util';
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
      // REFACTOR: Pemeriksaan req.user tidak lagi diperlukan karena sudah ditangani oleh middleware 'protect'
      const userId = req.user!.id;
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
  public async getReviewsByProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
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
