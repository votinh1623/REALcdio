import express from "express";
import { createComment, getCommentsByPostId, deleteComment } from "../controllers/comment.controller.js";
import {protectRoute} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, createComment);
router.get("/:postId", getCommentsByPostId);
router.delete("/:commentId", protectRoute, deleteComment);
export default router;