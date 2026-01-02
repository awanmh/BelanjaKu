"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
<<<<<<< HEAD
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
=======
    // Mulai transaksi
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // 1. Cek & Buat Kolom (Safe Check)
      // Kita cek dulu tabelnya untuk melihat kolom yang ada
      const tableInfo = await queryInterface.describeTable("products");

      if (!tableInfo.search_vector) {
        await queryInterface.addColumn(
          "products",
          "search_vector",
          {
            type: "TSVECTOR",
            allowNull: true,
          },
          { transaction }
        );
      }

      // 2. Buat Index (PERBAIKAN UTAMA DI SINI)
      // Menggunakan Raw Query "CREATE INDEX IF NOT EXISTS"
      // Ini mencegah error "relation already exists" yang mematikan transaksi PostgreSQL
      await queryInterface.sequelize.query(
        `CREATE INDEX IF NOT EXISTS "products_search_vector_idx" ON "products" USING GIN ("search_vector")`,
        { transaction }
      );

      // 3. Update Data Lama
      // Mengisi kolom search_vector untuk produk yang sudah ada
      await queryInterface.sequelize.query(
        `UPDATE "products" SET "search_vector" = to_tsvector('english', "name" || ' ' || COALESCE("description", ''));`,
        { transaction }
      );

      // 4. Buat Function untuk Trigger
      await queryInterface.sequelize.query(
        `
        CREATE OR REPLACE FUNCTION products_search_vector_trigger() RETURNS trigger AS $$
        BEGIN
          new.search_vector := to_tsvector('english', new.name || ' ' || COALESCE(new.description, ''));
          return new;
        END
        $$ LANGUAGE plpgsql;
        `,
        { transaction }
      );

      // 5. Buat Trigger (Drop dulu biar aman/idempotent)
      await queryInterface.sequelize.query(
        `DROP TRIGGER IF EXISTS tsvectorupdate ON "products";`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `
        CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
        ON "products" FOR EACH ROW EXECUTE PROCEDURE products_search_vector_trigger();
        `,
        { transaction }
      );

      // Jika semua sukses, commit perubahan
      await transaction.commit();

    } catch (error) {
      // Jika ada error fatal, batalkan semua perubahan
      await transaction.rollback();
      console.error("Migration Failed:", error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Hapus Trigger
      await queryInterface.sequelize.query(
        `DROP TRIGGER IF EXISTS tsvectorupdate ON "products";`,
        { transaction }
      );

      // Hapus Function
      await queryInterface.sequelize.query(
        `DROP FUNCTION IF EXISTS products_search_vector_trigger();`,
        { transaction }
      );

      // Hapus Index
      await queryInterface.sequelize.query(
        `DROP INDEX IF EXISTS "products_search_vector_idx";`,
        { transaction }
      );

      // Hapus Kolom
      await queryInterface.removeColumn("products", "search_vector", { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
>>>>>>> 49b30cf
    }
  },
};