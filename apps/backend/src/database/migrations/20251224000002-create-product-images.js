"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("product_images", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
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
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isPrimary: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      type: {
        type: Sequelize.STRING, // 'image' or 'video'
        defaultValue: "image",
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

    // Add index for faster lookups
    await queryInterface.addIndex("product_images", ["productId"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("product_images");
  },
};
