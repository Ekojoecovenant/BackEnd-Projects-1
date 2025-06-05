const pool = require("../config/db");

exports.createCategory = async ({ name, slug }) => {
  const result = await pool.query(
    `INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING *`,
    [name, slug]
  );
  return result.rows[0];
};

exports.getAllCategories = async () => {
  const result = await pool.query("SELECT * FROM categories ORDER BY name");
  return result.rows;
};
