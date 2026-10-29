import mongoose from "mongoose";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId } from "../lib/socket.js";
import { io } from "../lib/socket.js";
import { isImageDataUrl, MAX_MESSAGE_LENGTH } from "../lib/validate.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("fullName profilePic"); // Only what the sidebar shows; don't expose other users' emails

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (text !== undefined && (typeof text !== "string" || text.length > MAX_MESSAGE_LENGTH)) {
      return res.status(400).json({ message: `Messages must be text of at most ${MAX_MESSAGE_LENGTH} characters` });
    }
    if (image && !isImageDataUrl(image)) {
      return res.status(400).json({ message: "Images must be PNG, JPEG, WebP or GIF" });
    }
    if (!text?.trim() && !image) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    // Only deliver to real accounts; also avoids a 500 when the id isn't an ObjectId
    if (!mongoose.isValidObjectId(receiverId) || !(await User.exists({ _id: receiverId }))) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    let imageURL;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, { resource_type: "image" });
      imageURL = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageURL,
    });

    await newMessage.save();

    // Realtime funcitonaility w socket.io
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) { // If the receiver is online bc they're id is in the userSocketMap
      // specific emit to the receiver
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
