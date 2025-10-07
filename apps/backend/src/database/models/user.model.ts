import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

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

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public fullName!: string;
  public email!: string;
  public password!: string;
  public role!: 'user' | 'seller' | 'admin';
  public isVerified!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Asosiasi bisa didefinisikan di sini jika diperlukan
  public static associate(models: any) {
    // contoh: User.hasMany(models.Product);
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
      // timestamps: true, // sudah default
    }
  );

  return User;
}

