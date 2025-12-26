"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add TYPE column
    await queryInterface.addColumn("promotions", "type", {
      type: Sequelize.ENUM("DISCOUNT", "FLASH_SALE", "BUNDLE", "CASHBACK"),
      defaultValue: "DISCOUNT",
      allowNull: false,
    });

    await queryInterface.addColumn("promotions", "minPurchaseAmount", {
      type: Sequelize.DECIMAL(10, 2),
      defaultValue: 0,
      allowNull: false,
    });

    await queryInterface.addColumn("promotions", "maxDiscountAmount", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true, // Null means no limit
    });

    await queryInterface.addColumn("promotions", "quota", {
      type: Sequelize.INTEGER,
      allowNull: true, // Null means unlimited
    });

    await queryInterface.addColumn("promotions", "usageCount", {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("promotions", "type");
    await queryInterface.removeColumn("promotions", "minPurchaseAmount");
    await queryInterface.removeColumn("promotions", "maxDiscountAmount");
    await queryInterface.removeColumn("promotions", "quota");
    await queryInterface.removeColumn("promotions", "usageCount");
    // Note: Removing ENUM type in Postgres can be tricky, omitting for simplicity in this down migration
  },
};
