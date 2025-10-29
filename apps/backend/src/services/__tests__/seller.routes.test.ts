import request from 'supertest';
// FIX: Path impor diperbarui untuk mencerminkan lokasi file yang benar (naik 4 level)
import app from '../../server';
import db from '../../database/models';

describe('Seller API Endpoints', () => {
  let sellerToken: string;
  let sellerId: string;

  beforeAll(async () => {
    await db.sequelize.sync({ force: true });

    // Buat user dan jadikan seller
    await request(app).post('/api/v1/auth/register').send({
      fullName: 'Dashboard Seller',
      email: 'seller.dashboard@test.com',
      password: 'Password123',
    });
    const sellerUser = await db.User.findOne({ where: { email: 'seller.dashboard@test.com' } });
    await sellerUser!.update({ role: 'seller' });
    sellerId = sellerUser!.id;

    // Login untuk mendapatkan token
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'seller.dashboard@test.com',
      password: 'Password123',
    });
    sellerToken = loginRes.body.data.tokens.accessToken;
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  describe('Seller Profile Management', () => {
    it('should create a seller profile and return 200 OK', async () => {
      const response = await request(app)
        .post('/api/v1/sellers/profile')
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({
          storeName: 'Toko Sejahtera',
          storeAddress: 'Jl. Bahagia No. 1',
          storePhoneNumber: '08123456789',
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.storeName).toBe('Toko Sejahtera');
    });

    it('should get the seller profile', async () => {
      const response = await request(app)
        .get('/api/v1/sellers/profile/me')
        .set('Authorization', `Bearer ${sellerToken}`);
      
      expect(response.statusCode).toBe(200);
      expect(response.body.data.userId).toBe(sellerId);
    });
  });

  describe('Seller Dashboard', () => {
    it('should get dashboard stats', async () => {
        const response = await request(app)
            .get('/api/v1/sellers/dashboard/stats')
            .set('Authorization', `Bearer ${sellerToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('totalRevenue');
        expect(response.body.data).toHaveProperty('totalProductsSold');
        expect(response.body.data).toHaveProperty('totalOrders');
    });

    it('should get low stock products', async () => {
        const category = await db.Category.create({ name: 'Gadgets' });
        await db.Product.create({ 
            name: 'Power Bank', 
            description: 'A reliable power bank',
            price: 200000, 
            stock: 3, 
            lowStockThreshold: 5, 
            sellerId, 
            categoryId: category.id, 
            imageUrl: 'pb.jpg' 
        });

        const response = await request(app)
            .get('/api/v1/sellers/dashboard/low-stock')
            .set('Authorization', `Bearer ${sellerToken}`);
        
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0].name).toBe('Power Bank');
    });
  });
});

