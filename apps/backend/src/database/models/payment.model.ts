import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

// Enum untuk metode pembayaran
export type PaymentMethod = 'cod' | 'credit_card' | 'e_wallet' | 'qris' | 'bank_transfer';
export type PaymentStatus = 'pending' | 'success' | 'failed' | 'expired';

// Interface untuk atribut-atribut Payment
export interface PaymentAttributes {
  id: string;
  orderId: string;
  transactionId: string; // ID transaksi dari payment gateway
  paymentGateway: string; // Nama payment gateway (e.g., 'midtrans', 'simulation')
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  paymentUrl?: string; // URL/instruksi untuk pelanggan membayar
  createdAt?: Date;
  updatedAt?: Date;
}

interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id'> {}

export class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  public id!: string;
  public orderId!: string;
  public transactionId!: string;
  public paymentGateway!: string;
  public amount!: number;
  public method!: PaymentMethod;
  public status!: PaymentStatus;
  public paymentUrl!: string;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: any) {
    Payment.belongsTo(models.Order, {
      foreignKey: 'orderId',
      as: 'order',
    });
  }
}

export default function (sequelize: Sequelize): typeof Payment {
  Payment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      orderId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'orders', key: 'id' },
      },
      transactionId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      paymentGateway: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      method: {
        type: DataTypes.ENUM('cod', 'credit_card', 'e_wallet', 'qris', 'bank_transfer'),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'success', 'failed', 'expired'),
        defaultValue: 'pending',
      },
      paymentUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'payments',
      timestamps: true,
    }
  );

  return Payment;
}
