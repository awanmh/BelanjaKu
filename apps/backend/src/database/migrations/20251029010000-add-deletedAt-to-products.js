'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Menambahkan kolom 'deletedAt' ke tabel 'products' untuk mengaktifkan soft deletes.
     */
    await queryInterface.addColumn('products', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
      after: 'updatedAt' // Opsional: menempatkan kolom setelah updatedAt
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Menghapus kolom 'deletedAt' jika migrasi di-rollback.
     */
    await queryInterface.removeColumn('products', 'deletedAt');
  }
};