import express from "express";
import { protect } from "../middlewares/auth.js";
// import { authLimiter } from "../middlewares/rateLimit.js";
import * as auth from "../controllers/authController.js";

const { registerUser, loginUser, logoutUser, refreshToken } = auth;

const router = express.Router();

router.post("/auth/register", registerUser); // adicionar authLimiter
router.post("/auth/login", loginUser); // adicionar authLimiter
router.post("/auth/logout", protect, logoutUser); // testar
router.post("/auth/refresh", refreshToken); // testar

export default router;
