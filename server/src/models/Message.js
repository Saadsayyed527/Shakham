import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Message", MessageSchema);
