import request from 'supertest';
import app from '../../server';
import db from '../../database/models';

describe('Category API Endpoints (Admin)', () => {
  let adminToken: string;
  let categoryId: string;

  beforeAll(async () => {
    await db.sequelize.sync({ force: true });

    // 1. Buat user admin
    await request(app).post('/api/v1/auth/register').send({
      fullName: 'Admin Category',
      email: 'admin.category@test.com',
      password: 'Password123',
    });
    const adminUser = await db.User.findOne({ where: { email: 'admin.category@test.com' } });
    await adminUser!.update({ role: 'admin' });

    // Login sebagai admin untuk mendapatkan token
    const adminLoginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin.category@test.com',
      password: 'Password123',
    });
    adminToken = adminLoginRes.body.data.tokens.accessToken;
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  describe('POST /api/v1/categories', () => {
    it('should allow an admin to create a new category', async () => {
      const response = await request(app)
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Peralatan Dapur' });

      expect(response.statusCode).toBe(201);
      expect(response.body.data.name).toBe('Peralatan Dapur');
      categoryId = response.body.data.id; // Simpan untuk tes selanjutnya
    });

    it('should prevent non-admin users from creating a category', async () => {
        // Buat user biasa
        await request(app).post('/api/v1/auth/register').send({ fullName: 'Regular User', email: 'user.cat@test.com', password: 'Password123'});
        const loginRes = await request(app).post('/api/v1/auth/login').send({ email: 'user.cat@test.com', password: 'Password123'});
        const userToken = loginRes.body.data.tokens.accessToken;

        const response = await request(app)
            .post('/api/v1/categories')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ name: 'Baju Anak' });
        
        expect(response.statusCode).toBe(403); // Forbidden
    });
  });

  describe('GET /api/v1/categories', () => {
    it('should allow anyone to get a list of categories with pagination', async () => {
        const response = await request(app).get('/api/v1/categories');

        expect(response.statusCode).toBe(200);
        // FIX: Periksa struktur data paginasi yang baru
        expect(response.body.data).toHaveProperty('rows');
        expect(response.body.data).toHaveProperty('pagination');
        expect(Array.isArray(response.body.data.rows)).toBe(true);
        expect(response.body.data.rows.length).toBe(1);
    });
  });

  describe('DELETE /api/v1/categories/:id', () => {
    it('should allow an admin to delete a category', async () => {
        const response = await request(app)
            .delete(`/api/v1/categories/${categoryId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });
  });
});
