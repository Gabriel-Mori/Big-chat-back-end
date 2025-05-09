import {Model, DataTypes} from "sequelize";
import sequelize from "../config/sequelize";

class Conversation extends Model {
  public id!: string;
  public clientId!: string;
  public recipientId!: string;
  public recipientName!: string;
  public lastMessageContent!: string;
  public lastMessageTime!: Date;
  public unreadCount!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Conversation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    clientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    recipientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    recipientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastMessageContent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    lastMessageTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    unreadCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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
    tableName: "conversations",
    timestamps: true,
  }
);

export default Conversation;
