import Category from "../models/categoryModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// Create Category
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Category name is required" });
  }

  const existingCategory = await Category.findOne({ name });

  if (existingCategory) {
    return res.status(400).json({ error: "Category already exists" });
  }

  const category = new Category({ name });
  await category.save();
  res.status(201).json(category);
});

// Update Category
const updateCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Category name is required" });
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    { name },
    { new: true }
  );

  if (!updatedCategory) {
    return res.status(404).json({ error: "Category not found" });
  }

  res.status(200).json(updatedCategory);
});

// Remove Category
const removeCategory = asyncHandler(async (req, res) => {
  try {
    const removed = await Category.findByIdAndDelete(req.params.categoryId);

    if (!removed) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Use 200 OK with a message
    // In categoryController.js
    res.status(200).json({ message: "Category removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// List Category
const listCategory = asyncHandler(async (req, res) => {
  try {
    const all = await Category.find({});
    res.status(200).json(all);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error.message);
  }
});

// Read Category
const readCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id });
    res.json(category);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error.message);
  }
});

export {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
};
