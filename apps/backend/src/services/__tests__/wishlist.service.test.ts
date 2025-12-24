import { StatusCodes } from "http-status-codes";
import WishlistService from "../wishlist.service";
import db from "../../database/models";
import HttpException from "../../utils/http-exception.util";

// Mock dependencies
jest.mock("../../database/models", () => {
  return {
    __esModule: true,
    default: {
      Wishlist: {
        create: jest.fn(),
        findOne: jest.fn(),
        findAll: jest.fn(),
        destroy: jest.fn(),
      },
      Product: {
        findByPk: jest.fn(),
      },
      ProductImage: {}, // Add this since it is used in getWishlist
    },
  };
});

describe("WishlistService", () => {
  const mockUserId = "user-123";
  const mockProductId = "product-123";

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("addToWishlist", () => {
    it("should add a product to wishlist successfully", async () => {
      // Setup mocks
      (db.Product.findByPk as jest.Mock).mockResolvedValue({
        id: mockProductId,
      });
      (db.Wishlist.findOne as jest.Mock).mockResolvedValue(null); // Not already in wishlist
      (db.Wishlist.create as jest.Mock).mockResolvedValue({
        id: "wishlist-1",
        userId: mockUserId,
        productId: mockProductId,
        toJSON: () => ({
          id: "wishlist-1",
          userId: mockUserId,
          productId: mockProductId,
        }),
      });

      const result = await WishlistService.addToWishlist(
        mockUserId,
        mockProductId
      );

      expect(db.Product.findByPk).toHaveBeenCalledWith(mockProductId);
      expect(db.Wishlist.findOne).toHaveBeenCalledWith({
        where: { userId: mockUserId, productId: mockProductId },
      });
      expect(db.Wishlist.create).toHaveBeenCalledWith({
        userId: mockUserId,
        productId: mockProductId,
      });
      expect(result).toHaveProperty("id", "wishlist-1");
    });

    it("should throw NOT_FOUND if product does not exist", async () => {
      (db.Product.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(
        WishlistService.addToWishlist(mockUserId, mockProductId)
      ).rejects.toThrow(
        new HttpException(StatusCodes.NOT_FOUND, "Product not found")
      );
    });

    it("should return existing item if product is already in wishlist", async () => {
      const existingItem = { id: "exists", toJSON: () => ({ id: "exists" }) };
      (db.Product.findByPk as jest.Mock).mockResolvedValue({
        id: mockProductId,
      });
      (db.Wishlist.findOne as jest.Mock).mockResolvedValue(existingItem);

      const result = await WishlistService.addToWishlist(
        mockUserId,
        mockProductId
      );
      expect(result).toHaveProperty("id", "exists");
    });
  });

  describe("getWishlist", () => {
    // Changed name to match service
    it("should return user wishlist", async () => {
      const mockWishlist = [
        {
          id: "w1",
          userId: mockUserId,
          productId: mockProductId,
          product: { name: "Test Product" },
        },
      ];

      (db.Wishlist.findAll as jest.Mock).mockResolvedValue(mockWishlist);

      const result = await WishlistService.getWishlist(mockUserId);

      expect(db.Wishlist.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: mockUserId },
          include: expect.anything(),
        })
      );
      expect(result).toHaveLength(1);
    });
  });

  describe("removeFromWishlist", () => {
    it("should remove product from wishlist", async () => {
      (db.Wishlist.destroy as jest.Mock).mockResolvedValue(1); // 1 row deleted

      const result = await WishlistService.removeFromWishlist(
        mockUserId,
        mockProductId
      );

      expect(db.Wishlist.destroy).toHaveBeenCalledWith({
        where: { userId: mockUserId, productId: mockProductId },
      });
      expect(result).toBe(true);
    });

    it("should throw NOT_FOUND if item does not exist (0 deleted)", async () => {
      (db.Wishlist.destroy as jest.Mock).mockResolvedValue(0);

      await expect(
        WishlistService.removeFromWishlist(mockUserId, mockProductId)
      ).rejects.toThrow(
        new HttpException(
          StatusCodes.NOT_FOUND,
          "Product not found in wishlist"
        )
      );
    });
  });
});
