import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface WishlistAttributes {
  id: string;
  userId: string;
  productId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface WishlistCreationAttributes
  extends Optional<WishlistAttributes, "id"> {}

export class Wishlist
  extends Model<WishlistAttributes, WishlistCreationAttributes>
  implements WishlistAttributes
{
  public id!: string;
  public userId!: string;
  public productId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: any) {
    Wishlist.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    Wishlist.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "product",
    });
  }
}

export default function (sequelize: Sequelize): typeof Wishlist {
  Wishlist.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "wishlists",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["userId", "productId"],
        },
      ],
    }
  );
  return Wishlist;
}
