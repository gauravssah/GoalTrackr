# GoalTrackr

## 1. Project Overview

Project Name: GoalTrackr  
Live URL: https://goaltrackr-theta.vercel.app  
GitHub Repo: https://github.com/gauravssah/GoalTrackr  
Author LinkedIn: https://www.linkedin.com/in/gauravssah

Description (VERY IMPORTANT):  
GoalTrackr is a full-stack productivity platform for managing tasks, goals, planning, and personal reflection in one place.  
It helps users move from planning to execution through dedicated pages for daily work, long-term goals, and progress tracking.  
The app includes secure authentication, profile management, and protected user-specific data handling.  
It also supports career productivity through a job application tracker and writing habits through journal/reflection modules.  
A global search workflow makes navigation across features easier and reduces context switching between tools.  
The system is built as a monorepo using Next.js on the frontend and Express + MongoDB on the backend.

## 2. Table of Contents

- [Introduction](#3-introduction)
- [Problem Statement](#4-problem-statement)
- [Objectives](#5-objectives)
- [Core Features](#6-core-features)
- [System Architecture](#7-system-architecture)
- [Database Schema Overview](#8-database-schema-overview)
- [API Endpoints Overview](#9-api-endpoints-overview)
- [Authentication Flow](#10-authentication-flow)
- [Tech Stack](#11-tech-stack)
- [Folder Structure](#12-folder-structure)
- [Installation Steps](#13-installation-steps)
- [Environment Variables](#14-environment-variables)
- [Deployment Guide](#15-deployment-guide)
- [Future Scope](#16-future-scope)
- [Conclusion](#17-conclusion)

## 3. Introduction

GoalTrackr centralizes productivity workflows that are usually spread across multiple apps. It provides a single place to manage tasks, plan timelines, track goals, log reflections, and monitor career efforts. The application is designed for students, professionals, and self-improvement-focused users who want structure, consistency, and visibility into progress.

## 4. Problem Statement

Most people use separate tools for tasks, notes, planning, and job tracking, which creates fragmentation and frequent context switching. This disconnect often leads to poor follow-through and limited long-term visibility. GoalTrackr solves this by combining planning, execution, and reflection into one unified, user-centric platform.

## 5. Objectives

- Provide one integrated workspace for personal productivity and growth.
- Improve execution with task tracking and today-priority workflows.
- Support short-term and long-term planning through structured modules.
- Enable reflective habits with journaling and daily reflection tools.
- Offer secure authentication and profile management for each user.

## 6. Core Features

- JWT-based user authentication (signup, login, protected routes).
- Forgot-password and reset-password flow via email token.
- Task creation, updates, filtering, and status-based organization.
- Goal and planner support for daily to yearly productivity planning.
- Job application tracking for career growth workflows.
- Journal and reflection modules for habit building and self-review.
- Dashboard insights and search support for fast data access.

## 7. System Architecture

GoalTrackr follows a client-server monorepo architecture:

- Frontend: Next.js application (React + TypeScript) for UI and route handling.
- Backend: Express.js API for auth, validation, and business logic.
- Database: MongoDB with Mongoose models for domain entities.
- Communication: Frontend consumes REST endpoints exposed by the backend.
- Deployment: Frontend and backend are deployed separately.

## 8. Database Schema Overview

Key backend models include:

- `user.model.js`: account identity, credentials, and profile fields.
- `task.model.js`: tasks, due dates, status, and completion metadata.
- `goal.model.js`: structured planning and measurable goal tracking.
- `job-application.model.js`: company, role, stage, and timeline entries.
- `blog.model.js`: journal/blog-style entries.
- `reflection.model.js` and `daily-survey.model.js`: end-of-day reflection data.
- `productivity-stats.model.js`: analytics-oriented aggregated productivity signals.

## 9. API Endpoints Overview

Representative endpoints:

- `GET /api/health`: service health status.
- `POST /api/auth/signup`: create new user account.
- `POST /api/auth/login`: authenticate user and issue JWT.
- `POST /api/auth/forgot-password`: generate reset token and send email.
- `POST /api/auth/reset-password/:token`: update password using valid token.
- `GET /api/auth/profile`: get authenticated user profile.
- `PATCH /api/auth/profile`: update authenticated user profile.

Domain-specific resource routes are managed through reusable resource controller and router layers.

## 10. Authentication Flow

1. User signs up or logs in through auth routes.
2. Backend validates payload and issues JWT on success.
3. Frontend stores token and includes it in protected API requests.
4. Auth middleware verifies token before protected controller access.
5. Password reset flow uses token generation, email delivery, and token validation.

## 11. Tech Stack

Frontend:

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Zustand
- React Hook Form
- Axios

Backend:

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Zod
- Nodemailer

## 12. Folder Structure

Top-level:

- `Frontend/`: Next.js application.
- `Backend/`: Express API service.
- `README.md`: project documentation.

Frontend key folders:

- `app/`: route-based pages and layouts.
- `components/`: reusable UI and feature components.
- `lib/`: API integrations and utility functions.
- `store/`: Zustand state management.
- `types/`: shared TypeScript types.

Backend key folders:

- `config/`: environment and database setup.
- `controllers/`: request handling logic.
- `middleware/`: auth, validation, and global error handling.
- `models/`: Mongoose schema/model definitions.
- `routes/`: API route declarations.
- `services/`: business-level utilities and analytics logic.
- `validators/`: request schemas and validation logic.

## 13. Installation Steps

1. Clone repository:

```bash
git clone https://github.com/gauravssah/GoalTrackr.git
cd GoalTrackr
```

2. Install backend dependencies:

```bash
cd Backend
npm install
```

3. Install frontend dependencies:

```bash
cd ../Frontend
npm install
```

4. Run backend (Terminal 1):

```bash
cd Backend
npm run dev
```

5. Run frontend (Terminal 2):

```bash
cd Frontend
npm run dev
```

## 14. Environment Variables

Backend `.env`:

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

Frontend `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://goaltrackr-server.vercel.app/api
```

## 15. Deployment Guide

Frontend deployment (Vercel):

- Set root directory to `Frontend`.
- Configure `NEXT_PUBLIC_API_URL`.
- Deploy and verify route rendering and API integration.

Backend deployment (Vercel):

- Set root directory to `Backend`.
- Configure `CLIENT_URL`, `JWT_SECRET`, `MONGO_URI`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`.
- Verify health route: `https://goaltrackr-server.vercel.app/api/health`.

Post-deployment checks:

- Confirm database connectivity from deployed backend.
- Confirm reset-password email delivery works.
- Confirm frontend points to correct deployed backend URL.

## 16. Future Scope

- Add reminders, notifications, and calendar sync support.
- Introduce collaboration features (shared goals/tasks).
- Expand analytics with richer productivity trend insights.
- Provide AI-assisted planning and prioritization helpers.
- Add mobile-first or native app support.

## 17. Conclusion

GoalTrackr provides a scalable and practical foundation for unified productivity management. By combining planning, execution, and reflection workflows in one application, it reduces context switching and improves user consistency. Its monorepo architecture and modular structure make future expansion straightforward.
