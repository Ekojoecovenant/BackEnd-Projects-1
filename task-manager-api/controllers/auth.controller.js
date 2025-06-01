const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const RefreshToken = require("../models/refreshToken.model");

const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.createUser(email, hashedPassword);

    res.status(201).json({
      message: "User registered",
      user: { id: newUser.id, email: newUser.email },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    const user = await User.findUserByEmail(email);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // to use a function that also returns the user role
    const rUser = await User.findUserRoleByEmail(email);

    // Create tokens
    const accessToken = jwt.sign(
      { user: user.id, role: rUser.role_id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { user: user.id, role: rUser.role_id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Store refresh token in DB
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await RefreshToken.create({
      token: refreshToken,
      user_id: user.id,
      expires_at: expiresAt,
    });

    // Set refresh token as HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });

    // const token = jwt.sign(
    //   { user: user.id, role: rUser.role_id },
    //   process.env.JWT_SECRET,
    //   { expiresIn: process.env.JWT_EXPIRES_IN }
    // );
    // res.status(200).json({
    //   message: "Login successful",
    //   token,
    //   user: { id: user.id, email: user.email, role: rUser.role_id },
    // });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token)
      return res.status(401).json({ message: "Refresh token missing" });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // Check DB
    const tokenEntry = await RefreshToken.findByToken(token);
    if (!tokenEntry)
      return res.status(403).json({ message: "Invalid refresh token" });

    // Issue new access token
    const accessToken = jwt.sign(
      { user: decoded.user, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.status(200).json({ accessToken });
  } catch (err) {
    console.error("Refresh error: ", err);
    res.status(500).json({ error: err.message });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.sendStatus(204); // No Content

    // Delete from DB if exists
    await RefreshToken.delete(token);

    // Clear cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error: ", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
};
