import express from "express";
import CustomError from "../utils/CustomError.js";
import ResponseHandler from "../utils/CustomResponse.js";

const router = express.Router();

router.get("/success", (req, res) => {
  ResponseHandler.success(res, 200, "Data retrieved successfully", { user: "John Doe" });
});

router.get("/bad-request", (req, res, next) => {
  next(new CustomError("Invalid request data", 400, { field: "email", message: "Email is required" }));
});

router.get("/not-found", (req, res, next) => {
  next(new CustomError("User not found", 404));
});

router.get("/server-error", (req, res, next) => {
  next(new CustomError()); // Defaults to 500
});

export default router;
