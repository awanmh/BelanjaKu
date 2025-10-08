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
 * DI DUNIA NYATA: Kode ini akan berisi panggilan API ke Midtrans, Xendit, dll.
 */
class PaymentService {
  /**
   * Mensimulasikan pembuatan transaksi di payment gateway.
   * @param orderId ID pesanan yang akan dibayar.
   * @param method Metode pembayaran yang dipilih.
   * @returns Informasi pembayaran untuk ditampilkan ke pengguna.
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
    let paymentUrl = `https://example.com/pay/${transactionId}`;
    let message = `Please complete your payment here: ${paymentUrl}`;
    
    // Simulasi respons yang berbeda untuk tiap metode
    if (method === 'bank_transfer') {
      message = `Please transfer to Virtual Account 123456789 with amount ${order.totalAmount}`;
      paymentUrl = 'about:blank';
    } else if (method === 'cod') {
        message = 'Your order will be processed as Cash On Delivery. Please prepare cash upon arrival.';
        paymentUrl = 'about:blank';
    }

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

    // DI DUNIA NYATA: Kirim request ke payment gateway di sini.

    return {
      message,
      transactionId: newPayment.transactionId,
      amount: newPayment.amount,
      method: newPayment.method,
    };
  }

  /**
   * Menangani notifikasi webhook dari (simulasi) payment gateway.
   * @param payload Data notifikasi dari payment gateway.
   * @returns Hasil pembaruan.
   */
  public async handleWebhook(payload: { transactionId: string; status: 'success' | 'failed' }) {
    const { transactionId, status } = payload;
    
    const transaction = await sequelize.transaction();
    try {
      const payment = await Payment.findOne({ where: { transactionId }, transaction });
      if (!payment) {
        throw new Error('Transaction not found'); // Dilempar untuk di-log, bukan ke klien
      }

      // Hindari memproses webhook yang sama dua kali
      if (payment.status !== 'pending') {
        logger.warn(`Webhook for transaction ${transactionId} already processed.`);
        return { message: 'Webhook already processed' };
      }

      const order = await Order.findByPk(payment.orderId, { transaction });
      if (!order) {
        throw new Error(`Order with ID ${payment.orderId} not found`);
      }
      
      // Update status pembayaran dan pesanan
      if (status === 'success') {
        payment.status = 'success';
        order.status = 'processing'; // Atau 'completed' jika barang digital
      } else {
        payment.status = 'failed';
        order.status = 'cancelled'; // Atau biarkan 'pending'
      }

      await payment.save({ transaction });
      await order.save({ transaction });
      
      await transaction.commit();
      logger.info(`Webhook success: Transaction ${transactionId} updated to ${status}.`);
      
      return { message: 'Webhook processed successfully' };

    } catch (error) {
      await transaction.rollback();
      logger.error('Error processing webhook:', error);
      throw error;
    }
  }
}

export default new PaymentService();
