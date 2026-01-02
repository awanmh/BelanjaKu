// backend/src/database/migrations/2025122501-create-cart-items.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("cart_items", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      cartId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "carts",
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
    });

    // Opsional: Tambahkan unique constraint agar satu user tidak punya double row untuk produk yang sama
    // (Logic update quantity akan menangani ini, tapi constraint DB lebih aman)
    // Perbaikan: Constraint harus UNIQUE(cartId, productId) bukan userId
    await queryInterface.addConstraint("cart_items", {
      fields: ["cartId", "productId"],
      type: "unique",
      name: "unique_cart_product_item",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("cart_items");
  },
};
