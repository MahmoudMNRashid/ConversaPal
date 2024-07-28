import mongoose from "mongoose";
import { server } from "../socket/socket.js";


export const port = process.env.PORT || 8080;

export const connect = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGO_CONNECT_USER_NAME}:${process.env.MONGO_CONNECT_PASSWORD}@clusterrashid.qdwwmja.mongodb.net/${process.env.MONGO_CONNECT_DB}`
    );
    server.listen(port);
    console.log(`Connected to port ${port}`);
  } catch (error) {
    throw error;
  }
};
