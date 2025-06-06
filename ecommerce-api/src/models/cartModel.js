const pool = require("../config/db");

exports.getUserCart = async (userId) => {
  const result = await pool.query(
    `SELECT ci.*, p.title, p.price
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.user_id = $1`,
    [userId]
  );
  return result.rows;
};

exports.addOrUpdateCartItem = async ({ user_id, product_id, quantity }) => {
  const result = await pool.query(
    `INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, product_id)
        DO UPDATE SET quantity = $3
        RETURNING *`,
    [user_id, product_id, quantity]
  );
  return result.rows[0];
};

exports.removeCartItem = async ({ user_id, product_id }) => {
  await pool.query(
    "DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2",
    [user_id, product_id]
  );
};
