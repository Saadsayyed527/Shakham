import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

// Send a message
router.post("/send", async (req, res) => {
    try {
        const { roomId, senderId, text } = req.body;

        if (!roomId || !senderId || !text) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newMessage = new Message({ roomId, senderId, text });
        await newMessage.save();

        res.status(201).json({ message: "Message sent", messageData: newMessage });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Get all messages in a room
router.get("/:roomId", async (req, res) => {
    try {
        const messages = await Message.find({ roomId: req.params.roomId }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


export default router;
