const courseModel = require("../models/courseModel");

// GET all courses
exports.getAllCourses = async (req, res) => {
  const { title } = req.query;
  const limit = parseInt(req.query.limit) || 2;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;
  try {
    if (title) {
      const coursesMatch = await courseModel.searchCourses(title);
      return res.json(coursesMatch);
    }

    const courses = await courseModel.getCoursesPaginated(limit, offset);
    //   try { const courses = await courseModel.getAllCourses();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET course by ID
exports.getCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await courseModel.getCourseById(id);
    if (course.status === 404) {
      return res.status(course.status).json({ message: course.message }); //{ status: 404, message: "Course not found" };
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE a new course
exports.createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    const newCourse = await courseModel.createCourse(title, description);
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE a course
exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const updatedCourse = await courseModel.updateCourse(
      id,
      title,
      description
    );
    if (updatedCourse.status === 404) {
      return res
        .status(updatedCourse.status)
        .json({ message: updatedCourse.message }); //{ status: 404, message: "Course not found" };
    }
    res.json(updatedCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE a course
exports.deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCourse = await courseModel.deleteCourse(id);
    if (deletedCourse.status === 404) {
      return res
        .status(deletedCourse.status)
        .json({ message: deletedCourse.message }); //{ status: 404, message: "Course not found" };
    }
    res.json(deletedCourse);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
