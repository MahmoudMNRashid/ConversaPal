import { Server } from "socket.io";

let io;

export const ioFunctions = {
  init: (httpServer) => {
    io = new Server(httpServer, {
      cors: {
        origin: "https://conversapal.vercel.app",

        credentials: true,
      },
    });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
};
