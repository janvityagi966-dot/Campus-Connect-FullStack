# CampusConnect — Full-Stack Student Placement Platform

CampusConnect is a student placement web app for exploring job opportunities and tracking applications. It uses React on the frontend and Node.js/Express REST APIs on the backend. It supports MongoDB Atlas and also has a **persistent local file store** when MongoDB is not configured, so registering a user or applying for a job will not be erased just because the backend restarts.

## Features

- Student registration and login (passwords are stored as bcrypt hashes)
- JWT-based protected application endpoints
- Login session saved in browser local storage
- Student dashboard with application statistics
- Job listings and search
- Apply to a job and prevent duplicate applications
- Persistent application tracking per signed-in student
- MongoDB support when a valid `MONGO_URI` is configured
- Persistent local storage fallback at `Backend/data/campusconnect.json`
- Responsive UI for desktop and mobile

## Requirements

- Node.js 20+ (Node 24 is fine)
- npm
- VS Code
- Optional: MongoDB Atlas account for hosted database storage

## Open the project

1. Download and extract the ZIP.
2. In VS Code, choose **File → Open Folder** and select the top-level `CampusConnect-FullStack` folder.
3. Open a terminal in that root folder.

The root `package.json` uses npm workspaces, so install dependencies once from the project root:

```bash
npm install
```

## Run the whole website with one command

From the project root:

```bash
npm run dev
```

This starts both backend and frontend; Vite should open the website automatically. The frontend usually runs at `http://localhost:5173` and the backend at `http://localhost:5000`.

To stop both servers, focus the terminal and press `Ctrl + C`.

## Data persistence modes

### Option A — Local persistent storage (works immediately)

If `MONGO_URI` is not configured, accounts, jobs, and applications are stored in:

```text
Backend/data/campusconnect.json
```

This data persists through normal backend restarts. Passwords are saved as bcrypt hashes, not plain text. The JSON data file is excluded from Git by `.gitignore`; do not commit it. Back up this file if you need to keep local test data when moving folders or computers.

### Option B — MongoDB Atlas

1. Copy `Backend/.env.example` to `Backend/.env`.
2. Put your Atlas connection string in `MONGO_URI` and set a private value for `JWT_SECRET`.
3. Ensure your Atlas database user and network access are configured.
4. Restart `npm run dev`.

Example format (replace the placeholders using your own Atlas values):

```env
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@YOUR_CLUSTER.mongodb.net/CampusConnect
JWT_SECRET=use_a_long_random_secret_here
PORT=5000
```

Do not send database credentials in chat or commit `.env` to GitHub. If you already created local demo accounts before configuring MongoDB, the backend migrates local users, sample jobs, and applications into MongoDB on a successful startup. Log in again after switching storage modes so the browser receives a token for the active database.

## Main API endpoints

| Method | Endpoint | Purpose | Authentication |
|---|---|---|---|
| `GET` | `/` | API health and storage mode | No |
| `POST` | `/api/auth/register` | Create a student account | No |
| `POST` | `/api/auth/login` | Log in and receive a JWT | No |
| `GET` | `/api/jobs` | List opportunities | No |
| `GET` | `/api/jobs/:id` | Get a job | No |
| `POST` | `/api/jobs` | Create a job listing | MongoDB required in this demo setup |
| `POST` | `/api/applications` | Apply for a job | Yes |
| `GET` | `/api/applications/mine` | List the current student's applications | Yes |

## Folder structure

```text
CampusConnect-FullStack/
├── Backend/
│   ├── data/                 # Local JSON database created when run
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── localStore.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   └── index.css
│   ├── index.html
│   └── package.json
├── package.json
└── README.md
```

## Notes

- For the first run after installing this update, register your account once more if your previous account was only held in temporary in-memory mode; that old in-memory record cannot be recovered after the old server process stopped. After this update, local registrations are saved to disk.
- If you log out, use **Log in** with the same email and password; do not register another account each time.
- Sample job listings are demo content, not verified job offers.
- This is a learning project, not production-ready. Before real-world deployment, add stronger rate limiting, deployment secrets, tests, and admin/role authorization.
