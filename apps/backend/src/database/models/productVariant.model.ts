import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface ProductVariantAttributes {
  id: string;
  productId: string;
  sku: string;
  price: number;
  stock: number;
  attributes: any; // JSONB
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProductVariantCreationAttributes
  extends Optional<ProductVariantAttributes, "id"> {}

export class ProductVariant
  extends Model<ProductVariantAttributes, ProductVariantCreationAttributes>
  implements ProductVariantAttributes
{
  public id!: string;
  public productId!: string;
  public sku!: string;
  public price!: number;
  public stock!: number;
  public attributes!: any;
  public imageUrl?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: any) {
    ProductVariant.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "product",
    });
  }
}

export default function (sequelize: Sequelize): typeof ProductVariant {
  ProductVariant.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      sku: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      attributes: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "product_variants",
      timestamps: true,
    }
  );
  return ProductVariant;
}
