HRMS Full Stack Application README
📌 Overview
This is a full-stack Human Resource Management System (HRMS) built using ASP.NET Core Web API and React, with MySQL as the database, enhanced with Redis caching, JWT authentication, and fully containerized using Docker & Docker Compose.

The project demonstrates backend development, full-stack integration, caching strategies, authentication, logging, and DevOps-level deployment practices.
🏗️ Architecture
Frontend (React)
↓
ASP.NET Core Web API (Backend)
↓
MySQL Database
↓
Redis Cache Layer
🐳 Docker Architecture
All services run using Docker Compose:

- API Container → ASP.NET Core Web API
- Frontend Container → React (Nginx served)
- MySQL Container → Database service
- Redis Container → In-memory caching

All services communicate over a shared Docker network.
🚀 Tech Stack
Backend:
- ASP.NET Core Web API (.NET 10)
- Entity Framework Core (Code First)
- MySQL 8
- JWT Authentication
- Role-Based Authorization
- Redis (StackExchange.Redis)
- Serilog Logging

Frontend:
- React.js
- Axios
- JWT Token Handling

DevOps:
- Docker
- Docker Compose
- Nginx
▶️ Running the Project
The project supports:
1. Local Development Mode
2. Docker Mode
1️⃣ Local Development Mode
Requirements:
- .NET SDK 10
- Node.js
- MySQL installed locally
- Docker Desktop running

STEP 1 — Start Redis Container

docker run -d -p 6379:6379 redis

STEP 2 — Set Redis Environment Variable

$env:REDIS_CONNECTION="localhost:6379"

STEP 3 — Run Backend

cd backend
dotnet run

Backend URL:
http://localhost:5299

STEP 4 — Frontend API URL

frontend/src/lib/api.ts

Use:
http://localhost:5299

STEP 5 — Run Frontend

cd frontend
npm install
npm run dev

Frontend URL:
http://localhost:8080
2️⃣ Docker Mode
Run:

docker-compose up --build

Services:
- Frontend → http://localhost:3000
- API → http://localhost:5000
- MySQL → localhost:3307
- Redis → localhost:6379

Frontend API URL should use:
http://localhost:5000
🔥 Redis Configuration Strategy
The backend automatically detects Redis connection using:

Environment.GetEnvironmentVariable("REDIS_CONNECTION")

Local Mode:
localhost:6379

Docker Mode:
redis:6379

This allows the SAME backend codebase to work in both Local and Docker environments without changing source code.
📚 Concepts Demonstrated
- REST API Development
- JWT Authentication
- Redis Caching
- Docker Multi-container Architecture
- Logging & Monitoring
- Full-stack Integration
⚠️ Major Issues Solved
- Redis connection failures
- MySQL readiness issues
- Docker networking problems
- EF Core migration issues
- Port conflicts
- Cache invalidation issues
🎯 Outcome
This project demonstrates a production-style HRMS system with secure authentication, Redis caching, Dockerized deployment, scalable architecture, and real-world DevOps practices.
👨‍💻 Author
Prashant Solanki

.NET Developer | Full Stack Engineer
ASP.NET Core • React • MySQL • Docker • Redis
