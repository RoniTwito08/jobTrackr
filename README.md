🚀 JobTrackr
JobTrackr is a full-stack job application tracker that helps job seekers organize, manage, and monitor their job applications in one centralized platform.

The goal of the system is to help job seekers stay organized during their job search, track application status, and gain insights into their progress without manual spreadsheet management.

✨ Key Features
📋 Add and manage job applications
🔍 Search applications by company name
📊 Track application status (applied, pending, interview, accepted, rejected)
🧮 View progress statistics and metrics
🔗 Duplicate application checker by URL
📄 Pagination for easy navigation through applications
🔐 Secure authentication with JWT tokens
🌐 Google OAuth sign-in support
🔄 Refresh token mechanism for session persistence
💪 Strong password validation requirements

🧩 System Overview
User registers with email and password or signs in with Google
Dashboard displays job applications and progress metrics
User can add new job applications with company name and URL
System tracks application status and interview progress
Search and filter applications by company name
View detailed statistics on applications, interviews, and outcomes
Duplicate detection prevents duplicate applications for the same job URL
Automatic session refresh keeps user logged in

🧱 Tech Stack
Frontend

React 18
TypeScript
Vite (Build tool)
React Router v6
Axios with JWT interceptors
@react-oauth/google (Google Sign-In)
CSS Modules with glassmorphic design
Netlify (Deployed)

Backend

Node.js
Express.js
TypeScript
MongoDB + Mongoose ODM
JWT Authentication with Refresh Tokens
Google Auth Library for OAuth 2.0
Zod for schema validation
Render (Deployed)

Database

MongoDB Atlas (Cloud database)

Integrations

Google OAuth 2.0 (Social authentication)

🎯 What This Project Demonstrates
Full-stack MERN application development
JWT-based authentication and token refresh mechanisms
OAuth 2.0 integration with Google
RESTful API design with proper error handling
MongoDB schema design and aggregation
Frontend state management and API integration
Responsive UI with modern CSS techniques (glassmorphism)
Production deployment workflow (Render + Netlify + MongoDB Atlas)
Environment variable management and secrets security
TypeScript for type safety across full stack

📌 Status
This project is fully functional and deployed to production. Active features include user authentication, job application management, search, and analytics.

Live Demo
🌐 Frontend: https://thejobtrackr.netlify.app
⚙️ Backend API: https://jobtrackr-api-rldd.onrender.com

🧪 How to Run Locally

Prerequisites
Node.js 20+
MongoDB (local or Atlas connection string)
Google OAuth credentials (optional, for Google sign-in)

Clone the repository
```bash
git clone https://github.com/RoniTwito08/jobTrackr.git
cd jobTrackr
```

Setup Backend
```bash
cd server
npm install
```

Create a `.env` file in the server folder:
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/jobTrackr
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=1h
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
BASE_URL=http://localhost:5173
FRONTEND_URL=http://localhost:5173
```

Run the backend:
```bash
npm run dev
```

Setup Frontend
```bash
cd client
npm install
```

Create a `.env.development` file in the client folder (optional, defaults to localhost):
```
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

Run the frontend:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

📂 Project Structure
```
jobTrackr/
├── client/                 # React frontend
│   ├── src/
│   │   ├── auth/          # Authentication pages (Login, Register)
│   │   ├── pages/         # Main dashboard page
│   │   ├── components/    # Reusable components
│   │   ├── api/           # Axios configuration
│   │   └── assets/        # Images and assets
│   └── vite.config.ts
├── server/                # Express backend
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── services/      # Business logic
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API routes
│   │   ├── middlewares/   # Auth and CORS
│   │   ├── validators/    # Zod schemas
│   │   └── utils/         # Helper functions
│   └── package.json
└── README.md
```

🔑 API Endpoints

Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/google` - Google OAuth login
- `GET /auth/me` - Get current user
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user

Job Applications
- `GET /jobs` - Get all user applications
- `POST /jobs` - Create new application
- `PUT /jobs/:id` - Update application status
- `DELETE /jobs/:id` - Delete application
- `GET /jobs/check?url=...` - Check if URL already applied

🎨 Design Features
Glassmorphic UI design with modern aesthetics
Responsive layout that works on desktop and mobile
Gradient backgrounds and smooth animations
Real-time search filtering
Intuitive status badges with color coding

📝 License
This project is available on GitHub at https://github.com/RoniTwito08/jobTrackr
