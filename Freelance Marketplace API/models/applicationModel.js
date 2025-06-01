const pool = require("../db/db");

exports.findAll = async () => {
  const res = await pool.query("SELECT * FROM applications");
  return res.rows;
};

exports.findById = async (id) => {
  const res = await pool.query("SELECT * FROM applications WHERE id = $1", [
    id,
  ]);
  return res.rows[0];
};

exports.checkFreelancer = async (id) => {
  const res = await pool.query("SELECT role FROM users WHERE id = $1", [id]);
  return res.rows[0]?.role === "freelancer";
};

exports.exists = async (freelancer_id, job_id) => {
  const res = await pool.query(
    `SELECT id FROM applications WHERE freelancer_id = $1 AND job_id = $2`,
    [freelancer_id, job_id]
  );
  return res.rowCount > 0;
};

exports.create = async ({ freelancer_id, job_id, cover_letter }) => {
  const res = await pool.query(
    `INSERT INTO applications (freelancer_id, job_id, cover_letter)
    VALUES ($1, $2, $3) RETURNING *`,
    [freelancer_id, job_id, cover_letter]
  );
  return res.rows[0];
};

exports.update = async (id, data) => {
  const fields = Object.keys(data);
  const values = Object.values(data);
  if (fields.length === 0) return null;

  const setQuery = fields.map((f, i) => `${f} = $${i + 1}`).join(", ");
  const res = await pool.query(
    `UPDATE applications SET ${setQuery} WHERE id = $${
      fields.length + 1
    } RETURNING *`,
    [...values, id]
  );

  return res.rows[0];
};

exports.delete = async (id) => {
  const res = await pool.query(
    `DELETE FROM applications WHERE id = $1 RETURNING *`,
    [id]
  );
  return res.rows[0];
};
