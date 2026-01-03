"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
<<<<<<< HEAD
    // WISHLIST TABLE creation removed as it duplicates 2025100612-create-wishlist.js
    // If you need to modify wishlists, use a separate migration file.
=======
    // WISHLIST TABLE
    await queryInterface.createTable("wishlists", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      productId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "products", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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

    await queryInterface.addIndex("wishlists", ["userId", "productId"], {
      unique: true,
      name: "unique_user_product_wishlist",
    });
>>>>>>> frontend-role

    // NOTIFICATIONS TABLE
    await queryInterface.createTable("notifications", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM("ORDER", "PROMO", "SYSTEM", "TRANSACTION"),
        defaultValue: "SYSTEM",
      },
      isRead: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      metadata: {
        type: Sequelize.JSONB,
        allowNull: true,
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("notifications");
<<<<<<< HEAD
    // await queryInterface.dropTable("wishlists"); // Removed duplicate drop
=======
    await queryInterface.dropTable("wishlists");
>>>>>>> frontend-role
  },
};
