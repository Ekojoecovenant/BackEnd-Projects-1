const pool = require("../config/db");

exports.createUser = async ({ email, hashedPassword, role = "user" }) => {
  const result = await pool.query(
    `INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role, created_at`,
    [email, hashedPassword, role]
  );
  return result.rows[0];
};

exports.findUserByEmail = async (email) => {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  return result.rows[0];
};
