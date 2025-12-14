import * as postRepository from "../repositories/postRepository.js";
import { findCategoryByName } from "../repositories/categoryRepository.js";
import { createPostSchema, updatePostSchema } from "../schemas/postSchema.js";
import { commentCount } from "../repositories/commentRepository.js";
import { AppError } from "../utils/error/AppError.js";

const {
  insertPost,
  findPostById,
  findPostByTitle,
  listPosts,
  listPostsByCategoryName,
  updatePostById,
  deletePostById,
} = postRepository;

export const createPost = async (payload) => {
  const data = createPostSchema.parse(payload);

  const exists = await findPostByTitle(data.title);

  if (exists) throw new AppError("Post with this title already exists", 409);

  return await insertPost(data);
};

export const getPostById = (id) => {
  const post = findPostById(id);

  if (!post) throw new AppError("Post not found", 404);

  return post;
};

export const getPosts = async (skip, take, search) => {
  const { items, total } = await listPosts(skip, take, search);

  return { items, total };
};

export const getPostsByCategoryName = async (
  categoryName,
  skip,
  take,
  search
) => {
  const category = await findCategoryByName(categoryName);

  if (!category) throw new AppError("Category not found", 404);

  const { items, total } = await listPostsByCategoryName(
    categoryName,
    skip,
    take,
    search
  );

  return { items, total };
};

export const editPostById = async (id, payload) => {
  await getPostById(id);

  const updateData = updatePostSchema.parse(payload);

  return await updatePostById(id, updateData);
};

export const removePostById = async (id) => {
  await getPostById(id);

  if (commentCount({ postId: id }) > 0) {
    throw new AppError("Post has comments and cannot be deleted", 409);
  }

  return await deletePostById(id);
};
