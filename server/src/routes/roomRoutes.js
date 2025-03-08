import express from "express";
import Room from "../models/Room.js";

const router = express.Router();

// Create a Room (Teacher only)
router.post("/create", async (req, res) => {
    try {
        const { roomName, teacherId } = req.body;

        if (!roomName || !teacherId) {
            return res.status(400).json({ message: "Room name and teacher ID are required" });
        }

        const newRoom = new Room({ roomName, teacherId, students: [] });
        await newRoom.save();

        res.status(201).json({ message: "Room created successfully", room: newRoom });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Join a Room (Student only)
router.post("/join", async (req, res) => {
    try {
        const { roomId, studentId } = req.body;

        const room = await Room.findById(roomId);
        if (!room) return res.status(404).json({ message: "Room not found" });

        if (!room.students.includes(studentId)) {
            room.students.push(studentId);
            await room.save();
        }

        res.status(200).json({ message: "Joined room successfully", room });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

export default router;
