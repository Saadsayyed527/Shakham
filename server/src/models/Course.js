import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    rating: { type: Number, default: 0 },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    videos: [{ type: String }], // Video URLs
    reviews: [ReviewSchema], // Array of reviews
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Course", CourseSchema);
