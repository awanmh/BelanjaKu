import { StatusCodes } from 'http-status-codes';
import db from '../database/models';
import HttpException from '../utils/http-exception.util';
import { PaymentMethod } from '../database/models/payment.model';
import crypto from 'crypto';
import logger from '../utils/logger.util';

const Order = db.Order;
const Payment = db.Payment;
const sequelize = db.sequelize;

/**
 * Service untuk MENSIMULASIKAN interaksi dengan payment gateway.
 */
class PaymentService {
  /**
   * Mensimulasikan pembuatan transaksi di payment gateway.
   */
  public async createPayment(orderId: string, userId: string, method: PaymentMethod) {
    const order = await Order.findOne({ where: { id: orderId, userId } });
    if (!order) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Order not found');
    }
    if (order.status !== 'pending') {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'This order cannot be paid for');
    }

    const transactionId = `TRX-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    let paymentUrl: string | null = `https://example.com/pay/${transactionId}`;
    let message = `Payment initiated. Please complete the payment.`;
    let responsePayload: any = {};

    // --- DI SINI TEMPAT INTEGRASI DENGAN PAYMENT GATEWAY ---
    // Logika ini disimulasikan
    if (method === 'bank_transfer') {
      message = `Please transfer to Virtual Account 123456789 with amount ${order.totalAmount}`;
      paymentUrl = null; // Tidak ada URL redirect untuk VA
      responsePayload.virtualAccount = '1234567890';
    } else if (method === 'cod') {
      message = 'Your order will be processed as Cash On Delivery. Please prepare cash upon arrival.';
      paymentUrl = null; // Tidak ada URL untuk COD
    } else {
        // Untuk metode lain (kartu kredit, e-wallet), kembalikan paymentUrl
        responsePayload.paymentUrl = paymentUrl;
    }
    // --- AKHIR BAGIAN INTEGRASI ---


    // Buat catatan transaksi di database kita
    const newPayment = await Payment.create({
      orderId,
      transactionId,
      paymentGateway: 'simulation',
      amount: order.totalAmount,
      method,
      status: 'pending',
      paymentUrl,
    });

    return {
      message,
      paymentInfo: {
        transactionId: newPayment.transactionId,
        amount: newPayment.amount,
        method: newPayment.method,
        ...responsePayload,
      }
    };
  }
  
  private verifyWebhookSignature(rawBody: string, signature: string): boolean {
    logger.warn('Webhook signature validation is currently simulated. Returning true.');
    return true;
  }

  /**
   * Menangani notifikasi webhook dari (simulasi) payment gateway.
   */
  public async handleWebhook(payload: any, signature: string) {
    const isSignatureValid = this.verifyWebhookSignature(JSON.stringify(payload), signature);
    if (!isSignatureValid) {
        throw new HttpException(StatusCodes.UNAUTHORIZED, 'Invalid webhook signature');
    }

    const { transaction_id, transaction_status } = payload;
    
    const transaction = await sequelize.transaction();
    try {
      const payment = await Payment.findOne({ where: { transactionId: transaction_id }, transaction });
      if (!payment) {
        throw new Error('Transaction not found');
      }

      if (payment.status !== 'pending') {
        logger.warn(`Webhook for transaction ${transaction_id} already processed.`);
        return { message: 'Webhook already processed' };
      }

      const order = await Order.findByPk(payment.orderId, { transaction });
      if (!order) {
        throw new Error(`Order with ID ${payment.orderId} not found`);
      }
      
      // FIX: Logika diperbaiki untuk menangani semua status kegagalan
      if (transaction_status === 'capture' || transaction_status === 'settlement') {
        payment.status = 'success';
        order.status = 'processing';
      } else if (['cancel', 'expire', 'deny'].includes(transaction_status)) {
        payment.status = 'failed';
        order.status = 'cancelled';
      }

      await payment.save({ transaction });
      await order.save({ transaction });
      
      await transaction.commit();
      logger.info(`Webhook success: Transaction ${transaction_id} updated to ${payment.status}.`);
      
      return { message: 'Webhook processed successfully' };

    } catch (error) {
      await transaction.rollback();
      logger.error('Error processing webhook:', error);
      throw error;
    }
  }
}

export default new PaymentService();