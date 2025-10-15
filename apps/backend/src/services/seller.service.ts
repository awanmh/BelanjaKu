import { StatusCodes } from 'http-status-codes';
import db from '../database/models';
import { SellerAttributes } from '../database/models/seller.model';
import HttpException from '../utils/http-exception.util';
import { Op } from 'sequelize';

// Mengambil model dari objek db
const Seller = db.Seller;
const OrderItem = db.OrderItem;
const Product = db.Product;

// Tipe data untuk input
export type CreateSellerProfileInput = Pick<SellerAttributes, 'storeName' | 'storeAddress' | 'storePhoneNumber'>;
export type UpdateSellerProfileInput = Partial<CreateSellerProfileInput>;

// Interface untuk mendefinisikan bentuk hasil query agregasi
interface SalesData {
  totalRevenue: string | null;
  totalProductsSold: string | null;
}

/**
 * Service untuk menangani semua logika bisnis yang terkait dengan profil penjual.
 */
class SellerService {
  /**
   * Membuat atau memperbarui profil seorang penjual.
   */
  public async upsertProfile(userId: string, data: CreateSellerProfileInput): Promise<SellerAttributes> {
    const user = await db.User.findByPk(userId);
    if (!user || user.role !== 'seller') {
      throw new HttpException(StatusCodes.FORBIDDEN, 'User is not a seller');
    }

    const [profile, created] = await Seller.findOrCreate({
      where: { userId },
      defaults: { ...data, userId },
    });

    if (!created) {
      await profile.update(data);
    }

    return profile.toJSON();
  }

  /**
   * Mengambil profil seorang penjual.
   */
  public async getProfile(userId: string): Promise<SellerAttributes> {
    const profile = await Seller.findOne({ where: { userId } });
    if (!profile) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Seller profile not found. Please create one.');
    }
    return profile.toJSON();
  }

  /**
   * Mengambil statistik dasbor untuk seorang penjual.
   */
  public async getDashboardStats(sellerId: string) {
    const salesData = (await OrderItem.findAll({
      attributes: [
        [db.sequelize.fn('SUM', db.sequelize.literal('price * quantity')), 'totalRevenue'],
        [db.sequelize.fn('SUM', db.sequelize.col('quantity')), 'totalProductsSold'],
      ],
      include: [{ model: Product, as: 'product', where: { sellerId }, attributes: [] }],
      raw: true,
    })) as unknown as SalesData[];

    const totalOrders = await db.Order.count({
      distinct: true,
      col: 'id',
      include: [{
        model: OrderItem,
        as: 'items',
        required: true,
        include: [{ model: Product, as: 'product', where: { sellerId }, required: true }],
      }],
    });

    // FIX: Tangani kasus di mana tidak ada data penjualan (salesData[0] bisa undefined)
    const stats = {
      totalRevenue: parseFloat(salesData[0]?.totalRevenue || '0') || 0,
      totalProductsSold: parseInt(salesData[0]?.totalProductsSold || '0', 10) || 0,
      totalOrders: totalOrders || 0,
    };
    
    return stats;
  }

  /**
   * Mengambil daftar produk milik penjual yang stoknya menipis.
   */
  public async getLowStockProducts(sellerId: string) {
    const lowStockProducts = await Product.findAll({
      where: {
        sellerId,
        stock: {
          [Op.lte]: db.sequelize.col('lowStockThreshold'),
        },
      },
      order: [['stock', 'ASC']],
    });

    return lowStockProducts.map(p => p.toJSON());
  }
}

// Ekspor sebagai singleton instance
export default new SellerService();