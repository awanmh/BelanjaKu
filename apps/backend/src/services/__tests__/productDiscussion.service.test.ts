import { StatusCodes } from "http-status-codes";
import ProductDiscussionService from "../productDiscussion.service";
import db from "../../database/models";
import HttpException from "../../utils/http-exception.util";

// Mock dependencies
jest.mock("../../database/models", () => {
  return {
    __esModule: true,
    default: {
      ProductDiscussion: {
        create: jest.fn(),
        findByPk: jest.fn(),
        findAll: jest.fn(),
      },
      Product: {
        findByPk: jest.fn(),
      },
      User: {},
    },
  };
});

describe("ProductDiscussionService", () => {
  const mockUserId = "user-123";
  const mockProductId = "prod-123";

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createDiscussion", () => {
    it("should create discussion successfully", async () => {
      const input = {
        productId: mockProductId,
        userId: mockUserId,
        message: "Is this available?",
      };

      (db.Product.findByPk as jest.Mock).mockResolvedValue({
        id: mockProductId,
      });
      (db.ProductDiscussion.create as jest.Mock).mockResolvedValue({
        ...input,
        id: "disc-1",
        toJSON: () => ({ ...input, id: "disc-1" }),
      });

      const result = await ProductDiscussionService.createDiscussion(input);

      expect(db.Product.findByPk).toHaveBeenCalledWith(mockProductId);
      expect(db.ProductDiscussion.create).toHaveBeenCalledWith(input);
      expect(result.id).toBe("disc-1");
    });

    it("should throw NOT_FOUND if product missing", async () => {
      (db.Product.findByPk as jest.Mock).mockResolvedValue(null);
      const input = {
        productId: mockProductId,
        userId: mockUserId,
        message: "Is this available?",
      };

      await expect(
        ProductDiscussionService.createDiscussion(input)
      ).rejects.toThrow(
        new HttpException(StatusCodes.NOT_FOUND, "Product not found")
      );
    });
  });

  describe("getDiscussionsByProduct", () => {
    it("should return discussions", async () => {
      const mockList = [{ id: "1", message: "Hello" }];
      (db.ProductDiscussion.findAll as jest.Mock).mockResolvedValue(mockList);

      const result =
        await ProductDiscussionService.getDiscussionsByProduct(mockProductId);

      expect(db.ProductDiscussion.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { productId: mockProductId, parentDiscussionId: null },
        })
      );
      expect(result).toHaveLength(1);
    });
  });
});
