"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // 1. SAFEGUARD: Hapus tabel 'cart_items' jika sudah ada (sisa dari migrasi gagal)
      // Ini penting karena migrasi sebelumnya mungkin meninggalkan tabel "zombie"
      await queryInterface.dropTable("cart_items", { transaction });

      // 2. Buat Tabel Baru
      await queryInterface.createTable(
        "cart_items",
        {
          id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
          },
          userId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: "users",
              key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
          productId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: "products",
              key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
          quantity: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1,
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
        },
        { transaction }
      );

      // 3. Tambahkan Unique Index
      // Menggunakan addIndex lebih aman secara sintaks SQL dibanding addConstraint untuk kasus ini
      await queryInterface.addIndex("cart_items", ["userId", "productId"], {
        unique: true,
        name: "unique_user_product_cart_idx",
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("cart_items");
  },
};
