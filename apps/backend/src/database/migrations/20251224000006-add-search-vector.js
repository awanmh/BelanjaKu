"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Cek struktur tabel terlebih dahulu
    const tableDefinition = await queryInterface.describeTable("products");

    // 2. Tambahkan kolom search_vector jika belum ada
    if (!tableDefinition.search_vector) {
      await queryInterface.addColumn("products", "search_vector", {
        type: "TSVECTOR",
        allowNull: true,
      });
    }

    // 3. Buat index GIN untuk mempercepat pencarian
    try {
      await queryInterface.addIndex("products", ["search_vector"], {
        using: "GIN",
        name: "products_search_vector_idx",
      });
    } catch (e) {
      console.log("Index products_search_vector_idx mungkin sudah ada, dilewati.");
    }

    // 4. Update data existing agar kolom search_vector terisi
    await queryInterface.sequelize.query(`
      UPDATE "products" 
      SET "search_vector" = to_tsvector(
        'english', 
        COALESCE("name", '') || ' ' || COALESCE("description", '')
      );
    `);

    // 5. Buat function trigger (idempotent dengan OR REPLACE)
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION products_search_vector_trigger() RETURNS trigger AS $$
      BEGIN
        NEW.search_vector := to_tsvector(
          'english', 
          COALESCE(NEW.name, '') || ' ' || COALESCE(NEW.description, '')
        );
        RETURN NEW;
      END
      $$ LANGUAGE plpgsql;
    `);

    // 6. Buat trigger (hapus dulu kalau sudah ada)
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS tsvectorupdate ON "products";
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER tsvectorupdate 
      BEFORE INSERT OR UPDATE ON "products"
      FOR EACH ROW EXECUTE PROCEDURE products_search_vector_trigger();
    `);
  },

  async down(queryInterface, Sequelize) {
    // Hapus trigger
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS tsvectorupdate ON "products";
    `);

    // Hapus function
    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS products_search_vector_trigger();
    `);

    // Hapus index (aman dengan try-catch)
    try {
      await queryInterface.removeIndex("products", "products_search_vector_idx");
    } catch (e) {
      console.log("Index not found, skipping removal.");
    }

    // Hapus kolom jika ada
    const tableDefinition = await queryInterface.describeTable("products");
    if (tableDefinition.search_vector) {
      await queryInterface.removeColumn("products", "search_vector");
    }
  },
};