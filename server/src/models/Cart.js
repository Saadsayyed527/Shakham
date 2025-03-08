import mongoose from "mongoose";

const courseCartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Reference to User model
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Course", // Reference to Course model
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model("CourseCart", courseCartSchema);
