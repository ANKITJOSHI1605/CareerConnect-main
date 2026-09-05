# CareerConnect — Smart Internship & Placement System

[![Live Demo](https://img.shields.io/badge/Live_Demo-Open_CareerConnect-635BFF?style=for-the-badge)](https://careerconnect-main.onrender.com)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

CareerConnect is a full-stack recruitment platform that connects students, companies and placement administrators. It supports opportunity publishing, applications, résumé uploads, interview scheduling and role-specific management workflows.

**[Open the live application](https://careerconnect-main.onrender.com)**

> The free Render service may take up to a minute to wake after a period of inactivity.

## What it demonstrates

- Multi-role authentication and authorization
- End-to-end recruitment and placement workflows
- PostgreSQL persistence and connection pooling
- Secure password hashing with bcrypt
- Validated résumé and profile-photo uploads
- Production deployment with health monitoring

## Features

### Students

- Register and sign in
- Browse internships and job opportunities
- Submit applications with a résumé
- Track application progress and history
- Maintain a student profile

### Companies

- Register and sign in as a company
- Publish internships and job openings
- Review student applications
- Schedule interviews
- Edit or remove listings

### Administrators

- Manage students and companies
- Review opportunities and applications
- Monitor platform activity
- Access system-wide administration tools

## Technology

| Layer | Technologies |
| --- | --- |
| Frontend | HTML, CSS and JavaScript |
| Backend | Node.js and Express |
| Database | PostgreSQL |
| Security | bcrypt password hashing, role checks and upload validation |
| Deployment | Render |

## Run locally

### Requirements

- Node.js 20 or newer
- PostgreSQL 14 or newer

```bash
git clone https://github.com/ANKITJOSHI1605/CareerConnect-main.git
cd CareerConnect-main
cp .env.example .env
npm install
npm start
```

Open [http://localhost:5001](http://localhost:5001). The Express application serves both the frontend and API, preventing production URL mismatches.

## Configuration

| Variable | Purpose |
| --- | --- |
| `PORT` | Web-service port |
| `DATABASE_URL` | PostgreSQL connection URL |
| `DB_SSL` | Set to `false` only for a local PostgreSQL server without TLS |
| `ADMIN_EMAIL` | Optional administrator bootstrap email |
| `ADMIN_PASSWORD` | Optional administrator password; minimum 10 characters |
| `CORS_ORIGINS` | Comma-separated list of additional permitted origins |
| `UPLOAD_DIR` | Persistent résumé and profile-upload directory |

Never commit real passwords or database credentials. Store production values in Render's environment-variable settings.

## Test

```bash
npm test
```

The test command validates the primary server, database and frontend JavaScript files.

## Deploy on Render

1. Create a Node web service from this repository.
2. Set the build command to `npm install`.
3. Set the start command to `npm start`.
4. Add `DATABASE_URL` in the service environment.
5. Optionally add `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
6. Set the health-check path to `/api/health`.
7. For persistent résumé storage, attach a disk and set `UPLOAD_DIR` to its mount path.

The application creates isolated `career_*` database tables automatically, allowing it to share a PostgreSQL instance without conflicting with unrelated projects.

## Production endpoints

- Application: [careerconnect-main.onrender.com](https://careerconnect-main.onrender.com)
- Health check: [careerconnect-main.onrender.com/api/health](https://careerconnect-main.onrender.com/api/health)

## License

MIT License.
