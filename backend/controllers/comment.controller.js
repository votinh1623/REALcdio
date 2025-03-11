import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";
// Create a new comment
export const createComment = async (req, res) => {
    try {
        const { postId, content } = req.body;
        const userId = req.user._id;

        const newComment = await Comment.create({ postId, userId, content });
        const post = await Post.findById(postId).populate("userId");
        if (post && post.userId._id.toString() !== userId.toString()) {
            // Save the notification in the database
            await Notification.create({
                recipient: post.userId._id, // Post owner
                sender: userId, // Commenter
                postId, // Post ID
                message: `${req.user.name} commented on your post.`,
                isRead: false, // Mark as unread
            });
        }
        res.status(201).json(newComment);
        await Post.findByIdAndUpdate(postId, { latestComment: content }, { new: true });
    } catch (error) {
        console.error("Error creating comment:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



// Get comments for a post
export const getCommentsByPostId = async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId })
            .populate("userId", "name pfp")
            .sort({ like: -1, dislike: 1, createdAt: -1 });

        res.status(200).json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
// Like a comment
export const likeComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user._id;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.likes.includes(userId)) {
            // If user already liked the comment, remove the like
            comment.likes.pull(userId);
            comment.like -= 1;
        } else {
            // If user disliked the comment, remove the dislike
            if (comment.dislikes.includes(userId)) {
                comment.dislikes.pull(userId);
                comment.dislike -= 1;
            }
            // Add the like
            comment.likes.push(userId);
            comment.like += 1;
        }

        await comment.save();
        res.json(comment);
    } catch (error) {
        console.error("Error liking comment:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Dislike a comment
export const dislikeComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user._id;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.dislikes.includes(userId)) {
            // If user already disliked the comment, remove the dislike
            comment.dislikes.pull(userId);
            comment.dislike -= 1;
        } else {
            // If user liked the comment, remove the like
            if (comment.likes.includes(userId)) {
                comment.likes.pull(userId);
                comment.like -= 1;
            }
            // Add the dislike
            comment.dislikes.push(userId);
            comment.dislike += 1;
        }

        await comment.save();
        res.json(comment);
    } catch (error) {
        console.error("Error disliking comment:", error.message);
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

        if (req.user.role !== "admin" && comment.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this comment" });
        }

        await comment.deleteOne();

        res.json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error deleting comment:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
export const getUserCommentCount = async (req, res) => {
    try {
        const userId = req.user._id;
        const commentCount = await Comment.countDocuments({ userId });

        res.status(200).json({ commentCount });
    } catch (error) {
        console.error("Error fetching comment count:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};