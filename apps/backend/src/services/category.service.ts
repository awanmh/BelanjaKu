import { StatusCodes } from 'http-status-codes';
import db from '../database/models';
import { CategoryAttributes } from '../database/models/category.model';
import HttpException from '../utils/http-exception.util';
import APIFeatures from '../utils/apiFeatures.util';
import { ParsedQs } from 'qs';

// Mengambil model Category dari objek db yang sudah diinisialisasi
const Category = db.Category as (new () => InstanceType<typeof db.Category>) & typeof db.Category;

// Tipe data spesifik untuk input pembuatan kategori
export type CreateCategoryInput = Pick<CategoryAttributes, 'name'>;

// Tipe data spesifik untuk input pembaruan kategori
export type UpdateCategoryInput = Partial<CreateCategoryInput>;

// Tipe data baru untuk respons paginasi
export interface PaginatedCategoryResult {
  rows: CategoryAttributes[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

/**
 * Service untuk menangani semua logika bisnis yang terkait dengan kategori produk.
 */
class CategoryService {
  /**
   * Membuat kategori baru.
   */
  public async createCategory(categoryData: CreateCategoryInput): Promise<CategoryAttributes> {
    const { name } = categoryData;

    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      throw new HttpException(StatusCodes.CONFLICT, 'Category with this name already exists');
    }

    const newCategory = await Category.create(categoryData);
    return newCategory.toJSON();
  }

  /**
   * [DIPERBARUI] Mengambil semua kategori dengan fitur query lanjutan.
   * @param queryString Query string dari URL request.
   * @returns Objek dengan daftar kategori dan metadata paginasi.
   */
  public async getAllCategories(queryString: ParsedQs): Promise<PaginatedCategoryResult> {
    // 1. Buat query dasar
    const features = new APIFeatures(queryString)
      .filter()
      .sort()
      .limitFields(); // Hentikan chain sebelum .paginate()

    // 2. Dapatkan nilai limit dan offset secara terpisah
    const { limit, offset } = features.paginate();
    const page = Math.floor(offset / limit) + 1;

    // 3. Gunakan findAndCountAll
    const { rows, count } = await Category.findAndCountAll({
      ...features.queryOptions,
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    // 4. Kembalikan data dengan format paginasi baru
    return {
      rows: rows.map((category) => category.toJSON()),
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: page,
        limit,
      },
    };
  }

  /**
   * Mengambil satu kategori berdasarkan ID.
   */
  public async getCategoryById(id: string): Promise<CategoryAttributes> {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Category not found');
    }
    return category.toJSON();
  }

  /**
   * Memperbarui kategori berdasarkan ID.
   */
  public async updateCategory(id: string, categoryData: UpdateCategoryInput): Promise<CategoryAttributes> {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Category not found');
    }

    await category.update(categoryData);
    return category.toJSON();
  }

  /**
   * Menghapus kategori berdasarkan ID.
   */
  public async deleteCategory(id: string): Promise<void> {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Category not found');
    }

    await category.destroy();
  }
}

// Ekspor sebagai singleton instance
export default new CategoryService();