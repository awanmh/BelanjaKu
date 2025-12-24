import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface NotificationAttributes {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "ORDER" | "PROMO" | "SYSTEM" | "TRANSACTION";
  isRead: boolean;
  metadata?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

interface NotificationCreationAttributes
  extends Optional<NotificationAttributes, "id" | "isRead"> {}

export class Notification
  extends Model<NotificationAttributes, NotificationCreationAttributes>
  implements NotificationAttributes
{
  public id!: string;
  public userId!: string;
  public title!: string;
  public message!: string;
  public type!: "ORDER" | "PROMO" | "SYSTEM" | "TRANSACTION";
  public isRead!: boolean;
  public metadata?: any;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: any) {
    Notification.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  }
}

export default function (sequelize: Sequelize): typeof Notification {
  Notification.init(
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
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("ORDER", "PROMO", "SYSTEM", "TRANSACTION"),
        defaultValue: "SYSTEM",
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "notifications",
      timestamps: true,
    }
  );
  return Notification;
}
