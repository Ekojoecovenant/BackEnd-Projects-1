const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const studentController = require("../controllers/studentController");

// Validation middleware
const validateStudent = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
];

// GET all students
router.get("/", studentController.getAllStudents);

// GET a student by ID
router.get("/:id", studentController.getStudentById);

// POST a new student (with Validation)
router.post("/", validateStudent, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  studentController.createStudent(req, res, next);
});

// UPDATE a student
router.put("/:id", studentController.updateStudent);

// DELETE a student
router.delete("/:id", studentController.deleteStudent);

module.exports = router;
