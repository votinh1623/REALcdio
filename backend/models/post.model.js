import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        theme: {
            type: String,
            required: true,
            enum: ["art", "music", "game"],
        },
        relatedGame: {
            type: String,
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
    },
    {
        timestamps: true,
	}
);

const Post = mongoose.model("Post", postSchema);

export default Post;