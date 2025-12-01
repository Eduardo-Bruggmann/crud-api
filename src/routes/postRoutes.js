import express from "express";

import { protect, adminOnly } from "../middlewares/auth.js";
import * as post from "../controllers/postController.js";

const { createPost, getPost, getAllPosts, updatePost, deletePost } = post;

const router = express.Router();

router.post("/posts", protect, adminOnly, createPost);
router.get("/posts/:id", getPost);
router.get("/posts", getAllPosts);
router.patch("/posts/:id", protect, adminOnly, updatePost);
router.delete("/posts/:id", protect, adminOnly, deletePost);
export default router;
