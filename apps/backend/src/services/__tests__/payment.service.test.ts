import PaymentService from '../payment.service';
import db from '../../database/models';
import HttpException from '../../utils/http-exception.util';
import { StatusCodes } from 'http-status-codes';
import logger from '../../utils/logger.util';

// Mock dependensi eksternal
jest.mock('../../database/models', () => {
    const mockSequelize = {
        transaction: jest.fn(() => ({
            commit: jest.fn(),
            rollback: jest.fn(),
        })),
    };
    return {
        sequelize: mockSequelize,
        Order: { findOne: jest.fn(), findByPk: jest.fn() },
        Payment: { create: jest.fn(), findOne: jest.fn() },
    };
});
jest.mock('../../utils/logger.util'); // Mock logger

const mockOrder = db.Order as jest.Mocked<typeof db.Order>;
const mockPayment = db.Payment as jest.Mocked<typeof db.Payment>;

describe('PaymentService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const orderId = 'order-uuid';
    const userId = 'user-uuid';
    const mockOrderInstance = {
        id: orderId,
        userId,
        status: 'pending',
        totalAmount: 150000,
        save: jest.fn(),
    };
    let mockPaymentInstance: {
        id: string;
        orderId: string;
        status: string;
        transactionId: string;
        save: jest.Mock;
    };

    describe('createPayment', () => {
        beforeEach(() => {
            mockPaymentInstance = { id: 'payment-uuid', orderId, status: 'pending', transactionId: 'TRX-12345', save: jest.fn() };
            mockOrderInstance.status = 'pending';
        });

        it('should create a COD payment and return correct message', async () => {
            mockOrder.findOne.mockResolvedValue(mockOrderInstance as any);
            mockPayment.create.mockResolvedValue(mockPaymentInstance as any);
            const result = await PaymentService.createPayment(orderId, userId, 'cod');
            expect(mockOrder.findOne).toHaveBeenCalledWith({ where: { id: orderId, userId } });
            expect(mockPayment.create).toHaveBeenCalled();
            expect(result.message).toContain('Your order will be processed as Cash On Delivery');
        });

        it('should create a bank transfer payment and return VA', async () => {
            mockOrder.findOne.mockResolvedValue(mockOrderInstance as any);
            mockPayment.create.mockResolvedValue(mockPaymentInstance as any);
            const result = await PaymentService.createPayment(orderId, userId, 'bank_transfer');
            expect(result.message).toContain('Please transfer to Virtual Account');
            expect(result.paymentInfo).toHaveProperty('virtualAccount');
        });

        it('should create a standard payment and return paymentUrl', async () => {
            mockOrder.findOne.mockResolvedValue(mockOrderInstance as any);
            mockPayment.create.mockResolvedValue(mockPaymentInstance as any);
            const result = await PaymentService.createPayment(orderId, userId, 'credit_card');
            expect(result.message).toContain('Payment initiated');
            expect(result.paymentInfo).toHaveProperty('paymentUrl');
        });

        it('should throw NOT_FOUND if order does not exist', async () => {
            mockOrder.findOne.mockResolvedValue(null);
            await expect(PaymentService.createPayment(orderId, userId, 'cod')).rejects.toThrow(
                new HttpException(StatusCodes.NOT_FOUND, 'Order not found')
            );
        });

        it('should throw BAD_REQUEST if order is not pending', async () => {
            mockOrder.findOne.mockResolvedValue({ ...mockOrderInstance, status: 'completed' } as any);
            await expect(PaymentService.createPayment(orderId, userId, 'cod')).rejects.toThrow(
                new HttpException(StatusCodes.BAD_REQUEST, 'This order cannot be paid for')
            );
        });
    });

    describe('handleWebhook', () => {
        beforeEach(() => {
            mockPaymentInstance = { id: 'payment-uuid', orderId, status: 'pending', transactionId: 'TRX-12345', save: jest.fn() };
            mockOrderInstance.status = 'pending';
        });

        it('should update order and payment status on successful webhook', async () => {
            mockPayment.findOne.mockResolvedValue(mockPaymentInstance as any);
            mockOrder.findByPk.mockResolvedValue(mockOrderInstance as any);

            const payload = { transaction_id: 'TRX-12345', transaction_status: 'settlement' };
            await PaymentService.handleWebhook(payload, 'dummy-signature');

            expect(mockPayment.findOne).toHaveBeenCalled();
            expect(mockOrder.findByPk).toHaveBeenCalled();
            expect(mockPaymentInstance.save).toHaveBeenCalled();
            expect(mockOrderInstance.save).toHaveBeenCalled();
            expect(mockPaymentInstance.status).toBe('success');
            expect(mockOrderInstance.status).toBe('processing');
        });

        it('should handle failed webhook status', async () => {
            mockPayment.findOne.mockResolvedValue(mockPaymentInstance as any);
            mockOrder.findByPk.mockResolvedValue(mockOrderInstance as any);

            const payload = { transaction_id: 'TRX-12345', transaction_status: 'expire' };
            await PaymentService.handleWebhook(payload, 'dummy-signature');
            
            expect(mockPaymentInstance.status).toBe('failed');
            expect(mockOrderInstance.status).toBe('cancelled');
        });

        it('should throw an error if transaction is not found', async () => {
            mockPayment.findOne.mockResolvedValue(null);
            const payload = { transaction_id: 'TRX-NONEXISTENT', transaction_status: 'settlement' };
            await expect(PaymentService.handleWebhook(payload, 'dummy-signature')).rejects.toThrow('Transaction not found');
        });

        it('should do nothing if payment is already processed', async () => {
            const processedPayment = { ...mockPaymentInstance, status: 'success' };
            mockPayment.findOne.mockResolvedValue(processedPayment as any);
            
            await PaymentService.handleWebhook({ transaction_id: 'TRX-12345', transaction_status: 'settlement' } as any, 'dummy-signature');
            expect(logger.warn).toHaveBeenCalled();
            expect(processedPayment.save).not.toHaveBeenCalled();
        });

        it('should throw error if order is not found during webhook processing', async () => {
            mockPayment.findOne.mockResolvedValue(mockPaymentInstance as any);
            mockOrder.findByPk.mockResolvedValue(null); // Order tidak ditemukan

            const payload = { transaction_id: 'TRX-12345', transaction_status: 'settlement' };
            await expect(PaymentService.handleWebhook(payload, 'dummy-signature')).rejects.toThrow(
                `Order with ID ${mockPaymentInstance.orderId} not found`
            );
        });
    });
});

