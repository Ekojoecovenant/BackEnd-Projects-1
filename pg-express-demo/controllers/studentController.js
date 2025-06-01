const studentModel = require("../models/studentModel");

// GET all students
exports.getAllStudents = async (req, res) => {
  const { name } = req.query;
  const limit = parseInt(req.query.limit) || 2;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;
  try {
    if (name) {
      const studentsMatch = await studentModel.searchStudents(name);
      return res.json(studentsMatch);
    }

    const students = await studentModel.getStudentsPaginated(limit, offset);
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET a single student by ID
exports.getStudentById = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await studentModel.getStudentById(id);
    if (student.status === 404) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADD a new student
exports.createStudent = async (req, res) => {
  try {
    const { name, age, email } = req.body;
    const newStudent = await studentModel.createStudent(name, age, email);
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE a student
exports.updateStudent = async (req, res) => {
  const { id } = req.params;
  const { name, age, email } = req.body;
  try {
    const updatedStudent = await studentModel.updateStudent(
      id,
      name,
      age,
      email
    );
    if (updatedStudent.status === 404) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(updatedStudent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE a student
exports.deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedStudent = await studentModel.deleteStudent(id);
    if (deletedStudent.status === 404) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(deletedStudent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
