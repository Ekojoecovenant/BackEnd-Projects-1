const express = require("express");
const router = express.Router();
const controller = require("../controllers/cartController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, controller.getCart);
router.post("/", authMiddleware, controller.addToCart);
router.delete("/", authMiddleware, controller.removeFromCart);

module.exports = router;
