"use strict";
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const passwordHash = await bcrypt.hash("password123", 10);

        // 1. List of users to ensure
        const targetUsers = [
            {
                email: "admin@belanjaku.com",
                role: "admin",
                fullName: "Super Admin",
            },
            {
                email: "seller@belanjaku.com",
                role: "seller",
                fullName: "Juragan Seller",
            },
            {
                email: "user@belanjaku.com",
                role: "user",
                fullName: "Pembeli Setia",
            },
        ];

        for (const u of targetUsers) {
            // Check if user exists
            const existingId = await queryInterface.rawSelect(
                "users",
                {
                    where: { email: u.email },
                },
                ["id"]
            );

            if (existingId) {
                // User exists -> Update password to be sure
                await queryInterface.bulkUpdate(
                    "users",
                    { password: passwordHash },
                    { email: u.email }
                );
            } else {
                // User missing -> Insert
                await queryInterface.bulkInsert("users", [
                    {
                        id: uuidv4(),
                        email: u.email,
                        password: passwordHash,
                        role: u.role,
                        fullName: u.fullName,
                        isVerified: true,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                ]);
            }
        }

        // 2. Ensure Seller Profile
        // Get seller user ID
        const sellerId = await queryInterface.rawSelect(
            "users",
            {
                where: { email: "seller@belanjaku.com" },
            },
            ["id"]
        );

        if (sellerId) {
            const existingSeller = await queryInterface.rawSelect(
                "sellers",
                {
                    where: { userId: sellerId },
                },
                ["id"]
            );

            if (!existingSeller) {
                await queryInterface.bulkInsert("sellers", [
                    {
                        id: uuidv4(),
                        userId: sellerId,
                        storeName: "Toko Serba Ada",
                        storeAddress: "Jl. Teknologi No. 1, Jakarta",
                        storePhoneNumber: "081234567890",
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                ]);
            }
        }
    },

    async down(queryInterface, Sequelize) {
        // No revert necessary (idempotent fix)
    },
};
