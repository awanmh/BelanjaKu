import SellerService from '../seller.service';
import db from '../../database/models';
import ApiError from '../../utils/api-error.util';
import { StatusCodes } from 'http-status-codes';

// Mock dependensi eksternal
jest.mock('../../database/models', () => {
    const mockSequelize = {
        fn: jest.fn((fn, col) => `${fn}(${col})`),
        literal: jest.fn(val => val),
        col: jest.fn(col => col),
    };
    return {
        sequelize: mockSequelize,
        User: { findByPk: jest.fn() },
        Seller: { findOrCreate: jest.fn(), findOne: jest.fn() },
        OrderItem: { findAll: jest.fn(), count: jest.fn() }, // Tambahkan mock untuk 'count'
        Product: { findAll: jest.fn() },
    };
});

const mockUser = db.User as jest.Mocked<typeof db.User>;
const mockSeller = db.Seller as jest.Mocked<typeof db.Seller>;
const mockOrderItem = db.OrderItem as jest.Mocked<typeof db.OrderItem>;
const mockProduct = db.Product as jest.Mocked<typeof db.Product>;

describe('SellerService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const sellerId = 'seller-uuid';

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
                new ApiError(StatusCodes.FORBIDDEN, 'User is not a seller')
            );
        });
    });
    
    describe('getProfile', () => {
        it('should get a profile if it exists', async () => {
            const mockProfile = { storeName: 'My Store', toJSON: () => ({ storeName: 'My Store'})};
            mockSeller.findOne.mockResolvedValue(mockProfile as any);
            const result = await SellerService.getProfile(sellerId);
            expect(mockSeller.findOne).toHaveBeenCalledWith({ where: { userId: sellerId } });
            expect(result.storeName).toBe('My Store');
        });

        it('should throw NOT_FOUND if profile does not exist', async () => {
            mockSeller.findOne.mockResolvedValue(null);
            await expect(SellerService.getProfile(sellerId)).rejects.toThrow(
                new ApiError(StatusCodes.NOT_FOUND, 'Seller profile not found. Please create one.')
            );
        });
    });

    describe('getDashboardStats', () => {
        it('should return correct dashboard statistics', async () => {
            const mockSalesData = [{ totalRevenue: '500000', totalProductsSold: '5' }];
            
            // Perbarui mock agar sesuai dengan logika baru
            mockOrderItem.findAll.mockResolvedValue(mockSalesData as any);
            mockOrderItem.count.mockResolvedValue(2);

            const stats = await SellerService.getDashboardStats(sellerId);

            expect(mockOrderItem.findAll).toHaveBeenCalledTimes(1);
            expect(mockOrderItem.count).toHaveBeenCalledTimes(1);
            expect(stats).toEqual({
                totalRevenue: 500000,
                totalProductsSold: 5,
                totalOrders: 2,
            });
        });
    });

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
