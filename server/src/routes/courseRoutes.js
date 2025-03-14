import express from "express";
import multer from "multer";
import Course from "../models/Course.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// 🛠 Configure Multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/videos/"); // Save files in uploads/videos/
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname); // Unique filename
    }
});

const upload = multer({ storage: storage });

/**
 * 🟢 Students & Teachers can access these routes:
 * - GET /api/courses (Get all courses)
 * - GET /api/courses/:id (Get course by ID)
 */

/**
 * 🔴 Only Teachers can access these routes:
 * - POST /api/courses (Add a new course with video)
 * - PUT /api/courses/:id (Update a course)
 * - DELETE /api/courses/:id (Delete a course)
 */

// ✅ GET all courses (Students & Teachers)
router.get("/", async (req, res) => {
    try {
        const courses = await Course.find().populate("teacher", "username email");
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ GET course by ID (Students & Teachers)
router.get("/:id", async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate("teacher", "username email")
            .populate("reviews.student", "username email");

        if (!course) {
            return res.status(404).json({ message: "Course not found!" });
        }
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.post("/:id/review", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "student") {
            return res.status(403).json({ message: "Only students can review courses!" });
        }

        const { rating, comment } = req.body;
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: "Course not found!" });
        }

        const newReview = {
            student: req.user.userId,
            rating,
            comment
        };

        course.reviews.push(newReview);

        // Update course rating (average of all reviews)
        const totalRatings = course.reviews.reduce((sum, review) => sum + review.rating, 0);
        course.rating = totalRatings / course.reviews.length;

        await course.save();

        res.status(201).json({ message: "Review added successfully!", course });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


// ❌ Only Teachers Can Create a Course with Video
// ❌ Only Teachers Can Create a Course with a Video Link
router.post("/", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "teacher") {
            return res.status(403).json({ message: "Only teachers can add courses!" });
        }

        const { title, description, price, category, rating, videoUrl } = req.body;

        const newCourse = new Course({
            title,
            description,
            price,
            category,
            rating,
            teacher: req.user.userId,
            videos: videoUrl ? [videoUrl] : [] // Store YouTube link instead of an uploaded file
        });

        await newCourse.save();
        res.status(201).json({ message: "Course added successfully!", course: newCourse });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ❌ Only Teachers Can Update Their Own Courses
router.put("/:id", authMiddleware, upload.single("video"), async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: "Course not found!" });
        }

        if (req.user.role !== "teacher" || req.user.userId !== course.teacher.toString()) {
            return res.status(403).json({ message: "Unauthorized to update this course!" });
        }

        const { title, description, price, category, rating } = req.body;
        const videoPath = req.file ? `/uploads/videos/${req.file.filename}` : null;

        const updatedData = { title, description, price, category, rating };
        if (videoPath) updatedData.videos = [...course.videos, videoPath];

        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, updatedData, { new: true });

        res.status(200).json({ message: "Course updated!", course: updatedCourse });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ❌ Only Teachers Can Delete Their Own Courses
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: "Course not found!" });
        }

        if (req.user.role !== "teacher" || req.user.userId !== course.teacher.toString()) {
            return res.status(403).json({ message: "Unauthorized to delete this course!" });
        }

        await Course.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Course deleted successfully!" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

//filtering 
router.get("/filter", async (req, res) => {
    try {
        const { category, minPrice, maxPrice, rating, teacher } = req.query;

        let filter = {};

        if (category) filter.category = category;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (rating) filter.rating = { $gte: Number(rating) }; // Get courses with rating >= given rating
        if (teacher) filter.teacher = teacher; // Filter by teacher ID

        const courses = await Course.find(filter).populate("teacher", "username email");
        
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.get("/search", async (req, res) => {
    try {
        const { title } = req.query;

        if (!title) {
            return res.status(400).json({ message: "Please provide a search query!" });
        }

        // Case-insensitive search for title containing the query
        const courses = await Course.find({
            title: { $regex: title, $options: "i" }
        }).populate("teacher", "username email");

        if (courses.length === 0) {
            return res.status(404).json({ message: "No courses found!" });
        }

        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


export default router;
