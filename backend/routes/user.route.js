import express from "express";
import { registerUser, loginUser, getUserProfile} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUserPostCount } from "../controllers/post.controller.js";
import { getUserCommentCount } from "../controllers/comment.controller.js";
import { getUserProfileById } from "../controllers/user.controller.js";
const router = express.Router()

// Route to register a new user
//router.post("/register", registerUser);

// Route to login a user
router.post("/login", loginUser);

// Route to get user profile (only for logged-in users)
router.get("/:id", getUserProfileById);
router.get("/profile", protectRoute, getUserProfile);
router.get("/:id/post-count", protectRoute, getUserPostCount);
router.get("/:id/comment-count", protectRoute, getUserCommentCount);
export default router;