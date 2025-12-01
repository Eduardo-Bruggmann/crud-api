import * as commentService from "../services/commentService.js";
import { commentSchema } from "../schemas/commentSchema.js";
import { logger } from "../utils/logger.js";
import { getZodErrorMessage } from "../utils/errorUtils.js";

const {
  insertComment,
  findCommentById,
  listCommentsByPost,
  deleteCommentById,
} = commentService;

export const createComment = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const payload = commentSchema.parse(req.body);
    const newComment = await insertComment({
      ...payload,
      postId: parseInt(postId, 10),
      authorId: req.user.id,
    });
    res.status(201).json(newComment);
  } catch (err) {
    logger.error(err);

    const msg = getZodErrorMessage(err);
    if (msg) return res.status(400).json({ message: msg });

    res.status(500).json({ message: "Internal server error" });
  }
};

export const getComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await findCommentById(parseInt(commentId, 10));
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json(comment);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllComments = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    const { items, total } = await listCommentsByPost(
      parseInt(postId, 10),
      skip,
      limit,
      search
    );

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      comments: items,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const existingComment = await findCommentById(parseInt(commentId, 10));

    if (!existingComment)
      return res.status(404).json({ message: "Comment not found" });

    await deleteCommentById(parseInt(commentId, 10));
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
