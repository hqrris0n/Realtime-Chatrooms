import rateLimit from "express-rate-limit";

// Per-user cap on routes that write messages or upload to Cloudinary; must run after protectRoute
export const userWriteLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 30, // requests per user per window
  keyGenerator: (req) => String(req.user._id),
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "You're sending too fast, please slow down" },
});
