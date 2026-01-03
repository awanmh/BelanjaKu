<<<<<<< HEAD
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Menambahkan kolom resetPasswordToken
    await queryInterface.addColumn("users", "resetPasswordToken", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Menambahkan kolom resetPasswordExpires
    await queryInterface.addColumn("users", "resetPasswordExpires", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Menghapus kolom jika migrasi dibatalkan (undo)
    await queryInterface.removeColumn("users", "resetPasswordToken");
    await queryInterface.removeColumn("users", "resetPasswordExpires");
  },
=======
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
>>>>>>> frontend-role
};
