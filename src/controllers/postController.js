import * as postService from "../services/postService.js";
import { errorHandler } from "../utils/error/errorHandler.js";

const {
  createPost,
  getPostById,
  getPosts,
  getPostsByCategoryName,
  editPostById,
  removePostById,
} = postService;

export const registerPost = async (req, res) => {
  try {
    const payload = req.body;

    const data = { ...payload, authorId: req.user.id };

    await createPost(data);

    res.status(201).json({ message: "Post created successfully" });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export const getPost = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const post = await getPostById(id);

    res.status(200).json(post);
  } catch (err) {
    return errorHandler(err, res);
  }
};

export const listPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    const { items, total } = await getPosts(skip, limit, search);

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      posts: items,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export const listPostsByCategoryName = async (req, res) => {
  try {
    const categoryName = req.params.categoryName;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    const { items, total } = await getPostsByCategoryName(
      categoryName,
      skip,
      limit,
      search
    );

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      posts: items,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export const updatePost = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const payload = req.body;

    const updatedPost = await editPostById(id, payload);
    res.json(updatedPost);
  } catch (err) {
    return errorHandler(err, res);
  }
};

export const deletePost = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    await removePostById(id);
    res.status(204).end();
  } catch (err) {
    return errorHandler(err, res);
  }
};
