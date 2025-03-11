import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        like: {
            type: Number,
            default: 0,
        },
        dislike: {
            type: Number,
            default: 0,
        },
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        dislikes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }]
    },
    {
        timestamps: true,
    }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;