import { DataTypes, Model, Optional, Sequelize } from "sequelize";
<<<<<<< HEAD
import { ProductAttributes } from "./product.model";
import { CartAttributes } from "./cart.model";

export interface CartItemAttributes {
  id: string;
  cartId: string;
=======
import { Product } from "./product.model";

export interface CartItemAttributes {
  id: string;
  userId: string;
>>>>>>> frontend-role
  productId: string;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
<<<<<<< HEAD
  deletedAt?: Date | null;
=======
>>>>>>> frontend-role
}

interface CartItemCreationAttributes
  extends Optional<CartItemAttributes, "id"> {}

export class CartItem
  extends Model<CartItemAttributes, CartItemCreationAttributes>
  implements CartItemAttributes
{
  public id!: string;
<<<<<<< HEAD
  public cartId!: string;
=======
  public userId!: string;
>>>>>>> frontend-role
  public productId!: string;
  public quantity!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
<<<<<<< HEAD
  public readonly deletedAt!: Date | null;

  // Relasi untuk TypeScript agar bisa diakses saat include
  public readonly cart?: CartAttributes;
  public readonly product?: ProductAttributes;

  public static associate(models: any) {
    CartItem.belongsTo(models.Cart, { foreignKey: "cartId", as: "cart" });
=======
  public readonly product?: any;

  public static associate(models: any) {
    CartItem.belongsTo(models.User, { foreignKey: "userId", as: "user" });
>>>>>>> frontend-role
    CartItem.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "product",
    });
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
<<<<<<< HEAD
      cartId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "carts",
          key: "id",
        },
=======
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
>>>>>>> frontend-role
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
<<<<<<< HEAD
        references: {
          model: "products",
          key: "id",
        },
=======
>>>>>>> frontend-role
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
<<<<<<< HEAD
      paranoid: true, // soft delete
=======
>>>>>>> frontend-role
    }
  );

  return CartItem;
}
