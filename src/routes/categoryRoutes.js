import * as category from "../controllers/categoryController.js";
import { protect, adminOnly } from "../middlewares/auth.js";
import express from "express";

const {
  createCategory,
  getCategory,
  listCategories,
  updateCategory,
  deleteCategory,
} = category;

const router = express.Router();

router.post("/categories", protect, adminOnly, createCategory);
router.get("/categories/:id", protect, getCategory);
router.get("/categories", protect, listCategories);
router.put("/categories/:id", protect, adminOnly, updateCategory);
router.delete("/categories/:id", protect, adminOnly, deleteCategory);

export default router;
