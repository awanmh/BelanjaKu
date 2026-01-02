import { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import OrderService, { CreateOrderInput } from '../../../services/order.service';
import ApiError from '../../../utils/api-error.util';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';

/**
 * Controller untuk menangani semua request yang berhubungan dengan pesanan.
 */
class OrderController {
  // --- Metode untuk Pembeli (User) ---

  /**
   * Menangani permintaan untuk membuat pesanan baru (checkout).
   */
  public async createOrder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // REFACTOR: Pemeriksaan req.user tidak lagi diperlukan
      const userId = req.user!.id;
      const orderData: CreateOrderInput = req.body;

      const newOrder = await OrderService.createOrder(orderData, userId);

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Order placed successfully',
        data: newOrder,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Menangani permintaan untuk mendapatkan semua pesanan milik pengguna yang sedang login.
   */
  public async getMyOrders(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // REFACTOR: Pemeriksaan req.user tidak lagi diperlukan
      const userId = req.user!.id;
      const orders = await OrderService.getOrdersByUser(userId);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Orders retrieved successfully',
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Menangani permintaan untuk mendapatkan detail satu pesanan.
   */
  public async getOrderById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // REFACTOR: Pemeriksaan req.user tidak lagi diperlukan
      const userId = req.user!.id;
      const { id: orderId } = req.params;
      const order = await OrderService.getOrderById(orderId, userId);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Order details retrieved successfully',
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  // --- Metode untuk Penjual (Seller) ---

  /**
   * Menangani permintaan dari penjual untuk mendapatkan semua pesanan yang masuk ke tokonya.
   */
  public async getSellerOrders(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // REFACTOR: Pemeriksaan req.user tidak lagi diperlukan
      const sellerId = req.user!.id;
      const orders = await OrderService.getOrdersForSeller(sellerId);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Incoming orders retrieved successfully',
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Menangani permintaan dari penjual untuk memperbarui status sebuah pesanan.
   */
  public async updateOrderStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // REFACTOR: Pemeriksaan req.user tidak lagi diperlukan
      const sellerId = req.user!.id;
      const { id: orderId } = req.params;
      const { status } = req.body; // status: 'processing' | 'shipped'

      if (!status || (status !== 'processing' && status !== 'shipped')) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid status provided');
      }

      const updatedOrder = await OrderService.updateOrderStatusBySeller(orderId, sellerId, status);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Order status updated successfully',
        data: updatedOrder,
      });
    } catch (error) {
      next(error);
    }
  }
}

// Ekspor sebagai singleton instance
export default new OrderController();
