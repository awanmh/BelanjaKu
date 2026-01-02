import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface ProductDiscussionAttributes {
  id: string;
  productId: string;
  userId: string;
  message: string;
  parentDiscussionId?: string | null; // For replies
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProductDiscussionCreationAttributes
  extends Optional<ProductDiscussionAttributes, "id" | "parentDiscussionId"> {}

export class ProductDiscussion
  extends Model<
    ProductDiscussionAttributes,
    ProductDiscussionCreationAttributes
  >
  implements ProductDiscussionAttributes
{
  public id!: string;
  public productId!: string;
  public userId!: string;
  public message!: string;
  public parentDiscussionId?: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: any) {
    ProductDiscussion.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "product",
    });
    ProductDiscussion.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
    ProductDiscussion.hasMany(models.ProductDiscussion, {
      foreignKey: "parentDiscussionId",
      as: "replies",
    });
    ProductDiscussion.belongsTo(models.ProductDiscussion, {
      foreignKey: "parentDiscussionId",
      as: "parent",
    });
  }
}

export default function (sequelize: Sequelize): typeof ProductDiscussion {
  ProductDiscussion.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      parentDiscussionId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "product_discussions",
      timestamps: true,
    }
  );
  return ProductDiscussion;
}
