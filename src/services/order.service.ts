import { StatusCodes } from 'http-status-codes';
import db from '../database/models';
import HttpException from '../utils/http-exception.util';
import { Op } from 'sequelize';

// Definisikan tipe instance model
type OrderInstance = InstanceType<typeof db.Order>;
type OrderItemInstance = InstanceType<typeof db.OrderItem>;
type ProductInstance = InstanceType<typeof db.Product>;

// Mengambil model dari objek db
const Order = db.Order;
const OrderItem = db.OrderItem;
const Product = db.Product;
const Promotion = db.Promotion;
const sequelize = db.sequelize;

// Tipe data untuk item dalam keranjang belanja
interface CartItem {
  productId: string;
  quantity: number;
}

// Tipe data untuk input pembuatan pesanan, sekarang dengan promotionCode
export interface CreateOrderInput {
  items: CartItem[];
  shippingAddress: string;
  promotionCode?: string; // Kolom opsional untuk kode promosi
}

/**
 * Service untuk menangani semua logika bisnis yang terkait dengan pesanan.
 */
class OrderService {
  /**
   * Membuat pesanan baru berdasarkan item di keranjang.
   */
  public async createOrder(orderData: CreateOrderInput, userId: string) {
    const { items, shippingAddress, promotionCode } = orderData;
    const transaction = await sequelize.transaction();

    try {
      let totalAmount = 0;
      let discountAmount = 0;
      let promotionId: string | null = null;
      const orderItemsData = [];

      // 1. Validasi setiap item dan hitung total harga awal
      for (const item of items) {
        const product = await Product.findByPk(item.productId, { transaction });

        if (!product) {
          throw new HttpException(StatusCodes.NOT_FOUND, `Product with ID ${item.productId} not found`);
        }
        if (product.stock < item.quantity) {
          throw new HttpException(StatusCodes.BAD_REQUEST, `Not enough stock for ${product.name}`);
        }

        totalAmount += product.price * item.quantity;

        orderItemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
        });
      }

      // 2. Jika ada kode promosi, validasi dan terapkan diskon
      if (promotionCode) {
        const promo = await Promotion.findOne({
          where: {
            code: promotionCode,
            isActive: true,
            startDate: { [Op.lte]: new Date() },
            endDate: { [Op.gte]: new Date() },
          },
          transaction,
        });

        if (!promo) {
          throw new HttpException(StatusCodes.BAD_REQUEST, 'Invalid or expired promotion code');
        }

        // Pastikan promosi berlaku untuk salah satu produk di keranjang
        const isApplicable = items.some(item => item.productId === promo.productId);
        if (!isApplicable) {
            throw new HttpException(StatusCodes.BAD_REQUEST, 'This promotion code is not valid for the items in your cart.');
        }

        // Hitung diskon (hanya pada produk yang dipromosikan)
        const promoProductInCart = items.find(item => item.productId === promo.productId);
        const productForPromo = await Product.findByPk(promo.productId, { transaction });
        
        if (promoProductInCart && productForPromo) {
            const priceOfPromoProduct = productForPromo.price * promoProductInCart.quantity;
            discountAmount = priceOfPromoProduct * (promo.discountPercentage / 100);
            totalAmount -= discountAmount;
            promotionId = promo.id;
        }
      }

      // 3. Kurangi stok produk
      for (const item of items) {
        const product = await Product.findByPk(item.productId, { transaction });
        product!.stock -= item.quantity;
        await product!.save({ transaction });
      }

      // 4. Buat entri di tabel 'orders'
      const newOrder = await Order.create(
        {
          userId,
          totalAmount,
          shippingAddress,
          status: 'pending',
          promotionId,
          discountAmount,
        },
        { transaction }
      );

      await OrderItem.bulkCreate(
        orderItemsData.map((item) => ({ ...item, orderId: newOrder.id })),
        { transaction }
      );

      await transaction.commit();

      const fullOrder = await Order.findByPk(newOrder.id, {
        include: [{ model: OrderItem, as: 'items' }],
      });

      return fullOrder;

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // ... metode lainnya ...
  /**
   * Mengambil semua pesanan milik seorang pengguna.
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

  /**
   * Mengambil semua pesanan yang berisi produk dari seorang penjual.
   */
  public async getOrdersForSeller(sellerId: string) {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          as: 'items',
          required: true,
          include: [
            {
              model: Product,
              as: 'product',
              where: { sellerId }, // Filter utama: hanya produk milik seller ini
              required: true,
            },
          ],
        },
        {
          model: db.User, // Sertakan data pembeli
          as: 'user',
          attributes: ['id', 'fullName', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    return orders;
  }

  /**
   * Memperbarui status pesanan oleh seorang penjual.
   */
  public async updateOrderStatusBySeller(orderId: string, sellerId: string, status: 'processing' | 'shipped') {
    interface OrderWithItems extends OrderInstance {
      items: (OrderItemInstance & {
        product?: ProductInstance;
      })[];
    }
    
    const order = await Order.findByPk(orderId, {
      include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }],
    });

    if (!order) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Order not found');
    }

    const orderWithItems = order as OrderWithItems;

    const isSellerProductInOrder = orderWithItems.items.some(
      (item) => item.product?.sellerId === sellerId
    );

    if (!isSellerProductInOrder) {
      throw new HttpException(StatusCodes.FORBIDDEN, 'You are not authorized to update this order');
    }

    if (order.status !== 'processing' && status === 'shipped') {
        throw new HttpException(StatusCodes.BAD_REQUEST, 'Order must be processed before it can be shipped');
    }
    
    order.status = status;
    await order.save();
    return order;
  }
}

export default new OrderService();