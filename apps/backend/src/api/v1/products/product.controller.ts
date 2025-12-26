import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import ProductService, { CreateProductInput, UpdateProductInput } from '../../../services/product.service';
import HttpException from '../../../utils/http-exception.util';
import db from '../../../database/models'; // Import DB untuk akses model Seller

// Interface Request
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: 'user' | 'seller' | 'admin';
  };
  file?: Express.Multer.File;
}

class ProductController {
  
  // --- HELPER PRIVATE: Dapatkan Seller ID dari User ID ---
  private async getSellerIdFromUser(userId: string): Promise<string> {
    const seller = await db.Seller.findOne({ where: { userId } });
    if (!seller) {
      throw new HttpException(StatusCodes.FORBIDDEN, 'User is not registered as a seller');
    }
    return seller.id;
  }

  public async createProduct(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) throw new HttpException(StatusCodes.BAD_REQUEST, 'Product image is required');
      
      // PERBAIKAN: Cari Seller ID dulu
      const sellerId = await this.getSellerIdFromUser(req.user!.id);
      
      const productData: CreateProductInput = req.body;
      productData.imageUrl = req.file.path;

      const newProduct = await ProductService.createProduct(productData, sellerId);

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Product created successfully',
        data: newProduct,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getAllProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const products = await ProductService.getAllProducts(req.query);
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Products retrieved successfully',
        data: products, 
      });
    } catch (error) {
      next(error);
    }
  }

  public async getMyProducts(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // PERBAIKAN: Gunakan Seller ID, bukan User ID
      const sellerId = await this.getSellerIdFromUser(req.user!.id);
      
      const products = await ProductService.getProductsBySeller(sellerId, req.query);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Your products retrieved successfully',
        data: products,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const product = await ProductService.getProductById(id);
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Product retrieved successfully',
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateProduct(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id: productId } = req.params;
      // PERBAIKAN: Gunakan Seller ID
      const sellerId = await this.getSellerIdFromUser(req.user!.id);
      
      const productData: UpdateProductInput = req.body;
      if (req.file) {
        productData.imageUrl = req.file.path;
      }

      const updatedProduct = await ProductService.updateProduct(productId, productData, sellerId);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct,
      });
    } catch (error) {
      next(error);
    }
  }

  public async deleteProduct(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id: productId } = req.params;
      // PERBAIKAN: Gunakan Seller ID
      const sellerId = await this.getSellerIdFromUser(req.user!.id);

      await ProductService.deleteProduct(productId, sellerId);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductController();