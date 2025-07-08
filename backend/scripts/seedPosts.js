// seedPosts.js

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

// simulate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config({ path: path.resolve(__dirname, "../../.env") });


// Import your connectDB function from lib/db.js
import { connectDB } from "../lib/db.js";

// Your Post model
import Post from "../models/post.model.js"; // adjust the path as needed

// Example: Seed function
const run = async () => {
  try {
    await connectDB();

    const fakePosts = [...Array(100)].map((_, i) => ({
      theme: "art",
      head: `Test post #${i + 1}`,
      body: "This is a test post body.",
      userId: "67ced181fba2c619c14cecab", // Replace with a real user ObjectId
    }));

    const result = await Post.insertMany(fakePosts);
    console.log(`✅ Inserted ${result.length} posts`);
  } catch (err) {
    console.error("❌ Error seeding posts:", err);
  } finally {
    mongoose.disconnect();
  }
};

run();
