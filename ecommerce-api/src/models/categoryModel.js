const pool = require("../config/db");

exports.createCategory = async ({ name, slug }) => {
  const result = await pool.query(
    `INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING *`,
    [name, slug]
  );
  return result.rows[0];
};

exports.getAllCategories = async () => {
  const result = await pool.query("SELECT * FROM categories ORDER BY created_at DESC");
  return result.rows;
};

exports.updateCategory = async (id, {name, slug}) => {
    const result = await pool.query(
        `UPDATE categories SET name=$1, slug=$2 WHERE id=$3 RETURNING *`, [name, slug, id]
    );
    return result.rows[0];
}

exports.deleteCategory = async (id) => {
    await pool.query(`DELETE FROM categories WHERE id = $1`, [id])
};