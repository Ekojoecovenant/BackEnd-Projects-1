const express = require("express");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const { register, login } = require("../controllers/authController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");
const {
  registerValidator,
  loginValidator,
} = require("../validators/authValidator");
const validate = require("../middlewares/validate");

const router = express.Router();

router.get("/protected", authenticate, (req, res) => {
  res.json({ message: `Hello User ${req.user.userId}, you're authenticated.` });
});
router.get("/admin", authenticate, authorize("admin"), (req, res) => {
  res.json({ message: "Welcome Admin!" });
});
router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);
router.post("/refresh-token", async (req, res) => {
  //   console.log("Cookies:", req.cookies);
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(401);

  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    // console.log("Payload:", payload);
    const result = await pool.query(
      `
        SELECT r.name FROM roles r
        JOIN user_roles ur ON ur.role_id = r.id
        WHERE ur.user_id = $1
        `,
      [payload.userId]
    );
    // console.log(result);
    const roles = result.rows.map((r) => r.name);
    // console.log("Roles:\n", roles);
    const accessToken = jwt.sign(
      { userId: payload.userId, roles },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
    res.json({ accessToken });
    console.log("New Refresh Token generated!");
  } catch (err) {
    console.log("Error:", err.message);
    return res.sendStatus(403);
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
});

module.exports = router;
