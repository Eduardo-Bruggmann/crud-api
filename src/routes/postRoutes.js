import * as post from "../controllers/postController.js";
import { protect, adminOnly } from "../middlewares/auth.js";
import express from "express";

const {
  createPost,
  getPost,
  listPosts,
  listPostsByCategoryName,
  updatePost,
  deletePost,
} = post;

const router = express.Router();

router.post("/posts", protect, adminOnly, createPost);
router.get("/posts/:id", protect, getPost);
router.get("/posts", protect, listPosts);
router.get("/posts/category/:categoryName", protect, listPostsByCategoryName);
router.patch("/posts/:id", protect, adminOnly, updatePost);
router.delete("/posts/:id", protect, adminOnly, deletePost);

export default router;
