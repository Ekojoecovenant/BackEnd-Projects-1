const pool = require("../db/db");

exports.findAll = async () => {
  const res = await pool.query("SELECT * FROM users ORDER BY id DESC");
  return res.rows;
};

exports.findById = async (id) => {
  const res = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return res.rows[0];
};

exports.update = async (id, data) => {
  const fields = Object.keys(data);
  const values = Object.values(data);

  if (fields.length === 0) return null;

  const setQuery = fields.map((f, i) => `${f} = $${i + 1}`).join(", ");
  const res = await pool.query(
    `UPDATE users SET ${setQuery} WHERE id = $${fields.length + 1} RETURNING *`,
    [...values, id]
  );

  return res.rows[0];
};

exports.create = async ({ name, email, role }) => {
  const res = await pool.query(
    `INSERT INTO users (name, email, role)
        VALUES ($1, $2, $3) RETURNING *`,
    [name, email, role]
  );
  return res.rows[0];
};

exports.delete = async (id) => {
  const res = await pool.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [
    id,
  ]);
  return res.rows[0];
};
