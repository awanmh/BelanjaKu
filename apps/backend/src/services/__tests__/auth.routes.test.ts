import request from 'supertest';
import app from '../../server';
import db from '../../database/models';

describe('Auth API Endpoints', () => {
  // Sebelum semua tes di file ini berjalan, sinkronkan database
  beforeAll(async () => {
    // Menggunakan sync({ force: true }) akan membersihkan database sebelum setiap rangkaian tes
    // Ini memastikan tes berjalan di lingkungan yang bersih
    await db.sequelize.sync({ force: true });
  });

  // Setelah semua tes selesai, tutup koneksi database
  afterAll(async () => {
    await db.sequelize.close();
  });

  const testUser = {
    fullName: 'Integration Test User',
    email: 'integration@test.com',
    password: 'Password123',
  };

  // --- Tes untuk Endpoint Registrasi ---
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user and return 201 Created', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(testUser);

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(testUser.email);
      expect(response.body.data).not.toHaveProperty('password');
    });

    it('should return 422 Unprocessable Entity for invalid password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({ ...testUser, email: 'another@test.com', password: 'weak' });

      expect(response.statusCode).toBe(422);
    });

    it('should return 409 Conflict if email already exists', async () => {
      // User sudah dibuat di tes pertama, jadi ini seharusnya gagal
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(testUser);

      expect(response.statusCode).toBe(409);
    });
  });

  // --- Tes untuk Endpoint Login ---
  describe('POST /api/v1/auth/login', () => {
    it('should login the user and return tokens', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: testUser.email, password: testUser.password });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.tokens).toHaveProperty('accessToken');
    });

    it('should return 401 Unauthorized for incorrect password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: testUser.email, password: 'wrongpassword' });

      expect(response.statusCode).toBe(401);
    });
  });

  // --- Tes Baru untuk Rate Limiting ---
  describe('Rate Limiting', () => {
    it('should block requests after exceeding the limit', async () => {
        // Buat 10 permintaan yang akan gagal (misalnya dengan password salah)
        const requests = [];
        for (let i = 0; i < 10; i++) {
            requests.push(
                request(app)
                    .post('/api/v1/auth/login')
                    .send({ email: 'rate@limit.com', password: 'wrong' })
            );
        }
        await Promise.all(requests);

        // Permintaan ke-11 seharusnya sekarang diblokir
        const blockedResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: 'rate@limit.com', password: 'wrong' });
        
        expect(blockedResponse.statusCode).toBe(429);
        expect(blockedResponse.body.message).toContain('Too many login attempts');
    });
  });
});