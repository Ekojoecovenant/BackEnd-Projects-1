const TaskModel = require("../models/task.model");

// Create a new task
const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const userId = req.user.user;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const task = await TaskModel.createTask(
      title,
      description || "",
      status || "pending",
      userId
    );
    res.status(201).json(task);
  } catch (err) {
    console.error("Create task error: ", err);
    res.status(500).json({ error: err.message });
  }
};

// Get all tasks for current user
const getTasks = async (req, res) => {
  try {
    const userId = req.user.user;
    const {
      search,
      status,
      sortBy = "created_at",
      order = "desc",
      page = 1,
      limit = 10,
    } = req.query;

    const offset = (page - 1) * limit;
    let query = `SELECT * FROM tasks WHERE user_id = $1`;
    const values = [userId];
    let count = 2;

    // Search by title/desc
    if (search) {
      query += ` AND (title ILIKE $${count} OR description ILIKE $${count})`;
      values.push(`%${search}%`);
      count++;
    }

    // Filter by status
    if (status) {
      query += ` AND status = $${count}`;
      values.push(status);
      count++;
    }

    // Sorting
    query += ` ORDER BY ${sortBy} ${order}`;

    // Pagination
    query += ` LIMIT $${count} OFFSET $${count + 1}`;
    values.push(limit, offset);

    const task = await TaskModel.getTasksByUser(query, values);
    // console.log(task);

    res.status(200).json({
      tasks: task,
      pagination: {
        page: Number(page),
        limit: Number(limit),
      },
    });
  } catch (err) {
    console.error("Get tasks error: ", err);
    res.status(500).json({ error: err.message });
  }
};

// Get one task by ID (must belong to user)
const getTaskById = async (req, res) => {
  try {
    const task = await TaskModel.getTaskById(req.params.id);

    if (!task || task.user_id !== req.user.user) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    console.error("Get task by ID error: ", err);
    res.status(500).json({ error: err.message });
  }
};

// Update a task (must belong to user)
const updateTask = async (req, res) => {
  try {
    const task = await TaskModel.getTaskById(req.params.id);

    if (!task || task.user_id !== req.user.user) {
      return res.status(404).json({ error: "Task not found or not yours" });
    }

    const updated = await TaskModel.updateTask(req.params.id, req.body);

    res.json(updated);
  } catch (err) {
    console.error("Update task error: ", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete a task (must belong to user)
const deleteTask = async (req, res) => {
  try {
    const task = await TaskModel.getTaskById(req.params.id);

    if (!task || task.user_id !== req.user.user) {
      return res.status(404).json({ error: "Task not found or not yours" });
    }

    const deleted = await TaskModel.deleteTask(req.params.id);
    res.json({ message: "Task deleted", task: deleted });
  } catch (err) {
    console.error("Delete task error: ", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
