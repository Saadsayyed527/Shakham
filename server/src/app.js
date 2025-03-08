import express from "express";
import { httpLogger } from "./utils/logger.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import CustomError from "./utils/CustomError.js";
import cors from "cors";
import dotenv from "dotenv";
import "./config/db.js";
import courseRoutes from "./routes/courseRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import generateCertificateRoute from "./routes/generate-certificate.js";

import http from "http";
import { Server } from "socket.io";
import roomRoutes from "./routes/roomRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import Room from "./models/Room.js";
import path from "path";
import authRoutes from "./routes/authRoutes.js";
import { fileURLToPath } from "url";

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Middleware
app.use(cors());
app.use(express.json());
app.use(httpLogger);
app.use("/uploads/videos", express.static(path.join(__dirname, "uploads/videos")));

// Routes
app.use("/api/rooms", roomRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", generateCertificateRoute);

// Handle Favicon Request
app.use((req, res, next) => {
    if (req.path === "/favicon.ico") return res.status(204).end();
    next();
});

// Route Not Found Handler
app.use((req, res, next) => {
    next(new CustomError("Route Not Found", 404));
});

// Error Middleware
app.use(errorMiddleware);

// 🔥 WebSocket Logic: Real-Time Chat
io.on("connection", (socket) => {
    console.log("🔗 User connected:", socket.id);

    // Joining a room
    socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
        console.log(`✅ User joined room: ${roomId}`);
    });

    // Sending messages
    socket.on("sendMessage", async ({ roomId, senderId, text }) => {
        const message = { sender: senderId, text, timestamp: new Date() };

        try {
            const room = await Room.findById(roomId);
            if (room) {
                room.messages.push(message);
                await room.save();
            }
        } catch (error) {
            console.error("❌ Error saving message:", error);
        }

        io.to(roomId).emit("newMessage", message);
    });

    // User disconnect
    socket.on("disconnect", () => {
        console.log("🔴 User disconnected:", socket.id);
    });
});

// Export `server` instead of `app` to allow WebSocket
export default app;

