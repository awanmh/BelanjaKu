import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import UserAddressService from '../../../services/userAddress.service';

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

class UserAddressController {
  public async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const addresses = await UserAddressService.getUserAddresses(req.user!.id);
      res.status(StatusCodes.OK).json({
        success: true,
        data: addresses,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getOne(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const address = await UserAddressService.getAddressById(req.user!.id, req.params.id);
      res.status(StatusCodes.OK).json({
        success: true,
        data: address,
      });
    } catch (error) {
      next(error);
    }
  }

  public async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const address = await UserAddressService.createAddress(req.user!.id, req.body);
      res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Address added successfully',
        data: address,
      });
    } catch (error) {
      next(error);
    }
  }

  public async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const address = await UserAddressService.updateAddress(req.user!.id, req.params.id, req.body);
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Address updated successfully',
        data: address,
      });
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await UserAddressService.deleteAddress(req.user!.id, req.params.id);
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Address deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

<<<<<<< HEAD
export default new UserAddressController();
=======
export default new UserAddressController();
>>>>>>> frontend-role
