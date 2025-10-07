import { StatusCodes } from 'http-status-codes';
import db from '../database/models';
import { CategoryAttributes } from '../database/models/category.model';
import HttpException from '../utils/http-exception.util';

// Mengambil model Category dari objek db yang sudah diinisialisasi
const Category = db.Category;

// Tipe data spesifik untuk input pembuatan kategori
export type CreateCategoryInput = Pick<CategoryAttributes, 'name'>;

// Tipe data spesifik untuk input pembaruan kategori
export type UpdateCategoryInput = Partial<CreateCategoryInput>;

/**
 * Service untuk menangani semua logika bisnis yang terkait dengan kategori produk.
 */
class CategoryService {
  /**
   * Membuat kategori baru.
   * @param categoryData Data untuk kategori baru.
   * @returns Kategori yang baru dibuat.
   */
  public async createCategory(categoryData: CreateCategoryInput): Promise<CategoryAttributes> {
    const { name } = categoryData;

    // Cek apakah kategori dengan nama yang sama sudah ada
    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      throw new HttpException(StatusCodes.CONFLICT, 'Category with this name already exists');
    }

    const newCategory = await Category.create({ name });
    return newCategory.toJSON();
  }

  /**
   * Mengambil semua kategori dari database.
   * @returns Array berisi semua kategori.
   */
  public async getAllCategories(): Promise<CategoryAttributes[]> {
    const categories = await Category.findAll();
    return categories.map((category) => category.toJSON());
  }

  /**
   * Mengambil satu kategori berdasarkan ID.
   * @param id ID kategori.
   * @returns Objek kategori.
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
   * @param id ID kategori.
   * @param categoryData Data pembaruan.
   * @returns Kategori yang sudah diperbarui.
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
   * @param id ID kategori.
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
