import express from "express";
import mongoose from "mongoose";
import CourseCart from "../models/Cart.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * 🟢 Students can:
 * - GET /api/cart/:id  (Get all courses in their cart)
 * - POST /api/cart  (Add a course to the cart)
 * - DELETE /api/cart  (Remove a course from the cart)
 */

// ✅ Get all courses in student's cart
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const cartItems = await CourseCart.find({ userId: req.params.id })
            .populate("courseId", "title price teacher")
            .lean()
            .exec();
        return res.status(200).json(cartItems);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});

// ✅ Add a course to cart
router.post("/", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "student") {
            return res.status(403).json({ message: "Only students can add courses to the cart!" });
        }

        const { courseId } = req.body;

        // Check if course is already in cart
        const existingCartItem = await CourseCart.findOne({ userId: req.user.userId, courseId });
        if (existingCartItem) {
            return res.status(400).json({ message: "Course is already in your cart!" });
        }

        const newCartItem = await CourseCart.create({ userId: req.user.userId, courseId });

        return res.status(200).json({ message: "Course added to cart!", cart: newCartItem });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});

// ✅ Remove a course from cart
router.delete("/", authMiddleware, async (req, res) => {
    try {
        const userId = mongoose.Types.ObjectId(req.body.userId);
        const courseId = mongoose.Types.ObjectId(req.body.courseId);

        const deletedItem = await CourseCart.deleteOne({ userId, courseId }).lean().exec();
        return res.status(200).json(deletedItem);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});

export default router;
