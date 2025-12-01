import express from "express";
import { protect } from "../middlewares/auth.js";
import * as comment from "../controllers/commentController.js";

const { createComment, getAllComments, deleteComment } = comment;

const router = express.Router();

router.post("/posts/:id/comments", protect, createComment);
router.get("/posts/:id/comments", getAllComments);
router.delete("/comments/:commentId", protect, deleteComment);

export default router;
