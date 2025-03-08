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
        const { username, email, password, role, courses } = req.body;

        // Validate Role
        if (!["teacher", "student"].includes(role)) {
            return res.status(400).json({ message: "Invalid role. Must be 'teacher' or 'student'." });
        }

        // Validate Course Selection (Must be exactly 5)
        if (!Array.isArray(courses) || courses.length !== 5) {
            return res.status(400).json({ message: "You must select exactly 5 courses." });
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
            courses, // Store selected courses
        });

        await newUser.save();
        
        res.status(201).json({ message: "User registered successfully!", userId: newUser._id });

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


/*
import { useState } from "react";

const coursesList = [
    "Medical Diagnosis & Treatment",
    "Biotechnology & Genetic Engineering",
    "Patient Care & Healthcare Management",
    "Financial Analysis & Risk Management",
    "Stock Market Trading & Investment Strategies",
    "Cryptocurrency & Blockchain Finance",
    "Aerodynamics & Flight Mechanics",
    "Avionics & Aircraft Systems",
    "Spacecraft Design & Rocket Propulsion",
    "Contract Law & Legal Documentation",
    "Intellectual Property Rights & Patents",
    "Corporate Governance & Business Law",
    "Full-Stack Web Development",
    "AI & Machine Learning for Beginners",
    "Cybersecurity & Ethical Hacking"
];

const Register = () => {
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [formData, setFormData] = useState({ username: "", email: "", password: "", role: "student" });

    const handleCourseSelection = (course) => {
        if (selectedCourses.includes(course)) {
            setSelectedCourses(selectedCourses.filter(c => c !== course));
        } else if (selectedCourses.length < 5) {
            setSelectedCourses([...selectedCourses, course]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedCourses.length !== 5) {
            alert("Please select exactly 5 courses.");
            return;
        }

        const response = await fetch("/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData, courses: selectedCourses }),
        });

        const data = await response.json();
        alert(data.message);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Username" onChange={(e) => setFormData({ ...formData, username: e.target.value })} required />
            <input type="email" placeholder="Email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            <input type="password" placeholder="Password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
            
            <select onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
            </select>

            <h4>Select exactly 5 courses:</h4>
            {coursesList.map((course) => (
                <div key={course}>
                    <input
                        type="checkbox"
                        checked={selectedCourses.includes(course)}
                        onChange={() => handleCourseSelection(course)}
                    />
                    {course}
                </div>
            ))}

            <button type="submit">Register</button>
        </form>
    );
};

export default Register;


*/