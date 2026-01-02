import { DataTypes, Model, Optional, Sequelize } from "sequelize";
<<<<<<< HEAD
import { ProductAttributes } from "./product.model";
import { CartAttributes } from "./cart.model";
=======
import { Product } from "./product.model";
>>>>>>> 49b30cf

export interface CartItemAttributes {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

<<<<<<< HEAD
interface CartItemCreationAttributes extends Optional<CartItemAttributes, "id"> {}
=======
interface CartItemCreationAttributes
  extends Optional<CartItemAttributes, "id"> {}
>>>>>>> 49b30cf

export class CartItem
  extends Model<CartItemAttributes, CartItemCreationAttributes>
  implements CartItemAttributes
{
  public id!: string;
  public userId!: string;
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
    CartItem.belongsTo(models.Product, { foreignKey: "productId", as: "product" });
=======
  public readonly product?: any;

  public static associate(models: any) {
    CartItem.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    CartItem.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "product",
    });
>>>>>>> 49b30cf
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
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
<<<<<<< HEAD
        references: {
          model: "carts",
          key: "id",
        },
=======
>>>>>>> 49b30cf
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
>>>>>>> 49b30cf
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
>>>>>>> 49b30cf
    }
  );

  return CartItem;
}
