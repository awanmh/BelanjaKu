import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import ApiError from '../utils/api-error.util';
import { StatusCodes } from 'http-status-codes';

// Tentukan tipe file yang diizinkan
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Konfigurasi penyimpanan untuk Multer
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: Function) => {
    // Simpan file di folder 'uploads' di root proyek
    cb(null, 'uploads/');
  },
  filename: (req: Request, file: Express.Multer.File, cb: Function) => {
    // Buat nama file yang unik untuk menghindari konflik
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  },
});

// Filter untuk memvalidasi tipe file
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    // Terima file
    cb(null, true);
  } else {
    // Tolak file dan kirim error
    cb(new ApiError(StatusCodes.BAD_REQUEST, 'Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed.'));
  }
};

// Buat instance middleware upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // Batasi ukuran file hingga 5MB
  },
});

export default upload;
