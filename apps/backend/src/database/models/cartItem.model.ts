import { DataTypes, Model, Optional, Sequelize } from "sequelize";
// Pastikan import ini mengarah ke file model yang benar
import { Product } from "./product.model"; 
import { Cart } from "./cart.model";

export interface CartItemAttributes {
  id: string;
  cartId: string; // UBAH: userId menjadi cartId agar sesuai relasi Cart
  productId: string;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

interface CartItemCreationAttributes extends Optional<CartItemAttributes, "id"> {}

export class CartItem
  extends Model<CartItemAttributes, CartItemCreationAttributes>
  implements CartItemAttributes
{
  public id!: string;
  public cartId!: string; // UBAH: Konsisten dengan interface
  public productId!: string;
  public quantity!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;

  // Property untuk Eager Loading (Include)
  public readonly cart?: Cart;
  public readonly product?: Product;

  public static associate(models: any) {
    // Relasi ke Cart (Induk)
    CartItem.belongsTo(models.Cart, { foreignKey: "cartId", as: "cart" });
    
    // Relasi ke Product
    CartItem.belongsTo(models.Product, { foreignKey: "productId", as: "product" });
  }
}

export default function (sequelize: Sequelize): typeof CartItem {
  CartItem.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      // Kolom ini menghubungkan Item ke Keranjang Belanja
      cartId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "carts", // Pastikan nama tabel di database adalah 'carts'
          key: "id",
        },
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "products", // Pastikan nama tabel di database adalah 'products'
          key: "id",
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          min: 1,
        },
      },
    },
    {
      sequelize,
      tableName: "cart_items",
      timestamps: true,
      paranoid: true, // Soft delete aktif (deletedAt)
    }
  );

  return CartItem;
}