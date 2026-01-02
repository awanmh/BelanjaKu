import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface UserAddressAttributes {
  id: string;
  userId: string;
  recipientName: string;
  phoneNumber: string;
  addressLine: string; // Jalan, No Rumah, RT/RW
  city: string;
  province: string;
  postalCode: string;
  isPrimary: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

interface UserAddressCreationAttributes extends Optional<UserAddressAttributes, 'id' | 'isPrimary'> { }

export class UserAddress extends Model<UserAddressAttributes, UserAddressCreationAttributes> implements UserAddressAttributes {
  public id!: string;
  public userId!: string;
  public recipientName!: string;
  public phoneNumber!: string;
  public addressLine!: string;
  public city!: string;
  public province!: string;
  public postalCode!: string;
  public isPrimary!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;

  public static associate(models: any) {
    UserAddress.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }
}

export default function (sequelize: Sequelize): typeof UserAddress {
  UserAddress.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      recipientName: { type: DataTypes.STRING, allowNull: false },
      phoneNumber: { type: DataTypes.STRING, allowNull: false },
      addressLine: { type: DataTypes.TEXT, allowNull: false },
      city: { type: DataTypes.STRING, allowNull: false },
      province: { type: DataTypes.STRING, allowNull: false },
      postalCode: { type: DataTypes.STRING, allowNull: false },
      isPrimary: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      tableName: 'user_addresses',
      timestamps: true,
      paranoid: true, // Soft Delete
    }
  );

  return UserAddress;
}