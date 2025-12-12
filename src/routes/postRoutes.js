import * as post from "../controllers/postController.js";
import { protect, adminOnly } from "../middlewares/auth.js";
import express from "express";

const {
  registerPost,
  getPost,
  getPostByTitle,
  listPosts,
  listPostsByCategoryName,
  updatePost,
  deletePost,
} = post;

const router = express.Router();

router.post("/posts", protect, adminOnly, registerPost);
router.get("/posts/:id", getPost);
router.get("/posts/title/:title", getPostByTitle);
router.get("/posts", listPosts);
router.get("/posts/category/:categoryName", listPostsByCategoryName);
router.patch("/posts/:id", protect, adminOnly, updatePost);
router.delete("/posts/:id", protect, adminOnly, deletePost);

export default router;
