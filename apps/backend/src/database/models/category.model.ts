import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

// Interface untuk atribut-atribut Category
export interface CategoryAttributes {
  id: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Atribut yang opsional saat pembuatan (hanya id)
interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id'> {}

// Definisikan class Model untuk Category
export class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
  public id!: string;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Method untuk asosiasi (relasi)
  public static associate(models: any) {
    // Sebuah kategori bisa memiliki banyak produk
    Category.hasMany(models.Product, {
      foreignKey: 'categoryId',
      as: 'products',
    });
  }
}

// Fungsi factory untuk menginisialisasi model
export default function (sequelize: Sequelize): typeof Category {
  Category.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Nama kategori harus unik
      },
    },
    {
      sequelize,
      tableName: 'categories',
      timestamps: true,
    }
  );

  return Category;
}
