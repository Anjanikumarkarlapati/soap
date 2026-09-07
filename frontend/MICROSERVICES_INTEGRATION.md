# EduPulse Academy — Microservices Integration Guide

## Architecture Overview

```
                           ┌────────────────────────────┐
                           │ React + Vite Frontend      │
                           │ http://localhost:5173      │
                           └─────────────┬──────────────┘
                                         │ HTTP (REST + Bearer JWT)
                                         ▼
                           ┌────────────────────────────┐
                           │      API Gateway           │
                           │   http://localhost:8080    │
                           │   /api/** -> lb://...      │
                           └─────────────┬──────────────┘
               ┌─────────────────┬───────┴────────┬────────────────┐
               ▼                 ▼                ▼                ▼
       ┌───────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
       │ AUTH-SERVICE  │ │ STUDENT-     │ │ ATTENDANCE-  │ │ RESULT-      │
       │ :8081         │ │ SERVICE      │ │ SERVICE      │ │ SERVICE      │
       │               │ │ :8082        │ │ :8083        │ │ :8084        │
       │ /api/auth/**  │ │ /api/students│ │ /api/attend..│ │ /api/results │
       └───────┬───────┘ └───────┬──────┘ └──────┬───────┘ └──────┬───────┘
               │                 │               │                │
               ▼                 ▼               ▼                ▼
            authdb            studentdb      attendancedb      resultdb
           (MySQL)            (MySQL)         (MySQL)          (MySQL)
```

## API Endpoints Used by Frontend

### 1. Authentication (`auth-service` via Gateway)
- `POST /api/auth/register`: Register new ADMIN or FACULTY user.
- `POST /api/auth/login`: Authenticate and receive signed JWT.

### 2. Student Management (`student-service` via Gateway)
- `GET /api/students`: Fetch all enrolled students.
- `GET /api/students/{id}`: Fetch student by ID.
- `POST /api/students`: Enroll new student (Admin only).
- `PUT /api/students/{id}`: Update student details.
- `DELETE /api/students/{id}`: Delete student profile.

### 3. Attendance Tracking (`attendance-service` via Gateway)
- `GET /api/attendance/student/{id}`: Fetch student attendance records.
- `GET /api/attendance/student/{id}/summary`: Aggregated attendance percentage.
- `POST /api/attendance`: Mark attendance record.

### 4. Results & Academic Transcripts (`result-service` via Gateway)
- `GET /api/results/student/{id}/report-card`: Aggregates student demographic info (Student-Service), attendance rate (Attendance-Service), and letter-graded subject marks (Result-Service).
- `POST /api/results`: Record marks for a student and subject.
