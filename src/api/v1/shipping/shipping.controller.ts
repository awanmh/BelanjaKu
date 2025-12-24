import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import ShippingOptionService, {
  CreateShippingOptionInput,
  UpdateShippingOptionInput,
} from '../../../services/shipping.service';

/**
 * Controller untuk menangani semua request yang berhubungan dengan opsi pengiriman.
 */
class ShippingOptionController {
  /**
   * Menangani permintaan untuk membuat opsi pengiriman baru.
   */
  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: CreateShippingOptionInput = req.body;
      const newOption = await ShippingOptionService.create(data);

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Shipping option created successfully',
        data: newOption,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Menangani permintaan untuk mendapatkan semua opsi pengiriman.
   */
  public async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const options = await ShippingOptionService.findAll();
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Shipping options retrieved successfully',
        data: options,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Menangani permintaan untuk mendapatkan satu opsi pengiriman berdasarkan ID.
   */
  public async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const option = await ShippingOptionService.findById(id);
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Shipping option retrieved successfully',
        data: option,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Menangani permintaan untuk memperbarui opsi pengiriman.
   */
  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data: UpdateShippingOptionInput = req.body;
      const updatedOption = await ShippingOptionService.update(id, data);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Shipping option updated successfully',
        data: updatedOption,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Menangani permintaan untuk menghapus opsi pengiriman.
   */
  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await ShippingOptionService.delete(id);
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Shipping option deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

// Ekspor sebagai singleton instance
export default new ShippingOptionController();