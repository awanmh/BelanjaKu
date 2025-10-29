import request from 'supertest';
import app from '../../server';
import db from '../../database/models';

describe('Shipping API Endpoints (Admin)', () => {
  let adminToken: string;
  let userToken: string;
  let shippingOptionId: string;

  beforeAll(async () => {
    await db.sequelize.sync({ force: true });

    // 1. Buat user admin
    await request(app).post('/api/v1/auth/register').send({
      fullName: 'Admin Shipping',
      email: 'admin.shipping@test.com',
      password: 'Password123',
    });
    const adminUser = await db.User.findOne({ where: { email: 'admin.shipping@test.com' } });
    await adminUser!.update({ role: 'admin' });
    const adminLoginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin.shipping@test.com',
      password: 'Password123',
    });
    adminToken = adminLoginRes.body.data.tokens.accessToken;

    // 2. Buat user biasa
    await request(app).post('/api/v1/auth/register').send({
        fullName: 'Regular User Shipping',
        email: 'user.shipping@test.com',
        password: 'Password123',
    });
    const loginRes = await request(app).post('/api/v1/auth/login').send({ email: 'user.shipping@test.com', password: 'Password123'});
    userToken = loginRes.body.data.tokens.accessToken;
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  describe('POST /api/v1/shipping', () => {
    it('should allow an admin to create a new shipping option', async () => {
      const response = await request(app)
        .post('/api/v1/shipping')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
            name: 'JNE REG',
            description: 'Layanan Reguler',
            price: 15000,
            estimatedDays: 3
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.data.name).toBe('JNE REG');
      shippingOptionId = response.body.data.id; // Simpan untuk tes selanjutnya
    });

    it('should prevent non-admin users from creating a shipping option', async () => {
        const response = await request(app)
            .post('/api/v1/shipping')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ name: 'J&T', description: 'Layanan J&T', price: 12000, estimatedDays: 2 });
        
        expect(response.statusCode).toBe(403); // Forbidden
    });
  });

  describe('GET /api/v1/shipping', () => {
    it('should allow anyone to get a list of shipping options', async () => {
        const response = await request(app).get('/api/v1/shipping');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBe(1);
    });
  });

  describe('DELETE /api/v1/shipping/:id', () => {
    it('should allow an admin to delete a shipping option', async () => {
        const response = await request(app)
            .delete(`/api/v1/shipping/${shippingOptionId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });
  });
});
