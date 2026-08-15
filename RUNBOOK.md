# 🚀 CareerMate — Runbook & Client Handoff Guide

Welcome to **CareerMate**, an end-to-end Internship & Placement Tracking System featuring real-time application management, deadline reminders, interactive calendar views, analytics dashboards, and cross-platform mobile support.

---

## 📐 Project Architecture Overview

The repository consists of three decoupled components:

1. **Backend API (`/backend`)**
   - **Tech Stack:** Node.js, Express.js, MongoDB (Mongoose), JWT Auth, Node Cron.
   - **Default Port:** `5000`
   - **Key Features:** RESTful APIs, JWT Authentication, Deadline Scheduler, Database Seeder, Fallback Memory Mode.

2. **Web Frontend (`/frontend`)**
   - **Tech Stack:** React 18, Vite, React Router v6, Lucide React Icons.
   - **Default Port:** `3000`
   - **Key Features:** Landing Page, Interactive Dashboard, Deadline Calendar, Resume/Job Tracker, Modals, Status Badges.

3. **Mobile Application (`/mobile`)**
   - **Tech Stack:** Flutter, Dart, Provider state management, Table Calendar.
   - **Key Features:** Mobile dashboard, deadline calendar, job applications list, cross-platform UI (Android/iOS).

---

## 📋 Prerequisites

Before starting, ensure the following software is installed on your machine:

- **Node.js**: `v18.0.0` or higher ([Download Node.js](https://nodejs.org/))
- **npm**: Included with Node.js
- **MongoDB**: (Optional) Local MongoDB Server running at `mongodb://localhost:27017` or a MongoDB Atlas URI. *Note: If MongoDB is unavailable, the backend includes an operational memory fallback mode for immediate testing.*
- **Flutter SDK**: (Optional - required only for running the mobile app) `v3.0.0+` ([Install Flutter](https://docs.flutter.dev/get-started/install))

---

## ⚡ Quick Start Instructions

Follow these step-by-step instructions to install dependencies and start the applications.

### 1. Backend Setup (`/backend`)

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Create the environment file:
   - Copy `.env.example` to `.env`:
     - **Windows (Command Prompt / PowerShell):**
       ```powershell
       Copy-Item .env.example .env
       ```
     - **Linux / macOS:**
       ```bash
       cp .env.example .env
       ```

4. (Optional) Seed sample data into your database:
   ```bash
   npm run seed
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```
   *The backend server will start at `http://localhost:5000`.*

---

### 2. Web Frontend Setup (`/frontend`)

1. Open a new terminal window and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   [http://localhost:3000](http://localhost:3000)

---

### 3. Mobile Application Setup (`/mobile`)

1. Open a new terminal window and navigate to the `mobile` folder:
   ```bash
   cd mobile
   ```

2. Fetch Flutter packages:
   ```bash
   flutter pub get
   ```

3. Launch on a connected emulator or device:
   ```bash
   flutter run
   ```

---

## ⚙️ Environment Variables Reference

### Backend `.env`

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` | Port for the Express server |
| `MONGO_URI` | `mongodb://localhost:27017/careermate` | MongoDB connection string |
| `JWT_SECRET` | `careermate_super_secret_jwt_key_2026` | Secret key used to sign JWT tokens |
| `NODE_ENV` | `development` | Runtime environment mode |

---

## 📁 Repository Directory Structure

```text
CareerMate/
├── RUNBOOK.md                  # Project setup and client handoff guide
├── backend/
│   ├── .env.example            # Sample backend configuration
│   ├── package.json            # Backend dependencies & scripts
│   └── src/
│       ├── config/             # DB & server configuration
│       ├── controllers/        # Express route handlers
│       ├── middleware/         # Auth & error handling middlewares
│       ├── models/             # Mongoose data schemas
│       ├── routes/             # API routes definition
│       ├── utils/              # Cron scheduler & DB seeder
│       └── server.js           # Server entry point
├── frontend/
│   ├── index.html              # HTML shell
│   ├── package.json            # Frontend dependencies & scripts
│   ├── vite.config.js          # Vite config (Port 3000, Proxy setup)
│   └── src/
│       ├── components/         # Navigation, Modals, Status Badges
│       ├── context/            # Authentication Context
│       └── pages/              # Landing, Dashboard, Calendar, Jobs
└── mobile/
    ├── pubspec.yaml            # Flutter dependencies configuration
    └── lib/                    # Flutter Dart source files
        ├── models/             # Data models
        └── screens/            # Mobile screen layouts
```

---

## 🛠️ Common Commands Cheatsheet

| Path | Task | Command |
| :--- | :--- | :--- |
| `/backend` | Install dependencies | `npm install` |
| `/backend` | Run backend in dev mode | `npm run dev` |
| `/backend` | Seed mock data | `npm run seed` |
| `/frontend` | Install dependencies | `npm install` |
| `/frontend` | Run web dev server | `npm run dev` |
| `/frontend` | Build production bundle | `npm run build` |
| `/mobile` | Install packages | `flutter pub get` |
| `/mobile` | Clean build artifacts | `flutter clean` |
| `/mobile` | Run application | `flutter run` |

---

## 💡 Troubleshooting & FAQs

- **Q: `npm run dev` fails on backend with `Cannot find module ...`**
  - Make sure you run `npm install` inside the `/backend` folder first.
- **Q: MongoDB connection error `connect ECONNREFUSED 127.0.0.1:27017`**
  - If local MongoDB is not started, the backend automatically transitions to Memory Fallback mode so you can continue testing the API. To enable persistence, start your MongoDB service or update `MONGO_URI` in `.env` to a live MongoDB Atlas URI.
- **Q: Frontend cannot connect to backend APIs**
  - Ensure the backend server is running on `http://localhost:5000`. Vite is pre-configured to proxy `/api` requests to port `5000`.

---

*CareerMate — Internship & Placement Tracking System*
