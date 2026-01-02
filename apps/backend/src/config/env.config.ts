import dotenv from 'dotenv';
import path from 'path';

// Muat variabel lingkungan dari file .env yang sesuai
dotenv.config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || 'development'}`)
});

dotenv.config(); // Muat variabel dari .env utama jika ada
interface SMTPConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
}

interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  DB_HOST?: string;
  DB_PORT?: number;
  DB_USER?: string;
  DB_PASS?: string;
  DB_NAME?: string;
  DATABASE_URL?: string; // Untuk deployment (e.g., Railway, Render)
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES_IN: string;
  smtp: SMTPConfig;
}

// Ekspor konfigurasi yang sudah di-parse dan divalidasi
export const config: EnvConfig = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 5000,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: Number(process.env.DB_PORT),
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS || '',
  DB_NAME: process.env.DB_NAME,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  smtp: {
    host: process.env.SMTP_HOST || '', // Default string kosong jika tidak ada
    port: Number(process.env.SMTP_PORT) || 587, // Default port 587 (umum untuk TLS)
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'No Reply <noreply@example.com>',
  },
};
