import PromotionService from "../promotion.service";
import db from "../../database/models";
import ApiError from "../../utils/api-error.util";
import { StatusCodes } from "http-status-codes";

// Definisikan tipe instance model untuk type safety
type PromotionInstance = InstanceType<typeof db.Promotion>;
type ProductInstance = InstanceType<typeof db.Product>;
interface PromotionWithProduct extends PromotionInstance {
  product?: ProductInstance;
}

// Mock dependensi eksternal
jest.mock("../../database/models", () => ({
  Promotion: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    destroy: jest.fn(),
  },
  Product: {
    findByPk: jest.fn(),
  },
}));

const mockPromotion = db.Promotion as jest.Mocked<typeof db.Promotion>;
const mockProduct = db.Product as jest.Mocked<typeof db.Product>;

describe("PromotionService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const sellerId = "seller-uuid";
  const productId = "product-uuid";
  const promotionData = {
    productId,
    code: "DISKON10",
    discountPercentage: 10,
    startDate: new Date(),
    endDate: new Date(Date.now() + 100000),
    minPurchaseAmount: 10000,
    type: "DISCOUNT" as const, // Correct enum value
  };
  const mockPromotionInstance = {
    ...promotionData,
    id: "promo-uuid",
    toJSON: () => ({ ...promotionData, id: "promo-uuid" }),
    update: jest.fn(),
    destroy: jest.fn(),
    product: { sellerId }, // Mock relasi
  } as unknown as PromotionWithProduct;

  describe("create", () => {
    it("should create a new promotion successfully", async () => {
      mockProduct.findByPk.mockResolvedValue({ sellerId } as any);
      mockPromotion.findOne.mockResolvedValue(null);
      mockPromotion.create.mockResolvedValue(mockPromotionInstance as any);

      const result = await PromotionService.create(promotionData, sellerId);

      expect(mockProduct.findByPk).toHaveBeenCalledWith(productId);
      expect(mockPromotion.create).toHaveBeenCalledWith(promotionData);
      expect(result).toEqual(mockPromotionInstance.toJSON());
    });

    it("should throw FORBIDDEN if product does not belong to the seller", async () => {
      mockProduct.findByPk.mockResolvedValue({
        sellerId: "another-seller",
      } as any);

      await expect(
        PromotionService.create(promotionData, sellerId)
      ).rejects.toThrow(
        new ApiError(
          StatusCodes.FORBIDDEN,
          "You can only create promotions for your own products."
        )
      );
    });

    it("should throw CONFLICT if promo code already exists", async () => {
      mockProduct.findByPk.mockResolvedValue({ sellerId } as any);
      mockPromotion.findOne.mockResolvedValue(mockPromotionInstance as any);

      await expect(
        PromotionService.create(promotionData, sellerId)
      ).rejects.toThrow(
        new ApiError(
          StatusCodes.CONFLICT,
          "Promotion code already exists."
        )
      );
    });
  });

  describe("findAll", () => {
    it("should return a list of promotions", async () => {
      mockPromotion.findAll.mockResolvedValue([mockPromotionInstance] as any);
      const result = await PromotionService.findAll();
      expect(result.length).toBe(1);
      expect(mockPromotion.findAll).toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("should return a promotion if found", async () => {
      mockPromotion.findByPk.mockResolvedValue(mockPromotionInstance as any);
      const result = await PromotionService.findById("promo-uuid");
      expect(mockPromotion.findByPk).toHaveBeenCalledWith("promo-uuid");
      expect(result).toEqual(mockPromotionInstance.toJSON());
    });

    it("should throw NOT_FOUND if promotion not found", async () => {
      mockPromotion.findByPk.mockResolvedValue(null);
      await expect(PromotionService.findById("promo-uuid")).rejects.toThrow(
        new ApiError(StatusCodes.NOT_FOUND, "Promotion not found")
      );
    });
  });

  describe("update", () => {
    it("should update a promotion successfully", async () => {
      mockPromotion.findByPk.mockResolvedValue(mockPromotionInstance as any);
      await PromotionService.update(
        "promo-uuid",
        { isActive: false },
        sellerId
      );
      expect(mockPromotion.findByPk).toHaveBeenCalledWith(
        "promo-uuid",
        expect.any(Object)
      );
      expect(mockPromotionInstance.update).toHaveBeenCalledWith({
        isActive: false,
      });
    });

    it("should throw FORBIDDEN if user is not the owner", async () => {
      mockPromotion.findByPk.mockResolvedValue(mockPromotionInstance as any);
      await expect(
        PromotionService.update("promo-uuid", {}, "another-seller")
      ).rejects.toThrow(
        new ApiError(
          StatusCodes.FORBIDDEN,
          "You are not authorized to update this promotion."
        )
      );
    });

    it("should throw NOT_FOUND if promotion to update is not found", async () => {
      mockPromotion.findByPk.mockResolvedValue(null);
      await expect(
        PromotionService.update("promo-uuid", {}, sellerId)
      ).rejects.toThrow(
        new ApiError(StatusCodes.NOT_FOUND, "Promotion not found")
      );
    });
  });

  describe("delete", () => {
    it("should delete a promotion successfully", async () => {
      mockPromotion.findByPk.mockResolvedValue(mockPromotionInstance as any);
      await PromotionService.delete("promo-uuid", sellerId);
      expect(mockPromotion.findByPk).toHaveBeenCalledWith(
        "promo-uuid",
        expect.any(Object)
      );
      expect(mockPromotionInstance.destroy).toHaveBeenCalledTimes(1);
    });

    it("should throw FORBIDDEN if user is not the owner", async () => {
      mockPromotion.findByPk.mockResolvedValue(mockPromotionInstance as any);
      await expect(
        PromotionService.delete("promo-uuid", "another-seller")
      ).rejects.toThrow(
        new ApiError(
          StatusCodes.FORBIDDEN,
          "You are not authorized to delete this promotion."
        )
      );
    });

    it("should throw NOT_FOUND if promotion to delete is not found", async () => {
      mockPromotion.findByPk.mockResolvedValue(null);
      await expect(
        PromotionService.delete("promo-uuid", sellerId)
      ).rejects.toThrow(
        new ApiError(StatusCodes.NOT_FOUND, "Promotion not found")
      );
    });
  });
});
