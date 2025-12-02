import ReviewService from '../review.service';
import db from '../../database/models';
import HttpException from '../../utils/http-exception.util';
import { StatusCodes } from 'http-status-codes';

// Mock dependensi eksternal
jest.mock('../../database/models', () => ({
  Review: {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
  },
  Order: {
    findOne: jest.fn(),
  },
  // Tambahkan mock User untuk relasi di getReviewsByProduct
  User: {},
}));

const mockReview = db.Review as jest.Mocked<typeof db.Review>;
const mockOrder = db.Order as jest.Mocked<typeof db.Order>;

describe('ReviewService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const userId = 'user-uuid';
  const reviewData = {
    productId: 'prod-uuid',
    rating: 5,
    comment: 'This is a great product!',
  };

  describe('createReview', () => {
    it('should create a review if user has purchased the product', async () => {
      // Simulasikan bahwa pengguna telah membeli produk
      mockOrder.findOne.mockResolvedValue({ id: 'order-uuid' } as any);
      // Simulasikan bahwa pengguna belum pernah mereview
      mockReview.findOne.mockResolvedValue(null);
      // Simulasikan pembuatan review
      const createdReview = { ...reviewData, userId, toJSON: () => ({...reviewData, userId}) };
      mockReview.create.mockResolvedValue(createdReview as any);

      const result = await ReviewService.createReview(reviewData, userId);

      expect(mockOrder.findOne).toHaveBeenCalled();
      expect(mockReview.findOne).toHaveBeenCalled();
      expect(mockReview.create).toHaveBeenCalledWith({ ...reviewData, userId });
      expect(result).toEqual({ ...reviewData, userId });
    });

    it('should throw FORBIDDEN if user has not purchased the product', async () => {
      // Simulasikan bahwa pengguna belum membeli produk
      mockOrder.findOne.mockResolvedValue(null);

      await expect(ReviewService.createReview(reviewData, userId)).rejects.toThrow(
        new HttpException(StatusCodes.FORBIDDEN, 'You can only review products you have purchased')
      );
    });

    it('should throw CONFLICT if user has already reviewed the product', async () => {
      mockOrder.findOne.mockResolvedValue({ id: 'order-uuid' } as any);
      // Simulasikan bahwa pengguna sudah pernah mereview
      mockReview.findOne.mockResolvedValue({ id: 'review-uuid' } as any);

      await expect(ReviewService.createReview(reviewData, userId)).rejects.toThrow(
        new HttpException(StatusCodes.CONFLICT, 'You have already reviewed this product')
      );
    });
  });

  describe('getReviewsByProduct', () => {
    it('should return a list of reviews for a product', async () => {
        const mockReviews = [
            { toJSON: () => ({ rating: 5, comment: 'Great!' }) },
            { toJSON: () => ({ rating: 4, comment: 'Good.' }) },
        ];
        mockReview.findAll.mockResolvedValue(mockReviews as any);

        const result = await ReviewService.getReviewsByProduct('prod-uuid');

        expect(mockReview.findAll).toHaveBeenCalled();
        expect(result.length).toBe(2);
    });
  });
});
