"use strict";
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const passwordHash = await bcrypt.hash("password123", 10);

        const demoEmails = [
            "admin@belanjaku.com",
            "seller@belanjaku.com",
            "user@belanjaku.com"
        ];

        await queryInterface.bulkUpdate(
            "users",
            { password: passwordHash },
            { email: demoEmails }
        );
    },

    async down(queryInterface, Sequelize) {
        // No reversion needed
    },
};
