import winston from 'winston';
import { config as env } from '../config/env.config';

// Tentukan level logging yang berbeda
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Tentukan warna untuk setiap level (opsional, untuk tampilan di konsol)
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};
winston.addColors(colors);

// Tentukan format log
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  // Jika di development, gunakan format warna
  env.NODE_ENV === 'development' ? winston.format.colorize({ all: true }) : winston.format.uncolorize(),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Tentukan 'transports', yaitu tujuan output log (konsol, file, dll.)
const transports = [
  // Selalu tampilkan log di konsol
  new winston.transports.Console(),
  
  // Jika di production, simpan log error ke dalam file
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),

  // Simpan semua log ke file lain
  new winston.transports.File({ filename: 'logs/all.log' }),
];

// Buat instance logger
const logger = winston.createLogger({
  level: env.NODE_ENV === 'development' ? 'debug' : 'warn',
  levels,
  format,
  transports,
});

export default logger;
