const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const enrollmentController = require("../controllers/enrollmentController");

// Validation middleware
const validateEnrollment = [
  body("student_id").isInt().withMessage("Valid student_id is required!"),
  body("course_id").isInt().withMessage("Valid course_id is required!"),
];

// POST: Enroll a student (with Validation)
router.post("/", validateEnrollment, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  enrollmentController.enrollStudent(req, res, next);
});

// GET: List enrollments with student + course info
router.get("/", enrollmentController.getAllEnrollments);

module.exports = router;
