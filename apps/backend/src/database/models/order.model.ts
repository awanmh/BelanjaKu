import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

// Interface untuk atribut-atribut Order
export interface OrderAttributes {
  id: string;
  userId: string;
  totalAmount: number;
  shippingAddress: string;
  // FIX: Tambahkan 'completed' ke daftar status yang valid
  status: 'pending' | 'processing' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'completed';
  promotionId?: string | null;
  discountAmount?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Atribut yang opsional saat pembuatan
interface OrderCreationAttributes extends Optional<OrderAttributes, 'id'> {}

// Definisikan class Model untuk Order
export class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: string;
  public userId!: string;
  public totalAmount!: number;
  public shippingAddress!: string;
  public status!: 'pending' | 'processing' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'completed';
  public promotionId!: string | null;
  public discountAmount!: number | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Method untuk asosiasi (relasi)
  public static associate(models: any) {
    Order.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    Order.hasMany(models.OrderItem, {
      foreignKey: 'orderId',
      as: 'items',
    });
    Order.belongsTo(models.Promotion, {
        foreignKey: 'promotionId',
        as: 'promotion'
    });
  }
}

// Fungsi factory untuk menginisialisasi model
export default function (sequelize: Sequelize): typeof Order {
  Order.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      shippingAddress: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        // FIX: Tambahkan 'completed' ke ENUM di database
        type: DataTypes.ENUM('pending', 'processing', 'paid', 'shipped', 'delivered', 'cancelled', 'completed'),
        defaultValue: 'pending',
      },
      promotionId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'promotions', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      discountAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: 'orders',
      timestamps: true,
    }
  );

  return Order;
}