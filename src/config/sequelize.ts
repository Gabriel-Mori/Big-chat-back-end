import {Sequelize} from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.POSTGRES_DB || "chat-app",
  process.env.POSTGRES_USER || "postgres",
  process.env.POSTGRES_PASSWORD || "postgres",
  {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export default sequelize;
