import { Server } from "socket.io";
import http from "http"; //built into node
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === "production" 
      ? true // Allow any origin in production
      : "http://localhost:5173",
    credentials: true
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Stores online users with their socket IDs
const userSocketMap = {}; //{userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }
  // Io emits an event to all connected clients to get the list of online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
