import * as categoryService from "../services/categoryService.js";
import { categorySchema } from "../schemas/categorySchema.js";
import { logger } from "../utils/logger.js";
import { getZodErrorMessage, parseAppError } from "../utils/errorUtils.js";

const {
  insertCategory,
  findCategoryById,
  findCategoryByName,
  listCategories,
  updateCategoryById,
  deleteCategoryById,
} = categoryService;

export const createCategory = async (req, res) => {
  try {
    const payload = categorySchema.parse(req.body);

    const exists = await findCategoryByName(payload.name);
    if (exists) {
      return res.status(409).json({ message: "Category already exists" });
    }

    await insertCategory(payload);
    res.status(201).json({ message: "Category created successfully" });
  } catch (err) {
    logger.error(err);

    const msg = getZodErrorMessage(err);
    if (msg) return res.status(400).json({ message: msg });

    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await findCategoryById(parseInt(id, 10));
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    const { items, total } = await listCategories(skip, limit, search);

    if (items.length === 0) {
      return res.status(404).json({ message: "No categories found" });
    }

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      categories: items,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = categorySchema.parse(req.body);
    const category = await findCategoryById(parseInt(id, 10));

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const updatedCategory = await updateCategoryById(parseInt(id, 10), payload);
    res.status(200).json(updatedCategory);
  } catch (err) {
    logger.error(err);

    const msg = getZodErrorMessage(err);
    if (msg) return res.status(400).json({ message: msg });

    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await findCategoryById(parseInt(id, 10));

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await deleteCategoryById(parseInt(id, 10));
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    logger.error(err);

    const appErr = parseAppError(err);
    if (appErr)
      return res.status(appErr.status).json({ message: appErr.message });

    res.status(500).json({ message: "Internal server error" });
  }
};
