import * as comment from "../controllers/commentController.js";
import { protect } from "../middlewares/auth.js";
import express from "express";

const { registerComment, listCommentsByPost, deleteComment } = comment;

const router = express.Router();

router.post("/posts/:postId/comments", protect, registerComment);
router.get("/posts/:postId/comments", listCommentsByPost);
router.delete("/posts/:postId/comments/:commentId", protect, deleteComment);

export default router;
