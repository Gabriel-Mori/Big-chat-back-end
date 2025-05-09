import {Model, DataTypes} from "sequelize";
import sequelize from "../config/sequelize";

class Message extends Model {
  public id!: string;
  public conversationId!: string;
  public content!: string;
  public senderId!: string;
  public senderType!: "client" | "user";
  public timestamp!: Date;
  public priority!: "normal" | "urgent";
  public status!:
    | "queued"
    | "processing"
    | "sent"
    | "delivered"
    | "read"
    | "failed";
  public cost!: number;
  public estimatedDelivery!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Message.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    conversationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "conversations",
        key: "id",
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    senderType: {
      type: DataTypes.ENUM("client", "user"),
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    priority: {
      type: DataTypes.ENUM("normal", "urgent"),
      defaultValue: "normal",
    },
    status: {
      type: DataTypes.ENUM(
        "queued",
        "processing",
        "sent",
        "delivered",
        "read",
        "failed"
      ),
      defaultValue: "queued",
    },
    cost: {
      type: DataTypes.FLOAT,
      defaultValue: 1.0,
    },
    estimatedDelivery: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "messages",
    timestamps: true,
  }
);
export default Message;
