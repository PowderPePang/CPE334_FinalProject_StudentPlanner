# 🎓 Student Event Planner

A **web application** built with **React (Vite)**, **Firebase**, and **Bootstrap** that helps students, lecturers, and organizers manage and join university events.  
It includes **authentication**, **event management**, **QR check-in**, and **notification** features for a seamless event experience.

---

## 🔗 Repository

[👉 GitHub Repository](https://github.com/PowderPePang/CPE334_FinalProject_StudentPlanner.git)

---

## 🚀 Features

### 🔐 Authentication
- Sign up and log in using **Email & Password**
- One-click **Google Sign-In** with OAuth 2.0
- Manage and update user profile (name, profile picture)

### 🎫 Event Management
- Organizers can **create, edit, and delete events**
- Students can **search and view events**
- Event details include title, date, time, location, and description

### 🧾 Registration & QR Check-In
- Students can **register for events** and cancel before the event starts  
- Each registration generates a **unique QR code** for check-in  
- Real-time update of attendance status

### 🔔 Notification System
- Receive **registration confirmations**
- **Reminders** before the event starts  
- Notifications via **in-app messages**, **email**, or **LINE Notify**

---

## 🛠️ Tech Stack

| Category | Technology |
|-----------|-------------|
| Frontend | React (Vite) |
| Styling | Bootstrap + CSS |
| Backend | Firebase |
| Authentication | Firebase Auth (Email/Password, Google OAuth) |
| Database | Firebase Firestore |
| Build Tool | Vite |

---

## 🧩 Folder Structure

```
react-firebase-auth/
├── public/
├── src/
│ ├── assets/
│ ├── auth/
│ │ └── ProtectedRoute.jsx
│ ├── components/
│ │ ├── Home.jsx
│ │ ├── Login.jsx
│ │ └── Register.jsx
│ ├── context/
│ │ └── UserAuthContext.jsx
│ ├── App.jsx
│ ├── firebase.js
│ ├── index.css
│ └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## ⚙️ Set up Firebase

1. Create a new project in [Firebase Console](https://console.firebase.google.com)  
2. Enable **Authentication** (Email/Password and Google Sign-In)  
3. Create a **Firestore Database**  
4. Copy your Firebase configuration and paste it into `src/firebase.js`

```js
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
```

## ▶️ Run the project
npm run dev

## 🌐 Open in browser
Visit: http://localhost:5173