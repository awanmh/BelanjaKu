// backend/src/database/models/cartItem.model.ts
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { Product } from './product.model';

export interface CartItemAttributes {
    id: string;
    userId: string;
    productId: string;
    quantity: number;
    createdAt?: Date;
    updatedAt?: Date;
}

interface CartItemCreationAttributes extends Optional<CartItemAttributes, 'id'> { }

export class CartItem extends Model<CartItemAttributes, CartItemCreationAttributes> implements CartItemAttributes {
    public id!: string;
    public userId!: string;
    public productId!: string;
    public quantity!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly product?: any;

    public static associate(models: any) {
        CartItem.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        CartItem.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
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
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            productId: {
                type: DataTypes.UUID,
                allowNull: false,
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
            tableName: 'cart_items',
            timestamps: true,
        }
    );

    return CartItem;
}