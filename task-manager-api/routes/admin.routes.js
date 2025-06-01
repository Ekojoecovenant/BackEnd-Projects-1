const express = require("express");
const authenticate = require("../middleware/auth");
const allowRoles = require("../middleware/role");
const { getAllUsers, getUserById } = require("../models/user.model");
const pool = require("../config/db");

const router = express.Router();

router.get("/dashboard", authenticate, allowRoles(1), (req, res) => {
  res.json({
    message: "Welcome, Admin!",
  });
});

// Admin only: List all users
router.get("/users", authenticate, allowRoles(1), async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(
      users.map((user) => ({
        id: user.id,
        email: user.email,
        role: user.role_id,
      }))
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

// Admin delete any user by id
router.delete("/users/:id", authenticate, allowRoles(1), async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ mesage: "User ID required" });

    const user = await getUserById(id);
    // console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await pool.query("SELECT * FROM delete_user_cascade($1)", [id]);

    res.json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Admin get user by ID
router.get("/users/:id", authenticate, allowRoles(1), async (req, res) => {
  try {
    const id = req.params.id;
    const user = await getUserById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
