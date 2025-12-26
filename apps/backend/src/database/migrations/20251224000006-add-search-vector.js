"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Cek struktur tabel terlebih dahulu untuk menghindari error
    const tableDefinition = await queryInterface.describeTable("products");

    // 2. Add column search_vector (TSVECTOR) hanya jika belum ada
    if (!tableDefinition.search_vector) {
      await queryInterface.addColumn("products", "search_vector", {
        type: "TSVECTOR",
        allowNull: true,
      });
    }

    // 3. Create GIN index for fast search
    try {
      await queryInterface.addIndex("products", ["search_vector"], {
        using: "GIN",
        name: "products_search_vector_idx",
      });
    } catch (e) {
      // Ignore if index already exists
      console.log(
        "Index products_search_vector_idx might already exist, skipping."
      );
    }

    // 4. Update existing data (Isi data kolom search_vector yang baru dibuat)
    // Menggunakan COALESCE agar jika name/description null tidak merusak query
    await queryInterface.sequelize.query(`
      UPDATE "products" 
      SET "search_vector" = to_tsvector('english', COALESCE("name", '') || ' ' || COALESCE("description", ''));
    `);

    // 5. Create function (OR REPLACE makes it idempotent)
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION products_search_vector_trigger() RETURNS trigger AS $$
      BEGIN
        new.search_vector := to_tsvector('english', COALESCE(new.name, '') || ' ' || COALESCE(new.description, ''));
        return new;
      END
      $$ LANGUAGE plpgsql;
    `);

    // 6. Create trigger (Drop first to ensure idempotency)
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS tsvectorupdate ON "products";
    `);
    
    await queryInterface.sequelize.query(`
      CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
      ON "products" FOR EACH ROW EXECUTE PROCEDURE products_search_vector_trigger();
    `);
  },

  async down(queryInterface, Sequelize) {
    // Drop trigger
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS tsvectorupdate ON "products";
    `);

    // Drop function
    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS products_search_vector_trigger();
    `);

    // Remove index
    try {
      await queryInterface.removeIndex("products", "products_search_vector_idx");
    } catch (e) {
      console.log("Index not found, skipping removal.");
    }

    // Remove column
    const tableDefinition = await queryInterface.describeTable("products");
    if (tableDefinition.search_vector) {
      await queryInterface.removeColumn("products", "search_vector");
    }
  },
};