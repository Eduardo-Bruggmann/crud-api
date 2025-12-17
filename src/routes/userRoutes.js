import * as user from "../controllers/userController.js";
import { generalLimiter } from "../middlewares/rateLimit.js";
import { protect } from "../middlewares/auth.js";
import express from "express";

const { getUser, listPublicUsers, updateUser, deleteUser } = user;

const router = express.Router();

router.get("/users/profile", protect, getUser);
router.get("/users/public", generalLimiter, protect, listPublicUsers);
router.patch("/users/profile", protect, updateUser);
router.delete("/users/profile", protect, deleteUser);

export default router;
