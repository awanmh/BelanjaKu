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

    // CUSTOM LOGIC: Handle filtering by Category Name (e.g. ?category=Wanita)
    // APIFeatures maps query params to WHERE directly. If 'category' is passed but not a column, 
    // we need to resolve it to categoryId.
    if (queryString.category) {
       const categoryName = queryString.category as string;
       // Find category by name (case insensitive usually good, but exact for now)
       const category = await db.Category.findOne({ 
         where: { 
            name: db.Sequelize.where(
               db.Sequelize.fn('LOWER', db.Sequelize.col('name')), 
               'LIKE', 
               '%' + categoryName.toLowerCase() + '%'
            ) 
         } as any 
       });

       if (category) {
         // Apply categoryId filter
         if (!features.queryOptions.where) features.queryOptions.where = {};
         (features.queryOptions.where as any).categoryId = category.id;
         
         // Remove the invalid 'category' field from WHERE clause if APIFeatures accidentally added it
         // (APIFeatures puts everything from qs into where, so 'category' might be invalid column)
         if ((features.queryOptions.where as any).category) {
            delete (features.queryOptions.where as any).category;
         }
       }
    }

    // Clean up invalid fields from WHERE clause (pagination params that got added by APIFeatures)
    if (features.queryOptions.where) {
      const invalidFields = ['limit', 'offset', 'page', 'sort', 'fields'];
      invalidFields.forEach(field => {
        if ((features.queryOptions.where as any)[field]) {
          delete (features.queryOptions.where as any)[field];
        }
      });
    }

    // 2. Tambahkan include untuk relasi penjual (seller) DAN Category
    features.queryOptions.include = [
      { model: User, as: 'seller', attributes: ['id', 'fullName'] },
      { model: db.Category, as: 'category' }
    ];

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

  public async getProductById(id: string): Promise<ProductAttributes> {
    const product = await Product.findByPk(id, {
      include: [
        { model: User, as: 'seller', attributes: ['id', 'fullName'] },
        { model: db.Category, as: 'category' }
      ],
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