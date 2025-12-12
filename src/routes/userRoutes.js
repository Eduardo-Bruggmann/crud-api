import * as user from "../controllers/userController.js";
import { generalLimiter } from "../middlewares/rateLimit.js";
import { protect } from "../middlewares/auth.js";
import express from "express";

const {
  getUser,
  listPublicUsers,
  updateUser,
  requestPasswordReset,
  confirmPasswordReset,
  deleteUser,
} = user;

const router = express.Router();

router.get("/users/profile", protect, getUser);
router.get("/users/public", generalLimiter, protect, listPublicUsers);
router.patch("/users/profile", protect, updateUser);
router.post("/users/reset-password/request", requestPasswordReset);
router.post("/users/reset-password/confirm", confirmPasswordReset);
router.delete("/users/profile", protect, deleteUser);

export default router;
