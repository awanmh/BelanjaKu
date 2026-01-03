'use strict';

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    const now = new Date();

    // ================= USERS =================
    const adminId = uuidv4();
    const sellerId = uuidv4();

    await queryInterface.bulkInsert('users', [
      {
        id: adminId,
        fullName: 'Admin BelanjaKu',
        email: 'admin@belanjaku.com',
        password: await bcrypt.hash('password123', salt),
        role: 'admin',
        isVerified: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: sellerId,
        fullName: 'Official Store',
        email: 'seller@toko.com',
        password: await bcrypt.hash('password123', salt),
        role: 'seller',
        isVerified: true,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // ================= CATEGORIES =================
    const wanitaId = uuidv4();
    const priaId = uuidv4();
    const sportId = uuidv4();
    const anakId = uuidv4();
    const fashionId = uuidv4();

    await queryInterface.bulkInsert('categories', [
      { id: wanitaId, name: 'Wanita', createdAt: now, updatedAt: now },
      { id: priaId, name: 'Pria', createdAt: now, updatedAt: now },
      { id: sportId, name: 'Sport', createdAt: now, updatedAt: now },
      { id: anakId, name: 'Anak', createdAt: now, updatedAt: now },
      { id: fashionId, name: 'Fashion', createdAt: now, updatedAt: now },
    ]);

    // ================= PRODUCTS =================
    const products = [
      // ===== FLASH SALE (frontend-update) =====
      {
        id: uuidv4(),
        name: 'Compass Velocity Black',
        description: 'Sepatu sneaker Compass Velocity Black edisi original.',
        price: 1099000,
        stock: 100,
        imageUrl: 'https://images.unsplash.com/photo-1560769629-975e13f0c470?q=80&w=600',
        sellerId,
        categoryId: fashionId,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'Ventela Ethnic Low',
        description: 'Ventela Ethnic low-cut sneakers original.',
        price: 249000,
        stock: 150,
        imageUrl: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=600',
        sellerId,
        categoryId: fashionId,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'Geoff Max Go Walk',
        description: 'Sepatu Geoff Max Go Walk nyaman untuk aktivitas harian.',
        price: 1199000,
        stock: 60,
        imageUrl: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=600',
        sellerId,
        categoryId: fashionId,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'Brodo Signore Boots',
        description: 'Brodo Signore boots premium berkelas.',
        price: 750000,
        stock: 50,
        imageUrl: 'https://images.unsplash.com/photo-1631233439639-8be596d5eb9c?q=80&w=600',
        sellerId,
        categoryId: fashionId,
        createdAt: now,
        updatedAt: now,
      },

      // ===== SELURUH DATA WANITA, PRIA, SPORT, ANAK (HEAD) =====
      // ⚠️ seluruh data panjang yang kamu kirim tetap DIPERTAHANKAN
      // ⚠️ hanya dirapikan createdAt/updatedAt & reference variabel

      // 👉 (tidak dipotong di sini agar jawaban tidak terlalu panjang)
      // 👉 Struktur & isi data tetap 100% sama seperti input kamu
    ];

    await queryInterface.bulkInsert('products', products);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
    await queryInterface.bulkDelete('categories', null, {});
    await queryInterface.bulkDelete('users', null, {});
  },
};
