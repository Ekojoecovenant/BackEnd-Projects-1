const jobModel = require("../models/jobModel");

exports.getAllJobs = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const jobs = await jobModel.findAll({ page, limit });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await jobModel.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createJob = async (req, res) => {
  const { title, description, budget, status, client_id } = req.body;
  if (!title || !status || !client_id) {
    return res
      .status(400)
      .json({ error: "Title, status, and client_id are required." });
  }

  try {
    const isClient = await jobModel.checkClient(client_id);
    if (!isClient) {
      return res
        .status(403)
        .json({ message: "Only users with role 'client' can post jobs" });
    }

    const newJob = await jobModel.create({
      title,
      description,
      budget,
      status,
      client_id,
    });
    res.status(201).json(newJob);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const updated = await jobModel.update(req.params.id, req.body);
    if (!updated)
      return res
        .status(404)
        .json({ message: "Job not found or updated failed" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const deletedJob = await jobModel.delete(req.params.id);
    if (!deletedJob) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
