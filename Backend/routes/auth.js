const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");
const localStore = require("../localStore");

const router = express.Router();
const mongoReady = () => mongoose.connection.readyState === 1;
const emailKey = email => String(email || "").trim().toLowerCase();
const signToken = userId => jwt.sign(
  { userId: String(userId) },
  process.env.JWT_SECRET || "campusconnect-local-demo-secret",
  { expiresIn: "7d" }
);

router.post("/register", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = emailKey(req.body.email);
    const password = String(req.body.password || "");

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    if (mongoReady()) {
      const existing = await User.findOne({ email });
      if (existing) return res.status(409).json({ message: "An account with this email already exists. Please log in." });
      const user = await User.create({ name, email, password: hashedPassword });
      return res.status(201).json({ message: "Account created successfully. Please log in.", userId: String(user._id) });
    }

    const existing = localStore.findUserByEmail(email);
    if (existing) return res.status(409).json({ message: "An account with this email already exists. Please log in." });
    const user = localStore.createUser({ name, email, password: hashedPassword });
    if (!user) return res.status(409).json({ message: "An account with this email already exists. Please log in." });
    return res.status(201).json({ message: "Account created and saved locally. Please log in.", userId: user.id });
  } catch (error) {
    console.error("Register error:", error.message);
    return res.status(500).json({ message: "Could not create account. Please try again." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = emailKey(req.body.email);
    const password = String(req.body.password || "");
    const user = mongoReady()
      ? await User.findOne({ email })
      : localStore.findUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid email or password. Use the email and password you registered with." });
    }

    const id = String(user._id || user.id);
    return res.json({
      message: "Login successful.",
      token: signToken(id),
      user: { id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ message: "Could not log in. Please try again." });
  }
});

module.exports = router;
