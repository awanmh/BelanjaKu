import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

// Interface untuk atribut-atribut ShippingOption
export interface ShippingOptionAttributes {
  id: string;
  name: string; // Nama opsi pengiriman (e.g., "JNE Reguler", "GoSend Instant")
  description: string;
  price: number; // Biaya pengiriman
  estimatedDays: number; // Estimasi hari pengiriman
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Atribut yang opsional saat pembuatan
interface ShippingOptionCreationAttributes extends Optional<ShippingOptionAttributes, 'id' | 'isActive'> {}

// Definisikan class Model untuk ShippingOption
export class ShippingOption extends Model<ShippingOptionAttributes, ShippingOptionCreationAttributes> implements ShippingOptionAttributes {
  public id!: string;
  public name!: string;
  public description!: string;
  public price!: number;
  public estimatedDays!: number;
  public isActive!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Model ini tidak memiliki relasi langsung yang perlu didefinisikan di sini,
  // tapi bisa dihubungkan ke Order di masa depan jika diperlukan.
  public static associate(models: any) {
    // Contoh: ShippingOption.hasMany(models.Order);
  }
}

// Fungsi factory untuk menginisialisasi model
export default function (sequelize: Sequelize): typeof ShippingOption {
  ShippingOption.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      estimatedDays: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      tableName: 'shipping_options',
      timestamps: true,
    }
  );

  return ShippingOption;
}
