import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";




import authRouter from "./routes/auth.route.js";

const app = express();
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.static("public"));
app.use(cookieParser());



app.use("/api/v1/auth", authRouter);
export {app};