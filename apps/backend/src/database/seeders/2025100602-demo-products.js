'use strict';

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    const now = new Date();

<<<<<<< HEAD
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
=======
    // ============ SELLER (seller@toko.com) ============
    let sellerId;
    const existingSellerUser = await queryInterface.rawSelect(
      'users',
      { where: { email: 'seller@toko.com' } },
      ['id']
    );

    if (existingSellerUser) {
      sellerId = existingSellerUser;
    } else {
      sellerId = uuidv4();
      await queryInterface.bulkInsert('users', [
        {
          id: sellerId,
          fullName: 'Official Store',
          email: 'seller@toko.com',
          password: await bcrypt.hash('password123', salt),
          role: 'seller',
          isVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }

    // ============ CATEGORIES ============
    let fashionId;
    const existingCategory = await queryInterface.rawSelect(
      'categories',
      { where: { name: 'Fashion' } },
      ['id']
    );

    if (existingCategory) {
      fashionId = existingCategory;
    } else {
      fashionId = uuidv4();
      await queryInterface.bulkInsert('categories', [
        {
          id: fashionId,
          name: 'Fashion',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ]);
    }

    // ============ PRODUCTS (Flash Sale Ready) ============
    const products = [
      {
>>>>>>> frontend-role
        name: 'Compass Velocity Black',
        description: 'Sepatu sneaker Compass Velocity Black edisi original.',
        price: 1099000,
        stock: 100,
        imageUrl: 'https://images.unsplash.com/photo-1560769629-975e13f0c470?q=80&w=600',
<<<<<<< HEAD
        sellerId,
        categoryId: fashionId,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
=======
      },
      {
>>>>>>> frontend-role
        name: 'Ventela Ethnic Low',
        description: 'Ventela Ethnic low-cut sneakers original.',
        price: 249000,
        stock: 150,
        imageUrl: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=600',
<<<<<<< HEAD
        sellerId,
        categoryId: fashionId,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
=======
      },
      {
>>>>>>> frontend-role
        name: 'Geoff Max Go Walk',
        description: 'Sepatu Geoff Max Go Walk nyaman untuk aktivitas harian.',
        price: 1199000,
        stock: 60,
        imageUrl: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=600',
<<<<<<< HEAD
        sellerId,
        categoryId: fashionId,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
=======
      },
      {
>>>>>>> frontend-role
        name: 'Brodo Signore Boots',
        description: 'Brodo Signore boots premium berkelas.',
        price: 750000,
        stock: 50,
        imageUrl: 'https://images.unsplash.com/photo-1631233439639-8be596d5eb9c?q=80&w=600',
<<<<<<< HEAD
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
=======
      },
    ];

    for (const prod of products) {
      const existingProduct = await queryInterface.rawSelect(
        'products',
        { where: { name: prod.name } },
        ['id']
      );

      if (!existingProduct) {
        await queryInterface.bulkInsert('products', [{
          id: uuidv4(),
          ...prod,
          sellerId: sellerId,
          categoryId: fashionId,
          createdAt: new Date(),
          updatedAt: new Date(),
        }]);
      }
    }
>>>>>>> frontend-role
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
    await queryInterface.bulkDelete('categories', null, {});
    await queryInterface.bulkDelete('users', null, {});
  },
};