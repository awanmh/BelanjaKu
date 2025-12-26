// backend/src/services/__tests__/cart.service.test.ts
import * as cartService from '../cart.service';
import db from '../../database/models';
import HttpException from '../../utils/http-exception.util';

// 1. Mock Database Models
// Kita memberitahu Jest untuk memalsukan semua panggilan ke db.CartItem dan db.Product
jest.mock('../../database/models', () => {
    return {
        CartItem: {
            findOne: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn(),
            destroy: jest.fn(),
            save: jest.fn(), // Instance method mockup
        },
        Product: {
            findByPk: jest.fn(),
        },
    };
});

describe('Cart Service', () => {
    const mockUserId = 'user-123';
    const mockProductId = 'product-abc';

    // Reset semua mock sebelum setiap test case agar bersih
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('addToCart', () => {
        it('should add new item to cart successfully if product exists and stock is sufficient', async () => {
            // ARRANGE (Persiapan Data Palsu)
            // Pura-pura Product ditemukan dengan stok 10
            (db.Product.findByPk as jest.Mock).mockResolvedValue({
                id: mockProductId,
                stock: 10,
                price: 10000,
            });

            // Pura-pura item belum ada di keranjang (return null)
            (db.CartItem.findOne as jest.Mock).mockResolvedValue(null);

            // Pura-pura create berhasil dan mengembalikan data
            const mockNewItem = { userId: mockUserId, productId: mockProductId, quantity: 2 };
            (db.CartItem.create as jest.Mock).mockResolvedValue(mockNewItem);

            // ACT (Jalankan Fungsi)
            const result = await cartService.addToCart(mockUserId, mockProductId, 2);

            // ASSERT (Periksa Hasil)
            expect(db.Product.findByPk).toHaveBeenCalledWith(mockProductId);
            expect(db.CartItem.findOne).toHaveBeenCalledWith({ where: { userId: mockUserId, productId: mockProductId } });
            expect(db.CartItem.create).toHaveBeenCalledWith({
                userId: mockUserId,
                productId: mockProductId,
                quantity: 2,
            });
            expect(result).toEqual(mockNewItem);
        });

        it('should throw error if product not found', async () => {
            // ARRANGE
            (db.Product.findByPk as jest.Mock).mockResolvedValue(null); // Product tidak ada

            // ACT & ASSERT
            await expect(cartService.addToCart(mockUserId, mockProductId, 1))
                .rejects
                .toThrow(new HttpException(404, 'Product not found'));
        });

        it('should throw error if stock is insufficient', async () => {
            // ARRANGE
            (db.Product.findByPk as jest.Mock).mockResolvedValue({
                id: mockProductId,
                stock: 5, // Stok cuma 5
            });

            // User minta 10
            // Item belum ada di cart
            (db.CartItem.findOne as jest.Mock).mockResolvedValue(null);

            // ACT & ASSERT
            await expect(cartService.addToCart(mockUserId, mockProductId, 10))
                .rejects
                .toThrow(/Insufficient stock/); // Cek sebagian pesan error
        });

        it('should update quantity if item already exists', async () => {
            // ARRANGE
            const mockProduct = { id: mockProductId, stock: 20 };
            (db.Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);

            // Item sudah ada di cart dengan quantity 2
            const mockExistingItem = {
                id: 'cart-item-1',
                quantity: 2,
                save: jest.fn(), // Mock method save()
            };
            (db.CartItem.findOne as jest.Mock).mockResolvedValue(mockExistingItem);

            // ACT: Nambah 3 lagi
            await cartService.addToCart(mockUserId, mockProductId, 3);

            // ASSERT
            // Quantity harus jadi 2 + 3 = 5
            expect(mockExistingItem.quantity).toBe(5);
            // Method .save() harus dipanggil
            expect(mockExistingItem.save).toHaveBeenCalled();
        });
    });
});