const express = require("express");
const authenticate = require("../middleware/auth");
const router = express.Router();

router.get("/protected", authenticate, (req, res) => {
  res.json({
    message: "You have access",
    user: req.user,
  });
});

module.exports = router;
