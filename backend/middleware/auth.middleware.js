import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
	try {
		const accessToken = req.cookies.accessToken;

		if (!accessToken) {
			return res.status(401).json({ message: "Unauthorized - No access token provided" });
		}

		try {
			const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
			const user = await User.findById(decoded.userId).select("-password");

			if (!user) {
				return res.status(401).json({ message: "User not found" });
			}
			await User.findByIdAndUpdate(user._id, { lastOnline: new Date() });

			req.user = user;

			next();
		} catch (error) {
			if (error.name === "TokenExpiredError") {
				return res.status(401).json({ message: "Unauthorized - Access token expired" });
			}
			throw error;
		}
	} catch (error) {
		console.log("Error in protectRoute middleware", error.message);
		return res.status(401).json({ message: "Unauthorized - Invalid access token" });
	}
};
// export const authenticateUser = async (req, res, next) => {
//     try {
//         const token = req.header("Authorization").replace("Bearer ", "");
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findOne({ _id: decoded._id, "tokens.token": token });

//         if (!user) {
//             throw new Error();
//         }

//         req.token = token;
//         req.user = user;
//         next();
//     } catch (error) {
//         res.status(401).json({ message: "Please authenticate" });
//     }
// };
export const adminRoute = (req, res, next) => {
	if (req.user && req.user.role === "admin") {
		next();
	} else {
		return res.status(403).json({ message: "Access denied - Admin only" });
	}
};
