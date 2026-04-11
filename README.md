# Online Assessment Platform - Backend API

A secure, modular, and high-performance RESTful API built with **Node.js**, **Express**, and **MongoDB**. This backend serves as the engine for the Online Assessment Platform, handling authentication, exam management, and candidate submissions with advanced security features.

---

##  Features

- **RBAC (Role-Based Access Control)**: Strict authorization for `ADMIN` and `USER` (Candidate) roles.
- **Exam Management**: Comprehensive CRUD operations for exams and question sets.
- **Rich Text Support**: Specialized handling for long-form, formatted assessment content.
- **Smart Sanitization**: Integrated `sanitize-html` to prevent XSS attacks while allowing safe rich-text formatting.
- **Submission Tracking**: Real-time attempt history, behavioral tracking (tab switches), and automated grading logic.
- **Security First**: Rate limiting, helmet protection, CORS management, and Zod-based request validation.
- **Pino Logging**: High-performance JSON logging for production monitoring and debugging.

---

##  Tech Stack

- **Framework**: Express.js (v5.1.0)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Zod (Schema-based validation)
- **Security**:
  - `bcrypt`: Password hashing
  - `jsonwebtoken` (JWT): Stateless authentication
  - `helmet`: Security headers
  - `express-rate-limit`: Brute-force protection
  - `sanitize-html`: XSS mitigation for RTF content
- **Logging**: Pino & Pino-HTTP

---

##   Project Structure

```text
src/
├── config/             # App configuration and environment variables
├── errors/             # Custom error handling classes
├── middleware/         # Auth, validation, security, and error middlewares
├── modules/            # Core business logic (Encapsulated Modules)
│   ├── auth/           # Login, registration, and token management
│   ├── exam/           # Exam and question set management
│   ├── submission/     # Candidate attempts and answer processing
│   └── user/           # User profile and constant definitions
├── router/             # Centralized route entries
├── utils/              # Helper functions (token generation, catchAsync, etc.)
├── app.ts              # Express application configuration
└── server.ts           # Server entry point and DB connection
```

---

##  Environment Variables

Create a `.env` file in the root directory and configure the following:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/dbname
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

---

##  Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/iftykhar/onlineAp_backend.git
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run in development mode**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

---

##  API Documentation (Primary Routes)

### Auth Module
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/v1/user/create-user` | Register a new user |
| POST | `/api/v1/auth/login` | Authenticate and get JWT |

### Exam Module
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| POST | `/api/v1/exam` | Admin | Create a new exam |
| GET | `/api/v1/exam/available` | Candidate | List published exams |
| POST | `/api/v1/exam/:id/questions`| Admin | Add questions to exam |

### Submission Module
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| POST | `/api/v1/submission/:examId/submit` | Candidate | Submit exam answers |
| GET | `/api/v1/submission/:examId/my-submission` | Candidate | Get latest attempt |

---

##   Security & Best Practices

- **Strict Validation**: Every entry point is guarded by a Zod schema to ensure input integrity.
- **XSS Prevention**: Question titles and student answers are sanitized before being persisted to the database.
- **Rate Limiting**: Global and login-specific rate limits are applied to prevent DDoS and brute-force attacks.
- **Modular Exports**: Each module is self-contained with its own routes, service, and controller, making the system highly maintainable.
