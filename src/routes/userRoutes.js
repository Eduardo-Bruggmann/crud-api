import express from "express";
import { protect } from "../middlewares/auth.js";
import { generalLimiter } from "../middlewares/rateLimit.js";

import * as user from "../controllers/userController.js";
const { getUser, getAllUsers, updateUser, deleteUser } = user;

const router = express.Router();

router.get("/users/profile", protect, getUser);
router.get("/users/public", generalLimiter, protect, getAllUsers);
router.patch("/users/profile", protect, updateUser);
router.delete("/users/profile", protect, deleteUser);

export default router;
