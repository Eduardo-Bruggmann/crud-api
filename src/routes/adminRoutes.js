import express from "express";
import { protect, adminOnly } from "../middlewares/auth.js";
import * as admin from "../controllers/adminController.js";

const { createUser, getUser, getAllUsers, updateUser, deleteUser } = admin;

const router = express.Router();

router.post("/admin/users", protect, adminOnly, createUser);
router.get("/admin/users/:id", protect, adminOnly, getUser);
router.get("/admin/users", protect, adminOnly, getAllUsers);
router.put("/admin/users/:id", protect, adminOnly, updateUser);
router.delete("/admin/users/:id", protect, adminOnly, deleteUser);

export default router;
