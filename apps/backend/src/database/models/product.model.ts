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
  lowStockThreshold?: number;

  // TAMBAHAN TYPE
  search_vector?: any; // Kita set 'any' atau 'string' karena ini tipe khusus postgres

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date; // 1. Tambahkan kolom deletedAt
}

// Beberapa atribut bersifat opsional saat pembuatan
interface ProductCreationAttributes extends Optional<ProductAttributes, 'id'> { }

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
  public lowStockThreshold!: number;

  // TAMBAHAN TYPE
  public readonly search_vector!: any;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date; // 2. Tambahkan kolom deletedAt

  // Method untuk asosiasi (relasi)
  public static associate(models: any) {
    Product.belongsTo(models.User, {
      foreignKey: 'sellerId',
      as: 'seller',
    });
    Product.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category',
    });
    Product.hasMany(models.Promotion, {
      foreignKey: 'productId',
      as: 'promotions'
    });
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
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'categories', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      lowStockThreshold: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 5,
      },
    },
    {
      sequelize,
      tableName: 'products',
      timestamps: true,
      paranoid: true, // 3. Aktifkan soft deletes
    }
  );

  return Product;
}