import { StatusCodes } from "http-status-codes";
import db from "../database/models";
import { PromotionAttributes } from "../database/models/promotion.model";
import HttpException from "../utils/http-exception.util";
import { Order } from "sequelize";

// Definisikan tipe instance model untuk type safety
type PromotionInstance = InstanceType<typeof db.Promotion>;
type ProductInstance = InstanceType<typeof db.Product>;

// Definisikan tipe yang lebih spesifik untuk promosi yang menyertakan relasi produk
interface PromotionWithProduct extends PromotionInstance {
  product?: ProductInstance;
}

const Promotion = db.Promotion;
const Product = db.Product;

// Tipe data untuk input pembuatan promosi
export type CreatePromotionInput = Omit<
  PromotionAttributes,
  "id" | "isActive" | "createdAt" | "updatedAt" | "usageCount"
>;

// Tipe data untuk input pembaruan promosi
export type UpdatePromotionInput = Partial<
  CreatePromotionInput & { isActive: boolean }
>;

/**
 * Service untuk menangani semua logika bisnis yang terkait dengan promosi produk.
 */
class PromotionService {
  /**
   * Membuat promosi baru untuk sebuah produk.
   */
  public async create(
    data: CreatePromotionInput,
    sellerId: string
  ): Promise<PromotionAttributes> {
    const { productId, code } = data;

    // Verifikasi bahwa produk tersebut milik penjual yang sedang login
    const product = await Product.findByPk(productId);
    if (!product || product.sellerId !== sellerId) {
      throw new HttpException(
        StatusCodes.FORBIDDEN,
        "You can only create promotions for your own products."
      );
    }

    if (code) {
      const existingPromo = await Promotion.findOne({ where: { code } });
      if (existingPromo) {
        throw new HttpException(
          StatusCodes.CONFLICT,
          "Promotion code already exists."
        );
      }
    }

    const newPromotion = await Promotion.create(data);
    return newPromotion.toJSON();
  }

  /**
   * Mengambil semua promosi (bisa difilter berdasarkan produk).
   */
  public async findAll(productId?: string): Promise<PromotionAttributes[]> {
    const options: { where: any; order: Order } = {
      where: {},
      order: [["endDate", "DESC"]], // Sequelize akan menginterpretasikan ini dengan benar
    };
    if (productId) {
      options.where = { productId };
    }

    const promotions = await Promotion.findAll(options);
    return promotions.map((promo: any) => promo.toJSON());
  }

  /**
   * Mengambil satu promosi berdasarkan ID.
   */
  public async findById(id: string): Promise<PromotionAttributes> {
    const promotion = await Promotion.findByPk(id);
    if (!promotion) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Promotion not found");
    }
    return promotion.toJSON();
  }

  /**
   * Memperbarui promosi berdasarkan ID.
   */
  public async update(
    id: string,
    data: UpdatePromotionInput,
    sellerId: string
  ): Promise<PromotionAttributes> {
    const promotion = (await Promotion.findByPk(id, {
      include: [{ model: Product, as: "product" }],
    })) as PromotionWithProduct | null;

    if (!promotion) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Promotion not found");
    }
    // Verifikasi kepemilikan
    if (promotion.product?.sellerId !== sellerId) {
      throw new HttpException(
        StatusCodes.FORBIDDEN,
        "You are not authorized to update this promotion."
      );
    }

    await promotion.update(data);
    return promotion.toJSON();
  }

  /**
   * Menghapus promosi berdasarkan ID.
   */
  public async delete(id: string, sellerId: string): Promise<void> {
    const promotion = (await Promotion.findByPk(id, {
      include: [{ model: Product, as: "product" }],
    })) as PromotionWithProduct | null;

    if (!promotion) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Promotion not found");
    }
    // Verifikasi kepemilikan
    if (promotion.product?.sellerId !== sellerId) {
      throw new HttpException(
        StatusCodes.FORBIDDEN,
        "You are not authorized to delete this promotion."
      );
    }

    await promotion.destroy();
  }
  /**
   * Memvalidasi apakah kode promo valid dan bisa digunakan.
   */
  public async validateCoupon(
    code: string,
    userId: string,
    purchaseAmount: number
  ): Promise<PromotionAttributes> {
    const promotion = await Promotion.findOne({
      where: { code, isActive: true },
      include: [], // Bisa include Product jika kupon spesifik produk
    });

    if (!promotion) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Invalid promotion code");
    }

    const now = new Date();
    if (now < promotion.startDate) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        "Promotion has not started yet"
      );
    }
    if (now > promotion.endDate) {
      throw new HttpException(StatusCodes.BAD_REQUEST, "Promotion has expired");
    }

    if (promotion.quota !== null && promotion.usageCount >= promotion.quota) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        "Promotion quota exceeded"
      );
    }

    if (purchaseAmount < promotion.minPurchaseAmount) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        `Minimum purchase amount is ${promotion.minPurchaseAmount}`
      );
    }

    // TODO: Cek apakah user ini sudah pernah pakai kupon ini (perlu tabel history penggunaan kupon)
    // Untuk sekarang kita skip validasi per-user

    return promotion.toJSON();
  }
}

// Ekspor sebagai singleton instance
export default new PromotionService();
