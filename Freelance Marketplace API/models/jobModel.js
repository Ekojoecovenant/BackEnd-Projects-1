const pool = require("../db/db");

exports.findAll = async ({ page, limit }) => {
  const offset = (page - 1) * limit;
  const res = await pool.query(
    "SELECT * FROM jobs ORDER BY created_at DESC LIMIT $1 OFFSET $2",
    [limit, offset]
  );
  return res.rows;
};

exports.findById = async (id) => {
  const res = await pool.query("SELECT * FROM jobs WHERE id = $1", [id]);
  return res.rows[0];
};

exports.checkClient = async (userId) => {
  const res = await pool.query("SELECT role FROM users WHERE id = $1", [
    userId,
  ]);
  return res.rows[0]?.role === "client";
};

exports.create = async ({ title, description, budget, status, client_id }) => {
  const res = await pool.query(
    `INSERT INTO jobs (title, description, budget, status, client_id)
    VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [title, description, budget, status, client_id]
  );
  return res.rows[0];
};

exports.update = async (id, data) => {
  const fields = Object.keys(data);
  const values = Object.values(data);

  // stopped here 9:13am
  //   continued at 10:10am

  if (fields.length === 0) return null;

  const setQuery = fields.map((f, i) => `${f} = $${i + 1}`).join(", ");
  const res = await pool.query(
    `UPDATE jobs SET ${setQuery} WHERE id = $${fields.length + 1} RETURNING *`,
    [...values, id]
  );

  return res.rows[0];
};

exports.delete = async (id) => {
  const res = await pool.query(`DELETE FROM jobs WHERE id = $1 RETURNING *`, [
    id,
  ]);
  return res.rows[0];
};
