import SellerService from '../seller.service';
import db from '../../database/models';
import HttpException from '../../utils/http-exception.util';
import { StatusCodes } from 'http-status-codes';

// Mock dependensi eksternal
jest.mock('../../database/models', () => {
    const mockSequelize = {
        fn: jest.fn(),
        literal: jest.fn(),
        col: jest.fn(),
    };
    return {
        sequelize: mockSequelize,
        User: { findByPk: jest.fn() },
        Seller: { findOrCreate: jest.fn(), findOne: jest.fn() },
        OrderItem: { findAll: jest.fn() },
        Product: { findAll: jest.fn() },
        Order: { count: jest.fn() },
    };
});

const mockUser = db.User as jest.Mocked<typeof db.User>;
const mockSeller = db.Seller as jest.Mocked<typeof db.Seller>;
const mockOrderItem = db.OrderItem as jest.Mocked<typeof db.OrderItem>;
const mockProduct = db.Product as jest.Mocked<typeof db.Product>;
const mockOrder = db.Order as jest.Mocked<typeof db.Order>;

describe('SellerService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const sellerId = 'seller-uuid';

    // --- Pengujian untuk Metode `upsertProfile` ---
    describe('upsertProfile', () => {
        it('should create a profile for a seller user', async () => {
            const profileData = { storeName: 'Toko Baru' };
            mockUser.findByPk.mockResolvedValue({ id: sellerId, role: 'seller' } as any);
            const mockProfile = { ...profileData, userId: sellerId, toJSON: () => ({...profileData, userId: sellerId}) };
            mockSeller.findOrCreate.mockResolvedValue([mockProfile, true] as any);

            const result = await SellerService.upsertProfile(sellerId, profileData as any);

            expect(mockUser.findByPk).toHaveBeenCalledWith(sellerId);
            expect(mockSeller.findOrCreate).toHaveBeenCalled();
            expect(result.storeName).toBe('Toko Baru');
        });

        it('should throw FORBIDDEN if user is not a seller', async () => {
            mockUser.findByPk.mockResolvedValue({ id: sellerId, role: 'user' } as any);

            await expect(SellerService.upsertProfile(sellerId, {} as any)).rejects.toThrow(
                new HttpException(StatusCodes.FORBIDDEN, 'User is not a seller')
            );
        });
    });

    // --- Pengujian untuk Metode `getDashboardStats` ---
    describe('getDashboardStats', () => {
        it('should return correct dashboard statistics', async () => {
            // Simulasikan hasil dari query agregasi
            const mockSalesData = [{ totalRevenue: '500000', totalProductsSold: '5' }];
            mockOrderItem.findAll.mockResolvedValue(mockSalesData as any);
            mockOrder.count.mockResolvedValue(2);

            const stats = await SellerService.getDashboardStats(sellerId);

            expect(mockOrderItem.findAll).toHaveBeenCalled();
            expect(mockOrder.count).toHaveBeenCalled();
            expect(stats).toEqual({
                totalRevenue: 500000,
                totalProductsSold: 5,
                totalOrders: 2,
            });
        });
    });

    // --- Pengujian untuk Metode `getLowStockProducts` ---
    describe('getLowStockProducts', () => {
        it('should return a list of products with low stock', async () => {
            const mockLowStockProducts = [
                { name: 'Product A', stock: 2, toJSON: () => ({ name: 'Product A', stock: 2 }) },
                { name: 'Product B', stock: 4, toJSON: () => ({ name: 'Product B', stock: 4 }) },
            ];
            mockProduct.findAll.mockResolvedValue(mockLowStockProducts as any);

            const result = await SellerService.getLowStockProducts(sellerId);

            expect(mockProduct.findAll).toHaveBeenCalled();
            expect(result.length).toBe(2);
            expect(result[0].name).toBe('Product A');
        });
    });
});
