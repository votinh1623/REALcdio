import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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