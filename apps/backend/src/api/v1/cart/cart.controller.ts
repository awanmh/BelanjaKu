import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import CartService from "../../../services/cart.service";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: "user" | "seller" | "admin";
  };
}

class CartController {
  public async addToCart(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.id;
      const { productId, quantity } = req.body;

      if (!productId || !quantity) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Product ID and quantity are required",
        });
        return;
      }

      const cart = await CartService.addToCart(userId, productId, quantity);

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Product added to cart successfully",
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getCart(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.id;
      const cart = await CartService.getUserCart(userId);

      res.status(StatusCodes.OK).json({
        success: true,
        message: "Cart retrieved successfully",
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateCartItem(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id: cartId } = req.params;
      const { quantity } = req.body;

      if (!quantity || quantity < 1) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Quantity must be at least 1",
        });
        return;
      }

      const cart = await CartService.updateItemQuantity(
        userId,
        cartId,
        quantity
      );

      res.status(StatusCodes.OK).json({
        success: true,
        message: "Cart item updated successfully",
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  public async removeCartItem(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id: cartId } = req.params;

      const cart = await CartService.removeItem(userId, cartId);

      res.status(StatusCodes.OK).json({
        success: true,
        message: "Cart item removed successfully",
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  public async clearCart(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.id;
      await CartService.clearCart(userId);

      res.status(StatusCodes.OK).json({
        success: true,
        message: "Cart cleared successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CartController();
