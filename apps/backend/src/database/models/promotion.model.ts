import { DataTypes, Model, Optional, Sequelize } from "sequelize";

// Interface untuk atribut-atribut Promotion
export interface PromotionAttributes {
  id: string;
  productId: string; // Foreign key ke Product yang mendapatkan promosi
  code: string; // Kode diskon unik (opsional, bisa juga promosi otomatis)
  discountPercentage: number; // Diskon dalam persen (misal: 10 untuk 10%)
  startDate: Date; // Tanggal mulai promosi
  endDate: Date; // Tanggal berakhir promosi
  isActive: boolean;
  type: "DISCOUNT" | "FLASH_SALE" | "BUNDLE" | "CASHBACK";
  minPurchaseAmount: number;
  maxDiscountAmount?: number;
  quota?: number;
  usageCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Atribut yang opsional saat pembuatan
interface PromotionCreationAttributes
  extends Optional<
    PromotionAttributes,
    "id" | "isActive" | "usageCount" | "minPurchaseAmount"
  > {}

// Definisikan class Model untuk Promotion
export class Promotion
  extends Model<PromotionAttributes, PromotionCreationAttributes>
  implements PromotionAttributes
{
  public id!: string;
  public productId!: string;
  public code!: string;
  public discountPercentage!: number;
  public startDate!: Date;
  public endDate!: Date;
  public isActive!: boolean;
  public type!: "DISCOUNT" | "FLASH_SALE" | "BUNDLE" | "CASHBACK";
  public minPurchaseAmount!: number;
  public maxDiscountAmount!: number;
  public quota!: number;
  public usageCount!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Method untuk asosiasi (relasi)
  public static associate(models: any) {
    // Sebuah promosi berlaku untuk satu Product
    Promotion.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "product",
    });
  }
}

// Fungsi factory untuk menginisialisasi model
export default function (sequelize: Sequelize): typeof Promotion {
  Promotion.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "products",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      code: {
        type: DataTypes.STRING,
        allowNull: true, // Bisa null jika promosi tidak memerlukan kode
        unique: true,
      },
      discountPercentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        validate: {
          min: 0,
          max: 100,
        },
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      type: {
        type: DataTypes.ENUM("DISCOUNT", "FLASH_SALE", "BUNDLE", "CASHBACK"),
        defaultValue: "DISCOUNT",
      },
      minPurchaseAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
      maxDiscountAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      quota: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      usageCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: "promotions",
      timestamps: true,
    }
  );

  return Promotion;
}
