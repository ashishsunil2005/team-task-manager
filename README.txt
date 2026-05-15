Project Name: Team Task Manager

Live Application URL: [paste Railway URL here]
GitHub Repository Link: [paste GitHub link here]

Demo Credentials:
Admin Demo Login:
Email: admin@example.com
Password: Admin123!

Member Demo Login:
Email: member@example.com
Password: Member123!

Feature Summary:
A full-stack team task management application supporting Role-Based Access Control. Admins can create projects, assign team members, and delegate tasks. Members can view their assigned tasks and update their progress. The dashboard provides an overview of completed and overdue tasks with real-time project progress calculation. Features full JWT authentication, protected routes, and a responsive Tailwind UI.

Tech Stack:
- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express
- Database: PostgreSQL, Prisma ORM
- Deployment: Monorepo architecture configured for Railway

Setup Instructions Summary:
1. Run `npm install` in the root folder.
2. Set up local Postgres and add `DATABASE_URL` to backend/.env.
3. Run `npx prisma db push` and `npm run seed` in the backend folder.
4. Run `npm run dev` in the root folder to start both frontend and backend.
