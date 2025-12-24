import request from 'supertest';
import app from '../../server';
import db from '../../database/models';
import path from 'path';
import fs from 'fs';

// Pastikan folder 'uploads' ada sebelum tes berjalan
const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Path ke gambar contoh
const testImagePath = path.resolve(__dirname, 'test-image.png');

// Buat file gambar contoh jika belum ada
if (!fs.existsSync(testImagePath)) {
  // Membuat buffer gambar PNG 1x1 pixel transparan sederhana
  const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
  fs.writeFileSync(testImagePath, buffer);
}

describe('Product API Endpoints', () => {
  let sellerToken: string;
  let sellerId: string;
  let categoryId: string;
  let productId: string;

  beforeAll(async () => {
    await db.sequelize.sync({ force: true });

    await request(app)
      .post('/api/v1/auth/register')
      .send({
        fullName: 'Test Seller',
        email: 'seller.product@test.com',
        password: 'Password123',
      });

    const sellerUser = await db.User.findOne({ where: { email: 'seller.product@test.com' } });
    await sellerUser!.update({ role: 'seller' });
    sellerId = sellerUser!.id;

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'seller.product@test.com', password: 'Password123' });
    sellerToken = loginRes.body.data.tokens.accessToken;

    const category = await db.Category.create({ name: 'Test Category' });
    categoryId = category.id;
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  describe('POST /api/v1/products', () => {
    it('should create a new product and return 201 Created', async () => {
      const response = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${sellerToken}`)
        .field('name', 'Laptop Gaming')
        .field('description', 'Laptop super cepat')
        .field('price', 25000000)
        .field('stock', 15)
        .field('categoryId', categoryId)
        .attach('productImage', testImagePath);

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Laptop Gaming');
      expect(response.body.data.sellerId).toBe(sellerId);
      productId = response.body.data.id;
    });

    it('should return 401 Unauthorized if no token is provided', async () => {
      const response = await request(app)
        .post('/api/v1/products')
        .send({ name: 'Illegal Product' });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('GET /api/v1/products', () => {
    it('should get a list of products and return 200 OK', async () => {
      const response = await request(app).get('/api/v1/products');
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.rows)).toBe(true);
      expect(response.body.data.rows.length).toBeGreaterThan(0);
    });
  });

  describe('PUT /api/v1/products/:id', () => {
    it('should update the product if user is the owner', async () => {
      const response = await request(app)
        .put(`/api/v1/products/${productId}`)
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({ name: 'Laptop Gaming Updated' });

      expect(response.statusCode).toBe(200);
      expect(response.body.data.name).toBe('Laptop Gaming Updated');
    });

    it('should return 403 Forbidden if another user tries to update', async () => {
      // Buat user lain (non-owner)
      await request(app).post('/api/v1/auth/register').send({ fullName: 'Another User', email: 'another@user.com', password: 'Password123' });
      const loginRes = await request(app).post('/api/v1/auth/login').send({ email: 'another@user.com', password: 'Password123' });
      const anotherUserToken = loginRes.body.data.tokens.accessToken;

      const response = await request(app)
        .put(`/api/v1/products/${productId}`)
        .set('Authorization', `Bearer ${anotherUserToken}`) // Gunakan token user lain
        .send({ name: 'Hacked Name' });

      expect(response.statusCode).toBe(403);
    });
  });
});

