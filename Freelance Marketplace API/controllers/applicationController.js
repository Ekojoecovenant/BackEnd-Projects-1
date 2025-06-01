const appModel = require("../models/applicationModel");

exports.getAll = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const apps = await appModel.findAll();
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const app = await appModel.findById(req.params.id);
    if (!app) return res.status(404).json({ error: "Job not found" });
    res.json(app);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  const { freelancer_id, job_id, cover_letter } = req.body;
  if (!freelancer_id || !job_id) {
    return res
      .status(400)
      .json({ error: "freelancer_id and job_id are required." });
  }

  try {
    const isFreelancer = await appModel.checkFreelancer(freelancer_id);
    if (!isFreelancer) {
      return res.status(403).json({ message: "Only freelancers can apply" });
    }

    const exists = await appModel.exists(freelancer_id, job_id);
    if (exists)
      return res.status(409).json({ error: "Already applied for this job" });

    const newApp = await appModel.create({
      freelancer_id,
      job_id,
      cover_letter,
    });
    res.status(201).json(newApp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await appModel.update(req.params.id, req.body);
    if (!updated)
      return res.status(404).json({ message: "Application not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteApp = async (req, res) => {
  try {
    const deletedApp = await appModel.delete(req.params.id);
    if (!deletedApp)
      return res.status(404).json({ message: "Application not found" });
    res.json({ message: "Application deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
