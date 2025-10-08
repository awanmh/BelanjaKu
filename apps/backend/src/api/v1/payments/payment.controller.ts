import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import PaymentService from '../../../services/payment.service';
import HttpException from '../../../utils/http-exception.util';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { PaymentMethod } from '../../../database/models/payment.model';
import logger from '../../../utils/logger.util';

class PaymentController {
  /**
   * Memulai proses pembayaran untuk sebuah pesanan.
   */
  public async initiatePayment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new HttpException(StatusCodes.UNAUTHORIZED, 'Authentication required');
      }
      const { orderId, method } = req.body as { orderId: string, method: PaymentMethod };
      if (!orderId || !method) {
        throw new HttpException(StatusCodes.BAD_REQUEST, 'orderId and method are required');
      }

      const paymentInfo = await PaymentService.createPayment(orderId, req.user.id, method);
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Payment initiated',
        data: paymentInfo,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Menerima notifikasi dari payment gateway.
   * Endpoint ini tidak diproteksi karena dipanggil oleh server eksternal.
   */
  public async handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // DI DUNIA NYATA: Validasi signature/token dari payment gateway di sini.
      const payload = req.body;
      logger.info('Webhook received:', payload);
      
      await PaymentService.handleWebhook(payload);

      // Kirim respons 200 OK agar gateway tahu notifikasi diterima.
      res.status(StatusCodes.OK).json({ success: true, message: 'Webhook received' });
    } catch (error) {
      // Jangan kirim detail error ke gateway, cukup log di server kita.
      logger.error('Webhook handling failed:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal Server Error' });
    }
  }
}

export default new PaymentController();
