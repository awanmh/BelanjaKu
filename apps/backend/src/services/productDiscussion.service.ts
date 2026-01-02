import { StatusCodes } from "http-status-codes";
import db from "../database/models";
import ApiError from "../utils/api-error.util";

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
      throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");

    // Check if parent exists if provided
    if (data.parentDiscussionId) {
      const parent = await ProductDiscussion.findByPk(data.parentDiscussionId);
      if (!parent)
        throw new ApiError(
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
      throw new ApiError(StatusCodes.NOT_FOUND, "Discussion not found");

    // Only owner can delete (or admin, implementation simplified)
    if (discussion.userId !== userId) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Not authorized");
    }

    await discussion.destroy();
  }
}

export default new ProductDiscussionService();
