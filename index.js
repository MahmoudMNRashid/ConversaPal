import dotenv from "dotenv";
import express from "express";
import multer from "multer";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/message.js";
import userRoutes from "./routes/user.js";
import cors from "cors";

import mongoose from "mongoose";
import { ioFunctions } from "./socket/socket.js";
import serverless from "serverless-http";

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

export const PORT = process.env.PORT || 8080;
try {
  await mongoose.connect(
    `mongodb+srv://${process.env.MONGO_CONNECT_USER_NAME}:${process.env.MONGO_CONNECT_PASSWORD}@clusterrashid.qdwwmja.mongodb.net/${process.env.MONGO_CONNECT_DB}`
  );
  const server = app.listen(PORT);
  const io = ioFunctions.init(server);

  io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    //when user connected will send his id
    const userId = socket.handshake.query.userId;
    if (userId != "undefined") userSocketMap[userId] = socket.id;

    // you update users online so you want send events to all users connected
    //emit to all users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    //on to listen to eveents
    socket.on("disconnect", () => {
      console.log("user disconnected", socket.id);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
  console.log(`Connected to port ${PORT}`);
} catch (error) {
  throw error;
}
const handler = app;
export default handler;