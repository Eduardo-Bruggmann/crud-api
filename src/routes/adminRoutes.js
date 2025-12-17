import * as admin from "../controllers/adminController.js";
import { protect, adminOnly } from "../middlewares/auth.js";
import express from "express";

const { createUser, getUser, listUsers, updateUser, deleteUser } = admin;

const router = express.Router();

router.post("/admin/users", protect, adminOnly, createUser);
router.get("/admin/users/:id", protect, adminOnly, getUser);
router.get("/admin/users", protect, adminOnly, listUsers);
router.patch("/admin/users/:id", protect, adminOnly, updateUser);
router.delete("/admin/users/:id", protect, adminOnly, deleteUser);

export default router;
