# 🛠️ RDM-WEB-APP: Advanced Shop Management OS

RDM-WEB-APP is a high-performance, workflow-driven Shop Management System for automotive repair shops. It manages the entire lifecycle of a repair, from digital estimates to final pickup, with real-time notifications, interactive approvals, and proactive sales recovery.

---

## 🚀 Project Overview

This platform manages work orders, jobs, line items, and appointments, with features including:

- **Three-Tier Work Orders:** Work Orders → Jobs → Line Items
- **Multi-Stage Approval:** Internal manager review before customer approval
- **Customer Portal:** SMS/Email links for approving/declining jobs and scheduling
- **Real-Time Notifications:** Red/Yellow/Blue/Grey triage system via WebSockets
- **Sales Recovery:** 20-day automatic follow-ups for declined services
- **Big Board:** Kanban-style dashboard for shop floor tracking

---

## 📂 Folder Structure

```text
RDM-WEB-APP/
├── config/             # Database & environment configuration
├── controllers/        # Route handlers & business logic
├── middleware/         # Authentication, role validation, error handling
├── models/             # Sequelize data models
│   ├── User.js
│   ├── WorkOrder.js
│   ├── Job.js
│   ├── LineItem.js
│   ├── Appointment.js
│   └── Notification.js
├── public/             # Static assets
│   ├── css/
│   └── js/
├── routes/             # Express API route definitions
├── services/           # External services, API calls
├── views/              # Server-rendered templates
├── .env                # Environment variables (secret keys)
├── server.js           # Application entry point, Socket.io setup
├── package.json        # Dependencies & scripts
└── package-lock.json   # Locked dependency versions
⚙️ Tech Stack

Backend: Node.js, Express.js, Sequelize ORM, MySQL
Realtime: Socket.io WebSockets
Frontend: Server-rendered views, vanilla JavaScript, CSS
Authentication: JWT-based for employees and roles

⚠️ Project Architecture Rules (AI & Contributors)

Controllers contain business logic only.

Models define database schema (Sequelize) only.

Routes map endpoints to controllers; no business logic here.

Middleware handles authentication, authorization, and error handling only.

Views are server-rendered templates. No SPA frameworks.

Do not introduce new frameworks without approval.

Maintain the current folder structure.

Real-time notifications must use Socket.io.

Always follow naming conventions in existing files.

Do not modify core models without updating migrations.

🧪 Running the Application

Install dependencies:

npm install

Create .env file (copy .env.example if available).

Start the server:

node server.js

Access the app:

http://localhost:3000
🔧 Database Setup

Ensure MySQL is running.

Configure database connection in config/database.js or .env.

Run Sequelize migrations (if applicable):

npx sequelize db:migrate
📌 Notes for AI Tools

Use the README + folder structure as the source of truth.

Do not deviate from existing architecture or folder structure.

Keep controller, model, and route responsibilities strict.

Always prioritize data integrity when generating or modifying code.

Read the existing files before suggesting changes.

Respect naming conventions and coding patterns in existing code.

{
  "project": "RDM-WEB-APP",
  "description": "High-performance, workflow-driven Shop Management System for automotive repair shops. Manages work orders, jobs, line items, appointments, with real-time notifications, approvals, and sales recovery.",
  "techStack": {
    "backend": ["Node.js", "Express.js", "Sequelize ORM", "MySQL"],
    "realtime": ["Socket.io"],
    "frontend": ["Server-rendered views", "vanilla JavaScript", "CSS"],
    "authentication": ["JWT-based for employees and roles"]
  },
  "folders": [
    {
      "name": "config",
      "role": "Database & environment configuration",
      "aiNotes": "Do not hardcode credentials; use .env variables."
    },
    {
      "name": "controllers",
      "role": "Route handlers & business logic",
      "aiNotes": "Controllers should only contain business logic, not database schema or route definitions."
    },
    {
      "name": "middleware",
      "role": "Authentication, role validation, error handling",
      "aiNotes": "No business logic here; only request processing, auth, and validation."
    },
    {
      "name": "models",
      "role": "Sequelize data models",
      "files": ["User.js", "WorkOrder.js", "Job.js", "LineItem.js", "Appointment.js", "Notification.js"],
      "aiNotes": "Define schema only; do not include business logic."
    },
    {
      "name": "public",
      "role": "Static assets",
      "subfolders": ["css", "js"],
      "aiNotes": "Only place static resources here; do not include dynamic scripts."
    },
    {
      "name": "routes",
      "role": "Express API route definitions",
      "aiNotes": "Map endpoints to controllers only; no heavy logic."
    },
    {
      "name": "services",
      "role": "Reusable helper modules, API calls, WebSocket helpers",
      "aiNotes": "Use for shared logic and integrations; can be used by controllers."
    },
    {
      "name": "views",
      "role": "Server-rendered HTML templates",
      "aiNotes": "Do not mix with API logic; no SPA frameworks."
    }
  ],
  "files": [
    {
      "name": ".env",
      "role": "Environment variables (secret keys)",
      "aiNotes": "Must never be checked into source control with live secrets."
    },
    {
      "name": "server.js",
      "role": "Application entry point; sets up Express server and Socket.io",
      "aiNotes": "Contains startup logic only."
    },
    {
      "name": "package.json",
      "role": "Dependencies and scripts",
      "aiNotes": "Use scripts for running, testing, and building."
    },
    {
      "name": "package-lock.json",
      "role": "Locked dependency versions",
      "aiNotes": "Do not edit manually; ensures reproducible builds."
    }
  ],
  "rules": {
    "architecture": [
      "Controllers only contain business logic",
      "Models only define database schema",
      "Routes only map endpoints to controllers",
      "Middleware only handles auth, validation, error handling",
      "Views are server-rendered templates, no SPA frameworks",
      "Real-time notifications must use Socket.io",
      "Do not introduce new frameworks without approval",
      "Follow naming conventions in existing files",
      "Maintain current folder structure",
      "Do not modify core models without updating migrations"
    ],
    "aiGuidelines": [
      "Use README + folder structure as source of truth",
      "Keep controller, model, and route responsibilities strict",
      "Prioritize data integrity when generating/modifying code",
      "Read existing files before suggesting changes",
      "Respect naming conventions and coding patterns"
    ]
  }
}
