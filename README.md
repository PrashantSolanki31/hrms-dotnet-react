# HRMS Full Stack Application (ASP.NET Core + React + MySQL + Docker + Redis)

## 📌 Overview
This is a full-stack **Human Resource Management System (HRMS)** built using **ASP.NET Core Web API** and **React**, with **MySQL as the database**, enhanced with **Redis caching**, **JWT authentication**, and fully containerized using **Docker & Docker Compose**.

The project demonstrates backend development, full-stack integration, caching strategies, authentication, logging, and DevOps-level deployment practices.

---

## 🏗️ Architecture

The system follows a containerized full-stack architecture:


Frontend (React)
↓
ASP.NET Core Web API (Backend)
↓
MySQL Database
↓
Redis Cache Layer


### 🐳 Docker Architecture

All services run using Docker Compose:

- API Container → ASP.NET Core Web API
- Frontend Container → React (Nginx served)
- MySQL Container → Database service
- Redis Container → In-memory caching

All services communicate over a shared Docker network.

---

## 🚀 Tech Stack

### Backend
- ASP.NET Core Web API (.NET 10)
- Entity Framework Core (Code First)
- MySQL 8
- JWT Authentication
- Role-Based Authorization (HR / Employee)
- Redis (StackExchange.Redis)
- Serilog Logging

### Frontend
- React.js
- Axios
- JWT Token Handling (Interceptors)

### DevOps / Infrastructure
- Docker
- Docker Compose
- Multi-container architecture (API + MySQL + Redis + Frontend)
- Nginx (for frontend serving in container setup)

---

## ⚙️ Features

### 🔐 Authentication
- User Registration & Login
- JWT Token Generation
- Role-Based Access Control (HR / Employee)

### 👥 HRMS Modules
- Employee Management
- User Listing (HR-only access)
- Secure API endpoints with authorization

### ⚡ Performance Optimization
- Redis caching implementation:
  - `users:all` → Cached employee list
  - `user:{id}` → Cached logged-in user
- Cache invalidation after updates
- Reduced database load and faster response times

### 📊 Logging
- Login attempts tracking
- Registration logs
- Cache hit/miss logs
- Debug-level API flow tracking (Serilog)

---

## 🐳 Docker Setup

### Run the project

```bash
docker-compose up --build
Services
Service	Description
api	ASP.NET Core Web API
frontend	React application
mysql	MySQL 8 database
redis	Redis cache server
📦 How to Run Locally
1. Clone the repository
git clone https://github.com/your-username/hrms-project.git
cd hrms-project
2. Run with Docker
docker-compose up --build
3. Access applications
Frontend: http://localhost:3000
 (or configured port)
API: http://localhost:5000
🧠 Key Technical Implementations
1. MySQL + EF Core Integration
Code First approach
Automatic migrations on startup
Retry logic for database connection
2. JWT Authentication
Secure token generation
Role-based authorization (HR / Employee)
3. Redis Caching Strategy
Cache-aside pattern implemented
Cache keys:
users:all
user:{userId}
TTL-based expiration
Cache invalidation on data updates
4. Dockerized Infrastructure
Multi-container setup using Docker Compose
Healthcheck for MySQL readiness
Service dependency handling
⚠️ Major Issues Solved
MySQL connection failures → fixed using Docker healthchecks
Port conflicts (3306) → resolved using port mapping (3307)
EF Core migration failures → fixed startup migration execution
API crash (container exit 139) → fixed retry logic
CORS & API routing issues in frontend integration
Cache inconsistency → solved using proper invalidation strategy
📈 Performance Improvements
Before Redis
Every request hit MySQL database
After Redis
Frequently accessed data served from cache
Reduced DB load significantly
Faster API response times
📂 Project Structure
HRMS Project
│
├── Backend (ASP.NET Core Web API)
│   ├── Controllers
│   ├── Services
│   ├── Models
│   ├── Data (EF Core)
│   ├── Auth (JWT)
│
├── Frontend (React)
│   ├── Components
│   ├── Pages
│   ├── Axios API Layer
│
├── Docker
│   ├── docker-compose.yml
│   ├── Dockerfile (API)
│
└── Redis Cache Layer
📚 Concepts Demonstrated
REST API Development
JWT Authentication & Authorization
Redis Caching (Read optimization)
Docker Multi-container Architecture
Microservice-style design approach
Logging & Monitoring (Serilog)
Full-stack integration (React + .NET)
🎯 Outcome

This project demonstrates a production-style HRMS system with:

Secure authentication system
Scalable backend architecture
Performance optimization via caching
Containerized deployment setup
Real-world debugging and DevOps practices
👨‍💻 Author

Prashant Solanki

.NET Developer | Full Stack Engineer
ASP.NET Core • React • MySQL • Docker • Redis

🚀 Future Improvements
CI/CD pipeline (GitHub Actions)
Kubernetes deployment
Cloud deployment (Azure / AWS)
Advanced analytics dashboard
Role-based UI improvements
