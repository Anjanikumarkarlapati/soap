# EduPulse Academy (PS031)

A student information & academic performance management platform built as a
Spring Cloud microservices system with a Next.js frontend.

- **Backend**: Java 17, Spring Boot 3.3.4, Spring Cloud 2023.0.3 (Eureka,
  Gateway, OpenFeign, LoadBalancer), Spring Data JPA, MySQL 8, JWT (jjwt 0.12.6)
- **Frontend**: Next.js 14 (App Router, TypeScript), plain CSS

---

## Architecture

```
                          ┌────────────────────────┐
                          │   Next.js Frontend     │
                          │   http://localhost:3000│
                          └───────────┬────────────┘
                                      │ HTTP (JSON + Bearer JWT)
                                      ▼
                          ┌────────────────────────┐
                          │      API Gateway       │
                          │    http://localhost:8080
                          │  /api/** -> lb://...   │
                          └───────┬────────────────┘
              ┌───────────────┬───┴────────────┬────────────────┐
              ▼               ▼                ▼                ▼
      ┌──────────────┐ ┌─────────────┐ ┌──────────────┐ ┌─────────────┐
      │ AUTH-SERVICE │ │ STUDENT-    │ │ ATTENDANCE-  │ │ RESULT-     │
      │ :8081        │ │ SERVICE     │ │ SERVICE      │ │ SERVICE     │
      │              │ │ :8082       │ │ :8083        │ │ :8084       │
      │ register /   │ │ CRUD /api/  │ │ mark / list /│ │ marks /     │
      │ login (JWT)  │ │ students    │ │ % per student│ │ report card │
      └──────┬───────┘ └──────┬──────┘ └──────┬───────┘ └──────┬──────┘
             │                │               │                │
             ▼                ▼               ▼                ▼
          authdb          studentdb      attendancedb       resultdb
         (MySQL)          (MySQL)        (MySQL)            (MySQL)

      All services register with + discover each other through Eureka:
                          ┌────────────────────────┐
                          │  EUREKA-SERVER :8761   │
                          │  service registry      │
                          └────────────────────────┘

  Inter-service calls (via Eureka load-balanced Feign):
    ATTENDANCE-SERVICE ──► STUDENT-SERVICE    (validate studentId)
    RESULT-SERVICE     ──► STUDENT-SERVICE    (student info for report card)
    RESULT-SERVICE     ──► ATTENDANCE-SERVICE (attendance % for report card)
```

| Service | Module | Port | Database | Purpose |
|---|---|---|---|---|
| Eureka Server | `backend/eureka-server` | 8761 | – | Service registry / dashboard |
| API Gateway | `backend/api-gateway` | 8080 | – | Single entry point, routes `/api/**` |
| Auth Service | `backend/auth-service` | 8081 | `authdb` | Register/login, issues JWT (`role`: ADMIN/FACULTY) |
| Student Service | `backend/student-service` | 8082 | `studentdb` | Student CRUD |
| Attendance Service | `backend/attendance-service` | 8083 | `attendancedb` | Attendance marking + % summary |
| Result Service | `backend/result-service` | 8084 | `resultdb` | Marks, auto letter grade, report card |

Shared JWT secret (HS256) via `JWT_SECRET` (all services must use the same value,
default `eduPulseSuperSecretKeyForJWTSigningMinimum256BitsLongForHS256`).

Roles: `ADMIN` — full access everywhere. `FACULTY` — read-only on students,
can mark attendance and add results (enforced per service).

---

## Run locally (without Docker)

Prerequisites: JDK 17+, Maven 3.8+, MySQL 8.x, Node.js 18+.

1. **Database** — the services create their databases automatically
   (`createDatabaseIfNotExist=true`). Create the app user, or use root:

   ```sql
   CREATE DATABASE IF NOT EXISTS authdb;
   CREATE DATABASE IF NOT EXISTS studentdb;
   CREATE DATABASE IF NOT EXISTS attendancedb;
   CREATE DATABASE IF NOT EXISTS resultdb;
   ```

2. **Build the backend**

   ```bash
   cd backend
   mvn -DskipTests package
   ```

3. **Start in this order** (each in its own terminal)

   ```bash
   # 1. Registry (open http://localhost:8761 to watch services register)
   java -jar eureka-server/target/eureka-server-1.0.0.jar

   # 2. Business services (adjust DB_USER/DB_PASSWORD for your MySQL)
   DB_USER=root DB_PASSWORD=root java -jar auth-service/target/auth-service-1.0.0.jar
   DB_USER=root DB_PASSWORD=root java -jar student-service/target/student-service-1.0.0.jar
   DB_USER=root DB_PASSWORD=root java -jar attendance-service/target/attendance-service-1.0.0.jar
   DB_USER=root DB_PASSWORD=root java -jar result-service/target/result-service-1.0.0.jar

   # 3. Gateway
   java -jar api-gateway/target/api-gateway-1.0.0.jar
   ```

   Environment variables understood by every service:
   `DB_HOST` (default `localhost`), `DB_PORT` (3306), `DB_USER` (root),
   `DB_PASSWORD` (root), `EUREKA_URI` (http://localhost:8761/eureka/),
   `JWT_SECRET` (built-in default).

4. **Frontend**

   ```bash
   cd frontend
   npm install
   # optional: point at a different gateway
   #   echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api" > .env.local
   npm run dev        # http://localhost:3000
   ```

   Log in with an account created via `/api/auth/register` (see below).

---

## Run with Docker Compose

```bash
docker compose up --build
```

That starts MySQL (internal), Eureka, the four services, the gateway and the
frontend. Everything is reachable exactly as above: Eureka dashboard on
<http://localhost:8761>, gateway on <http://localhost:8080>, app on
<http://localhost:3000>. The MySQL container is not published to the host
(port 3306 is commonly taken by a local install) — inspect it with
`docker compose exec mysql mysql -uroot -proot`. A custom JWT secret can be
supplied via the `JWT_SECRET` environment variable.

> Note: `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api` is baked into the
> frontend image at build time (browser → host gateway). If you remap the
> gateway port, rebuild the frontend image with a matching build arg.

---

## API walkthrough (through the gateway)

All requests below go to the gateway at `http://localhost:8080`. `curl -s`
assumes bash (Git Bash / WSL / macOS / Linux).

### 1. Register an ADMIN user and log in

```bash
curl -s -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123","role":"ADMIN"}'

curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
# -> {"token":"eyJ...","username":"admin","role":"ADMIN"}
TOKEN=eyJ...   # copy from the response
```

### 2. Students (ADMIN can write, FACULTY read-only)

```bash
curl -s -X POST http://localhost:8080/api/students \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Ananya Rao","rollNumber":"CS2025001","department":"CSE","semester":3,"email":"ananya@example.edu","phone":"9876543210"}'

curl -s http://localhost:8080/api/students -H "Authorization: Bearer $TOKEN"
curl -s http://localhost:8080/api/students/1 -H "Authorization: Bearer $TOKEN"
curl -s -X PUT http://localhost:8080/api/students/1 \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Ananya R. Rao","rollNumber":"CS2025001","department":"CSE","semester":4,"email":"ananya@example.edu","phone":"9876543210"}'
curl -s -X DELETE http://localhost:8080/api/students/1 -H "Authorization: Bearer $TOKEN"
```

### 3. Attendance

```bash
curl -s -X POST http://localhost:8080/api/attendance \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"studentId":1,"date":"2026-09-01","subject":"Data Structures","status":"PRESENT"}'

curl -s http://localhost:8080/api/attendance/student/1 -H "Authorization: Bearer $TOKEN"
curl -s http://localhost:8080/api/attendance/student/1/summary -H "Authorization: Bearer $TOKEN"
# -> {"studentId":1,"totalClasses":2,"presentCount":1,"percentage":50.0}
```

A nonexistent `studentId` is rejected — attendance-service validates it with a
Feign call to STUDENT-SERVICE (forwarding your `Authorization` header).

### 4. Results & report card

```bash
curl -s -X POST http://localhost:8080/api/results \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"studentId":1,"subject":"Data Structures","marks":82,"semester":3}'
# grade is computed automatically (>=90 A, >=75 B, >=60 C, >=40 D, else F)

curl -s http://localhost:8080/api/results/student/1/report-card -H "Authorization: Bearer $TOKEN"
```

The report card aggregates, over Eureka load-balanced Feign calls:
student profile (STUDENT-SERVICE) + attendance % (ATTENDANCE-SERVICE) + all
marks with grades (RESULT-SERVICE).

---

## E2E test result

Verified end-to-end (services started with `--server.port` overrides on a
machine where the default ports were occupied; routes are port-agnostic):

- all six jars build with `mvn -DskipTests package`
- eureka-server, auth, student, attendance, result services and the gateway
  all start and register in the Eureka dashboard
- register ADMIN → login (JWT) → create student → mark attendance (incl.
  cross-service student validation) → attendance summary % → add result
  (auto grade) → aggregated report card, all through the gateway
- Next.js frontend: `npm run build` passes type-checking; login → dashboard →
  students / attendance / results pages talk to the gateway with the stored JWT
