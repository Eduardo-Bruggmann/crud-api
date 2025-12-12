import * as commentService from "../services/commentService.js";
import { errorHandler } from "../utils/error/errorHandler.js";

const { createComment, getCommentById, getCommentsByPost, removeCommentById } =
  commentService;

export const registerComment = async (req, res) => {
  try {
    const postId = parseInt(req.params.postId, 10);
    const payload = {
      ...req.body,
      authorId: req.user.id,
      postId,
    };

    const comment = await createComment(payload);
    res.status(201).json(comment);
  } catch (err) {
    return errorHandler(err, res);
  }
};

export const getComment = async (req, res) => {
  try {
    const commentId = parseInt(req.params.commentId, 10);

    const comment = await getCommentById(commentId);

    res.status(200).json(comment);
  } catch (err) {
    return errorHandler(err, res);
  }
};

export const listCommentsByPost = async (req, res) => {
  try {
    const postId = parseInt(req.params.postId, 10);

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    const { items, total } = await getCommentsByPost(
      postId,
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
    return errorHandler(err, res);
  }
};

export const deleteComment = async (req, res) => {
  try {
    const commentId = parseInt(req.params.commentId, 10);

    await removeCommentById(commentId);
    res.status(204).send();
  } catch (err) {
    return errorHandler(err, res);
  }
};
