import { StatusCodes } from 'http-status-codes';
import db from '../database/models';
import { ProductAttributes } from '../database/models/product.model';
import HttpException from '../utils/http-exception.util';
import APIFeatures from '../utils/apiFeatures.util';
import { ParsedQs } from 'qs';

// Definisikan tipe untuk instance Product agar casting lebih bersih
type ProductInstance = InstanceType<typeof db.Product>;

// Mengambil model dari objek db dan menerapkan type casting yang benar
const Product = db.Product as (new () => ProductInstance) & typeof db.Product;
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
   */
  public async getAllProducts(queryString: ParsedQs): Promise<ProductAttributes[]> {
    const features = new APIFeatures(Product, queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    features.queryOptions.include = [{ model: User, as: 'seller', attributes: ['id', 'fullName'] }];

    const products = await Product.findAll(features.queryOptions);
    
    return products.map((product) => product.toJSON());
  }

  /**
   * Mengambil semua produk milik seorang penjual.
   * @param sellerId ID penjual.
   * @param queryString Query string dari URL request.
   * @returns Daftar produk milik penjual.
   */
  public async getProductsBySeller(sellerId: string, queryString: ParsedQs): Promise<ProductAttributes[]> {
    const features = new APIFeatures(Product, queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Pastikan filter utama adalah untuk sellerId
    features.queryOptions.where = { ...features.queryOptions.where, sellerId };

    const products = await Product.findAll(features.queryOptions);
    return products.map(p => p.toJSON());
  }

  /**
   * Mengambil satu produk berdasarkan ID.
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