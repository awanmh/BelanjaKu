import { StatusCodes } from "http-status-codes";
import db from "../database/models";
<<<<<<< HEAD
import HttpException from "../utils/http-exception.util";
=======
import ApiError from "../utils/api-error.util";
>>>>>>> frontend-role

const ProductDiscussion = db.ProductDiscussion;
const Product = db.Product;
const User = db.User;

export type CreateDiscussionInput = {
  productId: string;
  userId: string;
  message: string;
  parentDiscussionId?: string;
};

class ProductDiscussionService {
  public async createDiscussion(data: CreateDiscussionInput) {
    // Validation
    const product = await Product.findByPk(data.productId);
    if (!product)
<<<<<<< HEAD
      throw new HttpException(StatusCodes.NOT_FOUND, "Product not found");
=======
      throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");
>>>>>>> frontend-role

    // Check if parent exists if provided
    if (data.parentDiscussionId) {
      const parent = await ProductDiscussion.findByPk(data.parentDiscussionId);
      if (!parent)
<<<<<<< HEAD
        throw new HttpException(
=======
        throw new ApiError(
>>>>>>> frontend-role
          StatusCodes.NOT_FOUND,
          "Parent discussion not found"
        );
      // Logic to prevent deep nesting if needed, assuming 1 level depth for now or infinite
    }

    const discussion = await ProductDiscussion.create(data);
    return discussion.toJSON();
  }

  public async getDiscussionsByProduct(productId: string) {
    const discussions = await ProductDiscussion.findAll({
      where: { productId, parentDiscussionId: null }, // Fetch top level
      include: [
        { model: User, as: "user", attributes: ["id", "fullName"] },
        {
          model: db.ProductDiscussion,
          as: "replies",
          include: [
            { model: User, as: "user", attributes: ["id", "fullName"] },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    return discussions;
  }

  public async deleteDiscussion(id: string, userId: string) {
    const discussion = await ProductDiscussion.findByPk(id);
    if (!discussion)
<<<<<<< HEAD
      throw new HttpException(StatusCodes.NOT_FOUND, "Discussion not found");

    // Only owner can delete (or admin, implementation simplified)
    if (discussion.userId !== userId) {
      throw new HttpException(StatusCodes.FORBIDDEN, "Not authorized");
=======
      throw new ApiError(StatusCodes.NOT_FOUND, "Discussion not found");

    // Only owner can delete (or admin, implementation simplified)
    if (discussion.userId !== userId) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Not authorized");
>>>>>>> frontend-role
    }

    await discussion.destroy();
  }
}

export default new ProductDiscussionService();
