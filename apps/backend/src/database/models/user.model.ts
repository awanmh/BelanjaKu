import { DataTypes, Model, Sequelize, Optional } from 'sequelize';
import bcrypt from 'bcryptjs';

// Atribut yang wajib ada saat membuat user baru
export interface UserAttributes {
  id: string;
  fullName: string;
  email: string;
  password: string; // Password wajib ada saat pembuatan
  role: 'user' | 'seller' | 'admin';
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Atribut yang bisa diisi saat membuat user (id bersifat opsional)
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// FIX: Memperbaiki kesalahan ketik dari UserCreation-Attributes menjadi UserCreationAttributes
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public fullName!: string;
  public email!: string;
  public password!: string;
  public role!: 'user' | 'seller' | 'admin';
  public isVerified!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Method untuk membandingkan password
  public async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  // Method untuk asosiasi (relasi)
  public static associate(models: any) {
    // Seorang User memiliki satu profil Seller
    User.hasOne(models.Seller, {
      foreignKey: 'userId',
      as: 'sellerProfile',
    });
    // Seorang User memiliki banyak Produk (sebagai penjual)
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
    },
    {
      sequelize,
      tableName: 'users',
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

  return User;
}