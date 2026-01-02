"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("products", "weight", {
      type: Sequelize.INTEGER,
      allowNull: true, // Optional for now, but recommended
      defaultValue: 0,
      comment: "Weight in grams",
    });

    await queryInterface.addColumn("products", "length", {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "Length in cm",
    });

    await queryInterface.addColumn("products", "width", {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "Width in cm",
    });

    await queryInterface.addColumn("products", "height", {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "Height in cm",
    });

    // POSTGRESQL specific JSONB
    await queryInterface.addColumn("products", "attributes", {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: "Flexible product attributes (color, size, material)",
    });

    await queryInterface.addColumn("products", "averageRating", {
      type: Sequelize.FLOAT,
      allowNull: true,
      defaultValue: 0,
    });

    await queryInterface.addColumn("products", "soldCount", {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("products", "weight");
    await queryInterface.removeColumn("products", "length");
    await queryInterface.removeColumn("products", "width");
    await queryInterface.removeColumn("products", "height");
    await queryInterface.removeColumn("products", "attributes");
    await queryInterface.removeColumn("products", "averageRating");
    await queryInterface.removeColumn("products", "soldCount");
  },
};
