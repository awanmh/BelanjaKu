"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
<<<<<<< HEAD
    // 1. Pastikan kolom search_vector ada, kalau belum tambahkan
    const tableInfo = await queryInterface.describeTable("products");
    if (!tableInfo.search_vector) {
=======
    // 1. Cek struktur tabel terlebih dahulu untuk menghindari error
    const tableDefinition = await queryInterface.describeTable("products");

    // 2. Add column search_vector (TSVECTOR) hanya jika belum ada
    if (!tableDefinition.search_vector) {
>>>>>>> e907c2d7 (bf update)
      await queryInterface.addColumn("products", "search_vector", {
        type: "TSVECTOR",
        allowNull: true,
      });
    }

<<<<<<< HEAD
    // 2. Buat index GIN untuk mempercepat pencarian
=======
    // 3. Create GIN index for fast search
>>>>>>> e907c2d7 (bf update)
    try {
      await queryInterface.addIndex("products", ["search_vector"], {
        using: "GIN",
        name: "products_search_vector_idx",
      });
    } catch (e) {
      console.log("Index products_search_vector_idx mungkin sudah ada, dilewati.");
    }

<<<<<<< HEAD
    // 3. Update data existing agar kolom search_vector terisi
    await queryInterface.sequelize.query(`
      UPDATE "products" 
      SET "search_vector" = to_tsvector('english', "name" || ' ' || "description");
    `);

    // 4. Buat function trigger (idempotent dengan OR REPLACE)
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION products_search_vector_trigger() RETURNS trigger AS $$
      BEGIN
        NEW.search_vector := to_tsvector('english', NEW.name || ' ' || NEW.description);
        RETURN NEW;
=======
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
>>>>>>> e907c2d7 (bf update)
      END
      $$ LANGUAGE plpgsql;
    `);

<<<<<<< HEAD
    // 5. Buat trigger (hapus dulu kalau sudah ada)
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS tsvectorupdate ON "products";
    `);

=======
    // 6. Create trigger (Drop first to ensure idempotency)
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS tsvectorupdate ON "products";
    `);
    
>>>>>>> e907c2d7 (bf update)
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

<<<<<<< HEAD
    // Hapus index
    await queryInterface.removeIndex("products", "products_search_vector_idx");

    // Hapus kolom
    await queryInterface.removeColumn("products", "search_vector");
=======
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
>>>>>>> e907c2d7 (bf update)
  },
};