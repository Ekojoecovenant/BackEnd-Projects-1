const pool = require("../config/db");

// GET all courses
exports.getAllCourses = async () => {
  const result = await pool.query("SELECT * FROM courses");
  return result.rows;
};

// GET: Pagination for Courses
exports.getCoursesPaginated = async (limit, offset) => {
  const result = await pool.query(
    "SELECT * FROM courses ORDER BY id DESC LIMIT $1 OFFSET $2",
    [limit, offset]
  );
  return result.rows;
};

// GET: Search by course title
exports.searchCourses = async (title) => {
  const result = await pool.query(
    "SELECT * FROM courses WHERE title ILIKE $1 ORDER BY id DESC",
    [`%${title}%`]
  );
  return result.rows;
};

// GET course by ID
exports.getCourseById = async (id) => {
  const result = await pool.query("SELECT * FROM courses WHERE id = $1", [id]);
  if (result.rows.length === 0) {
    return { status: 404, message: "Course not found" };
  }
  return result.rows[0];
};

// CREATE a new course
exports.createCourse = async (title, description) => {
  const result = await pool.query(
    "INSERT INTO courses (title, description) VALUES ($1, $2) RETURNING *",
    [title, description]
  );
  return result.rows[0];
};

// UPDATE a course
exports.updateCourse = async (id, title, description) => {
  const result = await pool.query(
    "UPDATE courses SET title = $1, description = $2 WHERE id = $3 RETURNING *",
    [title, description, id]
  );
  if (result.rows.length === 0) {
    return { status: 404, message: "Course not found" };
  }
  return result.rows[0];
};

// DELETE a course
exports.deleteCourse = async (id) => {
  const result = await pool.query(
    "DELETE FROM courses WHERE id = $1 RETURNING *",
    [id]
  );
  if (result.rows.length === 0) {
    return { status: 404, message: "Course not found" };
  }
  return { message: "Course deleted" };
};
