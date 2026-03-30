# Jira Clone

A full-stack project management application inspired by Jira, built from scratch with Spring Boot and React.

🔗 **Live Demo:** [jiraclone-frontend.vercel.app](https://jiraclone-frontend.vercel.app)

---

## Screenshots

> Add screenshots here

---

## Tech Stack

**Backend**
- Java 21
- Spring Boot 3.5
- Spring Security + JWT Authentication
- PostgreSQL
- Hibernate / JPA
- Railway (deployment)

**Frontend**
- React 18
- Vite
- React Router
- CSS (custom dark theme)
- Vercel (deployment)

---

## Features

- JWT Authentication (Login / Register)
- Protected Routes
- Projects — Create, view, delete
- Issues — Create, view, edit, delete with status and priority badges
- Filter issues by status and priority
- Comments — Add and delete comments on issues
- Dashboard with live stats (total projects, issues by status)
- Fully deployed and production ready

---

## Repositories

- Frontend: [github.com/Karisha91/jiraclone-frontend](https://github.com/Karisha91/jiraclone-frontend)
- Backend: [github.com/Karisha91/jiraclone](https://github.com/Karisha91/jiraclone)

---

## Running Locally

**Backend**
```bash
git clone https://github.com/Karisha91/jiraclone
cd jiraclone
# Set up PostgreSQL and update application.properties
./mvnw spring-boot:run
```

**Frontend**
```bash
git clone https://github.com/Karisha91/jiraclone-frontend
cd jiraclone-frontend
npm install
# Create .env file with VITE_API_URL=http://localhost:8080
npm run dev
```

---

## Author

Ivan — Career changer from retail management to full-stack development.
Self-taught, 8 months of coding experience.

- GitHub: [github.com/Karisha91](https://github.com/Karisha91)