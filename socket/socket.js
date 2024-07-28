import { Server } from "socket.io";
import express from "express";
import http from "http";

export const app = express();
export const server = http.createServer(app);
export const io = new Server(server);

const userSocketMap = {}; // {userId: socketId}
//every user has socket id
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

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
