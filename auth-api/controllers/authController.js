const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createUser, findUserByEmail } = require("../models/userModel");
const pool = require("../config/db");

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user.id, userName: user.username, roles: user.roles },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign(
    { userId: user.id, userName: user.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );

  return { accessToken, refreshToken };
};

const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(username, email, hashedPassword);

    // Assign default "user" role
    const roleResult = await pool.query(
      "SELECT id FROM roles WHERE name = $1",
      ["user"]
    );
    const roleId = roleResult.rows[0]?.id;

    await pool.query(
      `INSERT INTO user_roles (user_id, role_id)
        VALUES ($1, $2)`,
      [user.id, roleId]
    );

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const roleResult = await pool.query(
      `SELECT r.name FROM roles r
            JOIN user_roles ur ON r.id = ur.role_id
            WHERE ur.user_id = $1`,
      [user.id]
    );
    const roles = roleResult.rows.map((r) => r.name);

    // continue from the "update login()" on gbt tuts :)!(:

    // const token = jwt.sign({ userId: user.id, roles }, process.env.JWT_SECRET, {
    //   expiresIn: "1h",
    // });

    // res.json({ token });

    const { accessToken, refreshToken } = generateTokens({
      id: user.id,
      roles,
    });

    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // set to true in production with HTTPS
      sameSite: "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
    });

    res.json({ accessToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login };
