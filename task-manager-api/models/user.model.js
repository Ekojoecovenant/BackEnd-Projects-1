const pool = require("../config/db");

const createUser = async (email, hashedPassword) => {
  const query = `SELECT * FROM register_user($1, $2)`;
  const values = [email, hashedPassword];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const findUserByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = $1`;
  const { rows } = await pool.query(query, [email]);
  return rows[0];
};

const findUserRoleByEmail = async (email) => {
  const query = `SELECT * FROM user_roles ur JOIN users u ON u.id = ur.user_id WHERE email = $1`;
  const { rows } = await pool.query(query, [email]);
  return rows[0];
};

// Get user by ID
const getUserById = async (id) => {
  const query = `SELECT id, email, role_id FROM user_roles ur JOIN users u ON u.id = ur.user_id WHERE u.id = $1`;
  const { rows } = await pool.query(query, [id]);
  //   console.log("Rows:", rows);
  return rows[0];
};

const getAllUsers = async () => {
  const query = `SELECT id, email, role_id FROM user_roles ur JOIN users u ON u.id = ur.user_id`;
  const { rows } = await pool.query(query);
  return rows;
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserRoleByEmail,
  getUserById,
  getAllUsers,
};
