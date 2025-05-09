import {Model, DataTypes} from "sequelize";
import sequelize from "../config/sequelize";

class Plan extends Model {
  public id!: string;
  public userId!: string;
  public planType!: "prepaid" | "postpaid";
  public cost!: number;
  public credits!: number;
  public limit?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Plan.init(
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
        model: "users",
        key: "id",
      },
    },
    planType: {
      type: DataTypes.ENUM("prepaid", "postpaid"),
      allowNull: false,
    },
    cost: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 1.0,
    },
    credits: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    limit: {
      type: DataTypes.INTEGER,
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
    tableName: "plans",
    timestamps: true,
  }
);

export default Plan;
