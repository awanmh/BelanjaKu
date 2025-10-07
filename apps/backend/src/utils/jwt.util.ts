import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { config } from '../config/env.config';

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

/**
 * Fungsi untuk membuat JWT secara aman.
 */
const createToken = (
  payload: TokenPayload,
  secret: Secret,
  expiresIn: string
): string => {
  // Cast manual untuk menghindari TypeScript type mismatch di expiresIn
  const options: SignOptions = { expiresIn: expiresIn as any };
  return jwt.sign(payload, secret, options);
};

/**
 * Generate Access Token.
 */
export const generateAccessToken = (payload: TokenPayload): string => {
  return createToken(payload, config.JWT_SECRET as Secret, config.JWT_EXPIRES_IN);
};

/**
 * Generate Refresh Token.
 */
export const generateRefreshToken = (payload: TokenPayload): string => {
  return createToken(payload, config.JWT_REFRESH_SECRET as Secret, config.JWT_REFRESH_EXPIRES_IN);
};

/**
 * Verifikasi JWT.
 */
export const verifyToken = <T extends TokenPayload>(
  token: string,
  isRefresh = false
): T | null => {
  try {
    const secret: Secret = isRefresh
      ? (config.JWT_REFRESH_SECRET as Secret)
      : (config.JWT_SECRET as Secret);

    return jwt.verify(token, secret) as T;
  } catch {
    return null;
  }
};
