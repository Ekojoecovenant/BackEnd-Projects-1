const express = require("express");
const authenticate = require("../middleware/auth");
const { getUserById } = require("../models/user.model");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const bcrypt = require("bcrypt");
const pool = require("../config/db");

const router = express.Router();

// View User Profile
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await getUserById(req.user.user);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Return safe user data (exclude password)
    res.json({
      id: user.id,
      email: user.email,
      role: user.role_id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Update Profile (email and password only)
router.put(
  "/me",
  authenticate,
  [
    body("email").optional().isEmail().withMessage("Valid email required"),
    body("password")
      .optional()
      .isLength({ min: 6 })
      .withMessage("Password must be 6+ chars"),
    validate,
  ],
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const userId = req.user.user;

      const updates = [];
      const values = [];
      let paramIndex = 1;

      if (email) {
        updates.push(`email = $${paramIndex++}`);
        values.push(email);
      }
      if (password) {
        const hashed = await bcrypt.hash(password, 10);
        updates.push(`password = $${paramIndex++}`);
        values.push(hashed);
      }
      if (updates.length === 0) {
        return res.status(400).json({ message: "No fields to update" });
      }
      values.push(userId);

      const query = `UPDATE users u SET ${updates.join(", ")} 
            FROM user_roles ur JOIN roles r ON r.id = ur.role_id WHERE u.id = ur.user_id 
            AND u.id = $${paramIndex} RETURNING u.id, u.email, ur.role_id, r.name AS role`;
      const { rows } = await pool.query(query, values);
      res.json({ message: "Profile Updated", user: rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  }
);

// Delete own account
router.delete("/me", authenticate, async (req, res) => {
  try {
    const userId = req.user.user;
    await pool.query("SELECT delete_user_cascade($1)", [userId]);
    res.json({ message: "Account deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
