import { Server } from "socket.io";
import http from "http"; //built into node
import express from "express";
import jwt from "jsonwebtoken";
import { parse as parseCookie } from "cookie";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === "production"
      ? "https://realtime-chatrooms.onrender.com" // Only the deployed frontend
      : "http://localhost:5173",
    credentials: true
  },
  maxHttpBufferSize: 1e5, // 100 KB per socket message
});

// Only allow sockets that carry a valid login cookie; the user ID comes from the token, never from the client
io.use((socket, next) => {
  try {
    const { jwt: token } = parseCookie(socket.handshake.headers.cookie || "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = String(decoded.userId);
    next();
  } catch {
    next(new Error("Unauthorized"));
  }
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Stores online users with their socket IDs
const userSocketMap = {}; //{userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  const userId = socket.userId;
  userSocketMap[userId] = socket.id;
  // Io emits an event to all connected clients to get the list of online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // Only remove the entry if it still points at this socket (another tab may have replaced it)
    if (userSocketMap[userId] === socket.id) delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
