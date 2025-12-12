import adminRoutes from "./adminRoutes.js";
import authRoutes from "./authRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import commentRoutes from "./commentRoutes.js";
import userRoutes from "./userRoutes.js";
import postRoutes from "./postRoutes.js";

import express from "express";

const router = express.Router();

router.use(adminRoutes);
router.use(authRoutes);
router.use(categoryRoutes);
router.use(commentRoutes);
router.use(userRoutes);
router.use(postRoutes);

export default router;
