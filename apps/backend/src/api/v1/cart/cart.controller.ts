// backend/src/api/v1/cart/cart.controller.ts
import { Request, Response, NextFunction } from "express";
import cartService from "../../../services/cart.service";

// Interface custom untuk Request yang sudah melewati auth middleware
interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

export const getMyCart = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id; // Diasumsikan middleware auth menyuntikkan user
    const data = await cartService.getUserCart(userId);
    res.status(200).json({ status: "success", data });
  } catch (error) {
    next(error);
  }
};

export const addItem = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { productId, quantity } = req.body;
    const data = await cartService.addToCart(userId, productId, quantity);
    res
      .status(201)
      .json({ status: "success", message: "Item added to cart", data });
  } catch (error) {
    next(error);
  }
};

export const updateItem = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params; // cartItemId
    const { quantity } = req.body;
    const data = await cartService.updateItemQuantity(userId, id, quantity);
    res.status(200).json({ status: "success", message: "Cart updated", data });
  } catch (error) {
    next(error);
  }
};

export const removeItem = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    await cartService.removeItem(userId, id);
    res.status(200).json({ status: "success", message: "Item removed" });
  } catch (error) {
    next(error);
  }
};

export const clearAll = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    await cartService.clearCart(userId);
    res.status(200).json({ status: "success", message: "Cart cleared" });
  } catch (error) {
    next(error);
  }
};
