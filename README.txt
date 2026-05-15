Project Name: Team Task Manager

Live Application URL: https://team-task-manager-production-d873.up.railway.app
GitHub Repository Link: https://github.com/ashishsunil2005/team-task-manager

Demo Credentials:
Admin Demo Login:
Email: admin@example.com
Password: Admin123!

Member Demo Login:
Email: member@example.com
Password: Member123!

Feature Summary:
A full-stack team task management application supporting Role-Based Access Control. Admins can create projects, assign team members, and delegate tasks. Members can view their assigned tasks and update their progress. The dashboard provides an overview of completed and overdue tasks with real-time project progress calculation. Features full JWT authentication, protected routes, project management, task assignment, overdue tracking, and a responsive Tailwind UI.

Tech Stack:
- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express
- Database: PostgreSQL, Prisma ORM
- Deployment: Railway

Setup Instructions Summary:
1. Clone the GitHub repository.
2. Run npm install in the root folder.
3. Set DATABASE_URL, JWT_SECRET, and NODE_ENV in environment variables.
4. Run Prisma database setup using npx prisma db push.
5. Run npm run seed inside the backend folder.
6. Run npm run build and npm start for production.
