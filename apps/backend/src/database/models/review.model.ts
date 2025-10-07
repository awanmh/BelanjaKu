import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

// Interface untuk atribut-atribut Review
export interface ReviewAttributes {
  id: string;
  userId: string; // Foreign key untuk User
  productId: string; // Foreign key untuk Product
  rating: number; // Rating bintang (misal: 1-5)
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Atribut yang opsional saat pembuatan (misal: id)
interface ReviewCreationAttributes extends Optional<ReviewAttributes, 'id'> {}

// Definisikan class Model untuk Review
export class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
  public id!: string;
  public userId!: string;
  public productId!: string;
  public rating!: number;
  public comment!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Method untuk asosiasi (relasi)
  public static associate(models: any) {
    // Sebuah ulasan dibuat oleh satu User
    Review.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    // Sebuah ulasan ditujukan untuk satu Product
    Review.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product',
    });
  }
}

// Fungsi factory untuk menginisialisasi model
export default function (sequelize: Sequelize): typeof Review {
  Review.init(
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
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'reviews',
      timestamps: true,
      // Menambahkan unique constraint agar satu user hanya bisa mereview satu produk sekali
      indexes: [
        {
          unique: true,
          fields: ['userId', 'productId'],
        },
      ],
    }
  );

  return Review;
}
