const cartModel = require("../models/cartModel");

exports.getCart = async (req, res) => {
  try {
    const cart = await cartModel.getUserCart(req.user.id);
    res.json(cart);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch cart", error: err.message });
  }
};

exports.addToCart = async (req, res) => {
  const { product_id, quantity } = req.body;
  try {
    const item = await cartModel.addOrUpdateCartItem({
      user_id: req.user.id,
      product_id,
      quantity,
    });
    res.status(201).json(item);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update cart", error: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    await cartModel.removeCartItem({
      user_id: req.user.id,
      product_id: req.params.product_id,
    });
    res.json({ message: "Item removed from cart" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to remove item", error: err.message });
  }
};
