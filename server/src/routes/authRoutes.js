import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Import User Model
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// 📌 User Registration (Teacher/Student)
router.post("/register", async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Validate Role
        if (!["teacher", "student"].includes(role)) {
            return res.status(400).json({ message: "Invalid role. Must be 'teacher' or 'student'." });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists!" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role,
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// 📌 User Login (Teacher/Student)
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password!" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password!" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ message: "Login successful!", token });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

export default router;
