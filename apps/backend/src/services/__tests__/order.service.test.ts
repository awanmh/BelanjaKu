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
        User: {}, // Tambahkan mock User untuk relasi
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
    const sellerId = 'seller-uuid';
    const mockProductData = { id: 'prod-uuid-1', name: 'Test Product 1', price: 100000, stock: 10, save: jest.fn() };
    const mockProduct2Data = { id: 'prod-uuid-2', name: 'Test Product 2', price: 200000, stock: 5, save: jest.fn() };

    describe('createOrder', () => {
        // ... tes createOrder yang sudah ada ...
        const orderData = {
            shippingAddress: '123 Test St',
            items: [{ productId: mockProductData.id, quantity: 2 }],
        };

        it('should create an order successfully', async () => {
            mockProduct.findByPk.mockResolvedValue(mockProductData as any);
            mockOrder.create.mockResolvedValue({ id: 'order-uuid' } as any);
            mockOrder.findByPk.mockResolvedValue({} as any); // Mock untuk panggilan terakhir

            await OrderService.createOrder(orderData, userId);

            expect(mockProduct.findByPk).toHaveBeenCalledWith(orderData.items[0].productId, expect.any(Object));
            expect(mockProductData.save).toHaveBeenCalled();
            expect(mockOrder.create).toHaveBeenCalled();
            expect(mockOrderItem.bulkCreate).toHaveBeenCalled();
        });
        
        it('should apply a valid promotion code', async () => {
            const promoData = { ...orderData, promotionCode: 'HEMAT50' };
            const mockPromo = { id: 'promo-uuid', productId: mockProductData.id, discountPercentage: 50 };
            
            mockProduct.findByPk.mockResolvedValue(mockProductData as any);
            mockPromotion.findOne.mockResolvedValue(mockPromo as any);
            mockOrder.create.mockResolvedValue({ id: 'order-uuid' } as any);
            mockOrder.findByPk.mockResolvedValue({} as any);

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
        // ... tes createOrder lainnya ...
    });

    // --- Tes Baru untuk Metode yang Belum Tercakup ---

    describe('getOrdersByUser', () => {
        it('should return orders for a specific user', async () => {
            mockOrder.findAll.mockResolvedValue([{ id: 'order-1' }, { id: 'order-2' }] as any);
            const result = await OrderService.getOrdersByUser(userId);
            expect(mockOrder.findAll).toHaveBeenCalledWith(expect.objectContaining({ where: { userId } }));
            expect(result.length).toBe(2);
        });
    });

    describe('getOrderById', () => {
        it('should return a single order for a specific user', async () => {
            mockOrder.findOne.mockResolvedValue({ id: 'order-1', userId } as any);
            const result = await OrderService.getOrderById('order-1', userId);
            expect(mockOrder.findOne).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 'order-1', userId } }));
            expect(result).toBeDefined();
        });

        it('should throw NOT_FOUND if order not found or user mismatch', async () => {
            mockOrder.findOne.mockResolvedValue(null);
            await expect(OrderService.getOrderById('order-2', userId)).rejects.toThrow(
                new HttpException(StatusCodes.NOT_FOUND, 'Order not found or you do not have permission to view it')
            );
        });
    });

    describe('getOrdersForSeller', () => {
        it('should return orders containing seller products', async () => {
            mockOrder.findAll.mockResolvedValue([{ id: 'order-1' }] as any);
            const result = await OrderService.getOrdersForSeller(sellerId);
            expect(mockOrder.findAll).toHaveBeenCalledWith(expect.objectContaining({
                include: expect.arrayContaining([
                    expect.objectContaining({
                        include: expect.arrayContaining([
                            expect.objectContaining({ where: { sellerId } })
                        ])
                    })
                ])
            }));
            expect(result.length).toBe(1);
        });
    });

    describe('updateOrderStatusBySeller', () => {
        const mockOrderWithItems = {
            id: 'order-1',
            status: 'processing',
            items: [
                { product: { sellerId: sellerId } },
            ],
            save: jest.fn(),
        };

        it('should update order status successfully', async () => {
            mockOrder.findByPk.mockResolvedValue(mockOrderWithItems as any);
            await OrderService.updateOrderStatusBySeller('order-1', sellerId, 'shipped');
            expect(mockOrder.findByPk).toHaveBeenCalledWith('order-1', expect.any(Object));
            expect(mockOrderWithItems.save).toHaveBeenCalled();
            expect(mockOrderWithItems.status).toBe('shipped');
        });

        it('should throw FORBIDDEN if seller does not own any item in the order', async () => {
            const otherSellerOrder = {
                ...mockOrderWithItems,
                items: [{ product: { sellerId: 'other-seller-uuid' } }],
            };
            mockOrder.findByPk.mockResolvedValue(otherSellerOrder as any);
            await expect(OrderService.updateOrderStatusBySeller('order-1', sellerId, 'shipped')).rejects.toThrow(
                new HttpException(StatusCodes.FORBIDDEN, 'You are not authorized to update this order')
            );
        });

        it('should throw BAD_REQUEST for invalid status transition', async () => {
            const pendingOrder = { ...mockOrderWithItems, status: 'pending' };
            mockOrder.findByPk.mockResolvedValue(pendingOrder as any);
            await expect(OrderService.updateOrderStatusBySeller('order-1', sellerId, 'shipped')).rejects.toThrow(
                new HttpException(StatusCodes.BAD_REQUEST, 'Order must be processed before it can be shipped')
            );
        });
    });
});