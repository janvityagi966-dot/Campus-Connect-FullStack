const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  company: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  type: { type: String, default: "ENTRY LEVEL" },
  skills: { type: [String], default: [] },
  description: { type: String, required: true },
  salary: { type: String, default: "Not specified" }
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);
