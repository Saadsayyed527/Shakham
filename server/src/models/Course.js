import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    videos: [{ type: String }], // Array of video URLs
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Course", CourseSchema);
