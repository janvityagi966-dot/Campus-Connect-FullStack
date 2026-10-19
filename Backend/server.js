const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const Job = require("./models/Jobs");
const User = require("./models/User");
const Application = require("./models/Application");
const localStore = require("./localStore");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true }));
app.use(express.json({ limit: "100kb" }));

app.get("/", (_req, res) => {
  const database = mongoose.connection.readyState === 1 ? "MongoDB" : "Local persistent file storage";
  res.json({ name: "CampusConnect API", status: "running", database });
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/jobs", require("./routes/job"));
app.use("/api/applications", require("./routes/Application"));

// If a user starts with local file storage and later configures MongoDB,
// bring their local users, jobs, and applications across rather than forcing
// them to create accounts all over again.
async function migrateLocalDataToMongo() {
  const local = localStore.getSnapshot();
  const jobIds = new Map();
  const userIds = new Map();

  for (const localJob of local.jobs) {
    let job = await Job.findOne({ title: localJob.title, company: localJob.company });
    if (!job) {
      const { _id, ...jobData } = localJob;
      job = await Job.create(jobData);
    }
    jobIds.set(String(localJob._id), job._id);
  }

  for (const localUser of local.users) {
    let user = await User.findOne({ email: localUser.email });
    if (!user) {
      user = await User.create({
        name: localUser.name,
        email: localUser.email,
        password: localUser.password,
        skills: localUser.skills || [],
        projects: localUser.projects || []
      });
    }
    userIds.set(String(localUser.id), user._id);
  }

  for (const localApplication of local.applications) {
    const student = userIds.get(String(localApplication.studentId));
    const job = jobIds.get(String(localApplication.jobId));
    if (!student || !job) continue;
    const exists = await Application.findOne({ student, job });
    if (!exists) {
      await Application.create({
        student,
        job,
        status: localApplication.status || "Applied",
        createdAt: localApplication.createdAt || new Date(),
        updatedAt: localApplication.updatedAt || new Date()
      });
    }
  }

  if (local.users.length || local.applications.length) {
    console.log(`Migrated ${local.users.length} local user(s) and ${local.applications.length} application(s) into MongoDB where needed.`);
  }
}

async function start() {
  let connectedToMongo = false;
  const mongoUri = process.env.MONGO_URI;

  if (mongoUri && !mongoUri.includes("YOUR_CLUSTER") && !mongoUri.includes("USERNAME:PASSWORD")) {
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
      connectedToMongo = true;

      // Seed sample opportunities if the MongoDB collection is empty.
      const existingJobs = await Job.countDocuments();
      if (existingJobs === 0) {
        await Job.insertMany(localStore.listJobs().map(({ _id, ...job }) => job));
        console.log("Added sample jobs to MongoDB.");
      }

      await migrateLocalDataToMongo();
      console.log("MongoDB connected. Database persistence is enabled.");
    } catch (error) {
      console.warn(`MongoDB unavailable (${error.message}). Falling back to local persistent file storage.`);
      try { await mongoose.disconnect(); } catch { /* no connection to close */ }
      connectedToMongo = false;
    }
  }

  if (!connectedToMongo) {
    localStore.listJobs();
    console.log(`Using local persistent storage: ${localStore.getStorageFilePath()}`);
  }

  app.listen(PORT, () => console.log(`CampusConnect API running at http://localhost:${PORT}`));
}

start().catch(error => {
  console.error("Failed to start CampusConnect API:", error.message);
  process.exit(1);
});
