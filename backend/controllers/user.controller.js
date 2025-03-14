import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../lib/cloudinary.js";

// Register a new user
export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({ token, user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Login a user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ token, user });
        // window.location.reload();
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get user profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
export const getUserProfileById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("name pfp lastOnline");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// export const getUserPostCount = async (req, res) => {
//     try {
//         const userId = req.params.id; // ✅ Use userId properly
//         if (!userId) {
//             return res.status(400).json({ message: "User ID is required" });
//         }

//         // Count total posts by the user
//         const postCount = await Post.countDocuments({ userId });

//         res.status(200).json({ postCount });
//     } catch (error) {
//         console.error("Error fetching post count:", error.message);
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };
export const getUserPostCount = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const postCount = await Post.countDocuments({ userId: id });

        res.status(200).json({ postCount });
    } catch (error) {
        console.error("Error fetching post count:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
export const getUserCommentCount = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const commentCount = await Comment.countDocuments({ userId: id });

        res.status(200).json({ commentCount });
    } catch (error) {
        console.error("Error fetching comment count:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
export const updateUserPfp = async (req, res) => {
    try {
        const { pfp } = req.body; // Base64 encoded image
        const userId = req.user._id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: No user ID found" });
        }

        if (!pfp) {
            return res.status(400).json({ message: "No image provided" });
        }

        // Upload image to Cloudinary
        const cloudinaryResponse = await cloudinary.uploader.upload(pfp, {
            folder: "pfp",
            resource_type: "image"
        });

        if (!cloudinaryResponse.secure_url) {
            return res.status(500).json({ message: "Failed to upload image to Cloudinary" });
        }

        // Update user profile picture
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { pfp: cloudinaryResponse.secure_url },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Profile picture updated successfully",
            pfp: updatedUser.pfp
        });
    } catch (error) {
        console.error("Error updating profile picture:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
