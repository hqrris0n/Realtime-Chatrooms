// Express is a web framework to build APIs
//const express = require('express'); // Import express library via commonjs
import express from "express"; // Import express library via ES6 module syntax

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import path from "path";

dotenv.config();

// process.env. allows us to use environment variables via dotenv
const PORT = process.env.PORT;
const __dirname = path.resolve(); // Get the current directory name

app.use(express.json()); // Middleware to parse JSON data from incoming requests
app.use(cookieParser()); // Middleware to parse cookies from incoming requests
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin
    credentials: true, // Allow credentials (cookies) to be sent
  })
);

app.use("/api/auth", authRoutes); // use authRoutes from src/routes/auth.route.js for /api/auth endpoint; naming convention for file management
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist"))); // Serve static files from the frontend build directory

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html")); // Serve the index.html file for any other route
  })
}

server.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
  connectDB();
});
