"use strict";
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordHash = await bcrypt.hash("password123", 10); // Password default untuk semua

    const users = [
      {
        id: uuidv4(),
        fullName: "Super Admin",
        email: "admin@belanjaku.com",
        password: passwordHash,
        role: "admin",
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        fullName: "Juragan Seller",
        email: "seller@belanjaku.com",
        password: passwordHash,
        role: "seller",
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        fullName: "Pembeli Setia",
        email: "user@belanjaku.com",
        password: passwordHash,
        role: "user",
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("users", users, {});

    // Create Seller Profile for the seller user
    const sellerUser = users.find((u) => u.email === "seller@belanjaku.com");
    await queryInterface.bulkInsert("sellers", [
      {
        id: uuidv4(),
        userId: sellerUser.id,
        storeName: "Toko Serba Ada",
        storeAddress: "Jl. Teknologi No. 1, Jakarta",
        storePhoneNumber: "081234567890",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "users",
      {
        email: [
          "admin@belanjaku.com",
          "seller@belanjaku.com",
          "user@belanjaku.com",
        ],
      },
      {}
    );
    // Seller profile will be deleted via cascade or handled manually if strict
  },
};
