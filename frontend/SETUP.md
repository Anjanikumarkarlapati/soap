# EduPulse Academy — Setup & Implementation Guide

## Quick Start (Localhost)

### 1. Backend Microservices
All microservices must be running on localhost:
- **Eureka Registry**: `http://localhost:8761`
- **API Gateway**: `http://localhost:8080` (routes `/api/**`)
- **Auth Service**: `http://localhost:8081` (MySQL `authdb`)
- **Student Service**: `http://localhost:8082` (MySQL `studentdb`)
- **Attendance Service**: `http://localhost:8083` (MySQL `attendancedb`)
- **Result Service**: `http://localhost:8084` (MySQL `resultdb`)

### 2. Frontend Development Server (React + Vite + Sylva Hero)
```bash
cd frontend
npm install
npm run dev
```
The frontend starts on **http://localhost:5173** and proxies `/api` to the Spring Cloud API Gateway on `http://localhost:8080`.

### 3. Default Credentials
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: `ADMIN`

### 4. Interactive 3D Hero Navigation
- **Dock**: Direct navigation to Students, Attendance, Grades, Login.
- **Liquid-Metal Explore**: Direct launch to Student Information System.
- **Liquid-Metal Play**: Opens Academic Performance Analytics.
- **Portal Cards**: Interactive parallax reveals for Platform Overview & Real-Time Analytics.
