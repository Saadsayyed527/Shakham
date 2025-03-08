import ResponseHandler from "../utils/CustomResponse.js";
import {logger} from "../utils/logger.js"; // Import Winston logger

/**
 * Global error-handling middleware for Express.
 */
const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    const errors = err.errors || {};
    const logLevel = statusCode >= 500 ? "warn" : "error";
  
    // Prevent Express from auto-logging errors
    res.locals.errorMessage = message;
  
    // Log error using Winston
    logger.log({
      level: logLevel,
      message,
      meta: {
        statusCode,
        errors,
        route: req.originalUrl,
        method: req.method,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // Log stack trace only in dev
      },
    });
  
    // Send structured error response
    return ResponseHandler.handleError(err, res);
  };
  
  export default errorMiddleware;