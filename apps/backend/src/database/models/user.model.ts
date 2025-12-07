import { DataTypes, Model, Sequelize, Optional } from 'sequelize';
import bcrypt from 'bcryptjs';

// Interface untuk atribut-atribut User
export interface UserAttributes {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: 'user' | 'seller' | 'admin';
  isVerified: boolean;
  // [TAMBAHAN] Tambahkan 2 properti ini
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null; // 1. Tambahkan kolom deletedAt (izinkan null)
}

// Atribut yang opsional saat pembuatan
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> { }

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public fullName!: string;
  public email!: string;
  public password!: string;
  public role!: 'user' | 'seller' | 'admin';
  public isVerified!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null; // 2. Tambahkan kolom deletedAt

  // Method untuk membandingkan password
  public async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  // Method untuk asosiasi (relasi)
  public static associate(models: any) {
    User.hasOne(models.Seller, {
      foreignKey: 'userId',
      as: 'sellerProfile',
    });
    User.hasMany(models.Product, {
      foreignKey: 'sellerId',
      as: 'products',
    });
  }
}

// Ekspor fungsi yang akan menginisialisasi model
export default function (sequelize: Sequelize): typeof User {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('user', 'seller', 'admin'),
        defaultValue: 'user',
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      // Kolom deletedAt akan ditambahkan secara otomatis oleh Sequelize
    },
    {
      sequelize,
      tableName: 'users',
      timestamps: true,
      paranoid: true, // 3. Aktifkan soft deletes
      hooks: {
        beforeCreate: async (user: User) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
        beforeUpdate: async (user: User) => {
          if (user.changed('password')) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
      },
    }
  );

  // Hook toJSON untuk menghapus password secara otomatis
  User.prototype.toJSON = function () {
    const { password, ...values } = { ...this.get() };
    return values;
  };

  return User;
}