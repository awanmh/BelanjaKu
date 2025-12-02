import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

// Definisikan tipe literal untuk metode pembayaran
export type PaymentMethod = 'cod' | 'credit_card' | 'debit_card' | 'e_wallet' | 'qris' | 'bank_transfer';

// Interface untuk atribut-atribut Payment
export interface PaymentAttributes {
  id: string;
  orderId: string; // Foreign key ke Order
  transactionId: string; // ID transaksi dari payment gateway
  paymentGateway: string; // Nama payment gateway yang digunakan
  amount: number;
  method: PaymentMethod;
  status: 'pending' | 'success' | 'failed' | 'expired';
  paymentUrl?: string | null; // FIX: Izinkan null agar sesuai dengan logika service
  createdAt?: Date;
  updatedAt?: Date;
}

// Atribut yang opsional saat pembuatan
interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id'> {}

// Definisikan class Model untuk Payment
export class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  public id!: string;
  public orderId!: string;
  public transactionId!: string;
  public paymentGateway!: string;
  public amount!: number;
  public method!: PaymentMethod;
  public status!: 'pending' | 'success' | 'failed' | 'expired';
  public paymentUrl!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Method untuk asosiasi (relasi)
  public static associate(models: any) {
    // Sebuah pembayaran dimiliki oleh satu Order
    Payment.belongsTo(models.Order, {
      foreignKey: 'orderId',
      as: 'order',
    });
  }
}

// Fungsi factory untuk menginisialisasi model
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
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Jika pesanan dihapus, catatan pembayaran juga terhapus
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
        type: DataTypes.ENUM('cod', 'credit_card', 'debit_card', 'e_wallet', 'qris', 'bank_transfer'),
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

