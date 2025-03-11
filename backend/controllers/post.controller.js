import Post from "../models/post.model.js";
// import Game from "../models/game.model.js"; // Import the Game model
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
            newPostData.relatedGame = mongoose.Types.ObjectId(relatedGame);
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
        const posts = await Post.find()
            .populate("userId", "name")
            .populate("relatedGame", "gameName")
            .populate({ path: 'commentsCount' });
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error in getAllPosts controller:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get a single post by ID
export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate("userId", "name").populate("relatedGame", "gameName");
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
export const getUserPostCount = async (req, res) => {
    try {
        const userId = req.user._id;
        const postCount = await Post.countDocuments({ userId });

        res.status(200).json({ postCount });
    } catch (error) {
        console.error("Error fetching post count:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Remove dislike if user previously disliked
        post.dislikes = post.dislikes.filter((uid) => uid.toString() !== userId.toString());

        // Check if user already liked
        if (!post.likes.includes(userId)) {
            post.likes.push(userId);
        }

        await post.save();
        res.json({ message: "Post liked", post });
    } catch (error) {
        console.error("Error in likePost:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const dislikePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Remove like if user previously liked
        post.likes = post.likes.filter((uid) => uid.toString() !== userId.toString());

        // Check if user already disliked
        if (!post.dislikes.includes(userId)) {
            post.dislikes.push(userId);
        }

        await post.save();
        res.json({ message: "Post disliked", post });
    } catch (error) {
        console.error("Error in dislikePost:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};