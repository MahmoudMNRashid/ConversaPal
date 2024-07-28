import dotenv from "dotenv";
import express from "express";
import multer from "multer";
import cookieParser from "cookie-parser";
///
import { connect } from "./util/connect.js";
import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/message.js";
import userRoutes from "./routes/user.js";
import cors from "cors";
import { app } from "./socket/socket.js";
dotenv.config();

//init multer
export const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
//Middleware for parse requests formData
app.use(upload.single("file"));
//Middleware for parse requests body(Json)
app.use(express.json());
//Middleware for parse requests cookies
app.use(cookieParser());
//init cors
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  })
);
//Middleware for auth
app.use("/auth", authRoutes);
app.use("/message", messageRoutes);
app.use("/users", userRoutes);

//Middleware for errors
app.use((error, req, res, next) => {
  console.log(error);

  const status = error.statusCode || 500;
  const message = error.message || error.error || error || "Something Accurr";
  const data = error.data || undefined;

  res.status(status).json({ message, data });
});

connect();
