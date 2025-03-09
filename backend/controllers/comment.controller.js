import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
// Create a new comment
export const createComment = async (req, res) => {
    try {
        const { postId, content } = req.body;
        const userId = req.user._id;

        const newComment = await Comment.create({ postId, userId, content });
        await Post.findByIdAndUpdate(postId, { latestComment: content });
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
// Delete a comment
export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user._id;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this comment" });
        }

        await comment.deleteOne();

        res.json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error deleting comment:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};