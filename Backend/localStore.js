// Persistent local fallback for development when MongoDB is not configured.
// Passwords are stored only as bcrypt hashes. Runtime data is written to
// Backend/data/campusconnect.json and is excluded from Git by .gitignore.
const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");

const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "campusconnect.json");

const initialJobs = [
  {
    _id: "demo-job-1", company: "Northstar Digital", title: "Frontend Developer Intern",
    location: "Remote", type: "INTERNSHIP", skills: ["React", "JavaScript", "CSS"],
    description: "Help build responsive product experiences and learn from an engineering team.", salary: "₹15,000–₹25,000 / month"
  },
  {
    _id: "demo-job-2", company: "BrightPath Labs", title: "Node.js Developer Intern",
    location: "Noida, India", type: "INTERNSHIP", skills: ["Node.js", "Express", "REST APIs"],
    description: "Work on backend routes, data models, and integrations for web applications.", salary: "₹18,000–₹28,000 / month"
  },
  {
    _id: "demo-job-3", company: "Orbit Software", title: "Junior Software Engineer",
    location: "Bengaluru, India", type: "ENTRY LEVEL", skills: ["JavaScript", "Git", "Problem Solving"],
    description: "Collaborate with product and engineering teammates to ship reliable features.", salary: "₹5–8 LPA"
  },
  {
    _id: "demo-job-4", company: "PixelCraft Studio", title: "Web Development Trainee",
    location: "Hybrid", type: "TRAINEE", skills: ["HTML", "CSS", "React"],
    description: "Build accessible pages and reusable interface components while learning best practices.", salary: "₹12,000–₹20,000 / month"
  }
];

function emptyState() {
  return { users: [], jobs: initialJobs.map(job => ({ ...job, skills: [...job.skills] })), applications: [] };
}

function writeState(state) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tempFile = `${DATA_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(state, null, 2), "utf8");
  fs.renameSync(tempFile, DATA_FILE);
}

function readState() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    const fresh = emptyState();
    writeState(fresh);
    return fresh;
  }

  let state;
  try {
    state = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch (error) {
    throw new Error(`Could not read local data file ${DATA_FILE}: ${error.message}`);
  }

  state.users = Array.isArray(state.users) ? state.users : [];
  state.jobs = Array.isArray(state.jobs) ? state.jobs : [];
  state.applications = Array.isArray(state.applications) ? state.applications : [];
  if (state.jobs.length === 0) {
    state.jobs = emptyState().jobs;
    writeState(state);
  }
  return state;
}

function listJobs() {
  return readState().jobs;
}

function findJobById(jobId) {
  return readState().jobs.find(job => String(job._id) === String(jobId)) || null;
}

function findUserByEmail(email) {
  const normalized = String(email || "").trim().toLowerCase();
  return readState().users.find(user => user.email === normalized) || null;
}

function createUser({ name, email, password }) {
  const state = readState();
  const normalized = String(email || "").trim().toLowerCase();
  if (state.users.some(user => user.email === normalized)) return null;
  const user = {
    id: `local-user-${randomUUID()}`,
    name: String(name || "").trim(),
    email: normalized,
    password, // already bcrypt-hashed by the auth route
    skills: [],
    projects: [],
    createdAt: new Date().toISOString()
  };
  state.users.push(user);
  writeState(state);
  return user;
}

function findApplication(studentId, jobId) {
  const state = readState();
  return state.applications.find(app => String(app.studentId) === String(studentId) && String(app.jobId) === String(jobId)) || null;
}

function createApplication({ studentId, jobId }) {
  const state = readState();
  const job = state.jobs.find(item => String(item._id) === String(jobId));
  if (!job) return { error: "job-not-found" };
  const existing = state.applications.find(app => String(app.studentId) === String(studentId) && String(app.jobId) === String(jobId));
  if (existing) return { error: "already-applied" };

  const now = new Date().toISOString();
  const application = {
    _id: `local-application-${randomUUID()}`,
    studentId: String(studentId),
    jobId: String(jobId),
    status: "Applied",
    createdAt: now,
    updatedAt: now
  };
  state.applications.push(application);
  writeState(state);
  return { application: { ...application, student: application.studentId, job } };
}

function listApplicationsForStudent(studentId) {
  const state = readState();
  return state.applications
    .filter(app => String(app.studentId) === String(studentId))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(app => ({
      _id: app._id,
      student: app.studentId,
      job: state.jobs.find(job => String(job._id) === String(app.jobId)) || null,
      status: app.status,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt
    }));
}

function getStorageFilePath() {
  return DATA_FILE;
}

function getSnapshot() {
  return readState();
}

module.exports = {
  listJobs,
  findJobById,
  findUserByEmail,
  createUser,
  findApplication,
  createApplication,
  listApplicationsForStudent,
  getStorageFilePath,
  getSnapshot
};
