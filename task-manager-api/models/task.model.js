const pool = require("../config/db");

// Get all tasks for a specific user
const getTasksByUser = async (query, values) => {
  //   const result = await pool.query(
  //     "SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at",
  //     [userId]
  //   );
  const result = await pool.query(query, values);
  return result.rows;
};

// Get one task by ID (and owner check)
const getTaskById = async (taskId) => {
  const result = await pool.query("SELECT * FROM tasks WHERE id = $1", [
    taskId,
  ]);
  return result.rows[0];
};

// Create a task
const createTask = async (title, description, status, userId) => {
  const result = await pool.query(
    `INSERT INTO tasks (title, description, status, user_id)
        VALUES ($1, $2, $3, $4) RETURNING *`,
    [title, description, status, userId]
  );
  return result.rows[0];
};

// Update a Task
const updateTask = async (taskId, updates) => {
  const fields = [];
  const values = [];
  let paramIndex = 1;

  for (const key in updates) {
    fields.push(`${key} = $${paramIndex}`);
    values.push(updates[key]);
    paramIndex++;
  }

  // Always update timestamp
  fields.push(`updated_at = CURRENT_TIMESTAMP`);

  const query = `
        UPDATE tasks
        SET ${fields.join(", ")}
        WHERE id = $${paramIndex}
        RETURNING *`;

  values.push(taskId);

  const result = await pool.query(query, values);
  return result.rows[0];
};

// Delete a task
const deleteTask = async (taskId) => {
  const result = await pool.query(
    `DELETE FROM tasks WHERE id = $1 RETURNING *`,
    [taskId]
  );
  return result.rows[0];
};

module.exports = {
  getTasksByUser,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
