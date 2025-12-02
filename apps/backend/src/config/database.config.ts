// Menggunakan require (CommonJS) agar kompatibel dengan Sequelize CLI
const { config } = require('./env.config');

// Konfigurasi ini digunakan oleh Sequelize CLI untuk menjalankan migrasi dan seeder
module.exports = {
  development: {
    username: config.DB_USER,
    password: config.DB_PASS,
    database: config.DB_NAME,
    host: config.DB_HOST,
    port: config.DB_PORT,
    dialect: 'postgres'
  },
  test: {
    username: config.DB_USER,
    password: config.DB_PASS,
    database: `${config.DB_NAME}_test`,
    host: config.DB_HOST,
    port: config.DB_PORT,
    dialect: 'postgres'
  },
  production: {
    use_env_variable: 'DATABASE_URL', // Penting untuk deployment
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Sesuaikan berdasarkan provider hosting Anda
      }
    }
  }
};

