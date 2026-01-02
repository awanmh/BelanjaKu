import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

// Interface untuk atribut Cart
export interface CartAttributes {
  id: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

interface CartCreationAttributes extends Optional<CartAttributes, 'id'> {}

export class Cart extends Model<CartAttributes, CartCreationAttributes> implements CartAttributes {
  public id!: string;
  public userId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;

  public static associate(models: any) {
    // Satu Cart milik satu User
    Cart.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    
    // Satu Cart memiliki banyak CartItem
    Cart.hasMany(models.CartItem, { foreignKey: 'cartId', as: 'items' });
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
      },
    },
    {
      sequelize,
      tableName: 'carts',
      timestamps: true,
      paranoid: true, // Aktifkan soft delete
    }
  );

  return Cart;
}
