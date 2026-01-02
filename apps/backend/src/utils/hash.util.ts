import bcrypt from "bcryptjs";

// Salt rounds menentukan seberapa kompleks proses hashing.
// 10 adalah standar yang seimbang antara keamanan dan performa.
const SALT_ROUNDS = 10;

/**
 * Mengubah password plain text menjadi hash terenkripsi.
 * Digunakan saat Register atau Reset Password.
 * * @param password Password asli (plain text)
 * @returns Promise<string> Password yang sudah di-hash
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

/**
 * Membandingkan password plain text dengan hash yang ada di database.
 * Digunakan saat Login.
 * * @param password Password dari input user (plain text)
 * @param encryptedPassword Password hash dari database
 * @returns Promise<boolean> True jika cocok, False jika salah
 */
export const comparePassword = async (
  password: string,
  encryptedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, encryptedPassword);
};
