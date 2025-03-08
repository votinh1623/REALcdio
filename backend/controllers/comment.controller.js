import Comment from "../models/comment.model.js";

// Create a new comment
export const createComment = async (req, res) => {
    try {
        const { postId, content } = req.body;
        const userId = req.user._id;

        const newComment = await Comment.create({ postId, userId, content });

        res.status(201).json(newComment);
    } catch (error) {
        console.error("Error creating comment:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get comments for a post
export const getCommentsByPostId = async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId })
            .populate("userId", "name")
            .sort({ createdAt: -1 });

        res.status(200).json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};