import sequelize from "./config/sequelize";
import messageService from "./services/messageService";
import app from "./app";

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({alter: true});
      console.log("Database models synchronized.");
    }

    try {
      await messageService.processQueuedMessages();
      console.log("Message queue processing started");
    } catch (error) {
      console.error("Failed to start message queue processing:", error);
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
    process.exit(1);
  }
};

startServer();
