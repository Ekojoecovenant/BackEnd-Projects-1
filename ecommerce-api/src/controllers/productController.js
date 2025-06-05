const productModel = require("../models/productModel");

exports.createProduct = async (req, res) => {
  const { title, description, price, stock, category_id } = req.body;
  try {
    const product = await productModel.createProduct({
      title,
      description,
      price,
      stock,
      category_id,
    });
    res.status(201).json({ product });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating product", error: err.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await productModel.getAllProducts();
    res.json({ products });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating product", error: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await productModel.getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ product });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating product", error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updated = await productModel.updateProduct(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update product", error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await productModel.deleteProduct(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete product", error: err.message });
  }
};
