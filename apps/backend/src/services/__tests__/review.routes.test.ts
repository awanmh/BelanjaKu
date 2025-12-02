import request from 'supertest';
import app from '../../server';
import db from '../../database/models';

describe('Review API Endpoints', () => {
  let userToken: string;
  let userTokenNoPurchase: string;
  let productId: string;

  beforeAll(async () => {
    await db.sequelize.sync({ force: true });

    // 1. Buat user pembeli
    await request(app).post('/api/v1/auth/register').send({
      fullName: 'Test Buyer Review',
      email: 'buyer.review@test.com',
      password: 'Password123',
    });
    const loginResUser = await request(app).post('/api/v1/auth/login').send({
      email: 'buyer.review@test.com',
      password: 'Password123',
    });
    userToken = loginResUser.body.data.tokens.accessToken;
    const buyer = await db.User.findOne({ where: { email: 'buyer.review@test.com' } });

    // 2. Buat user lain (tidak membeli)
    await request(app).post('/api/v1/auth/register').send({
        fullName: 'Test Non-Buyer',
        email: 'nonbuyer@test.com',
        password: 'Password123',
    });
    const loginResUser2 = await request(app).post('/api/v1/auth/login').send({
        email: 'nonbuyer@test.com',
        password: 'Password123',
    });
    userTokenNoPurchase = loginResUser2.body.data.tokens.accessToken;

    // 3. Buat seller dan produk
    await request(app).post('/api/v1/auth/register').send({
        fullName: 'Test Seller Review',
        email: 'seller.review@test.com',
        password: 'Password123',
    });
    const sellerUser = await db.User.findOne({ where: { email: 'seller.review@test.com' } });
    await sellerUser!.update({ role: 'seller' });
    const category = await db.Category.create({ name: 'Books' });
    const product = await db.Product.create({ name: 'Test Book', description: 'A book to review', price: 100000, stock: 10, sellerId: sellerUser!.id, categoryId: category.id, imageUrl: 'book.jpg' });
    productId = product.id;

    // 4. Buat pesanan yang SUDAH SELESAI untuk user pembeli
    const order = await db.Order.create({
        userId: buyer!.id,
        totalAmount: 100000,
        shippingAddress: '123 Test St',
        status: 'completed', // Kunci utamanya: pesanan harus selesai
    });
    await db.OrderItem.create({
        orderId: order.id,
        productId: productId,
        quantity: 1,
        price: 100000,
    });
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  describe('POST /api/v1/reviews', () => {
    it('should allow a user who purchased the item to post a review', async () => {
      const response = await request(app)
        .post('/api/v1/reviews')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: productId,
          rating: 5,
          comment: 'Produk ini sangat luar biasa!',
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.data.rating).toBe(5);
    });

    it('should return 403 Forbidden if user has not purchased the item', async () => {
        const response = await request(app)
            .post('/api/v1/reviews')
            .set('Authorization', `Bearer ${userTokenNoPurchase}`)
            .send({
                productId: productId,
                rating: 1,
                comment: 'Saya tidak beli tapi ingin review',
            });
  
        expect(response.statusCode).toBe(403);
        expect(response.body.message).toContain('You can only review products you have purchased');
    });

    it('should return 409 Conflict if user tries to review the same product twice', async () => {
        const response = await request(app)
            .post('/api/v1/reviews')
            .set('Authorization', `Bearer ${userToken}`) // Gunakan token user pertama lagi
            .send({
                productId: productId,
                rating: 3,
                comment: 'Saya coba review lagi',
            });
  
        expect(response.statusCode).toBe(409);
        expect(response.body.message).toContain('You have already reviewed this product');
    });
  });

  describe('GET /api/v1/reviews/product/:productId', () => {
    it('should allow anyone to get reviews for a product', async () => {
        const response = await request(app)
            .get(`/api/v1/reviews/product/${productId}`);
        
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0].comment).toBe('Produk ini sangat luar biasa!');
    });
  });
});
