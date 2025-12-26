import { StatusCodes } from 'http-status-codes';
import db from '../database/models';
import { ReviewAttributes } from '../database/models/review.model';
import HttpException from '../utils/http-exception.util';

// Mengambil model dari objek db
const Review = db.Review;
const Order = db.Order;
const OrderItem = db.OrderItem;

// Tipe data untuk input pembuatan ulasan
export type CreateReviewInput = Pick<ReviewAttributes, 'productId' | 'rating' | 'comment'>;

/**
 * Service untuk menangani semua logika bisnis yang terkait dengan ulasan produk.
 */
class ReviewService {
  /**
   * Membuat ulasan baru untuk sebuah produk.
   * Memastikan bahwa pengguna yang membuat ulasan telah membeli produk tersebut.
   * @param reviewData Data ulasan dari klien.
   * @param userId ID pengguna yang membuat ulasan.
   * @returns Ulasan yang baru dibuat.
   */
  public async createReview(reviewData: CreateReviewInput, userId: string): Promise<ReviewAttributes> {
    const { productId, rating, comment } = reviewData;

    // 1. Cek apakah pengguna pernah membeli produk ini
    const hasPurchased = await Order.findOne({
      where: {
        userId,
        status: 'completed', // Pastikan hanya pesanan yang selesai yang dihitung
      },
      include: [
        {
          model: OrderItem,
          as: 'items',
          where: { productId },
          required: true, // INNER JOIN untuk memastikan item ada di pesanan
        },
      ],
    });

    if (!hasPurchased) {
      throw new HttpException(
        StatusCodes.FORBIDDEN,
        'You can only review products you have purchased'
      );
    }

    // 2. Cek apakah pengguna sudah pernah mereview produk ini sebelumnya
    const existingReview = await Review.findOne({ where: { userId, productId } });
    if (existingReview) {
      throw new HttpException(StatusCodes.CONFLICT, 'You have already reviewed this product');
    }

    // 3. Buat ulasan baru
    const newReview = await Review.create({
      userId,
      productId,
      rating,
      comment,
    });

    return newReview.toJSON();
  }

  /**
   * Mengambil semua ulasan untuk produk tertentu.
   * @param productId ID produk.
   * @returns Daftar ulasan untuk produk tersebut.
   */
  public async getReviewsByProduct(productId: string): Promise<ReviewAttributes[]> {
    const reviews = await Review.findAll({
      where: { productId },
      include: [
        {
          model: db.User, // Sertakan data pengguna (tanpa password)
          as: 'user',
          attributes: ['id', 'fullName'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return reviews.map((review: any) => review.toJSON());
  }
}

// Ekspor sebagai singleton instance
export default new ReviewService();
