import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.model.js"; // Adjust the path if necessary
import { connectDB } from "../lib/db.js";

dotenv.config();

const updateUsers = async () => {
    try {
        await connectDB();
        const result = await User.updateMany(
            { lastOnline: { $exists: false } },
            { $set: { lastOnline: new Date() } }
        );
        console.log(`Updated ${result.modifiedCount} users with lastOnline.`);
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("Error updating lastOnline:", error.message);
        process.exit(1);
    }
};
updateUsers();