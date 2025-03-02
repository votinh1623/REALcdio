import express from "express";
import { registerUser, loginUser, getUserProfile } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Route to register a new user
router.post("/register", registerUser);

// Route to login a user
router.post("/login", loginUser);

// Route to get user profile (only for logged-in users)
router.get("/profile", protectRoute, getUserProfile);

export default router;