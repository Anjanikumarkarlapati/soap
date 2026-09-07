# EduPulse Academy — Home Page with Sylva Hero

> **Integrated Student Information & Academic Performance Management Platform**  
> Built with React + Vite + Sylva Hero (ThreeUI) + Spring Boot Microservices

## 🎯 Overview

EduPulse Academy is a comprehensive educational technology platform featuring:

- ✨ **Sylva Living Green Hero** — Interactive 3D landing page with moss-root scenes, liquid-metal controls, and portal card reveals
- 🏗️ **Microservices Architecture** — Student Service, Attendance Service, Result Service, API Gateway, and Auth Service
- 🔐 **JWT Authentication** — Secure role-based access control (Admin, Faculty, Student)
- 📊 **Real-Time Analytics** — Academic performance tracking, attendance trends, GPA calculations
- 🎨 **Responsive Design** — Works seamlessly on desktop, tablet, and mobile devices
- ⚡ **High Performance** — WebGL-accelerated 3D rendering, optimized API calls, lazy loading

## 📂 Project Structure

```
frontend/
├── public/
│   └── landing-pages/
│       ├── inner-green-3d.html           ← Sylva Hero main document
│       └── inner-green-assets/
│           ├── three.min.js               ← Three.js runtime
│           ├── lexend-latin.woff2         ← Typography
│           ├── card-ethos.jpg             ← Platform overview
│           └── card-ecostove.jpg          ← Analytics dashboard
├── src/
│   ├── components/
│   │   ├── EduPulseHero.jsx               ← Sylva hero wrapper
│   │   ├── LoginModal.jsx                 ← JWT authentication modal
│   │   ├── StudentsModal.jsx              ← Student directory & enrollment
│   │   ├── AttendanceModal.jsx            ← Attendance marking & summary
│   │   ├── GradesModal.jsx                ← Performance transcript & grades
│   │   └── AnalyticsModal.jsx             ← Microservices metrics & live hub
│   ├── api.js                             ← Axios instance with JWT interceptor
│   ├── App.jsx                            ← Main app component
│   ├── main.jsx                           ← React entry point
│   └── index.css                          ← Global styling
├── index.html                             ← HTML entry point
├── package.json                           ← Dependencies
├── vite.config.js                         ← Build configuration
├── SETUP.md                               ← Implementation guide
├── MICROSERVICES_INTEGRATION.md           ← Backend integration
└── README.md                              ← This file
```

## 🚀 Quick Start

### 1. Installation
```bash
cd frontend
npm install
```

### 2. Development Server
```bash
npm run dev
# Runs on: http://localhost:5173
```

### 3. Production Build
```bash
npm run build
npm run preview
```

## 🎮 Interacting with the Hero

### **Dock Navigation Bar**
- **EduPulse Logo** — Navigate to home / close open views
- **Students** — Open Student Information System (CRUD, search, enrollment)
- **Attendance** — View attendance rates & mark daily records
- **Grades** — View aggregated student report card & input marks
- **Login** — Authenticate with ADMIN or FACULTY credentials (demo prefill: `admin` / `admin123`)

### **Interactive 3D Elements**
- **3D Scene** — Pointer parallax tracking across moss-roots, ferns, and pollen drift
- **Explore Platform** — Liquid-metal shader button opening the Student Information System
- **Watch Demo** — Circular liquid-metal button revealing Academic Performance Analytics
- **Portal Cards** — Dual portal parallax cards for "Unified Academic Management" and "Real-Time Analytics"

## 🏗️ Microservices Architecture
- **Eureka Registry**: `http://localhost:8761`
- **API Gateway**: `http://localhost:8080` (routes `/api/**`)
- **Auth Service**: `http://localhost:8081` (MySQL `authdb`)
- **Student Service**: `http://localhost:8082` (MySQL `studentdb`)
- **Attendance Service**: `http://localhost:8083` (MySQL `attendancedb`)
- **Result Service**: `http://localhost:8084` (MySQL `resultdb`)