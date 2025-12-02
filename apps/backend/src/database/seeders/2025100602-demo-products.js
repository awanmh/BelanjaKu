'use strict';
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);

    // --- PENGGUNA ---
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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: sellerId,
        fullName: 'Toko Sejahtera',
        email: 'seller@toko.com',
        password: await bcrypt.hash('password123', salt),
        role: 'seller',
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // --- KATEGORI ---
    const electronicsId = uuidv4();
    const booksId = uuidv4();
    await queryInterface.bulkInsert('categories', [
      {
        id: electronicsId,
        name: 'Electronics',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: booksId,
        name: 'Books',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // --- PRODUK ---
    await queryInterface.bulkInsert('products', [
      {
        id: uuidv4(),
        name: 'Wireless Mouse Pro',
        description: 'A comfortable and reliable wireless mouse for professionals.',
        price: 250000.00,
        stock: 50,
        imageUrl: 'https://placehold.co/600x400/EEE/31343C?text=Mouse',
        sellerId: sellerId,
        categoryId: electronicsId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Mechanical Keyboard RGB',
        description: 'RGB mechanical keyboard with blue switches for the best typing experience.',
        price: 750000.00,
        stock: 30,
        imageUrl: 'https://placehold.co/600x400/EEE/31343C?text=Keyboard',
        sellerId: sellerId,
        categoryId: electronicsId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'The Art of Clean Code',
        description: 'A must-read book for every software developer.',
        price: 150000.00,
        stock: 100,
        imageUrl: 'https://placehold.co/600x400/EEE/31343C?text=Book',
        sellerId: sellerId,
        categoryId: booksId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    // Hapus data dalam urutan terbalik
    await queryInterface.bulkDelete('products', null, {});
    await queryInterface.bulkDelete('categories', null, {});
    await queryInterface.bulkDelete('users', null, {});
  },
};
