const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const courseController = require("../controllers/courseController");

// Validation middleware
const validateCourse = [
  body("title").notEmpty().isString().withMessage("Title is required"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
];

// GET all courses
router.get("/", courseController.getAllCourses);

// GET a course by ID
router.get("/:id", courseController.getCourseById);

// POST a new course (with Validation)
router.post("/", validateCourse, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  courseController.createCourse(req, res, next);
});

// UPDATE a course
router.put("/:id", courseController.updateCourse);

// DELETE a course
router.delete("/:id", courseController.deleteCourse);

module.exports = router;
