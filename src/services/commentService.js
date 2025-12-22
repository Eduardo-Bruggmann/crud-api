import * as commentRepository from "../repositories/commentRepository.js";
import { commentSchema } from "../schemas/commentSchema.js";
import { getPost } from "./postService.js";
import { AppError } from "../utils/error/AppError.js";

const {
  insertComment,
  findCommentById,
  findManyCommentsByPost,
  deleteCommentById,
} = commentRepository;

export const createComment = async (payload) => {
  const comment = commentSchema.parse(payload);

  const postExists = await getPost(comment.postId);

  if (!postExists) throw new AppError("Post does not exist", 404);

  return await insertComment(comment);
};

export const getComment = async (id) => {
  const comment = await findCommentById(id);

  if (!comment) throw new AppError("Comment not found", 404);

  return comment;
};

export const listCommentsByPost = async (postId, skip, take, search) => {
  await getPost(postId);

  const { items, total } = await findManyCommentsByPost(
    postId,
    skip,
    take,
    search
  );

  return { items, total };
};

export const deleteComment = async (postId, commentId) => {
  await getPost(postId);
  await getComment(commentId);

  return await deleteCommentById(commentId);
};
