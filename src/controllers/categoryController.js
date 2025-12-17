import * as categoryService from "../services/categoryService.js";
import { errorHandler } from "../utils/error/errorHandler.js";

export const createCategory = async (req, res) => {
  try {
    const payload = req.body;

    const category = await categoryService.createCategory(payload);

    res.status(201).json(category);
  } catch (err) {
    return errorHandler(err, res);
  }
};

export const getCategory = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10) || null;
    const category = await categoryService.getCategory(id);
    res.status(200).json(category);
  } catch (err) {
    return errorHandler(err, res);
  }
};

export const listCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    const { items, total } = await categoryService.listCategories(
      skip,
      limit,
      search
    );

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      categories: items,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export const updateCategory = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10) || null;
    const payload = req.body;

    const updatedCategory = await categoryService.updateCategory(id, payload);

    res.status(200).json(updatedCategory);
  } catch (err) {
    return errorHandler(err, res);
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10) || null;

    await categoryService.deleteCategory(id);

    res.status(204).send();
  } catch (err) {
    return errorHandler(err, res);
  }
};
