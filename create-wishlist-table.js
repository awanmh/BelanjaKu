const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'belanjaku_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
    logging: console.log,
  }
);

async function createWishlistTable() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Create wishlists table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS wishlists (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
        "productId" UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Wishlists table created');

    // Create unique index
    await sequelize.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS unique_user_product_wishlist 
      ON wishlists("userId", "productId");
    `);
    console.log('✅ Unique index created');

    // Verify
    const [results] = await sequelize.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_name = 'wishlists';
    `);
    
    if (results.length > 0) {
      console.log('✅ Wishlists table verified!');
    } else {
      console.log('❌ Table not found');
    }

    await sequelize.close();
    console.log('✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createWishlistTable();
