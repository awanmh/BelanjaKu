import OrderService from '../order.service';
import db from '../../database/models';
import HttpException from '../../utils/http-exception.util';
import { StatusCodes } from 'http-status-codes';

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
        Order: { create: jest.fn(), findAll: jest.fn(), findOne: jest.fn(), findByPk: jest.fn() },
        OrderItem: { bulkCreate: jest.fn() },
        Product: { findByPk: jest.fn() },
        Promotion: { findOne: jest.fn() },
    };
});

const mockProduct = db.Product as jest.Mocked<typeof db.Product>;
const mockOrder = db.Order as jest.Mocked<typeof db.Order>;
const mockOrderItem = db.OrderItem as jest.Mocked<typeof db.OrderItem>;
const mockPromotion = db.Promotion as jest.Mocked<typeof db.Promotion>;

describe('OrderService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const userId = 'user-uuid';
    const mockProductData = { id: 'prod-uuid-1', name: 'Test Product 1', price: 100000, stock: 10, save: jest.fn() };
    const mockProduct2Data = { id: 'prod-uuid-2', name: 'Test Product 2', price: 200000, stock: 5, save: jest.fn() };

    describe('createOrder', () => {
        const orderData = {
            shippingAddress: '123 Test St',
            items: [{ productId: mockProductData.id, quantity: 2 }],
        };

        it('should create an order successfully', async () => {
            mockProduct.findByPk.mockResolvedValue(mockProductData as any);
            mockOrder.create.mockResolvedValue({ id: 'order-uuid' } as any);

            await OrderService.createOrder(orderData, userId);

            expect(mockProduct.findByPk).toHaveBeenCalledWith(orderData.items[0].productId, expect.any(Object));
            expect(mockProductData.save).toHaveBeenCalled();
            expect(mockOrder.create).toHaveBeenCalled();
            expect(mockOrderItem.bulkCreate).toHaveBeenCalled();
        });

        it('should throw NOT_FOUND if a product does not exist', async () => {
            mockProduct.findByPk.mockResolvedValue(null);
            await expect(OrderService.createOrder(orderData, userId)).rejects.toThrow(HttpException);
        });

        it('should throw BAD_REQUEST if stock is insufficient', async () => {
            const lowStockProduct = { ...mockProductData, stock: 1 };
            mockProduct.findByPk.mockResolvedValue(lowStockProduct as any);
            await expect(OrderService.createOrder(orderData, userId)).rejects.toThrow(HttpException);
        });

        // --- Tes Baru untuk Logika Promosi ---
        it('should apply a valid promotion code', async () => {
            const promoData = {
                ...orderData,
                promotionCode: 'HEMAT50',
            };
            const mockPromo = { id: 'promo-uuid', productId: mockProductData.id, discountPercentage: 50 };
            
            mockProduct.findByPk.mockResolvedValue(mockProductData as any);
            mockPromotion.findOne.mockResolvedValue(mockPromo as any);
            mockOrder.create.mockResolvedValue({ id: 'order-uuid' } as any);

            await OrderService.createOrder(promoData, userId);

            expect(mockPromotion.findOne).toHaveBeenCalledWith(expect.any(Object));
            expect(mockOrder.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    discountAmount: 100000, // 50% of (100000 * 2)
                    totalAmount: 100000,
                    promotionId: mockPromo.id,
                }),
                expect.any(Object)
            );
        });

        it('should throw BAD_REQUEST for an invalid promotion code', async () => {
            const promoData = { ...orderData, promotionCode: 'INVALID' };
            mockProduct.findByPk.mockResolvedValue(mockProductData as any);
            mockPromotion.findOne.mockResolvedValue(null); // Promo tidak ditemukan

            await expect(OrderService.createOrder(promoData, userId)).rejects.toThrow(
                new HttpException(StatusCodes.BAD_REQUEST, 'Invalid or expired promotion code')
            );
        });

        it('should throw BAD_REQUEST if promotion code is not applicable to cart items', async () => {
            const promoData = {
                ...orderData,
                items: [{ productId: mockProduct2Data.id, quantity: 1 }], // Produk lain
                promotionCode: 'HEMAT50',
            };
            const mockPromo = { id: 'promo-uuid', productId: mockProductData.id, discountPercentage: 50 };
            
            mockProduct.findByPk.mockResolvedValue(mockProduct2Data as any); // Mock produk di keranjang
            mockPromotion.findOne.mockResolvedValue(mockPromo as any);

            await expect(OrderService.createOrder(promoData, userId)).rejects.toThrow(
                new HttpException(StatusCodes.BAD_REQUEST, 'This promotion code is not valid for the items in your cart.')
            );
        });
    });
});