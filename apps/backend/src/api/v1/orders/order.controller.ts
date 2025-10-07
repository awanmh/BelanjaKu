import { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import OrderService, { CreateOrderInput } from '../../../services/order.service';
import HttpException from '../../../utils/http-exception.util';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';

/**
 * Controller untuk menangani semua request yang berhubungan dengan pesanan.
 */
class OrderController {
  /**
   * Menangani permintaan untuk membuat pesanan baru (checkout).
   */
  public async createOrder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // Pastikan pengguna sudah terautentikasi dan memiliki ID
      if (!req.user) {
        throw new HttpException(StatusCodes.UNAUTHORIZED, 'Authentication is required to place an order');
      }

      const userId = req.user.id;
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
      if (!req.user) {
        throw new HttpException(StatusCodes.UNAUTHORIZED, 'Authentication is required to view orders');
      }

      const userId = req.user.id;
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
      if (!req.user) {
        throw new HttpException(StatusCodes.UNAUTHORIZED, 'Authentication is required to view an order');
      }

      const userId = req.user.id;
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
}

// Ekspor sebagai singleton instance
export default new OrderController();
