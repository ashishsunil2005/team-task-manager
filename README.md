# Team Task Manager

A full-stack web application designed for teams to manage projects, assign tasks, and track overall progress. Built with Node.js, Express, React, PostgreSQL, and Prisma.

## Features

- **Authentication:** JWT-based login and signup with bcrypt password hashing.
- **Role-Based Access Control:** 
  - **Admin:** Can create projects, manage team members, and assign tasks.
  - **Member:** Can view assigned projects/tasks and update task statuses.
- **Project Management:** Create and manage projects with dedicated team members.
- **Task Management:** Assign tasks with priorities (Low, Medium, High) and statuses (To Do, In Progress, Done). Overdue tasks are flagged automatically.
- **Dashboard:** At-a-glance analytics showing completed tasks, overdue tasks, and project progress bars.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router, Axios, Lucide React
- **Backend:** Node.js, Express, JSON Web Tokens (JWT), bcrypt
- **Database:** PostgreSQL, Prisma ORM
- **Deployment:** Ready for Railway (Monorepo architecture)

## Demo Credentials

You can use the following seeded accounts to test the application:

**Admin Account:**
- Email: `admin@example.com`
- Password: `Admin123!`

**Member Account:**
- Email: `member@example.com`
- Password: `Member123!`

## Local Setup Instructions

### Prerequisites
- Node.js (v16+)
- PostgreSQL server running locally

### 1. Install Dependencies

From the root directory, run:
```bash
npm install
```
*(This will automatically install both frontend and backend dependencies using the postinstall script).*

### 2. Environment Variables

Create a `.env` file in the `backend` folder:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/teamtaskmanager?schema=public"
JWT_SECRET="supersecretjwtkey"
PORT=3000
```

Create a `.env` file in the `frontend` folder:

```env
VITE_API_URL="http://localhost:3000/api"
```

### 3. Database Migration & Seed

Run the following commands in the `backend` directory to setup your database:

```bash
cd backend
npx prisma db push
npm run seed
```

### 4. Running the App

To run both the frontend and backend concurrently in development mode, use the root directory script:

```bash
npm run dev
```
- Frontend will run on `http://localhost:5173`
- Backend will run on `http://localhost:3000`

## API Routes

### Auth
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users (Admin Only)
- `GET /api/users` - Get all users

### Projects
- `GET /api/projects` - Get projects (All for Admin, assigned for Member)
- `GET /api/projects/:id` - Get specific project details
- `POST /api/projects` - Create project (Admin)
- `PUT /api/projects/:id` - Edit project (Admin)
- `DELETE /api/projects/:id` - Delete project (Admin)
- `POST /api/projects/:id/members` - Add team member (Admin)
- `DELETE /api/projects/:id/members/:userId` - Remove team member (Admin)

### Tasks
- `GET /api/tasks` - Get tasks
- `GET /api/tasks/:id` - Get task details
- `POST /api/tasks` - Create task (Admin)
- `PUT /api/tasks/:id` - Update task (Admin)
- `PATCH /api/tasks/:id/status` - Update task status (Assignee or Admin)
- `DELETE /api/tasks/:id` - Delete task (Admin)

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

## Railway Deployment Instructions

This repository is structured as a monorepo specifically optimized for **Railway**. The Node.js backend serves the built static files of the React frontend.

1. **Create a new project on Railway** and provision a **PostgreSQL** database.
2. **Link your GitHub repository** to a new empty Railway service within the project.
3. In the Railway service settings, set the **Root Directory** to `/` (default).
4. **Environment Variables**:
   Add the following variables to your Railway app service:
   - `DATABASE_URL` (Use the internal connection string provided by Railway's Postgres instance)
   - `JWT_SECRET` (Generate a secure random string)
   - `NODE_ENV` = `production`
5. **Build Command**: Railway will automatically use the `npm run build` script defined in the root `package.json`. This script builds both the frontend React app and generates the Prisma client.
6. **Start Command**: Railway will automatically use `npm start` which runs the Express backend.
7. **Database Migration on Deployment**: You can add a custom start command in Railway if you want to auto-migrate, or run `npx prisma db push` and `npm run seed` manually through the Railway CLI or dashboard terminal to populate the initial database.
