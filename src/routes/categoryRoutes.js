import express from "express";
import { protect, adminOnly } from "../middlewares/auth.js";
import * as category from "../controllers/categoryController.js";

const {
  createCategory,
  getCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = category;

const router = express.Router();

router.post("/categories", protect, adminOnly, createCategory);
router.get("/categories/:id", protect, getCategory);
router.get("/categories", protect, getAllCategories);
router.put("/categories/:id", protect, adminOnly, updateCategory);
router.delete("/categories/:id", protect, adminOnly, deleteCategory);

export default router;
