'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const tableInfo = await queryInterface.describeTable("users");

        if (!tableInfo.resetPasswordToken) {
            await queryInterface.addColumn('users', 'resetPasswordToken', {
                type: Sequelize.STRING,
                allowNull: true,
            });
        }

        if (!tableInfo.resetPasswordExpires) {
            await queryInterface.addColumn('users', 'resetPasswordExpires', {
                type: Sequelize.DATE,
                allowNull: true,
            });
        }
    },

    async down(queryInterface, Sequelize) {
        const tableInfo = await queryInterface.describeTable("users");

        if (tableInfo.resetPasswordToken) {
            await queryInterface.removeColumn('users', 'resetPasswordToken');
        }
        if (tableInfo.resetPasswordExpires) {
            await queryInterface.removeColumn('users', 'resetPasswordExpires');
        }
    },
};
