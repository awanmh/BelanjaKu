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
  // Kolom Baru untuk Reset Password
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public fullName!: string;
  public email!: string;
  public password!: string;
  public role!: 'user' | 'seller' | 'admin';
  public isVerified!: boolean;
  // Definisi Type Class
  public resetPasswordToken!: string | null;
  public resetPasswordExpires!: Date | null;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;

  public async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  public static associate(models: any) {
    User.hasOne(models.Seller, { foreignKey: 'userId', as: 'sellerProfile' });
    User.hasMany(models.Product, { foreignKey: 'sellerId', as: 'products' });

    User.hasMany(models.UserAddress, { foreignKey: 'userId', as: 'addresses' });
  }
}

export default function (sequelize: Sequelize): typeof User {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      fullName: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
      password: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.ENUM('user', 'seller', 'admin'), defaultValue: 'user' },
      isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
      
      // Definisi Kolom Baru di Database
      resetPasswordToken: { type: DataTypes.STRING, allowNull: true },
      resetPasswordExpires: { type: DataTypes.DATE, allowNull: true },
    },
    {
      sequelize,
      tableName: 'users',
      timestamps: true,
      paranoid: true,
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

  User.prototype.toJSON = function () {
    const { password, resetPasswordToken, resetPasswordExpires, ...values } = this.get();
    return values;
  };

  return User;
}