# Jira Clone

A full-stack project management application inspired by Jira, built end-to-end from scratch.

![Java](https://img.shields.io/badge/Java_21-ED8B00?style=flat&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=flat&logo=spring&logoColor=white)
![React](https://img.shields.io/badge/React_18-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![CI](https://img.shields.io/badge/CI-GitHub_Actions-2088FF?style=flat&logo=github-actions&logoColor=white)

🔗 **Live Demo:** [jiraclone-frontend.vercel.app](https://jiraclone-frontend.vercel.app)

```
Testing credentials:
username: testuser
password: password123
```

---

## Screenshots

<img width="1106" alt="Dashboard" src="https://github.com/user-attachments/assets/430a2d17-cca5-485a-934b-6f728d835dca" />
<img width="606" alt="Projects" src="https://github.com/user-attachments/assets/e5d4c6d7-edc0-4c71-979c-c476c2a80923" />
<img width="708" alt="Issues" src="https://github.com/user-attachments/assets/303fd41b-de7c-40ba-9e93-9da369322fb2" />
<img width="603" alt="Issue Detail" src="https://github.com/user-attachments/assets/8c070809-6cc7-4424-a508-2247c65a36ad" />

---

## Tech Stack

### Backend
- Java 21
- Spring Boot 3.5
- Spring Security + JWT Authentication
- PostgreSQL / JPA / Hibernate
- Docker (multi-stage Dockerfile + docker-compose)
- Railway (deployment)

### Frontend
- React 18 + TypeScript
- Vite + React Router
- CSS (custom dark theme)
- Vercel (deployment)

### Database
- Neon PostgreSQL (production)
- Docker PostgreSQL container (local development)

---

## Testing & CI/CD

### Tests — 62 passing across frontend and backend

**Frontend (35 tests)** — React Testing Library + Vitest + MSW
- LoginPage — render, error message, successful login redirect, register link
- RegisterPage — render, error message, successful registration redirect
- DashboardPage — render, welcome message, project/issue counts, status breakdowns
- ProjectsPage — render, loading state, CRUD operations, empty state
- IssuePage — render, issue details, comments CRUD, edit flow
- IssuesPage — render, loading state, CRUD operations, status filtering

**Backend (27 tests)** — JUnit 5 + Mockito (AAA pattern)
- Service layer unit tests with mocked repositories
- Full coverage of business logic across all services

### CI/CD — GitHub Actions
- Automated test runs on every Pull Request
- Branch protection on both repos — direct pushes to main blocked
- Tests must pass before merge is allowed
- Railway auto-deploys backend on merge
- Vercel auto-deploys frontend on merge

---

## Features

- **JWT Authentication** — Login / Register with bcrypt password hashing
- **Protected Routes** — unauthorized users redirected to login
- **Projects** — Create, view, delete projects
- **Issues** — Create, view, edit, delete with status and priority badges
- **Filtering** — Filter issues by status (To Do, In Progress, In Review, Done) and priority (Low, Medium, High, Critical)
- **Comments** — Add and delete comments on issues
- **Dashboard** — Live stats: total projects, total issues, breakdown by status
- **Fully deployed** — both frontend and backend live and production ready

---

## Architecture

```
Frontend (React + TypeScript)  →  Vercel
Backend (Spring Boot)          →  Railway (Dockerized)
Database                       →  Neon PostgreSQL (production)
                               →  Docker container (local dev)
```

---

## Running Locally with Docker 🐳

The easiest way to run the full app locally. No need to install Java, Maven, or PostgreSQL separately.

**Prerequisites:** Docker Desktop installed and running.

```bash
git clone https://github.com/Karisha91/jiraclone
cd jiraclone
docker-compose up --build
```

Backend will be available at `http://localhost:8080`.

```bash
git clone https://github.com/Karisha91/jiraclone-frontend
cd jiraclone-frontend
npm install
# Create .env file: VITE_API_URL=http://localhost:8080
npm run dev
```

---

## Running Locally without Docker

```bash
git clone https://github.com/Karisha91/jiraclone
cd jiraclone
# Set up PostgreSQL and update application.properties
./mvnw spring-boot:run
```

---

## Repositories

- Frontend: [github.com/Karisha91/jiraclone-frontend](https://github.com/Karisha91/jiraclone-frontend)
- Backend: [github.com/Karisha91/jiraclone](https://github.com/Karisha91/jiraclone)

---

## Author

**Ivan Djurdjevic** — Career changer from 14 years of retail management to full-stack development. Self-taught, 9 months of coding experience.

[GitHub](https://github.com/Karisha91) 