import crypto from "crypto";
import db from "../database/models";
import { UserAttributes } from "../database/models/user.model";
import HttpException from "../utils/http-exception.util";
import { StatusCodes } from "http-status-codes";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.util";
import logger from "../utils/logger.util";
import { sendResetPasswordEmail } from "../utils/email.util";
import { hashPassword } from "../utils/hash.util";

const User = db.User;
const Seller = db.Seller;

/**
 * Input register
 */
export type RegisterInput = Pick<
  UserAttributes,
  "email" | "password" | "fullName"
>;

/**
 * Input login
 */
export type LoginInput = Pick<UserAttributes, "email" | "password">;

class AuthService {
  /**
   * ============================
   * REGISTER
   * ============================
   */
  public async register(
    userData: RegisterInput
  ): Promise<Omit<UserAttributes, "password">> {
    const { email, password, fullName } = userData;

    logger.info(`[REGISTER] Attempt: ${email}`);

    // 1️⃣ Cari user termasuk soft-deleted
    const existingUser = await User.findOne({
      where: { email },
      paranoid: false,
    });

    if (existingUser) {
      // Masih aktif
      if (!existingUser.deletedAt) {
        throw new HttpException(
          StatusCodes.CONFLICT,
          "Email already registered"
        );
      }

      // Sudah soft delete → hapus permanen
      logger.warn(`[REGISTER] Removing soft-deleted user: ${email}`);
      await existingUser.destroy({ force: true });
    }

    // 2️⃣ Tentukan role
    let role: "user" | "seller" | "admin" = "user";

    if (email.endsWith("@admin.belanjaku.com")) {
      role = "admin";
    } else if (email.endsWith("@seller.belanjaku.com")) {
      role = "seller";
    }

    logger.info(`[REGISTER] Role assigned: ${role}`);

    // 3️⃣ Hash password (AMAN)
    const hashedPassword = await hashPassword(password);

    const transaction = await db.sequelize.transaction();

    try {
      // 4️⃣ Create User
      const newUser = await User.create(
        {
          fullName,
          email,
          password: hashedPassword,
          role,
          isVerified: role === "user", // seller/admin bisa diverifikasi manual
        },
        { transaction }
      );

      // 5️⃣ Jika Seller → Buat toko
      if (role === "seller") {
        await Seller.create(
          {
            userId: newUser.id,
            storeName: `Toko ${fullName}` || "Toko Baru",
            storeAddress: "Alamat belum diatur oleh penjual",
            storePhoneNumber: "081234567890",
          },
          { transaction }
        );
      }

      await transaction.commit();
      return newUser.toJSON();
    } catch (error: any) {
      await transaction.rollback();

      // 🔎 Logging detail error Sequelize
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        console.error("\n🔴 VALIDATION ERROR 🔴");
        error.errors.forEach((err: any) => {
          console.error(`Field : ${err.path}`);
          console.error(`Message: ${err.message}`);
          console.error(`Value  : ${err.value}`);
        });
        console.error("------------------------\n");
      } else {
        console.error("❌ REGISTER ERROR:", error);
      }

      throw error;
    }
  }

  /**
   * ============================
   * LOGIN
   * ============================
   */
  public async login(credentials: LoginInput) {
    const { email, password } = credentials;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new HttpException(
        StatusCodes.UNAUTHORIZED,
        "Invalid email or password"
      );
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      throw new HttpException(
        StatusCodes.UNAUTHORIZED,
        "Invalid email or password"
      );
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      user: user.toJSON(),
      tokens: {
        accessToken: generateAccessToken(payload),
        refreshToken: generateRefreshToken(payload),
      },
    };
  }

  /**
   * ============================
   * FORGOT PASSWORD
   * ============================
   */
  public async forgotPassword(email: string) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new HttpException(
        StatusCodes.NOT_FOUND,
        "User with that email does not exist"
      );
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    try {
      await sendResetPasswordEmail(user.email, resetToken);
    } catch (error) {
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      logger.error("[FORGOT PASSWORD] Email failed", error);
      throw new HttpException(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Error sending reset email"
      );
    }

    return { message: "Password reset link sent to your email" };
  }
}

export default new AuthService();
