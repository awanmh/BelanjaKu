import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

// Interface untuk atribut-atribut Product
export interface ProductAttributes {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  sellerId: string; // Foreign key untuk User (seller)
  categoryId: string; // Foreign key untuk Category
  createdAt?: Date;
  updatedAt?: Date;
}

// Beberapa atribut bersifat opsional saat pembuatan (misal: id, createdAt)
interface ProductCreationAttributes extends Optional<ProductAttributes, 'id'> {}

// Definisikan class Model untuk Product
export class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: string;
  public name!: string;
  public description!: string;
  public price!: number;
  public stock!: number;
  public imageUrl!: string;
  public sellerId!: string;
  public categoryId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Method untuk asosiasi (relasi)
  public static associate(models: any) {
    // Sebuah produk dimiliki oleh satu User (Penjual)
    Product.belongsTo(models.User, {
      foreignKey: 'sellerId',
      as: 'seller',
    });
    // Sebuah produk termasuk dalam satu Category
    // Product.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
  }
}

// Fungsi factory untuk menginisialisasi model
export default function (sequelize: Sequelize): typeof Product {
  Product.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sellerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users', // Nama tabel users
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        // references: { model: 'categories', key: 'id' }, // Akan diaktifkan nanti
      },
    },
    {
      sequelize,
      tableName: 'products',
      timestamps: true, // Otomatis menambahkan createdAt dan updatedAt
    }
  );

  return Product;
}

