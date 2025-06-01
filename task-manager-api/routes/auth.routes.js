const express = require("express");
const {
  register,
  login,
  refreshToken,
  logout,
} = require("../controllers/auth.controller");
const { body } = require("express-validator");
const validate = require("../middleware/validate");

const router = express.Router();

// Register
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be 6+ chars"),
    validate,
  ],
  register
);

// Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password is required"),
    validate,
  ],
  login
);

router.post("/refresh-token", refreshToken);

router.post("/logout", logout);

module.exports = router;
