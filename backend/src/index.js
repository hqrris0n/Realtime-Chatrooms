// Express is a web framework to build APIs
//const express = require('express'); // Import express library via commonjs
import express from "express"; // Import express library via ES6 module syntax

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

// process.env. allows us to use environment variables via dotenv
const PORT = process.env.PORT;

app.use(express.json()); // Middleware to parse JSON data from incoming requests
app.use(cookieParser()); // Middleware to parse cookies from incoming requests

app.use("/api/auth", authRoutes); // use authRoutes from src/routes/auth.route.js for /api/auth endpoint; naming convention for file management
app.use("/api/message", messageRoutes);

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
  connectDB();
});
