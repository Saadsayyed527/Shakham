import express from 'express';
import { httpLogger } from "./utils/logger.js";
import routes from "./routes/router.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import CustomError from "./utils/CustomError.js";


const app = express();
app.use(httpLogger); 

app.use("/",(req,res)=>{
    res.send("running on 3000")
})
app.use("/api", routes);

app.use((req, res, next) => {
    if (req.path === "/favicon.ico") return res.status(204).end();
    next();
  });
  

app.use((req, res, next) => {
    next(new CustomError("Route Not Found", 404));
});
app.use(errorMiddleware);

export default app;