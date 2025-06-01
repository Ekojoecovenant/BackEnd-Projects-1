const pool = require("../config/db");

const RefreshToken = {
  async create({ token, user_id, expires_at }) {
    const query = `
        INSERT INTO refresh_tokens (token, user_id, expires_at)
        VALUES ($1, $2, $3)
        RETURNING *`;
    const values = [token, user_id, expires_at];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findByToken(token) {
    const result = await pool.query(
      `SELECT * FROM refresh_tokens WHERE token = $1`,
      [token]
    );
    return result.rows[0];
  },

  async delete(token) {
    await pool.query(`DELETE FROM refresh_tokens WHERE token = $1`, [token]);
  },

  async deleteAllByUser(user_id) {
    await pool.query(`DELETE FROM refresh_tokens WHERE user_id = $1`, [
      user_id,
    ]);
  },
};

module.exports = RefreshToken;
