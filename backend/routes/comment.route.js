import express from "express";
import { createComment, getCommentsByPostId, deleteComment, likeComment, dislikeComment, getUserCommentCount } from "../controllers/comment.controller.js";
import {protectRoute, adminRoute} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, createComment);
router.get("/:postId", getCommentsByPostId);
router.delete("/:commentId", protectRoute, deleteComment);
router.post("/:commentId/like", protectRoute, likeComment);
router.post("/:commentId/dislike", protectRoute, dislikeComment);
router.get("/:id/comment-count", protectRoute, getUserCommentCount);
export default router;