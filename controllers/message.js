import Conversation from "../models/conversation.js";
import Message from "../models/message.js";
import { getReceiverSocketId } from "../util/connect.js";

export const sendMessage = async (req, res, next) => {
  const { message } = req.body;
  const { id: receiverId } = req.params;
  const senderId = req.userId;
  try {
    //get the conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    //check from the conversation if not found will create a new conversation
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        // no need to messages because the default is empty array
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    //check if succssfully created
    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    // await conversation.save();
    // await newMessage.save();

    // this will run in parallel
    await Promise.all([conversation.save(), newMessage.save()]);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      // io.to(<socket_id>).emit() used to send events to specific client
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    next(error);
  }
};

export const getMessage = async (req, res, next) => {
  const { id: userToChatId } = req.params;
  const senderId = req.userId;

  try {
    //get conversation with content of messages
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    if (!conversation) return res.status(200).json([]);

    const messages = conversation.messages;

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};
