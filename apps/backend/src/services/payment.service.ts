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
 * Kode ini telah disempurnakan untuk menunjukkan di mana integrasi nyata akan dilakukan.
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

    // --- DI SINI TEMPAT INTEGRASI DENGAN PAYMENT GATEWAY ---
    // 1. Siapkan payload sesuai dokumentasi payment gateway (e.g., Midtrans)
    const gatewayPayload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: order.totalAmount,
      },
      payment_type: method,
      // ... detail lain seperti customer_details, item_details, dll.
    };

    // 2. (SIMULASI) Kirim request ke API payment gateway
    // const gatewayResponse = await axios.post('https://api.midtrans.com/v2/charge', gatewayPayload, { auth: { username: 'YOUR_SERVER_KEY', password: '' } });
    
    // 3. (SIMULASI) Tangkap respons dari payment gateway
    const simulatedGatewayResponse = {
      transaction_id: transactionId,
      status_code: '201',
      redirect_url: `https://app.sandbox.midtrans.com/snap/v3/redirection/${transactionId}`, // Contoh URL redirect
      virtual_account_number: '1234567890', // Contoh jika bank transfer
    };
    // --- AKHIR BAGIAN INTEGRASI ---

    // Buat catatan transaksi di database kita berdasarkan respons gateway
    const newPayment = await Payment.create({
      orderId,
      transactionId: simulatedGatewayResponse.transaction_id,
      paymentGateway: 'simulation-midtrans',
      amount: order.totalAmount,
      method,
      status: 'pending',
      paymentUrl: simulatedGatewayResponse.redirect_url,
    });

    // Kembalikan informasi yang relevan ke frontend
    return {
      message: 'Payment initiated. Please complete the payment.',
      paymentInfo: {
        transactionId: newPayment.transactionId,
        amount: newPayment.amount,
        method: newPayment.method,
        paymentUrl: newPayment.paymentUrl, // Kirim URL ini ke frontend
        virtualAccount: simulatedGatewayResponse.virtual_account_number, // Kirim info VA jika ada
      }
    };
  }

  /**
   * Memvalidasi signature dari webhook (simulasi).
   * @param rawBody Body mentah dari request.
   * @param signature Signature dari header.
   * @returns boolean
   */
  private verifyWebhookSignature(rawBody: string, signature: string): boolean {
    // --- DI SINI TEMPAT VALIDASI SIGNATURE DARI PAYMENT GATEWAY ---
    // Setiap payment gateway punya cara validasi sendiri, biasanya menggunakan HMAC-SHA512.
    // Contoh logikanya:
    // const secretKey = process.env.PAYMENT_GATEWAY_SECRET_KEY;
    // const hash = crypto.createHmac('sha512', secretKey).update(rawBody).digest('hex');
    // return hash === signature;
    // --- AKHIR BAGIAN VALIDASI ---
    
    logger.warn('Webhook signature validation is currently simulated. Returning true.');
    return true; // Untuk sekarang, kita selalu anggap valid
  }

  /**
   * Menangani notifikasi webhook dari (simulasi) payment gateway.
   */
  public async handleWebhook(payload: any, signature: string) {
    // Validasi signature (placeholder)
    // Di dunia nyata, Anda butuh raw body dari request, bukan JSON yang sudah di-parse.
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
      
      // Update status berdasarkan status dari webhook
      if (transaction_status === 'capture' || transaction_status === 'settlement') {
        payment.status = 'success';
        order.status = 'processing';
      } else if (transaction_status === 'cancel' || transaction_status === 'expire' || transaction_status === 'deny') {
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