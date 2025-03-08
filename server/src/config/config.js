import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

class Config {
  constructor() {
    // Application Config
    this.NODE_ENV = process.env.NODE_ENV || "development";
    this.PORT = process.env.PORT || 5000;

    // Security Config
    this.JWT_SECRET = process.env.JWT_SECRET || "default_secret";
    this.JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1h";

    // Logging Config
    this.LOG_LEVEL = process.env.LOG_LEVEL || "info";

    // Other Configs
    this.REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
    this.API_KEY = process.env.API_KEY || "your-api-key";
  }

  // Method to check if app is in production mode
  isProduction() {
    return this.NODE_ENV === "production";
  }

  // Method to check if app is in development mode
  isDevelopment() {
    return this.NODE_ENV === "development";
  }
}

// Singleton Instance (Ensures config is initialized only once)
const config = new Config();
export default config;
