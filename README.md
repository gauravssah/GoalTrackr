# GoalTrackr

GoalTrackr is a full-stack productivity and life-planning web app for managing daily tasks, multi-level goals, job applications, journals, search, and profile tracking in one workspace.

Live app: `https://goaltrackr-theta.vercel.app`

## Overview

GoalTrackr is built as a monorepo with:

- `Frontend/` for the Next.js app
- `Backend/` for the Express + MongoDB API

The project includes:

- authentication with login and signup
- forgot-password flow with reset link support
- task creation, editing, status updates, and today-task view
- daily, weekly, monthly, and yearly planning
- job application tracking
- journal and end-of-day reflection
- global search across app content
- profile management with avatar support
- analytics-oriented productivity dashboard sections

## Live Links

- Frontend: `https://goaltrackr-theta.vercel.app`
- Backend health check: `https://goaltrackr-server.vercel.app/api/health`

## Tech Stack

### Frontend

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Zustand
- React Hook Form
- Axios
- Lucide React

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT authentication
- Zod validation
- Nodemailer

## Main Features

### Authentication

- user signup
- user login
- JWT-based protected routes
- forgot password using email reset link
- reset password with token validation

### Task Management

- create and edit tasks
- today quick preview
- dedicated today-tasks page
- timer-related task fields
- task status and completion handling

### Planner

- daily planning
- weekly planning
- monthly planning
- yearly planning

### Career and Reflection

- job application tracker
- blog / journal entries
- end-of-day survey

### Productivity Experience

- dashboard sections
- search page
- profile page
- responsive sidebar and mobile navigation

## Project Structure

```text
GoalTrackr/
|- Frontend/
|  |- app/
|  |- components/
|  |- lib/
|  |- store/
|  |- types/
|  |- package.json
|
|- Backend/
|  |- src/
|  |  |- config/
|  |  |- controllers/
|  |  |- middleware/
|  |  |- models/
|  |  |- routes/
|  |  |- utils/
|  |  |- validators/
|  |- package.json
|
|- README.md
```

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/gauravssah/GoalTrackr.git
cd GoalTrackr
```

### 2. Install dependencies

Frontend:

```bash
cd Frontend
npm install
```

Backend:

```bash
cd ../Backend
npm install
```

## Environment Variables

### Backend `.env`

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000,https://goaltrackr-theta.vercel.app
JWT_SECRET=replace-with-a-long-random-secret
MONGO_URI=your-mongodb-connection-string
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-app-password
SMTP_FROM=GoalTrackr <your-email@example.com>
```

### Frontend `.env.local`

```env
NEXT_PUBLIC_API_URL=https://goaltrackr-server.vercel.app/api
```

## Run Locally

### Backend

```bash
cd Backend
npm run dev
```

### Frontend

```bash
cd Frontend
npm run dev
```

Then open:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## Important Routes

### Frontend

- `/`
- `/login`
- `/signup`
- `/forgot-password`
- `/reset-password`
- `/dashboard`
- `/tasks`
- `/tasks/create`
- `/tasks/today`
- `/planner`
- `/jobs`
- `/journal`
- `/search`
- `/profile`

### Backend

- `GET /api/health`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password/:token`
- `GET /api/auth/profile`
- `PATCH /api/auth/profile`

## Deployment Notes

### Frontend

- deployed on Vercel
- root directory: `Frontend`
- required env:
  - `NEXT_PUBLIC_API_URL`

### Backend

- deployed separately on Vercel
- root directory: `Backend`
- required env:
  - `CLIENT_URL`
  - `JWT_SECRET`
  - `MONGO_URI`
  - `SMTP_HOST`
  - `SMTP_PORT`
  - `SMTP_USER`
  - `SMTP_PASS`
  - `SMTP_FROM`

## Notes

- MongoDB Atlas network access must allow your deployed backend to connect.
- The backend uses `MONGO_URI`, not `MONGODB_URI`.
- The forgot-password feature requires working SMTP credentials.
- If deploying fresh, make sure backend and frontend env variables are set before testing auth.

## Author

Gaurav Sah

- GitHub: `https://github.com/gauravssah`
- LinkedIn: `https://www.linkedin.com/in/gauravssah`
