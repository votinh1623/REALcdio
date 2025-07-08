import http from "http";
import { Server as SocketIOServer } from "socket.io";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import cluster from "cluster";
import os from "os";

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
// import './database/syncScheduler.js'; // Uncomment to enable syncScheduler
// import '../database/syncScheduler.js'; // npm run dev
import '../database/syncScheduler.js';



dotenv.config();

const app = express();
const server = http.createServer(app); // Wrap express in HTTP server

const io = new SocketIOServer(server, {
  cors: {
    origin: "*", // ✅ this is your frontend (Vite)
    credentials: true,
  },
});
// ✅ Register real-time logic here

io.on("connection", (socket) => {
	console.log("Client connected:", socket.id);

	socket.on("joinPost", (postId) => {
		socket.join(postId);
		console.log(`User ${socket.id} joined post room: ${postId}`);
	});
	socket.on("leavePost", (postId) => {
		socket.leave(postId);
		console.log(`User ${socket.id} left post room: ${postId}`);
	});
	socket.on("deleteComment", (commentId) => {
		io.emit("deleteComment", commentId);
	});

	socket.on("disconnect", () => {
		console.log("Client disconnected:", socket.id);
	});
});

app.set("io", io);

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();
const numCPUs = Math.max(1, Math.floor(os.cpus().length / 2));
// Middleware
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

// API Routes
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

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

// Sample route
app.get('/products', async (req, res) => {
	try {
		const products = await Product.find({});
		res.status(200).json(products);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});
connectDB().then(() => {
	console.log(`MongoDB connected`);
	server.listen(PORT, () => {
		console.log(`Server running at http://localhost:${PORT}`);
	});
});
// // Cluster Setup
// if (cluster.isPrimary) {
// 	const numCPUs = os.cpus().length;
// 	console.log(`Primary PID ${process.pid} - Spawning ${numCPUs} workers...`);
// 	for (let i = 0; i < numCPUs; i++) {
// 		cluster.fork();
// 	}
// 	cluster.on("exit", (worker, code, signal) => {
// 		console.log(`Worker ${worker.process.pid} died. Restarting...`);
// 		cluster.fork();
// 	});
// } else {
// 	connectDB().then(() => {
// 		console.log(`Worker PID ${process.pid} - MongoDB connected`);
// 		app.listen(PORT, () => {
// 			console.log(`Server running at http://localhost:${PORT} - PID ${process.pid}`);
// 		});
// 	});
// }
