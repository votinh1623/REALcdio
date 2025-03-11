import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import postRoutes from "./routes/post.route.js";
import userRoutes from "./routes/user.route.js";
import commentRoute from "./routes/comment.route.js";
import notificationRoutes from "./routes/notification.route.js";
import Game from "./models/game.model.js";
import User from "./models/user.model.js";
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(express.json({ limit: "10mb" })); // allows you to parse the body of the request
app.use(cookieParser());
//  
// const updateLastOnline = async () => {
//     try {
//         const result = await User.updateMany(
//             { lastOnline: { $exists: false } }, // Only update users without lastOnline
//             { $set: { lastOnline: new Date() } }
//         );

//         console.log(`✅ Updated ${result.modifiedCount} users with lastOnline.`);
//     } catch (error) {
//         console.error("❌ Error updating lastOnline:", error.message);
//     }
// };
connectDB().then(() => {
    console.log("MongoDB connected successfully");
	//await updateLastOnline();
    // Start the server only after DB is connected
    app.listen(PORT, () => {
        console.log("Server is running on http://localhost:" + PORT);
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoute);
app.use("/api/notifications", notificationRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post-count", postRoutes);
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}


//
app.get('/products', async (req, res) => {
	try {
		const products = await Product.find({});
		res.status(200).json(products);

	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});