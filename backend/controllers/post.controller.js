import Post from "../models/post.model.js";
import cloudinary from "../lib/cloudinary.js";

// Create a new post
export const createPost = async (req, res) => {
    try {
        const { theme, relatedGame, head, body, image } = req.body;
        const userId = req.user._id;
        let cloudinaryResponse = null;

        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "posts" });
        }

        const newPostData = {
            theme,
            head,
            body,
            userId,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
        };

        if (theme === "game" && relatedGame) {
            newPostData.relatedGame = relatedGame;
        }

        const newPost = await Post.create(newPostData);

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
        console.error("Error in getAllPosts controller:", error.message);
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
        console.error("Error in getPostById controller:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete a post
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.image) {
            const publicId = post.image.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(`posts/${publicId}`);
                console.log("Deleted image from Cloudinary");
            } catch (error) {
                console.log("Error deleting image from Cloudinary:", error);
            }
        }

        await Post.findByIdAndDelete(req.params.id);

        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error in deletePost controller:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get posts by theme
export const getPostsByTheme = async (req, res) => {
    const { theme } = req.params;
    try {
        const posts = await Post.find({ theme });
        res.json({ posts });
    } catch (error) {
        console.error("Error in getPostsByTheme controller:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Toggle featured post
export const toggleFeaturedPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post) {
            post.isFeatured = !post.isFeatured;
            const updatedPost = await post.save();
            res.json(updatedPost);
        } else {
            res.status(404).json({ message: "Post not found" });
        }
    } catch (error) {
        console.error("Error in toggleFeaturedPost controller:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get featured posts
export const getFeaturedPosts = async (req, res) => {
    try {
        const featuredPosts = await Post.find({ isFeatured: true }).lean();
        res.json(featuredPosts);
    } catch (error) {
        console.error("Error in getFeaturedPosts controller:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};