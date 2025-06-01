const enrollmentModel = require("../models/enrollmentModel");

// Enroll a student in a course
exports.enrollStudent = async (req, res) => {
  const { student_id, course_id } = req.body;
  try {
    const newEnrollment = await enrollmentModel.createEnrollment(
      student_id,
      course_id
    );
    res.status(201).json(newEnrollment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET all enrollments with JOINs
exports.getAllEnrollments = async (req, res) => {
  const { student } = req.query;
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;
  try {
    if (student) {
      const studentsMatch = await enrollmentModel.filterEnrollmentByStudent(
        student
      );
      return res.json(studentsMatch);
    }

    const enrollments = await enrollmentModel.getEnrollmentsPaginated(
      limit,
      offset
    );
    // try {
    //   const enrollments = await enrollmentModel.getAllEnrollments();
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
