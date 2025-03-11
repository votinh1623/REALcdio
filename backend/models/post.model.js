import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        theme: {
            type: String,
            required: true,
            enum: ["art", "music", "game"],
        },
        relatedGame: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Game",
            required: function () {
                return this.theme === "game";
            },
        },
        head: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        image: {   
            type: String,
            required: [false, "Image is required"],
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        latestComment: {
            type: String,
            default: ""
        },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    {
        timestamps: true,
    }
);

postSchema.virtual('commentsCount', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'postId',
    count: true
});

postSchema.set('toObject', { virtuals: true });
postSchema.set('toJSON', { virtuals: true });

const Post = mongoose.model("Post", postSchema);

export default Post;