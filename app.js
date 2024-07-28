import dotenv from "dotenv";
import express from "express";
import multer from "multer";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/message.js";
import userRoutes from "./routes/user.js";
import cors from "cors";
import serverless from "serverless-http";
import mongoose from "mongoose";
import { app } from "./socket/socket.js";

dotenv.config();

// init multer
export const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get("/", (req, res) => res.send("Express on Vercel"));

// Middleware for parse requests formData
app.use(upload.single("file"));

// Middleware for parse requests body (Json)
app.use(express.json());

// Middleware for parse requests cookies
app.use(cookieParser());

// init cors
app.use(cors());

// Middleware for auth
app.use("/auth", authRoutes);
app.use("/message", messageRoutes);
app.use("/users", userRoutes);

// Middleware for errors
app.use((error, req, res, next) => {
  console.log(error);

  const status = error.statusCode || 500;
  const message = error.message || error.error || error || "Something occurred";
  const data = error.data || undefined;

  res.status(status).json({ message, data });
});

// Connect to MongoDB
try {
  await mongoose.connect(
    `mongodb+srv://${process.env.MONGO_CONNECT_USER_NAME}:${process.env.MONGO_CONNECT_PASSWORD}@clusterrashid.qdwwmja.mongodb.net/${process.env.MONGO_CONNECT_DB}`
  );
  console.log(`Connected to MongoDB`);
} catch (error) {
  throw error;
}

export const handler = serverless(app);
