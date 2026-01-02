import CategoryService from '../category.service';
import db from '../../database/models';
import ApiError from '../../utils/api-error.util';
import { StatusCodes } from 'http-status-codes';
import APIFeatures from '../../utils/apiFeatures.util';

// Mock dependensi eksternal
jest.mock('../../database/models', () => ({
  Category: {
    create: jest.fn(),
    findAndCountAll: jest.fn(), // FIX: Ubah 'findAll' menjadi 'findAndCountAll'
    findByPk: jest.fn(),
    findOne: jest.fn(),
    destroy: jest.fn(),
  },
}));

// Mock implementasi APIFeatures
jest.mock('../../utils/apiFeatures.util');
const mockAPIFeatures = APIFeatures as jest.MockedClass<typeof APIFeatures>;

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
  });

  // --- Pengujian untuk Metode `getAllCategories` ---
  describe('getAllCategories', () => {
    it('should return a paginated list of categories', async () => {
      const mockCategories = [mockCategoryInstance, { ...mockCategoryInstance, id: 'cat-uuid-2' }];
      // Siapkan mock untuk findAndCountAll
      mockCategory.findAndCountAll.mockResolvedValue({ rows: mockCategories, count: 2 } as any);
      
      // Siapkan mock untuk APIFeatures
      (mockAPIFeatures as any).mockImplementation(() => ({
        filter: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        limitFields: jest.fn().mockReturnThis(),
        paginate: jest.fn(() => ({ limit: 10, offset: 0 })),
        queryOptions: {},
      }));

      const result = await CategoryService.getAllCategories({});

      expect(mockCategory.findAndCountAll).toHaveBeenCalled();
      // FIX: Periksa di dalam properti 'rows'
      expect(result.rows.length).toBe(2);
      expect(result.pagination.totalItems).toBe(2);
    });
  });

  // --- Pengujian untuk Metode `getCategoryById` ---
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
            new ApiError(StatusCodes.NOT_FOUND, 'Category not found')
        );
    });
  });
  
  // --- Pengujian untuk Metode `updateCategory` ---
  describe('updateCategory', () => {
    it('should update a category successfully', async () => {
        const updateData = { name: 'Gadgets' };
        mockCategory.findByPk.mockResolvedValue(mockCategoryInstance as any);
        mockCategoryInstance.update.mockResolvedValue({ ...mockCategoryInstance, ...updateData } as any);

        await CategoryService.updateCategory('cat-uuid', updateData);
        expect(mockCategory.findByPk).toHaveBeenCalledWith('cat-uuid');
        expect(mockCategoryInstance.update).toHaveBeenCalledWith(updateData);
    });

    it('should throw NOT_FOUND if category to update is not found', async () => {
        mockCategory.findByPk.mockResolvedValue(null);
        await expect(CategoryService.updateCategory('cat-uuid', {})).rejects.toThrow(
            new ApiError(StatusCodes.NOT_FOUND, 'Category not found')
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
            new ApiError(StatusCodes.NOT_FOUND, 'Category not found')
        );
    });
  });
});

