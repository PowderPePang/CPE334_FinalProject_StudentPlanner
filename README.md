# 🎓 Student Event Planner

A web application built with **React (Vite)** and **Firebase (Authentication + Firestore + Hosting)** to help students, lecturers, organizers, and admins manage and join university events.

Key capabilities include authentication, event management, registration, QR check-in, notifications, and role-based access.

---

## 🔗 Repository
GitHub: https://github.com/PowderPePang/CPE334_FinalProject_StudentPlanner.git

## 🌐 Live Demo (Firebase Hosting)
Deployed site: [https://authentication-cookie.web.app/](https://student-planner-v1.web.app/)

---

## 🚀 Features

### 🔐 Authentication & User Profiles
- Email/Password Sign Up + Sign In
- Google Sign-In (OAuth 2.0)
- User profile management (name, profile picture)

### 🎫 Event Discovery & Management
- Students can browse, search, and view event details
- Organizers can create, edit, and delete events
- Event metadata includes title, date/time, location, description, category

### 🧾 Registration & QR Check-In
- Students can register/cancel (based on event constraints)
- QR code generated for check-in
- Attendance tracking (organizer-side)

### 🔔 Notifications
- Registration confirmations and reminders
- (Integration may vary depending on configuration)

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Frontend | React (Vite) |
| Routing | React Router v6 |
| Styling | Bootstrap + CSS |
| Backend / DB | Firebase Firestore |
| Authentication | Firebase Auth (Email/Password, Google OAuth) |
| Hosting | Firebase Hosting |
| E2E Testing | Playwright |

---

## ✅ Prerequisites

- **Node.js** (recommended: 18+)
- **npm** (comes with Node)
- A **Firebase Project** with:
  - Firebase Authentication enabled
  - Firestore Database enabled
  - (Optional) Firebase Storage if your build uses image upload
- (For deployment) **Firebase CLI**
  - Install: `npm install -g firebase-tools`

Optional (for testing):
- Playwright browsers install step (see Testing section)

---

## 📦 Installation

1) Clone repository
```bash
git clone https://github.com/PowderPePang/CPE334_FinalProject_StudentPlanner.git

cd CPE334_FinalProject_StudentPlanner
