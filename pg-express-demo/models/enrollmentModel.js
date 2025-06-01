const pool = require("../config/db");

exports.createEnrollment = async (student_id, course_id) => {
  const result = await pool.query(
    "INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2) RETURNING *",
    [student_id, course_id]
  );
  return result.rows[0];
};

// GET: Pagination for Enrollments
exports.getEnrollmentsPaginated = async (limit, offset) => {
  const result = await pool.query(
    `
    SELECT
      e.id AS enrollment_id,
	    s.name AS student_name,
	    c.title AS course_title,
	    e.enrolled_at
    FROM enrollments e
    JOIN students s ON e.student_id = s.id
    JOIN courses c ON e.course_id = c.id
    ORDER BY e.enrolled_at DESC
    LIMIT $1 OFFSET $2
    `,
    [limit, offset]
  );
  return result.rows;
};

// GET: Search by name
exports.filterEnrollmentByStudent = async (studentName) => {
  const result = await pool.query(
    `
    SELECT
      e.id AS enrollment_id,
	    s.name AS student_name,
	    c.title AS course_title,
	    e.enrolled_at
    FROM enrollments e
    JOIN students s ON e.student_id = s.id
    JOIN courses c ON e.course_id = c.id
    WHERE s.name ILIKE $1
    ORDER BY e.enrolled_at DESC`,
    [`%${studentName}%`]
  );
  return result.rows;
};

exports.getAllEnrollments = async () => {
  const result = await pool.query(`
      SELECT
        e.id AS enrollment_id,
	    s.name AS student_name,
	    c.title AS course_title,
	    e.enrolled_at
      FROM enrollments e
      JOIN students s ON e.student_id = s.id
      JOIN courses c ON e.course_id = c.id
      ORDER BY e.enrolled_at DESC
    `);
  return result.rows;
};
