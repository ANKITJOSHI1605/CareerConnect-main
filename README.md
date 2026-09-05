# CareerConnect - Smart Internship & Placement System

A comprehensive web-based platform for managing internships and placement opportunities for students, companies, and administrators.

## 🚀 Features

### For Students
- User registration and login
- Browse and apply for internships/jobs
- Upload resumes
- Track application status
- View application history
- Profile management

### For Companies
- Company registration and login
- Post new job/internship openings
- Manage and review student applications
- Schedule interviews
- Edit or remove job posts

### For Administrators
- Manage student and company accounts
- View all job postings and applications
- Monitor platform activities
- System oversight

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 20 or newer
- PostgreSQL 14 or newer
- Web browser

### Local setup

```bash
git clone https://github.com/ANKITJOSHI1605/CareerConnect-main.git
cd CareerConnect-main
cp .env.example .env
npm install
npm start
```

Open `http://localhost:5001`. The Express service hosts both the frontend and API, avoiding production URL mismatches.

## Configuration

| Variable | Purpose |
| --- | --- |
| `PORT` | Web-service port |
| `DATABASE_URL` | PostgreSQL connection URL |
| `DB_SSL` | Set `false` only for a local PostgreSQL server without TLS |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Optional administrator bootstrap credentials |
| `CORS_ORIGINS` | Comma-separated additional frontend origins |
| `UPLOAD_DIR` | Persistent upload directory |

## Deploy on Render

1. Create a Render Node web service from this repository.
2. Use `npm install` as the build command and `npm start` as the start command.
3. Add `DATABASE_URL` privately in Render. The application creates isolated `career_*` tables automatically, so it can safely share a database instance with other projects.
4. Optionally add `ADMIN_EMAIL` and `ADMIN_PASSWORD` (minimum 10 characters), then set the health check to `/api/health`.
5. Attach a persistent disk and set `UPLOAD_DIR` to its mount path if résumés must survive redeployments.

The application validates uploads, hashes new passwords with bcrypt, supports legacy-password migration, uses a pooled database connection, and provides a database-aware health endpoint.
