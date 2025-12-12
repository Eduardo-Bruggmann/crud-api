import * as categoryRepository from "../repositories/categoryRepository.js";
import { categorySchema } from "../schemas/categorySchema.js";
import { postCount } from "../repositories/postRepository.js";
import { AppError } from "../utils/error/AppError.js";

const {
  insertCategory,
  findCategoryByName,
  findCategoryById,
  listCategories,
  updateCategoryById,
  deleteCategoryById,
} = categoryRepository;

export const createCategory = async (payload) => {
  const category = categorySchema.parse(payload);

  const exits = await findCategoryByName(category.name);

  if (exits) throw new AppError("Category already exists", 409);

  return await insertCategory(category);
};

export const getCategoryByName = async (name) => {
  const category = await findCategoryByName(name);

  if (!category) throw new AppError("Category not found", 404);

  return category;
};

export const getCategoryById = async (id) => {
  const category = await findCategoryById(id);

  if (!category) throw new AppError("Category not found", 404);

  return category;
};

export const getCategories = async (skip, take, search) => {
  const { items, total } = await listCategories(skip, take, search);

  return { items, total };
};

export const editCategoryById = async (id, data) => {
  await getCategoryById(id);

  const updatedData = categorySchema.parse(data);

  return await updateCategoryById(id, updatedData);
};

export const removeCategoryById = async (id) => {
  await getCategoryById(id);

  if ((await postCount({ categoryId: id })) > 0)
    throw new AppError("Category has posts and cannot be deleted", 409);

  return await deleteCategoryById(id);
};
