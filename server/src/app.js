import express from 'express';
import { httpLogger } from "./utils/logger.js";
// import routes from "./routes/router.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import CustomError from "./utils/CustomError.js";
import cors from 'cors';
import dotenv from 'dotenv';
import './config/db.js';

import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
app.use(httpLogger); 

app.use(express.json());

app.use(cors());

// app.use("/", (req, res) => {
//     res.send("backend running");
// });

app.use('/api/auth', authRoutes);

app.use((req, res, next) => {
    if (req.path === "/favicon.ico") return res.status(204).end();
    next();
});
  
app.use((req, res, next) => {
    next(new CustomError("Route Not Found", 404));
});
app.use(errorMiddleware);

export default app;