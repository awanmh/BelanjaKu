import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

// Interface untuk atribut-atribut Order
export interface OrderAttributes {
  id: string;
  userId: string; // Foreign key untuk User
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string; // Bisa juga berupa JSON jika lebih kompleks
  createdAt?: Date;
  updatedAt?: Date;
}

// Atribut yang opsional saat pembuatan (misal: id)
interface OrderCreationAttributes extends Optional<OrderAttributes, 'id'> {}

// Definisikan class Model untuk Order
export class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: string;
  public userId!: string;
  public totalAmount!: number;
  public status!: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  public shippingAddress!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Method untuk asosiasi (relasi)
  public static associate(models: any) {
    // Sebuah pesanan dimiliki oleh satu User
    Order.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'customer',
    });

    // Sebuah pesanan memiliki banyak OrderItem
    Order.hasMany(models.OrderItem, {
        foreignKey: 'orderId',
        as: 'items'
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
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled'),
        defaultValue: 'pending',
        allowNull: false,
      },
      shippingAddress: {
        type: DataTypes.TEXT,
        allowNull: false,
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
