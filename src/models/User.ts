import {Model, DataTypes} from "sequelize";
import sequelize from "../config/sequelize";

import bcrypt from "bcrypt";

class User extends Model {
  public id!: string;
  public name!: string;
  public documentId!: string;
  public documentType!: "CPF" | "CNPJ";
  public active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.getDataValue("password"));
  }
}

User.init(
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
    documentId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    documentType: {
      type: DataTypes.ENUM("CPF", "CNPJ"),
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    tableName: "users",
    timestamps: true,
  }
);

export default User;
