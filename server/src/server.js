import app from "./app.js";
import { logger } from "./utils/logger.js";
import config from "./config/config.js";

const PORT = config.PORT;

let server;

// Start server with error handling
const startServer = () => {
  try {
    server = app.listen(PORT, () => {
      logger.info(`🚀 Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("❌ Server startup failed:", error);
    process.exit(1);
  }
};

startServer();

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error("🔥 Uncaught Exception:", err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason) => {
  logger.error("💥 Unhandled Rejection:", reason);
  process.exit(1);
});

// Graceful shutdown
const shutdown = (signal) => {
  logger.warn(`🛑 Received ${signal}, shutting down gracefully...`);
  
  if (server) {
    server.close(() => {
      logger.info("✅ Server closed. Exiting process...");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
