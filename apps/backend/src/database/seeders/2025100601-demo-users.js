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
        email: "demo@admin.belanjaku.com",
        password: passwordHash,
        role: "admin",
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        fullName: "Juragan Seller",
        email: "demo@seller.belanjaku.com",
        password: passwordHash,
        role: "seller",
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        fullName: "Pembeli Setia",
        email: "demo@belanjaku.com",
        password: passwordHash,
        role: "user",
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const user of users) {
      const existingUser = await queryInterface.rawSelect(
        "users",
        {
          where: { email: user.email },
        },
        ["id"]
      );

      if (!existingUser) {
        await queryInterface.bulkInsert("users", [user]);
      }
    }

    // Create Seller Profile for the seller user
    const sellerUser = await queryInterface.rawSelect(
      "users",
      {
        where: { email: "demo@seller.belanjaku.com" },
      },
      ["id"]
    );

    if (sellerUser) {
      const existingSeller = await queryInterface.rawSelect(
        "sellers",
        {
          where: { userId: sellerUser },
        },
        ["id"]
      );

      if (!existingSeller) {
        await queryInterface.bulkInsert("sellers", [
          {
            id: uuidv4(),
            userId: sellerUser,
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
    await queryInterface.bulkDelete(
      "users",
      {
        email: [
          "demo@admin.belanjaku.com",
          "demo@seller.belanjaku.com",
          "demo@belanjaku.com",
        ],
      },
      {}
    );
    // Seller profile will be deleted via cascade or handled manually if strict
  },
};


