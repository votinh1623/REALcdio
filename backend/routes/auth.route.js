import express from "express";
import { login, logout, signup, refreshToken, getProfile, changePassword, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Configure Multer to save files to the "uploads" directory

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.get("/profile", protectRoute, getProfile);
router.post("/update-profile", protectRoute, updateProfile); // New route for updating profile
router.post("/change-password", protectRoute, changePassword);
//router.post('/update-pfp', upload.single('profilePicture'), updateUserPfp);
export default router;
