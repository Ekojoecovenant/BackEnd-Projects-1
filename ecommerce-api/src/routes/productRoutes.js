const express = require("express");
const router = express.Router();
const controller = require("../controllers/productController");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

router.get("/", controller.getAllProducts);
router.get("/:id", controller.getProductById);
router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  controller.createProduct
);
router.patch(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  controller.updateProduct
);
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  controller.deleteProduct
);

module.exports = router;
