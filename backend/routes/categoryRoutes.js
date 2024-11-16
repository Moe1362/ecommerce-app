import express from "express";
const router = express.Router();
import { createCategory, updateCategory, removeCategory, listCategory, readCategory } from "../controllers/categoryController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

// Route to create category
router.route("/").post(authenticate, authorizeAdmin, createCategory);

// Route to update category
router.route('/:categoryId').put(authenticate, authorizeAdmin, updateCategory);

// Route to delete category
router.route('/:categoryId').delete(authenticate, authorizeAdmin, removeCategory);


//Route to get all categories
router.route('/categories').get(listCategory);

router.route('/:id').get(readCategory);

export default router;
