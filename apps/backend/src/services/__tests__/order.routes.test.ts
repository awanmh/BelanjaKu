import request from "supertest";
import app from "../../server";
import db from "../../database/models";

describe("Order API Endpoints", () => {
  let userToken: string;
  let userId: string;
  let sellerId: string;
  let productId1: string;
  let productId2: string;
  let promotionId: string;

  beforeAll(async () => {
    // Bersihkan dan siapkan database
    await db.sequelize.sync({ force: true });

    // 1. Buat user pembeli
    const userRes = await request(app).post("/api/v1/auth/register").send({
      fullName: "Test Buyer",
      email: "buyer.order@test.com",
      password: "Password123",
    });
    userId = userRes.body.data.id;
    const loginResUser = await request(app).post("/api/v1/auth/login").send({
      email: "buyer.order@test.com",
      password: "Password123",
    });
    userToken = loginResUser.body.data.tokens.accessToken;

    // 2. Buat user penjual dan produknya
    await request(app).post("/api/v1/auth/register").send({
      fullName: "Test Seller",
      email: "seller.order@test.com",
      password: "Password123",
    });
    const sellerUser = await db.User.findOne({
      where: { email: "seller.order@test.com" },
    });
    await sellerUser!.update({ role: "seller" });
    sellerId = sellerUser!.id;
    const category = await db.Category.create({ name: "Electronics" });
    const product1 = await db.Product.create({
      name: "Mouse",
      description: "A nice mouse",
      price: 150000,
      stock: 20,
      sellerId,
      categoryId: category.id,
      imageUrl: "mouse.jpg",
    });
    const product2 = await db.Product.create({
      name: "Keyboard",
      description: "A nice keyboard",
      price: 300000,
      stock: 15,
      sellerId,
      categoryId: category.id,
      imageUrl: "keyboard.jpg",
    });
    productId1 = product1.id;
    productId2 = product2.id;

    // 3. Buat promosi untuk produk pertama
    const promo = await db.Promotion.create({
      productId: productId1,
      code: "HEMAT50",
      discountPercentage: 50,
      startDate: new Date(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Berlaku 1 hari
      minPurchaseAmount: 0,
      type: "DISCOUNT",
    });
    promotionId = promo.id;
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  describe("POST /api/v1/orders", () => {
    it("should create an order successfully without a promotion code", async () => {
      const response = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          shippingAddress: "123 Main St",
          items: [{ productId: productId2, quantity: 2 }],
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.totalAmount).toBe("600000.00"); // 300000 * 2
      expect(response.body.data.discountAmount).toBe("0.00");
    });

    it("should create an order successfully WITH a valid promotion code", async () => {
      const response = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          shippingAddress: "123 Main St",
          items: [
            { productId: productId1, quantity: 1 }, // Produk dengan promo
            { productId: productId2, quantity: 1 }, // Produk tanpa promo
          ],
          promotionCode: "HEMAT50",
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.data.promotionId).toBe(promotionId);
      expect(response.body.data.discountAmount).toBe("75000.00"); // 50% dari 150000
      expect(response.body.data.totalAmount).toBe("375000.00"); // (150000 + 300000) - 75000
    });

    it("should return 400 Bad Request for an invalid promotion code", async () => {
      const response = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          shippingAddress: "123 Main St",
          items: [{ productId: productId1, quantity: 1 }],
          promotionCode: "INVALIDCODE",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toContain(
        "Invalid or expired promotion code"
      );
    });
  });
});
