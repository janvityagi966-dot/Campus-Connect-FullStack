const express = require("express");
const mongoose = require("mongoose");
const Job = require("../models/Jobs");
const localStore = require("../localStore");

const router = express.Router();
const mongoReady = () => mongoose.connection.readyState === 1;

router.get("/", async (_req, res) => {
  try {
    if (mongoReady()) return res.json(await Job.find().sort({ createdAt: -1 }));
    return res.json(localStore.listJobs());
  } catch (error) {
    console.error("Get jobs error:", error.message);
    return res.status(500).json({ message: "Unable to fetch jobs." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let job;
    if (mongoReady()) {
      if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Job not found." });
      job = await Job.findById(req.params.id);
    } else {
      job = localStore.findJobById(req.params.id);
    }
    if (!job) return res.status(404).json({ message: "Job not found." });
    return res.json(job);
  } catch (error) {
    console.error("Get job error:", error.message);
    return res.status(500).json({ message: "Unable to fetch this job." });
  }
});

router.post("/", async (req, res) => {
  try {
    if (!mongoReady()) {
      return res.status(503).json({ message: "Adding jobs requires MongoDB to be configured. Sample jobs are available locally." });
    }
    const job = await Job.create(req.body);
    return res.status(201).json(job);
  } catch (error) {
    console.error("Create job error:", error.message);
    return res.status(400).json({ message: "Unable to create job. Check the required fields." });
  }
});

module.exports = router;
