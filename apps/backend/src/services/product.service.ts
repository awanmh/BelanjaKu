import { StatusCodes } from 'http-status-codes';
import db from '../database/models';
import { ProductAttributes } from '../database/models/product.model';
import HttpException from '../utils/http-exception.util';
import APIFeatures from '../utils/apiFeatures.util';
import { ParsedQs } from 'qs';
import { Model } from 'sequelize';

// Mengambil model dari objek db
const Product = db.Product;
const User = db.User;

// Tipe data untuk input pembuatan produk, sekarang termasuk imageUrl
export type CreateProductInput = Pick<ProductAttributes, 'name' | 'description' | 'price' | 'stock' | 'categoryId' | 'imageUrl'>;

// Tipe data untuk input pembaruan produk
export type UpdateProductInput = Partial<CreateProductInput>;

/**
 * Service untuk menangani semua logika bisnis yang terkait dengan produk.
 */
class ProductService {
  /**
   * Membuat produk baru.
   * @param productData Data untuk produk baru.
   * @param sellerId ID pengguna (penjual) yang membuat produk.
   * @returns Produk yang baru dibuat.
   */
  public async createProduct(productData: CreateProductInput, sellerId: string): Promise<ProductAttributes> {
    const newProduct = await Product.create({
      ...productData,
      sellerId,
    });
    return newProduct.toJSON();
  }

  /**
   * Mengambil semua produk dari database dengan fitur query lanjutan.
   * @param queryString Query string dari URL request.
   * @returns Array berisi semua produk beserta data penjualnya.
   */
  public async getAllProducts(queryString: ParsedQs): Promise<ProductAttributes[]> {
    // FIX: Lakukan type casting pada model 'Product' untuk mengatasi masalah tipe kompleks
    const features = new APIFeatures(Product as any, queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Tambahkan include untuk data penjual secara manual ke queryOptions
    features.queryOptions.include = [{ model: User, as: 'seller', attributes: ['id', 'fullName'] }];

    // Eksekusi query yang sudah dibangun
    const products = await Product.findAll(features.queryOptions);
    
    return products.map((product) => product.toJSON());
  }

  /**
   * Mengambil satu produk berdasarkan ID.
   * @param productId ID produk.
   * @returns Objek produk.
   */
  public async getProductById(productId: string): Promise<ProductAttributes> {
    const product = await Product.findByPk(productId, {
      include: [{ model: User, as: 'seller', attributes: ['id', 'fullName'] }],
    });
    if (!product) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Product not found');
    }
    return product.toJSON();
  }

  /**
   * Memperbarui produk berdasarkan ID.
   * Memastikan hanya penjual asli yang dapat memperbarui produknya.
   * @param productId ID produk.
   * @param productData Data pembaruan.
   * @param userId ID pengguna yang mencoba memperbarui.
   * @returns Produk yang sudah diperbarui.
   */
  public async updateProduct(productId: string, productData: UpdateProductInput, userId: string): Promise<ProductAttributes> {
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Product not found');
    }
    if (product.sellerId !== userId) {
      throw new HttpException(StatusCodes.FORBIDDEN, 'You are not authorized to update this product');
    }

    await product.update(productData);
    return product.toJSON();
  }

  /**
   * Menghapus produk berdasarkan ID.
   * Memastikan hanya penjual asli yang dapat menghapus produknya.
   * @param productId ID produk.
   * @param userId ID pengguna yang mencoba menghapus.
   */
  public async deleteProduct(productId: string, userId: string): Promise<void> {
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Product not found');
    }
    if (product.sellerId !== userId) {
      throw new HttpException(StatusCodes.FORBIDDEN, 'You are not authorized to delete this product');
    }
    await product.destroy();
  }
}

// Ekspor sebagai singleton instance
export default new ProductService();

