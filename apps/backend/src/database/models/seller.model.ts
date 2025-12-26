import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

// Interface untuk atribut-atribut Seller
export interface SellerAttributes {
  id: string;
  userId: string; // Foreign key one-to-one ke User
  storeName: string;
  storeAddress?: string;
  storePhoneNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Atribut yang opsional saat pembuatan
interface SellerCreationAttributes extends Optional<SellerAttributes, 'id'> {}

// Definisikan class Model untuk Seller
export class Seller extends Model<SellerAttributes, SellerCreationAttributes> implements SellerAttributes {
  public id!: string;
  public userId!: string;
  public storeName!: string;
  public storeAddress!: string;
  public storePhoneNumber!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Method untuk asosiasi (relasi)
  public static associate(models: any) {
    // Sebuah profil Seller dimiliki oleh satu User
    Seller.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    // Dan sebaliknya, seorang User memiliki satu profil Seller
    // Relasi ini akan kita definisikan di user.model.ts
  }
}

// Fungsi factory untuk menginisialisasi model
export default function (sequelize: Sequelize): typeof Seller {
  Seller.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true, // Memastikan relasi one-to-one
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      storeName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      storeAddress: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      storePhoneNumber: {
  type: DataTypes.STRING,
  validate: {
    isNumeric: true, // Ini akan menolak tanda strip (-)
    len: [10, 15]    // Ini akan menolak jika terlalu pendek
  }
},
    },
    {
      sequelize,
      tableName: 'sellers',
      timestamps: true,
    }
  );

  return Seller;
}
