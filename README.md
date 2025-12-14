# 🎓 Student Event Planner

A web application built with **React (Vite)** and **Firebase (Authentication + Firestore + Hosting)** to help students, lecturers, organizers, and admins manage and join university events.

Key capabilities include authentication, event management, registration, QR check-in, notifications, and role-based access.

---

## 🔗 Links

- **GitHub Repository:** [https://github.com/PowderPePang/CPE334_FinalProject_StudentPlanner](https://github.com/PowderPePang/CPE334_FinalProject_StudentPlanner)
- **Live Demo (Firebase Hosting):** [https://student-planner-v1.web.app/](https://student-planner-v1.web.app/)

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

Before running this project, ensure you have the following installed:

- **Node.js** (v18 or higher recommended)
  - Download from: [https://nodejs.org/](https://nodejs.org/)
- **npm** (comes bundled with Node.js)
- **Firebase Project** with:
  - Firebase Authentication enabled (Email/Password + Google Sign-In)
  - Firestore Database created
  - (Optional) Firebase Storage if using image uploads
- **(For Deployment)** Firebase CLI
  - Install globally: `npm install -g firebase-tools`

**Optional (For Testing):**
- Playwright browsers (installation instructions in Testing section)

---

## 📦 Installation

### 1) Clone the Repository

```bash
git clone https://github.com/PowderPePang/CPE334_FinalProject_StudentPlanner.git
cd CPE334_FinalProject_StudentPlanner
```

### 2) Install Dependencies

```bash
npm install
```

**If you encounter an error like "Cannot find module 'firebase'", install Firebase explicitly:**

```bash
npm install firebase
```

---

## ⚙️ Configuration

### 1) Create Firebase Project

In the [Firebase Console](https://console.firebase.google.com/):

1. Create a new Firebase project
2. Enable **Authentication**:
   - Email/Password provider
   - Google Sign-In (OAuth)
3. Create a **Firestore Database** (start in test mode or set up security rules)
4. Add a **Web App** and copy your Firebase configuration values

### 2) Create `.env` File

Create a `.env` file in the project root directory (same level as `package.json`).

**Example `.env` file:**

```bash
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

**⚠️ IMPORTANT:** Do NOT commit `.env` to the repository. Ensure it's listed in `.gitignore`.

### 3) Update `src/firebase.js` (Already Configured)

The project is already set up to use environment variables. Verify that `src/firebase.js` contains:

```javascript
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
```

---

## 🚀 How to Run (Local Development)

### Start the Development Server

```bash
npm run dev
```

**Open your browser and navigate to:**

- **Local URL:** [http://localhost:5173](http://localhost:5173)

The application will hot-reload as you make changes to the code.

---

## 💾 Import DB / Seed Data (Firestore)

This project uses **Firestore (NoSQL)**, so there is no SQL file to import.

**Recommended setup approach:**

1. Use the provided **Test Credentials** (see section below) to log in
2. Use the **Organizer account** to create a few sample events via the UI (so students/admin can test event registration flows)
3. Firestore collections (e.g., `users`, `events`) will be **created automatically** when data is first written through the application

**Note:** Firestore security rules should be configured properly to allow authenticated users to read/write data based on their roles.

---

## 🔑 Test Credentials

Use these pre-configured accounts to test the system immediately:

### 👤 Standard User (Student)
- **Email:** `kevin2@gmail.com`
- **Password:** `kevin2pass`
- **Capabilities:** Browse events, register for events, view QR code, check-in

### 📋 Organizer
- **Email:** `organizertest2@gmail.com`
- **Password:** `organizertest2`
- **Capabilities:** Create, edit, and delete events; manage registrations; view attendance

### 🔧 Admin
- **Email:** `admin@kmutt.ac.th`
- **Password:** `admin123`
- **Capabilities:** Full system access, user management, system-wide configurations

**⚠️ IMPORTANT:**  
These accounts must already exist in **Firebase Authentication** AND have the correct `role` field set in **Firestore** (`users/{uid}.role`).

---

## 🧪 Testing (Playwright E2E)

### Install Playwright Browsers (First Time Only)

```bash
npx playwright install
```

### Run E2E Tests

```bash
npx playwright test
```

### View HTML Test Report

```bash
npx playwright show-report
```

### Test Coverage (Baseline Scenarios)

The following core scenarios are covered:

- ✅ **Welcome page** loads correctly
- ✅ **Register** new user account
- ✅ **Register failure** (email already exists)
- ✅ **Login** with valid credentials
- ✅ **Homepage post-login** (dashboard/search/logout flow)

---

## 🔄 CI/CD (GitHub Actions)

A **GitHub Actions workflow** can be configured to run Playwright tests automatically on:

- Push to `main` / `master` branch
- Pull requests to `main` / `master`

**Typical CI steps include:**

1. Install dependencies (`npm install`)
2. Install Playwright browsers (`npx playwright install`)
3. Run tests (`npx playwright test`)
4. Upload Playwright HTML report as an artifact

**Note:** Deployment is **NOT gated by CI** in this project. Manual deployment via Firebase CLI is used.

---

## 🌐 Deployment (Firebase Hosting)

### Manual Deployment via Firebase CLI

#### 1) Install Firebase CLI

```bash
npm install -g firebase-tools
```

#### 2) Login to Firebase

```bash
firebase login
```

#### 3) Initialize Firebase Hosting

```bash
firebase init
```

**Recommended configuration:**

- Select your Firebase project
- **Hosting public directory:** `dist`
- **Configure as a single-page app** (rewrite all URLs to `/index.html`): **Yes**

#### 4) Build the Project

```bash
npm run build
```

#### 5) Deploy to Firebase Hosting

```bash
firebase deploy
```

Your application will be deployed to:  
`https://<your-project-id>.web.app/`

---

## 📊 Project Status & Known Issues

### ✅ Current Status

- Core **MVP features** are implemented:
  - ✅ Authentication (Email/Password, Google OAuth)
  - ✅ Event management (CRUD operations)
  - ✅ Event registration and cancellation
  - ✅ QR code check-in
  - ✅ Basic notifications
- Some **advanced reporting/analysis features** may be future scope depending on sprint constraints

### ⚠️ Known Issues / Limitations

1. **Firestore Security Rules Complexity**
   - Incorrect role/permissions setup may cause "insufficient permissions" errors
   - **Workaround:** Ensure Firestore rules are properly configured for role-based access

2. **Review Storage Inefficiency**
   - Reviews are currently stored inside the event document as an array
   - This can become inefficient if the number of reviews grows very large
   - **Recommended Improvement:** Migrate to a separate `reviews` collection

3. **Notification Integration**
   - Some notification features may require external tokens/configuration
   - May not be fully enabled in all environments

4. **Google OAuth Redirect URIs**
   - Ensure Firebase Console has correct **Authorized redirect URIs** configured
   - Mismatch can cause OAuth login failures

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is for educational purposes as part of CPE334 coursework.

---

## 📧 Contact

For questions or issues, please contact the project maintainer or open an issue on GitHub.

**Repository:** [https://github.com/PowderPePang/CPE334_FinalProject_StudentPlanner](https://github.com/PowderPePang/CPE334_FinalProject_StudentPlanner)