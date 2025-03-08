import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
    roomName: { type: String, required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

export default mongoose.model("Room", RoomSchema);
