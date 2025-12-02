import { StatusCodes } from 'http-status-codes';
import db from '../database/models';
import { ProductAttributes, Product as ProductModel } from '../database/models/product.model';
import HttpException from '../utils/http-exception.util';
import APIFeatures from '../utils/apiFeatures.util'; // 1. Impor APIFeatures
import { ParsedQs } from 'qs'; // Tipe untuk query string
import { Model, Op } from 'sequelize'; // 2. Impor Model untuk casting

// 3. FIX: Lakukan type casting eksplisit pada model
const Product = db.Product;
const User = db.User;

// Tipe data untuk input
export type CreateProductInput = Pick<
  ProductAttributes,
  'name' | 'description' | 'price' | 'stock' | 'imageUrl' | 'categoryId'
>;
export type UpdateProductInput = Partial<CreateProductInput>;

// Tipe data baru untuk respons paginasi
export interface PaginatedProductResult {
  rows: ProductAttributes[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

/**
 * Service untuk menangani semua logika bisnis yang terkait dengan produk.
 */
class ProductService {
  public async createProduct(productData: CreateProductInput, sellerId: string): Promise<ProductAttributes> {
    const newProduct = await Product.create({ ...productData, sellerId });
    return newProduct.toJSON();
  }

  /**
   * [DIPERBARUI] Mengambil semua produk dengan fitur query lanjutan.
   * @param queryString Query string dari URL request.
   * @returns Objek dengan daftar produk dan metadata paginasi.
   */
  public async getAllProducts(queryString: ParsedQs): Promise<PaginatedProductResult> {
    // 1. Buat query dasar
    const features = new APIFeatures(queryString)
      .filter()
      .sort()
      .limitFields();

    // 2. Tambahkan include untuk relasi penjual (seller)
    features.queryOptions.include = [{ model: User, as: 'seller', attributes: ['id', 'fullName'] }];

    // 3. Dapatkan nilai limit dan offset secara terpisah
    const { limit, offset } = features.paginate();
    const page = Math.floor(offset / limit) + 1;

    // 4. Gunakan findAndCountAll
    const { rows, count } = await Product.findAndCountAll({
      ...features.queryOptions,
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    return {
      rows: rows.map((product) => product.toJSON()),
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: page,
        limit,
      },
    };
  }

  /**
   * [DIPERBARUI] Mengambil produk milik penjual tertentu dengan fitur query.
   */
  public async getProductsBySeller(sellerId: string, queryString: ParsedQs): Promise<PaginatedProductResult> {
    const features = new APIFeatures(queryString)
      .filter()
      .sort()
      .limitFields();

    // Tambahkan filter wajib untuk sellerId
    if (features.queryOptions.where) {
      (features.queryOptions.where as any).sellerId = sellerId;
    } else {
      features.queryOptions.where = { sellerId };
    }

    const { limit, offset } = features.paginate();
    const page = Math.floor(offset / limit) + 1;

    const { rows, count } = await Product.findAndCountAll({
      ...features.queryOptions,
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    return {
      rows: rows.map((product) => product.toJSON()),
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: page,
        limit,
      },
    };
  }

  /**
   * Mengambil satu produk berdasarkan ID.
   */
  public async getProductById(id: string): Promise<ProductAttributes> {
    const product = await Product.findByPk(id, {
      include: [{ model: User, as: 'seller', attributes: ['id', 'fullName'] }],
    });

    if (!product) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Product not found');
    }
    return product.toJSON();
  }

  /**
   * Memperbarui produk.
   */
  public async updateProduct(id: string, productData: UpdateProductInput, userId: string): Promise<ProductAttributes> {
    const product = await Product.findByPk(id);
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
   * Menghapus (soft delete) produk.
   */
  public async deleteProduct(id: string, userId: string): Promise<void> {
    const product = await Product.findByPk(id);
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