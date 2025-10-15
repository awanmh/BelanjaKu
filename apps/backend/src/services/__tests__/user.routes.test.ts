import request from 'supertest';
import app from '../../server';
import db from '../../database/models';

describe('User Management API Endpoints (Admin)', () => {
  let adminToken: string;
  let regularUserId: string;

  beforeAll(async () => {
    await db.sequelize.sync({ force: true });

    // 1. Buat user admin
    await request(app).post('/api/v1/auth/register').send({
      fullName: 'Admin User',
      email: 'admin.users@test.com',
      password: 'Password123',
    });
    const adminUser = await db.User.findOne({ where: { email: 'admin.users@test.com' } });
    await adminUser!.update({ role: 'admin' });

    // Login sebagai admin untuk mendapatkan token
    const adminLoginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin.users@test.com',
      password: 'Password123',
    });
    adminToken = adminLoginRes.body.data.tokens.accessToken;

    // 2. Buat user biasa untuk dikelola
    const userRes = await request(app).post('/api/v1/auth/register').send({
      fullName: 'Regular User',
      email: 'regular.user@test.com',
      password: 'Password123',
    });
    regularUserId = userRes.body.data.id;
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  describe('GET /api/v1/users', () => {
    it('should allow an admin to get a list of all users', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(2); // Admin dan user biasa
    });
  });

  describe('PUT /api/v1/users/:id', () => {
    it('should allow an admin to update a user role', async () => {
      const response = await request(app)
        .put(`/api/v1/users/${regularUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'seller' });

      expect(response.statusCode).toBe(200);
      expect(response.body.data.role).toBe('seller');
    });
  });

  describe('DELETE /api/v1/users/:id', () => {
    it('should allow an admin to delete a user', async () => {
      const response = await request(app)
        .delete(`/api/v1/users/${regularUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);

      // Verifikasi bahwa user benar-benar sudah dihapus
      const deletedUser = await db.User.findByPk(regularUserId);
      expect(deletedUser).toBeNull();
    });
  });
});
