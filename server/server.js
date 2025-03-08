import app from "./src/app.js";
import { logger } from "./src/utils/logger.js";
import config from "./src/config/config.js";

const PORT = config.PORT;

import process from "process"; // Explicitly import process for ESM


let server;

// Start server with error handling
const startServer = () => {
  try {
    server = app.listen(PORT, () => {
        
        logger.info(`🚀 Server running in ${config.NODE_ENV} mode on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("❌ Server startup failed:", error);
    process.exit(1); // Exit with failure
  }
};

startServer();

// Handle uncaught exceptions (synchronous errors)
process.on("uncaughtException", (err) => {
  logger.error("🔥 Uncaught Exception:", err);
  process.exit(1); // Exit process to avoid undefined behavior
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("💥 Unhandled Rejection:", reason);
  process.exit(1);
});

// Graceful shutdown on SIGTERM/SIGINT (e.g., CTRL+C, kill command)
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
