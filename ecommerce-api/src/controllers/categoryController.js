const categoryModel = require("../models/categoryModel");

exports.createCategory = async (req, res) => {
  const { name, slug } = req.body;
  try {
    const category = await categoryModel.createCategory({ name, slug });
    res.status(201).json({ category });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching categories", error: err.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.getAllCategories();
    res.json({ categories });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching categories", error: err.message });
  }
};
