import * as postRepository from "../repositories/postRepository.js";
import { findCategoryByName } from "../repositories/categoryRepository.js";
import { createPostSchema, updatePostSchema } from "../schemas/postSchema.js";
import { commentCount } from "../repositories/commentRepository.js";
import { AppError } from "../utils/error/AppError.js";

const {
  insertPost,
  findPostById,
  findPostByTitle,
  findManyPosts,
  findManyPostsByCategoryName,
  updatePostById,
  deletePostById,
} = postRepository;

export const createPost = async (payload) => {
  const data = createPostSchema.parse(payload);

  const exists = await findPostByTitle(data.title);

  if (exists) throw new AppError("Post with this title already exists", 409);

  return await insertPost(data);
};

export const getPost = async (id) => {
  const post = await findPostById(id);

  if (!post) throw new AppError("Post not found", 404);

  return post;
};

export const listPosts = async (skip, take, search) => {
  const { items, total } = await findManyPosts(skip, take, search);

  return { items, total };
};

export const listPostsByCategoryName = async (
  categoryName,
  skip,
  take,
  search
) => {
  const category = await findCategoryByName(categoryName);

  if (!category) throw new AppError("Category not found", 404);

  const { items, total } = await findManyPostsByCategoryName(
    categoryName,
    skip,
    take,
    search
  );

  return { items, total };
};

export const updatePost = async (id, payload) => {
  await getPost(id);

  const updateData = updatePostSchema.parse(payload);

  return await updatePostById(id, updateData);
};

export const deletePost = async (id) => {
  await getPost(id);

  if ((await commentCount({ postId: id })) > 0) {
    throw new AppError("Post has comments and cannot be deleted", 409);
  }

  return await deletePostById(id);
};
