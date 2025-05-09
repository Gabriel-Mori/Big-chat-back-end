module.exports = {
  development: {
    username: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "postgres",
    database: process.env.POSTGRES_DB || "chat-app",
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
  },
};
