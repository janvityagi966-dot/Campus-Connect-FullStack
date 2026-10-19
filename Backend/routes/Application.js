const express = require("express");
const mongoose = require("mongoose");
const Application = require("../models/Application");
const Job = require("../models/Jobs");
const requireAuth = require("../middleware/requireAuth");
const localStore = require("../localStore");

const router = express.Router();
const mongoReady = () => mongoose.connection.readyState === 1;

router.post("/", requireAuth, async (req, res) => {
  try {
    const jobId = String(req.body.job || "");
    if (!jobId) return res.status(400).json({ message: "A job ID is required." });

    if (mongoReady()) {
      if (!mongoose.isValidObjectId(jobId)) return res.status(404).json({ message: "Job not found." });
      const job = await Job.findById(jobId);
      if (!job) return res.status(404).json({ message: "Job not found." });
      const existing = await Application.findOne({ student: req.userId, job: jobId });
      if (existing) return res.status(409).json({ message: "You have already applied for this job." });
      const application = await Application.create({ student: req.userId, job: jobId });
      return res.status(201).json({ message: "Application submitted successfully.", application: { ...application.toObject(), job } });
    }

    const result = localStore.createApplication({ studentId: req.userId, jobId });
    if (result.error === "job-not-found") return res.status(404).json({ message: "Job not found." });
    if (result.error === "already-applied") return res.status(409).json({ message: "You have already applied for this job." });
    return res.status(201).json({ message: "Application submitted successfully and saved locally.", application: result.application });
  } catch (error) {
    console.error("Apply error:", error.message);
    return res.status(500).json({ message: "Unable to submit application. Please try again." });
  }
});

router.get("/mine", requireAuth, async (req, res) => {
  try {
    if (mongoReady()) {
      const applications = await Application.find({ student: req.userId }).populate("job").sort({ createdAt: -1 });
      return res.json(applications);
    }
    return res.json(localStore.listApplicationsForStudent(req.userId));
  } catch (error) {
    console.error("Applications error:", error.message);
    return res.status(500).json({ message: "Unable to fetch your applications." });
  }
});

module.exports = router;
