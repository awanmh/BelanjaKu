'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(async (t) => {
            // 1. Tambahkan kolom search_vector dengan tipe TSVECTOR
            await queryInterface.sequelize.query(
                `ALTER TABLE products ADD COLUMN search_vector TSVECTOR;`,
                { transaction: t }
            );

            // 2. Buat GIN Index (Kunci kecepatan pencarian)
            await queryInterface.sequelize.query(
                `CREATE INDEX products_search_vector_idx ON products USING GIN (search_vector);`,
                { transaction: t }
            );

            // 3. Isi data awal (jika tabel sudah ada isinya)
            // Menggabungkan name dan description, menggunakan config 'english'
            await queryInterface.sequelize.query(
                `UPDATE products SET search_vector = 
         setweight(to_tsvector('english', coalesce(name, '')), 'A') || 
         setweight(to_tsvector('english', coalesce(description, '')), 'B');`,
                { transaction: t }
            );

            // 4. Buat Trigger agar data selalu update otomatis saat produk diedit/dibuat
            await queryInterface.sequelize.query(
                `CREATE FUNCTION products_search_vector_trigger() RETURNS trigger AS $$
         BEGIN
           new.search_vector := 
             setweight(to_tsvector('english', coalesce(new.name, '')), 'A') || 
             setweight(to_tsvector('english', coalesce(new.description, '')), 'B');
           RETURN new;
         END
         $$ LANGUAGE plpgsql;`,
                { transaction: t }
            );

            await queryInterface.sequelize.query(
                `CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
         ON products FOR EACH ROW EXECUTE PROCEDURE products_search_vector_trigger();`,
                { transaction: t }
            );
        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(async (t) => {
            await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS tsvectorupdate ON products;`, { transaction: t });
            await queryInterface.sequelize.query(`DROP FUNCTION IF EXISTS products_search_vector_trigger;`, { transaction: t });
            await queryInterface.sequelize.query(`DROP INDEX IF EXISTS products_search_vector_idx;`, { transaction: t });
            await queryInterface.sequelize.query(`ALTER TABLE products DROP COLUMN search_vector;`, { transaction: t });
        });
    },
};