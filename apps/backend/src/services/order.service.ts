import { StatusCodes } from 'http-status-codes';
import db from '../database/models';
import HttpException from '../utils/http-exception.util';

// Mengambil model dari objek db
const Order = db.Order;
const OrderItem = db.OrderItem;
const Product = db.Product;
const sequelize = db.sequelize;

// Tipe data untuk item dalam keranjang belanja
interface CartItem {
  productId: string;
  quantity: number;
}

// Tipe data untuk input pembuatan pesanan
export interface CreateOrderInput {
  items: CartItem[];
  shippingAddress: string;
}

/**
 * Service untuk menangani semua logika bisnis yang terkait dengan pesanan.
 */
class OrderService {
  /**
   * Membuat pesanan baru berdasarkan item di keranjang.
   * Menggunakan transaksi untuk memastikan integritas data.
   * @param orderData Data pesanan dari klien.
   * @param userId ID pengguna yang melakukan pemesanan.
   * @returns Pesanan yang baru dibuat.
   */
  public async createOrder(orderData: CreateOrderInput, userId: string) {
    const { items, shippingAddress } = orderData;

    // Memulai transaksi database
    const transaction = await sequelize.transaction();

    try {
      let totalAmount = 0;
      const orderItemsData = [];

      // 1. Validasi setiap item dan hitung total harga
      for (const item of items) {
        const product = await Product.findByPk(item.productId, { transaction });

        if (!product) {
          throw new HttpException(StatusCodes.NOT_FOUND, `Product with ID ${item.productId} not found`);
        }
        if (product.stock < item.quantity) {
          throw new HttpException(StatusCodes.BAD_REQUEST, `Not enough stock for ${product.name}`);
        }

        const itemPrice = product.price * item.quantity;
        totalAmount += itemPrice;

        // Siapkan data untuk OrderItem
        orderItemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          price: product.price, // Simpan harga saat ini
        });

        // 2. Kurangi stok produk
        product.stock -= item.quantity;
        await product.save({ transaction });
      }

      // 3. Buat entri di tabel 'orders'
      const newOrder = await Order.create(
        {
          userId,
          totalAmount,
          shippingAddress,
          status: 'pending',
        },
        { transaction }
      );

      // 4. Buat entri di tabel 'order_items' untuk setiap produk
      await OrderItem.bulkCreate(
        orderItemsData.map((item) => ({ ...item, orderId: newOrder.id })),
        { transaction }
      );

      // Jika semua berhasil, commit transaksi
      await transaction.commit();

      // 5. Kembalikan pesanan lengkap dengan item-itemnya
      const fullOrder = await Order.findByPk(newOrder.id, {
        include: [{ model: OrderItem, as: 'items' }],
      });

      return fullOrder;

    } catch (error) {
      // Jika ada kesalahan, batalkan semua perubahan (rollback)
      await transaction.rollback();
      // Lempar kembali error asli untuk ditangani oleh error handler global
      throw error;
    }
  }

  /**
   * Mengambil semua pesanan milik seorang pengguna.
   * @param userId ID pengguna.
   * @returns Daftar pesanan pengguna.
   */
  public async getOrdersByUser(userId: string) {
    const orders = await Order.findAll({
      where: { userId },
      include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }],
      order: [['createdAt', 'DESC']],
    });
    return orders;
  }

  /**
   * Mengambil detail satu pesanan berdasarkan ID.
   * @param orderId ID pesanan.
   * @param userId ID pengguna (untuk verifikasi kepemilikan).
   * @returns Detail pesanan.
   */
  public async getOrderById(orderId: string, userId: string) {
    const order = await Order.findOne({
      where: { id: orderId, userId },
      include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }],
    });

    if (!order) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Order not found or you do not have permission to view it');
    }

    return order;
  }
}

export default new OrderService();
