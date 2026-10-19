const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  skills: { type: [String], default: [] },
  projects: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
