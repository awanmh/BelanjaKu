<<<<<<< HEAD
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
=======
import { DataTypes, Model, Optional, Sequelize } from "sequelize";
>>>>>>> frontend-role

export interface WishlistAttributes {
  id: string;
  userId: string;
  productId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

<<<<<<< HEAD
interface WishlistCreationAttributes extends Optional<WishlistAttributes, 'id'> {}

export class Wishlist extends Model<WishlistAttributes, WishlistCreationAttributes> implements WishlistAttributes {
=======
interface WishlistCreationAttributes
  extends Optional<WishlistAttributes, "id"> {}

export class Wishlist
  extends Model<WishlistAttributes, WishlistCreationAttributes>
  implements WishlistAttributes
{
>>>>>>> frontend-role
  public id!: string;
  public userId!: string;
  public productId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: any) {
<<<<<<< HEAD
    Wishlist.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    Wishlist.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product',
=======
    Wishlist.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    Wishlist.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "product",
>>>>>>> frontend-role
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
<<<<<<< HEAD
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
=======
>>>>>>> frontend-role
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
<<<<<<< HEAD
        references: {
          model: 'products',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
=======
>>>>>>> frontend-role
      },
    },
    {
      sequelize,
<<<<<<< HEAD
      tableName: 'wishlists',
      timestamps: true,
    }
  );

=======
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
>>>>>>> frontend-role
  return Wishlist;
}
