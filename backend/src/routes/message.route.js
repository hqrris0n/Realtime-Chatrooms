import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { userWriteLimiter } from '../middleware/rateLimit.middleware.js';
import { getUsersForSidebar, getMessages, sendMessage } from '../controllers/message.controller.js'; // Import the controller function

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, userWriteLimiter, sendMessage);

export default router;