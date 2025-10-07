import db from '../database/models';
import { ProductAttributes } from '../database/models/product.model';
import HttpException from '../utils/http-exception.util';
import { StatusCodes } from 'http-status-codes';

// Mengambil model dari objek db
const Product = db.Product;
const User = db.User;

// Tipe data untuk input saat membuat produk baru
// sellerId akan diambil dari token JWT, bukan dari input user
export type CreateProductInput = Omit<ProductAttributes, 'id' | 'sellerId' | 'createdAt' | 'updatedAt'>;

// Tipe data untuk input saat memperbarui produk (semua opsional)
export type UpdateProductInput = Partial<CreateProductInput>;

/**
 * Service untuk menangani semua logika bisnis yang terkait dengan produk.
 */
class ProductService {
  /**
   * Membuat produk baru.
   * @param productData Data produk yang akan dibuat.
   * @param sellerId ID dari pengguna (penjual) yang membuat produk.
   * @returns Produk yang baru dibuat.
   */
  public async createProduct(productData: CreateProductInput, sellerId: string): Promise<ProductAttributes> {
    // Cek apakah penjual ada
    const seller = await User.findByPk(sellerId);
    if (!seller) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Seller not found');
    }

    // Gabungkan data produk dengan sellerId
    const fullProductData = { ...productData, sellerId };

    const newProduct = await Product.create(fullProductData);
    return newProduct.toJSON();
  }

  /**
   * Mengambil semua produk dengan paginasi.
   * @returns Daftar produk.
   */
  public async getAllProducts() {
    // Di sini nanti bisa ditambahkan logika untuk paginasi, filter, dan sorting
    const products = await Product.findAll({
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'fullName', 'email'], // Hanya ambil data seller yang relevan
        },
      ],
    });
    return products;
  }

  /**
   * Mengambil satu produk berdasarkan ID.
   * @param productId ID produk yang akan dicari.
   * @returns Detail produk atau null jika tidak ditemukan.
   */
  public async getProductById(productId: string): Promise<ProductAttributes | null> {
    const product = await Product.findByPk(productId, {
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'fullName', 'email'],
        },
      ],
    });

    if (!product) {
        throw new HttpException(StatusCodes.NOT_FOUND, 'Product not found');
    }
    
    return product.toJSON();
  }

  /**
   * Memperbarui produk.
   * @param productId ID produk yang akan diperbarui.
   * @param productData Data baru untuk produk.
   * @param userId ID pengguna yang melakukan pembaruan (untuk verifikasi kepemilikan).
   * @returns Produk yang sudah diperbarui.
   */
  public async updateProduct(productId: string, productData: UpdateProductInput, userId: string): Promise<ProductAttributes> {
    const product = await Product.findByPk(productId);

    if (!product) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Product not found');
    }

    // Verifikasi bahwa pengguna adalah pemilik produk
    if (product.sellerId !== userId) {
        throw new HttpException(StatusCodes.FORBIDDEN, 'You are not authorized to update this product');
    }

    const updatedProduct = await product.update(productData);
    return updatedProduct.toJSON();
  }

  /**
   * Menghapus produk.
   * @param productId ID produk yang akan dihapus.
   * @param userId ID pengguna yang melakukan penghapusan (untuk verifikasi kepemilikan).
   */
  public async deleteProduct(productId: string, userId: string): Promise<void> {
    const product = await Product.findByPk(productId);

    if (!product) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Product not found');
    }

    // Verifikasi bahwa pengguna adalah pemilik produk
    if (product.sellerId !== userId) {
        throw new HttpException(StatusCodes.FORBIDDEN, 'You are not authorized to delete this product');
    }

    await product.destroy();
  }
}

export default new ProductService();
