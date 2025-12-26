"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Add column search_vector (TSVECTOR)
    await queryInterface.addColumn("products", "search_vector", {
      type: "TSVECTOR",
      allowNull: true,
    });

    // 2. Create GIN index for fast search
    await queryInterface.addIndex("products", ["search_vector"], {
      using: "GIN",
      name: "products_search_vector_idx",
    });

    // 3. Create a trigger to automatically update search_vector on INSERT/UPDATE
    // Note: We search on 'name' and 'description'
    await queryInterface.sequelize.query(`
      UPDATE "products" SET "search_vector" = to_tsvector('english', "name" || ' ' || "description");
    `);

    // Create function to update trigger
    await queryInterface.sequelize.query(`
      CREATE FUNCTION products_search_vector_trigger() RETURNS trigger AS $$
      BEGIN
        new.search_vector := to_tsvector('english', new.name || ' ' || new.description);
        return new;
      END
      $$ LANGUAGE plpgsql;
    `);

    // Create trigger
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
