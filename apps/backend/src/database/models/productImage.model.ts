import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface ProductImageAttributes {
  id: string;
  productId: string;
  imageUrl: string;
  isPrimary: boolean;
  type: "image" | "video";
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProductImageCreationAttributes
  extends Optional<ProductImageAttributes, "id"> {}

export class ProductImage
  extends Model<ProductImageAttributes, ProductImageCreationAttributes>
  implements ProductImageAttributes
{
  public id!: string;
  public productId!: string;
  public imageUrl!: string;
  public isPrimary!: boolean;
  public type!: "image" | "video";

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: any) {
    ProductImage.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "product",
    });
  }
}

export default function (sequelize: Sequelize): typeof ProductImage {
  ProductImage.init(
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
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isPrimary: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      type: {
        type: DataTypes.STRING,
        defaultValue: "image",
      },
    },
    {
      sequelize,
      tableName: "product_images",
      timestamps: true,
    }
  );

  return ProductImage;
}
