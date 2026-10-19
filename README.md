# 🎓 CampusConnect — Full-Stack Student Placement Platform

CampusConnect is a full-stack web application designed to help students explore job opportunities, apply for jobs, and track their application progress through a simple and user-friendly interface.

The project uses React for the frontend, Node.js and Express.js for the backend, and supports MongoDB or persistent JSON-file storage for saving application data.

## ✨ Features

- 🔐 **User Authentication** — Student registration and login.
- 🔒 **Password Security** — Passwords are hashed using bcryptjs.
- 💼 **Job Listings** — Browse available job and internship opportunities.
- 🔎 **Job Search** — Search opportunities by job title, company, location, and skills.
- 📝 **Job Applications** — Apply for jobs after logging in.
- 📊 **Student Dashboard** — View application statistics and recent activity.
- 📋 **Application Tracking** — View submitted applications and their statuses.
- 🛡️ **Protected Routes** — Restrict access to authenticated student pages.
- 💾 **Persistent Storage** — Store data using MongoDB or a local JSON file.
- 📱 **Responsive UI** — A clean interface built with custom CSS.

## 🛠️ Technologies Used

### Frontend
- **HTML5** — Base HTML document structure.
- **CSS3** — Styling, layouts, animations, and responsive design.
- **JavaScript (ES6+)** — Application logic and API communication.
- **React 18** — Component-based user interface.
- **React Router DOM** — Client-side navigation.
- **Vite** — Frontend development server and build tool.

### Backend
- **Node.js** — JavaScript runtime for the server.
- **Express.js** — Backend framework and REST API development.
- **Mongoose** — MongoDB schemas, models, and database operations.
- **bcryptjs** — Secure password hashing.
- **jsonwebtoken (JWT)** — Token-based authentication.
- **CORS** — Cross-origin request handling.
- **dotenv** — Environment variable configuration.

### Data Storage
- **MongoDB** — Database option for storing users, jobs, and applications.
- **JSON File Storage** — Persistent local storage fallback for development.

## 🏗️ Project Architecture

The application follows a frontend-backend architecture.

```text
             Student / User
                   |
                   v
          React Frontend (Vite)
                   |
                   v
             REST API Calls
                   |
                   v
           Node.js + Express
                   |
                   v
          Authentication & Routes
                   |
                   v
         -------------------------
         |                       |
         v                       v
    MongoDB + Mongoose      JSON File Storage
```

The frontend communicates with the backend through HTTP requests. The backend processes requests, validates data, checks authentication where required, and reads or writes data using the configured storage option.

## 📂 Project Structure

```text
CampusConnect-FullStack/
│
├── Frontend/
│   ├── index.html
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── api.js
│       │
│       ├── context/
│       │   └── AuthContext.jsx
│       │
│       ├── components/
│       │   ├── Navbar.jsx
│       │   └── ProtectedRoute.jsx
│       │
│       └── pages/
│           ├── Home.jsx
│           ├── Login.jsx
│           ├── Register.jsx
│           ├── Jobs.jsx
│           ├── Dashboard.jsx
│           └── Applications.jsx
│
├── Backend/
│   ├── server.js
│   ├── localStore.js
│   ├── package.json
│   ├── .env.example
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── job.js
│   │   └── Application.js
│   │
│   ├── middleware/
│   │   └── requireAuth.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Jobs.js
│   │   └── Application.js
│   │
│   └── data/
│       └── .gitkeep
│
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/) — Version 20 or later, as specified in the project documentation.
- npm — Included with Node.js.
- MongoDB Atlas account, if you want to use MongoDB storage.

### Step 1: Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Navigate to the project directory:

```bash
cd CampusConnect-FullStack
```

Replace `<YOUR_GITHUB_REPOSITORY_URL>` with your actual GitHub repository URL.

### Step 2: Install Dependencies

Run the following command from the project root:

```bash
npm install
```

### Step 3: Configure Environment Variables

To configure the backend, create a `.env` file inside the `Backend` directory.

You can copy the example configuration:

```bash
cp Backend/.env.example Backend/.env
```

On Windows, you can also create the file manually.

Configure the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

**Important:** Replace the example values with your own configuration. Never commit real database credentials or JWT secrets to GitHub.

If MongoDB is not configured or the connection fails, the application can use its local JSON-file storage fallback.

### Step 4: Start the Application

From the project root, run:

```bash
npm run dev
```

This command starts the frontend and backend development processes together.

Typical local addresses:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

The actual ports may differ if your environment is configured differently.

### Step 5: Open the Application

Open the frontend URL in your browser.

You can then:

1. Register a new student account.
2. Log in with your credentials.
3. Browse and search job listings.
4. Apply for an opportunity.
5. Open your dashboard.
6. View your submitted applications.

## 🔌 API Endpoints

The backend provides the following REST API endpoints.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Check backend status |
| POST | `/api/auth/register` | Register a student |
| POST | `/api/auth/login` | Log in a student |
| GET | `/api/jobs` | Retrieve job listings |
| GET | `/api/jobs/:id` | Retrieve a specific job |
| POST | `/api/jobs` | Create a job listing |
| POST | `/api/applications` | Submit a job application |
| GET | `/api/applications/mine` | Retrieve the logged-in student's applications |

**Authentication:** The application submission and personal application-list endpoints require a valid JWT bearer token.

Example authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

Note: The current job-creation endpoint does not enforce an admin role, so it should not be treated as a production-ready administrative endpoint.

## 🔐 Authentication and Security

CampusConnect implements basic authentication using the following process:

1. A student registers with their details.
2. The backend hashes the password using bcryptjs.
3. During login, the backend compares the entered password with the stored hash.
4. A successful login returns a signed JWT.
5. The frontend stores the token in browser local storage.
6. API requests include the token in the Authorization header.
7. Protected backend routes verify the token before processing the request.

The frontend also uses protected routes to guide unauthenticated users to the login page.

For production deployment, additional security measures such as strict CORS configuration, rate limiting, stronger validation, secure token handling, and proper authorization should be implemented.

## 🗄️ Data Storage

CampusConnect supports two storage options:

**1. MongoDB with Mongoose**

When MongoDB is configured and connected successfully, the backend uses Mongoose models to manage user accounts, jobs, and applications.

**2. Persistent JSON-file storage**

When MongoDB is not configured or the connection is unavailable, the backend can use a local JSON file for development and demonstration purposes.

The local storage implementation is located in `Backend/localStore.js`, and its runtime data file is created under `Backend/data/`.

The application also includes logic to migrate local data into MongoDB when a database connection becomes available.

## 🧠 Key Concepts Demonstrated

This project demonstrates practical knowledge of:

- Component-based frontend development using React.
- React Hooks and Context API.
- Client-side routing.
- Form handling and validation.
- Asynchronous JavaScript and Fetch API.
- REST API development with Express.js.
- JWT-based authentication and middleware.
- Password hashing using bcryptjs.
- MongoDB schemas and relationships using Mongoose.
- Persistent file-based storage.
- Frontend-backend integration.
- Error handling and loading states.
- Responsive design using CSS.

## 🚀 Future Improvements

Possible enhancements include:

- Employer and administrator roles.
- Secure job creation and management.
- Resume uploads and student profile editing.
- Server-side job search, filtering, and pagination.
- Email notifications for application updates.
- Automated frontend and backend tests.
- Improved production security and deployment.
- Integration with verified, real-world job listings.

## 👩‍💻 Project Purpose

CampusConnect was developed as a full-stack web development project to demonstrate how a modern frontend can communicate with a backend API, authenticate users, and persist application data.

It brings job discovery, job applications, and application tracking together in one platform designed for students.

---

**Built with React, JavaScript, Node.js, Express.js, and MongoDB support.**
