# GoalTrackr

GoalTrackr is a production-ready full stack productivity platform for planning tasks, tracking goals, managing job applications, writing daily reflections, and analyzing personal performance with rich dashboards.

## Stack

- Frontend: Next.js 14 App Router, TypeScript, Tailwind CSS, Zustand, Recharts, Framer Motion
- Backend: Node.js, Express.js, MongoDB Atlas, Mongoose, JWT, bcrypt
- Security: Helmet, rate limiting, validation, Mongo sanitization, protected routes

## Project structure

```text
Task Manager/
|-- Frontend/
|   |-- app/
|   |-- components/
|   |-- lib/
|   |-- store/
|   |-- types/
|-- Backend/
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- middleware/
|   |   |-- models/
|   |   |-- routes/
|   |   |-- services/
|   |   |-- utils/
|   |   |-- validators/
```

## Core modules

- Authentication: signup, login, profile, JWT handling
- Tasks: create, list, update, delete, priority/status filtering
- Planning: daily, weekly, monthly, yearly goal tracking
- Analytics: task metrics, productivity scoring, satisfaction tracking, distraction analysis
- Job tracker: application pipeline with status and reminders
- Journal + survey: daily reflections and structured end-of-day review
- Global search: cross-resource lookup for tasks, blogs, and job applications

## Local setup

### Frontend

```bash
cd Frontend
cp .env.example .env.local
npm install
npm run dev
```

### Backend

```bash
cd Backend
cp .env.example .env
npm install
npm run dev
```

## Deployment

### Vercel

- Import the `Frontend` directory as a Next.js project.
- Set `NEXT_PUBLIC_API_URL` to your deployed backend URL with `/api`.

### Render or Railway

- Import the `Backend` directory as a Node project.
- Build command: `npm install`
- Start command: `npm start`
- Configure `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, and `NODE_ENV=production`

### MongoDB Atlas

- Create a cluster and database user.
- Add your deployment IP access or allow access from trusted environments.
- Update `MONGO_URI` in the backend environment settings.

## Notes

- The frontend currently ships with demo hydration for immediate UI preview and can be swapped to live API calls through `Frontend/lib/api.ts`.
- Do not commit the real MongoDB connection string or JWT secret to source control.
