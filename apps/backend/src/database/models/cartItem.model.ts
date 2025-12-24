import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { ProductAttributes } from "./product.model";
import { CartAttributes } from "./cart.model";

export interface CartItemAttributes {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

interface CartItemCreationAttributes extends Optional<CartItemAttributes, "id"> {}

export class CartItem
  extends Model<CartItemAttributes, CartItemCreationAttributes>
  implements CartItemAttributes
{
  public id!: string;
  public cartId!: string;
  public productId!: string;
  public quantity!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;

  // Relasi untuk TypeScript agar bisa diakses saat include
  public readonly cart?: CartAttributes;
  public readonly product?: ProductAttributes;

  public static associate(models: any) {
    CartItem.belongsTo(models.Cart, { foreignKey: "cartId", as: "cart" });
    CartItem.belongsTo(models.Product, { foreignKey: "productId", as: "product" });
  }
}

export default function (sequelize: Sequelize): typeof CartItem {
  CartItem.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      cartId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "carts",
          key: "id",
        },
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "products",
          key: "id",
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          min: 1,
        },
      },
    },
    {
      sequelize,
      tableName: "cart_items",
      timestamps: true,
      paranoid: true, // soft delete
    }
  );

  return CartItem;
}