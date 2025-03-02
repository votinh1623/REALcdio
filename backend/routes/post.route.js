import express from "express";
import { createPost, getAllPosts, getPostById } from "../controllers/post.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Route to create a new post (only for logged-in users)
router.post("/", protectRoute, createPost);

// Route to get all posts (accessible to everyone)
router.get("/", getAllPosts);

// Route to get a single post by ID (accessible to everyone)
router.get("/:id", getPostById);

export default router;