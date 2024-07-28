import mongoose from "mongoose";
import { ioFunctions } from "../socket/socket.js";

var userSocketMap = {}; // {userId: socketId}

export var getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};
export const connect = async (app, PORT) => {
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
};
