const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
require("dotenv").config();

exports.register = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const existing = await userModel.findUserByEmail(email);
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.createUser({ email, hashedPassword, role });

    res.status(201).json({ user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Registraioin failed", error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findUserByEmail(email);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Login Failed", error: err.message });
  }
};
