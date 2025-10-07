// File ini bertindak sebagai jembatan antara Sequelize CLI (JS) dan konfigurasi kita (TS).

// 1. Mengaktifkan dukungan TypeScript secara langsung
require('ts-node/register');

// 2. Memuat dan mengekspor konfigurasi dari file .ts asli Anda
module.exports = require('./database.config.ts');
