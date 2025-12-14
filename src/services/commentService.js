import * as commentRepository from "../repositories/commentRepository.js";
import { commentSchema } from "../schemas/commentSchema.js";
import { getPostById } from "./postService.js";
import { AppError } from "../utils/error/AppError.js";

const {
  insertComment,
  findCommentById,
  listCommentsByPost,
  deleteCommentById,
} = commentRepository;

export const createComment = async (payload) => {
  const comment = commentSchema.parse(payload);

  const postExists = await getPostById(comment.postId);

  if (!postExists) throw new AppError("Post does not exist", 404);

  return await insertComment(comment);
};

export const getCommentById = async (id) => {
  const comment = await findCommentById(id);

  if (!comment) throw new AppError("Comment not found", 404);

  return comment;
};

export const getCommentsByPost = async (postId, skip, take, search) => {
  await getPostById(postId);

  const { items, total } = await listCommentsByPost(postId, skip, take, search);

  return { items, total };
};

export const removeCommentById = async (postId, commentId) => {
  await getPostById(postId);
  await getCommentById(commentId);

  return await deleteCommentById(commentId);
};
