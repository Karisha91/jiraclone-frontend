Jira Clone
A full-stack project management application inspired by Jira, built from scratch with Spring Boot and React + TypeScript.
🔗 Live Demo: jiraclone-frontend.vercel.app

Testing credentials:

username: testuser

password: password123

Screenshots

<img width="1106" height="575" alt="image" src="https://github.com/user-attachments/assets/430a2d17-cca5-485a-934b-6f728d835dca" />

<img width="606" height="573" alt="image" src="https://github.com/user-attachments/assets/e5d4c6d7-edc0-4c71-979c-c476c2a80923" />

<img width="708" height="915" alt="image" src="https://github.com/user-attachments/assets/
303fd41b-de7c-40ba-9e93-9da369322fb2" />

<img width="603" height="887" alt="image" src="https://github.com/user-attachments/assets/8c070809-6cc7-4424-a508-2247c65a36ad" />

Tech Stack
Backend

Java 21
Spring Boot 3.5
Spring Security + JWT Authentication
PostgreSQL
Hibernate / JPA
Docker (containerized with multi-stage Dockerfile)
Render (deployment)

Frontend

React 18 + TypeScript
Vite
React Router
CSS (custom dark theme)
Vercel (deployment)

Database

Neon PostgreSQL (production)
Docker PostgreSQL container (local development)

Testing

JUnit 5
Mockito
27 passing unit tests (AAA pattern)


Features

JWT Authentication (Login / Register)

Protected Routes

Projects — Create, view, delete

Issues — Create, view, edit, delete with status and priority badges

Filter issues by status and priority

Comments — Add and delete comments on issues

Dashboard with live stats (total projects, issues by status)

Fully deployed and production ready


Repositories

Frontend: github.com/Karisha91/jiraclone-frontend

Backend: github.com/Karisha91/jiraclone


Running Locally with Docker 🐳

The easiest way to run the backend locally is with Docker. No need to install Java, Maven or PostgreSQL.

Prerequisites: Docker Desktop installed and running.

bashgit clone https://github.com/Karisha91/jiraclone

cd jiraclone

docker-compose up --build

Backend will be available at http://localhost:8080.


Frontend

bashgit clone https://github.com/Karisha91/jiraclone-frontend

cd jiraclone-frontend

npm install

# Create .env file with VITE_API_URL=http://localhost:8080

npm run dev


Running Locally without Docker

bashgit clone https://github.com/Karisha91/jiraclone

cd jiraclone

# Set up PostgreSQL and update application.properties

./mvnw spring-boot:run

Architecture

Backend — Dockerized Spring Boot app deployed on Render

Database — Neon PostgreSQL (production) / Docker container (local)

Frontend — React + TypeScript deployed on Vercel


Author

Ivan — Career changer from retail management to full-stack development.

Self-taught, 9 months of coding experience.

GitHub: github.com/Karisha91