import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthenticatedRequest } from "../../../middlewares/auth.middleware";
import WishlistService from "../../../services/wishlist.service";
<<<<<<< HEAD
import HttpException from "../../../utils/http-exception.util";
=======
import ApiError from "../../../utils/api-error.util";
>>>>>>> frontend-role

class WishlistController {
  public async getWishlist(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user)
<<<<<<< HEAD
        throw new HttpException(
=======
        throw new ApiError(
>>>>>>> frontend-role
          StatusCodes.UNAUTHORIZED,
          "Authentication required"
        );

      const wishlist = await WishlistService.getWishlist(req.user.id);
      res.status(StatusCodes.OK).json({
        success: true,
        data: wishlist,
      });
    } catch (error) {
      next(error);
    }
  }

  public async addToWishlist(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user)
<<<<<<< HEAD
        throw new HttpException(
=======
        throw new ApiError(
>>>>>>> frontend-role
          StatusCodes.UNAUTHORIZED,
          "Authentication required"
        );

      const { productId } = req.body;
      const result = await WishlistService.addToWishlist(
        req.user.id,
        productId
      );

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Product added to wishlist",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public async removeFromWishlist(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user)
<<<<<<< HEAD
        throw new HttpException(
=======
        throw new ApiError(
>>>>>>> frontend-role
          StatusCodes.UNAUTHORIZED,
          "Authentication required"
        );

      const { id } = req.params; // Using productId as ID for simplicity in route usually, but let's see.
      // NOTE: Usually DELETE /wishlist/:productId

      await WishlistService.removeFromWishlist(req.user.id, id);

      res.status(StatusCodes.OK).json({
        success: true,
        message: "Product removed from wishlist",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new WishlistController();
