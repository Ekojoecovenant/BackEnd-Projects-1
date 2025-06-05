const express = require("express");
const router = express.Router();
const controller = require("../controllers/categoryController");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

router.get("/", controller.getAllCategories);
router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  controller.createCategory
);
router.patch(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  controller.updateCategory
);
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  controller.deleteCategory
);

module.exports = router;
