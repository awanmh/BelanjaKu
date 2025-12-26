import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthenticatedRequest } from "../../../middlewares/auth.middleware";
import ProductDiscussionService from "../../../services/productDiscussion.service";
import HttpException from "../../../utils/http-exception.util";

class ProductDiscussionController {
  public async create(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user)
        throw new HttpException(
          StatusCodes.UNAUTHORIZED,
          "Authentication required"
        );

      const result = await ProductDiscussionService.createDiscussion({
        ...req.body,
        userId: req.user.id,
      });

      res.status(StatusCodes.CREATED).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getByProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { productId } = req.params;
      const result =
        await ProductDiscussionService.getDiscussionsByProduct(productId);

      res.status(StatusCodes.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public async delete(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user)
        throw new HttpException(
          StatusCodes.UNAUTHORIZED,
          "Authentication required"
        );
      const { id } = req.params;

      await ProductDiscussionService.deleteDiscussion(id, req.user.id);
      res.status(StatusCodes.OK).json({ success: true, message: "Deleted" });
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductDiscussionController();
