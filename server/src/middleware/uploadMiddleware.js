import multer from "multer";
import path from "path";

// Configure storage for video uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/videos/"); // Save in uploads/videos folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

// File type validation for videos
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
        cb(null, true);
    } else {
        cb(new Error("Only video files are allowed!"), false);
    }
};

// Upload settings (Max 100MB per video)
const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 },
    fileFilter
});

export default upload;
