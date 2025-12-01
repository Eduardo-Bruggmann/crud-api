import express from "express";
import { protect } from "../middlewares/auth.js";
import { authLimiter } from "../middlewares/rateLimit.js";
import * as auth from "../controllers/authController.js";

const { registerUser, loginUser, logoutUser, refreshToken } = auth;

const router = express.Router();

router.post("/auth/register", authLimiter, registerUser);
router.post("/auth/login", authLimiter, loginUser);
router.post("/auth/logout", protect, logoutUser);
router.post("/auth/refresh", refreshToken);

export default router;
