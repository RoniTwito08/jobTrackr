# 🚀 JobTrackr

**A production-ready full-stack job application tracking platform built with React, TypeScript, Node.js, and MongoDB.**

JobTrackr helps job seekers organize and manage their entire job search from one centralized dashboard — replacing spreadsheets and manual tracking with structured application management, analytics, search, and secure authentication.

🌐 **[Live Demo](https://thejobtrackr.netlify.app)**

## ✨ Key Features

* 📋 **Application Management** — Create, update, and manage job applications.
* 🔄 **Status Tracking** — Track applications through applied, pending, interview, accepted, and rejected stages.
* 📊 **Analytics Dashboard** — View statistics and progress across the job search.
* 🔍 **Search & Filtering** — Quickly find applications by company name.
* 🔗 **Duplicate Detection** — Prevent duplicate applications using job URLs.
* 📄 **Pagination** — Efficiently navigate larger application histories.
* 🔐 **JWT Authentication** — Secure access-token based authentication.
* 🔄 **Refresh Tokens** — Automatically maintain authenticated sessions.
* 🌐 **Google OAuth 2.0** — Sign in using a Google account.
* ✅ **Schema Validation** — Validate incoming data using Zod.

## 🔄 How It Works

```text
Register / Google Sign-In
          ↓
       Dashboard
          ↓
   Add Application
          ↓
Track Application Status
          ↓
 Interviews & Outcomes
          ↓
   Progress Analytics
```

Users can register using email and password or authenticate through Google.

Once authenticated, the dashboard provides a centralized view of applications, their current status, interview progress, and overall job-search statistics.

## 🧱 Tech Stack

### Frontend

* React 18
* TypeScript
* Vite
* React Router
* Axios
* Google OAuth
* CSS Modules

### Backend

* Node.js
* Express
* TypeScript
* Zod

### Database

* MongoDB
* Mongoose
* MongoDB Atlas

### Authentication

* JWT Access Tokens
* Refresh Tokens
* Google OAuth 2.0
* Password validation

### Deployment

* **Frontend:** Netlify
* **Backend:** Render
* **Database:** MongoDB Atlas

## 🏗️ Architecture

JobTrackr follows a full-stack client-server architecture:

```text
React + TypeScript
        ↓
     REST API
        ↓
Node.js + Express
        ↓
 ┌───────────────┬───────────────┐
 ↓               ↓               ↓
MongoDB      JWT Auth       Google OAuth
```

The React frontend communicates with the Express REST API through Axios.

Authentication is handled using short-lived access tokens together with refresh tokens, while Google OAuth provides an alternative authentication flow.

Persistent application and user data is stored in MongoDB.

## 🔐 Authentication Flow

Authentication was designed around access and refresh tokens rather than a single long-lived JWT.

```text
Login / Google OAuth
        ↓
Access Token + Refresh Token
        ↓
Authenticated API Request
        ↓
Access Token Expires
        ↓
Refresh Request
        ↓
New Access Token
        ↓
Original Request Continues
```

Axios interceptors on the frontend handle authenticated requests and token refresh behavior.

This allows users to remain signed in while keeping access tokens short-lived.

## 📊 Application Tracking

Each application can progress through several stages:

```text
Applied
   ↓
Pending
   ↓
Interview
   ↓
Accepted / Rejected
```

The dashboard aggregates application data to provide statistics about the user's job-search progress.

## 🔗 Duplicate Detection

Before creating a new application, JobTrackr can check whether the same job URL has already been added.

```http
GET /jobs/check?url=...
```

This prevents users from accidentally applying to or tracking the same position multiple times.

## 💡 What This Project Demonstrates

JobTrackr goes beyond basic CRUD functionality and demonstrates:

* **Full-stack TypeScript development**
* **RESTful API design**
* **JWT authentication architecture**
* **Refresh-token session management**
* **Google OAuth 2.0 integration**
* **Schema validation with Zod**
* **MongoDB schema design**
* **Frontend/backend integration**
* **API error handling**
* **Production deployment**
* **Environment and secrets management**

The project demonstrates the complete lifecycle of building and deploying a modern full-stack web application.

## 🌐 Deployment

JobTrackr is deployed and publicly accessible.

**Frontend**
[thejobtrackr.netlify.app](https://thejobtrackr.netlify.app)

**Backend API**
[jobtrackr-api-rldd.onrender.com](https://jobtrackr-api-rldd.onrender.com)

> The backend is hosted on Render and may require a short startup period after inactivity.

## 📂 Project Structure

```text
jobTrackr/
├── client/
│   ├── src/
│   │   ├── auth/           # Authentication
│   │   ├── pages/          # Application pages
│   │   ├── components/     # Reusable UI
│   │   ├── api/            # Axios configuration
│   │   └── assets/
│   └── vite.config.ts
│
├── server/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── middlewares/    # Authentication & CORS
│   │   ├── validators/     # Zod schemas
│   │   └── utils/
│   └── package.json
│
└── README.md
```

## 🔑 API Overview

### Authentication

| Method | Endpoint         | Description                |
| ------ | ---------------- | -------------------------- |
| `POST` | `/auth/register` | Register a new user        |
| `POST` | `/auth/login`    | Authenticate a user        |
| `POST` | `/auth/google`   | Authenticate with Google   |
| `GET`  | `/auth/me`       | Get the authenticated user |
| `POST` | `/auth/refresh`  | Refresh an access token    |
| `POST` | `/auth/logout`   | End the current session    |

### Job Applications

| Method   | Endpoint              | Description                     |
| -------- | --------------------- | ------------------------------- |
| `GET`    | `/jobs`               | Get user applications           |
| `POST`   | `/jobs`               | Create an application           |
| `PUT`    | `/jobs/:id`           | Update an application           |
| `DELETE` | `/jobs/:id`           | Delete an application           |
| `GET`    | `/jobs/check?url=...` | Check for duplicate application |

## 🚀 Running Locally

### Prerequisites

* Node.js 20+
* MongoDB or MongoDB Atlas
* Google OAuth credentials *(optional)*

### Clone

```bash
git clone https://github.com/RoniTwito08/jobTrackr.git
cd jobTrackr
```

### Backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/jobTrackr
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

BASE_URL=http://localhost:5173
FRONTEND_URL=http://localhost:5173
```

Start the server:

```bash
npm run dev
```

### Frontend

```bash
cd client
npm install
```

Create `client/.env.development` if needed:

```env
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

Start the application:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## 🎨 UI

The application includes:

* Responsive desktop and mobile layouts
* Glassmorphic interface
* Application status indicators
* Real-time search
* Dashboard statistics
* Smooth UI interactions

## 📌 Status

**Fully functional and deployed.**

The production version includes authentication, Google sign-in, application management, status tracking, duplicate detection, search, and analytics.

---

**Built with React, TypeScript, Node.js, Express and MongoDB.**
