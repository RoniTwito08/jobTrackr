import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRouter from "./routes/auth.routes";
import jobApplicationRouter from "./routes/jobApplication.routes";
import cookieParser from "cookie-parser";
import ApiError from "./utils/ApiError";

dotenv.config();
const BASE_URL = process.env.BASE_URL;

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error", error);
    process.exit(1);
  }
};

const app = express();

app.use(
  cors({
    origin: BASE_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/jobs", jobApplicationRouter);
app.use("/auth", authRouter);

// Global error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

export default app;
