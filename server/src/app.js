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
import fs from "fs";

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
const courses = JSON.parse(fs.readFileSync("C:/Users/Saad/OneDrive/Desktop/Echelon/Shakham/server/src/csvjson.json", "utf8"));

// Middleware



// app.use(cors());

// app.use(cors());

// ✅ Add this CORS middleware at the **top** before routes
app.use(
  cors({
    origin: "http://localhost:5173", // ✅ Allow frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // ✅ Allow necessary methods
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ Allow headers
  })
);


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
app.get("/recommend/:clusterId/:startIndex?", (req, res) => {
    const { clusterId, startIndex = 0 } = req.params;
    const filteredCourses = courses.filter(course => course.Cluster === parseInt(clusterId));
    
    const start = parseInt(startIndex);
    const end = start + 5;
    const paginatedCourses = filteredCourses.slice(start, end);

    res.json({ recommended: paginatedCourses, total: filteredCourses.length });
});
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

