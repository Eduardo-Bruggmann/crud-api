import * as auth from "../controllers/authController.js";
import { authLimiter } from "../middlewares/rateLimit.js";
import { protect } from "../middlewares/auth.js";
import express from "express";

const {
  register,
  login,
  logout,
  refreshTokens,
  requestPasswordReset,
  confirmPasswordReset,
} = auth;

const router = express.Router();

router.post("/auth/register", authLimiter, register);
router.post("/auth/login", authLimiter, login);
router.post("/auth/logout", protect, logout);
router.post("/auth/refresh", refreshTokens);
router.post("/auth/reset-password/request", requestPasswordReset);
router.post("/auth/reset-password/confirm", confirmPasswordReset);

export default router;
