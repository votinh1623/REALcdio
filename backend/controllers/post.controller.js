import Post from "../models/post.model.js";
import mongoose from "mongoose";
// Create a new post
export const createPost = async (req, res) => {
    try {
        const { theme, relatedGame, head, body } = req.body;
        const userId = req.user._id;

        const newPostData = {
            theme,
            head,
            body,
            userId,
        };

        if (theme === "game" && relatedGame) {
            newPostData.relatedGame = relatedGame;
        }

        const newPost = new Post(newPostData);

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.error("Error creating post:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all posts
export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate("userId", "username");
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get a single post by ID
export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate("userId", "username").populate("relatedGame", "name");
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};