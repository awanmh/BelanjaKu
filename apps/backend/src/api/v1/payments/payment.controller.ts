import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import PaymentService from '../../../services/payment.service';
import ApiError from '../../../utils/api-error.util';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import logger from '../../../utils/logger.util';

/**
 * Controller untuk menangani request yang berhubungan dengan pembayaran.
 */
class PaymentController {
  /**
   * Menangani permintaan untuk memulai proses pembayaran.
   */
  public async initiatePayment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Authentication required');
      }
      const { orderId, method } = req.body;
      const userId = req.user.id;

      const paymentInfo = await PaymentService.createPayment(orderId, userId, method);
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Payment initiated successfully',
        data: paymentInfo,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Menangani notifikasi webhook dari payment gateway.
   */
  public async handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payload = req.body;
      // Ambil signature dari header (nama header tergantung payment gateway, misal: 'x-signature')
      const signature = req.headers['x-signature'] as string;

      if (!signature) {
        logger.warn('Webhook received without signature.');
        // Di produksi, Anda mungkin ingin langsung melempar error di sini
        // throw new ApiError(StatusCodes.BAD_REQUEST, 'Signature is missing');
      }

      // FIX: Teruskan payload dan signature ke service
      await PaymentService.handleWebhook(payload, signature || '');

      // Kirim respons 200 OK untuk memberitahu payment gateway bahwa notifikasi sudah diterima
      res.status(StatusCodes.OK).json({ received: true });
    } catch (error) {
      // Jangan teruskan error ke 'next(error)' karena ini akan mengirim respons error ke payment gateway.
      // Cukup log error-nya saja. Payment gateway biasanya hanya peduli dengan status 200 OK.
      logger.error('Webhook processing failed:', error);
      // Kirim respons error dengan format yang mungkin diharapkan gateway, atau cukup 500.
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
  }
}

// Ekspor sebagai singleton instance
export default new PaymentController();

