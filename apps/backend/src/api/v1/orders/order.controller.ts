import { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import OrderService, { CreateOrderInput } from '../../../services/order.service';
import HttpException from '../../../utils/http-exception.util';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import db from '../../../database/models'; // Import DB

class OrderController {
  
  // --- Helper Private ---
  private async getSellerIdFromUser(userId: string): Promise<string> {
    const seller = await db.Seller.findOne({ where: { userId } });
    if (!seller) {
      throw new HttpException(StatusCodes.FORBIDDEN, 'User is not registered as a seller');
    }
    return seller.id;
  }

  // ... (Metode User/Buyer biarkan tetap sama: createOrder, getMyOrders, getOrderById) ...
  // Paste ulang metode createOrder, getMyOrders, getOrderById dari kode lama Anda di sini
  public async createOrder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
      try {
        const userId = req.user!.id;
        const orderData: CreateOrderInput = req.body;
        const newOrder = await OrderService.createOrder(orderData, userId);
        res.status(StatusCodes.CREATED).json({ success: true, message: 'Order placed successfully', data: newOrder });
      } catch (error) { next(error); }
  }

  public async getMyOrders(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
      try {
        const userId = req.user!.id;
        const orders = await OrderService.getOrdersByUser(userId);
        res.status(StatusCodes.OK).json({ success: true, message: 'Orders retrieved successfully', data: orders });
      } catch (error) { next(error); }
  }

  public async getOrderById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
      try {
        const userId = req.user!.id;
        const { id: orderId } = req.params;
        const order = await OrderService.getOrderById(orderId, userId);
        res.status(StatusCodes.OK).json({ success: true, message: 'Order details retrieved successfully', data: order });
      } catch (error) { next(error); }
  }

  // --- Metode untuk Penjual (Seller) ---

  public async getSellerOrders(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // PERBAIKAN: Cari Seller ID dari User ID
      const sellerId = await this.getSellerIdFromUser(req.user!.id);
      
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

  public async updateOrderStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // PERBAIKAN: Cari Seller ID dari User ID
      const sellerId = await this.getSellerIdFromUser(req.user!.id);
      
      const { id: orderId } = req.params;
      const { status } = req.body;

      if (!status || (status !== 'processing' && status !== 'shipped')) {
        throw new HttpException(StatusCodes.BAD_REQUEST, 'Invalid status provided');
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

export default new OrderController();