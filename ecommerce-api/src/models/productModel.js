const pool = require("../config/db");

exports.createProduct = async ({
  title,
  description,
  price,
  stock,
  category_id,
}) => {
  const result = await pool.query(
    `INSERT INTO products (title, description, price, stock, category_id)
        VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [title, description, price, stock, category_id]
  );
  return result.rows[0];
};

exports.getAllProducts = async () => {
  const result = await pool.query(
    `SELECT p.*, c.name as category FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        ORDER BY p.created_at DESC`
  );
  return result.rows;
};

exports.getProductById = async (id) => {
  const result = await pool.query(
    `SELECT p.*, c.name as category FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = $1`,
    [id]
  );
  return result.rows[0];
};

exports.updateProduct = async (id, data) => {
  const { title, description, price, stock, category_id } = data;
  const result = await pool.query(
    `UPDATE products SET title=$1, description=$2, price=$3, stock=$4, category_id=$5
        WHERE id=$6 RETURNING *`,
    [title, description, price, stock, category_id, id]
  );
  return result.rows[0];
};

exports.deleteProduct = async (id) => {
  await pool.query(`DELETE FROM products WHERE id = $1`, [id]);
};
