import * as postService from "../services/postService.js";
import { createPostSchema, updatePostSchema } from "../schemas/postSchema.js";
import { logger } from "../utils/logger.js";
import { getZodErrorMessage, parseAppError } from "../utils/errorUtils.js";

const { insertPost, findPostById, listPosts, updatePostById, deletePostById } =
  postService;

export const createPost = async (req, res) => {
  try {
    const payload = createPostSchema.parse(req.body);

    const data = { ...payload, authorId: req.user.id };

    const post = await insertPost(data);

    res.status(201).json(post);
  } catch (err) {
    logger.error(err);

    const msg = getZodErrorMessage(err);
    if (msg) return res.status(400).json({ message: msg });

    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await findPostById(parseInt(id, 10));
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    const { items, total } = await listPosts(skip, limit, search);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      posts: items,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = updatePostSchema.parse(req.body);
    const post = await findPostById(parseInt(id, 10));

    if (!post) return res.status(404).json({ message: "Post not found" });

    const updatedPost = await updatePostById(parseInt(id, 10), payload);
    res.json(updatedPost);
  } catch (err) {
    logger.error(err);

    const msg = getZodErrorMessage(err);
    if (msg) return res.status(400).json({ message: msg });

    res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await findPostById(parseInt(id, 10));

    if (!post) return res.status(404).json({ message: "Post not found" });
    await deletePostById(parseInt(id, 10));
    res.status(204).end();
  } catch (err) {
    logger.error(err);

    const appErr = parseAppError(err);
    if (appErr)
      return res.status(appErr.status).json({ message: appErr.message });

    res.status(500).json({ message: "Internal server error" });
  }
};
