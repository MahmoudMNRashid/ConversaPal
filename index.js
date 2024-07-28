import dotenv from "dotenv";
import express from "express";
import multer from "multer";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/message.js";
import userRoutes from "./routes/user.js";
import cors from "cors";

import { connect } from "./util/connect.js";
import { allowCors } from "./util/help.js";

const app = express();

dotenv.config();

// init multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get("/", (req, res) => res.send("Express on Vercel"));

// Middleware for parse requests formData
app.use(upload.single("file"));

// Middleware for parse requests body (Json)
app.use(express.json());

// Middleware for parse requests cookies
app.use(cookieParser());


app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

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

export const PORT = process.env.PORT || 8080;
connect(app, PORT);
const handler = app;
export default handler;
