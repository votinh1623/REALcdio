import express from "express";
import { createPost, getAllPosts, getPostById, deletePost, getUserPostCount, likePost, dislikePost } from "../controllers/post.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Route to create a new post (only for logged-in users)
router.post("/", protectRoute, createPost);

// Route to get all posts (accessible to everyone)
router.get("/", getAllPosts);

// Route to get a single post by ID (accessible to everyone)
router.get("/:id", getPostById);

// Route to delete a post by ID (only for logged-in users)
router.delete("/:id", protectRoute, deletePost);
router.get("/:id/post-count", protectRoute, getUserPostCount);
router.post("/:id/like", protectRoute, likePost);
router.post("/:id/dislike", protectRoute, dislikePost);

export default router;