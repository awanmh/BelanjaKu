import ProductService from '../product.service';
import db from '../../database/models';
import HttpException from '../../utils/http-exception.util';
import { StatusCodes } from 'http-status-codes';
import APIFeatures from '../../utils/apiFeatures.util';

// Mock dependensi eksternal
jest.mock('../../database/models', () => ({
  Product: {
    create: jest.fn(),
    findAndCountAll: jest.fn(), // FIX: Tambahkan mock untuk findAndCountAll
    findByPk: jest.fn(),
    destroy: jest.fn(),
  },
  User: {},
}));

// Mock implementasi APIFeatures
jest.mock('../../utils/apiFeatures.util');
const mockAPIFeatures = APIFeatures as jest.MockedClass<typeof APIFeatures>;

const mockProduct = db.Product as jest.Mocked<typeof db.Product>;

describe('ProductService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    it('should create a new product successfully', async () => {
      const productData = { name: 'New Product', description: 'A great new product', price: 100, stock: 10, categoryId: 'cat-uuid', imageUrl: 'image.jpg' };
      const sellerId = 'seller-uuid';
      const createdProductJSON = { ...productData, sellerId, id: 'prod-uuid' };
      const createdProduct = { ...createdProductJSON, toJSON: () => createdProductJSON };

      mockProduct.create.mockResolvedValue(createdProduct as any);
      const result = await ProductService.createProduct(productData, sellerId);
      expect(mockProduct.create).toHaveBeenCalledWith({ ...productData, sellerId });
      expect(result).toEqual(createdProduct.toJSON());
    });
  });

  // FIX: Perbarui tes getAllProducts untuk menggunakan findAndCountAll
  describe('getAllProducts', () => {
    it('should call APIFeatures and return paginated products', async () => {
      const mockProducts = [{ name: 'Product 1', toJSON: () => ({ name: 'Product 1' }) }, { name: 'Product 2', toJSON: () => ({ name: 'Product 2' }) }];
      
      (mockAPIFeatures as any).mockImplementation(() => ({
          filter: jest.fn().mockReturnThis(),
          sort: jest.fn().mockReturnThis(),
          limitFields: jest.fn().mockReturnThis(),
          paginate: jest.fn(() => ({ limit: 10, offset: 0 })),
          queryOptions: { include: [] },
      }));

      // Mock findAndCountAll alih-alih findAll
      mockProduct.findAndCountAll.mockResolvedValue({ rows: mockProducts, count: 2 } as any);

      const result = await ProductService.getAllProducts({});
      
      expect(mockAPIFeatures).toHaveBeenCalled();
      expect(mockProduct.findAndCountAll).toHaveBeenCalled();
      expect(result.rows).toEqual(mockProducts.map(p => p.toJSON()));
      expect(result.pagination.totalItems).toBe(2);
    });
  });

  // FIX: Perbarui tes getProductsBySeller untuk menggunakan findAndCountAll
  describe('getProductsBySeller', () => {
    it('should correctly filter products by sellerId', async () => {
        const sellerId = 'seller-uuid';
        const mockProducts = [{ name: 'My Product 1', toJSON: () => ({ name: 'My Product 1' }) }];
        const mockQueryOptions = { where: {} };
    
        (mockAPIFeatures as any).mockImplementation(() => ({
            filter: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            limitFields: jest.fn().mockReturnThis(),
            paginate: jest.fn(() => ({ limit: 10, offset: 0 })),
            queryOptions: mockQueryOptions,
        }));
    
        // Mock findAndCountAll alih-alih findAll
        mockProduct.findAndCountAll.mockResolvedValue({ rows: mockProducts, count: 1 } as any);
    
        const result = await ProductService.getProductsBySeller(sellerId, {});
    
        expect(mockQueryOptions.where).toHaveProperty('sellerId', sellerId);
        expect(mockProduct.findAndCountAll).toHaveBeenCalledWith(expect.objectContaining({
            where: { sellerId },
            limit: 10,
            offset: 0
        }));
        expect(result.rows.length).toBe(1);
    });
  });

  describe('updateProduct', () => {
     const productId = 'prod-uuid';
     const sellerId = 'seller-uuid';
     const updateData = { name: 'Updated Name' };
     const mockExistingProduct = {
       id: productId,
       sellerId: sellerId,
       update: jest.fn(),
       toJSON: () => ({ id: productId, sellerId, name: 'Updated Name' }),
     };
 
     it('should update a product successfully if user is the owner', async () => {
         mockProduct.findByPk.mockResolvedValue(mockExistingProduct as any);
         mockExistingProduct.update.mockResolvedValue(mockExistingProduct as any);
   
         const result = await ProductService.updateProduct(productId, updateData, sellerId);
   
         expect(mockProduct.findByPk).toHaveBeenCalledWith(productId);
         expect(mockExistingProduct.update).toHaveBeenCalledWith(updateData);
         expect(result).toEqual(mockExistingProduct.toJSON());
     });
 
     it('should throw FORBIDDEN error if user is not the owner', async () => {
         const anotherSellerId = 'another-seller-uuid';
         mockProduct.findByPk.mockResolvedValue(mockExistingProduct as any);
   
         await expect(ProductService.updateProduct(productId, updateData, anotherSellerId)).rejects.toThrow(
             new HttpException(StatusCodes.FORBIDDEN, 'You are not authorized to update this product')
         );
     });
 
     it('should throw NOT_FOUND error if product does not exist', async () => {
         mockProduct.findByPk.mockResolvedValue(null);
   
         await expect(ProductService.updateProduct(productId, updateData, sellerId)).rejects.toThrow(
             new HttpException(StatusCodes.NOT_FOUND, 'Product not found')
         );
     });
   });

   describe('getProductById', () => {
    const productId = 'prod-uuid';

    it('should return a product if found', async () => {
      const mockProductData = { id: productId, name: 'Found Product', toJSON: () => ({ id: productId, name: 'Found Product' }) };
      mockProduct.findByPk.mockResolvedValue(mockProductData as any);
      
      const result = await ProductService.getProductById(productId);

      expect(mockProduct.findByPk).toHaveBeenCalledWith(productId, expect.any(Object));
      expect(result).toEqual(mockProductData.toJSON());
    });

    it('should throw NOT_FOUND error if product is not found', async () => {
      mockProduct.findByPk.mockResolvedValue(null);
      
      await expect(ProductService.getProductById(productId)).rejects.toThrow(
        new HttpException(StatusCodes.NOT_FOUND, 'Product not found')
      );
    });
  });

  describe('deleteProduct', () => {
    const productId = 'prod-uuid';
    const sellerId = 'seller-uuid';
    const mockExistingProduct = { id: productId, sellerId: sellerId, destroy: jest.fn() };

    it('should delete the product if user is the owner', async () => {
      mockProduct.findByPk.mockResolvedValue(mockExistingProduct as any);
      
      await ProductService.deleteProduct(productId, sellerId);

      expect(mockProduct.findByPk).toHaveBeenCalledWith(productId);
      expect(mockExistingProduct.destroy).toHaveBeenCalledTimes(1);
    });

    it('should throw FORBIDDEN error if user is not the owner', async () => {
      const anotherSellerId = 'another-seller-uuid';
      mockProduct.findByPk.mockResolvedValue(mockExistingProduct as any);
      
      await expect(ProductService.deleteProduct(productId, anotherSellerId)).rejects.toThrow(
        new HttpException(StatusCodes.FORBIDDEN, 'You are not authorized to delete this product')
      );
      expect(mockExistingProduct.destroy).not.toHaveBeenCalled();
    });

    it('should throw NOT_FOUND error if product does not exist', async () => {
        mockProduct.findByPk.mockResolvedValue(null);
        await expect(ProductService.deleteProduct(productId, sellerId)).rejects.toThrow(new HttpException(StatusCodes.NOT_FOUND, 'Product not found'));
    });
  });
});