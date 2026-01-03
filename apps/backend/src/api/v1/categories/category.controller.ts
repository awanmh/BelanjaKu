import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import CategoryService, { CreateCategoryInput, UpdateCategoryInput } from '../../../services/category.service';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import ApiError from '../../../utils/api-error.util';

/**
 * Controller untuk menangani semua request yang berhubungan dengan kategori produk.
 */
class CategoryController {
  /**
   * Menangani permintaan untuk membuat kategori baru.
   */
  public async createCategory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const categoryData: CreateCategoryInput = req.body;
      const newCategory = await CategoryService.createCategory(categoryData);

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Category created successfully',
        data: newCategory,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Menangani permintaan untuk mendapatkan semua kategori.
   */
  public async getAllCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // FIX: Teruskan req.query ke service untuk filtering, sorting, dll.
      const categories = await CategoryService.getAllCategories(req.query);
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Categories retrieved successfully',
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Menangani permintaan untuk mendapatkan satu kategori berdasarkan ID.
   */
  public async getCategoryById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const category = await CategoryService.getCategoryById(id);
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Category retrieved successfully',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Menangani permintaan untuk memperbarui kategori.
   */
  public async updateCategory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const categoryData: UpdateCategoryInput = req.body;
      const updatedCategory = await CategoryService.updateCategory(id, categoryData);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Category updated successfully',
        data: updatedCategory,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Menangani permintaan untuk menghapus kategori.
   */
  public async deleteCategory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await CategoryService.deleteCategory(id);
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Category deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

// Ekspor sebagai singleton instance
export default new CategoryController();

