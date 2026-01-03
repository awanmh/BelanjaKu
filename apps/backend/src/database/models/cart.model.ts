import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

<<<<<<< HEAD
export interface CartAttributes {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  size: string;
  createdAt?: Date;
  updatedAt?: Date;
=======
// Interface untuk atribut Cart
export interface CartAttributes {
  id: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
>>>>>>> frontend-role
}

interface CartCreationAttributes extends Optional<CartAttributes, 'id'> {}

export class Cart extends Model<CartAttributes, CartCreationAttributes> implements CartAttributes {
  public id!: string;
  public userId!: string;
<<<<<<< HEAD
  public productId!: string;
  public quantity!: number;
  public size!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: any) {
    Cart.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    Cart.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product',
    });
=======

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;

  public static associate(models: any) {
    // Satu Cart milik satu User
    Cart.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    
    // Satu Cart memiliki banyak CartItem
    Cart.hasMany(models.CartItem, { foreignKey: 'cartId', as: 'items' });
>>>>>>> frontend-role
  }
}

export default function (sequelize: Sequelize): typeof Cart {
  Cart.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
<<<<<<< HEAD
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      size: {
        type: DataTypes.STRING,
        allowNull: false,
=======
>>>>>>> frontend-role
      },
    },
    {
      sequelize,
      tableName: 'carts',
      timestamps: true,
<<<<<<< HEAD
=======
      paranoid: true, // Aktifkan soft delete
>>>>>>> frontend-role
    }
  );

  return Cart;
}
