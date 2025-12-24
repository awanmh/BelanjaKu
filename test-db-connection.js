const { Sequelize } = require('sequelize');
require('dotenv').config();

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'ecommerce_db',
  dialect: 'postgres'
};

console.log('🔍 Testing Database Connection...\n');
console.log('Configuration:');
console.log(`  Host: ${config.host}`);
console.log(`  Port: ${config.port}`);
console.log(`  Database: ${config.database}`);
console.log(`  User: ${config.username}`);
console.log(`  Password: ${'*'.repeat(config.password.length)}\n`);

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: false
  }
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection successful!\n');
    
    // Test query to get all tables
    const [results] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('📊 Tables in database:');
    if (results.length === 0) {
      console.log('  ⚠️  No tables found. Run migrations: npm run db:migrate\n');
    } else {
      results.forEach((row, index) => {
        console.log(`  ${index + 1}. ${row.table_name}`);
      });
      console.log(`\n  Total: ${results.length} tables\n`);
    }
    
    // Check for essential tables
    const essentialTables = [
      'users', 'products', 'categories', 'orders', 
      'order_items', 'carts', 'wishlists', 'reviews'
    ];
    
    const tableNames = results.map(r => r.table_name);
    const missingTables = essentialTables.filter(t => !tableNames.includes(t));
    
    if (missingTables.length > 0) {
      console.log('⚠️  Missing essential tables:');
      missingTables.forEach(table => {
        console.log(`  - ${table}`);
      });
      console.log('\n💡 Run: npm run db:migrate\n');
    } else {
      console.log('✅ All essential tables exist!\n');
    }
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed!\n');
    console.error('Error details:');
    console.error(`  Message: ${error.message}`);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n💡 Troubleshooting:');
      console.error('  1. Make sure PostgreSQL is running');
      console.error('  2. Check if the port is correct (default: 5432)');
      console.error('  3. Verify PostgreSQL service is started');
    } else if (error.message.includes('password authentication failed')) {
      console.error('\n💡 Troubleshooting:');
      console.error('  1. Check DB_USER and DB_PASS in .env file');
      console.error('  2. Verify PostgreSQL user credentials');
    } else if (error.message.includes('database') && error.message.includes('does not exist')) {
      console.error('\n💡 Troubleshooting:');
      console.error('  1. Create the database first:');
      console.error(`     psql -U postgres -c "CREATE DATABASE ${config.database};"`);
    }
    
    await sequelize.close();
    process.exit(1);
  }
}

testConnection();
