import express from 'express';
import { signup, login, logout, updateProfile, checkAuth } from '../controllers/auth.controller.js'; // Import functions from auth.controller.js
import { protectRoute } from '../middleware/auth.middleware.js'; // Import protectRoute middleware

const router = express.Router();

// Endpoints in addition to the default /api/auth
  // post instead of get because we are sending data
  // functions moved to controllers in order to keep file organized
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);

export default router;