"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable("products");

    // 1. Add column search_vector (TSVECTOR) if not exists
    if (!tableInfo.search_vector) {
      await queryInterface.addColumn("products", "search_vector", {
        type: "TSVECTOR",
        allowNull: true,
      });
    }

    // 2. Create GIN index for fast search
    try {
      await queryInterface.addIndex("products", ["search_vector"], {
        using: "GIN",
        name: "products_search_vector_idx",
      });
    } catch (e) {
      // Ignore if index already exists
      console.log("Index products_search_vector_idx might already exist, skipping.");
    }

    // 3. Update existing data
    await queryInterface.sequelize.query(`
      UPDATE "products" SET "search_vector" = to_tsvector('english', "name" || ' ' || "description");
    `);

    // 4. Create function (OR REPLACE makes it idempotent)
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION products_search_vector_trigger() RETURNS trigger AS $$
      BEGIN
        new.search_vector := to_tsvector('english', new.name || ' ' || new.description);
        return new;
      END
      $$ LANGUAGE plpgsql;
    `);

    // 5. Create trigger (Drop first to ensure idempotency)
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
    await queryInterface.removeIndex("products", "products_search_vector_idx");

    // Remove column
    await queryInterface.removeColumn("products", "search_vector");
  },
};
