import CategoryService from '../category.service';
import db from '../../database/models';
import HttpException from '../../utils/http-exception.util';
import { StatusCodes } from 'http-status-codes';

// Mock dependensi eksternal
jest.mock('../../database/models', () => ({
  Category: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    destroy: jest.fn(),
  },
}));

const mockCategory = db.Category as jest.Mocked<typeof db.Category>;

describe('CategoryService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const categoryData = { name: 'Elektronik' };
  const mockCategoryInstance = {
    ...categoryData,
    id: 'cat-uuid',
    toJSON: () => ({ ...categoryData, id: 'cat-uuid' }),
    update: jest.fn(),
    destroy: jest.fn(),
  };

  // --- Pengujian untuk Metode `createCategory` ---
  describe('createCategory', () => {
    it('should create a new category successfully', async () => {
      mockCategory.findOne.mockResolvedValue(null);
      mockCategory.create.mockResolvedValue(mockCategoryInstance as any);

      const result = await CategoryService.createCategory(categoryData);

      expect(mockCategory.findOne).toHaveBeenCalledWith({ where: { name: categoryData.name } });
      expect(mockCategory.create).toHaveBeenCalledWith(categoryData);
      expect(result).toEqual(mockCategoryInstance.toJSON());
    });

    it('should throw CONFLICT if category name already exists', async () => {
      mockCategory.findOne.mockResolvedValue(mockCategoryInstance as any);

      await expect(CategoryService.createCategory(categoryData)).rejects.toThrow(
        new HttpException(StatusCodes.CONFLICT, 'Category with this name already exists')
      );
    });
  });

  // --- Pengujian untuk Metode `getAllCategories` ---
  describe('getAllCategories', () => {
    it('should return a list of categories', async () => {
      const mockCategories = [mockCategoryInstance, { ...mockCategoryInstance, id: 'cat-uuid-2' }];
      mockCategory.findAll.mockResolvedValue(mockCategories as any);

      const result = await CategoryService.getAllCategories();
      expect(result.length).toBe(2);
      expect(mockCategory.findAll).toHaveBeenCalled();
    });
  });

  // --- Pengujian Baru untuk Metode `getCategoryById` ---
  describe('getCategoryById', () => {
    it('should return a single category if found', async () => {
        mockCategory.findByPk.mockResolvedValue(mockCategoryInstance as any);
        const result = await CategoryService.getCategoryById('cat-uuid');
        expect(mockCategory.findByPk).toHaveBeenCalledWith('cat-uuid');
        expect(result).toEqual(mockCategoryInstance.toJSON());
    });

    it('should throw NOT_FOUND if category is not found', async () => {
        mockCategory.findByPk.mockResolvedValue(null);
        await expect(CategoryService.getCategoryById('cat-uuid')).rejects.toThrow(
            new HttpException(StatusCodes.NOT_FOUND, 'Category not found')
        );
    });
  });
  
  // --- Pengujian Baru untuk Metode `updateCategory` ---
  describe('updateCategory', () => {
    it('should update a category successfully', async () => {
        const updateData = { name: 'Gadgets' };
        mockCategory.findByPk.mockResolvedValue(mockCategoryInstance as any);
        mockCategoryInstance.update.mockResolvedValue({ ...mockCategoryInstance, ...updateData } as any);

        const result = await CategoryService.updateCategory('cat-uuid', updateData);
        expect(mockCategory.findByPk).toHaveBeenCalledWith('cat-uuid');
        expect(mockCategoryInstance.update).toHaveBeenCalledWith(updateData);
    });

    it('should throw NOT_FOUND if category to update is not found', async () => {
        mockCategory.findByPk.mockResolvedValue(null);
        await expect(CategoryService.updateCategory('cat-uuid', {})).rejects.toThrow(
            new HttpException(StatusCodes.NOT_FOUND, 'Category not found')
        );
    });
  });

  // --- Pengujian untuk Metode `deleteCategory` ---
  describe('deleteCategory', () => {
    it('should delete a category successfully', async () => {
      mockCategory.findByPk.mockResolvedValue(mockCategoryInstance as any);
      
      await CategoryService.deleteCategory('cat-uuid');

      expect(mockCategory.findByPk).toHaveBeenCalledWith('cat-uuid');
      expect(mockCategoryInstance.destroy).toHaveBeenCalledTimes(1);
    });

    it('should throw NOT_FOUND if category to delete is not found', async () => {
        mockCategory.findByPk.mockResolvedValue(null);
        await expect(CategoryService.deleteCategory('cat-uuid')).rejects.toThrow(
            new HttpException(StatusCodes.NOT_FOUND, 'Category not found')
        );
    });
  });
});