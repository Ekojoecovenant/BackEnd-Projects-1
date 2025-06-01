const pool = require("../config/db");

// GET all students
exports.getAllStudents = async () => {
  const result = await pool.query("SELECT * FROM students");
  return result.rows;
};

// GET: Pagination for Students
exports.getStudentsPaginated = async (limit, offset) => {
  const result = await pool.query(
    "SELECT * FROM students ORDER BY id DESC LIMIT $1 OFFSET $2",
    [limit, offset]
  );
  return result.rows;
};

// GET: Search by name
exports.searchStudents = async (name) => {
  const result = await pool.query(
    "SELECT * FROM students WHERE name ILIKE $1 ORDER BY id DESC",
    [`%${name}%`]
  );
  return result.rows;
};

// GET a single student by ID
exports.getStudentById = async (id) => {
  const result = await pool.query("SELECT * FROM students WHERE id = $1", [id]);
  if (result.rows.length === 0) {
    return { status: 404, message: "Student not found" };
  }
  return result.rows[0];
};

// ADD a new student
exports.createStudent = async (name, age, email) => {
  const result = await pool.query(
    "INSERT INTO students (name, age, email) VALUES ($1, $2, $3) RETURNING *",
    [name, age, email]
  );
  return result.rows[0];
};

// UPDATE a student
exports.updateStudent = async (id, name, age, email) => {
  const result = await pool.query(
    "UPDATE students SET name = $1, age = $2, email = $3 WHERE id = $4 RETURNING *",
    [name, age, email, id]
  );
  if (result.rows.length === 0) {
    return { status: 404, message: "Student not found" };
  }
  return result.rows[0];
};

// DELETE a student
exports.deleteStudent = async (id) => {
  const result = await pool.query(
    "DELETE FROM students WHERE id = $1 RETURNING *",
    [id]
  );
  if (result.rows.length === 0) {
    return { status: 404, message: "Student not found" };
  }
  return { message: "Student deleted" };
};
