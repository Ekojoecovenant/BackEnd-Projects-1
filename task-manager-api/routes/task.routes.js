const express = require("express");
const TaskController = require("../controllers/task.controller");
const authenticate = require("../middleware/auth");
const router = express.Router();

// All task routes are protected
router.use(authenticate);

// Creates a task
router.post("/", TaskController.createTask);

// Get all task for the logged-in user
router.get("/", TaskController.getTasks);

// Get one task
router.get("/:id", TaskController.getTaskById);

// Update a task
router.patch("/:id", TaskController.updateTask);

// Delete a task
router.delete("/:id", TaskController.deleteTask);

module.exports = router;
