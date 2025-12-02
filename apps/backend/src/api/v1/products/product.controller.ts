import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import ProductService, { CreateProductInput, UpdateProductInput } from '../../../services/product.service';
import HttpException from '../../../utils/http-exception.util';

// Interface untuk memperluas objek Request Express dengan properti 'user' dan 'file'
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: 'user' | 'seller' | 'admin';
  };
  file?: Express.Multer.File; // Tambahkan properti file dari Multer
}

/**
 * Controller untuk menangani semua request yang berhubungan dengan produk.
 */
class ProductController {
  /**
   * Menangani permintaan untuk membuat produk baru.
   */
  public async createProduct(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // REFACTOR: Pemeriksaan req.user tidak lagi diperlukan karena sudah ditangani oleh middleware 'protect'
      if (!req.file) {
        throw new HttpException(StatusCodes.BAD_REQUEST, 'Product image is required');
      }

      // Kita bisa langsung mengakses req.user!.id dengan aman
      const sellerId = req.user!.id;
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

  /**
   * Menangani permintaan untuk mendapatkan semua produk (publik).
   */
  public async getAllProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const products = await ProductService.getAllProducts(req.query);
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Products retrieved successfully',
        data: products || [], // <-- INI PERBAIKANNYA
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Menangani permintaan untuk mendapatkan semua produk milik penjual yang sedang login.
   */
  public async getMyProducts(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // REFACTOR: Pemeriksaan req.user tidak lagi diperlukan
      const sellerId = req.user!.id;
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

  /**
   * Menangani permintaan untuk mendapatkan satu produk berdasarkan ID.
   */
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

  /**
   * Menangani permintaan untuk memperbarui produk.
   */
  public async updateProduct(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // REFACTOR: Pemeriksaan req.user tidak lagi diperlukan
      const { id: productId } = req.params;
      const userId = req.user!.id;
      const productData: UpdateProductInput = req.body;

      if (req.file) {
        productData.imageUrl = req.file.path;
      }

      const updatedProduct = await ProductService.updateProduct(productId, productData, userId);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Menangani permintaan untuk menghapus produk.
   */
  public async deleteProduct(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // REFACTOR: Pemeriksaan req.user tidak lagi diperlukan
      const { id: productId } = req.params;
      const userId = req.user!.id;

      await ProductService.deleteProduct(productId, userId);

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