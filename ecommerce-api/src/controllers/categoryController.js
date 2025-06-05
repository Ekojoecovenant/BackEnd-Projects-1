const categoryModel = require("../models/categoryModel");

exports.createCategory = async (req, res) => {
  const { name, slug } = req.body;
  try {
    const category = await categoryModel.createCategory({ name, slug });
    res.status(201).json({ category });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Category creation failed", error: err.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.getAllCategories();
    res.json({ categories });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch categories", error: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const updated = await categoryModel.updateCategory(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update category", error: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await categoryModel.deleteCategory(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete category", error: err.message });
  }
};
