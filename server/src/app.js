import express from 'express';
import { httpLogger } from "./utils/logger.js";
// import routes from "./routes/router.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import CustomError from "./utils/CustomError.js";
import cors from 'cors';
import dotenv from 'dotenv';
import './config/db.js';
import courseRoutes from "./routes/courseRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import generateCertificateRoute from "./routes/generate-certificate.js"; 

import path from "path";

import authRoutes from './routes/authRoutes.js';
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();

const app = express();

app.use(cors());
app.use("/uploads/videos", express.static(path.join(__dirname, "uploads/videos")));

app.use(httpLogger); 
app.use("/uploads/videos", express.static(path.join(__dirname, "uploads/videos")));
app.use("/api", generateCertificateRoute);

app.use(express.json());



// app.use("/", (req, res) => {
//     res.send("backend running");
// });
app.use('/api/cart',cartRoutes)
app.use('/api/auth', authRoutes);
app.use("/api/courses", courseRoutes);

app.use((req, res, next) => {
    if (req.path === "/favicon.ico") return res.status(204).end();
    next();
});
  
app.use((req, res, next) => {
    next(new CustomError("Route Not Found", 404));
});
app.use(errorMiddleware);

export default app;

/*

const downloadCertificate = async (userId, course) => {
    const response = await fetch(`http://localhost:5000/api/generate-certificate/${userId}/${course}`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${course}-certificate.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

// Example Usage in a Button
<button onClick={() => downloadCertificate("65f1c8a0a27e3b001d4a5d8f", "AI & Machine Learning for Beginners")}>
    Download Certificate
</button>;

*/